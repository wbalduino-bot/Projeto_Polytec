const express = require('express');
const router = express.Router();

const boletos = []; // Simulação em memória

router.post('/', (req, res) => {
  const { pedidoId, vencimento } = req.body;
  const novoBoleto = {
    id: boletos.length + 1,
    pedidoId,
    vencimento,
    geradoEm: new Date().toISOString(),
    status: 'Gerado',
  };
  boletos.push(novoBoleto);
  res.status(201).json(novoBoleto);
});

router.get('/', (req, res) => {
  res.json(boletos);
});

module.exports = router;
