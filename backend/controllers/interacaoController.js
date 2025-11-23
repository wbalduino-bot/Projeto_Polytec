// backend/controllers/interacaoController.js

const Interacao = require('../models/Interacao');
const Cliente = require('../models/Cliente');

/**
 * Cria uma nova interação associada a um cliente.
 * Método: POST /interacoes
 */
exports.criarInteracao = async (req, res) => {
  try {
    const { clienteId, tipo, descricao, data } = req.body;

    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    const interacao = await Interacao.create({ clienteId, tipo, descricao, data });
    res.status(201).json(interacao);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

/**
 * Lista todas as interações com dados do cliente.
 * Método: GET /interacoes
 */
exports.listarInteracoes = async (req, res) => {
  try {
    const interacoes = await Interacao.findAll({ include: Cliente });
    res.json(interacoes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
