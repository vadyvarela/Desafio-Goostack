import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { signInRequest } from '~/store/modules/auth/actions';

import { Wrapper, Content } from './styles';

import logo from '~/assets/logo.png';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function Signin() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  function handleSubmit({ email, password }) {
    dispatch(signInRequest(email, password));
  }

  return (
    <Wrapper>
      <Content>
        <img src={logo} alt="GYMPoint" />

        <Form schema={schema} onSubmit={handleSubmit}>
          <strong>SEU E-MAIL</strong>
          <Input name="email" type="email" placeholder="Seu e-mail" />

          <strong>SUA SENHA</strong>
          <Input name="password" type="password" placeholder="********" />

          <button type="submit">
            {loading ? 'Caregando...' : 'Entrar no sistema'}
          </button>
        </Form>
      </Content>
    </Wrapper>
  );
}
