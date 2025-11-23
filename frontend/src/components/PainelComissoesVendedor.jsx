import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente que exibe o total de comissões por vendedor
const PainelComissoesVendedor = ({ filtros }) => {
  const [comissoes, setComissoes] = useState([]);

  // Requisição ao backend com filtros aplicados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/comissoes-vendedores', { params: filtros })
      .then(res => setComissoes(res.data))
      .catch(err => console.error('Erro ao carregar comissões:', err));
  }, [filtros]);

  // Se não houver dados, não renderiza nada
  if (!comissoes.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">💰 Painel de Comissões por Vendedor</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comissoes.map((item, index) => (
          <div key={index} className="border rounded p-4 shadow bg-white">
            <h4 className="font-bold text-lg mb-2">{item.vendedor}</h4>
            <p><strong>Total de Vendas:</strong> R$ {item.totalVendas.toFixed(2)}</p>
            <p><strong>Comissão (%):</strong> {item.percentualComissao}%</p>
            <p><strong>Comissão Ganha:</strong> R$ {item.valorComissao.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PainelComissoesVendedor;
