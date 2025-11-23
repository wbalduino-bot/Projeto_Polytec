// backend/models/Cliente.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo Cliente
 * Representa a tabela 'clientes' no banco de dados.
 * 
 * Campos conforme CREATE TABLE:
 * - id: chave primária
 * - nome: nome do cliente (obrigatório)
 * - segmento: segmento de mercado (opcional)
 * - status: ENUM('ativo','inativo')
 * - criado_em: TIMESTAMP default CURRENT_TIMESTAMP
 */
const Cliente = sequelize.define('Cliente', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nome: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  segmento: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  status: { 
    type: DataTypes.ENUM('ativo', 'inativo'), 
    defaultValue: 'ativo' 
  },
  criado_em: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
}, {
  tableName: 'clientes',
  timestamps: false,
});

module.exports = Cliente;
