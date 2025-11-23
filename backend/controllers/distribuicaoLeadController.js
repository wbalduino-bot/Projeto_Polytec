// controllers/distribuicaoLeadController.js
// Controlador responsável pela lógica de distribuição de leads

const db = require('../models/DistribuicaoLead');

/**
 * Atribuir lead a um vendedor
 * - Recebe lead_id, vendedor_id e critério
 * - Salva no banco a distribuição
 */
exports.atribuirLead = (req, res) => {
  const { lead_id, vendedor_id, criterio } = req.body;

  if (!lead_id || !vendedor_id) {
    return res.status(400).json({ error: 'Campos obrigatórios: lead_id, vendedor_id' });
  }

  db.run(
    `INSERT INTO distribuicao_leads (lead_id, vendedor_id, criterio) VALUES (?, ?, ?)`,
    [lead_id, vendedor_id, criterio || 'manual'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, lead_id, vendedor_id, criterio });
    }
  );
};

/**
 * Listar todas as distribuições
 * - Retorna todos os registros de atribuição de leads
 */
exports.listarDistribuicoes = (req, res) => {
  db.all(`SELECT * FROM distribuicao_leads ORDER BY data_atribuicao DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

/**
 * Listar leads atribuídos a um vendedor específico
 * - Recebe vendedor_id via parâmetro
 */
exports.listarPorVendedor = (req, res) => {
  const { vendedor_id } = req.params;

  db.all(
    `SELECT * FROM distribuicao_leads WHERE vendedor_id = ? ORDER BY data_atribuicao DESC`,
    [vendedor_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

/**
 * Excluir uma distribuição (remover atribuição)
 */
exports.excluirDistribuicao = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM distribuicao_leads WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Distribuição não encontrada' });
    res.json({ message: `Distribuição ${id} excluída com sucesso` });
  });
};
