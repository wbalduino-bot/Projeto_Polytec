// ============================
// Controller de Reembolsos
// ============================

const Reembolso = require('../models/reembolsoModel');

/**
 * 📌 Criar pedido de reembolso
 * Método: POST /reembolsos
 * Corpo esperado: { usuario_id, nota_fiscal, valor }
 * - Valida campos obrigatórios
 * - Insere na tabela 'reembolsos' com status inicial 'pendente'
 */
exports.criarReembolso = async (req, res) => {
  try {
    const { usuario_id, nota_fiscal, valor } = req.body;

    if (!usuario_id || !nota_fiscal || !valor) {
      return res.status(400).json({
        sucesso: false,
        error: 'Campos obrigatórios: usuario_id, nota_fiscal, valor'
      });
    }

    const id = await Reembolso.criar(usuario_id, nota_fiscal, valor);

    res.status(201).json({
      sucesso: true,
      msg: '✅ Reembolso criado com sucesso',
      reembolso: { id, usuario_id, nota_fiscal, valor, status: 'pendente' }
    });
  } catch (error) {
    console.error('❌ Erro ao criar reembolso:', error.message);
    res.status(500).json({ sucesso: false, error: error.message });
  }
};

/**
 * 📋 Listar todos os pedidos de reembolso
 * Método: GET /reembolsos
 * - Retorna todos os registros ordenados pela data do pedido
 */
exports.listarReembolsos = async (req, res) => {
  try {
    const reembolsos = await Reembolso.listarTodos();
    res.json({ sucesso: true, reembolsos });
  } catch (error) {
    console.error('❌ Erro ao listar reembolsos:', error.message);
    res.status(500).json({ sucesso: false, error: error.message });
  }
};

/**
 * 🔎 Buscar pedido de reembolso por ID
 * Método: GET /reembolsos/:id
 * - Retorna o registro correspondente se existir
 */
exports.buscarReembolsoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const reembolso = await Reembolso.buscarPorId(id);

    if (!reembolso) {
      return res.status(404).json({ sucesso: false, error: 'Reembolso não encontrado' });
    }

    res.json({ sucesso: true, reembolso });
  } catch (error) {
    console.error('❌ Erro ao buscar reembolso:', error.message);
    res.status(500).json({ sucesso: false, error: error.message });
  }
};

/**
 * ✏️ Atualizar status de um pedido de reembolso
 * Método: PUT /reembolsos/:id
 * Corpo esperado: { status, observacao? }
 */
exports.atualizarStatusReembolso = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observacao } = req.body;

    if (!status) {
      return res.status(400).json({ sucesso: false, error: 'Campo obrigatório: status' });
    }

    const atualizado = await Reembolso.atualizarStatus(id, status, observacao);

    if (!atualizado) {
      return res.status(404).json({ sucesso: false, error: 'Reembolso não encontrado' });
    }

    res.json({ sucesso: true, msg: '✅ Status atualizado com sucesso', id, status, observacao });
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error.message);
    res.status(500).json({ sucesso: false, error: error.message });
  }
};

/**
 * 🗑️ Excluir pedido de reembolso
 * Método: DELETE /reembolsos/:id
 */
exports.excluirReembolso = async (req, res) => {
  try {
    const { id } = req.params;
    const excluido = await Reembolso.excluir(id);

    if (!excluido) {
      return res.status(404).json({ sucesso: false, error: 'Reembolso não encontrado' });
    }

    res.json({ sucesso: true, msg: `✅ Reembolso ${id} excluído com sucesso` });
  } catch (error) {
    console.error('❌ Erro ao excluir reembolso:', error.message);
    res.status(500).json({ sucesso: false, error: error.message });
  }
};
