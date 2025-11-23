import React, { useState, useEffect } from 'react';
import Button from './Button';

const EstoqueForm = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState('');

  // Buscar produtos ao carregar o componente
  useEffect(() => {
    fetch('http://localhost:3001/api/produtos')
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error('Erro ao buscar produtos:', err));
  }, []);

  const handleUpdate = async () => {
    if (!produtoSelecionado || !quantidade) {
      alert('Selecione um produto e informe a nova quantidade.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/produtos/${produtoSelecionado}/estoque`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: Number(quantidade) }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar estoque');
      }

      const resultado = await response.json();
      alert(`Estoque atualizado: ${resultado.produto.nome} → ${resultado.produto.estoque} unidades`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setProdutoSelecionado('');
    setQuantidade('');
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-center">Atualizar Estoque</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Produto:</label>
        <select
          value={produtoSelecionado}
          onChange={(e) => setProdutoSelecionado(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        >
          <option value="">Selecione um produto</option>
          {produtos.map((produto) => (
            <option key={produto._id} value={produto._id}>
              {produto.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Nova Quantidade:</label>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="flex space-x-4">
        <Button label="Atualizar" onClick={handleUpdate} variant="primary" />
        <Button label="Cancelar" onClick={handleCancel} variant="secondary" />
      </div>
    </div>
  );
};

export default EstoqueForm;