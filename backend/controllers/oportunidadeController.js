// backend/controllers/oportunidadeController.js

const Oportunidade = require('../models/Oportunidade');
const Cliente = require('../models/Cliente');

/**
 * Cria uma nova oportunidade vinculada a um cliente.
 * Método: POST /oportunidades
 */
exports.criarOportunidade = async (req, res) => {
  try {
    const { clienteId } = req.body;
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });

    const oportunidade = await Oportunidade.create(req.body);
    res.status(201).json(oportunidade);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

/**
 * Lista todas as oportunidades com dados do cliente.
 * Método: GET /oportunidades
 */
exports.listarOportunidades = async (req, res) => {
  try {
    const oportunidades = await Oportunidade.findAll({ include: Cliente });
    res.json(oportunidades);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

/**
 * Atualiza uma oportunidade existente.
 * Método: PUT /oportunidades/:id
 */
exports.atualizarOportunidade = async (req, res) => {
  try {
    const { id } = req.params;
    const oportunidade = await Oportunidade.findByPk(id);
    if (!oportunidade) return res.status(404).json({ erro: 'Oportunidade não encontrada' });

    await oportunidade.update(req.body);
    res.json({ mensagem: 'Oportunidade atualizada com sucesso', oportunidade });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

/**
 * Exclui uma oportunidade.
 * Método: DELETE /oportunidades/:id
 */
exports.excluirOportunidade = async (req, res) => {
  try {
    const { id } = req.params;
    const oportunidade = await Oportunidade.findByPk(id);
    if (!oportunidade) return res.status(404).json({ erro: 'Oportunidade não encontrada' });

    await oportunidade.destroy();
    res.json({ mensagem: 'Oportunidade excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
