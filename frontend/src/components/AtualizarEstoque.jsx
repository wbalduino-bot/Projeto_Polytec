import React, { useState } from 'react';
import api from '../services/api';

function AtualizarEstoque() {
  const [id, setId] = useState('');
  const [quantidade, setQuantidade] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/produtos/${id}/estoque`, { quantidade: parseInt(quantidade) });
      alert('Estoque atualizado!');
    } catch (error) {
      alert('Erro ao atualizar estoque');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Atualizar Estoque</h2>
      <input placeholder="ID do Produto" value={id} onChange={(e) => setId(e.target.value)} />
      <input type="number" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
      <button type="submit">Atualizar</button>
    </form>
  );
}

export default AtualizarEstoque;
