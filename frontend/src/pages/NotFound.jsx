import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>404 - Página não encontrada</h1>
      <p>Desculpe, a página que você está tentando acessar não existe.</p>
      <Link to="/home">
        <button style={{ marginTop: '20px', padding: '10px 20px' }}>
          Voltar para a Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
