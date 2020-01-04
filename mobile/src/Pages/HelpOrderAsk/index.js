import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import Header from '~/components/Header';

import { Container, Content, QuestionInput, SubmitQuestion } from './styles';

export default function HelpOrderAsk({ navigation }) {
  const student = useSelector(state => state.student.student);
  const [question, setQuestion] = useState('');
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true);

  useEffect(() => setSubmitBtnDisabled(!question.length), [question]);

  async function handleSubmitQuestion() {
    try {
      await api.post(`/students/${student.id}/help-orders`, {
        question,
      });
      Alert.alert('Sucesso', 'Seu pedido de auxílio foi registrado', [
        {
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      Alert.alert('Erro', 'Occoreu um erro ao registrar seu pedido de auxilio');
    }
  }

  return (
    <>
      <Container>
        <Header />

        <Content>
          <QuestionInput
            placeholder="Inclua seu pedido de auxílio"
            value={question}
            onChangeText={setQuestion}
          />
          <SubmitQuestion
            onPress={handleSubmitQuestion}
            disabled={submitBtnDisabled}
          >
            Enviar pedido
          </SubmitQuestion>
        </Content>
      </Container>
    </>
  );
}

HelpOrderAsk.navigationOptions = ({ navigation }) => ({
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Icon name="chevron-left" size={24} color="#333" />
    </TouchableOpacity>
  ),
});

HelpOrderAsk.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
