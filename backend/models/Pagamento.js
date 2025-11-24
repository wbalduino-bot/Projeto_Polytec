// ============================
// 💳 Modelo Sequelize: Pagamento
// ============================
// Representa os registros de pagamentos vinculados a pedidos.
// Inclui informações sobre forma de pagamento, valor, status,
// URL do boleto e flag de e-mail enviado.
// ============================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // instância do Sequelize

const Pagamento = sequelize.define('Pagamento', {
  // 🔑 Chave primária
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // 🔗 Relacionamento com Pedido
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos', // nome da tabela no banco
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },

  // 💳 Forma de pagamento (boleto, cartão, pix, etc.)
  forma_pagamento: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  // 💰 Valor pago ou a pagar
  valor_pago: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  // 📌 Status do pagamento (pendente, pago, cancelado)
  status: {
    type: DataTypes.ENUM('pendente', 'pago', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendente',
  },

  // 🔗 URL do boleto gerado (quando aplicável)
  boleto_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // 📧 Flag para indicar se o e-mail com boleto foi enviado
  email_enviado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  // 🕒 Data de criação
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  // 🕒 Data de atualização
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pagamentos',
  timestamps: false, // ⚠️ Desativamos timestamps automáticos
  underscored: true, // garante nomes com underscore (created_at, updated_at)
});

// ⚠️ Importante: não declarar belongsTo aqui.
// Relacionamentos ficam centralizados em models/index.js
// Isso evita duplicação de alias e erros de Sequelize.

module.exports = Pagamento;
