import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Registro dos elementos necessários do Chart.js para gráficos de pizza
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const GraficoClientesAtivos = () => {
  const [dados, setDados] = useState({ ativos: 0, inativos: 0 }); // Estado para armazenar os dados do backend

  // Requisição ao backend para buscar contagem de clientes ativos e inativos
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/clientes-ativos')
      .then(res => setDados(res.data))
      .catch(err => console.error('Erro ao carregar dados de clientes ativos:', err));
  }, []);

  // Configuração dos dados para o gráfico de pizza
  const data = {
    labels: ['Ativos', 'Inativos'],
    datasets: [{
      data: [dados.ativos, dados.inativos],
      backgroundColor: ['#4CAF50', '#F44336'] // Verde para ativos, vermelho para inativos
    }]
  };

  // Configuração de opções visuais do gráfico
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Clientes Ativos vs Inativos' // Título do gráfico
      },
      legend: {
        position: 'bottom'
      }
    }
  };

  // Renderiza o gráfico de pizza com os dados e opções configuradas
  return <Pie data={data} options={options} />;
};

export default GraficoClientesAtivos;
