// backend/models/Produto.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo Produto
 * Representa a tabela 'produtos' no banco de dados via Sequelize.
 * 
 * Campos:
 * - id: chave primária, auto-incremento
 * - nome: nome do produto (obrigatório)
 * - preco: preço do produto (decimal com 2 casas)
 * - categoria: categoria do produto (enum fixo: Premium, Compacta, Gourmet)
 * - estoque: quantidade disponível em estoque (default 0)
 * - ativo: indica se o produto está ativo para vendas (default true)
 * - criadoEm: data de criação do registro (default NOW)
 * 
 * Configurações:
 * - tableName: define explicitamente o nome da tabela como 'produtos'
 * - timestamps: desabilita os campos automáticos createdAt/updatedAt
 */
const Produto = sequelize.define('Produto', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  preco: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  categoria: {
    type: DataTypes.ENUM('Premium', 'Compacta', 'Gourmet'),
    defaultValue: 'Premium',
    allowNull: false
  },
  estoque: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  ativo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  criadoEm: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
}, {
  tableName: 'produtos',
  timestamps: false,
});

module.exports = Produto;
