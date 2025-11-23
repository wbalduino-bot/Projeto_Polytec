import React, { useState, useEffect } from 'react';
import Button from './Button';

const AtualizarStatusPedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState('');
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/pedidos')
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error('Erro ao buscar pedidos:', err));
  }, []);

  const handleUpdate = async () => {
    if (!pedidoSelecionado || !novoStatus) {
      alert('Selecione um pedido e um novo status.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/pedidos/${pedidoSelecionado}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      const resultado = await response.json();
      alert(`Status atualizado: Pedido ${resultado.pedido._id} → ${resultado.pedido.status}`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setPedidoSelecionado('');
    setNovoStatus('');
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-center">Atualizar Status do Pedido</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Pedido:</label>
        <select
          value={pedidoSelecionado}
          onChange={(e) => setPedidoSelecionado(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        >
          <option value="">Selecione um pedido</option>
          {pedidos.map((pedido) => (
            <option key={pedido._id} value={pedido._id}>
              {pedido._id} - {pedido.cliente}
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
          <option value="Finalizado">Finalizado</option>
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

export default AtualizarStatusPedido;