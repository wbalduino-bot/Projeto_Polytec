import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ProdutoLista() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    api.get('/produtos').then((res) => setProdutos(res.data));
  }, []);

  return (
    <div>
      <h2>Lista de Produtos</h2>
      <ul>
        {produtos.map((p) => (
          <li key={p.id}>
            {p.nome} - Estoque: {p.estoque_atual}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutoLista;
