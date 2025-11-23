// ============================
// Modelo de Reembolso
// ============================

const db = require('../config/db');

class Reembolso {
  /**
   * Criar novo reembolso
   * @param {number} usuarioId - ID do usuário solicitante
   * @param {string} notaFiscal - Número da nota fiscal
   * @param {number} valor - Valor do reembolso
   * @returns {Promise<number>} - ID do reembolso criado
   */
  static criar(usuarioId, notaFiscal, valor) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO reembolsos (usuario_id, nota_fiscal, valor, status, data_pedido)
         VALUES (?, ?, ?, 'pendente', datetime('now'))`,
        [usuarioId, notaFiscal, valor],
        function (err) {
          if (err) {
            console.error('❌ Erro ao criar reembolso:', err.message);
            return reject(err);
          }
          resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Listar todos os reembolsos
   * @returns {Promise<Array>} - Lista de reembolsos
   */
  static listarTodos() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM reembolsos ORDER BY data_pedido DESC`, [], (err, rows) => {
        if (err) {
          console.error('❌ Erro ao listar reembolsos:', err.message);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  /**
   * Buscar reembolso por ID
   * @param {number} id - ID do reembolso
   * @returns {Promise<Object|null>} - Reembolso encontrado ou null
   */
  static buscarPorId(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM reembolsos WHERE id = ?`, [id], (err, row) => {
        if (err) {
          console.error('❌ Erro ao buscar reembolso:', err.message);
          return reject(err);
        }
        resolve(row || null);
      });
    });
  }

  /**
   * Atualizar status de um reembolso
   * @param {number} id - ID do reembolso
   * @param {string} status - Novo status
   * @param {string|null} observacao - Observação opcional
   * @returns {Promise<boolean>} - true se atualizado, false se não encontrado
   */
  static atualizarStatus(id, status, observacao) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE reembolsos SET status = ?, observacao = ? WHERE id = ?`,
        [status, observacao || null, id],
        function (err) {
          if (err) {
            console.error('❌ Erro ao atualizar status:', err.message);
            return reject(err);
          }
          resolve(this.changes > 0);
        }
      );
    });
  }

  /**
   * Excluir reembolso
   * @param {number} id - ID do reembolso
   * @returns {Promise<boolean>} - true se excluído, false se não encontrado
   */
  static excluir(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM reembolsos WHERE id = ?`, [id], function (err) {
        if (err) {
          console.error('❌ Erro ao excluir reembolso:', err.message);
          return reject(err);
        }
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = Reembolso;
