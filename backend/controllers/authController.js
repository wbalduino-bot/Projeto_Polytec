// ============================
// Controller de Autenticação
// ============================

const jwt = require('jsonwebtoken');       // Biblioteca para geração e validação de tokens JWT
const bcrypt = require('bcryptjs');        // Biblioteca para hashing e comparação de senhas
const Usuario = require('../models/Usuario'); // Model Sequelize para tabela de usuários

/**
 * Função: register
 * -----------------
 * - Cria um novo usuário no banco
 * - Criptografa a senha antes de salvar
 * - Define perfil padrão como "vendedor" (pode ser ajustado conforme regras)
 * - Retorna dados básicos do usuário criado
 */
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Verifica se já existe usuário com esse email
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criptografa a senha com salt de 10 rounds
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria usuário no banco
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash: senhaHash,
      perfil: perfil || 'vendedor', // 👈 padrão: vendedor
      status: 'ativo'
    });

    // Retorna dados básicos do usuário
    res.status(201).json({
      msg: '✅ Usuário registrado com sucesso',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        perfil: novoUsuario.perfil
      }
    });
  } catch (err) {
    console.error("❌ Erro no registro:", err);
    res.status(500).json({ error: 'Erro ao registrar usuário', detalhe: err.message });
  }
};

/**
 * Função: login
 * --------------
 * - Autentica usuário com email e senha
 * - Compara senha digitada com hash armazenado
 * - Gera token JWT válido por 8h
 * - Retorna token + dados do usuário (incluindo perfil)
 */
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Busca usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Compara senha digitada com hash do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera token JWT com id e perfil
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET || 'segredo-super-seguro',
      { expiresIn: '8h' }
    );

    // Retorna token e dados básicos
    res.json({
      msg: '✅ Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ error: 'Erro ao autenticar usuário', detalhe: err.message });
  }
};

/**
 * Middleware: authMiddleware
 * --------------------------
 * - Verifica se o token JWT é válido
 * - Adiciona os dados do usuário em req.usuario
 * - Protege rotas privadas
 */
exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Verifica se o header Authorization foi enviado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Extrai token do formato "Bearer token"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  try {
    // Valida token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo-super-seguro');

    // Busca usuário no banco
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Adiciona usuário na requisição (inclui perfil)
    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    };

    next();
  } catch (err) {
    console.error("❌ Erro no middleware:", err);
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};

/**
 * Função: logout
 * ---------------
 * - Simulação: apenas instruímos o cliente a descartar o token
 * - Não há blacklist implementada (tokens expiram automaticamente)
 */
exports.logout = (req, res) => {
  res.json({ msg: '✅ Logout realizado com sucesso (descartar token no cliente)' });
};

/**
 * Função: me
 * ----------
 * - Retorna dados do usuário logado com base no token
 * - Útil para manter sessão no frontend
 */
exports.me = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    });
  } catch (err) {
    console.error("❌ Erro ao buscar perfil:", err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
