import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrdersMail {
  get key() {
    return 'HelpOrdersMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;
    console.log(helpOrder);

    await Mail.sendMail({
      to: `${helpOrder.students.name} <${helpOrder.students.email}>`,
      subject: 'Pergunta respondida',
      template: 'helpOrders',
      context: {
        student: helpOrder.students.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answerDate: format(
          parseISO(helpOrder.answer_at),
          "'dia' dd 'de' MMMM', ás' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new HelpOrdersMail();
