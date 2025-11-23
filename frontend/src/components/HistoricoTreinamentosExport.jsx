// HistoricoTreinamentosExport.jsx — Componente React para exibir histórico e exportar em CSV/PDF
// Este componente consome o endpoint FastAPI (/historico-treinamentos) e mostra:
//   1. Uma tabela com os detalhes de cada treinamento
//   2. Botões para exportar os dados em CSV e PDF

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";          // Biblioteca para gerar PDF
import "jspdf-autotable";           // Plugin para tabelas no PDF

function HistoricoTreinamentosExport() {
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

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-xl font-bold mb-4">📜 Histórico de Treinamentos</h3>
      
      {/* Tabela com histórico */}
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
  );
}

export default HistoricoTreinamentosExport;
