// ==========================
// 📌 Importações principais
// ==========================
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// ==========================
// 👤 Componente de Perfil
// ==========================
function Perfil() {
  // Acesso ao contexto de autenticação
  const { usuario, token } = useContext(AuthContext);

  // Estado local para dados atualizados do perfil
  const [perfil, setPerfil] = useState(usuario);
  const [mensagem, setMensagem] = useState('');

  // ==========================
  // 🔄 Carrega dados do perfil do backend
  // ==========================
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch('http://localhost:3001/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setPerfil(data.usuario || usuario);
      } catch (err) {
        setMensagem('Erro ao carregar perfil');
      }
    };

    if (token) fetchPerfil();
  }, [token, usuario]);

  // ==========================
  // ✏️ Atualiza perfil (nome/email)
  // ==========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: perfil.nome, email: perfil.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao atualizar perfil');

      setMensagem('Perfil atualizado com sucesso!');
    } catch (err) {
      setMensagem(err.message);
    }
  };

  // ==========================
  // 🎨 Renderização
  // ==========================
  if (!perfil) {
    return <p>Carregando informações do usuário...</p>;
  }

  return (
    <div className="perfil-container max-w-md mx-auto mt-10 bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Oraculo - Perfil do Usuário</h2>

      {/* Mensagem de feedback */}
      {mensagem && <p className="text-blue-600 mb-4 text-center">{mensagem}</p>}

      {/* Dados do usuário */}
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700">ID:</label>
          <p className="bg-gray-100 px-3 py-2 rounded">{perfil.id}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Nome:</label>
          <input
            type="text"
            value={perfil.nome || ''}
            onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={perfil.email || ''}
            onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Botão de atualização */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Atualizar Perfil
        </button>
      </form>
    </div>
  );
}

export default Perfil;
