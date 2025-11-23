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

// Registro dos elementos necessários para o gráfico de barras
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Componente que exibe a taxa de conversão por vendedor
const GraficoConversaoPorVendedor = ({ filtros }) => {
  const [dados, setDados] = useState([]);

  // Requisição ao backend com filtros aplicados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/conversao-vendedores', { params: filtros })
      .then(res => setDados(res.data))
      .catch(err => console.error('Erro ao carregar gráfico de conversão:', err));
  }, [filtros]);

  // Se não houver dados, não renderiza nada
  if (!dados.length) return null;

  // Prepara os dados para o gráfico
  const labels = dados.map(d => d.vendedor);
  const taxas = dados.map(d => d.conversao);

  const data = {
    labels,
    datasets: [{
      label: 'Taxa de Conversão (%)',
      data: taxas,
      backgroundColor: '#4f46e5'
    }]
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Taxa de Conversão por Vendedor'
      },
      legend: {
        display: false
      }
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default GraficoConversaoPorVendedor;
