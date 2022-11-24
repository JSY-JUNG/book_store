const express = require('express');
const { getBook, getBooks } = require('../find');
const { sequelize, Book, Review, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const review_book = await getBook(req.body.bookNumber);
        res.render('review', { review_book }); // 책에대한 정보를 들고온다
        
    } catch (err) {
        console.error(err);
        next(err);
    }
})
router.post('/write', async (req, res, next) => {
    const review_contents = req.body.review_text;
    const review_grade = req.body.review_grade;
    const review_date = new Date();
    const bookNumber = req.body.bookNumber;
    try {
        const review_find = await Review.findOne({
            include: [
                {
                    model: User,
                    where: {
                        id: req.user.id,
                    }
                },
                {
                    model: Book,
                    where: {
                        number: bookNumber,
                    }
                }
            ]
        })

        if (review_find) {
            return res.send('<script>alert("중복 작성 불가합니다."); \
        location.href="/";</script>');
        }

        await Review.create({
            review_contents: review_contents,
            review_grade: review_grade,
            review_date: review_date,
            user_id: req.user.id,
            book_number: req.body.bookNumber,
        })
        //평균평점과 평점참여수 A부분
        const reviews = await Review.findAll({
            include: [{
                model: Book,
                where: {
                    number: bookNumber,
                }
            }]
        })
        let totalgrade = 0;
        for (const toreview of reviews) {
            totalgrade += toreview.review_grade;
        }
        let avg = parseFloat(totalgrade / reviews.length);
        await Book.update({
            avg_grade: avg,
            grade_count: reviews.length,
        },
            {
                where: {
                number:bookNumber,
            }
        }
        )
        //평균평점과 평점참여수 A부분
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
})
module.exports = router;