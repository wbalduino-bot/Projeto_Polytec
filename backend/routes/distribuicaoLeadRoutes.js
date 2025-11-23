// routes/distribuicaoLeadRoutes.js
// Define as rotas da API para gerenciamento da distribuição de leads

const express = require('express');
const router = express.Router();
const distribuicaoLeadController = require('../controllers/distribuicaoLeadController');

// Atribuir lead a vendedor
router.post('/', distribuicaoLeadController.atribuirLead);

// Listar todas as distribuições
router.get('/', distribuicaoLeadController.listarDistribuicoes);

// Listar distribuições de um vendedor específico
router.get('/vendedor/:vendedor_id', distribuicaoLeadController.listarPorVendedor);

// Excluir distribuição
router.delete('/:id', distribuicaoLeadController.excluirDistribuicao);

module.exports = router;
