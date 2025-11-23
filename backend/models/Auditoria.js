// ==========================
// 📌 backend/models/Auditoria.js
// ==========================
// Modelo responsável por registrar e consultar logs de auditoria.
// Utiliza SQLite (via db.run / db.all) para persistir eventos críticos.
// Cada log contém: ação, usuário relacionado, detalhes e timestamp.
// ==========================

const db = require('../config/db');

class Auditoria {
  /**
   * 📤 Registrar uma ação de auditoria
   * @param {string} acao - Descrição da ação (ex.: "Tentativa de acesso", "Login realizado")
   * @param {number|null} usuarioId - ID do usuário (pode ser null se não autenticado)
   * @param {string} detalhes - Informações adicionais sobre o evento
   * @returns {Promise<number>} - Retorna o ID do log inserido
   */
  static registrar(acao, usuarioId, detalhes) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO auditoria (acao, usuario_id, detalhes, criado_em)
         VALUES (?, ?, ?, datetime('now'))`,
        [acao, usuarioId, detalhes],
        function (err) {
          if (err) {
            console.error('❌ Erro ao registrar auditoria:', err.message);
            return reject(err);
          }
          resolve(this.lastID); // retorna o ID do registro inserido
        }
      );
    });
  }

  /**
   * 📋 Listar todos os registros de auditoria
   * @returns {Promise<Array>} - Retorna todos os logs ordenados por data (mais recentes primeiro)
   */
  static listarTodos() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM auditoria ORDER BY criado_em DESC`, [], (err, rows) => {
        if (err) {
          console.error('❌ Erro ao listar auditoria:', err.message);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  /**
   * 🔎 Listar registros de auditoria de um usuário específico
   * @param {number} usuarioId - ID do usuário
   * @returns {Promise<Array>} - Retorna os logs relacionados ao usuário
   */
  static listarPorUsuario(usuarioId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM auditoria WHERE usuario_id = ? ORDER BY criado_em DESC`,
        [usuarioId],
        (err, rows) => {
          if (err) {
            console.error('❌ Erro ao listar auditoria por usuário:', err.message);
            return reject(err);
          }
          resolve(rows);
        }
      );
    });
  }

  /**
   * 🧹 Limpar registros antigos de auditoria
   * @param {string} dataLimite - Data limite em formato YYYY-MM-DD
   * @returns {Promise<number>} - Retorna o número de registros removidos
   */
  static limparAntigos(dataLimite) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM auditoria WHERE date(criado_em) < date(?)`,
        [dataLimite],
        function (err) {
          if (err) {
            console.error('❌ Erro ao limpar auditoria antiga:', err.message);
            return reject(err);
          }
          resolve(this.changes); // número de registros removidos
        }
      );
    });
  }
}

module.exports = Auditoria;
