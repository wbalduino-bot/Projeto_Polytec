// ============================
// Migration inicial do banco SQLite
// ============================

const db = require('./db');

// ============================
// Tabela de Usuários
// ============================
// Campos:
// - id: chave primária
// - nome: nome do usuário
// - email: único, obrigatório
// - senha: hash da senha
// - perfil: perfil de acesso (ex.: admin, user)
// - criado_em: timestamp automático
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    perfil TEXT DEFAULT 'user',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela "usuarios":', err.message);
  } else {
    console.log('✅ Tabela "usuarios" pronta');
  }
});

// ============================
// Tabela de Clientes
// ============================
// Campos:
// - id: chave primária
// - nome: obrigatório
// - email: único, obrigatório
// - telefone, empresa, cargo: opcionais
// - ativo: flag (1 = ativo, 0 = inativo)
// - criado_em: timestamp automático
db.run(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    empresa TEXT,
    cargo TEXT,
    ativo INTEGER DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela "clientes":', err.message);
  } else {
    console.log('✅ Tabela "clientes" pronta');
  }
});

// ============================
// Tabela de Leads
// ============================
db.run(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    contato TEXT NOT NULL,
    origem TEXT,
    interesse TEXT,
    status TEXT DEFAULT 'novo',
    vendedor_id INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela "leads":', err.message);
  } else {
    console.log('✅ Tabela "leads" pronta');
  }
});
// ============================
// Tabela de Auditoria
// ============================
db.run(`
  CREATE TABLE IF NOT EXISTS auditoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acao TEXT NOT NULL,
    usuario_id INTEGER,
    detalhes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela "auditoria":', err.message);
  } else {
    console.log('✅ Tabela "auditoria" pronta');
  }
});
// ============================
// Tabela de Reembolsos
// ============================
db.run(`
  CREATE TABLE IF NOT EXISTS reembolsos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nota_fiscal TEXT NOT NULL,
    valor REAL NOT NULL,
    status TEXT DEFAULT 'pendente',
    observacao TEXT,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela "reembolsos":', err.message);
  } else {
    console.log('✅ Tabela "reembolsos" pronta');
  }
});
// ============================
// Tabela de Contatos
// ============================
db.run(`
CREATE TABLE IF NOT EXISTS contatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  data TEXT NOT NULL
    )
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela "contatos":', err.message);
  } else {
    console.log('✅ Tabela "contatos" pronta');
  }
});


// ============================
// Futuras tabelas
// ============================
// Aqui você pode adicionar outras tabelas (ex.: pedidos, produtos, etc.)
// Basta seguir o mesmo padrão de CREATE TABLE IF NOT EXISTS
