import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Alert = {
  delete: async () => {
    return MySwal.fire({
      title: 'Tem certeza que deseja apagar?',
      text: 'O registro será removido completamente do sistema!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, Apagar',
      cancelButtonText: 'Não',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      focusCancel: true,
      reverseButtons: true,
    });
  },
};

export default Alert;
