// backend/config/database.js

const { Sequelize } = require('sequelize');
const path = require('path');
/**
 * Configuração da conexão com o banco de dados usando Sequelize.
 * Neste caso, estamos utilizando SQLite como banco local.
 * 
 * - dialect: define o tipo de banco (sqlite, postgres, mysql, etc.)
 * - storage: caminho do arquivo do banco SQLite
 * 
 * Observação: caso queira trocar para outro banco (ex.: Postgres),
 * basta ajustar o dialect e fornecer host, username, password e database.
 */

let sequelize;
if (process.env.DATABASE_URL) {
  // Produção → Postgres (Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Render exige SSL, mas sem validação de certificado
      }
    }
  });
}

/**
 * Testa a conexão com o banco de dados.
 * Útil para garantir que o Sequelize está configurado corretamente.
 */
async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
  }
}

// Executa o teste de conexão ao carregar o módulo
testarConexao();

module.exports = sequelize;
