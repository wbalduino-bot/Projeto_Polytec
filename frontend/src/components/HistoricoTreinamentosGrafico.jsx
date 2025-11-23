// HistoricoTreinamentosGrafico.jsx — Componente React para exibir gráfico de evolução dos treinamentos
// Este componente consome o endpoint FastAPI (/historico-treinamentos) e mostra um gráfico de linha
// com a evolução do número de registros usados em cada treinamento do modelo Oráculo.

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// 🔧 Registrar os módulos necessários do Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function HistoricoTreinamentosGrafico() {
  // Estado para armazenar o histórico de treinamentos
  const [historico, setHistorico] = useState([]);
  // Estado para mensagens de erro
  const [erro, setErro] = useState(null);

  // useEffect roda ao montar o componente e busca os dados da API
  useEffect(() => {
    fetch("http://localhost:8000/historico-treinamentos") // ajuste a porta conforme seu FastAPI
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar histórico de treinamentos");
        return res.json();
      })
      .then(setHistorico)
      .catch((err) => setErro(err.message));
  }, []);

  // Caso ocorra erro na requisição
  if (erro) return <p className="text-red-500">{erro}</p>;
  // Enquanto os dados não chegam
  if (!historico || historico.length === 0) return <p>Carregando gráfico...</p>;

  // 🔄 Preparar dados para o gráfico
  const labels = historico.map((item) => item.data_treinamento); // eixo X: datas
  const dataValues = historico.map((item) => item.quantidade_registros); // eixo Y: registros

  const data = {
    labels,
    datasets: [
      {
        label: "Registros usados no treinamento",
        data: dataValues,
        borderColor: "rgba(75, 192, 192, 1)", // cor da linha
        backgroundColor: "rgba(75, 192, 192, 0.2)", // cor do preenchimento
        tension: 0.3, // suaviza a curva da linha
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "📈 Evolução dos Treinamentos do Modelo Oráculo",
        font: { size: 18 },
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Data do Treinamento" },
      },
      y: {
        title: { display: true, text: "Quantidade de Registros" },
        beginAtZero: true,
      },
    },
  };

  // Renderiza o gráfico de linha
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <Line data={data} options={options} />
    </div>
  );
}

export default HistoricoTreinamentosGrafico;
