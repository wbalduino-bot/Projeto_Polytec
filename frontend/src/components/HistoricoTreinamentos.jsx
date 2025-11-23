// HistoricoTreinamentos.jsx — Componente React para exibir o histórico de treinamentos do modelo Oráculo
// Este componente consome o endpoint FastAPI (/historico-treinamentos) e mostra uma lista cronológica
// de todas as vezes que o modelo foi reentreinado, incluindo data, registros e versão.

import React, { useEffect, useState } from "react";

function HistoricoTreinamentos() {
  // Estado para armazenar a lista de treinamentos
  const [historico, setHistorico] = useState([]);

  // Estado para mensagens de erro (caso a API falhe)
  const [erro, setErro] = useState(null);

  // useEffect roda uma vez ao montar o componente
  // Faz a requisição ao backend FastAPI para buscar o histórico de treinamentos
  useEffect(() => {
    fetch("http://localhost:8000/historico-treinamentos") // ajuste a porta conforme seu servidor FastAPI
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar histórico de treinamentos");
        return res.json();
      })
      .then(setHistorico) // salva os dados no estado "historico"
      .catch((err) => setErro(err.message)); // captura erros e salva no estado "erro"
  }, []);

  // Caso ocorra erro na requisição, exibe mensagem em vermelho
  if (erro) return <p className="text-red-500">{erro}</p>;

  // Enquanto os dados não chegam, mostra mensagem de carregamento
  if (!historico || historico.length === 0) return <p>Carregando histórico...</p>;

  // Renderiza a lista de treinamentos em ordem cronológica
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-xl font-bold mb-4">📜 Histórico de Treinamentos</h3>
      <ul className="space-y-3">
        {historico.map((item, index) => (
          <li key={index} className="border-b pb-2">
            <p><strong>Data:</strong> {item.data_treinamento}</p>
            <p><strong>Versão:</strong> {item.versao}</p>
            <p><strong>Registros usados:</strong> {item.quantidade_registros}</p>
            <p><strong>Algoritmo:</strong> {item.algoritmo}</p>
            <p><strong>Origem dos dados:</strong> {item.origem_dados}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoricoTreinamentos;
