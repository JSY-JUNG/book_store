const Sequelize = require('sequelize');
// 테이블 create 만드는 역할.
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                primaryKey: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            point: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            grade: { //등급
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'bronze',
            },
            totalValue: { //내정보에 나오는 내가쓴 총금액
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            }

        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tablename: 'user',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // creditCard와 1 : N 관계 (1측, 비식별)
        db.User.hasMany(db.CreditCard, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });

        // shippingAddress와 1 : N 관계 (1측, 비식별)
        db.User.hasMany(db.ShippingAddress, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });

        // cart과 1 : N 관계 (1측, 비식별)
        db.User.hasMany(db.Cart, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });

        // order 1 : N 관계 (1측, 비식별)
        db.User.hasMany(db.Order, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'set null', onUpdate: 'cascade' });

        // book n: M 관계
        db.User.belongsToMany(db.Book, { through: db.Review, foreignKey: 'user_id', sourceKey: 'id' });
    }
}