import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registro dos elementos necessários do Chart.js para gráficos de barras
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Componente que exibe um gráfico comparativo de transações por tipo para cada cliente
const GraficoComparativoTransacoes = ({ filtros }) => {
  const [dados, setDados] = useState([]); // Estado para armazenar os dados recebidos do backend

  // Requisição ao backend sempre que os filtros forem alterados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/transacoes-por-cliente', { params: filtros })
      .then(res => setDados(res.data)) // Atualiza o estado com os dados recebidos
      .catch(err => console.error('Erro ao carregar gráfico comparativo:', err)); // Log de erro
  }, [filtros]); // Dependência: atualiza quando os filtros mudam

  // Extrai lista única de clientes a partir dos dados
  const clientes = [...new Set(dados.map(d => d.cliente))];

  // Tipos de transação esperados no gráfico
  const tipos = ['pedido', 'pagamento', 'interacao'];

  // Cores personalizadas para cada tipo de transação
  const cores = {
    pedido: '#1f77b4',
    pagamento: '#2ca02c',
    interacao: '#ff7f0e'
  };

  // Prepara os datasets agrupados por tipo de transação
  const datasets = tipos.map(tipo => ({
    label: tipo.charAt(0).toUpperCase() + tipo.slice(1), // Capitaliza o rótulo
    data: clientes.map(cliente => {
      // Busca o valor correspondente ao cliente e tipo
      const item = dados.find(d => d.cliente === cliente && d.tipo === tipo);
      return item ? item.quantidade : 0; // Se não houver, retorna 0
    }),
    backgroundColor: cores[tipo] // Aplica cor específica
  }));

  // Configuração dos dados para o gráfico
  const data = {
    labels: clientes, // Rótulos do eixo X (nomes dos clientes)
    datasets // Conjunto de barras por tipo
  };

  // Configuração de opções visuais do gráfico
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Comparativo de Transações por Cliente' // Título do gráfico
      },
      legend: {
        position: 'bottom' // Posição da legenda
      }
    },
    responsive: true, // Adapta o gráfico ao tamanho da tela
    scales: {
      y: {
        beginAtZero: true // Inicia o eixo Y no zero
      }
    }
  };

  // Renderiza o gráfico de barras agrupadas
  return <Bar data={data} options={options} />;
};

export default GraficoComparativoTransacoes;
