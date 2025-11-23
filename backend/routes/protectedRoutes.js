// ============================
// 🔐 Rotas Protegidas (Protected Routes)
// ============================
// Este arquivo define rotas que só podem ser acessadas
// por usuários autenticados (token JWT válido).
// O middleware de autenticação é aplicado em cada rota.
// ============================

const express = require('express');
const router = express.Router();

// Middleware de autenticação
// Middleware de autenticação (importado corretamente com destructuring)
const { authMiddleware } = require('../middlewares/authMiddleware');

// Controllers responsáveis pela lógica de cada rota
const userController = require('../controllers/userController');
console.log('userController:', userController);

const boletoController = require('../controllers/boletoController');

// ============================
// 📌 Rotas protegidas
// ============================

// 👥 Atualiza dados de um usuário específico
// Método: PUT /api/protected/usuarios/:id
// Exige token válido e ID do usuário na URL
router.put('/usuarios/:id', authMiddleware, userController.atualizarUsuario);

// 💳 Gera um novo boleto vinculado ao usuário autenticado
// Método: POST /api/protected/boletos
// Exige token válido e dados do boleto no corpo da requisição
router.post('/boletos', authMiddleware, boletoController.gerarBoleto);

// 📄 Lista boletos do usuário autenticado
// Método: GET /api/protected/boletos
// Exige token válido e retorna boletos vinculados ao usuário
router.get('/boletos', authMiddleware, boletoController.listarBoletos);

// ============================
// 📤 Exporta o router
// ============================
// ⚠️ Importante: deve exportar o router, não funções isoladas.
// Assim o Express consegue registrar corretamente as rotas.
module.exports = router;


