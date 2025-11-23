// models/DistribuicaoLead.js
// Modelo de dados para registrar a distribuição de leads entre vendedores

const db = require('../config/db');

// Cria a tabela de distribuição se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS distribuicao_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,            -- ID do lead atribuído
    vendedor_id INTEGER NOT NULL,        -- ID do vendedor que recebeu o lead
    criterio TEXT,                       -- Critério usado para distribuição (ex: região, manual)
    data_atribuicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  )
`);

module.exports = db;
