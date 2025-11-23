// backend/models/Previsao.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const TreinamentoModelo = require('./TreinamentoModelo');

/**
 * Modelo Previsao
 * Representa a tabela 'previsoes' no banco de dados.
 * 
 * Campos conforme CREATE TABLE:
 * - id: chave primária
 * - vendedor_id: referência ao usuário (FK para usuarios.id)
 * - mes: período da previsão (formato 'YYYY-MM')
 * - previsao_valor: valor previsto
 * - modelo_versao: versão do modelo usado (FK para treinamentos_modelo.versao)
 * - criado_em: TIMESTAMP default CURRENT_TIMESTAMP
 */
const Previsao = sequelize.define('Previsao', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  vendedor_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
    // FK: usuarios.id
  },
  mes: { 
    type: DataTypes.STRING(7), 
    allowNull: false 
    // formato 'YYYY-MM'
  },
  previsao_valor: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: true 
  },
  modelo_versao: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
    // FK: treinamentos_modelo.versao
  },
  criado_em: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
}, {
  tableName: 'previsoes',
  timestamps: false,
});

// Relacionamentos
Usuario.hasMany(Previsao, { foreignKey: 'vendedor_id' });
Previsao.belongsTo(Usuario, { foreignKey: 'vendedor_id' });

TreinamentoModelo.hasMany(Previsao, { foreignKey: 'modelo_versao', sourceKey: 'versao' });
Previsao.belongsTo(TreinamentoModelo, { foreignKey: 'modelo_versao', targetKey: 'versao' });

module.exports = Previsao;
