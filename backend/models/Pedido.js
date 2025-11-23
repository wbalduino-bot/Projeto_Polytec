// ============================
// 📦 Modelo Sequelize: Pedido
// ============================
// Representa a tabela 'pedidos' no banco de dados.
// Cada pedido pertence a um cliente e a um vendedor,
// e pode ter vários pagamentos vinculados.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // importa instância do Sequelize

const Pedido = sequelize.define('Pedido', {
  // 🔑 Chave primária
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },

  // 🧑 Cliente associado ao pedido (FK para clientes.id)
  cliente_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'clientes', // nome da tabela no banco
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },

  // 👨‍💼 Vendedor responsável pelo pedido (FK para usuarios.id)
  vendedor_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'usuarios', // nome da tabela no banco
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },

  // 📌 Status do pedido
  // ENUM garante valores controlados: 'aberto', 'faturado', 'entregue'
  status: { 
    type: DataTypes.ENUM('aberto', 'faturado', 'entregue'), 
    defaultValue: 'aberto',
    allowNull: false,
  },

  // 💰 Valor total do pedido
  valor_total: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false 
  },

  // 🕒 Data de criação
  criado_em: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },

  // 🕒 Data de atualização
  atualizado_em: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },
}, {
  tableName: 'pedidos',
  timestamps: false, // desabilita createdAt/updatedAt automáticos
});

// ============================
// 🔗 Relacionamentos
// ============================
// Um pedido pode ter vários pagamentos vinculados
Pedido.associate = (models) => {
  Pedido.hasMany(models.Pagamento, {
    foreignKey: 'pedido_id',
    as: 'pagamentos',
  });
};

module.exports = Pedido;
