import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.3.2:2323',
});

export default api;
