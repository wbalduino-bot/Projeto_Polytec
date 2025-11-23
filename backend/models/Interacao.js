// backend/models/Interacao.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');

const Interacao = sequelize.define('Interacao', {
  tipo: {
    type: DataTypes.ENUM('email', 'ligação', 'reunião'),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'interacoes',
  timestamps: true,
});

// Relacionamento com Cliente
Cliente.hasMany(Interacao, { foreignKey: 'clienteId' });
Interacao.belongsTo(Cliente, { foreignKey: 'clienteId' });

module.exports = Interacao;
