// PainelPrevisaoVendas.jsx — Exibe previsão de vendas com dados reais e metadados do modelo

import React, { useEffect, useState } from "react";
import axios from "axios";

const PainelPrevisaoVendas = () => {
  // 🧠 Estados para armazenar dados dinâmicos
  const [vendedores, setVendedores] = useState([]); // lista de vendedores ativos
  const [mesesDisponiveis, setMesesDisponiveis] = useState([]); // lista de meses com dados
  const [vendedorSelecionado, setVendedorSelecionado] = useState(null); // vendedor escolhido
  const [mesesSelecionados, setMesesSelecionados] = useState([]); // meses escolhidos
  const [previsao, setPrevisao] = useState(null); // resultado da previsão

  // 🔄 Carrega vendedores e meses disponíveis ao iniciar o componente
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        // Requisições paralelas para obter dados do backend
        const [resVendedores, resMeses] = await Promise.all([
          axios.get("http://localhost:3001/dashboard/vendedores"),
          axios.get("http://localhost:3001/dashboard/meses-disponiveis")
        ]);
        setVendedores(resVendedores.data);       // atualiza lista de vendedores
        setMesesDisponiveis(resMeses.data);       // atualiza lista de meses
      } catch (erro) {
        console.error("Erro ao carregar dados iniciais:", erro);
      }
    }

    carregarDadosIniciais();
  }, []);

  // 🔮 Carrega previsão sempre que vendedor ou meses mudam
  useEffect(() => {
    async function carregarPrevisao() {
      if (!vendedorSelecionado || mesesSelecionados.length === 0) return;

      try {
        // Requisição à API de previsão
        const resposta = await axios.get("http://localhost:3001/dashboard/previsao-python", {
          params: {
            vendedorId: vendedorSelecionado,
            meses: mesesSelecionados.join(",")
          }
        });
        setPrevisao(resposta.data); // atualiza resultado da previsão
      } catch (erro) {
        console.error("Erro ao carregar previsão:", erro);
      }
    }

    carregarPrevisao();
  }, [vendedorSelecionado, mesesSelecionados]);

  // 🎨 Renderização do painel
  return (
    <div className="painel-previsao">
      <h2>🔮 Previsão de Vendas</h2>

      {/* 🔘 Seleção de vendedor */}
      <label>Vendedor:</label>
      <select onChange={e => setVendedorSelecionado(e.target.value)} value={vendedorSelecionado || ""}>
        <option value="">Selecione</option>
        {vendedores.map(v => (
          <option key={v.id} value={v.id}>{v.nome}</option>
        ))}
      </select>

      {/* 📅 Seleção de meses */}
      <label>Meses:</label>
      <select multiple onChange={e => {
        const selecionados = Array.from(e.target.selectedOptions, opt => opt.value);
        setMesesSelecionados(selecionados);
      }}>
        {mesesDisponiveis.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* 📊 Exibição da previsão e metadados */}
      {!previsao ? (
        <p>Selecione um vendedor e meses para visualizar a previsão.</p>
      ) : (
        <div>
          <p><strong>Vendedor:</strong> {previsao.vendedor_id}</p>
          <p><strong>Meses:</strong> {previsao.meses.join(", ")}</p>
          <p><strong>Valor Previsto:</strong> R$ {previsao.previsao.toLocaleString("pt-BR")}</p>

          <div className="modelo-info">
            <h4>🧠 Modelo Preditivo</h4>
            <p><strong>Origem dos dados:</strong> {previsao.modelo_info.origem_dados}</p>
            <p><strong>Data de treinamento:</strong> {previsao.modelo_info.data_treinamento}</p>
            <p><strong>Registros utilizados:</strong> {previsao.modelo_info.quantidade_registros}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainelPrevisaoVendas;
