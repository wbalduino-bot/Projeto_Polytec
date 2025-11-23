// backend/routes/pedidoRoutes.js

const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authController = require('../controllers/authController');

/**
 * Rotas de Pedidos
 * - Todas as rotas usam controllers no formato padrão (req, res).
 * - Autenticação via JWT protegida por authMiddleware.
 * - Permissões verificadas com authController.verificarPermissao.
 */

/**
 * Criar pedido
 * POST /api/pedidos
 * - Requer autenticação.
 * - Qualquer perfil autenticado pode criar pedido.
 */
router.post('/', authController.authMiddleware, pedidoController.criarPedido);

/**
 * Listar pedidos
 * GET /api/pedidos
 * - Requer autenticação.
 * - Inclui cliente e produtos vinculados.
 */
router.get('/', authController.authMiddleware, pedidoController.listarPedidos);

/**
 * Atualizar status de pedido
 * PUT /api/pedidos/:id/status
 * - Requer autenticação.
 * - Qualquer perfil autenticado pode atualizar status.
 */
router.put('/:id/status', authController.authMiddleware, pedidoController.atualizarStatus);

/**
 * Excluir pedido
 * DELETE /api/pedidos/:id
 * - Requer autenticação.
 * - Apenas perfis com permissão (admin/gerente) podem executar.
 */
router.delete('/:id', authController.authMiddleware, async (req, res, next) => {
  try {
    await authController.verificarPermissao(req.usuario, 'excluir_pedido');
    next(); // se permitido, segue para controller
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
}, pedidoController.excluirPedido);

module.exports = router;
