import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente responsável por exibir alertas automáticos no dashboard
const AlertasDashboard = ({ filtros }) => {
  const [alertas, setAlertas] = useState([]); // Estado para armazenar os alertas recebidos do backend

  // Requisição ao backend sempre que os filtros forem alterados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/alertas', { params: filtros })
      .then(res => setAlertas(res.data)) // Atualiza o estado com os alertas recebidos
      .catch(err => {
        console.error('Erro ao carregar alertas:', err); // Log de erro no console
        setAlertas([]); // Garante que o estado seja limpo em caso de falha
      });
  }, [filtros]); // Dependência: atualiza quando os filtros mudam

  // Se não houver alertas, não renderiza nada
  if (!alertas.length) return null;

  // Renderiza a lista de alertas em destaque
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
      {/* Título do bloco de alertas */}
      <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Alertas do Sistema</h3>

      {/* Lista de mensagens de alerta */}
      <ul className="list-disc pl-5 text-yellow-700">
        {alertas.map((msg, index) => (
          <li key={index}>{msg}</li> // Exibe cada alerta como item de lista
        ))}
      </ul>
    </div>
  );
};

export default AlertasDashboard;
