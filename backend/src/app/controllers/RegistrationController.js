import * as Yup from 'yup';
import {
  isBefore,
  parseISO,
  addMonths,
  startOfHour,
  startOfDay,
  isAfter,
  endOfDay,
  subDays,
  addDays,
  isWithinInterval,
  startOfMinute,
  endOfMinute,
} from 'date-fns';
import { Op } from 'sequelize';
import Registration from '../models/Registration';
import Student from '../models/Students';
import Plan from '../models/Plan';
import User from '../models/User';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const { id, page } = req.query;
    const loggedUser = await User.findByPk(req.userId);

    if (!loggedUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const include = [
      {
        model: Student,
        as: 'students',
        attributes: ['id', 'name'],
      },
      {
        model: Plan,
        as: 'plans',
        attributes: ['id', 'title', 'duration'],
      },
    ];

    if (id) {
      const registration = await Registration.findByPk(id, { include });
      return res.json(registration);
    }

    if (page) {
      const limit = 5;
      const registrationCount = await Registration.count();
      const lastPage = page * limit >= registrationCount;
      const queryLimitOffset = {
        limit,
        offset: (page - 1) * limit,
      };

      const registrations = await Registration.findAll({
        include,
        ...queryLimitOffset,
      });

      return res.json({ lastPage, content: registrations });
    }
    const registrations = await Registration.findAll();
    return res.json(registrations);
  }

  async show(req, res) {
    const { id } = req.params;

    const registration = await Registration.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Students,
          as: 'students',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plans',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!registration)
      return res.status(404).json({ error: 'Enrollment Not Found' });

    return res.json(registration);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, date } = req.body;

    const student = await Student.findOne({
      where: { id: student_id },
    });

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!plan) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    const registrationExists = await Registration.findOne({
      where: { student_id: req.body.student_id },
    });

    if (registrationExists) {
      const isValidRegistration = isWithinInterval(new Date(), {
        start: startOfDay(subDays(registrationExists.start_date, 1)),
        end: endOfDay(addDays(registrationExists.end_date, 1)),
      });

      if (isValidRegistration) {
        return res.status(401).json({
          error:
            'This student is already registrad but his registration has expired',
        });
      }

      return res
        .status(401)
        .json({ error: 'This student is already matriculated' });
    }

    const parsedDate = parseISO(date);
    const startDate = startOfHour(parsedDate);

    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const checkAvailability = await Registration.findOne({
      where: {
        student_id,
        plan_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Registration date is not available' });
    }

    const planMonths = plan.duration;
    const planPrice = plan.price;

    const end_date = addMonths(startDate, planMonths);
    const price = planMonths * planPrice;

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date,
      price,
    });

    await Queue.add(RegistrationMail.key, {
      registration,
      student,
      plan,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer(),
      plan_id: Yup.number().integer(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, date } = req.body;

    const registrationExists = await Registration.findByPk(req.params.id);

    if (!registrationExists) {
      return res.status(400).json({ error: 'Registration not found' });
    }

    const studentExists = await Student.findOne({
      where: { id: student_id },
    });

    if (!studentExists) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const planExists = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!planExists) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    const parsedDate = parseISO(date);
    const startDate = startOfHour(parsedDate);

    if (
      isBefore(parsedDate, startOfMinute(registrationExists.start_date)) ||
      isAfter(parsedDate, endOfMinute(registrationExists.start_date))
    ) {
      if (isBefore(parsedDate, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }
    }

    const checkAvailability = await Registration.findOne({
      where: {
        student_id,
        plan_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Registration date is not available' });
    }

    const planMonths = planExists.duration;
    const planPrice = planExists.price;

    const end_date = addMonths(startDate, planMonths);
    const price = planMonths * planPrice;

    const registrationUpdated = await registrationExists.update({
      student_id,
      plan_id,
      start_date: startDate,
      end_date,
      price,
    });

    return res.json(registrationUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;

    const registrationsExists = await Registration.findByPk(id);

    if (!registrationsExists) {
      return res.status(400).json({ error: 'Registration not found' });
    }

    await registrationsExists.destroy(id);

    return res.json();
  }
}

export default new RegistrationController();
