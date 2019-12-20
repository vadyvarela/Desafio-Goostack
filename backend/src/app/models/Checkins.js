import { Model } from 'sequelize';

class Checkins extends Model {
    static init(sequelize) {
        super.init(
            {},
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Students, {
            foreignKey: 'student_id',
            as: 'students',
        });
    }
}

export default Checkins;
