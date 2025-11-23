// backend/models/Meta.js

module.exports = (sequelize, DataTypes) => {
  const Meta = sequelize.define('Meta', {
    // Identificador único da meta
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // ID do vendedor responsável pela meta
    vendedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // Mês da meta (formato YYYY-MM)
    mes: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Valor da meta definida (ex: R$ 20.000)
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    // Valor realizado até o momento (ex: R$ 12.000)
    realizado: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    }
  }, {
    tableName: 'metas', // Nome da tabela no banco de dados
    timestamps: false   // Desativa campos createdAt e updatedAt
  });

  return Meta;
};
