// ==========================
// 📌 Importações principais
// ==========================
import React, { useState, useContext } from 'react';
import Button from '../Button';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ==========================
// 🔐 Componente de Login
// ==========================
// Este componente renderiza o formulário de login.
// Após autenticação bem-sucedida, redireciona o usuário para /menu,
// onde está o portal principal com todas as funcionalidades.
const LoginForm = () => {
  // Estados locais para email, senha e mensagens de erro
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Acesso ao contexto de autenticação (função login)
  const { login } = useContext(AuthContext);

  // Hook para navegação pós-login
  const navigate = useNavigate();

  // ==========================
  // 🔑 Função de login
  // ==========================
  const handleLogin = async (e) => {
    e.preventDefault(); // evita reload da página
    setErro('');        // limpa erros anteriores

    try {
      // Faz requisição ao backend para autenticar usuário
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      // Valida resposta do backend
      if (!response.ok || !data.token) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // ✅ Salva token JWT no localStorage
      localStorage.setItem('token', data.token);

      // ✅ Atualiza contexto com token e dados do usuário
      login(data.token, data.usuario);

      // Feedback visual simples
      alert('✅ Login realizado com sucesso!');

      // Redireciona para o MenuPrincipal (portal inicial)
      navigate('/menu');
    } catch (err) {
      // Exibe mensagem de erro
      setErro(err.message);
    }
  };

  // ==========================
  // 🎨 Renderização
  // ==========================
  return (
    <div className="max-w-sm mx-auto mt-20 bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      {/* Mensagem de erro */}
      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      {/* Formulário de login */}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700">E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* Botão reutilizável */}
        <Button label="Entrar" type="submit" variant="primary" />
      </form>
    </div>
  );
};

export default LoginForm;
