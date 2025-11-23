// backend/controllers/produtoController.js

const Produto = require('../models/Produto');
const EstoqueMovimentacao = require('../models/EstoqueMovimentacao');

/**
 * Cria um novo produto.
 * Exemplo: POST /api/produtos
 */
async function criarProduto(req, res) {
  try {
    const { nome, categoria, preco, estoque_atual } = req.body;

    const produto = await Produto.create({
      nome,
      categoria,
      preco,
      estoque_atual,
    });

    res.status(201).json({ msg: 'Produto criado com sucesso', produto });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto', detalhe: err.message });
  }
}

/**
 * Lista todos os produtos cadastrados.
 * Exemplo: GET /api/produtos
 */
async function listarProdutos(req, res) {
  try {
    const produtos = await Produto.findAll({ order: [['id', 'DESC']] });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar produtos', detalhe: err.message });
  }
}

/**
 * Atualiza o estoque de um produto específico.
 * Exemplo: PUT /api/produtos/:id/estoque
 * - Atualiza quantidade
 * - Registra movimentação no histórico
 */
async function atualizarEstoque(req, res) {
  try {
    const produtoId = req.params.id;
    const { quantidade, tipo, origem } = req.body;

    const produto = await Produto.findByPk(produtoId);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Atualiza estoque
    let novoEstoque = produto.estoque_atual;
    if (tipo === 'entrada') {
      novoEstoque += quantidade;
    } else if (tipo === 'saida') {
      novoEstoque -= quantidade;
      if (novoEstoque < 0) novoEstoque = 0;
    }

    await produto.update({ estoque_atual: novoEstoque });

    // Registra movimentação
    await EstoqueMovimentacao.create({
      produto_id: produtoId,
      tipo,
      quantidade,
      origem,
    });

    res.json({ msg: `Estoque do produto ${produtoId} atualizado para ${novoEstoque}` });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar estoque', detalhe: err.message });
  }
}

/**
 * Aplica desconto dinâmico em um produto específico.
 * Exemplo: POST /api/produtos/:id/desconto
 * - Recebe percentual de desconto no corpo da requisição
 * - Atualiza o preço do produto aplicando o desconto informado
 * - Somente gerente e admin podem executar (rota já valida permissões)
 */
async function aplicarDesconto(req, res) {
  try {
    const produtoId = req.params.id;
    const { percentual } = req.body;

    if (percentual <= 0 || percentual > 100) {
      return res.status(400).json({ error: 'Percentual de desconto inválido' });
    }

    const produto = await Produto.findByPk(produtoId);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const novoPreco = produto.preco * (1 - percentual / 100);
    await produto.update({ preco: novoPreco });

    res.json({ msg: `Desconto de ${percentual}% aplicado ao produto ${produtoId}`, novoPreco });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao aplicar desconto', detalhe: err.message });
  }
}

module.exports = {
  criarProduto,
  listarProdutos,
  atualizarEstoque,
  aplicarDesconto,
};
