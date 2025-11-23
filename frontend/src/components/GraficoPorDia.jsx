// frontend/src/components/GraficoPorDia.jsx

import React from 'react';
import { Line } from 'react-chartjs-2';

/**
 * Gráfico de linha que mostra a quantidade de ações por dia
 * Recebe os logs filtrados como prop
 */
function GraficoPorDia({ logs }) {
  const contagem = logs.reduce((acc, log) => {
    const dia = new Date(log.timestamp).toLocaleDateString();
    acc[dia] = (acc[dia] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(contagem),
    datasets: [{
      label: 'Ações por dia',
      data: Object.values(contagem),
      borderColor: '#1976d2',
      backgroundColor: '#bbdefb',
      fill: true
    }]
  };

  return <Line data={data} options={{ responsive: true }} />;
}

export default GraficoPorDia;
