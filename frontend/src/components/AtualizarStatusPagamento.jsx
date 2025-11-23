import React, { useState, useEffect } from 'react';
import Button from './Button';

const AtualizarStatusPagamento = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState('');
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/pagamentos')
      .then((res) => res.json())
      .then((data) => setPagamentos(data))
      .catch((err) => console.error('Erro ao buscar pagamentos:', err));
  }, []);

  const handleUpdate = async () => {
    if (!pagamentoSelecionado || !novoStatus) {
      alert('Selecione um pagamento e um novo status.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/pagamentos/${pagamentoSelecionado}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      const resultado = await response.json();
      alert(`Status atualizado: Pagamento ${resultado.pagamento._id} → ${resultado.pagamento.status}`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setPagamentoSelecionado('');
    setNovoStatus('');
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-center">Atualizar Status do Pagamento</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Pagamento:</label>
        <select
          value={pagamentoSelecionado}
          onChange={(e) => setPagamentoSelecionado(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        >
          <option value="">Selecione um pagamento</option>
          {pagamentos.map((pagamento) => (
            <option key={pagamento._id} value={pagamento._id}>
              {pagamento._id} - Pedido {pagamento.pedidoId}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Novo Status:</label>
        <select
          value={novoStatus}
          onChange={(e) => setNovoStatus(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        >
          <option value="">Selecione o status</option>
          <option value="Pendente">Pendente</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div className="flex space-x-4">
        <Button label="Atualizar" onClick={handleUpdate} variant="primary" />
        <Button label="Cancelar" onClick={handleCancel} variant="secondary" />
      </div>
    </div>
  );
};

export default AtualizarStatusPagamento;