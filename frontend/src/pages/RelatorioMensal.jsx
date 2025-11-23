// ============================
// 📊 RelatorioMensal.jsx
// ============================
// Página de relatórios mensais.
// Busca dados reais do banco via API.
// ============================

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // 🔐 Para pegar token do usuário
import axios from 'axios';

function RelatorioMensal() {
  const { token } = useContext(AuthContext); // pega token do usuário logado
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // 🔄 Carregar dados do relatório mensal
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/relatorios/mensal`, // 🔗 endpoint da sua API
          {
            headers: { Authorization: `Bearer ${token}` }, // envia token no header
          }
        );
        setDados(response.data); // popula estado com dados reais
      } catch (err) {
        setErro('Erro ao carregar relatório mensal');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDados();
  }, [token]);

  if (loading) return <p>Carregando relatório mensal...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Relatório Mensal</h2>

      {/* Exemplo simples de tabela */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Cliente</th>
            <th className="px-4 py-2 border">Total de Vendas</th>
            <th className="px-4 py-2 border">Data</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border">{item.cliente}</td>
              <td className="px-4 py-2 border">R$ {item.total}</td>
              <td className="px-4 py-2 border">{item.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RelatorioMensal;
