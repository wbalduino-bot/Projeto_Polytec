import React, { useEffect, useState } from 'react';
import api from '../services/api';

function MovimentacaoLista() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState({ produto_id: '', tipo: '' });

  useEffect(() => {
    api.get('/produtos').then((res) => setProdutos(res.data));
    buscarMovimentacoes();
  }, []);

  const buscarMovimentacoes = async () => {
    const params = {};
    if (filtro.produto_id) params.produto_id = filtro.produto_id;
    if (filtro.tipo) params.tipo = filtro.tipo;

    const res = await api.get('/movimentacoes', { params });
    setMovimentacoes(res.data);
  };

  return (
    <div>
      <h2>Histórico de Movimentações</h2>
      <div>
        <select onChange={(e) => setFiltro({ ...filtro, produto_id: e.target.value })}>
          <option value="">Todos os produtos</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <select onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}>
          <option value="">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <button onClick={buscarMovimentacoes}>Filtrar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((m) => (
            <tr key={m.id}>
              <td>{m.Produto?.nome}</td>
              <td>{m.tipo}</td>
              <td>{m.quantidade}</td>
              <td>{m.observacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovimentacaoLista;

