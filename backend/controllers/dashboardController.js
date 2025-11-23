const Cliente = require('../models/Cliente');           // Modelo de clientes
const Oportunidade = require('../models/Oportunidade'); // Modelo de oportunidades comerciais
const Interacao = require('../models/Interacao');       // Modelo de interações registradas
const Meta = require('../models/Meta');                 // Modelo de metas comerciais
const { Sequelize, Op } = require('sequelize');         // Utilitários do Sequelize

/**
 * Retorna totais gerais do sistema: número de clientes, oportunidades e interações.
 */
exports.getTotais = async (req, res) => {
  try {
    const totalClientes = await Cliente.count();
    const totalOportunidades = await Oportunidade.count();
    const totalInteracoes = await Interacao.count();

    res.json({ totalClientes, totalOportunidades, totalInteracoes });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

/**
 * Retorna contagem de oportunidades agrupadas por estágio do funil de vendas.
 */
exports.getOportunidadesPorEstagio = async (req, res) => {
  try {
    const resultados = await Oportunidade.findAll({
      attributes: [
        'estagio',
        [Sequelize.fn('COUNT', Sequelize.col('estagio')), 'quantidade']
      ],
      group: ['estagio']
    });

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

/**
 * Retorna proporção de clientes ativos vs inativos.
 */
exports.getClientesAtivos = async (req, res) => {
  try {
    const ativos = await Cliente.count({ where: { ativo: true } });
    const inativos = await Cliente.count({ where: { ativo: false } });

    res.json({ ativos, inativos });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

/**
 * Retorna número de interações comerciais agrupadas por mês no ano atual.
 */
exports.getInteracoesPorMes = async (req, res) => {
  try {
    const anoAtual = new Date().getFullYear();

    const resultados = await Interacao.findAll({
      attributes: [
        [Sequelize.fn('strftime', '%m', Sequelize.col('data')), 'mes'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade']
      ],
      where: Sequelize.where(
        Sequelize.fn('strftime', '%Y', Sequelize.col('data')),
        anoAtual.toString()
      ),
      group: ['mes'],
      order: [['mes', 'ASC']]
    });

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

/**
 * Retorna taxa de conversão de leads em oportunidades ganhas.
 */
exports.getTaxaConversao = async (req, res) => {
  try {
    const totalLeads = await Oportunidade.count({ where: { estagio: 'lead' } });
    const totalGanhos = await Oportunidade.count({ where: { estagio: 'ganho' } });

    const taxaConversao = totalLeads > 0
      ? ((totalGanhos / totalLeads) * 100).toFixed(2)
      : 0;

    res.json({ totalLeads, totalGanhos, taxaConversao });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

/**
 * Retorna alertas automáticos com base em metas não atingidas,
 * oportunidades sem retorno e clientes inativos.
 */
exports.getAlertasDashboard = async (req, res) => {
  const { vendedorId, periodoInicio, periodoFim } = req.query;
  const alertas = [];

  try {
    // 1. Metas não atingidas no período
    const metas = await Meta.findAll({
      where: {
        vendedor_id: vendedorId,
        mes: { [Op.between]: [periodoInicio, periodoFim] }
      }
    });

    metas.forEach(meta => {
      if (meta.realizado < meta.valor) {
        alertas.push(`Meta de ${meta.mes} não foi atingida (R$ ${meta.realizado} / R$ ${meta.valor})`);
      }
    });

    // 2. Oportunidades sem retorno há mais de 10 dias
    const oportunidades = await Oportunidade.findAll({
      where: {
        vendedor_id: vendedorId,
        status: 'aberta'
      }
    });

    oportunidades.forEach(op => {
      const diasSemRetorno = calcularDias(op.ultima_interacao);
      if (diasSemRetorno > 10) {
        alertas.push(`Oportunidade com ${op.cliente} está sem retorno há ${diasSemRetorno} dias`);
      }
    });

    // 3. Clientes inativos há mais de 30 dias
    const clientes = await Cliente.findAll({
      where: { vendedor_id: vendedorId }
    });

    clientes.forEach(cliente => {
      const diasInativo = calcularDias(cliente.ultima_compra);
      if (diasInativo > 30) {
        alertas.push(`Cliente ${cliente.nome} está inativo há ${diasInativo} dias`);
      }
    });

    res.json(alertas);
  } catch (error) {
    console.error('Erro ao gerar alertas:', error);
    res.status(500).json({ erro: 'Erro ao gerar alertas' });
  }
};

/**
 * Retorna previsão de vendas com base em metas realizadas e oportunidades ganhas.
 */
exports.getPrevisaoVendas = async (req, res) => {
  const { vendedorId, meses } = req.query;

  try {
    const mesesArray = meses.split(',');

    // Busca metas realizadas
    const metas = await Meta.findAll({
      where: {
        vendedor_id: vendedorId,
        mes: { [Op.in]: mesesArray }
      }
    });

    // Busca oportunidades ganhas
    const oportunidades = await Oportunidade.findAll({
      where: {
        vendedor_id: vendedorId,
        estagio: 'ganho',
        mes: { [Op.in]: mesesArray }
      }
    });

    const mediaMeta = metas.length
      ? metas.reduce((acc, m) => acc + parseFloat(m.realizado), 0) / metas.length
      : 0;

    const totalGanhos = oportunidades.length;
    const previsao = mediaMeta + totalGanhos * 1000; // Exemplo de projeção

    res.json({ mediaMeta, totalGanhos, previsao });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

/**
 * Função auxiliar para calcular diferença de dias entre hoje e uma data fornecida.
 */
function calcularDias(data) {
  if (!data) return 0;
  const hoje = new Date();
  const referencia = new Date(data);
  const diff = Math.floor((hoje - referencia) / (1000 * 60 * 60 * 24));
  return diff;
}
