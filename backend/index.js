// 📦 Importa os módulos necessários
const express = require('express');        // Framework para criar servidor e rotas HTTP
const cors = require('cors');              // Middleware para permitir requisições de outros domínios (ex.: frontend React)
const bodyParser = require('body-parser'); // Middleware para interpretar JSON no corpo das requisições

// 🔗 Importa a conexão com o banco SQLite
const db = require('./config/db');         // Conexão centralizada com o banco de dados

// 🧩 Importa rotas organizadas
const authRoutes = require('./routes/authRoutes');                   // Rotas de autenticação (login, registro)
const protectedRoutes = require('./routes/protectedRoutes');         // Rotas protegidas (boletos, usuários)
const reembolsoRoutes = require('./routes/reembolsoRoutes');         // Rotas do módulo de reembolso
const leadRoutes = require('./routes/leadRoutes');                   // Rotas do módulo de leads (prospecção de clientes)
const interacaoLeadRoutes = require('./routes/interacaoLeadRoutes'); // Rotas do módulo de interações com leads
const distribuicaoLeadRoutes = require('./routes/distribuicaoLeadRoutes'); // Rotas do módulo de distribuição de leads
const leadsRoutes = require('./routes/leadsRoutes');


// Importa migrations para garantir tabelas
require('./config/migrations');

// 🚀 Cria a aplicação Express
const app = express();

// 🔓 Permite que o frontend (React) acesse a API
app.use(cors());

// 📨 Permite que a API receba dados em JSON
app.use(bodyParser.json());

// 🔗 Usa rotas públicas e protegidas
app.use(authRoutes);                        // Rotas de autenticação: /auth/login, /auth/register
app.use(protectedRoutes);                   // Rotas protegidas: /boletos, /usuarios/:id
app.use('/reembolsos', reembolsoRoutes);    // Rotas do módulo de reembolso: CRUD de pedidos
app.use('/leads', leadRoutes);              // Rotas do módulo de leads: CRUD de possíveis compradores
app.use('/interacoes-leads', interacaoLeadRoutes); // Rotas de interações: registrar contatos com leads
app.use('/distribuicao-leads', distribuicaoLeadRoutes); // Rotas de distribuição: atribuir leads a vendedores

app.use('/api/leads', leadsRoutes);

// Rota para previsão de vendas
router.get('/previsao/:id', oraculoController.previsaoVendas);




// 👀 Rota auxiliar para listar todos os usuários (sem senha)
// - Retorna apenas id, nome e email
// - Útil para consultas administrativas
app.get('/usuarios', (req, res) => {
  db.all('SELECT id, nome, email FROM usuarios', [], (err, rows) => {
    if (err) {
      console.error('❌ Erro ao listar usuários:', err.message);
      return res.status(500).json({ sucesso: false }); // Retorna erro interno
    }

    // Retorna lista de usuários em formato JSON
    res.json({ sucesso: true, usuarios: rows });
  });
});

// 🟢 Inicia o servidor na porta 3001
// - Exibe mensagem no console confirmando inicialização
app.listen(3001, () => console.log('✅ Backend rodando na porta 3001'));
