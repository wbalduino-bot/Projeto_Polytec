const Pedido = require('../models/Pedido');
const ItemPedido = require('../models/ItemPedido');
const Produto = require('../models/Produto');

exports.criarPedido = async (req, res) => {
  try {
    const { cliente_id, itens } = req.body;

    let valor_total = 0;
    for (const item of itens) {
      valor_total += item.quantidade * item.preco_unitario;
    }

    const pedido = await Pedido.create({ cliente_id, valor_total });

    for (const item of itens) {
      await ItemPedido.create({
        pedido_id: pedido.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        subtotal: item.quantidade * item.preco_unitario,
      });

      // Atualiza estoque
      const produto = await Produto.findByPk(item.produto_id);
      produto.estoque_atual -= item.quantidade;
      await produto.save();
    }

    res.status(201).json({ pedido_id: pedido.id });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar pedido', detalhes: error.message });
  }
};

//Funcao lista pedidos
exports.listarPedidos = async (req, res) => {
  try {
    const { cliente_id, status, data_inicio, data_fim } = req.query;

    const where = {};
    if (cliente_id) where.cliente_id = cliente_id;
    if (status) where.status = status;
    if (data_inicio && data_fim) {
      where.data_pedido = {
        [Op.between]: [new Date(data_inicio), new Date(data_fim)],
      };
    }

    const pedidos = await Pedido.findAll({
      where,
      include: ['Cliente', 'ItemPedidos'],
      order: [['data_pedido', 'DESC']],
    });

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar pedidos', detalhes: error.message });
  }
};


// Faturamento por Cliente
exports.resumoPorCliente = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({ include: ['Cliente'] });

    const resumo = {};
    pedidos.forEach((p) => {
      const nome = p.Cliente?.nome || 'Desconhecido';
      if (!resumo[nome]) resumo[nome] = 0;
      resumo[nome] += parseFloat(p.valor_total);
    });

    res.json(resumo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar resumo por cliente', detalhes: error.message });
  }
};

// Faturamento por Produto
exports.resumoPorProduto = async (req, res) => {
  try {
    const itens = await ItemPedido.findAll({ include: ['Produto'] });

    const resumo = {};
    itens.forEach((item) => {
      const nome = item.Produto?.nome || 'Desconhecido';
      if (!resumo[nome]) resumo[nome] = 0;
      resumo[nome] += parseFloat(item.subtotal);
    });

    res.json(resumo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar resumo por produto', detalhes: error.message });
  }
};

// Faturamento por Mês
exports.resumoMensal = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();

    const resumo = {};

    pedidos.forEach((p) => {
      const mes = new Date(p.data_pedido).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!resumo[mes]) resumo[mes] = 0;
      resumo[mes] += parseFloat(p.valor_total);
    });

    res.json(resumo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar resumo mensal', detalhes: error.message });
  }
};

// Funcao atualiza status do pedido
exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pedido = await Pedido.findById(id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

    pedido.status = status;
    await pedido.save();

    res.json({ mensagem: 'Status atualizado com sucesso', pedido });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};