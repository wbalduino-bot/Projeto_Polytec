// ============================
// Rotas de Leads
// ============================

const express = require('express');
const router = express.Router();

// Importa métodos do controller de leads
const {
  criarLead,
  listarLeads,
  atualizarStatusLead,
  excluirLead
} = require('../controllers/leadController');

// Importa middleware de autenticação (JWT)
const { authMiddleware } = require('../controllers/authController');

/**
 * Criar novo lead
 * Método: POST /leads
 * Corpo esperado: { nome, contato, origem, interesse }
 * Protegida: requer token JWT válido
 */
router.post('/', authMiddleware, criarLead);

/**
 * Listar todos os leads
 * Método: GET /leads
 * Protegida: requer token JWT válido
 */
router.get('/', authMiddleware, listarLeads);

/**
 * Atualizar status de um lead
 * Método: PUT /leads/:id/status
 * Corpo esperado: { status, vendedor_id }
 * Protegida: requer token JWT válido
 */
router.put('/:id/status', authMiddleware, atualizarStatusLead);

/**
 * Excluir lead
 * Método: DELETE /leads/:id
 * Protegida: requer token JWT válido
 */
router.delete('/:id', authMiddleware, excluirLead);

/**
 * Listar atribuições de leads
 * Método: GET /leads/atribuicoes
 * Protegida: requer token JWT válido
 */
router.get('/atribuicoes', authMiddleware, listarAtribuicoes);

module.exports = router;
