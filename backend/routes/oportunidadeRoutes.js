// backend/routes/oportunidadeRoutes.js

const express = require('express');
const router = express.Router();
const {
  criarOportunidade,
  listarOportunidades,
  atualizarOportunidade,
  excluirOportunidade
} = require('../controllers/oportunidadeController');

/**
 * Rota para criar uma nova oportunidade.
 * Método: POST /oportunidades
 */
router.post('/', criarOportunidade);

/**
 * Rota para listar todas as oportunidades.
 * Método: GET /oportunidades
 */
router.get('/', listarOportunidades);

/**
 * Rota para atualizar uma oportunidade.
 * Método: PUT /oportunidades/:id
 */
router.put('/:id', atualizarOportunidade);

/**
 * Rota para excluir uma oportunidade.
 * Método: DELETE /oportunidades/:id
 */
router.delete('/:id', excluirOportunidade);

module.exports = router;
