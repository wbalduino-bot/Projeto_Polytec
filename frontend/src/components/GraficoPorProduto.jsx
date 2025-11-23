import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GraficoPorProduto() {
  const [dados, setDados] = useState({ labels: [], valores: [] });

  useEffect(() => {
    api.get('/pedidos/resumo-produto').then((res) => {
      const nomes = Object.keys(res.data);
      const valores = nomes.map((nome) => res.data[nome]);
      setDados({ labels: nomes, valores });
    });
  }, []);

  const data = {
    labels: dados.labels,
    datasets: [
      {
        label: 'Faturamento por Produto (R$)',
        data: dados.valores,
        backgroundColor: '#2196F3',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Faturamento por Produto' },
    },
  };

  return (
    <div>
      <h3>Relatório por Produto</h3>
      <Bar data={data} options={options} />
    </div>
  );
}

export default GraficoPorProduto;
