import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

class PlanController {
  async index(req, res) {
    const loggedUser = await User.findByPk(req.userId);

    if (!loggedUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const { page, id } = req.query;

    if (id) {
      const plan = await Plan.findByPk(id);
      return res.json(plan);
    }

    if (page) {
      const limit = 5;

      const plansCount = await Plan.count();
      const lastPage = page * limit >= plansCount;

      const plans = await Plan.findAll({
        limit,
        offset: (page - 1) * limit,
      });

      return res.json({ lastPage, content: plans });
    }

    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const student = await Plan.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const planExists = await Plan.findByPk(id);

    if (!planExists) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    await planExists.destroy(id);

    return res.json();
  }
}

export default new PlanController();
