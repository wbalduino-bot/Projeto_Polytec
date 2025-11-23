import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Registro dos elementos necessários do Chart.js para gráficos de linha
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const GraficoInteracoesMensais = () => {
  const [dados, setDados] = useState([]); // Estado para armazenar os dados do backend

  // Requisição ao backend para buscar número de interações por mês
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/interacoes-por-mes')
      .then(res => setDados(res.data))
      .catch(err => console.error('Erro ao carregar dados de interações mensais:', err));
  }, []);

  // Meses do ano em ordem
  const meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Mapeia os dados recebidos do backend para o formato esperado pelo gráfico
  const valores = meses.map(mes => {
    const item = dados.find(d => d.mes === mes);
    return item ? parseInt(item.quantidade) : 0;
  });

  // Configuração dos dados para o gráfico de linha
  const data = {
    labels: nomesMeses,
    datasets: [{
      label: 'Interações',
      data: valores,
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 0, 255, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };

  // Configuração de opções visuais do gráfico
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Interações por Mês' // Título do gráfico
      },
      legend: {
        position: 'bottom'
      }
    }
  };

  // Renderiza o gráfico de linha com os dados e opções configuradas
  return <Line data={data} options={options} />;
};

export default GraficoInteracoesMensais;
