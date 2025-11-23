// ============================
// 📜 Rotas de Auditoria (Auditoria Routes)
// ============================
// Este arquivo define rotas relacionadas à auditoria do sistema.
// Objetivo: permitir que usuários autenticados e autorizados
// consultem os registros de auditoria armazenados em audit.log.
// ============================

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ============================
// 🔐 Middlewares de segurança
// ============================
// - authMiddleware: valida token JWT
// - verificarPermissao: garante que o usuário tenha permissão
//   para acessar o módulo "estatisticas"
const { authMiddleware } = require('../middlewares/authMiddleware');
const verificarPermissao = require('../middlewares/permissaoMiddleware');

// Caminho absoluto para o arquivo de log
const logPath = path.join(__dirname, '../logs/audit.log');

// ============================
// 📄 Rota: GET /api/auditoria
// ============================
// - Protegida por autenticação e permissão
// - Lê o arquivo de log audit.log
// - Retorna os registros em formato JSON
// ============================
router.get(
  '/',
  authMiddleware,
  verificarPermissao(['estatisticas']),
  (req, res) => {
    // Verifica se o arquivo existe
    if (!fs.existsSync(logPath)) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Arquivo audit.log não encontrado',
      });
    }

    // Lê o conteúdo do arquivo audit.log
    fs.readFile(logPath, 'utf8', (err, data) => {
      if (err) {
        console.error('❌ Erro ao ler audit.log:', err.message);
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro ao ler audit.log',
          detalhe: err.message,
        });
      }

      // Processa cada linha do arquivo como um objeto JSON
      const logs = data
        .split('\n') // Divide por linhas
        .filter(l => l.trim()) // Remove linhas vazias
        .map(l => {
          try {
            return JSON.parse(l); // Converte cada linha em objeto
          } catch {
            return null; // Ignora linhas inválidas
          }
        })
        .filter(Boolean); // Remove valores nulos

      // Retorna os logs como JSON
      res.json({
        sucesso: true,
        msg: '✅ Logs de auditoria carregados com sucesso',
        total: logs.length,
        logs,
      });
    });
  }
);

// ============================
// 🔎 Rota: GET /api/auditoria/usuario/:id
// ============================
// - Permite filtrar logs por usuário específico
// - Útil para investigar ações de um colaborador
// ============================
router.get(
  '/usuario/:id',
  authMiddleware,
  verificarPermissao(['estatisticas']),
  (req, res) => {
    const usuarioId = req.params.id;

    if (!fs.existsSync(logPath)) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Arquivo audit.log não encontrado',
      });
    }

    fs.readFile(logPath, 'utf8', (err, data) => {
      if (err) {
        console.error('❌ Erro ao ler audit.log:', err.message);
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
        .filter(Boolean)
        .filter(log => String(log.userId) === String(usuarioId)); // Filtra pelo usuário

      res.json({
        sucesso: true,
        msg: `✅ Logs de auditoria do usuário ${usuarioId} carregados com sucesso`,
        total: logs.length,
        logs,
      });
    });
  }
);

// ============================
// 📤 Exporta o router
// ============================
module.exports = router;
