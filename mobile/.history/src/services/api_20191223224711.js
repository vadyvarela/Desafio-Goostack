import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2323',
});

export default api;
