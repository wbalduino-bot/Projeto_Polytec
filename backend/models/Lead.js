// models/Lead.js
// Modelo de dados para representar possíveis compradores (leads)

const db = require('../config/db');

// Cria a tabela de leads se não existir
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
`);

module.exports = db;
