import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Porta do backend
});

// Intercepta requisições e adiciona token JWT se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
