/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';
import InputMask from '~/components/InputMask';

import history from '~/services/history';
import api from '~/services/api';

import { validation } from '~/util/messages';

import { Container, PageTop, Data } from './styles';

const schema = Yup.object().shape({
  name: Yup.string().required(validation.required),
  email: Yup.string()
    .email(validation.email)
    .required(validation.required),
  idade: Yup.number()
    .positive(validation.positive)
    .typeError(validation.typeError)
    .required(validation.required),
  peso: Yup.number()
    .positive(validation.positive)
    .typeError(validation.typeError)
    .required(validation.required),
  altura: Yup.number().required(validation.required),
});

export default function StudentForm() {
  const [student, setStudent] = useState({});

  const { id } = useParams();

  function isNewStudent() {
    return !id;
  }

  useEffect(() => {
    async function loadStudent() {
      try {
        const { data } = await api.get('students', {
          params: { id },
        });

        setStudent(data);
      } catch (err) {
        toast.error(err.response.data.error);
      }
    }

    if (!isNewStudent()) {
      loadStudent();
    }
  }, []); //eslint-disable-line

  async function insertStudent(data) {
    await api.post('students', data);
    toast.success('Cadastro efetuado com sucesso');
  }

  async function updateStudent(data) {
    await api.put(`students/${student.id}`, data);
    toast.success('Dados atualizado com sucesso');
  }

  async function handleFormSubmit(data) {
    try {
      if (isNewStudent()) {
        await insertStudent(data);
      } else {
        await updateStudent(data);
      }
      history.push('/students');
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  return (
    <Container>
      <PageTop>
        <strong>
          {isNewStudent() ? 'Cadastro de aluno' : 'Edição de aluno'}
        </strong>
        <div>
          <button type="button" onClick={() => history.push('/students')}>
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
        initialData={student}
        onSubmit={handleFormSubmit}
      >
        <label>NOME COMPLETO</label>
        <Input name="name" placeholder="John Doe" />

        <label>ENDEREÇO DE E-MAIL</label>
        <Input name="email" type="email" placeholder="exemplo@email.com" />

        <div>
          <div>
            <label>IDADE</label>
            <Input name="idade" type="number" />
          </div>
          <div>
            <label>PESO (em kg) </label>
            <InputMask name="peso" />
          </div>
          <div>
            <label>ALTURA</label>
            <InputMask name="altura" />
          </div>
        </div>
      </Data>
    </Container>
  );
}

StudentForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
