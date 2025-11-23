import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente que exibe o painel de metas comerciais por cliente ou equipe
const PainelMetasComerciais = ({ filtros }) => {
  const [metas, setMetas] = useState([]); // Estado para armazenar os dados de metas

  // Requisição ao backend sempre que os filtros forem alterados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/metas-comerciais', { params: filtros })
      .then(res => setMetas(res.data)) // Atualiza o estado com os dados recebidos
      .catch(err => console.error('Erro ao carregar metas comerciais:', err)); // Log de erro
  }, [filtros]); // Dependência: atualiza quando os filtros mudam

  // Se não houver metas, não renderiza nada
  if (!metas.length) return null;

  // Renderiza os cards com metas e progresso
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">🎯 Painel de Metas Comerciais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metas.map((meta, index) => {
          // Calcula o progresso percentual da meta
          const progresso = Math.min((meta.realizado / meta.meta) * 100, 100);

          // Define o status com base no progresso
          const status = progresso >= 100
            ? 'Concluída'
            : progresso >= 75
            ? 'Em progresso'
            : 'Abaixo da meta';

          // Define a cor da barra de progresso
          const corBarra = progresso >= 100
            ? 'bg-green-500'
            : progresso >= 75
            ? 'bg-yellow-500'
            : 'bg-red-500';

          return (
            <div key={index} className="border rounded p-4 shadow bg-white">
              <h4 className="font-bold text-lg mb-2">{meta.nome}</h4> {/* Nome do cliente ou equipe */}
              <p><strong>Meta:</strong> R$ {meta.meta.toFixed(2)}</p> {/* Valor da meta */}
              <p><strong>Realizado:</strong> R$ {meta.realizado.toFixed(2)}</p> {/* Valor realizado */}
              <p><strong>Status:</strong> {status}</p> {/* Status textual da meta */}

              {/* Barra de progresso visual */}
              <div className="w-full bg-gray-200 rounded h-4 mt-2">
                <div
                  className={`h-4 rounded ${corBarra}`}
                  style={{ width: `${progresso}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PainelMetasComerciais;
