import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrders';
import Students from '../models/Students';

class StudentHelpOrderController {
  async index(req, res) {
    const { id } = req.params;
    const studentExists = await Students.findByPk(id);

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

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: id },
	  order: [
		['id', 'DESC'],
	  ],
      ...pageLimit,
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { question } = req.body;

    const studentId = req.params.id;

    const studentExists = await Students.findByPk(studentId);

    if (!studentExists) {
      return res.status(400).json({ error: 'Students not found.' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: studentId,
      question,
    });

    const studentHelpOrder = await HelpOrder.findByPk(helpOrder.id, {
      attributes: ['id', 'question', 'created_at'],
      include: [
        {
          model: Students,
          as: 'students',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(studentHelpOrder);
  }
}

export default new StudentHelpOrderController();
