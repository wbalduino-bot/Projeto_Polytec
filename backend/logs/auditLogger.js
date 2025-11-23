// ============================
// 📌 Configuração de Logger com Winston
// ============================
const winston = require('winston');


const path = require('path');

// Cria logger de auditoria usando Winston
const auditLogger = winston.createLogger({
  level: 'info', // níveis: error, warn, info, http, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    // Mostra logs no console (útil no Render e desenvolvimento)
    new winston.transports.Console(),

    // Salva logs em arquivo audit.log dentro da pasta /logs
    new winston.transports.File({
      filename: path.join(__dirname, 'audit.log'),
      maxsize: 5 * 1024 * 1024, // Limite de 5MB por arquivo
      maxFiles: 3               // Mantém até 3 arquivos rotacionados
    })
  ]
});



module.exports = auditLogger;
