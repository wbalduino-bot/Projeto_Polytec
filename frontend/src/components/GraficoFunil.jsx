import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';

// Registro dos elementos necessários do Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const GraficoFunil = () => {
  const [dados, setDados] = useState([]); // Estado para armazenar os dados do backend

  // Requisição ao backend para buscar dados de oportunidades por estágio
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/oportunidades-por-estagio')
      .then(res => setDados(res.data))
      .catch(err => console.error('Erro ao carregar dados do funil:', err));
  }, []);

  // Estágios esperados no funil de vendas
  const estagios = ['lead', 'proposta', 'negociacao', 'ganho', 'perdido'];

  // Cores personalizadas para cada estágio
  const cores = {
    lead: '#1f77b4',
    proposta: '#ff7f0e',
    negociacao: '#2ca02c',
    ganho: '#4CAF50',
    perdido: '#F44336'
  };

  // Mapeia os dados recebidos do backend para o formato esperado pelo gráfico
  const valores = estagios.map(estagio => {
    const item = dados.find(d => d.estagio === estagio);
    return item ? parseInt(item.quantidade) : 0;
  });

  // Configuração dos dados para o gráfico de barras horizontais
  const data = {
    labels: estagios.map(e => e.charAt(0).toUpperCase() + e.slice(1)), // Capitaliza os rótulos
    datasets: [{
      label: 'Oportunidades',
      data: valores,
      backgroundColor: estagios.map(e => cores[e]) // Aplica cor por estágio
    }]
  };

  // Configuração de opções visuais do gráfico
  const options = {
    indexAxis: 'y', // Define gráfico horizontal
    plugins: {
      title: {
        display: true,
        text: 'Funil de Vendas - Conversão de Leads' // Título do gráfico
      }
    }
  };

  // Renderiza o gráfico de barras com os dados e opções configuradas
  return <Bar data={data} options={options} />;
};

export default GraficoFunil;
