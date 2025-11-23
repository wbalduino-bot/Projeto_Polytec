const express = require('express');
const router = express.Router();
const { salvarLog } = require('../controllers/logController');

router.post('/', salvarLog);

const db = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ mensagem: 'Erro no servidor' });
    if (!row) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, row.senha);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Senha incorreta' });

    res.status(200).json({ mensagem: 'Login bem-sucedido', usuario: row });
  });
});

module.exports = router;
