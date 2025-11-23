// ============================
// Configuração do Banco SQLite
// ============================

// Importa o driver SQLite3
const sqlite3 = require('sqlite3').verbose();

// Importa bcrypt para criptografar senhas
const bcrypt = require('bcrypt');
const saltRounds = 10; // número de rounds para gerar o hash

// Importa path para manipular caminhos de arquivos
const path = require('path');

// File System
const fs = require('fs');


// 📌 Pega o caminho do banco do .env (DB_PATH) ou usa padrão local
// Dentro do Docker, DB_PATH deve ser /app/data/oraculo.sqlite
// Fora do Docker, pode ser ./data/oraculo.sqlite
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/oraculo.sqlite');

// 🗂️ Cria ou abre o banco de dados SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao SQLite:', err.message);
    return;
  }

  console.log(`✅ Conectado ao banco SQLite em: ${dbPath}`);

  // 🏗️ Cria a tabela de usuários se não existir
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela "usuarios":', err.message);
      return;
    } 

    console.log('✅ Tabela "usuarios" pronta');

    // 👤 Criptografa a senha e insere usuário de teste
    const senhaOriginal = '123456';
    bcrypt.hash(senhaOriginal, saltRounds, (err, hash) => {
      if (err) {
        console.error('❌ Erro ao criptografar senha:', err.message);
        return;
      }

      db.run(`
        INSERT OR IGNORE INTO usuarios (nome, email, senha)
        VALUES ('João da Silva', 'teste@email.com', ?)
      `, [hash], (err) => {
        if (err) {
          console.error('❌ Erro ao inserir usuário de teste:', err.message);
        } else {
          console.log('✅ Usuário de teste inserido com senha criptografada');
        }
      });
    });
  });
});

// Executa schema.sql na inicialização
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema, (err) => {
  if (err) {
    console.error('Erro ao criar tabelas:', err);
  } else {
    console.log('Tabelas criadas com sucesso!');
  }
});

// Exporta a instância do banco para ser usada em outros módulos
module.exports = db;
