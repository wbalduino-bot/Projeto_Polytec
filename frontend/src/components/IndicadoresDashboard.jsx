import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IndicadoresDashboard = () => {
  const [totais, setTotais] = useState({});
  const [taxa, setTaxa] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/dashboard/totais')
      .then(res => setTotais(res.data))
      .catch(err => console.error('Erro ao carregar totais:', err));

    axios.get('http://localhost:3001/dashboard/taxa-conversao')
      .then(res => setTaxa(res.data))
      .catch(err => console.error('Erro ao carregar taxa de conversão:', err));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-sm text-gray-500">Clientes</h3>
        <p className="text-xl font-bold">{totais.totalClientes ?? '-'}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-sm text-gray-500">Oportunidades</h3>
        <p className="text-xl font-bold">{totais.totalOportunidades ?? '-'}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-sm text-gray-500">Interações</h3>
        <p className="text-xl font-bold">{totais.totalInteracoes ?? '-'}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-sm text-gray-500">Taxa de Conversão</h3>
        <p className="text-xl font-bold">{taxa.taxaConversao ? `${taxa.taxaConversao}%` : '-'}</p>
      </div>
    </div>
  );
};

export default IndicadoresDashboard;
