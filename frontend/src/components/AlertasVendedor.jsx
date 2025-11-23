// frontend/src/components/Dashboard/AlertasVendedor.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Componente que exibe alertas automáticos para vendedores logados.
 * Os alertas incluem metas não atingidas, oportunidades sem retorno e clientes inativos.
 */
const AlertasVendedor = ({ perfil }) => {
  const [alertas, setAlertas] = useState([]);

  // Requisição ao backend quando o perfil do vendedor estiver disponível
  useEffect(() => {
    if (!perfil || perfil.tipo !== 'vendedor') return;

    axios.get('http://localhost:3001/dashboard/alertas', {
      params: {
        vendedorId: perfil.id,
        periodoInicio: '2025-09',
        periodoFim: '2025-11'
      }
    })
      .then(res => setAlertas(res.data))
      .catch(err => {
        console.error('Erro ao carregar alertas do vendedor:', err);
        setAlertas([]);
      });
  }, [perfil]);

  // Se não houver alertas, não renderiza nada
  if (!alertas.length) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
      <h3 className="font-semibold text-red-800 mb-2">🚨 Alertas Comerciais</h3>
      <ul className="list-disc pl-5 text-red-700">
        {alertas.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default AlertasVendedor;
