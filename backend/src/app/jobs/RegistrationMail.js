import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
    get key() {
        return 'RegistrationMail';
    }

    async handle({ data }) {
        const { registration } = data;

        await Mail.sendMail({
            to: `${registration.students.name} <${registration.students.email}>`,
            subject: 'Agendamento efetuado com sucesso',
            template: 'registration',
            context: {
                student: registration.students.name,
                plan: registration.plans.title,
                startDate: format(
                    parseISO(registration.start_date),
                    "'dia' dd 'de' MMMM', ás' H:mm'h'",
                    {
                        locale: pt,
                    }
                ),
                endDate: format(
                    parseISO(registration.end_date),
                    "'dia' dd 'de' MMMM', ás' H:mm'h'",
                    {
                        locale: pt,
                    }
                ),
                totalPrice: registration.price,
            },
        });
    }
}

export default new RegistrationMail();
