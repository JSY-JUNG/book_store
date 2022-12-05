const Sequelize = require('sequelize');

module.exports = class Nice extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            number: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Nice',
            tableName: 'nice',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // User와 1 : N 관계 (N측, 식별)
        db.Nice.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'id' });

        // book과 1 : N 관계 (N측, 비식별)
        db.Nice.belongsTo(db.Book, { foreignKey: 'book_number', sourceKey: 'number' });
    }
}