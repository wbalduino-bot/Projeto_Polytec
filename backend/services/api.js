import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ajuste conforme porta do backend
});

export default api;
