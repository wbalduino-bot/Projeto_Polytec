// backend/controllers/pedidoController.js

const Pedido = require('../models/Pedido');
const PedidoProduto = require('../models/PedidoProduto');
const Cliente = require('../models/Cliente');
const Produto = require('../models/Produto');

/**
 * Cria um novo pedido.
 * Exemplo: POST /api/pedidos
 * - Recebe clienteId, vendedorId e lista de produtos
 * - Calcula valor total
 * - Cria o pedido e insere os itens vinculados
 */
async function criarPedido(req, res) {
  try {
    const { clienteId, vendedorId, produtos } = req.body;

    // Calcula valor total
    let valorTotal = 0;
    produtos.forEach(item => {
      valorTotal += item.quantidade * item.precoUnitario;
    });

    // Cria o pedido
    const pedido = await Pedido.create({
      cliente_id: clienteId,
      vendedor_id: vendedorId,
      status: 'aberto',
      valor_total: valorTotal,
    });

    // Insere os itens vinculados
    for (const item of produtos) {
      await PedidoProduto.create({
        pedido_id: pedido.id,
        produto_id: item.produtoId,
        quantidade: item.quantidade,
        preco_unitario: item.precoUnitario,
      });
    }

    res.status(201).json({ msg: 'Pedido criado com sucesso', pedidoId: pedido.id, valorTotal });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar pedido', detalhe: err.message });
  }
}

/**
 * Lista todos os pedidos cadastrados.
 * Exemplo: GET /api/pedidos
 * - Inclui cliente e vendedor vinculados
 * - Inclui produtos do pedido
 */
async function listarPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Cliente, attributes: ['id', 'nome', 'segmento'] },
        { model: PedidoProduto, include: [{ model: Produto, attributes: ['id', 'nome', 'preco'] }] }
      ],
      order: [['id', 'DESC']]
    });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar pedidos', detalhe: err.message });
  }
}

/**
 * Atualiza o status de um pedido específico.
 * Exemplo: PUT /api/pedidos/:id/status
 * - Valida status permitido
 * - Atualiza o campo 'status'
 */
async function atualizarStatus(req, res) {
  try {
    const pedidoId = req.params.id;
    const { status } = req.body;

    const statusPermitidos = ['aberto', 'faturado', 'entregue'];
    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    await Pedido.update({ status, atualizado_em: new Date() }, { where: { id: pedidoId } });
    res.json({ msg: `Status do pedido ${pedidoId} atualizado para ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar status', detalhe: err.message });
  }
}

/**
 * Exclui um pedido específico.
 * Exemplo: DELETE /api/pedidos/:id
 * - Remove itens vinculados
 * - Remove o pedido
 */
async function excluirPedido(req, res) {
  try {
    const pedidoId = req.params.id;

    // Remove itens vinculados
    await PedidoProduto.destroy({ where: { pedido_id: pedidoId } });

    // Remove pedido
    await Pedido.destroy({ where: { id: pedidoId } });

    res.json({ msg: `Pedido ${pedidoId} excluído com sucesso` });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir pedido', detalhe: err.message });
  }
}

module.exports = {
  criarPedido,
  listarPedidos,
  atualizarStatus,
  excluirPedido,
};
