import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registro dos elementos necessários para gráficos de barra
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Componente que exibe ranking de clientes por valor total movimentado
const RankingClientesValor = ({ filtros }) => {
  const [dados, setDados] = useState([]); // Estado para armazenar os dados do backend

  // Requisição ao backend com filtros aplicados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/ranking-clientes', { params: filtros })
      .then(res => setDados(res.data)) // Atualiza os dados recebidos
      .catch(err => console.error('Erro ao carregar ranking de clientes:', err));
  }, [filtros]);

  // Extrai nomes e valores para o gráfico
  const clientes = dados.map(d => d.cliente);
  const valores = dados.map(d => d.valorTotal);

  // Dados para o gráfico
  const data = {
    labels: clientes,
    datasets: [{
      label: 'Valor Total (R$)',
      data: valores,
      backgroundColor: '#2980b9'
    }]
  };

  // Configurações visuais do gráfico
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Ranking de Clientes por Valor Total'
      },
      legend: {
        display: false // Oculta legenda pois há apenas um dataset
      }
    },
    responsive: true,
    indexAxis: 'y', // Inverte os eixos para barras horizontais
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  // Renderiza o gráfico de barras horizontais
  return <Bar data={data} options={options} />;
};

export default RankingClientesValor;
