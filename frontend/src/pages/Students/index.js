import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  MdAdd,
  MdSearch,
  MdDelete,
  MdEdit,
  MdChevronRight,
  MdChevronLeft,
} from 'react-icons/md';

import api from '~/services/api';
import history from '~/services/history';
import Alert from '~/util/alert';

import { Container, DataHeader, Data, NoData, Paginator } from './styles';

export default function Students() {
  const [studentName, setStudentName] = useState();
  const [students, setStudents] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);

  async function fecthStudents(currentPage) {
    try {
      const { data } = await api.get('students', {
        params: { q: studentName, page: currentPage },
      });

      setPage(currentPage);
      setLastPage(data.lastPage);
      setStudents(data.content);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  useEffect(() => {
    fecthStudents(1);
  }, []); //eslint-disable-line

  function handleStudentNameChange(e) {
    setStudentName(e.target.value);
  }

  function handleDelete({ id }) {
    Alert.delete().then(async result => {
      if (result.value) {
        await api.delete(`/students/${id}`);
        const newStudents = students.filter(student => student.id !== id);

        let newPage = newStudents.length ? page : page - 1;
        if (newPage === 0) {
          newPage = 1;
        }

        fecthStudents(newPage);
        toast.success('Aluno removido com sucesso do sistema');
      }
    });
  }

  function handlePreviousPageChange() {
    const currentPage = page - 1;
    fecthStudents(currentPage);
  }

  function handleNextPageChange() {
    const currentPage = page + 1;
    fecthStudents(currentPage);
  }

  return (
    <Container>
      <DataHeader>
        <strong>Gerenciando alunos</strong>
        <button type="button" onClick={() => history.push('/students/new')}>
          <MdAdd color="#fff" size={20} />
          <span>CADASTRAR</span>
        </button>
        <span>
          <MdSearch color="#999999" size={16} />
          <input
            name="studentName"
            placeholder="Nome aluno e pressione enter"
            onKeyDown={event => event.key === 'Enter' && fecthStudents(1)}
            onChange={handleStudentNameChange}
          />
        </span>
      </DataHeader>

      {students.length ? (
        <>
          <Data>
            <thead>
              <tr>
                <th>NOME</th>
                <th>E-MAIL</th>
                <th>IDADE</th>
                <th aria-label="Título da coluna vazia" />
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.idade}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        history.push(`/students/${student.id}/edit`)
                      }
                    >
                      <MdEdit size={22} />
                    </button>
                    <button type="button" onClick={() => handleDelete(student)}>
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
          <span>Nenhum aluno encontrado</span>
        </NoData>
      )}
    </Container>
  );
}
