// ============================
// 📂 ThemeToggle.jsx
// ============================
// Botão para alternar entre tema claro e escuro.
// Usa o contexto do Material UI para atualizar o tema global.
// ============================

import React, { useState, useMemo } from 'react';
import { IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from '../../theme'; // ✅ importa função que gera tema (light/dark)

// Este componente envolve seus filhos com ThemeProvider
// e adiciona um botão para alternar entre light/dark
function ThemeToggle({ children }) {
  // Estado para controlar o modo atual
  const [mode, setMode] = useState('light');

  // Cria o tema dinamicamente com base no modo
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Alterna entre light e dark
  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Renderiza toda a aplicação */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Botão de toggle no topo */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </div>

        {/* Conteúdo da aplicação */}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </ThemeProvider>
  );
}

export default ThemeToggle;
