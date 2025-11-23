// backend/models/PedidoProduto.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./Pedido');
const Produto = require('./Produto');

/**
 * Modelo PedidoProduto
 * Representa a tabela intermediária 'pedido_produto' no banco de dados.
 * 
 * Campos conforme CREATE TABLE:
 * - id: chave primária (SERIAL → INTEGER autoIncrement no Sequelize)
 * - pedido_id: referência ao pedido (FK para pedidos.id)
 * - produto_id: referência ao produto (FK para produtos.id)
 * - quantidade: quantidade do produto no pedido (NOT NULL)
 * - preco_unitario: preço unitário no momento da compra (NOT NULL)
 */
const PedidoProduto = sequelize.define('PedidoProduto', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  pedido_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
    // FK: pedidos.id
  },
  produto_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
    // FK: produtos.id
  },
  quantidade: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  preco_unitario: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
}, {
  tableName: 'pedido_produto',
  timestamps: false, // desabilita createdAt/updatedAt automáticos
});

// Relacionamentos
Pedido.hasMany(PedidoProduto, { foreignKey: 'pedido_id' });
PedidoProduto.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Produto.hasMany(PedidoProduto, { foreignKey: 'produto_id' });
PedidoProduto.belongsTo(Produto, { foreignKey: 'produto_id' });

module.exports = PedidoProduto;
