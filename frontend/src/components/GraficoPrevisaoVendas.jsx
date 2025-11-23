// frontend/src/components/Dashboard/GraficoPrevisaoVendas.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

/**
 * Gráfico de linha que exibe a previsão de vendas por mês.
 */
const GraficoPrevisaoVendas = ({ perfil }) => {
  const [dados, setDados] = useState(null);
  const meses = ['2025-09', '2025-10', '2025-11'];

  useEffect(() => {
    if (!perfil || perfil.tipo !== 'vendedor') return;

    axios.get('http://localhost:3001/dashboard/previsao-vendas', {
      params: {
        vendedorId: perfil.id,
        meses: meses.join(',')
      }
    })
      .then(res => setDados(res.data))
      .catch(err => console.error('Erro ao carregar previsão:', err));
  }, [perfil]);

  if (!dados) return null;

  const chartData = {
    labels: meses.map(m => m.split('-')[1] + '/25'), // Exibe como "09/25", "10/25"...
    datasets: [
      {
        label: 'Previsão de Vendas (R$)',
        data: meses.map(() => dados.previsao), // Simula mesma previsão para todos os meses
        fill: false,
        borderColor: '#2563eb',
        backgroundColor: '#3b82f6',
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: value => `R$ ${value}` }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-blue-800 font-semibold mb-2">📊 Previsão de Vendas</h3>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default GraficoPrevisaoVendas;
