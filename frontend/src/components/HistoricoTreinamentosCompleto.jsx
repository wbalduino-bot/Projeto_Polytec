// HistoricoTreinamentosCompleto.jsx — Componente React que combina tabela e gráfico
// Este componente consome o endpoint FastAPI (/historico-treinamentos) e mostra:
//   1. Uma tabela com os detalhes de cada treinamento
//   2. Um gráfico de linha com a evolução do número de registros usados

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

// 🔧 Registrar módulos necessários do Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function HistoricoTreinamentosCompleto() {
  // Estado para armazenar histórico
  const [historico, setHistorico] = useState([]);
  // Estado para erros
  const [erro, setErro] = useState(null);

  // useEffect busca dados da API ao montar o componente
  useEffect(() => {
    fetch("http://localhost:8000/historico-treinamentos") // ajuste a porta conforme seu FastAPI
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar histórico de treinamentos");
        return res.json();
      })
      .then(setHistorico)
      .catch((err) => setErro(err.message));
  }, []);

  // Caso ocorra erro
  if (erro) return <p className="text-red-500">{erro}</p>;
  // Enquanto os dados não chegam
  if (!historico || historico.length === 0) return <p>Carregando histórico...</p>;

  // 🔄 Preparar dados para o gráfico
  const labels = historico.map((item) => item.data_treinamento);
  const dataValues = historico.map((item) => item.quantidade_registros);

  const data = {
    labels,
    datasets: [
      {
        label: "Registros usados no treinamento",
        data: dataValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
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
      legend: { display: true, position: "bottom" },
    },
    scales: {
      x: { title: { display: true, text: "Data do Treinamento" } },
      y: { title: { display: true, text: "Quantidade de Registros" }, beginAtZero: true },
    },
  };

  // Renderiza tabela + gráfico lado a lado
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* 📜 Tabela com histórico detalhado */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">📜 Histórico de Treinamentos</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Data</th>
              <th className="border px-2 py-1">Versão</th>
              <th className="border px-2 py-1">Registros</th>
              <th className="border px-2 py-1">Algoritmo</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{item.data_treinamento}</td>
                <td className="border px-2 py-1">{item.versao}</td>
                <td className="border px-2 py-1">{item.quantidade_registros}</td>
                <td className="border px-2 py-1">{item.algoritmo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📈 Gráfico de evolução */}
      <div className="bg-white p-4 rounded shadow">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default HistoricoTreinamentosCompleto;
