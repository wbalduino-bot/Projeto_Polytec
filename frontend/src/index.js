// 📦 Importa o React e o ReactDOM para renderizar a aplicação
import React from 'react';
import ReactDOM from 'react-dom/client';

// 🧠 Importa tailwind.css
import './styles/tailwind.css';

import './index.css';


// 🧠 Importa o AuthProvider para fornecer o contexto de autenticação
import { AuthProvider } from './context/AuthContext';

// 🎨 Importa o ThemeProvider do Material UI e o tema global
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// 🧩 Importa o componente principal da aplicação
// O App já inclui o HashRouter internamente, então não usamos BrowserRouter aqui
import App from './App';

// 🎯 Renderiza o App dentro da div com id="root"
// Envolvido pelo AuthProvider (autenticação) e ThemeProvider (tema global)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </AuthProvider>
);
