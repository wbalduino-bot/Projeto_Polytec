// ============================
// 📌 Importações principais
// ============================
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // contexto para saber perfil do usuário

// ============================
// 🌐 Componente MenuPrincipal
// ============================
// Este componente funciona como o "portal inicial" após o login.
// Ele apresenta um menu em formato de grid com cards estilizados.
// Cada card leva para uma funcionalidade já criada na aplicação.
// ============================
const MenuPrincipal = () => {
  const { usuario } = useContext(AuthContext);

  // Lista de opções do menu (cada item contém rota, título e descrição)
  // 🔎 Fácil de manter: basta adicionar/remover itens aqui
  const opcoes = [
    { rota: "/dashboard", titulo: "📊 Dashboard", descricao: "Visão geral dos dados" },
    { rota: "/estatisticas", titulo: "📈 Relatório Mensal", descricao: "Acompanhe estatísticas detalhadas" },
    { rota: "/gerar-boleto", titulo: "💳 Gerar Boleto", descricao: "Crie boletos rapidamente" },
    { rota: "/historico", titulo: "📜 Histórico de Boletos", descricao: "Consulte boletos emitidos" },
    { rota: "/usuarios", titulo: "👥 Gestão de Usuários", descricao: "Administre contas e perfis (restrito)" },
    { rota: "/auditoria", titulo: "📝 Auditoria", descricao: "Verifique logs e ações do sistema (restrito)" },
    { rota: "/contato", titulo: "📞 Contato", descricao: "Fale com nossa equipe" },
  ];

  // Estilos centralizados para reutilização
  const cardStyle = {
    display: "block",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    textDecoration: "none",
    color: "#333",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: "30px" }}>
      {/* Cabeçalho do portal */}
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>📊 Portal Principal</h2>
      <p style={{ textAlign: "center", marginBottom: "30px", color: "#555" }}>
        Escolha uma das opções abaixo para navegar:
      </p>

      {/* Grid de cards responsivos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {opcoes.map((opcao, index) => (
          <Link
            key={index}
            to={opcao.rota}
            style={cardStyle}
            aria-label={`Ir para ${opcao.titulo}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
            }}
          >
            {/* Título do card */}
            <h3 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
              {opcao.titulo}
            </h3>

            {/* Descrição curta */}
            <p style={{ fontSize: "14px", color: "#666" }}>
              {opcao.descricao}
            </p>

            {/* Badge de restrição para funcionalidades sensíveis */}
            {(opcao.rota === "/usuarios" || opcao.rota === "/auditoria") && (
              <p style={{ fontSize: "12px", color: "#d32f2f", marginTop: "8px" }}>
                {usuario?.perfil === "admin" || usuario?.perfil === "gerente"
                  ? "✔ Acesso permitido"
                  : "⚠ Acesso restrito"}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

// ============================
// 📤 Exporta o componente
// ============================
export default MenuPrincipal;
