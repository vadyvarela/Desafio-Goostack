import styled from 'styled-components/native';

import Button from '~/components/Button';
import InputMask from '~/components/InputMask';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 25px;
  background: #fff;
`;

export const Logo = styled.Image`
  width: 80px;
  height: 41px;
`;

export const LogoText = styled.Text`
  color: #ee4d64;
  font-size: 24px;
  line-height: 28px;
  font-weight: bold;
  margin-top: 10px;
`;

export const Form = styled.View`
  align-self: stretch;
  margin-top: 20px;
`;

export const FormInput = styled(InputMask)`
  height: 45px;
`;

export const SubmitButton = styled(Button)`
  height: 46px;
  margin-top: 20px;
`;
