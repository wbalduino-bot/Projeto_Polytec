const { spawn } = require('child_process');

exports.previsaoVendas = (req, res) => {
  const clienteId = req.params.id;

  const python = spawn('python3', ['ml/predict.py', '--cliente', clienteId]);

  python.stdout.on('data', (data) => {
    res.json({ previsao: data.toString() });
  });

  python.stderr.on('data', (data) => {
    console.error(`Erro: ${data}`);
    res.status(500).json({ erro: 'Falha ao gerar previsão' });
  });
};