// frontend/src/components/GraficoPorUsuario.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';

/**
 * Gráfico de barras que mostra a quantidade de ações por usuário
 * Recebe os logs filtrados como prop
 */
function GraficoPorUsuario({ logs }) {
  const contagem = logs.reduce((acc, log) => {
    acc[log.performedBy] = (acc[log.performedBy] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(contagem),
    datasets: [{
      label: 'Ações por usuário',
      data: Object.values(contagem),
      backgroundColor: '#4caf50'
    }]
  };

  return <Bar data={data} options={{ responsive: true }} />;
}

export default GraficoPorUsuario;
