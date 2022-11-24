const Sequelize = require('sequelize');

module.exports = class Book extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            number: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            info: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            imageSource: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            avg_grade: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            grade_count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Book',
            tableName: 'book',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // cart와 N : M 관계 (through: CartItem)
        db.Book.belongsToMany(db.Cart, { through: db.CartItem, foreignKey: 'book_number', sourceKey: 'number'});
        
        // order와 N : M 관계 (through: OrderItem)
        db.Book.belongsToMany(db.Order, { through: db.OrderItem, foreignKey: 'book_number', sourceKey: 'number'});
    
        // user 와 N: M 관계
        db.Book.belongsToMany(db.User, { through: db.Review, foreignKey: 'book_number', sourceKey: 'number' });
    }
}