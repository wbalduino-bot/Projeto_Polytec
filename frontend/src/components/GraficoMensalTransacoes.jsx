import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registro dos elementos necessários para gráficos de linha
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Componente que exibe gráfico de linha com transações mensais por tipo
const GraficoMensalTransacoes = ({ filtros }) => {
  const [dados, setDados] = useState([]); // Estado para armazenar os dados do backend

  // Requisição ao backend com filtros aplicados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/transacoes-mensais', { params: filtros })
      .then(res => setDados(res.data)) // Atualiza os dados recebidos
      .catch(err => console.error('Erro ao carregar gráfico mensal:', err));
  }, [filtros]);

  // Extrai lista única de meses
  const meses = [...new Set(dados.map(d => d.mes))];

  // Tipos de transações esperados
  const tipos = ['pedido', 'pagamento', 'interacao'];

  // Cores personalizadas para cada tipo
  const cores = {
    pedido: '#1f77b4',
    pagamento: '#2ca02c',
    interacao: '#ff7f0e'
  };

  // Prepara os datasets para cada tipo de transação
  const datasets = tipos.map(tipo => ({
    label: tipo.charAt(0).toUpperCase() + tipo.slice(1), // Capitaliza o nome
    data: meses.map(mes => {
      const item = dados.find(d => d.mes === mes && d.tipo === tipo);
      return item ? item.quantidade : 0; // Se não houver, retorna 0
    }),
    borderColor: cores[tipo],
    backgroundColor: cores[tipo],
    tension: 0.3 // Suaviza a curva
  }));

  // Dados para o gráfico
  const data = {
    labels: meses,
    datasets
  };

  // Configurações visuais do gráfico
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Transações Mensais por Tipo'
      },
      legend: {
        position: 'bottom'
      }
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Renderiza o gráfico de linha
  return <Line data={data} options={options} />;
};

export default GraficoMensalTransacoes;
