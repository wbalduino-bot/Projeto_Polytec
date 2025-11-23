// ==========================
// 📌 Importações principais
// ==========================
const db = require('../config/db'); // conexão SQLite

// ==========================
// 🗄️ Modelo de Contato
// ==========================
const contatoModel = {
  // Inserir nova mensagem de contato
  criar: (nome, email, mensagem, callback) => {
    const sql = `INSERT INTO contatos (nome, email, mensagem, data) VALUES (?, ?, ?, datetime('now'))`;
    db.run(sql, [nome, email, mensagem], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, nome, email, mensagem, data: new Date() });
    });
  },

  // Listar todas as mensagens
  listarTodos: (callback) => {
    const sql = `SELECT * FROM contatos ORDER BY data DESC`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  }
};

module.exports = contatoModel;
