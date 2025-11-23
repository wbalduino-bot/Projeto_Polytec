// ==========================
// 📌 Importações principais
// ==========================
import React, { useState } from 'react';

// ==========================
// 📬 Página de Contato
// ==========================
const Contato = () => {
  // Estados para armazenar dados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [feedback, setFeedback] = useState('');

  // ==========================
  // 📤 Função de envio do formulário
  // ==========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui você pode integrar com backend ou serviço de email
    // Exemplo: axios.post(`${process.env.REACT_APP_API_URL}/contato`, { nome, email, mensagem })

    setFeedback('✅ Mensagem enviada com sucesso!');
    setNome('');
    setEmail('');
    setMensagem('');
  };

  // ==========================
  // 🎨 Renderização
  // ==========================
  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Entre em Contato</h2>

      {/* Feedback visual */}
      {feedback && <p className="text-green-600 mb-4 text-center">{feedback}</p>}

      {/* Formulário de contato */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          placeholder="Digite sua mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows="4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>

      {/* Informações adicionais */}
      <div className="mt-6 text-center text-gray-600">
        <p>Email: suporte@polytec.com</p>
        <p>Telefone: (11) 99999-9999</p>
      </div>
    </div>
  );
};

export default Contato;
