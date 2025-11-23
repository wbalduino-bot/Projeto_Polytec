import React, { useState } from 'react';
import Button from './Button';

const PagamentoForm = () => {
  const [pedidoId, setPedidoId] = useState('');
  const [valor, setValor] = useState('');
  const [metodo, setMetodo] = useState('Pix');

  const handleSave = () => {
    alert(`Pagamento salvo: Pedido ${pedidoId} - R$ ${valor} via ${metodo}`);
  };

  const handleCancel = () => {
    setPedidoId('');
    setValor('');
    setMetodo('Pix');
  };

  const handleDelete = () => {
    alert('Pagamento excluído');
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Registrar Pagamento</h2>

      <div className="mb-4">
        <label className="block text-gray-700">ID do Pedido:</label>
        <input
          type="text"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Valor (R$):</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Método de Pagamento:</label>
        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        >
          <option value="Pix">Pix</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Boleto">Boleto</option>
          <option value="Dinheiro">Dinheiro</option>
        </select>
      </div>

      <div className="flex space-x-4">
        <Button label="Salvar" onClick={handleSave} variant="primary" />
        <Button label="Cancelar" onClick={handleCancel} variant="secondary" />
        <Button label="Excluir" onClick={handleDelete} variant="danger" disabled />
      </div>
    </div>
  );
};

export default PagamentoForm;