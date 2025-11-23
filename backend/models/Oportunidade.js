// backend/models/Oportunidade.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');

const Oportunidade = sequelize.define('Oportunidade', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  valor: { type: DataTypes.FLOAT, allowNull: false },
  probabilidade: { type: DataTypes.INTEGER }, // em porcentagem (0–100)
  estagio: {
    type: DataTypes.ENUM('lead', 'proposta', 'negociacao', 'ganho', 'perdido'),
    defaultValue: 'lead',
  },
  dataFechamentoPrevista: { type: DataTypes.DATE },
}, {
  tableName: 'oportunidades',
  timestamps: true,
});

// Relacionamento com Cliente
Cliente.hasMany(Oportunidade, { foreignKey: 'clienteId' });
Oportunidade.belongsTo(Cliente, { foreignKey: 'clienteId' });

module.exports = Oportunidade;
