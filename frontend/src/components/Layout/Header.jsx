// ============================
// 📂 Header.jsx
// ============================
// Barra superior fixa do sistema.
// Contém título/logo e ícones de perfil, notificações e configurações.
// ============================

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // ✅ Hook para acessar o tema global
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

// ✅ Componente Header
function Header() {
  const theme = useTheme(); // Captura o tema atual (light/dark)

  return (
    <AppBar
      position="fixed"
      color="primary" // Usa a cor primária definida no ThemeProvider
      sx={{ zIndex: 1201 }} // Garante que fique acima da Sidebar
    >
      <Toolbar>
        {/* Título ou logo da aplicação */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1, // Ocupa espaço à esquerda
            fontWeight: 'bold',
            color: theme.palette.common.white, // Força texto branco no header
          }}
        >
          Dashboard Polytec
        </Typography>

        {/* Ícones de ação rápida à direita */}
        <Box>
          {/* Notificações */}
          <IconButton color="inherit" aria-label="notificações">
            <NotificationsIcon />
          </IconButton>

          {/* Configurações */}
          <IconButton color="inherit" aria-label="configurações">
            <SettingsIcon />
          </IconButton>

          {/* Perfil */}
          <IconButton color="inherit" aria-label="perfil">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
