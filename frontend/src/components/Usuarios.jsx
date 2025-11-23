// ==========================
// 📌 Importações principais
// ==========================
import React, { useEffect, useState } from 'react';

// ==========================
// 👥 Componente de Usuários
// ==========================
function Usuarios() {
  // Estado para armazenar lista de usuários
  const [usuarios, setUsuarios] = useState([]);

  // Estado para mensagens de feedback (erro, acesso negado, etc.)
  const [mensagem, setMensagem] = useState('');

  // Estado de carregamento
  const [loading, setLoading] = useState(true);

  // ==========================
  // 🔄 Carrega lista de usuários do backend
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifica se usuário não tem permissão
        if (response.status === 401 || response.status === 403) {
          setMensagem('Acesso negado. Faça login com um perfil autorizado.');
          setUsuarios([]);
          return;
        }

        const data = await response.json();

        // Se backend retorna lista diretamente
        if (Array.isArray(data)) {
          setUsuarios(data);
        }
        // Se backend retorna objeto com sucesso + lista
        else if (data.sucesso && data.usuarios) {
          setUsuarios(data.usuarios);
        } else {
          setMensagem(data.mensagem || 'Erro ao carregar usuários.');
        }
      } catch (err) {
        setMensagem('Erro de conexão com o servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // ==========================
  // 🎨 Renderização
  // ==========================
  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4 text-center">
        Oráculo - Gerenciamento de Usuários
      </h2>

      {/* Mensagem de feedback */}
      {mensagem && <p className="text-red-600 mb-4 text-center">{mensagem}</p>}

      {/* Estado de carregamento */}
      {loading && <p className="text-gray-500 text-center">Carregando usuários...</p>}

      {/* Lista de usuários */}
      {!loading && usuarios.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {usuarios.map((u) => (
            <li key={u.id} className="py-2 flex justify-between">
              <span>
                <strong>{u.nome}</strong> - {u.email} ({u.perfil || 'sem perfil'})
              </span>
              {/* 🔧 Futuro: botões de ação (editar/excluir) */}
              {/* <button className="text-blue-600 hover:underline">Editar</button>
              <button className="text-red-600 hover:underline">Excluir</button> */}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-gray-500 text-center">Nenhum usuário encontrado.</p>
      )}
    </div>
  );
}

export default Usuarios;
