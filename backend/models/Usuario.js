// backend/models/Usuario.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo Usuario
 * Representa a tabela 'usuarios' no banco de dados.
 * 
 * Campos:
 * - id: chave primária autoIncrement
 * - nome: nome do usuário (obrigatório)
 * - email: único e obrigatório, validado como email
 * - senha_hash: hash da senha (obrigatório)
 * - perfil: ENUM('admin','gerente','vendedor') → define nível de acesso
 * - status: ENUM('ativo','inativo') → controla se o usuário está ativo
 * - criado_em: TIMESTAMP → data de criação (default CURRENT_TIMESTAMP)
 */
const Usuario = sequelize.define('Usuario', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nome: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING,
    allowNull: false,        // Email é obrigatório
    unique: true,            // Não permite emails duplicados
    validate: {
      isEmail: true,         // Valida formato de email
    }
  },
  senha_hash: { 
    type: DataTypes.STRING,
    allowNull: false,        // Senha é obrigatória
  },
  perfil: { 
    type: DataTypes.ENUM('admin', 'gerente', 'vendedor'), 
    allowNull: false,        // Perfil é obrigatório
    defaultValue: 'vendedor' // Por padrão, novos usuários são vendedores
  },
  status: { 
    type: DataTypes.ENUM('ativo', 'inativo'), 
    defaultValue: 'ativo'    // Usuário começa como ativo
  },
  criado_em: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW // Data de criação automática
  }
}, {
  tableName: 'usuarios',     // Nome da tabela no banco
  timestamps: false          // Não cria createdAt/updatedAt automáticos
});

module.exports = Usuario;
