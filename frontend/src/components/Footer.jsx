// ==========================
// 📌 Importações principais
// ==========================
import React from 'react';
import { Link } from 'react-router-dom';

// ==========================
// 🎨 Componente Footer
// ==========================
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Texto institucional com ano dinâmico */}
        <p style={styles.text}>
          &copy; {new Date().getFullYear()} William • Todos os direitos reservados
        </p>

        {/* Links rápidos de navegação */}
        <nav style={styles.nav}>
          <Link to="/home" style={styles.link}>Home</Link>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/perfil" style={styles.link}>Perfil</Link>
          <Link to="/contato" style={styles.link}>Contato</Link>
        </nav>
      </div>
    </footer>
  );
};

// ==========================
// 🎨 Estilos inline
// ==========================
const styles = {
  footer: {
    backgroundColor: '#282c34',
    color: 'white',
    padding: '15px',
    textAlign: 'center',
    marginTop: '40px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
  },
  text: {
    fontSize: '14px',
  },
  nav: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

export default Footer;
