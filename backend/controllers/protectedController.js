// ============================
// 🔐 Rotas Protegidas (Protected Routes)
// ============================
// Rotas que só podem ser acessadas por usuários autenticados.
// O middleware de autenticação é aplicado em cada rota.

const express = require('express');
const router = express.Router();

// Middleware de autenticação
const authMiddleware = require('../middlewares/authMiddleware');

// Controllers responsáveis pela lógica
const { atualizarUsuario } = require('../controllers/userController');
const { gerarBoleto, listarBoletos } = require('../controllers/boletoController');

// ============================
// 📌 Rotas protegidas
// ============================

// 👥 Atualiza dados de um usuário específico
router.put('/usuarios/:id', authMiddleware, atualizarUsuario);

// 💳 Gera um novo boleto
router.post('/boletos', authMiddleware, gerarBoleto);

// 📄 Lista boletos do usuário autenticado
router.get('/boletos', authMiddleware, listarBoletos);

// ============================
// 📤 Exporta o router
// ============================
module.exports = router;
