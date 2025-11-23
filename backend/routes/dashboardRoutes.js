const express = require('express');
const router = express.Router();

// Importa os controladores responsáveis por cada métrica do dashboard
const {
  getTotais,                    // Retorna totais agregados: vendas, pedidos, clientes, etc.
  getOportunidadesPorEstagio,  // Retorna quantidade de oportunidades por estágio do funil
  getClientesAtivos,           // Retorna proporção de clientes ativos vs inativos
  getInteracoesPorMes,         // Retorna volume de interações comerciais por mês
  getTaxaConversao,            // Retorna taxa de conversão de leads em vendas
  getAlertasDashboard          // Retorna alertas automáticos com base nos filtros aplicados
} = require('../controllers/dashboardController');

// Rota para totais gerais do sistema (indicadores principais)
router.get('/totais', getTotais);

// Rota para oportunidades agrupadas por estágio (funil de vendas)
router.get('/oportunidades-por-estagio', getOportunidadesPorEstagio);

// Rota para proporção de clientes ativos vs inativos
router.get('/clientes-ativos', getClientesAtivos);

// Rota para interações comerciais registradas por mês
router.get('/interacoes-por-mes', getInteracoesPorMes);

// Rota para taxa de conversão de leads em vendas
router.get('/taxa-conversao', getTaxaConversao);

// Rota para alertas automáticos do dashboard (metas, oportunidades, clientes inativos)
router.get('/alertas', getAlertasDashboard);

module.exports = router;
