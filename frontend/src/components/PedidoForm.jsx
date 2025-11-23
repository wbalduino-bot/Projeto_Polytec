import React, { useState } from 'react';
import Button from './Button';

const PedidoForm = () => {
  const [cliente, setCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSave = async () => {
    setErro('');
    setSucesso('');

    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Você precisa estar logado para cadastrar um pedido.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cliente, produto, quantidade }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao salvar pedido');
      }

      setSucesso('Pedido cadastrado com sucesso!');
      setCliente('');
      setProduto('');
      setQuantidade(1);
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleCancel = () => {
    setCliente('');
    setProduto('');
    setQuantidade(1);
    setErro('');
    setSucesso('');
  };

  const handleDelete = () => {
    alert('Pedido excluído');
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Cadastrar Pedido</h2>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}
      {sucesso && <p className="text-green-600 mb-4">{sucesso}</p>}

      <div className="mb-4">
        <label className="block text-gray-700">Cliente:</label>
        <input
          type="text"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Produto:</label>
        <input
          type="text"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Quantidade:</label>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="flex space-x-4">
        <Button label="Salvar" onClick={handleSave} variant="primary" />
        <Button label="Cancelar" onClick={handleCancel} variant="secondary" />
        <Button label="Excluir" onClick={handleDelete} variant="danger" disabled />
      </div>
    </div>
  );
};

export default PedidoForm;