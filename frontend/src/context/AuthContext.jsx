// ==========================
// 📌 Importações principais
// ==========================
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// ==========================
// 🔐 Criação do contexto
// ==========================
// Este contexto fornece informações de autenticação (usuário, token, perfil)
// e funções utilitárias (login, logout) para toda a aplicação.
export const AuthContext = createContext();

// ==========================
// 🌐 Provedor de autenticação
// ==========================
export const AuthProvider = ({ children }) => {
  // Estado para armazenar o usuário logado (objeto retornado pelo backend)
  const [usuario, setUsuario] = useState(null);

  // Estado para armazenar o token JWT
  const [token, setToken] = useState(null);

  // Estado de carregamento inicial (true até verificar localStorage)
  const [loading, setLoading] = useState(true);

  // ==========================
  // 🔄 Recupera dados salvos no localStorage ao carregar
  // ==========================
  useEffect(() => {
    try {
      const tokenSalvo = localStorage.getItem('token');
      const userData = localStorage.getItem('usuario');

      if (tokenSalvo && userData) {
        setToken(tokenSalvo);
        setUsuario(JSON.parse(userData)); // Converte string JSON para objeto
      }
    } catch (err) {
      console.error('❌ Erro ao carregar dados de autenticação:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================
  // 🔑 Função de login
  // ==========================
  const login = (novoToken, usuarioData) => {
    // Atualiza estados locais
    setToken(novoToken);
    setUsuario(usuarioData);

    // Persiste dados no localStorage
    localStorage.setItem('token', novoToken);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));

    // ==========================
    // 🔔 Configuração de notificações push (opcional)
    // ==========================
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array('SUA_CHAVE_PUBLICA_VAPID') // ⚠️ Substitua pela sua chave real
            }).then(subscription => {
              // Envia inscrição para o backend, associando ao usuário logado
              axios.post(`${process.env.REACT_APP_API_URL}/subscribe`, subscription, {
                headers: { Authorization: `Bearer ${novoToken}` }
              }).catch(err => {
                console.error("❌ Erro ao registrar push notification:", err);
              });
            });
          }
        });
      });
    }
  };

  // ==========================
  // 🛠️ Utilitário: converte chave VAPID base64 → Uint8Array
  // ==========================
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  };

  // ==========================
  // 🚪 Função de logout
  // ==========================
  const logout = () => {
    // Limpa estados locais
    setToken(null);
    setUsuario(null);

    // Remove dados persistidos
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  // ==========================
  // 📤 Exporta valores e funções para toda a aplicação
  // ==========================
  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
  