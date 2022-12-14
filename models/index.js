const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

// models
const User = require('./user');
const CreditCard = require('./creditCard');
const ShippingAddress = require('./shippingAddress');
const Book = require('./book');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const Review = require('./review');
const Nice = require('./nice');
const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
// db 연결
db.User = User;
db.CreditCard = CreditCard;
db.ShippingAddress = ShippingAddress;
db.Book = Book;
db.Order = Order;
db.OrderItem = OrderItem;
db.Cart = Cart;
db.CartItem = CartItem;
db.Review = Review;
db.Nice = Nice;
// 모델 init 
User.init(sequelize);
CreditCard.init(sequelize);
ShippingAddress.init(sequelize);
Book.init(sequelize);
Order.init(sequelize);
OrderItem.init(sequelize);
Cart.init(sequelize);
CartItem.init(sequelize);
Review.init(sequelize);
Nice.init(sequelize);
// 모델 associate
User.associate(db);
CreditCard.associate(db);
ShippingAddress.associate(db);
Book.associate(db);
Order.associate(db);
OrderItem.associate(db);
Cart.associate(db);
CartItem.associate(db);
Review.associate(db);
Nice.associate(db);
module.exports = db;