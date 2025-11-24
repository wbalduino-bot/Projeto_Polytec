// ============================
// 🚀 Server.js - Inicialização do Backend Oráculo
// ============================
// Responsável por:
// - Configurar o Express
// - Conectar ao banco via Sequelize
// - Sincronizar modelos
// - Carregar middlewares e rotas
// - Servir frontend React
// - Iniciar o servidor
// ============================

require('dotenv').config(); // Carrega variáveis de ambiente (.env)
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan'); // Logger de requisições HTTP

// ============================
// 📌 Inicialização do Express
// ============================
const app = express();

// ============================
// 🔧 Middlewares globais
// ============================
// Configuração de CORS para permitir acesso do frontend publicado
// ⚠️ Boa prática: usar variável de ambiente FRONTEND_URL para flexibilidade
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://projeto-polytec-3.onrender.com/api", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Permite trabalhar com JSON no corpo das requisições
app.use(express.json());

// Logger de requisições HTTP (útil para debug em desenvolvimento e produção)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ============================
// 🎨 Servir frontend React
// ============================
// Serve os arquivos estáticos gerados pelo build do React
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ============================
// 📦 Banco de Dados (Sequelize)
// ============================
// Importa index.js que centraliza sequelize + modelos
const db = require('./models');

// Testa conexão e sincroniza modelos
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco estabelecida com sucesso.');
    return db.sequelize.sync({ alter: true }); 
    // ⚠️ alter:true ajusta tabelas conforme modelos (bom para dev, cuidado em produção)
    // Em produção, prefira migrations para evitar alterações inesperadas
  })
  .then(() => {
    console.log('✅ Modelos sincronizados com o banco.');
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ou sincronizar banco:', err);
  });

// ============================
// 📂 Importação de rotas
// ============================
// Cada grupo de rotas é modularizado para manter organização
const produtoRoutes = require('./routes/produtoRoutes');        
const pedidoRoutes = require('./routes/pedidoRoutes');          
const pagamentoRoutes = require('./routes/pagamentoRoutes'); 
const boletosRoutes = require('./routes/boletosRoutes');        
const logRoutes = require('./routes/logRoutes');                
const authRoutes = require('./routes/authRoutes');              // 🔑 Autenticação (login, registro, token)
const usuariosRoutes = require('./routes/usuariosRoutes');      // 👥 CRUD de usuários e perfis
const publicRoutes = require('./routes/publicRoutes');          
const protectedRoutes = require('./routes/protectedRoutes');    // 🔐 Rotas protegidas (JWT)
const auditoriaRoutes = require('./routes/auditoriaRoutes');    
const permissoesRoutes = require('./routes/permissoesRoutes');  
const interacaoRoutes = require('./routes/interacaoRoutes');    
const oportunidadeRoutes = require('./routes/oportunidadeRoutes'); 
const dashboardRoutes = require('./routes/dashboardRoutes');    
const reembolsoRoutes = require('./routes/reembolsoRoutes');    
const relatoriosRoutes = require('./routes/relatoriosRoutes');  // 📊 Novo: relatórios mensais/anuais

// ============================
// 🚏 Registro das rotas
// ============================
// Prefixos organizados por contexto
app.use('/api/produtos', produtoRoutes);       
app.use('/api/pedidos', pedidoRoutes);         
app.use('/api/boletos', boletosRoutes);        
app.use('/api/logs', logRoutes);               
app.use('/api/auth', authRoutes);              // 🔑 Login e cadastro
app.use('/api/usuarios', usuariosRoutes);      // 👥 Gerenciamento de usuários
app.use('/api/auditoria', auditoriaRoutes);    
app.use('/api/permissoes', permissoesRoutes);  
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/public', publicRoutes);          
app.use('/api/protected', protectedRoutes);    // 🔐 Rotas protegidas
app.use('/api/interacoes', interacaoRoutes);   
app.use('/api/oportunidades', oportunidadeRoutes); 
app.use('/api/dashboard', dashboardRoutes);    
app.use('/api/reembolsos', reembolsoRoutes);   
app.use('/api/relatorios', relatoriosRoutes);  // 📊 Relatórios

// ============================
// 🌐 Rota raiz de teste
// ============================
// Útil para verificar se o backend está rodando
app.get('/', (req, res) => {
  res.json({ msg: 'API Oráculo rodando com sucesso 🚀' });
});

// ============================
// 🛠️ Rota de debug (opcional)
// ============================
// ⚠️ Não usar em produção (risco de expor dados sensíveis)
const Usuario = require('./models/Usuario');
app.get('/debug/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar usuários', detalhe: err.message });
  }
});

// ============================
// 🩹 Middleware de erro global
// ============================
// Captura erros não tratados e retorna resposta JSON padronizado
app.use((err, req, res, next) => {
  console.error("❌ Erro inesperado:", err);
  res.status(500).json({ error: "Erro interno no servidor" });
});

// ============================
// 🎯 Fallback para SPA React
// ============================
// Qualquer rota não reconhecida cai no index.html do React
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// ============================
// 🚀 Inicialização do servidor
// ============================
// Porta configurável via variável de ambiente
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
});
