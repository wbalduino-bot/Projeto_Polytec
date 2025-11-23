// backend/routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const { enviarNotificacao } = require('../services/notificacaoService');

let subscriptions = [];

router.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Inscrição registrada' });
});

router.post('/notify-all', (req, res) => {
  const payload = {
    title: 'Nova atualização',
    body: 'Um novo evento foi registrado no sistema.'
  };

  subscriptions.forEach(sub => enviarNotificacao(sub, payload));
  res.status(200).json({ message: 'Notificações enviadas' });
});

module.exports = router;
