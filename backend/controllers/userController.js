// ============================
// 👥 Controller de Usuários
// ============================
// Responsável por operações relacionadas a usuários:
// - Listagem de todos os usuários
// - Cadastro de novo usuário
// - Atualização de dados de um usuário específico
// ============================

const db = require('../config/db');   // conexão com banco SQLite/Postgres
const bcrypt = require('bcrypt');     // biblioteca para criptografia de senhas
const Auditoria = require('../models/Auditoria'); // modelo para registrar logs de auditoria

// ============================
// 📋 Listar Usuários
// ============================
// Método: GET /api/usuarios
// Retorna todos os usuários cadastrados (id, nome, email, perfil, status).
// ⚠️ Senha não é retornada por segurança.
// ============================
const listarUsuarios = (req, res) => {
  db.all(
    'SELECT id, nome, email, perfil, status FROM usuarios',
    [],
    (err, rows) => {
      if (err) {
        console.error('❌ Erro ao listar usuários:', err.message);
        return res.status(500).json({
          sucesso: false,
          error: 'Erro interno ao buscar usuários',
          detalhe: err.message,
        });
      }

      res.json({
        sucesso: true,
        usuarios: rows,
      });
    }
  );
};

// ============================
// ➕ Cadastrar Usuário
// ============================
// Método: POST /api/usuarios/cadastro
// Corpo esperado: { nome, email, senha, perfil }
// Regras:
// - Senha sempre armazenada como hash
// - Perfil deve ser válido (admin, gerente, vendedor)
// - Status inicial: "ativo"
// Auditoria: registra ação de criação
// ============================
const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, perfil } = req.body;

  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({
      sucesso: false,
      error: 'Campos obrigatórios não preenchidos',
    });
  }

  try {
    // Criptografa senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Insere no banco
    db.run(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil, status) VALUES (?, ?, ?, ?, ?)`,
      [nome, email, senhaCriptografada, perfil, 'ativo'],
      function (err) {
        if (err) {
          console.error('❌ Erro ao cadastrar usuário:', err.message);
          return res.status(500).json({
            sucesso: false,
            error: 'Erro interno ao cadastrar usuário',
            detalhe: err.message,
          });
        }

        // Auditoria
        Auditoria.registrar(
          'Cadastro de usuário',
          req.usuario?.id || null,
          `Usuário criado: ${email}`
        );

        res.json({
          sucesso: true,
          msg: '✅ Usuário cadastrado com sucesso',
          usuario: { id: this.lastID, nome, email, perfil, status: 'ativo' },
        });
      }
    );
  } catch (err) {
    console.error('❌ Erro ao processar cadastro:', err.message);
    res.status(500).json({
      sucesso: false,
      error: 'Erro interno ao processar cadastro',
      detalhe: err.message,
    });
  }
};

// ============================
// ✏️ Atualizar Usuário
// ============================
// Método: PUT /api/usuarios/:id
// Parâmetros:
//   - id (URL param): identificador do usuário
// Corpo esperado:
//   - nome (string, opcional)
//   - senha (string, opcional → será criptografada)
//   - perfil (string, opcional: 'admin', 'gerente', 'vendedor')
//   - status (string, opcional: 'ativo' ou 'inativo')
//
// Regras:
// - Apenas campos enviados serão atualizados
// - Senha sempre armazenada como hash
// - Retorna erro se nenhum campo for enviado
// Auditoria: registra ação de atualização
// ============================
const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, senha, perfil, status } = req.body;

  const campos = [];
  const valores = [];

  // Atualiza nome
  if (nome) {
    campos.push('nome = ?');
    valores.push(nome);
  }

  // Atualiza senha (sempre criptografada)
  if (senha) {
    try {
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      campos.push('senha_hash = ?');
      valores.push(senhaCriptografada);
    } catch (err) {
      console.error('❌ Erro ao criptografar senha:', err.message);
      return res.status(500).json({
        sucesso: false,
        error: 'Erro interno ao processar senha',
        detalhe: err.message,
      });
    }
  }

  // Atualiza perfil
  if (perfil) {
    campos.push('perfil = ?');
    valores.push(perfil);
  }

  // Atualiza status
  if (status) {
    campos.push('status = ?');
    valores.push(status);
  }

  // Nenhum campo enviado → erro
  if (campos.length === 0) {
    return res.status(400).json({
      sucesso: false,
      error: 'Nenhum campo para atualizar',
    });
  }

  // Adiciona ID ao final da lista de valores
  valores.push(id);

  // Executa atualização no banco
  db.run(
    `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
    valores,
    function (err) {
      if (err) {
        console.error('❌ Erro ao atualizar usuário:', err.message);
        return res.status(500).json({
          sucesso: false,
          error: 'Erro interno ao atualizar usuário',
          detalhe: err.message,
        });
      }

      // Nenhum usuário encontrado com esse ID
      if (this.changes === 0) {
        return res.status(404).json({
          sucesso: false,
          error: 'Usuário não encontrado',
        });
      }

      // Auditoria
      Auditoria.registrar(
        'Atualização de usuário',
        req.usuario?.id || null,
        `Usuário atualizado: ${id}`
      );

      // Sucesso
      res.json({
        sucesso: true,
        msg: '✅ Usuário atualizado com sucesso',
        usuario: { id, nome, perfil, status },
      });
    }
  );
};

// ============================
// 📤 Exporta funções do controller
// ============================
module.exports = {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
};
