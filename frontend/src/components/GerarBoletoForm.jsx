import React, { useState } from 'react';
import Button from './Button';
import axios from 'axios';
import { notificar } from '../utils/notificar';
import { jsPDF } from 'jspdf';


const salvarLogNoServidor = async (mensagem) => {
  try {
    await axios.post('/api/logs', { mensagem });
  } catch (error) {
    console.error('Erro ao salvar log no servidor:', error);
  }
};

const GerarBoletoForm = () => {
  const [pedidoId, setPedidoId] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [logs, setLogs] = useState([]);

  const registrarLog = (acao) => {
    const timestamp = new Date().toLocaleString();
    const entrada = `${timestamp} - ${acao}`;
    setLogs((prev) => [...prev, entrada]);
    salvarLogNoServidor(entrada);
  };

  const exportarLogsCSV = () => {
    const conteudo = logs.join('\n');
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'logs_rastreio.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    if (!pedidoId || !vencimento) {
      notificar.alerta('Preencha todos os campos.');
      registrarLog('Tentativa de geração com campos vazios');
      return;
    }

    try {
      await axios.post('/api/boletos', { pedidoId, vencimento });

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Boleto de Pagamento', 20, 20);
      doc.setFontSize(12);
      doc.text(`Pedido ID: ${pedidoId}`, 20, 40);
      doc.text(`Vencimento: ${vencimento}`, 20, 50);
      doc.text(`Valor: R$ 100,00`, 20, 60);
      doc.save(`boleto_pedido_${pedidoId}.pdf`);

      notificar.sucesso(`Boleto gerado para Pedido ${pedidoId}.`);
      registrarLog(`Boleto gerado para Pedido ${pedidoId}`);
    } catch (error) {
      notificar.erro('Erro ao gerar boleto.');
      registrarLog(`Erro ao gerar boleto para Pedido ${pedidoId}`);
    }
  };

  const handleCancel = () => {
    setPedidoId('');
    setVencimento('');
    setMensagem('');
    registrarLog('Formulário cancelado');
  };

  const handleDelete = () => {
    notificar.info('Boleto excluído.');
    registrarLog('Boleto excluído');
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Gerar Boleto</h2>

      <div className="mb-4">
        <label className="block text-gray-700">ID do Pedido:</label>
        <input
          type="text"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Data de Vencimento:</label>
        <input
          type="date"
          value={vencimento}
          onChange={(e) => setVencimento(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="flex space-x-4">
        <Button label="Gerar" onClick={handleGenerate} variant="primary" />
        <Button label="Cancelar" onClick={handleCancel} variant="secondary" />
        <Button label="Excluir" onClick={handleDelete} variant="danger" disabled />
      </div>

      {/* ✅ ALERTA ANIMADO */}
      {mensagem && (
        <div
          className="mt-4 px-4 py-3 rounded bg-blue-100 border border-blue-300 text-blue-800 transition-all duration-500 ease-in-out"
          role="alert"
        >
          {mensagem}
        </div>
      )}

      {/* ✅ LOGS DE RASTREIO */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Logs de rastreio:</h3>
        <ul className="text-sm text-gray-700 list-disc pl-5">
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
         <Button label="Exportar Logs" onClick={exportarLogsCSV} variant="secondary" />
      </div>
    </div>
  );
};

export default GerarBoletoForm;
