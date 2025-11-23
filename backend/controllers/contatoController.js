// ==========================
// 📌 Importações principais
// ==========================
const contatoModel = require('../models/contatoModel'); // Modelo de contato

// ==========================
// 📬 Controller de Contato
// ==========================
// Responsável por receber requisições HTTP, validar dados e delegar ao Model
const contatoController = {
  // --------------------------
  // 📤 Enviar mensagem de contato
  // --------------------------
  enviarMensagem: (req, res) => {
    const { nome, email, mensagem } = req.body;

    // Validação simples dos campos obrigatórios
    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Chama o Model para salvar no banco
    contatoModel.criar(nome, email, mensagem, (err, novoContato) => {
      if (err) {
        console.error('Erro ao salvar mensagem:', err);
        return res.status(500).json({ error: 'Erro interno ao salvar mensagem.' });
      }

      // Retorna sucesso com os dados da mensagem criada
      res.status(201).json({
        sucesso: true,
        msg: 'Mensagem recebida com sucesso!',
        contato: novoContato
      });
    });
  },

  // --------------------------
  // 📖 Listar todas as mensagens (ex.: admin)
  // --------------------------
  listarMensagens: (req, res) => {
    contatoModel.listarTodos((err, mensagens) => {
      if (err) {
        console.error('Erro ao buscar mensagens:', err);
        return res.status(500).json({ error: 'Erro interno ao buscar mensagens.' });
      }

      // Retorna lista de mensagens
      res.json(mensagens);
    });
  }
};

module.exports = contatoController;
