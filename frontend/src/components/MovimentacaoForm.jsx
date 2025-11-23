import React, { useState, useEffect } from 'react';
import api from '../services/api';

function MovimentacaoForm() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    produto_id: '',
    tipo: 'entrada',
    quantidade: 0,
    observacao: '',
  });

  useEffect(() => {
    api.get('/produtos').then((res) => setProdutos(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movimentacoes', form);
      alert('Movimentação registrada!');
    } catch (error) {
      alert('Erro ao registrar movimentação');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Movimentação</h2>
      <select name="produto_id" onChange={handleChange} required>
        <option value="">Selecione o produto</option>
        {produtos.map((p) => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>
      <select name="tipo" onChange={handleChange}>
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>
      <input type="number" name="quantidade" placeholder="Quantidade" onChange={handleChange} required />
      <input name="observacao" placeholder="Observação" onChange={handleChange} />
      <button type="submit">Registrar</button>
    </form>
  );
}

export default MovimentacaoForm;
