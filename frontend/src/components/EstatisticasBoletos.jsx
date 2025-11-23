import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const EstatisticasBoletos = () => {
  const [boletos, setBoletos] = useState([]);

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        const response = await axios.get('/api/boletos');
        setBoletos(response.data);
      } catch (error) {
        console.error('Erro ao buscar boletos:', error);
      }
    };

    fetchBoletos();
  }, []);

  // Agrupar por mês
  const boletosPorMes = boletos.reduce((acc, boleto) => {
    const mes = new Date(boleto.geradoEm).toLocaleString('pt-BR', { month: 'long' });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});

  const dadosMes = Object.entries(boletosPorMes).map(([mes, qtd]) => ({
    mes,
    quantidade: qtd,
  }));

  // Agrupar por status
  const statusContagem = boletos.reduce((acc, boleto) => {
    const status = boleto.status || 'Desconhecido';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const dadosStatus = Object.entries(statusContagem).map(([status, qtd]) => ({
    name: status,
    value: qtd,
  }));

  const cores = ['#4CAF50', '#F44336', '#FFC107', '#2196F3'];

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-4xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-6">Estatísticas de Boletos</h2>

      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Boletos Gerados por Mês</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosMes}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Status dos Boletos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dadosStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {dadosStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EstatisticasBoletos;
