const express = require('express');
const router = express.Router();
const movimentacaoController = require('../controllers/movimentacaoController');

router.post('/', movimentacaoController.registrarMovimentacao);
router.get('/', movimentacaoController.listarMovimentacoes);
router.get('/resumo', movimentacaoController.resumoPorProduto);


module.exports = router;
