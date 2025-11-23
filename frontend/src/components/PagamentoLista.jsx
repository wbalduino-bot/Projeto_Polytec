import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const PagamentoLista = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [erro, setErro] = useState('');
  const [clienteBusca, setClienteBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(5);

  const exportarPDF = (pagamentos) => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const adicionarCabecalho = () => {
      doc.setFontSize(14);
      doc.text('Relatório de Pagamentos', 20, 20);
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 150, 20);
      doc.setFontSize(12);
      doc.text('Cliente', 20, 30);
      doc.text('Valor (R$)', 100, 30);
      doc.text('Status', 150, 30);
    };

    adicionarCabecalho();

    let y = 40;
    pagamentos.forEach((p) => {
      doc.text(p.cliente, 20, y, { maxWidth: 70 });
      doc.text(p.valor.toFixed(2), 100, y);
      doc.text(p.status, 150, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 40;
        adicionarCabecalho();
      }
    });

    doc.save('pagamentos.pdf');
  };

  const exportarCSV = (pagamentos) => {
    const csv = Papa.unparse(
      pagamentos.map((p) => ({
        Cliente: p.cliente,
        Valor: p.valor,
        Status: p.status,
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pagamentos.csv';
    link.click();
  };

  useEffect(() => {
    const fetchPagamentos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErro('Você precisa estar logado para visualizar os pagamentos.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/pagamentos', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.erro || 'Erro ao buscar pagamentos');

        setPagamentos(data);
      } catch (err) {
        setErro(err.message);
      }
    };

    fetchPagamentos();
  }, []);

  const pagamentosFiltrados = pagamentos.filter((p) =>
    p.cliente.toLowerCase().includes(clienteBusca.toLowerCase()) &&
    (statusFiltro === '' || p.status === statusFiltro) &&
    (!dataInicio || (p.data && new Date(p.data) >= new Date(dataInicio))) &&
    (!dataFim || (p.data && new Date(p.data) <= new Date(dataFim)))
  );

  const totalPaginas = Math.ceil(pagamentosFiltrados.length / porPagina);
  const pagamentosPaginados = pagamentosFiltrados.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Pagamentos</h2>

      {erro && <p className="text-red-600 text-center mb-4">{erro}</p>}

      <fieldset className="border p-4 rounded mb-4">
        <legend className="text-lg font-semibold mb-2">Filtros</legend>
        <div className="flex gap-4 flex-wrap justify-center">
          <input
            type="text"
            placeholder="Buscar por cliente"
            value={clienteBusca}
            onChange={(e) => setClienteBusca(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="border px-3 py-2 rounded w-48"
          >
            <option value="">Todos os status</option>
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </fieldset>

      <div className="flex gap-4 justify-center mb-4">
        <button
          onClick={() => exportarPDF(pagamentosFiltrados)}
          disabled={pagamentosFiltrados.length === 0}
          className={`px-4 py-2 rounded ${
            pagamentosFiltrados.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Exportar PDF
        </button>
        <button
          onClick={() => exportarCSV(pagamentosFiltrados)}
          disabled={pagamentosFiltrados.length === 0}
          className={`px-4 py-2 rounded ${
            pagamentosFiltrados.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          Exportar CSV
        </button>
      </div>

      <p className="text-sm text-gray-600 text-center mb-2">
        Exibindo {pagamentosFiltrados.length} pagamento(s) filtrado(s)
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">ID</th>
              <th className="text-left px-4 py-2 border-b">Cliente</th>
              <th className="text-left px-4 py-2 border-b">Valor</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {pagamentosPaginados.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Nenhum pagamento encontrado.
                </td>
              </tr>
            ) : (
              pagamentosPaginados.map((pagamento) => (
                <tr key={pagamento._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{pagamento._id}</td>
                  <td className="px-4 py-2 border-b">{pagamento.cliente}</td>
                  <td className="px-4 py-2 border-b">R$ {pagamento.valor.toFixed(2)}</td>
                  <td
                    className={`px-4 py-2 border-b font-semibold ${
                      pagamento.status === 'Pago'
                        ? 'text-green-600'
                        : pagamento.status === 'Cancelado'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {pagamento.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPagina(i + 1)}
            className={`px-3 py-1 rounded ${
              pagina === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PagamentoLista;