const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            number: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            review_contents: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            review_grade: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {onetofive(number){if(1>number || number>5) throw new Error('평점은 1점에서 5점사이가 들어가야합니다.') }} // 제약조건거는법
            },
            review_date: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Review',
            tableName: 'review',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // User와 1 : N 관계 (N측, 식별)
        db.Review.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'id' });

        // book과 1 : N 관계 (N측, 비식별)
        db.Review.belongsTo(db.Book, { foreignKey: 'book_number', sourceKey: 'number' });
    }
}