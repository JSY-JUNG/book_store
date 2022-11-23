const express = require('express');
const { getOrder, getOrderItems, getBook, getOrderItem } = require('../find');
const { Order, sequelize, Book, OrderItem } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const order = await getOrder(req.user.id); // 주문에 대한 정보를 가져온다.
        const orderItems = await getOrderItems(req.user.id); // 주문했던 도서 정보, 갯수를 가져온다.

        res.render('returnView', { orderItems, order });        
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/all', isLoggedIn, async (req, res, next) => {
    const returnCallDate = new Date();
    const returnReason = req.body.returnReason;

    const transaction = await sequelize.transaction();
    try {
        // 주문 상태 변경
        // 환불 총액
        // 도서 불량 -> 주문 총액
        // 고객 변심 -> 주문 총액 - 5000
        const order = await getOrder(req.user.id);

        let totalReturnPrice = 0;
// A 항목
        if (returnReason === 'badBook') {
            totalReturnPrice = order.totalPrice;
        } else if (returnReason === 'changeMind') {
            totalReturnPrice = order.totalPrice - 5000;
        }

        // 환불일자: 반품요청일 + 3일
        const returnDate = new Date();
        returnDate.setDate(returnCallDate.getDate() + 3);
// A 항목
        await Order.update({
            status: 'allReturn',
            returnCallDate,
            returnReason,
            totalReturnPrice,
            returnDate,
        }, {
            where: {
                user_id: req.user.id,
            },
            transaction,
        });

        // 재고량 복귀
        // 모든 주문 항목에 있는 책 변경 및 주문 항목에 반품 수량 추가
        const orderItems = await getOrderItems(req.user.id);

        let bookStock = 0;

        for(let i = 0; i < orderItems.length; i++) {
            const book = await Book.findOne({
                where: {
                    number: orderItems[i].book_number,
                }
            }, { transaction });

            bookStock = book.stock + orderItems[i].quantity;

            await Book.update({
                stock: bookStock,
            }, {
                where: {
                    number: orderItems[i].book_number, // 도서의 기본키를 찾는일.
                },
                transaction,
            })

            // 반품 수량 추가
            await OrderItem.update({
                returnQuantity: orderItems[i].quantity,
            }, {
                where: {
                    number: orderItems[i].number,
                },
                transaction,
            })
        }

        await transaction.commit();
        res.redirect('/return');
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        next(err);
    }
})
//일부반품 (내용)
router.post('/part', isLoggedIn, async (req, res, next) => {
    const returnCallDate = new Date();
    const returnReason = req.body.returnReason;
    const returnQuantity = req.body.returnQuantity;
    const returnBookNumber = req.body.returnBookNumber;

    const transaction = await sequelize.transaction();
    try {
        // 주문 상태 변경
        // 환불 총액: 반품할 책 가격 * 반품 수량
       console.log('returnBookNUmber', returnBookNumber);
        const returnBook = await getBook(returnBookNumber);
        
        let totalReturnPrice = returnBook.price * returnQuantity;
        
        const order = await getOrder(req.user.id);
        
        // 도서 불량 -> 주문 총액
        // 고객 변심 -> 주문 총액 - 5000
        if (returnReason === 'badBook') {
            totalReturnPrice = order.totalPrice;
        } else if (returnReason === 'changeMind') {
            totalReturnPrice = order.totalPrice - 5000;
        }


        // 환불일자: 반품요청일 + 3일
        const returnDate = new Date();
        returnDate.setDate(returnCallDate.getDate() + 3);

        await Order.update({
            status: 'allReturn',
            returnCallDate,
            returnReason,
            totalReturnPrice,
            returnDate,
        }, {
            where: {
                user_id: req.user.id,
            },
            transaction,
        });

        // 재고량 복귀
        // 해당 주문 항목에 있는 책 재고량 변경 및 주문 항목에 반품 수량 추가
        const orderItem = await getOrderItem(req.user.id, returnBookNumber);

        let bookStock = 0;

        bookStock = returnBook.stock + orderItem.quantity;

        await Book.update({
            stock: bookStock,
        }, {
            where: {
                number: returnBookNumber.number,
            },
            transaction,
        })

        // 반품 수량 추가
        await OrderItem.update({
            returnQuantity: orderItem.quantity,
        }, {
            where: {
                number: orderItem.number,
            },
            transaction,
        })

        await transaction.commit();
        res.redirect('/return');
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        next(err);
    }
})
//일부반품 (내용끝)
router.post('/cancel', isLoggedIn, async (req, res, next) => {
    try {
        // 주문 상태를 주문 취소로 변경
        await Order.update({
            status: 'cancel'
        }, {
            where: {
                user_id: req.user.id, // 빛이다 무조건써라
            }
        });

        res.redirect('/return');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/completeDeliver', isLoggedIn, async (req, res, next) => {
    try {
        // 주문 상태를 주문 취소로 변경
        await Order.update({
            status: 'completeDeliver'
        }, {
            where: {
                user_id: req.user.id, //무조건써라
            }
        });

        res.redirect('/return');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;