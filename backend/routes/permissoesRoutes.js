// backend/routes/permissoes.js

const express = require('express');
const router = express.Router();
const { atualizarPermissoes } = require('../controllers/permissoesController');
const autenticarAdmin = require('../middlewares/autenticarAdmin'); // Middleware que garante que o usuário é admin

/**
 * Função utilitária para verificar permissões de acordo com o perfil do usuário.
 * Regras de negócio:
 * - Admin: acesso total
 * - Gerente: pode aplicar desconto e excluir pedidos
 * - Vendedor: não pode aplicar desconto nem excluir pedidos
 *
 * Essa função será importada e utilizada em produtosRoutes.js e pedidosRoutes.js
 */
function verificarPermissao(usuario, acao) {
  if (usuario.perfil === 'admin') return true;
  if (usuario.perfil === 'gerente') return true;
  if (usuario.perfil === 'vendedor') {
    if (acao === 'aplicar_desconto' || acao === 'excluir_pedido') {
      throw new Error('Permissão negada para vendedores');
    }
  }
  return true;
}

/**
 * Rota que permite atualizar permissões de usuários
 * Protegida por autenticação de administrador
 * Exemplo de uso: PUT /permissoes
 */
router.put('/', autenticarAdmin, atualizarPermissoes);

// Exporta apenas o router
module.exports = router;

// Se quiser usar verificarPermissao em outros arquivos, exporte separado:
// module.exports = { router, verificarPermissao };