// ============================
// 👥 Rotas de Usuários
// ============================
// Responsável por mapear endpoints relacionados a usuários.
// Integra com o controller de usuários para listar, cadastrar,
// atualizar, excluir e consultar dados do usuário logado.
// ============================

const express = require('express');
const router = express.Router();

// Controllers de usuários
const {
  listarUsuarios,
  atualizarUsuario,
  cadastrarUsuario,
  excluirUsuario, // ✅ futuro: exclusão de usuário
} = require('../controllers/userController');

// Middlewares de autenticação e autorização
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');

// Logger/Auditoria (registra ações sensíveis)
const auditLogger = require('../logs/auditLogger');

// ============================
// 📋 Listar todos os usuários
// ============================
// Método: GET /api/usuarios
// Protegida: requer token JWT válido
// Permissão: apenas perfis "admin" ou "gerente"
// Retorna: lista de usuários (sem senha)
router.get(
  '/',
  authMiddleware,
  authorize(['admin', 'gerente']),
  listarUsuarios
);

// ============================
// ➕ Cadastrar novo usuário
// ============================
// Método: POST /api/usuarios/cadastro
// Corpo esperado: { nome, email, senha, perfil }
// Protegida: requer token JWT válido
// Permissão: apenas perfil "admin"
// Auditoria: registra ação no log
router.post(
  '/cadastro',
  authMiddleware,
  authorize(['admin']),
  async (req, res) => {
    try {
      // Chama a função de cadastro do controlador
      await cadastrarUsuario(req, res);

      // Registra a ação no log de auditoria
      auditLogger.info({
        action: 'create_user',
        createdUser: req.body.email,
        performedBy: req.usuario?.id || 'desconhecido',
        perfil: req.usuario?.perfil || 'desconhecido',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Erro ao cadastrar usuário:', error);
      res.status(500).json({
        sucesso: false,
        error: 'Erro interno ao cadastrar usuário',
        detalhe: error.message,
      });
    }
  }
);

// ============================
// ✏️ Atualizar dados de um usuário
// ============================
// Método: PUT /api/usuarios/:id
// Corpo esperado: { nome?, senha?, perfil?, status? }
// Protegida: requer token JWT válido
// Permissão: apenas perfis "admin" ou "gerente"
// Auditoria: registra ação no log
router.put(
  '/:id',
  authMiddleware,
  authorize(['admin', 'gerente']),
  async (req, res) => {
    try {
      // Chama a função de atualização do controlador
      await atualizarUsuario(req, res);

      // Registra a ação no log de auditoria
      auditLogger.info({
        action: 'update_user',
        userId: req.params.id,
        performedBy: req.usuario?.id || 'desconhecido',
        perfil: req.usuario?.perfil || 'desconhecido',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      res.status(500).json({
        sucesso: false,
        error: 'Erro interno ao atualizar usuário',
        detalhe: error.message,
      });
    }
  }
);

// ============================
// 🗑️ Excluir usuário (opcional/futuro)
// ============================
// Método: DELETE /api/usuarios/:id
// Protegida: requer token JWT válido
// Permissão: apenas perfil "admin"
// Auditoria: registra ação no log
router.delete(
  '/:id',
  authMiddleware,
  authorize(['admin']),
  async (req, res) => {
    try {
      await excluirUsuario(req, res);

      auditLogger.info({
        action: 'delete_user',
        userId: req.params.id,
        performedBy: req.usuario?.id || 'desconhecido',
        perfil: req.usuario?.perfil || 'desconhecido',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Erro ao excluir usuário:', error);
      res.status(500).json({
        sucesso: false,
        error: 'Erro interno ao excluir usuário',
        detalhe: error.message,
      });
    }
  }
);

// ============================
// 👤 Obter dados do usuário logado
// ============================
// Método: GET /api/usuarios/me
// Protegida: requer token JWT válido
// Permissão: qualquer perfil autenticado
// Retorna: dados básicos do usuário logado
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    sucesso: true,
    usuario: {
      id: req.usuario.id,
      nome: req.usuario.nome,
      email: req.usuario.email,
      perfil: req.usuario.perfil,
    },
  });
});

// ============================
// 📤 Exporta o router
// ============================
module.exports = router;
