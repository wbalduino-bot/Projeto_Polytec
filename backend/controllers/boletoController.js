// ============================
// 💳 Controller de Boletos
// ============================
// Responsável por operações relacionadas a boletos:
// - Geração de novo boleto fictício
// - Listagem de boletos do usuário autenticado (simulação)
// ============================

// ============================
// 💳 Gerar Boleto
// ============================
// Método: POST /api/protected/boletos
// Corpo esperado: { clienteId, valor }
// Regras:
// - Campos obrigatórios: clienteId, valor
// - Gera boleto fictício com linha digitável e vencimento em 7 dias
// ============================
const gerarBoleto = (req, res) => {
  const { clienteId, valor } = req.body;

  if (!clienteId || !valor) {
    return res.status(400).json({
      sucesso: false,
      error: 'Campos obrigatórios: clienteId, valor',
    });
  }

  // Simulação de geração de boleto
  const boleto = {
    id: Math.floor(Math.random() * 10000), // ID aleatório
    clienteId,
    valor,
    linhaDigitavel: '12345.67890 12345.678901 12345.678901 1 23450000010000',
    vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    status: 'pendente',
  };
  
  // Registra auditoria
  registrarAuditoria(clienteId, 'Gerou boleto', `Valor: ${valor}`);

  res.status(201).json({
    sucesso: true,
    msg: '✅ Boleto gerado com sucesso',
    boleto,
  });
};

// ============================
// 📄 Listar Boletos
// ============================
// Método: GET /api/protected/boletos
// Retorna lista de boletos vinculados ao usuário autenticado
// (simulação: retorna array vazio)
// ============================
const listarBoletos = (req, res) => {
  // Futuramente: integrar com banco de dados
  res.json({
    sucesso: true,
    msg: '✅ Listagem de boletos (simulação)',
    boletos: [],
  });
};

// ============================
// 📤 Exporta funções do controller
// ============================
module.exports = {
  gerarBoleto,
  listarBoletos,
};
