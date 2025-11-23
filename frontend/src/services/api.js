import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ou sua URL de produção
});

export default api;
