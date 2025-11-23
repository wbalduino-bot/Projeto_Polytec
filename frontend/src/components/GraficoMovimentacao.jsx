import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GraficoMovimentacao() {
  const [dados, setDados] = useState({ labels: [], entradas: [], saidas: [] });

  useEffect(() => {
    api.get('/movimentacoes/resumo').then((res) => {
      const labels = Object.keys(res.data);
      const entradas = labels.map((nome) => res.data[nome].entrada);
      const saidas = labels.map((nome) => res.data[nome].saida);
      setDados({ labels, entradas, saidas });
    });
  }, []);

  const data = {
    labels: dados.labels,
    datasets: [
      {
        label: 'Entradas',
        data: dados.entradas,
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Saídas',
        data: dados.saidas,
        backgroundColor: '#F44336',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Movimentação de Estoque por Produto' },
    },
  };

  return (
    <div>
      <h2>Relatório Gráfico</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default GraficoMovimentacao;
