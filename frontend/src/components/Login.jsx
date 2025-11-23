import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // estilos opcionais

function Login() {
  // Estado local para armazenar email e senha digitados
  const [form, setForm] = useState({ email: '', senha: '' });

  // Hook para navegação entre rotas
  const navigate = useNavigate();

  // Contexto de autenticação (fornece função login)
  const { login } = useContext(AuthContext);

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Faz requisição para o backend (endpoint de login)
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      // Se resposta não for OK, lança erro
      if (!res.ok) throw new Error('Erro na resposta do servidor');

      const data = await res.json();

      // Se login foi bem-sucedido e token recebido
      if (data.sucesso && data.token) {
        // Salva token e dados do usuário no contexto
        login(data.token, {
          id: data.id,
          email: form.email,
          tipo: data.tipo // ✅ tipo do usuário (admin, vendedor, cliente)
        });

        // Mostra notificação de sucesso
        toast.success('Login realizado com sucesso!');

        // Redireciona para dashboard após 1,5s
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        // Mostra erro caso credenciais inválidas
        toast.error(data.mensagem || 'Credenciais inválidas');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="login-container">
      {/* Mensagem de boas-vindas */}
      <h2>Você está na tela de Login do Oráculo</h2>
      <h2>Seja Bem-Vindo!</h2>

      {/* Formulário de login */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={e => setForm({ ...form, senha: e.target.value })}
          required
        />
        <button type="submit">Entrar</button>
      </form>

      {/* Container para notificações (toast) */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Login;
