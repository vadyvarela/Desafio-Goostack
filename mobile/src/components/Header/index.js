import React from 'react';

import logo from '~/assets/logo.png';

import { HeaderBackground, HeaderImage, HeaderText } from './styles';

export default function Header() {
  return (
    <HeaderBackground>
      <HeaderImage source={logo} />
      <HeaderText>GYMPOINT</HeaderText>
    </HeaderBackground>
  );
}
