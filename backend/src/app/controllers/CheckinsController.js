import * as Yup from 'yup';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
// import pt from 'date-fns/locale/pt';
import Checkins from '../models/Checkins';
import Students from '../models/Students';

class CheckinsController {
  async index(req, res) {
    const page = parseInt(req.query.page || 1, 10);
    const perPage = parseInt(req.query.perPage || 5, 10);
    const student_id = req.params.id;

    const studentExists = await Students.findByPk(student_id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const checkins = await Checkins.findAndCountAll({
      where: {
        student_id,
      },
      include: [
        {
          model: Students,
          as: 'students',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!checkins) {
      res.status(404).json({
        error: 'This user has not yet checked in!',
      });
    }

    const totalPage = Math.ceil(checkins.count / perPage);

    return res.json({
      page,
      perPage,
      mydata: checkins.rows,
      total: checkins.count,
      totalPage,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
    });
    const student_id = req.params.id;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Students.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'This student does not exist.' });
    }

    const checkinDate = new Date();

    const checkin = await Checkins.findOne({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfDay(checkinDate), endOfDay(checkinDate)],
        },
      },
    });

    if (checkin) {
      return res.json({ message: 'Student already checked in today' });
    }

    const checkinsCount = await Checkins.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfWeek(checkinDate), endOfWeek(checkinDate)],
        },
      },
    });

    if (checkinsCount === 5) {
      return res
        .status(403)
        .json({ error: 'Student can only checkin 5 times per week' });
    }

    await Checkins.create({
      student_id,
    });

    return res.status(200).json({
      message: 'Your checkins is accepted',
    });
  }
}

export default new CheckinsController();
