// ============================
// Controller de Leads (Prospecção de clientes)
// ============================

const db = require('../models/Lead');

/**
 * Criar novo lead
 * - Recebe nome, contato, origem e interesse
 * - Salva no banco com status 'novo'
 * Método: POST /leads
 */
exports.criarLead = (req, res) => {
  const { nome, contato, origem, interesse } = req.body;

  if (!nome || !contato) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, contato' });
  }

  db.run(
    `INSERT INTO leads (nome, contato, origem, interesse, status, data_criacao)
     VALUES (?, ?, ?, ?, 'novo', CURRENT_TIMESTAMP)`,
    [nome, contato, origem || null, interesse || null],
    function (err) {
      if (err) {
        console.error('❌ Erro ao criar lead:', err.message);
        return res.status(500).json({ error: 'Erro interno ao criar lead', detalhe: err.message });
      }
      res.status(201).json({
        msg: '✅ Lead criado com sucesso',
        lead: { id: this.lastID, nome, contato, origem, interesse, status: 'novo' }
      });
    }
  );
};

/**
 * Listar todos os leads
 * - Retorna todos os registros ordenados por data
 * Método: GET /leads
 */
exports.listarLeads = (req, res) => {
  db.all(`SELECT * FROM leads ORDER BY data_criacao DESC`, [], (err, rows) => {
    if (err) {
      console.error('❌ Erro ao listar leads:', err.message);
      return res.status(500).json({ error: 'Erro interno ao listar leads', detalhe: err.message });
    }
    res.json({ leads: rows });
  });
};

/**
 * Atualizar status do lead (ex: convertido, perdido)
 * - Recebe status e opcionalmente vendedor_id
 * Método: PUT /leads/:id/status
 */
exports.atualizarStatusLead = (req, res) => {
  const { id } = req.params;
  const { status, vendedor_id } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Campo obrigatório: status' });
  }

  db.run(
    `UPDATE leads SET status = ?, vendedor_id = ? WHERE id = ?`,
    [status, vendedor_id || null, id],
    function (err) {
      if (err) {
        console.error('❌ Erro ao atualizar status do lead:', err.message);
        return res.status(500).json({ error: 'Erro interno ao atualizar lead', detalhe: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Lead não encontrado' });
      }
      res.json({ msg: '✅ Status atualizado com sucesso', id, status });
    }
  );
};

/**
 * Excluir lead
 * - Remove lead pelo ID
 * Método: DELETE /leads/:id
 */
exports.excluirLead = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM leads WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error('❌ Erro ao excluir lead:', err.message);
      return res.status(500).json({ error: 'Erro interno ao excluir lead', detalhe: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }
    res.json({ msg: `✅ Lead ${id} excluído com sucesso` });
  });
};
/**
 * Listar todas as atribuições de leads
 * - Retorna histórico de leads distribuídos para vendedores
 * Método: GET /leads/atribuicoes
 */
exports.listarAtribuicoes = (req, res) => {
  const db = require('../config/db');

  db.all(`SELECT * FROM leads_atribuicoes ORDER BY criado_em DESC`, [], (err, rows) => {
    if (err) {
      console.error('❌ Erro ao listar atribuições de leads:', err.message);
      return res.status(500).json({ error: 'Erro interno ao listar atribuições', detalhe: err.message });
    }
    res.json({ atribuicoes: rows });
  });
};
