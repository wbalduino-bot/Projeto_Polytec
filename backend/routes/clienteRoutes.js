// ============================
// Rotas de Clientes
// ============================

const express = require('express');
const router = express.Router();

// Importa métodos do controller de clientes
const {
  criarCliente,
  listarClientes,
  buscarClientePorId,
  atualizarCliente,
  excluirCliente
} = require('../controllers/clienteController');

// Importa middleware de autenticação
const { authMiddleware } = require('../controllers/authController');

/**
 * Rota para criar um novo cliente.
 * Método: POST /clientes
 * Corpo esperado: { nome, email, telefone, empresa, cargo, ativo }
 * Protegida: requer token JWT válido
 */
router.post('/', authMiddleware, criarCliente);

/**
 * Rota para listar todos os clientes.
 * Método: GET /clientes
 * Protegida: requer token JWT válido
 */
router.get('/', authMiddleware, listarClientes);

/**
 * Rota para buscar um cliente específico pelo ID.
 * Método: GET /clientes/:id
 * Parâmetro: id (integer)
 * Protegida: requer token JWT válido
 */
router.get('/:id', authMiddleware, buscarClientePorId);

/**
 * Rota para atualizar os dados de um cliente.
 * Método: PUT /clientes/:id
 * Corpo esperado: campos a serem atualizados (nome, email, telefone, etc.)
 * Protegida: requer token JWT válido
 */
router.put('/:id', authMiddleware, atualizarCliente);

/**
 * Rota para excluir um cliente.
 * Método: DELETE /clientes/:id
 * Parâmetro: id (integer)
 * Protegida: requer token JWT válido
 */
router.delete('/:id', authMiddleware, excluirCliente);

module.exports = router;
