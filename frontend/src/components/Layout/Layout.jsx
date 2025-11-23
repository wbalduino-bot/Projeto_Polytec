// ============================
// 📂 Layout.jsx
// ============================
// Estrutura principal da aplicação.
// Contém Header fixo no topo, Sidebar fixa à esquerda
// e área central para renderizar as páginas.
// ============================

import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <>
    <Box sx={{ display: 'flex' }}>
      {/* Header fixo no topo */}
      <header>Header aqui</header>

      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Área principal onde as páginas são renderizadas */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,       // Faz o conteúdo ocupar todo espaço restante
          p: 3,              // Padding interno
          mt: 8,             // Margem superior para não ficar atrás do Header
          ml: 30,            // Margem esquerda para não ficar atrás da Sidebar
          backgroundColor: 'background.default', // Usa cor do tema
          minHeight: '100vh' // Garante altura mínima de tela cheia
        }}
      >
        {children}
      </Box>
    </Box>
    </>
  );
}

export default Layout;
