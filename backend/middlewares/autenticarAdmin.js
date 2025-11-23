// backend/middlewares/autenticarAdmin.js

/**
 * Middleware que verifica se o usuário logado é administrador
 */
module.exports = (req, res, next) => {
  const usuario = req.usuario;

  if (!usuario || usuario.tipo !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
  }

  next();
};
