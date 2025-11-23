// ==========================
// 📌 Importações principais
// ==========================
import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// ==========================
// 🎨 Componente Header
// ==========================
function Header() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Função de logout com redirecionamento
  const handleLogout = () => {
    logout(); // limpa token e usuário do contexto/localStorage
    navigate('/login'); // redireciona para tela de login
  };

  return (
    <header style={styles.header}>
      <h1>Oráculo Dashboard</h1>

      {/* Navegação condicional */}
      <nav style={styles.nav}>
        {usuario ? (
          <>
            {/* Mensagem de boas-vindas */}
            <span style={styles.user}>Bem-vindo, {usuario.email}</span>

            {/* Links comuns para usuários logados */}
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/perfil" style={styles.link}>Meu Perfil</Link>
            <Link to="/usuarios" style={styles.link}>Usuários</Link>

            {/* Links exclusivos para administradores */}
            {usuario.perfil === 'admin' && (
              <>
                <Link to="/admin" style={styles.link}>Admin</Link>
                <Link to="/auditoria" style={styles.link}>Auditoria</Link>
              </>
            )}

            {/* Botão de logout */}
            <button onClick={handleLogout} style={styles.button}>Sair</button>
          </>
        ) : (
          <>
            {/* Links para visitantes (não logados) */}
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/cadastro" style={styles.link}>Cadastro</Link>
          </>
        )}
      </nav>
    </header>
  );
}

// ==========================
// 🎨 Estilos inline
// ==========================
const styles = {
  header: {
    backgroundColor: '#282c34',
    padding: '20px',
    color: 'white',
    textAlign: 'center',
  },
  nav: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    alignItems: 'center',
  },
  user: {
    fontWeight: 'bold',
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
  },
  button: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Header;
