// backend/routes/interacaoRoutes.js

const express = require('express');
const router = express.Router();
const {
  criarInteracao,
  listarInteracoes
} = require('../controllers/interacaoController');

/**
 * Rota para criar uma nova interação.
 * Método: POST /interacoes
 */
router.post('/', criarInteracao);

/**
 * Rota para listar todas as interações.
 * Método: GET /interacoes
 */
router.get('/', listarInteracoes);

module.exports = router;
