import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente de filtro para o dashboard: permite filtrar por data, cliente e tipo de transação
const FiltroDashboard = ({ onFiltrar }) => {
  const [clientes, setClientes] = useState([]); // Lista de clientes para o dropdown
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    clienteId: '',
    tipoTransacao: '' // Novo campo: tipo de transação (pedido, pagamento, etc.)
  });

  // Carrega a lista de clientes ao montar o componente
  useEffect(() => {
    axios.get('http://localhost:3001/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error('Erro ao carregar clientes:', err));
  }, []);

  // Dispara o callback com os filtros selecionados
  const aplicarFiltro = () => {
    onFiltrar(filtros);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-end">
      {/* Campo: Data de início */}
      <div>
        <label className="block text-sm">Data Início</label>
        <input
          type="date"
          value={filtros.dataInicio}
          onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Campo: Data de fim */}
      <div>
        <label className="block text-sm">Data Fim</label>
        <input
          type="date"
          value={filtros.dataFim}
          onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Campo: Cliente */}
      <div>
        <label className="block text-sm">Cliente</label>
        <select
          value={filtros.clienteId}
          onChange={e => setFiltros({ ...filtros, clienteId: e.target.value })}
          className="border px-2 py-1 rounded"
        >
          <option value="">Todos</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      {/* Campo: Tipo de transação */}
      <div>
        <label className="block text-sm">Tipo de Transação</label>
        <select
          value={filtros.tipoTransacao}
          onChange={e => setFiltros({ ...filtros, tipoTransacao: e.target.value })}
          className="border px-2 py-1 rounded"
        >
          <option value="">Todos</option>
          <option value="pedido">Pedidos</option>
          <option value="pagamento">Pagamentos</option>
          <option value="interacao">Interações</option>
        </select>
      </div>

      {/* Botão de aplicar filtro */}
      <button onClick={aplicarFiltro} className="btn">
        Filtrar
      </button>
    </div>
  );
};

export default FiltroDashboard;
