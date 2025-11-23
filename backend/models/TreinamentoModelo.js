// backend/models/TreinamentoModelo.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo TreinamentoModelo
 * Representa a tabela 'treinamentos_modelo' no banco de dados.
 * 
 * Campos conforme CREATE TABLE:
 * - id: chave primária
 * - algoritmo: nome do algoritmo usado no treinamento
 * - data_treinamento: data em que o modelo foi treinado
 * - origem_dados: origem dos dados utilizados
 * - quantidade_registros: número de registros usados no treinamento
 * - versao: versão única do modelo treinado
 * - criado_em: TIMESTAMP default CURRENT_TIMESTAMP
 */
const TreinamentoModelo = sequelize.define('TreinamentoModelo', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  algoritmo: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  data_treinamento: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  origem_dados: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  quantidade_registros: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  versao: { 
    type: DataTypes.STRING(20), 
    unique: true, 
    allowNull: false 
  },
  criado_em: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
}, {
  tableName: 'treinamentos_modelo',
  timestamps: false,
});

module.exports = TreinamentoModelo;
