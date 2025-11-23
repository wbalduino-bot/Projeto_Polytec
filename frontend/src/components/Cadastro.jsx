// ==========================
// 📌 Importações principais
// ==========================
import React, { useState } from 'react';

// ==========================
// 🔐 Componente de Cadastro
// ==========================
function Cadastro() {
  // Estado para armazenar os dados do formulário
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'usuario' });

  // Estado para mensagens de feedback (sucesso/erro)
  const [mensagem, setMensagem] = useState('');

  // ==========================
  // 📤 Função de envio do formulário
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita reload da página
    setMensagem('');    // limpa mensagens anteriores

    try {
      // Faz requisição ao backend para registrar usuário
      const response = await fetch(`${process.env.REACT_APP_API_URL}/usuarios/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      // Valida resposta do backend
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }

      // Exibe mensagem de sucesso
      setMensagem(data.msg || '✅ Usuário cadastrado com sucesso!');

      // Limpa formulário após cadastro
      setForm({ nome: '', email: '', senha: '', perfil: 'usuario' });
    } catch (err) {
      // Exibe mensagem de erro
      setMensagem(`❌ ${err.message}`);
    }
  };

  // ==========================
  // 🎨 Renderização
  // ==========================
  return (
    <div className="max-w-sm mx-auto mt-20 bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Cadastro de Usuários</h2>

      {/* Mensagem de feedback */}
      {mensagem && <p className="text-blue-600 mb-4 text-center">{mensagem}</p>}

      {/* Formulário de cadastro */}
      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <div className="mb-4">
          <label className="block text-gray-700">Nome:</label>
          <input
            type="text"
            placeholder="Digite o nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700">E-mail:</label>
          <input
            type="email"
            placeholder="Digite o e-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* Senha */}
        <div className="mb-6">
          <label className="block text-gray-700">Senha:</label>
          <input
            type="password"
            placeholder="Digite a senha"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* Perfil */}
        <div className="mb-6">
          <label className="block text-gray-700">Perfil:</label>
          <select
            value={form.perfil}
            onChange={(e) => setForm({ ...form, perfil: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          >
            <option value="usuario">Usuário</option>
            <option value="vendedor">Vendedor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Botão de envio */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Cadastro;
