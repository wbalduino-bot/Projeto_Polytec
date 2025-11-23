// ============================
// 📜 Controller de Auditoria
// ============================
// Responsável por:
// - Registrar ações realizadas por usuários (ex.: login, atualização de dados, exclusão)
// - Listar registros de auditoria
// ============================

const fs = require('fs');
const path = require('path');

// Caminho absoluto para o arquivo de log
const logPath = path.join(__dirname, '../logs/audit.log');

// ============================
// 📝 Registrar Auditoria
// ============================
// - Recebe: { usuarioId, acao, detalhe }
// - Adiciona um registro com timestamp no arquivo audit.log
// ============================
const registrarAuditoria = (usuarioId, acao, detalhe = '') => {
  const log = {
    id: Date.now(), // ID único baseado em timestamp
    usuarioId,
    acao,
    detalhe,
    timestamp: new Date().toISOString(),
  };

  // Adiciona linha JSON ao arquivo de log
  fs.appendFile(logPath, JSON.stringify(log) + '\n', err => {
    if (err) {
      console.error('❌ Erro ao registrar auditoria:', err.message);
    } else {
      console.log('📜 Log de auditoria registrado:', log);
    }
  });
};

// ============================
// 📄 Listar Auditoria
// ============================
// Método: GET /api/auditoria
// Retorna todos os registros de auditoria
// ============================
const listarAuditoria = (req, res) => {
  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao ler audit.log',
        detalhe: err.message,
      });
    }

    const logs = data
      .split('\n')
      .filter(l => l.trim())
      .map(l => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    res.json({
      sucesso: true,
      msg: '✅ Logs de auditoria carregados com sucesso',
      total: logs.length,
      logs,
    });
  });
};

// ============================
// 📤 Exporta funções do controller
// ============================
module.exports = {
  registrarAuditoria,
  listarAuditoria,
};
