// models/InteracaoLead.js
// Modelo de dados para registrar interações realizadas com leads (possíveis compradores)

const db = require('../config/db');

// Cria a tabela de interações se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS interacoes_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,          -- ID do lead associado
    vendedor_id INTEGER,               -- ID do vendedor que realizou a interação
    tipo TEXT NOT NULL,                -- Tipo de interação (ex: ligação, e-mail, visita)
    descricao TEXT,                    -- Detalhes da interação
    data_interacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  )
`);

module.exports = db;
