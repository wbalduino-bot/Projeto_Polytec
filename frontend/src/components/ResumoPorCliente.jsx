import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente que exibe um painel de resumo por cliente com indicadores agregados
const ResumoPorCliente = ({ filtros }) => {
  const [resumo, setResumo] = useState([]); // Estado para armazenar os dados do backend

  // Requisição ao backend sempre que os filtros forem alterados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/resumo-por-cliente', { params: filtros })
      .then(res => setResumo(res.data)) // Atualiza o estado com os dados recebidos
      .catch(err => console.error('Erro ao carregar resumo por cliente:', err)); // Log de erro
  }, [filtros]); // Dependência: atualiza quando os filtros mudam

  // Exibe mensagem se nenhum dado for retornado
  if (!resumo.length) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Nenhum dado encontrado para os filtros aplicados.
      </p>
    );
  }

  // Renderiza os cards de resumo por cliente
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {resumo.map((cliente, index) => (
        <div key={index} className="bg-white shadow rounded p-4 border">
          <h3 className="text-lg font-semibold mb-2">{cliente.nome}</h3> {/* Nome do cliente */}
          <p><strong>Pedidos:</strong> {cliente.totalPedidos}</p>         {/* Total de pedidos */}
          <p><strong>Pagamentos:</strong> {cliente.totalPagamentos}</p>   {/* Total de pagamentos */}
          <p><strong>Valor Total:</strong> R$ {cliente.valorTotal.toFixed(2)}</p> {/* Valor movimentado */}
          <p><strong>Status:</strong> {cliente.status}</p>                {/* Status geral do cliente */}
        </div>
      ))}
    </div>
  );
};

export default ResumoPorCliente;
