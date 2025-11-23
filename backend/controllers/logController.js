const fs = require('fs');
const path = require('path');

const salvarLog = (req, res) => {
  const { mensagem } = req.body;
  const timestamp = new Date().toISOString();
  const entrada = `${timestamp} - ${mensagem}\n`;

  const caminho = path.join(__dirname, '../logs/logs.txt');

  fs.appendFile(caminho, entrada, (err) => {
    if (err) {
      console.error('Erro ao salvar log:', err);
      return res.status(500).send('Erro ao salvar log');
    }
    console.log('Log salvo:', entrada.trim());
    res.status(200).send('Log salvo com sucesso');
  });
};

module.exports = { salvarLog };
