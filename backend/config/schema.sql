-- ==========================
-- 📌 Tabela de Usuários
-- ==========================
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) CHECK (perfil IN ('admin', 'gerente', 'vendedor')),
  status VARCHAR(20) CHECK (status IN ('ativo', 'inativo')),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 📌 Tabela de Permissões
-- ==========================
CREATE TABLE IF NOT EXISTS permissoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  perfil VARCHAR(20) NOT NULL,
  pode_aplicar_desconto BOOLEAN DEFAULT FALSE,
  pode_excluir_pedido BOOLEAN DEFAULT FALSE
);

-- Inserindo regras padrão
INSERT INTO permissoes (perfil, pode_aplicar_desconto, pode_excluir_pedido)
VALUES 
  ('admin', TRUE, TRUE),
  ('gerente', TRUE, TRUE),
  ('vendedor', FALSE, FALSE);

-- ==========================
-- 📌 Tabela de Clientes
-- ==========================
CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(100) NOT NULL,
  segmento VARCHAR(50),
  status VARCHAR(20) CHECK (status IN ('ativo', 'inativo')),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 📌 Tabela de Produtos
-- ==========================
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  preco DECIMAL(10,2) NOT NULL,
  estoque_atual INT DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 📌 Tabela de Pedidos
-- ==========================
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INT REFERENCES clientes(id),
  vendedor_id INT REFERENCES usuarios(id),
  status VARCHAR(20) CHECK (status IN ('aberto', 'faturado', 'entregue')),
  valor_total DECIMAL(12,2),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP
);

-- ==========================
-- 📌 Tabela de Pagamentos
-- ==========================
CREATE TABLE IF NOT EXISTS pagamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INT REFERENCES pedidos(id),
  status VARCHAR(20) CHECK (status IN ('pendente', 'compensado')),
  valor DECIMAL(12,2),
  metodo VARCHAR(20) CHECK (metodo IN ('boleto', 'cartao', 'pix')),
  data_pagamento DATE
);

-- ==========================
-- 📌 Tabela de Treinamentos do Modelo Oráculo
-- ==========================
CREATE TABLE IF NOT EXISTS treinamentos_modelo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  algoritmo VARCHAR(100),
  data_treinamento DATE NOT NULL,
  origem_dados VARCHAR(100),
  quantidade_registros INT,
  versao VARCHAR(20) UNIQUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 📌 Tabela de Previsões
-- ==========================
CREATE TABLE IF NOT EXISTS previsoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendedor_id INT REFERENCES usuarios(id),
  mes VARCHAR(7), -- formato 'YYYY-MM'
  previsao_valor DECIMAL(12,2),
  modelo_versao VARCHAR(20) REFERENCES treinamentos_modelo(versao),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 📌 Tabela Pedido_Produto (N:N entre pedidos e produtos)
-- ==========================
CREATE TABLE IF NOT EXISTS pedido_produto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INT REFERENCES pedidos(id),
  produto_id INT REFERENCES produtos(id),
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL
);

-- ==========================
-- 📌 Tabela de Movimentação de Estoque
-- ==========================
CREATE TABLE IF NOT EXISTS estoque_movimentacao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INT REFERENCES produtos(id),
  tipo VARCHAR(20) CHECK (tipo IN ('entrada', 'saida')),
  quantidade INT NOT NULL,
  origem VARCHAR(100),
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 📌 Tabela de Boletos
-- ==========================
CREATE TABLE IF NOT EXISTS boletos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INT REFERENCES usuarios(id),
  valor REAL NOT NULL,
  vencimento TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 📌 Tabela de Auditoria
-- ==========================
CREATE TABLE IF NOT EXISTS auditoria_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INT REFERENCES usuarios(id),
  acao TEXT NOT NULL,
  detalhes TEXT,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 📌 Tabela de Contatos
-- ==========================
CREATE TABLE IF NOT EXISTS contatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
