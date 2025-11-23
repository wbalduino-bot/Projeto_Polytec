const Produto = require('../models/Produto');
const MovimentacaoEstoque = require('../models/MovimentacaoEstoque');
const { Op } = require('sequelize');

exports.registrarMovimentacao = async (req, res) => {
  try {
    const { produto_id, tipo, quantidade, observacao } = req.body;

    const produto = await Produto.findByPk(produto_id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    const novaMov = await MovimentacaoEstoque.create({
      produto_id,
      tipo,
      quantidade,
      observacao,
    });

    // Atualiza estoque
    if (tipo === 'entrada') {
      produto.estoque_atual += quantidade;
    } else if (tipo === 'saida') {
      produto.estoque_atual -= quantidade;
    }

    await produto.save();

    res.status(201).json(novaMov);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao registrar movimentação', detalhes: error.message });
  }
};

exports.listarMovimentacoes = async (req, res) => {
    try {
      const { produto_id, tipo } = req.query;
  
      const where = {};
      if (produto_id) where.produto_id = produto_id;
      if (tipo) where.tipo = tipo;
  
      const movimentacoes = await MovimentacaoEstoque.findAll({
        where,
        include: Produto,
        order: [['createdAt', 'DESC']],
      });
  
      res.json(movimentacoes);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar movimentações', detalhes: error.message });
    }
  };

 

exports.resumoPorProduto = async (req, res) => {
  try {
    const movimentacoes = await MovimentacaoEstoque.findAll({
      include: Produto,
    });

    const resumo = {};

    movimentacoes.forEach((m) => {
      const nome = m.Produto?.nome || 'Desconhecido';
      if (!resumo[nome]) resumo[nome] = { entrada: 0, saida: 0 };
      resumo[nome][m.tipo] += m.quantidade;
    });

    res.json(resumo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar resumo', detalhes: error.message });
  }
};

  
