// ============================
// Controller de Clientes
// ============================

const Cliente = require('../models/Cliente');

/**
 * Cria um novo cliente no banco de dados.
 * Método: POST /clientes
 * Corpo esperado: { nome, email, telefone, empresa, cargo, ativo }
 */
exports.criarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json({
      msg: '✅ Cliente criado com sucesso',
      cliente
    });
  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error.message);
    res.status(400).json({ error: 'Erro ao criar cliente', detalhe: error.message });
  }
};

/**
 * Lista todos os clientes cadastrados.
 * Método: GET /clientes
 */
exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json({ clientes });
  } catch (error) {
    console.error('❌ Erro ao listar clientes:', error.message);
    res.status(500).json({ error: 'Erro ao listar clientes', detalhe: error.message });
  }
};

/**
 * Busca um cliente pelo ID.
 * Método: GET /clientes/:id
 * Parâmetro: id (integer)
 */
exports.buscarClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ cliente });
  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error.message);
    res.status(500).json({ error: 'Erro ao buscar cliente', detalhe: error.message });
  }
};

/**
 * Atualiza os dados de um cliente.
 * Método: PUT /clientes/:id
 * Corpo esperado: campos a serem atualizados
 */
exports.atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await cliente.update(req.body);
    res.json({
      msg: '✅ Cliente atualizado com sucesso',
      cliente
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error.message);
    res.status(400).json({ error: 'Erro ao atualizar cliente', detalhe: error.message });
  }
};

/**
 * Exclui um cliente do banco de dados.
 * Método: DELETE /clientes/:id
 */
exports.excluirCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await cliente.destroy();
    res.json({ msg: '✅ Cliente excluído com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao excluir cliente:', error.message);
    res.status(500).json({ error: 'Erro ao excluir cliente', detalhe: error.message });
  }
};
