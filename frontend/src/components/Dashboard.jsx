// ==========================
// 📊 Dashboard.jsx — Painel principal do sistema Oráculo
// Objetivo: organizar funcionalidades em abas e integrar inteligência analítica/comercial com o modelo Oráculo.
// Este arquivo está COMPLETO e COMENTADO para facilitar manutenção e evolução.
// ==========================

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import Sidebar from './Layout/Sidebar'; // 🔹 Menu lateral


// 🔹 Funcionalidades de produto, pedido e pagamento
import ProdutoForm from './ProdutoForm';
import EstoqueForm from './EstoqueForm';
import PedidoForm from './PedidoForm';
import AtualizarStatusPedido from './AtualizarStatusPedido';
import PedidoLista from './PedidoLista';
import PagamentoForm from './PagamentoForm';
import AtualizarStatusPagamento from './AtualizarStatusPagamento';
import GerarBoletoForm from './GerarBoletoForm';
import PagamentoLista from './PagamentoLista';

// 🔹 Visualização analítica (gráficos e indicadores)
import IndicadoresDashboard from './IndicadoresDashboard';
import GraficoPorCliente from './GraficoPorCliente';
import GraficoPorProduto from './GraficoPorProduto';
import GraficoMovimentacao from './GraficoMovimentacao';
import GraficoFunil from './GraficoFunil';
import GraficoClientesAtivos from './GraficoClientesAtivos';
import GraficoInteracoesMensais from './GraficoInteracoesMensais';
import GraficoMensalTransacoes from './GraficoMensalTransacoes';
import RankingClientesValor from './RankingClientesValor';

// 🔹 Relatórios e filtros
import FiltroDashboard from './FiltroDashboard';
import TabelaRelatorio from './TabelaRelatorio';
import BotaoExportarCSV from './BotaoExportarCSV';
import BotaoExportarPDF from './BotaoExportarPDF';
import ResumoPorCliente from './ResumoPorCliente';

// 🔹 Inteligência comercial
import AlertasDashboard from './AlertasDashboard';
import SugestoesComerciais from './SugestoesComerciais';
import PainelMetasComerciais from './PainelMetasComerciais';
import PainelMetasPorCanal from './PainelMetasPorCanal';
import PainelComissoesVendedor from './PainelComissoesVendedor';
import PainelDoVendedor from './PainelDoVendedor';
import GraficoPrevisaoVendas from './GraficoPrevisaoVendas';
import PainelPrevisaoVendas from './PainelPrevisaoVendas';

// 🔹 Componentes do modelo Oráculo (ML)
import ModeloInfo from './ModeloInfo';
import HistoricoTreinamentosGrafico from './HistoricoTreinamentosGrafico';
import HistoricoTreinamentosCompletoExportFiltro from './HistoricoTreinamentosCompletoExportFiltro';
import HistoricoTreinamentosCompletoExport from './HistoricoTreinamentosCompletoExport';

// ⚠️ Se você tiver AlertasVendedor ou GraficoConversaoPorVendedor, mantenha os imports abaixo.
// Caso não existam ainda, comente os imports e o uso desses componentes.
// import AlertasVendedor from './AlertasVendedor';
// import GraficoConversaoPorVendedor from './GraficoConversaoPorVendedor';

const Dashboard = () => {
  // 🔧 Estado da aba ativa (controla navegação entre módulos)
  const [abaAtiva, setAbaAtiva] = useState('produtos');

  // 🔐 Contexto de autenticação: token, usuário e logout
  const { token, usuario, logout } = useContext(AuthContext);

  // 👤 Perfil do usuário carregado da API (nome, tipo: ex. 'vendedor' ou 'admin')
  const [perfil, setPerfil] = useState(null);

  // 🎚️ Filtros compartilhados por gráficos e relatórios
  const [filtros, setFiltros] = useState({});

  // 📦 Dados filtrados para exportação (preenchidos pela TabelaRelatorio)
  const [dadosFiltrados, setDadosFiltrados] = useState([]);

  // ==========================
  // 🔄 Carregar perfil do usuário autenticado
  // ==========================
  useEffect(() => {
    if (!token) return;
      fetch(`${process.env.REACT_APP_API_URL}/api/auth/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })

      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar perfil');
        return res.json();
      })
      .then(setPerfil)
      .catch((err) => {
        console.error('Erro ao carregar perfil:', err);
        logout(); // Encerra sessão se token estiver inválido ou houver erro crítico
      });
  }, [token, logout]);

  // ⏳ Enquanto o perfil é carregado, mostrar mensagem
  if (!perfil) return <p className="text-center mt-10">Carregando dados do usuário...</p>;

  // ==========================
  // 🎨 Renderização principal
  // ==========================
  return (
    <div className="flex">
    {/* Sidebar fixa com base no perfil */}
    <Sidebar tipoUsuario={perfil.tipo} onChangeAba={setAbaAtiva} />
    <div className="max-w-7xl mx-auto mt-10 px-4">
      {/* Cabeçalho com saudação e botão de saída */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Oráculo - Sistema de Previsão e Gestão Comercial</h2>
          <p className="text-gray-600">Bem-vindo, {perfil.nome}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>

      {/* Navegação entre abas principais */}
      <div className="flex justify-center gap-2 md:gap-4 mb-6 flex-wrap">
        <button onClick={() => setAbaAtiva('produtos')} className={`px-4 py-2 rounded ${abaAtiva === 'produtos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Produtos</button>
        <button onClick={() => setAbaAtiva('pedidos')} className={`px-4 py-2 rounded ${abaAtiva === 'pedidos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Pedidos</button>
        <button onClick={() => setAbaAtiva('pagamentos')} className={`px-4 py-2 rounded ${abaAtiva === 'pagamentos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Pagamentos</button>
        <button onClick={() => setAbaAtiva('graficos')} className={`px-4 py-2 rounded ${abaAtiva === 'graficos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Gráficos</button>
        <button onClick={() => setAbaAtiva('relatorios')} className={`px-4 py-2 rounded ${abaAtiva === 'relatorios' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Relatórios</button>
      </div>

      {/* Aba: Produtos */}
      {abaAtiva === 'produtos' && (
        <>
          <ProdutoForm />
          <EstoqueForm />
        </>
      )}

      {/* Aba: Pedidos */}
      {abaAtiva === 'pedidos' && (
        <>
          <PedidoForm />
          <AtualizarStatusPedido />
          <PedidoLista />
        </>
      )}

      {/* Aba: Pagamentos */}
      {abaAtiva === 'pagamentos' && (
        <>
          <PagamentoForm />
          <AtualizarStatusPagamento />
          <GerarBoletoForm />
          <PagamentoLista />
        </>
      )}

      {/* Aba: Gráficos */}
      {abaAtiva === 'graficos' && (
        <div className="space-y-6">
          {/* Indicadores e filtros globais */}
          <IndicadoresDashboard />
          <FiltroDashboard onFiltrar={setFiltros} />

          {/* Gráficos analíticos principais */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Vendas por Cliente</h3>
              <GraficoPorCliente filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Vendas por Produto</h3>
              <GraficoPorProduto filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Movimentação de Estoque</h3>
              <GraficoMovimentacao filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Funil de Vendas (CRM)</h3>
              <GraficoFunil filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Clientes Ativos</h3>
              <GraficoClientesAtivos filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Interações Mensais (CRM)</h3>
              <GraficoInteracoesMensais filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow md:col-span-2">
              <h3 className="text-lg font-bold mb-2">Transações Mensais (Pedidos e Pagamentos)</h3>
              <GraficoMensalTransacoes filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow md:col-span-2">
              <h3 className="text-lg font-bold mb-2">Ranking de Clientes por Valor</h3>
              <RankingClientesValor filtros={filtros} />
            </div>
          </div>

          {/* Inteligência comercial: alertas e sugestões */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Alertas Comerciais</h3>
              <AlertasDashboard filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Sugestões Comerciais</h3>
              <SugestoesComerciais filtros={filtros} />
            </div>
          </div>

          {/* Metas e comissões */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Metas Comerciais</h3>
              <PainelMetasComerciais filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Metas por Canal</h3>
              <PainelMetasPorCanal filtros={filtros} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Comissões por Vendedor</h3>
              <PainelComissoesVendedor filtros={filtros} />
            </div>
          </div>

          {/* Modelo Oráculo (ML) */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">📊 Modelo Oráculo</h3>
            <ModeloInfo />
            <HistoricoTreinamentosGrafico />
            {/* Filtros e export dos treinamentos */}
            <HistoricoTreinamentosCompletoExportFiltro />
            <HistoricoTreinamentosCompletoExport />
          </div>

          {/* Seção exclusiva para vendedores */}
          {perfil.tipo === 'vendedor' && (
            <div className="bg-white p-4 rounded shadow">
              <PainelDoVendedor perfil={perfil} filtros={filtros} />
              <PainelPrevisaoVendas
                perfil={perfil}
                vendedorSelecionado={perfil.id}
                mesesSelecionados={['2025-11', '2025-12']}
              />
              <GraficoPrevisaoVendas perfil={perfil} />
              {/* <AlertasVendedor perfil={perfil} /> */}
            </div>
          )}
        </div>
      )}

      {/* Aba: Relatórios */}
      {abaAtiva === 'relatorios' && (
        <div className="space-y-6">
          {/* Filtros globais para relatórios */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Filtros</h3>
            <FiltroDashboard onFiltrar={setFiltros} />
          </div>

          {/* Tabela principal de relatórios com dados filtrados */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Tabela de Relatórios</h3>
            <TabelaRelatorio
              filtros={filtros}
              onDadosProcessados={setDadosFiltrados} // callback para capturar dados para exportação
            />
          </div>

          {/* Resumo por cliente (KPIs agregados) */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Resumo por Cliente</h3>
            <ResumoPorCliente filtros={filtros} />
          </div>

          {/* Exportações: CSV e PDF com base nos dados filtrados */}
          <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Exportações</h3>
              <p className="text-gray-600">Gere relatórios no formato CSV ou PDF com os dados abaixo.</p>
            </div>
            <div className="flex gap-3">
              <BotaoExportarCSV dados={dadosFiltrados} nomeArquivo="relatorio-oraculo.csv" />
              <BotaoExportarPDF dados={dadosFiltrados} nomeArquivo="relatorio-oraculo.pdf" />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );  
};

export default Dashboard;
