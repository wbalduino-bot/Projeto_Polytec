import React, { useState, useEffect } from 'react';

/**
 * Painel exclusivo para vendedores
 * - Lista os leads atribuídos ao vendedor logado
 * - Permite registrar interações (ligação, e-mail, visita, mensagem)
 * - Mostra status atual de cada lead
 */
const PainelDoVendedor = ({ perfil, filtros }) => {
  const [leads, setLeads] = useState([]);          // Leads atribuídos ao vendedor
  const [interacao, setInteracao] = useState('');  // Texto da interação
  const [tipo, setTipo] = useState('ligacao');     // Tipo de interação (default: ligação)

  // 🔄 Carrega os leads atribuídos ao vendedor logado
  useEffect(() => {
    fetch(`http://localhost:3001/distribuicao-leads/vendedor/${perfil.id}`)
      .then(res => res.json())
      .then(setLeads)
      .catch(err => console.error('Erro ao carregar leads:', err));
  }, [perfil.id]);

  // 📌 Função para registrar uma interação com um lead
  const registrarInteracao = (leadId) => {
    fetch('http://localhost:3001/interacoes-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: leadId,
        vendedor_id: perfil.id,
        tipo,
        descricao: interacao
      })
    })
      .then(res => res.json())
      .then(() => {
        alert(`Interação registrada com sucesso para o lead ${leadId}`);
        setInteracao('');
      })
      .catch(err => console.error('Erro ao registrar interação:', err));
  };

  return (
    <div className="bg-white shadow-md rounded p-4 mt-6">
      <h3 className="text-xl font-bold mb-4">Painel do Vendedor</h3>
      <p className="text-gray-600 mb-4">
        Aqui você encontra os leads atribuídos a você e pode registrar interações.
      </p>

      {/* Lista de leads atribuídos */}
      {leads.length === 0 ? (
        <p>Nenhum lead atribuído até o momento.</p>
      ) : (
        <ul className="space-y-4">
          {leads.map((lead) => (
            <li key={lead.id} className="border p-3 rounded">
              <p><strong>Nome:</strong> {lead.nome}</p>
              <p><strong>Contato:</strong> {lead.contato}</p>
              <p><strong>Status:</strong> {lead.status}</p>
              <p><strong>Origem:</strong> {lead.origem || 'Não informada'}</p>

              {/* Formulário rápido para registrar interação */}
              <div className="mt-2">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="border rounded px-2 py-1 mr-2"
                >
                  <option value="ligacao">Ligação</option>
                  <option value="email">E-mail</option>
                  <option value="visita">Visita</option>
                  <option value="mensagem">Mensagem</option>
                </select>
                <input
                  type="text"
                  placeholder="Descrição da interação"
                  value={interacao}
                  onChange={(e) => setInteracao(e.target.value)}
                  className="border rounded px-2 py-1 mr-2"
                />
                <button
                  onClick={() => registrarInteracao(lead.lead_id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Registrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PainelDoVendedor;
