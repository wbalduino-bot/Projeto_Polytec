// ==========================
// 📌 Importações principais
// ==========================
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// ==========================
// 🔐 Componente PrivateRoute
// ==========================
// Este componente protege rotas que exigem autenticação.
// - Se o usuário não estiver logado → redireciona para /login
// - Se a rota exigir perfil específico (ex.: admin) → valida antes de renderizar
// - Caso contrário → renderiza o conteúdo protegido
const PrivateRoute = ({ children, requiredRole }) => {
  const { usuario, token, loading } = useContext(AuthContext);

  // Enquanto verifica se há sessão ativa
  if (loading) {
    return <p>Carregando...</p>;
  }

  // Se não estiver logado → redireciona para login
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Se rota exigir perfil específico (ex.: admin)
  if (requiredRole && usuario.perfil !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Caso contrário, renderiza o conteúdo protegido
  return children;
};

export default PrivateRoute;
