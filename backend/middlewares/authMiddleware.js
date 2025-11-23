// ============================
// 🔐 Middleware de Autenticação e Autorização
// ============================
// Responsável por:
// - Validar tokens JWT enviados pelo cliente
// - Injetar dados do usuário autenticado em req.usuario
// - Restringir acesso a rotas conforme perfil autorizado
// ============================

const jwt = require('jsonwebtoken');

// ============================
// 🔑 Middleware de Autenticação
// ============================
// Fluxo:
// 1. Verifica se o header Authorization foi enviado
// 2. Extrai o token JWT (formato esperado: "Bearer <token>")
// 3. Valida o token com a chave secreta definida em .env (JWT_SECRET)
// 4. Injeta os dados decodificados do usuário em req.usuario
// 5. Caso falhe, retorna erro 401 (sem token) ou 403 (token inválido/expirado)
// ============================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔎 Verifica se o header foi enviado
  if (!authHeader) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Header Authorization não fornecido',
    });
  }

  // 🔎 Extrai token do formato "Bearer <token>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token não fornecido',
    });
  }

  try {
    // 🔑 Valida token com chave secreta
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'segredo-super-seguro'
    );

    // ✅ Injeta dados do usuário no request
    // Exemplo de payload esperado: { id, perfil, email }
    req.usuario = decoded;

    next(); // segue para rota protegida
  } catch (err) {
    console.error('❌ Erro na validação do token:', err.message);
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado',
      detalhe: err.message,
    });
  }
};

// ============================
// 🛡️ Middleware de Autorização por Perfil
// ============================
// Fluxo:
// 1. Recebe uma lista de perfis permitidos (ex.: ['admin','gerente'])
// 2. Verifica se req.usuario existe (usuário autenticado)
// 3. Verifica se perfil do usuário está na lista permitida
// 4. Caso contrário, retorna erro 403 (Permissão negada)
// ============================
const authorize = (perfisPermitidos = []) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não autenticado',
      });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Permissão negada: perfil não autorizado',
        perfil: req.usuario.perfil,
      });
    }

    next(); // segue para rota autorizada
  };
};

// ============================
// 📤 Exporta middlewares
// ============================
// ⚠️ Importante: como exportamos um objeto,
// precisamos usar destructuring ao importar:
//   const { authMiddleware, authorize } = require('../middlewares/authMiddleware');
// ============================
module.exports = { authMiddleware, authorize };
