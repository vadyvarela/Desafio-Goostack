import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.29.101:2323',
});

export default api;
