// ============================
// 📊 models/Venda.js
// ============================
// Modelo Sequelize para tabela "vendas"
// ============================

module.exports = (sequelize, DataTypes) => {
  const Venda = sequelize.define('Venda', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    cliente: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nome do cliente ou empresa',
    },

    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Valor da venda',
    },

    data: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Data da venda',
    },

    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Descrição opcional da venda',
    },
  }, {
    tableName: 'vendas', // nome da tabela no banco
    timestamps: true,    // cria automaticamente createdAt e updatedAt
    underscored: true,   // usa snake_case no banco (created_at, updated_at)
  });

  return Venda;
};
