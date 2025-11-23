// ==========================
// 🔐 Componente PrivateRoute
// ==========================
// Este componente protege rotas da aplicação React.
// Ele garante que:
// 1. O usuário esteja autenticado (token válido e usuário presente).
// 2. Opcionalmente, que o usuário tenha o perfil correto (ex.: "admin" ou "gerente").
// Caso contrário, redireciona para login ou para uma página de "não autorizado".
// ==========================

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, requiredRole }) => {
  // Pega informações do contexto de autenticação
  const { usuario, token, loading } = useContext(AuthContext);

  // ==========================
  // ⏳ Estado de carregamento
  // ==========================
  // Enquanto verifica se há sessão ativa (ex.: checando token no localStorage ou API),
  // evita renderizar a rota antes da confirmação.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ==========================
  // 🔓 Verificação de login
  // ==========================
  // Se não estiver logado (sem token ou sem usuário) → redireciona para login
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // ==========================
  // 🛡️ Verificação de perfil
  // ==========================
  // Se a rota exigir perfil específico:
  // - `requiredRole` pode ser string ("admin") ou array (["admin","gerente"])
  // - `usuario.perfil` deve corresponder a um dos perfis permitidos
  if (requiredRole) {
    const rolesPermitidos = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    // Normaliza perfil para evitar problemas de maiúsculas/minúsculas
    const perfilUsuario = usuario.perfil?.toLowerCase();

    const perfisPermitidosNormalizados = rolesPermitidos.map(r => r.toLowerCase());

    if (!perfisPermitidosNormalizados.includes(perfilUsuario)) {
      // Se não tiver permissão → redireciona para página de "não autorizado"
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ==========================
  // ✅ Acesso autorizado
  // ==========================
  // Caso esteja logado e tenha permissão, renderiza o conteúdo protegido
  return children;
};

export default PrivateRoute;
