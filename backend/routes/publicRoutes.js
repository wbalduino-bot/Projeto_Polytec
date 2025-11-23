const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { listarUsuarios } = require('../controllers/userController');

// 🔓 Rotas públicas
router.post('/auth/login', login);
router.get('/usuarios', listarUsuarios);

module.exports = router;
