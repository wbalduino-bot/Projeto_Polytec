// ============================
// 🛡️ Middleware de Permissão
// ============================
// Responsável por verificar se o usuário autenticado
// possui permissão para acessar determinados módulos.
// ============================

/**
 * Middleware para verificar se o usuário tem permissão para acessar determinados módulos
 * @param {Array} modulosPermitidos - Lista de módulos que a rota exige permissão
 * @returns {Function} - Função middleware que valida o tipo de usuário
 *
 * Exemplo de uso:
 *   router.get(
 *     '/auditoria',
 *     authMiddleware,
 *     verificarPermissao(['estatisticas']),
 *     auditoriaController.listarAuditoria
 *   );
 */
function verificarPermissao(modulosPermitidos = []) {
  return (req, res, next) => {
    // Se o usuário não foi injetado pelo authMiddleware
    if (!req.usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não autenticado',
      });
    }

    // Extrai o tipo de usuário do objeto de autenticação
    const { tipo } = req.usuario;

    // Define as permissões por tipo de usuário
    const permissoes = {
      admin: ['usuarios', 'boletos', 'estatisticas'], // Admin tem acesso total
      comum: ['boletos'], // Usuário comum tem acesso limitado
      auditor: ['estatisticas'], // Exemplo: perfil auditor só acessa estatísticas
    };

    // Recupera os módulos permitidos para o tipo atual
    const modulos = permissoes[tipo] || [];

    // Verifica se o usuário tem acesso a pelo menos um dos módulos exigidos
    const temPermissao = modulosPermitidos.some(m => modulos.includes(m));

    if (temPermissao) {
      next(); // ✅ Permissão concedida, segue para a próxima função
    } else {
      // ❌ Permissão negada, retorna erro 403
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Permissão negada: acesso não autorizado',
        detalhe: {
          tipoUsuario: tipo,
          modulosPermitidos,
          modulosDisponiveis: modulos,
        },
      });
    }
  };
}

// ============================
// 📤 Exporta middleware
// ============================
module.exports = verificarPermissao;
