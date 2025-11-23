// controllers/interacaoLeadController.js
// Controlador responsável pela lógica de interações com leads

const db = require('../models/InteracaoLead');

/**
 * Criar nova interação com um lead
 * - Recebe lead_id, vendedor_id, tipo e descrição
 * - Salva no banco com data atual
 */
exports.criarInteracao = (req, res) => {
  const { lead_id, vendedor_id, tipo, descricao } = req.body;

  if (!lead_id || !tipo) {
    return res.status(400).json({ error: 'Campos obrigatórios: lead_id, tipo' });
  }

  db.run(
    `INSERT INTO interacoes_leads (lead_id, vendedor_id, tipo, descricao) VALUES (?, ?, ?, ?)`,
    [lead_id, vendedor_id || null, tipo, descricao || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, lead_id, tipo, descricao });
    }
  );
};

/**
 * Listar todas as interações de um lead específico
 * - Recebe o ID do lead via parâmetro
 */
exports.listarInteracoesPorLead = (req, res) => {
  const { lead_id } = req.params;

  db.all(
    `SELECT * FROM interacoes_leads WHERE lead_id = ? ORDER BY data_interacao DESC`,
    [lead_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

/**
 * Excluir uma interação
 * - Recebe o ID da interação via parâmetro
 */
exports.excluirInteracao = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM interacoes_leads WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Interação não encontrada' });
    res.json({ message: `Interação ${id} excluída com sucesso` });
  });
};
