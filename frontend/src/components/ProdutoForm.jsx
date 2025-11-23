import React, { useState } from 'react';
import Button from './Button';

const ProdutoForm = () => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  const handleSave = () => {
    alert(`Produto salvo: ${nome} - R$ ${preco}`);
  };

  const handleCancel = () => {
    setNome('');
    setPreco('');
  };

  const handleDelete = () => {
    alert('Produto excluído');
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Cadastrar Produto</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700">Preço:</label>
        <input
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
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

export default ProdutoForm;