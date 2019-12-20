import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  MdAdd,
  MdCheckCircle,
  MdDelete,
  MdEdit,
  MdChevronRight,
  MdChevronLeft,
} from 'react-icons/md';

import api from '~/services/api';
import history from '~/services/history';
import Alert from '~/util/alert';

import { Container, DataHeader, Data, NoData, Paginator } from './styles';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);

  function formatDate(date) {
    return format(parseISO(date), "d 'de' MMMM 'de' yyyy", {
      locale: pt,
    });
  }

  async function fetchRegistrations(currentPage) {
    try {
      const { data } = await api.get('registrations', {
        params: { page: currentPage },
      });

      const newData = data.content.map(reg => ({
        ...reg,
        start_date: formatDate(reg.start_date),
        end_date: formatDate(reg.end_date),
        page: currentPage,
      }));

      setPage(currentPage);
      setLastPage(data.lastPage);
      setRegistrations(newData);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  useEffect(() => {
    fetchRegistrations(1);
  }, []); //eslint-disable-line

  function handleDelete({ id }) {
    Alert.delete().then(async result => {
      if (result.value) {
        await api.delete(`/registrations/${id}`);

        const newRegistrations = registrations.filter(
          registration => registration.id !== id
        );

        let newPage = newRegistrations.length ? page : page - 1;
        if (newPage === 0) {
          newPage = 1;
        }

        fetchRegistrations(newPage);

        toast.success('Matrícula removida do sitema com sucesso');
      }
    });
  }

  function handlePreviousPageChange() {
    const currentPage = page - 1;
    fetchRegistrations(currentPage);
  }

  function handleNextPageChange() {
    const currentPage = page + 1;
    fetchRegistrations(currentPage);
  }

  return (
    <Container>
      <DataHeader>
        <strong>Gerenciando matrículas</strong>
        <button
          type="button"
          onClick={() => history.push('/registrations/new')}
        >
          <MdAdd color="#fff" size={20} />
          <span>CADASTRAR</span>
        </button>
      </DataHeader>

      {registrations.length ? (
        <>
          <Data>
            <thead>
              <tr>
                <th>ALUNO</th>
                <th>PLANO</th>
                <th>INÍCIO</th>
                <th>TÉRMINO</th>
                <th>ATIVO</th>
                <th aria-label="Título da coluna vazia" />
              </tr>
            </thead>
            <tbody>
              {registrations.map(registration => (
                <tr key={registration.id}>
                  <td>{registration.students.name}</td>
                  <td>{registration.plans.title}</td>
                  <td>{registration.start_date}</td>
                  <td>{registration.end_date}</td>
                  <td>
                    <MdCheckCircle
                      size={20}
                      color={registration.active ? '#42cb59' : '#ddd'}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        history.push(`/registrations/${registration.id}/edit`)
                      }
                    >
                      <MdEdit size={22} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(registration)}
                    >
                      <MdDelete size={22} color="#de3b3b" />
                    </button>
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
              <MdChevronLeft size={22} />
            </button>
            <button
              disabled={lastPage}
              type="button"
              onClick={() => {
                handleNextPageChange();
              }}
            >
              <MdChevronRight size={22} />
            </button>
          </Paginator>
        </>
      ) : (
        <NoData>
          <span>Nenhuma matrícula encontrada</span>
        </NoData>
      )}
    </Container>
  );
}
