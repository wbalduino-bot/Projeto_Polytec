// HistoricoTreinamentosCompletoExport.jsx — Componente React completo
// Este componente consome o endpoint FastAPI (/historico-treinamentos) e mostra:
//   1. Uma tabela com os detalhes de cada treinamento
//   2. Um gráfico de linha com a evolução dos registros usados
//   3. Botões para exportar os dados em CSV e PDF

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";
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

function HistoricoTreinamentosCompletoExport() {
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState(null);

  // 🔄 Busca dados da API ao montar o componente
  useEffect(() => {
    fetch("http://localhost:8000/historico-treinamentos") // ajuste a porta conforme seu FastAPI
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar histórico de treinamentos");
        return res.json();
      })
      .then(setHistorico)
      .catch((err) => setErro(err.message));
  }, []);

  // 📥 Exportar para CSV
  const exportCSV = () => {
    const header = ["Data", "Versão", "Registros", "Algoritmo", "Origem dos Dados"];
    const rows = historico.map(item => [
      item.data_treinamento,
      item.versao,
      item.quantidade_registros,
      item.algoritmo,
      item.origem_dados
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + [header.join(","), ...rows.map(r => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "historico_treinamentos.csv";
    link.click();
  };

  // 📥 Exportar para PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("📜 Histórico de Treinamentos - Oráculo", 14, 15);
    doc.autoTable({
      head: [["Data", "Versão", "Registros", "Algoritmo", "Origem dos Dados"]],
      body: historico.map(item => [
        item.data_treinamento,
        item.versao,
        item.quantidade_registros,
        item.algoritmo,
        item.origem_dados
      ]),
      startY: 25,
    });
    doc.save("historico_treinamentos.pdf");
  };

  if (erro) return <p className="text-red-500">{erro}</p>;
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

  // Renderiza tabela + gráfico + botões de exportação
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📜 Tabela com histórico detalhado */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-4">📜 Histórico de Treinamentos</h3>
          <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Data</th>
                <th className="border px-2 py-1">Versão</th>
                <th className="border px-2 py-1">Registros</th>
                <th className="border px-2 py-1">Algoritmo</th>
                <th className="border px-2 py-1">Origem</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-2 py-1">{item.data_treinamento}</td>
                  <td className="border px-2 py-1">{item.versao}</td>
                  <td className="border px-2 py-1">{item.quantidade_registros}</td>
                  <td className="border px-2 py-1">{item.algoritmo}</td>
                  <td className="border px-2 py-1">{item.origem_dados}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Botões de exportação */}
          <div className="flex gap-4">
            <button 
              onClick={exportCSV} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Exportar CSV
            </button>
            <button 
              onClick={exportPDF} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Exportar PDF
            </button>
          </div>
        </div>

        {/* 📈 Gráfico de evolução */}
        <div className="bg-white p-4 rounded shadow">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default HistoricoTreinamentosCompletoExport;
