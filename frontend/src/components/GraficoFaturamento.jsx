import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function GraficoFaturamento() {
  const [dados, setDados] = useState({ labels: [], valores: [] });

  useEffect(() => {
    api.get('/pedidos/resumo-mensal').then((res) => {
      const labels = Object.keys(res.data);
      const valores = labels.map((mes) => res.data[mes]);
      setDados({ labels, valores });
    });
  }, []);

  const data = {
    labels: dados.labels,
    datasets: [
      {
        label: 'Faturamento Mensal (R$)',
        data: dados.valores,
        borderColor: '#2196F3',
        backgroundColor: '#BBDEFB',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Faturamento por Mês' },
    },
  };

  return (
    <div>
      <h2>Relatório de Faturamento</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default GraficoFaturamento;
