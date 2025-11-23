// ==========================
// 📌 Importações principais
// ==========================
const express = require('express');
const router = express.Router();
const contatoController = require('../controllers/contatoController');

// Exemplo: salvar mensagens em memória (ou banco de dados futuramente)
let mensagens = [];

// ==========================
// 📬 Rota de envio de contato
// ==========================
router.post('/', (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Salva mensagem (aqui apenas em memória)
  const novaMensagem = { id: mensagens.length + 1, nome, email, mensagem, data: new Date() };
  mensagens.push(novaMensagem);

  // Retorna sucesso
  res.status(201).json({ sucesso: true, msg: 'Mensagem recebida com sucesso!', mensagem: novaMensagem });
});

// ==========================
// 📖 Rota para listar mensagens (admin)
// ==========================
router.get('/', (req, res) => {
  res.json(mensagens);
});

// ==========================
// 📬 Rotas de contato
// ==========================
router.post('/', contatoController.enviarMensagem);
router.get('/', contatoController.listarMensagens);

module.exports = router;
