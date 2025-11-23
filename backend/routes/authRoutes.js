// ============================
// Rotas de Autenticação e Usuário
// ============================

const express = require('express');
const router = express.Router();

// Controllers e Models
const authController = require('../controllers/authController'); // Lógica central de autenticação (register, login, middleware)
const Usuario = require('../models/Usuario');                    // Model Sequelize para tabela de usuários
const Permissao = require('../models/Permissao');                // Model Sequelize para permissões
const bcrypt = require('bcryptjs');                              // Biblioteca para hashing e comparação de senhas
const auditLogger = require('../logs/auditLogger');              // Logger de auditoria com Winston

/**
 * Rotas disponíveis:
 * - POST   /auth/register         → cria novo usuário
 * - POST   /auth/login            → autentica usuário e gera token JWT
 * - GET    /auth/me               → retorna dados do usuário autenticado
 * - PUT    /auth/update-password  → atualiza senha do usuário autenticado
 * - PUT    /auth/update-profile   → atualiza nome/email do usuário autenticado
 * - GET    /auth/permissoes       → retorna permissões do perfil logado
 * - POST   /auth/logout           → invalida token (simulação, sem blacklist real)
 */

// ============================
// Registro de novo usuário
// ============================
// Exemplo de corpo esperado:
// { "nome": "William", "email": "william@polytec.com", "senha": "123456" }
router.post('/register', async (req, res) => {
  auditLogger.info(`📥 Tentativa de cadastro: email=${req.body.email}`);
  try {
    await authController.register(req, res);
    auditLogger.info(`✅ Usuário cadastrado com sucesso: email=${req.body.email}`);
  } catch (err) {
    auditLogger.error(`❌ Erro no cadastro: ${err.message}`);
    res.status(500).json({ error: 'Erro interno no cadastro' });
  }
});

// ============================
// Login de usuário
// ============================
// Exemplo de corpo esperado:
// { "email": "william@polytec.com", "senha": "123456" }
router.post('/login', async (req, res) => {
  auditLogger.info(`🔑 Tentativa de login: email=${req.body.email}`);
  try {
    await authController.login(req, res);
    auditLogger.info(`✅ Login realizado com sucesso: email=${req.body.email}`);
  } catch (err) {
    auditLogger.warn(`⚠️ Falha na autenticação: email=${req.body.email}, erro=${err.message}`);
    res.status(401).json({ error: 'Falha na autenticação' });
  }
});

// ============================
// Rota protegida: retorna dados do usuário logado
// ============================
// Necessário enviar token JWT válido no header Authorization: Bearer <token>
router.get('/me', authController.authMiddleware, async (req, res) => {
  auditLogger.info(`👤 Consulta de perfil: id=${req.usuario.id}, email=${req.usuario.email}`);
  res.json({ usuario: req.usuario });
});

// ============================
// Atualizar senha do usuário autenticado
// ============================
// Corpo esperado: { "senhaAtual": "123456", "novaSenha": "nova123" }
router.put('/update-password', authController.authMiddleware, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      auditLogger.warn(`⚠️ Usuário não encontrado ao atualizar senha: id=${req.usuario.id}`);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha_hash);
    if (!senhaValida) {
      auditLogger.warn(`⚠️ Senha inválida para usuário: email=${usuario.email}`);
      return res.status(401).json({ error: 'Senha atual inválida' });
    }

    const novaHash = await bcrypt.hash(novaSenha, 10);
    await usuario.update({ senha_hash: novaHash });

    auditLogger.info(`🔒 Senha atualizada com sucesso: email=${usuario.email}`);
    res.json({ msg: '✅ Senha atualizada com sucesso' });
  } catch (err) {
    auditLogger.error(`❌ Erro ao atualizar senha: ${err.message}`);
    res.status(500).json({ error: 'Erro ao atualizar senha', detalhe: err.message });
  }
});

// ============================
// Atualizar perfil (nome/email)
// ============================
// Corpo esperado: { "nome": "Novo Nome", "email": "novo@email.com" }
router.put('/update-profile', authController.authMiddleware, async (req, res) => {
  try {
    const { nome, email } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      auditLogger.warn(`⚠️ Usuário não encontrado ao atualizar perfil: id=${req.usuario.id}`);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await usuario.update({ nome, email });
    auditLogger.info(`📝 Perfil atualizado: id=${usuario.id}, email=${usuario.email}`);
    res.json({ msg: '✅ Perfil atualizado com sucesso', usuario });
  } catch (err) {
    auditLogger.error(`❌ Erro ao atualizar perfil: ${err.message}`);
    res.status(500).json({ error: 'Erro ao atualizar perfil', detalhe: err.message });
  }
});

// ============================
// Consultar permissões do perfil logado
// ============================
// Retorna permissões associadas ao perfil do usuário autenticado
router.get('/permissoes', authController.authMiddleware, async (req, res) => {
  try {
    const permissao = await Permissao.findOne({ where: { perfil: req.usuario.perfil } });
    if (!permissao) {
      auditLogger.warn(`⚠️ Permissões não configuradas para perfil: ${req.usuario.perfil}`);
      return res.status(404).json({ error: 'Permissões não configuradas para este perfil' });
    }

    auditLogger.info(`📊 Consulta de permissões: perfil=${req.usuario.perfil}`);
    res.json({ perfil: req.usuario.perfil, permissao });
  } catch (err) {
    auditLogger.error(`❌ Erro ao consultar permissões: ${err.message}`);
    res.status(500).json({ error: 'Erro ao consultar permissões', detalhe: err.message });
  }
});

// ============================
// Logout (simulação)
// ============================
// OBS: Não há blacklist de tokens, apenas instruímos o cliente a descartar o JWT
router.post('/logout', authController.authMiddleware, (req, res) => {
  auditLogger.info(`🚪 Logout realizado: email=${req.usuario.email}`);
  res.json({ msg: '✅ Logout realizado com sucesso (token deve ser descartado no cliente)' });
});

module.exports = router;
