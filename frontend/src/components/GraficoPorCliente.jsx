import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar os módulos do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GraficoPorCliente() {
  const [dados, setDados] = useState({ labels: [], valores: [] });

  useEffect(() => {
    api.get('/pedidos/resumo-cliente').then((res) => {
      const nomes = Object.keys(res.data); // nomes dos clientes
      const valores = nomes.map((nome) => res.data[nome]); // valores em R$
      setDados({ labels: nomes, valores });
    });
  }, []);

  const data = {
    labels: dados.labels,
    datasets: [
      {
        label: 'Faturamento por Cliente (R$)',
        data: dados.valores,
        backgroundColor: '#4CAF50',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Faturamento por Cliente' },
    },
  };

  return (
    <div>
      <h3>Relatório por Cliente</h3>
      <Bar data={data} options={options} />
    </div>
  );
}

export default GraficoPorCliente;
