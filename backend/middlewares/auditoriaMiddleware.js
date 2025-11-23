// ==========================
// 📌 backend/middlewares/auditoriaMiddleware.js
// ==========================
// Middleware de Auditoria
// Responsável por registrar automaticamente ações críticas em rotas sensíveis.
// Ele utiliza o modelo Auditoria.js para salvar os eventos no banco.
// ==========================

const Auditoria = require('../models/Auditoria');

async function auditoriaMiddleware(req, res, next) {
  try {
    // Usuário logado (se existir no contexto/JWT)
    const usuarioId = req.usuario ? req.usuario.id : null;

    // Informações da requisição
    const rota = req.originalUrl;
    const metodo = req.method;

    // Detalhes adicionais
    const detalhes = `Método: ${metodo}, Rota: ${rota}`;

    // Registra log de auditoria
    await Auditoria.registrar('Acesso à rota protegida', usuarioId, detalhes);

    // Continua fluxo normal da requisição
    next();
  } catch (err) {
    console.error('❌ Erro no auditoriaMiddleware:', err.message);
    // Mesmo que falhe, não bloqueia a requisição
    next();
  }
}

module.exports = auditoriaMiddleware;
