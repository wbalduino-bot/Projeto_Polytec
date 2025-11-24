// ============================
// 📦 Index de Modelos Sequelize
// ============================
// Centraliza a importação e associação dos modelos.
// Evita problemas de importação circular e garante
// que todos os relacionamentos sejam configurados.
// ============================

const sequelize = require('../config/database'); // instância do Sequelize

// ============================
// 📌 Importação de modelos
// ============================
const Pedido = require('./Pedido');
const Pagamento = require('./Pagamento');
const Venda = require('./Vendas'); // 📊 Novo modelo de vendas

// ============================
// 🔗 Configuração de Relacionamentos
// ============================

// Pedido ↔ Pagamento
// - Um Pedido pode ter vários Pagamentos
// - Cada Pagamento pertence a um Pedido
Pedido.hasMany(Pagamento, { foreignKey: 'pedido_id', as: 'pagamentos' });
Pagamento.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedidoPrincipal' });
// 👆 Corrigido: alias único "pedidoPrincipal" para evitar conflito

// Futuro: Venda ↔ Cliente (quando criarmos modelo Cliente)
// Exemplo: Cliente.hasMany(Venda); Venda.belongsTo(Cliente);

// ============================
// 📤 Exporta modelos e sequelize
// ============================
// O objeto db centraliza todos os modelos e a instância do Sequelize.
// Assim, podemos importar db em qualquer parte do backend e acessar:
//   db.Pedido.findAll(), db.Venda.create(), etc.
// ============================
const db = {
  sequelize,
  Pedido,
  Pagamento,
  Venda, // 📊 Disponível para relatórios
};

module.exports = db;
