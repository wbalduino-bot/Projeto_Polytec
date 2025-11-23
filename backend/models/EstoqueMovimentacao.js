// backend/models/EstoqueMovimentacao.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Produto = require('./Produto');

/**
 * Modelo EstoqueMovimentacao
 * Representa a tabela 'estoque_movimentacao' no banco de dados.
 * 
 * Campos conforme CREATE TABLE:
 * - id: chave primária
 * - produto_id: referência ao produto movimentado (FK para produtos.id)
 * - tipo: ENUM('entrada','saida') → tipo da movimentação
 * - quantidade: quantidade movimentada (obrigatório)
 * - origem: origem da movimentação (ex.: pedido, ajuste manual)
 * - data_movimentacao: TIMESTAMP default CURRENT_TIMESTAMP
 */
const EstoqueMovimentacao = sequelize.define('EstoqueMovimentacao', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  produto_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
    // FK: produtos.id
  },
  tipo: { 
    type: DataTypes.ENUM('entrada', 'saida'), 
    allowNull: false 
  },
  quantidade: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  origem: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  data_movimentacao: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
}, {
  tableName: 'estoque_movimentacao',
  timestamps: false,
});

// Relacionamento: um produto pode ter várias movimentações
Produto.hasMany(EstoqueMovimentacao, { foreignKey: 'produto_id' });
EstoqueMovimentacao.belongsTo(Produto, { foreignKey: 'produto_id' });

module.exports = EstoqueMovimentacao;
