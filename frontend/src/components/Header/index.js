import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MdPerson,
  MdLineStyle,
  MdCreate,
  MdHelp,
  MdExitToApp,
} from 'react-icons/md';
import { signOut } from '~/store/modules/auth/actions';
import { Container, Profile, Content } from './styles';

import logo from '~/assets/logo-header.png';

export default function Header() {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.user);

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="GimPoint" />
          <Link to="/students">
            <MdPerson size={19} color="#999" /> ALUNOS
          </Link>
          <Link to="/plans">
            <MdLineStyle size={19} color="#999" /> PLANOS
          </Link>
          <Link to="/registrations">
            <MdCreate size={19} color="#999" /> MATRICULAS
          </Link>
          <Link to="/help-orders">
            <MdHelp size={19} color="#999" /> PEDIDOS DE AUXILIO
          </Link>
        </nav>

        <aside>
          <Profile>
            <div>
              <strong> {profile.name} </strong>
              <button type="button" onClick={handleSignOut}>
                <MdExitToApp size={19} color="#ee4d64" /> Sair
              </button>
            </div>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
