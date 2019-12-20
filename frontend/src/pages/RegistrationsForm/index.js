import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { parseISO, addMonths } from 'date-fns';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';

import InputDatePicker from '~/components/InputDatePicker';
import InputMask from '~/components/InputMask';

import history from '~/services/history';
import api from '~/services/api';

import { validation } from '~/util/messages';

import {
  Container,
  PageTop,
  Data,
  SecondRowForm,
  StudentPicker,
  PlanPicker,
} from './styles';

const schema = Yup.object().shape({
  student: Yup.mixed().required(validation.required),
  plan: Yup.mixed().required(validation.required),
  start_date: Yup.date()
    .typeError(validation.typeError)
    .required(validation.required),
});

export default function EnrollmentForm() {
  const [enrollment, setEnrollment] = useState({});
  const [plans, setPlans] = useState([]);

  const { id } = useParams();

  function fetchPlans() {
    return api.get('plans');
  }

  function isNewEnrollment() {
    return !id;
  }

  function fetchStudents() {
    return api.get('students');
  }

  function fetchEnrollment() {
    return api.get('registrations', {
      params: { id },
    });
  }

  useEffect(() => {
    async function pageLoad() {
      if (!isNewEnrollment()) {
        const fetchPlansPromise = fetchPlans();
        const fetchEnrollmentPromise = fetchEnrollment();

        const plansData = (await fetchPlansPromise).data;
        const enrollmentData = (await fetchEnrollmentPromise).data;

        setPlans(plansData);

        setEnrollment({
          ...enrollmentData,
          start_date: parseISO(enrollmentData.start_date),
          end_date: parseISO(enrollmentData.end_date),
        });
      } else {
        const { data } = await fetchPlans();
        setPlans(data);
      }
    }

    pageLoad();
  }, []); //eslint-disable-line

  function fixHttpData(data) {
    data = {
      ...data,
      student_id: data.student.id,
      plan_id: data.plan.id,
      date: data.start_date,
    };
    delete data.student;
    delete data.plan;
    delete data.start_date;
    delete data.price;
    delete data.end_date;

    return data;
  }

  async function insertEnrollment(data) {
    data = fixHttpData(data);

    await api.post('registrations', data);
    toast.success('Cadastro efetuado com sucesso no sistema');
  }

  async function updateEnrollment(data) {
    data = fixHttpData(data);

    await api.put(`registrations/${enrollment.id}`, data);
    toast.success('Dados atualizados com sucesso no sistema');
  }

  async function handleFormSubmit(data) {
    try {
      if (isNewEnrollment()) {
        await insertEnrollment(data);
      } else {
        await updateEnrollment(data);
      }
      history.push('/registrations');
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  const filterColors = (data, inputValue) => {
    return data.filter(i =>
      i.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadStudentOptions = async inputValue => {
    async function loadStudents() {
      const { data } = await fetchStudents();
      return data;
    }
    const data = await loadStudents();

    return new Promise(resolve => {
      resolve(filterColors(data, inputValue));
    });
  };

  function handleStartDateChange(newDate) {
    setEnrollment({
      ...enrollment,
      start_date: newDate,
      end_date: addMonths(newDate, enrollment.plan.duration),
    });
  }

  function handlePlanChange(newPlan) {
    setEnrollment({
      ...enrollment,
      plan: newPlan,
      end_date: enrollment.start_date
        ? addMonths(enrollment.start_date, newPlan.duration)
        : null,
      price: newPlan.price * newPlan.duration,
    });
  }

  return (
    <Container>
      <PageTop>
        <strong>
          {isNewEnrollment() ? 'Cadastro de matrícula' : 'Edição de matrícula'}
        </strong>
        <div>
          <button type="button" onClick={() => history.push('/registrations')}>
            <MdKeyboardArrowLeft size={20} color="#fff" />
            <span>VOLTAR</span>
          </button>
          <button type="submit" form="Form">
            <MdCheck size={20} color="#fff" />
            <span>SALVAR</span>
          </button>
        </div>
      </PageTop>

      <Data
        id="Form"
        schema={schema}
        initialData={enrollment}
        onSubmit={handleFormSubmit}
      >
        <label>ALUNO</label>
        <StudentPicker name="student" loadOptions={loadStudentOptions} />

        <SecondRowForm>
          <div>
            <label>PLANO</label>
            <PlanPicker
              name="plan"
              options={plans}
              onChange={handlePlanChange}
            />
          </div>
          <div>
            <label>DATA DE INÍCIO</label>
            <InputDatePicker
              className="normal-input"
              name="start_date"
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <label>DATA DE TÉRMINO</label>
            <InputDatePicker
              className="normal-input"
              name="end_date"
              disabled
            />
          </div>
          <div>
            <label>PRECO TOTAL</label>
            <InputMask
              className="normal-input"
              name="price"
              prefix="R$ "
              disabled
            />
          </div>
        </SecondRowForm>
      </Data>
    </Container>
  );
}

EnrollmentForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
