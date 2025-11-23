const express = require('express');
const router = express.Router();
const oraculoController = require('../controllers/oraculoController');

// Rota para previsão de vendas
router.get('/previsao/:id', oraculoController.previsaoVendas);

module.exports = router;
