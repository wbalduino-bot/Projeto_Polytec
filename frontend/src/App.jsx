// ==========================
// 📌 Importações principais
// ==========================
import React, { useContext, useEffect, useState } from 'react';
import {
  HashRouter,   // Router baseado em hash (#) → útil para deploy em ambientes sem suporte à history API
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import axios from 'axios';

// Biblioteca de notificações visuais (toasts)
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexto de autenticação para acessar dados do usuário logado
import { AuthContext } from './context/AuthContext';

// ==========================
// 🔗 Componentes visuais reutilizáveis
// ==========================
import Layout from './components/Layout/Layout'; // ✅ Layout centralizado (Header + Sidebar + Conteúdo)

// ==========================
// 🔐 Componentes de autenticação
// ==========================
import LoginForm from './components/Auth/LoginForm';
import Cadastro from './components/Cadastro';
import Usuarios from './components/Usuarios';
import Perfil from './components/Perfil';

// ==========================
// 📊 Funcionalidades principais
// ==========================
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import HistoricoBoletos from './components/HistoricoBoletos';
import GerarBoletoForm from './components/GerarBoletoForm';
import EstatisticasBoletos from './components/EstatisticasBoletos';

// ==========================
// 🛠️ Painel administrativo e auditoria
// ==========================
import PainelAdmin from './components/PainelAdmin';
import AuditoriaLogs from './components/AuditoriaLogs';

// 🚫 Página de erro para rotas não encontradas
import NotFound from './pages/NotFound';

// 🔐 Componente para proteger rotas
import PrivateRoute from './routes/PrivateRoute';

// 📞 Página Contato
import Contato from './pages/Contato';

// 📋 Tela inicial com menu principal
import MenuPrincipal from './pages/MenuPrincipal';

// ==========================
// 📊 Subpáginas de Relatórios
// ==========================
import RelatorioMensal from './pages/RelatorioMensal';

// ==========================
// 🎨 Tema (Material UI)
// ==========================
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme';

// ==========================
// 🌐 Componente principal da aplicação
// ==========================
const App = () => {
  const { usuario } = useContext(AuthContext);
  const [mode, setMode] = useState('light'); // ✅ controle de tema claro/escuro

  // ==========================
  // 🔔 Configuração de Push Notifications
  // ==========================
  useEffect(() => {
    if (usuario && 'serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array('SUA_CHAVE_PUBLICA_VAPID')
            }).then(subscription => {
              axios.post(`${process.env.REACT_APP_API_URL}/subscribe`, subscription, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              });
            });
          }
        });
      });
    }
  }, [usuario]);

  // Função utilitária para converter chave VAPID
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  };

  // ==========================
  // 🎨 Renderização principal
  // ==========================
  return (
    <ThemeProvider theme={getTheme('light')}>
      <CssBaseline />
      <HashRouter basename="/Projeto_Polytec">
        <Routes>
          {/* 🔓 Rotas públicas (sem Layout) */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contato" element={<Contato />} />

          {/* 🔐 Rotas privadas (com Layout) */}
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Layout>
                  <MenuPrincipal />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Layout>
                  <Perfil />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/cadastro-usuario"
            element={
              <PrivateRoute requiredRole="admin">
                <Layout>
                  <Cadastro />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute requiredRole="admin">
                <Layout>
                  <Usuarios />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <Layout>
                  <PainelAdmin />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/auditoria"
            element={
              <PrivateRoute requiredRole="admin">
                <Layout>
                  <AuditoriaLogs />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* 📊 Funcionalidades principais */}
          <Route
            path="/gerar-boleto"
            element={
              <PrivateRoute>
                <Layout>
                  <GerarBoletoForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/historico"
            element={
              <PrivateRoute>
                <Layout>
                  <HistoricoBoletos />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/estatisticas"
            element={
              <PrivateRoute>
                <Layout>
                  <EstatisticasBoletos />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* 📊 Relatórios */}
          <Route
            path="/relatorios/mensal"
            element={
              <PrivateRoute>
                <Layout>
                  <RelatorioMensal />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* 🚫 Página não encontrada */}
          <Route path="/unauthorized" element={<h2>Acesso não autorizado 🚫</h2>} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Notificações visuais (toasts) */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={3}
        />
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
