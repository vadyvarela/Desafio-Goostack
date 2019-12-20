import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdChevronRight,
  MdChevronLeft,
} from 'react-icons/md';

import api from '~/services/api';
import history from '~/services/history';
import Alert from '~/util/alert';

import { formatPrice } from '~/util/format';

import { Container, DataHeader, Data, NoData, Paginator } from './styles';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);

  async function fetchPlans(currentPage) {
    try {
      const { data } = await api.get('plans', {
        params: { page: currentPage },
      });

      setLastPage(data.lastPage);
      setPage(currentPage);
      setPlans(
        data.content.map(plan => ({
          ...plan,
          durationFormatted: `${plan.duration} ${
            plan.duration > 1 ? 'Meses' : 'Mês'
          }`,
          priceFormatted: formatPrice(plan.price),
        }))
      );
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  useEffect(() => {
    fetchPlans(1);
  }, []); //eslint-disable-line

  function handleDelete({ id }) {
    Alert.delete().then(async result => {
      if (result.value) {
        await api.delete(`/plans/${id}`);

        const newPlans = plans.filter(plan => plan.id !== id);

        let newPage = newPlans.length ? page : page - 1;
        if (newPage === 0) {
          newPage = 1;
        }

        fetchPlans(newPage);

        toast.success('Plano removido com sucesso do sistema');
      }
    });
  }

  function handlePreviousPageChange() {
    const currentPage = page - 1;
    fetchPlans(currentPage);
  }

  function handleNextPageChange() {
    const currentPage = page + 1;
    fetchPlans(currentPage);
  }

  return (
    <Container>
      <DataHeader>
        <strong>Gerenciando planos</strong>
        <button type="button" onClick={() => history.push('/plans/new')}>
          <MdAdd color="#fff" size={20} />
          <span>CADASTRAR</span>
        </button>
      </DataHeader>

      {plans.length ? (
        <>
          <Data>
            <thead>
              <tr>
                <th>TÍTULO</th>
                <th>DURAÇÃO</th>
                <th>VALOR P/ MÊS</th>
                <th aria-label="Título da coluna vazia" />
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.title}</td>
                  <td>{plan.durationFormatted}</td>
                  <td>{plan.priceFormatted}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => history.push(`/plans/${plan.id}/edit`)}
                    >
                      <MdEdit size={22} />
                    </button>
                    <button type="button" onClick={() => handleDelete(plan)}>
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
          <span>Nenhum plano encontrado</span>
        </NoData>
      )}
    </Container>
  );
}
