import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Form, Textarea } from '@rocketseat/unform';
import * as Yup from 'yup';

import { MdQuestionAnswer } from 'react-icons/md';
import api from '~/services/api';

import { validation } from '~/util/messages';

import {
  Container,
  DataHeader,
  Data,
  NoData,
  AnswerModal,
  Paginator,
} from './styles';

const schema = Yup.object().shape({
  answer: Yup.string().required(validation.required),
});

export default function HelpOrders() {
  const [helpOrders, setHelpOrders] = useState([]);
  const [selectedHelpOrder, setSelectedHelOrder] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);

  async function fetchHelpOrders(currentPage) {
    try {
      const { data } = await api.get('help-orders', {
        params: { page: currentPage },
      });

      setHelpOrders(data.content);
      setPage(currentPage);
      setLastPage(data.lastPage);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  useEffect(() => {
    fetchHelpOrders(1);
  }, []); //eslint-disable-line

  function openModal() {
    setModalVisible(true);
  }

  function handleAnswerClick(helpOrder) {
    setSelectedHelOrder(helpOrder);
    openModal();
  }

  async function handleSubmit(data) {
    try {
      await api.post(`help-orders/${selectedHelpOrder.id}/answer`, data);

      toast.success('Resposta salva');

      const newHelpOrders = helpOrders.filter(
        helpOrder => helpOrder.id !== selectedHelpOrder.id
      );

      let newPage = newHelpOrders.length ? page : page - 1;
      if (newPage === 0) {
        newPage = 1;
      }

      fetchHelpOrders(newPage);

      setModalVisible(false);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  function handlePreviousPageChange() {
    const currentPage = page - 1;
    fetchHelpOrders(currentPage);
  }

  function handleNextPageChange() {
    const currentPage = page + 1;
    fetchHelpOrders(currentPage);
  }

  return (
    <Container>
      <AnswerModal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <span>
          <strong>PERGUNTA DO ALUNO</strong>
        </span>
        <span>{selectedHelpOrder && selectedHelpOrder.question}</span>
        <span>
          <strong>SUA RESPOSTA</strong>
        </span>
        <Form schema={schema} onSubmit={handleSubmit}>
          <Textarea
            name="answer"
            type="text"
            placeholder="Sua resposta aqui..."
            onChange={e =>
              setSelectedHelOrder({
                ...selectedHelpOrder,
                answer: e.target.value,
              })
            }
          />
          <button type="submit">Responder aluno</button>
        </Form>
      </AnswerModal>

      <DataHeader>
        <strong>Pedidos de Auxílio</strong>
      </DataHeader>

      {helpOrders.length ? (
        <>
          <Data>
            <thead>
              <tr>
                <th>ALUNO</th>
                <th aria-label="Título da coluna vazia" />
              </tr>
            </thead>
            <tbody>
              {helpOrders.map(helpOrder => (
                <tr key={helpOrder.id}>
                  <td>{helpOrder.students.name}</td>
                  <td>
                    <MdQuestionAnswer
                      color="#4D85EE"
                      size={24}
                      onClick={() => handleAnswerClick(helpOrder)}
                    >
                      Responder
                    </MdQuestionAnswer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Data>

          <Paginator>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => {
                handlePreviousPageChange();
              }}
            >
              Anterior
            </button>

            <button
              disabled={lastPage}
              type="button"
              onClick={() => {
                handleNextPageChange();
              }}
            >
              Próxima
            </button>
          </Paginator>
        </>
      ) : (
        <NoData>
          <span>Nenhum pedido de auxílio encontrado</span>
        </NoData>
      )}
    </Container>
  );
}
