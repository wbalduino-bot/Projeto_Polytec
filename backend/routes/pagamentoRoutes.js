// ============================
// 💳 Rotas de Pagamentos
// ============================
const express = require('express');
const router = express.Router();

// Importa middlewares de autenticação e autorização
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

// Importa o controlador de pagamentos
const {
  registrarPagamento,
  listarPagamentos,
  atualizarStatus,
  gerarBoleto,
} = require('../controllers/pagamentoController');

// Importa logger de auditoria (opcional, para rastrear ações críticas)
const auditLogger = require('../logs/auditLogger');

/**
 * 📝 Registrar novo pagamento
 * Método: POST /pagamentos
 * - Rota protegida: requer token JWT válido
 * - Qualquer usuário autenticado pode registrar pagamento
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    await registrarPagamento(req, res);

    // Log de auditoria
    auditLogger.info({
      action: 'registrar_pagamento',
      performedBy: req.usuario?.id || 'desconhecido',
      perfil: req.usuario?.perfil || 'desconhecido',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erro ao registrar pagamento:', error);
    res.status(500).json({ sucesso: false, error: 'Erro interno ao registrar pagamento' });
  }
});

/**
 * 📋 Listar todos os pagamentos
 * Método: GET /pagamentos
 * - Rota protegida: requer token JWT válido
 * - Apenas admin/gerente podem listar todos os pagamentos
 */
router.get('/', authMiddleware, authorize(['admin', 'gerente']), listarPagamentos);

/**
 * ✏️ Atualizar status de um pagamento
 * Método: PUT /pagamentos/:id/status
 * - Rota protegida: requer token JWT válido
 * - Apenas admin/gerente podem atualizar status
 */
router.put('/:id/status', authMiddleware, authorize(['admin', 'gerente']), async (req, res) => {
  try {
    await atualizarStatus(req, res);

    // Log de auditoria
    auditLogger.info({
      action: 'atualizar_status_pagamento',
      pagamentoId: req.params.id,
      performedBy: req.usuario?.id || 'desconhecido',
      perfil: req.usuario?.perfil || 'desconhecido',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar status do pagamento:', error);
    res.status(500).json({ sucesso: false, error: 'Erro interno ao atualizar status' });
  }
});

/**
 * 💳 Gerar boleto para um pagamento
 * Método: POST /pagamentos/:id/boleto
 * - Rota protegida: requer token JWT válido
 * - Apenas admin/gerente podem gerar boletos
 */
router.post('/:id/boleto', authMiddleware, authorize(['admin', 'gerente']), async (req, res) => {
  try {
    await gerarBoleto(req, res);

    // Log de auditoria
    auditLogger.info({
      action: 'gerar_boleto',
      pagamentoId: req.params.id,
      performedBy: req.usuario?.id || 'desconhecido',
      perfil: req.usuario?.perfil || 'desconhecido',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erro ao gerar boleto:', error);
    res.status(500).json({ sucesso: false, error: 'Erro interno ao gerar boleto' });
  }
});

module.exports = router;
