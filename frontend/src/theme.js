// ============================
// 📂 theme.js
// ============================
// Arquivo central de tema global do Material UI
// Configura cores, tipografia e estilos da empresa
// ============================

import { createTheme } from '@mui/material/styles';

// 🔹 Função que gera o tema com base no modo (light/dark)
// Mantemos como export default para simplificar o import no App.jsx
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode, // alterna entre 'light' e 'dark'

      // 🔹 Cores principais da identidade visual
      primary: {
        main: '#C0392B', // vermelho institucional
      },
      secondary: {
        main: '#2C3E50', // cinza escuro/azulado
      },

      // 🔹 Cores de fundo
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },

      // 🔹 Cores de texto
      text: {
        primary: mode === 'light' ? '#2C3E50' : '#ffffff',
        secondary: mode === 'light' ? '#7f8c8d' : '#bdc3c7',
      },
    },

    // 🔹 Tipografia global
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h6: {
        fontWeight: 600, // títulos mais destacados
      },
    },
  });

// Exportamos como default para importar direto com:
// import getTheme from './theme';
export default getTheme;
