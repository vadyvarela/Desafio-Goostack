import * as Yup from 'yup';
import { Op } from 'sequelize';
import Students from '../models/Students';

class StudentsController {
  async index(req, res) {
    const { id, q, page } = req.query;

    if (id) {
      const studentExists = await Students.findByPk(id);

      if (!studentExists) {
        return res.status(400).json({ error: 'Student not found.' });
      }

      return res.json(studentExists);
    }

    if (page) {
      const limit = 5;

      const where = q ? { name: { [Op.like]: `%${q}%` } } : {};

      const studentsCount = await Students.count({ where });

      const lastPage = page * limit >= studentsCount;

      const students = await Students.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
      });

      return res.json({ lastPage, content: students });
    }

    const students = await Students.findAll();

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.string().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Students.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const student = await Students.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().integer(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const studentExists = await Students.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const { email } = req.body;

    if (email) {
      const emailAlreadyExists = await Students.findOne({
        where: {
          email,
          id: {
            [Op.not]: id,
          },
        },
      });

      if (emailAlreadyExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    const student = await studentExists.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const { id } = req.params;

    const studentExists = await Students.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found' });
    }

    await studentExists.destroy(id);

    return res.json();
  }
}
export default new StudentsController();
