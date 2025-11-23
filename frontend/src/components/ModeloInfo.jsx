// ModeloInfo.jsx — Componente React para exibir informações do modelo Oráculo
// Este componente consome o endpoint FastAPI (/modelo-info) e mostra os metadados
// do modelo treinado diretamente no dashboard.

import React, { useEffect, useState } from "react";

function ModeloInfo() {
  // Estado para armazenar as informações do modelo
  const [info, setInfo] = useState(null);

  // Estado para armazenar mensagens de erro (caso a API falhe)
  const [erro, setErro] = useState(null);

  // useEffect roda uma vez ao montar o componente
  // Faz a requisição ao backend FastAPI para buscar os metadados do modelo
  useEffect(() => {
    fetch("http://localhost:8000/modelo-info") // ajuste a porta conforme seu servidor FastAPI
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar informações do modelo");
        return res.json();
      })
      .then(setInfo) // salva os dados no estado "info"
      .catch((err) => setErro(err.message)); // captura erros e salva no estado "erro"
  }, []);

  // Caso ocorra erro na requisição, exibe mensagem em vermelho
  if (erro) return <p className="text-red-500">{erro}</p>;

  // Enquanto os dados não chegam, mostra mensagem de carregamento
  if (!info) return <p>Carregando informações do modelo...</p>;

  // Renderiza as informações do modelo em um bloco estilizado
  return (
    <div className="bg-gray-100 p-4 rounded shadow mt-6">
      <h3 className="text-xl font-bold mb-2">📊 Informações do Modelo</h3>
      <ul className="text-gray-700">
        <li><strong>Nome:</strong> {info.nome_modelo}</li>
        <li><strong>Algoritmo:</strong> {info.algoritmo}</li>
        <li><strong>Data de Treinamento:</strong> {info.data_treinamento}</li>
        <li><strong>Origem dos Dados:</strong> {info.origem_dados}</li>
        <li><strong>Registros usados:</strong> {info.quantidade_registros}</li>
        <li><strong>Versão:</strong> {info.versao}</li>
      </ul>
    </div>
  );
}

export default ModeloInfo;
