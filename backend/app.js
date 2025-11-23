const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());
app.use(authRoutes);

const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/movimentacoes', movimentacaoRoutes);
app.use('/api/webhook', webhookRoutes);

sequelize.sync().then(() => console.log('Modelos sincronizados com o banco'));
app.get('/', (req, res) => res.send('API funcionando!'));

module.exports = app;
