// backend/controllers/permissoesController.js

const Usuario = require('../models/Usuario');
const Auditoria = require('../models/Auditoria');

/**
 * Atualiza permissões de múltiplos usuários e registra cada alteração no log de auditoria
 */
const atualizarPermissoes = async (req, res) => {
  const adminId = req.usuario.id; // ID do administrador que está realizando a ação
  const alteracoes = req.body;    // Lista de usuários com permissões atualizadas

  try {
    for (const user of alteracoes) {
      // Atualiza as permissões no banco de dados
      await Usuario.findByIdAndUpdate(user._id, { permissoes: user.permissoes });

      // Registra a alteração no log de auditoria
      await Auditoria.create({
        action: 'update_permissions',
        performedBy: adminId,
        userId: user._id,
        timestamp: new Date(),
        detalhes: {
          novasPermissoes: user.permissoes
        }
      });
    }

    res.status(200).json({ mensagem: 'Permissões atualizadas com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar permissões:', err);
    res.status(500).json({ erro: 'Erro ao atualizar permissões.' });
  }
};

module.exports = { atualizarPermissoes };
