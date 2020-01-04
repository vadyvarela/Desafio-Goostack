import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
// import pt from 'date-fns/locale/pt';
import Checkins from '../models/Checkins';
import Students from '../models/Students';

class CheckinsController {
  async index(req, res) {
    const studentExists = await Students.findByPk(req.params.id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Students not found.' });
    }

    const { page } = req.query;

    let pageLimit = {};
    if (page) {
      pageLimit = {
        offset: (page - 1) * 20,
        limit: 20,
      };
    }

    const checkins = await Checkins.findAll({
      where: { student_id: studentExists.id },
      attributes: ['id', 'created_at'],
      ...pageLimit,
      order: [['created_at', 'DESC']],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const studentExists = await Students.findByPk(req.params.id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Students not found.' });
    }
	
	const checkinDate = new Date();
    const todatCheckin = await Checkins.findOne({
      where: {
        student_id: studentExists.id,
        created_at: {
          [Op.between]: [startOfDay(checkinDate), endOfDay(checkinDate)],
        },
      },
    });

    if (todatCheckin) {
      return res.json({ message: 'Student already checked in today' });
    }

    const sevenDaysAgo = subDays(checkinDate, 7);

    const weekCheckins = await Checkins.findAll({
      where: {
        student_id: studentExists.id,
        created_at: {
          [Op.between]: [sevenDaysAgo, checkinDate],
        },
      },
    });

    if (weekCheckins.length >= 5) {
      return res
        .status(400)
        .json({ error: 'Limite de 5 checkins por semana atingido.' });
    }

    const checkin = await Checkins.create({
      student_id: studentExists.id,
    });

    const studentCheckin = await Checkins.findByPk(checkin.id, {
      attributes: ['id', 'created_at'],
      include: [
        {
          model: Students,
          as: 'students',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(studentCheckin);
  }
}

export default new CheckinsController();
