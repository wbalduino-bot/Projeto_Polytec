// ==========================
// 🚫 Unauthorized.jsx
// ==========================
// Página exibida quando o usuário tenta acessar uma rota sem permissão.
// Mostra uma mensagem clara e oferece botão para voltar ao Dashboard ou Menu.
// ==========================

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Ícone de alerta */}
      <div className="text-6xl mb-4">🚫</div>

      {/* Mensagem principal */}
      <h1 className="text-3xl font-bold text-red-600 mb-2">
        Acesso não autorizado
      </h1>

      {/* Mensagem secundária */}
      <p className="text-gray-700 mb-6 text-center max-w-md">
        Você não possui permissão para acessar esta página. 
        Caso precise de acesso, entre em contato com o administrador do sistema.
      </p>

      {/* Botões de navegação */}
      <div className="flex gap-4">
        {/* Voltar ao Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Ir para Dashboard
        </button>

        {/* Voltar ao Menu Principal */}
        <button
          onClick={() => navigate('/menu')}
          className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
        >
          Ir para Menu
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
