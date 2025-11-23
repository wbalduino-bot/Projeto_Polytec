// routes/interacaoLeadRoutes.js
// Define as rotas da API para gerenciamento de interações com leads

const express = require('express');
const router = express.Router();
const interacaoLeadController = require('../controllers/interacaoLeadController');

// Criar nova interação
router.post('/', interacaoLeadController.criarInteracao);

// Listar interações de um lead específico
router.get('/:lead_id', interacaoLeadController.listarInteracoesPorLead);

// Excluir interação
router.delete('/:id', interacaoLeadController.excluirInteracao);

module.exports = router;
