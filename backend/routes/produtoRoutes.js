// backend/routes/produtoRoutes.js

const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const authController = require('../controllers/authController');

/**
 * Rotas de Produtos
 * - Todas as rotas usam controllers no formato padrão (req, res).
 * - Autenticação via JWT protegida por authMiddleware.
 * - Permissões verificadas com authController.verificarPermissao.
 */

/**
 * Rota de teste protegida
 * GET /api/produtos/protegido
 * - Apenas para validar autenticação JWT.
 */
router.get('/protegido', authController.authMiddleware, (req, res) => {
  res.json({ mensagem: `Acesso autorizado para o usuário ID ${req.usuario.id}, perfil: ${req.usuario.perfil}` });
});

/**
 * Criar produto
 * POST /api/produtos
 * - Requer autenticação.
 * - Qualquer perfil autenticado pode criar produto.
 */
router.post('/', authController.authMiddleware, produtoController.criarProduto);

/**
 * Listar produtos
 * GET /api/produtos
 * - Pode ser pública ou protegida.
 * - Aqui mantemos protegida para consistência.
 */
router.get('/', authController.authMiddleware, produtoController.listarProdutos);

/**
 * Atualizar estoque
 * PUT /api/produtos/:id/estoque
 * - Requer autenticação.
 * - Qualquer perfil autenticado pode atualizar estoque.
 */
router.put('/:id/estoque', authController.authMiddleware, produtoController.atualizarEstoque);

/**
 * Aplicar desconto
 * POST /api/produtos/:id/desconto
 * - Requer autenticação.
 * - Apenas perfis com permissão (admin/gerente) podem executar.
 * - Usa verificarPermissao para validar antes de chamar controller.
 */
router.post('/:id/desconto', authController.authMiddleware, async (req, res, next) => {
  try {
    await authController.verificarPermissao(req.usuario, 'aplicar_desconto');
    next(); // se permitido, segue para controller
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
}, produtoController.aplicarDesconto);

module.exports = router;
