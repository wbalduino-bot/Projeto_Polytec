// ============================
// 💳 Controlador de Pagamentos
// ============================
// Responsável por lidar com operações de pagamento:
// - Registrar pagamento
// - Listar pagamentos
// - Gerar boleto via Asaas
// - Atualizar status de pagamento

const Pagamento = require('../models/Pagamento');
const Pedido = require('../models/Pedido');
const asaas = require('../services/asaasService');
const emailService = require('../services/emailService');

/**
 * 📝 Registrar novo pagamento
 * - Cria um registro de pagamento vinculado a um pedido
 * - Atualiza o status do pedido para "faturado"
 */
exports.registrarPagamento = async (req, res) => {
  try {
    const { pedido_id, forma_pagamento, valor_pago } = req.body;

    // Verifica se o pedido existe
    const pedido = await Pedido.findByPk(pedido_id);
    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }

    // Cria o pagamento
    const pagamento = await Pagamento.create({
      pedido_id,
      forma_pagamento,
      valor_pago,
      status: 'pago',
    });

    // Atualiza status do pedido
    pedido.status = 'faturado';
    await pedido.save();

    res.status(201).json(pagamento);
  } catch (error) {
    console.error('❌ Erro ao registrar pagamento:', error);
    res.status(500).json({ erro: 'Erro ao registrar pagamento', detalhes: error.message });
  }
};

/**
 * 📋 Listar todos os pagamentos
 * - Retorna todos os pagamentos cadastrados
 * - Inclui dados do pedido associado
 */
exports.listarPagamentos = async (req, res) => {
  try {
    const pagamentos = await Pagamento.findAll({ include: Pedido });
    res.json(pagamentos);
  } catch (error) {
    console.error('❌ Erro ao listar pagamentos:', error);
    res.status(500).json({ erro: 'Erro ao listar pagamentos', detalhes: error.message });
  }
};

/**
 * 💳 Gerar boleto via Asaas
 * - Cria cliente e cobrança no Asaas
 * - Cria registro de pagamento com status "pendente"
 * - Envia boleto por e-mail ao cliente
 */
exports.gerarBoleto = async (req, res) => {
  try {
    const { pedido_id, nome, email, cpfCnpj, telefone, valor, vencimento } = req.body;

    // Verifica se o pedido existe
    const pedido = await Pedido.findByPk(pedido_id);
    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }

    // Cria cliente no Asaas
    const cliente = await asaas.criarCliente({
      name: nome,
      email,
      cpfCnpj,
      phone: telefone,
    });

    // Cria cobrança (boleto) no Asaas
    const cobranca = await asaas.criarCobranca({
      customer: cliente.id,
      billingType: 'BOLETO',
      value: valor,
      dueDate: vencimento,
      description: `Pagamento do pedido #${pedido_id}`,
    });

    // Registra pagamento no banco
    const pagamento = await Pagamento.create({
      pedido_id,
      forma_pagamento: 'boleto',
      valor_pago: valor,
      status: 'pendente',
      boleto_url: cobranca.bankSlipUrl,
    });

    // Envia boleto por e-mail
    await emailService.enviarBoleto({
      nome,
      email,
      pedido_id,
      boleto_url: cobranca.bankSlipUrl,
    });

    // Atualiza flag de e-mail enviado
    pagamento.email_enviado = true;
    await pagamento.save();

    res.json({ boleto: cobranca.bankSlipUrl });
  } catch (error) {
    console.error('❌ Erro ao gerar boleto:', error);
    res.status(500).json({ erro: 'Erro ao gerar boleto', detalhes: error.message });
  }
};

/**
 * ✏️ Atualizar status de pagamento
 * - Atualiza o status de um pagamento existente
 */
exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Busca pagamento pelo ID
    const pagamento = await Pagamento.findByPk(id);
    if (!pagamento) {
      return res.status(404).json({ erro: 'Pagamento não encontrado' });
    }

    // Atualiza status
    pagamento.status = status;
    await pagamento.save();

    res.json({ mensagem: 'Status atualizado com sucesso', pagamento });
  } catch (error) {
    console.error('❌ Erro ao atualizar status do pagamento:', error);
    res.status(500).json({ erro: 'Erro ao atualizar status', detalhes: error.message });
  }
};
