const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Produto = require('./Produto');

const MovimentacaoEstoque = sequelize.define('MovimentacaoEstoque', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  observacao: {
    type: DataTypes.STRING,
  },
});

Produto.hasMany(MovimentacaoEstoque, { foreignKey: 'produto_id' });
MovimentacaoEstoque.belongsTo(Produto, { foreignKey: 'produto_id' });

module.exports = MovimentacaoEstoque;
