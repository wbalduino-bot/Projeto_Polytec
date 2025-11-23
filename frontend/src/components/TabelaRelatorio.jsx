import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente responsável por exibir os dados filtrados em formato de tabela
const TabelaRelatorio = ({ filtros }) => {
  const [dados, setDados] = useState([]); // Estado para armazenar os dados recebidos do backend

  // Requisição ao backend sempre que os filtros forem alterados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/relatorio', { params: filtros })
      .then(res => setDados(res.data)) // Atualiza os dados com a resposta da API
      .catch(err => console.error('Erro ao carregar relatório:', err)); // Log de erro em caso de falha
  }, [filtros]); // Dependência: atualiza quando os filtros mudam

  // Exibe mensagem se nenhum dado for retornado
  if (!dados.length) {
    return (
      <p className="text-center mt-4 text-gray-500">
        Nenhum dado encontrado para os filtros selecionados.
      </p>
    );
  }

  // Renderiza a tabela com os dados filtrados
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Data</th>
            <th className="px-4 py-2 text-left">Cliente</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Descrição</th>
            <th className="px-4 py-2 text-left">Valor</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{item.data}</td>               {/* Data da transação */}
              <td className="px-4 py-2">{item.cliente}</td>            {/* Nome do cliente */}
              <td className="px-4 py-2">{item.tipo}</td>               {/* Tipo de registro (pedido, pagamento, etc.) */}
              <td className="px-4 py-2">{item.descricao}</td>          {/* Descrição da transação */}
              <td className="px-4 py-2">R$ {item.valor.toFixed(2)}</td> {/* Valor formatado */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaRelatorio;
