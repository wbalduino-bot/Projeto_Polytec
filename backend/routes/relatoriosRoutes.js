// ============================
// 📊 routes/relatorios.js
// ============================
// Rotas de relatórios usando Sequelize ORM
// ============================

const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');
const db = require('../models'); // contém sequelize + modelos

// ============================
// 🔹 Relatório Mensal (ORM)
// ============================
router.get('/mensal', authMiddleware, async (req, res) => {
  try {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;

    // Consulta usando Sequelize ORM
    const vendas = await db.Venda.findAll({
      attributes: [
        'cliente',
        [db.sequelize.fn('SUM', db.sequelize.col('valor')), 'total'],
        [db.sequelize.fn('DATE', db.sequelize.col('data')), 'data']
      ],
      where: db.sequelize.where(
        db.sequelize.fn('YEAR', db.sequelize.col('data')),
        ano
      ),
      // Filtro adicional para mês
      having: db.sequelize.where(
        db.sequelize.fn('MONTH', db.sequelize.col('data')),
        mes
      ),
      group: ['cliente', db.sequelize.fn('DATE', db.sequelize.col('data'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('data')), 'ASC']]
    });

    res.json(vendas);
  } catch (err) {
    console.error('❌ Erro ao gerar relatório mensal:', err);
    res.status(500).json({ erro: 'Erro interno ao gerar relatório mensal' });
  }
});

// ============================
// 🔹 Relatório Anual (ORM)
// ============================
router.get('/anual', authMiddleware, async (req, res) => {
  try {
    const ano = new Date().getFullYear();

    const vendas = await db.Venda.findAll({
      attributes: [
        [db.sequelize.fn('MONTH', db.sequelize.col('data')), 'mes'],
        [db.sequelize.fn('SUM', db.sequelize.col('valor')), 'total']
      ],
      where: db.sequelize.where(
        db.sequelize.fn('YEAR', db.sequelize.col('data')),
        ano
      ),
      group: [db.sequelize.fn('MONTH', db.sequelize.col('data'))],
      order: [[db.sequelize.fn('MONTH', db.sequelize.col('data')), 'ASC']]
    });

    res.json(vendas);
  } catch (err) {
    console.error('❌ Erro ao gerar relatório anual:', err);
    res.status(500).json({ erro: 'Erro interno ao gerar relatório anual' });
  }
});

// ============================
// 🔹 Relatório Customizado (ORM)
// ============================
router.get('/customizado', authMiddleware, authorize(['admin', 'gerente']), async (req, res) => {
  try {
    const { ano, mes } = req.query;

    if (!ano || !mes) {
      return res.status(400).json({ erro: 'Parâmetros ano e mes são obrigatórios' });
    }

    const vendas = await db.Venda.findAll({
      attributes: [
        'cliente',
        [db.sequelize.fn('SUM', db.sequelize.col('valor')), 'total'],
        [db.sequelize.fn('DATE', db.sequelize.col('data')), 'data']
      ],
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('data')), ano),
          db.sequelize.where(db.sequelize.fn('MONTH', db.sequelize.col('data')), mes)
        ]
      },
      group: ['cliente', db.sequelize.fn('DATE', db.sequelize.col('data'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('data')), 'ASC']]
    });

    res.json(vendas);
  } catch (err) {
    console.error('❌ Erro ao gerar relatório customizado:', err);
    res.status(500).json({ erro: 'Erro interno ao gerar relatório customizado' });
  }
});

module.exports = router;
