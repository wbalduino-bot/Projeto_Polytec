import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente que exibe metas comerciais por período e canal de venda
const PainelMetasPorCanal = ({ filtros }) => {
  const [metas, setMetas] = useState([]);

  // Requisição ao backend com filtros aplicados
  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/metas-por-canal', { params: filtros })
      .then(res => setMetas(res.data))
      .catch(err => console.error('Erro ao carregar metas por canal:', err));
  }, [filtros]);

  // Se não houver metas, não renderiza nada
  if (!metas.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">📊 Metas por Período e Canal de Venda</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metas.map((meta, index) => {
          const progresso = Math.min((meta.realizado / meta.meta) * 100, 100);
          const status = progresso >= 100 ? 'Meta atingida' : progresso >= 75 ? 'Em andamento' : 'Abaixo da meta';
          const corBarra = progresso >= 100 ? 'bg-green-600' : progresso >= 75 ? 'bg-yellow-500' : 'bg-red-500';

          return (
            <div key={index} className="border rounded p-4 shadow bg-white">
              <h4 className="font-bold text-lg mb-1">{meta.canal}</h4> {/* Canal de venda */}
              <p className="text-sm text-gray-600 mb-2">{meta.periodo}</p> {/* Período (ex: Outubro 2025) */}
              <p><strong>Meta:</strong> R$ {meta.meta.toFixed(2)}</p>
              <p><strong>Realizado:</strong> R$ {meta.realizado.toFixed(2)}</p>
              <p><strong>Status:</strong> {status}</p>

              {/* Barra de progresso */}
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

export default PainelMetasPorCanal;
