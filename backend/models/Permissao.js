// backend/models/Permissao.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo Permissao
 * Representa a tabela 'permissoes' no banco de dados.
 * 
 * Campos conforme CREATE TABLE:
 * - id: chave primária
 * - perfil: perfil associado (admin, gerente, vendedor)
 * - pode_aplicar_desconto: boolean (default false)
 * - pode_excluir_pedido: boolean (default false)
 */
const Permissao = sequelize.define('Permissao', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  perfil: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
  pode_aplicar_desconto: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  pode_excluir_pedido: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
}, {
  tableName: 'permissoes',
  timestamps: false,
});

module.exports = Permissao;
