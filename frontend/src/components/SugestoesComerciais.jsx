import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente que exibe sugestões de ações comerciais com base nos alertas e filtros aplicados
const SugestoesComerciais = ({ filtros }) => {
  const [sugestoes, setSugestoes] = useState([]);

  // Requisição ao backend para obter sugestões com base nos filtros
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/sugestoes-comerciais', { params: filtros })
      .then(res => setSugestoes(res.data))
      .catch(err => console.error('Erro ao carregar sugestões comerciais:', err));
  }, [filtros]);

  // Se não houver sugestões, não renderiza nada
  if (!sugestoes.length) return null;

  // Renderiza a lista de sugestões
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
      <h3 className="font-semibold text-blue-800 mb-2">💡 Sugestões Comerciais</h3>
      <ul className="list-disc pl-5 text-blue-700">
        {sugestoes.map((msg, index) => (
          <li key={index}>{msg}</li> // Exibe cada sugestão como item de lista
        ))}
      </ul>
    </div>
  );
};

export default SugestoesComerciais;
