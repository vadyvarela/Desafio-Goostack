import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrdersMail {
    get key() {
        return 'HelpOrdersMail';
    }

    async handle({ data }) {
        const { helpOrders } = data;

        await Mail.sendMail({
            to: `${helpOrders.students.name} <${helpOrders.students.email}>`,
            subject: 'Pergunta respondida',
            template: 'helpOrders',
            context: {
                student: helpOrders.students.name,
                question: helpOrders.question,
                answer: helpOrders.answer,
                answerDate: format(
                    parseISO(helpOrders.answer_at),
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
