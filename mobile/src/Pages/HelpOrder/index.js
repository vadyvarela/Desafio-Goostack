import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '~/components/Header';

import {
  Container,
  Content,
  QuestionContent,
  QuestionHeader,
  QuestionDate,
  Question,
  QuestionLabel,
  AnswerLabel,
  Answer,
} from './styles';

export default function HelpOrder({ navigation }) {
  const helpOrder = navigation.getParam('item');

  return (
    <>
      <Container>
        <Header />

        <Content>
          <QuestionContent>
            <QuestionHeader>
              <QuestionLabel>PERGUNTA</QuestionLabel>
              <QuestionDate>{helpOrder.formattedDate}</QuestionDate>
            </QuestionHeader>
            <Question>{helpOrder.question}</Question>

            {helpOrder.answer && (
              <>
                <AnswerLabel>RESPOSTA</AnswerLabel>
                <Answer>{helpOrder.answer}</Answer>
              </>
            )}
          </QuestionContent>
        </Content>
      </Container>
    </>
  );
}

HelpOrder.navigationOptions = ({ navigation }) => ({
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

HelpOrder.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
