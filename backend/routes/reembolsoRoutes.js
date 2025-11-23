// ============================
// Rotas de Reembolsos
// ============================

const express = require('express');
const router = express.Router();

// Importa todas as funções do controlador de reembolso
const {
  criarReembolso,
  listarReembolsos,
  buscarReembolsoPorId,
  atualizarStatusReembolso,
  excluirReembolso
} = require('../controllers/reembolsoController');

// Importa middleware de autenticação (JWT)
const { authMiddleware } = require('../controllers/authController');

/**
 * 📌 Criar novo pedido de reembolso
 * Método: POST /reembolsos
 * Corpo esperado: { usuario_id, nota_fiscal, valor }
 * Protegida: requer token JWT válido
 */
router.post('/', authMiddleware, criarReembolso);

/**
 * 📋 Listar todos os pedidos de reembolso
 * Método: GET /reembolsos
 * Protegida: requer token JWT válido
 */
router.get('/', authMiddleware, listarReembolsos);

/**
 * 🔎 Buscar pedido específico por ID
 * Método: GET /reembolsos/:id
 * Protegida: requer token JWT válido
 */
router.get('/:id', authMiddleware, buscarReembolsoPorId);

/**
 * ✏️ Atualizar status de um pedido (aprovar/rejeitar)
 * Método: PUT /reembolsos/:id
 * Corpo esperado: { status, observacao? }
 * Protegida: requer token JWT válido
 */
router.put('/:id', authMiddleware, atualizarStatusReembolso);

/**
 * 🗑️ Excluir pedido de reembolso
 * Método: DELETE /reembolsos/:id
 * Protegida: requer token JWT válido
 */
router.delete('/:id', authMiddleware, excluirReembolso);

// Exporta o router para ser usado no servidor principal (server.js)
module.exports = router;
