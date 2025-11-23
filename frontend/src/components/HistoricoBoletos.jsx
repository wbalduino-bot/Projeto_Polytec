import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoricoBoletos = () => {
  const [boletos, setBoletos] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        const response = await axios.get('/api/boletos');
        setBoletos(response.data);
      } catch (error) {
        console.error('Erro ao buscar boletos:', error);
      }
    };

    fetchBoletos();
  }, []);

  const boletosFiltrados = boletos.filter((boleto) => {
    const data = new Date(boleto.geradoEm);
    const inicio = dataInicio ? new Date(dataInicio) : null;
    const fim = dataFim ? new Date(dataFim) : null;

    return (!inicio || data >= inicio) && (!fim || data <= fim);
  });

  const exportarCSV = () => {
    const linhas = [
      ['ID', 'Pedido', 'Vencimento', 'Gerado em', 'Status'],
      ...boletosFiltrados.map((b) => [
        b.id,
        b.pedidoId,
        b.vencimento,
        new Date(b.geradoEm).toLocaleString(),
        b.status,
      ]),
    ];

    const csv = linhas.map((linha) => linha.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'historico_boletos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-4xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Histórico de Boletos</h2>

      {/* Filtros por data */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">De:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Até:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Tabela de boletos */}
      <table className="w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Pedido</th>
            <th className="px-4 py-2">Vencimento</th>
            <th className="px-4 py-2">Gerado em</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {boletosFiltrados.map((boleto) => (
            <tr key={boleto.id} className="border-t">
              <td className="px-4 py-2">{boleto.id}</td>
              <td className="px-4 py-2">{boleto.pedidoId}</td>
              <td className="px-4 py-2">{boleto.vencimento}</td>
              <td className="px-4 py-2">{new Date(boleto.geradoEm).toLocaleString()}</td>
              <td className="px-4 py-2">{boleto.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botão de exportação */}
      <div className="mt-4">
        <button
          onClick={exportarCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Exportar CSV
        </button>
      </div>
    </div>
  );
};

export default HistoricoBoletos;
