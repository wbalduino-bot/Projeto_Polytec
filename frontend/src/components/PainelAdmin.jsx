// frontend/src/components/PainelAdmin.jsx

// Importa bibliotecas essenciais do React
import React, { useContext, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

// Importa os componentes que serão exibidos em cada aba
import AuditoriaLogs from './AuditoriaLogs';
import Usuarios from './Usuarios';
import EstatisticasBoletos from './EstatisticasBoletos';
import PermissoesAdmin from './PermissoesAdmin'; // ✅ Novo componente para gerenciar permissões

// Importa o contexto de autenticação para acessar o usuário logado
import { AuthContext } from '../context/AuthContext';

// Importa Historio de Permissoes de usuarios
import HistoricoPermissoes from './HistoricoPermissoes';

/**
 * Componente que representa o painel administrativo da aplicação
 * Exibe abas de navegação com base nas permissões do usuário logado
 */
function PainelAdmin() {
  // Obtém o usuário logado a partir do contexto
  const { usuario } = useContext(AuthContext);

  // Estado que controla qual aba está selecionada
  const [abaAtual, setAbaAtual] = useState(0);

  // Verifica se o usuário tem permissão para visualizar cada aba
  const podeVerAuditoria = usuario?.permissoes?.includes('auditoria');
  const podeVerUsuarios = usuario?.permissoes?.includes('usuarios');
  const podeVerEstatisticas = usuario?.permissoes?.includes('estatisticas');
  const podeGerenciarPermissoes = usuario?.permissoes?.includes('permissoes'); // ✅ Nova permissão
  const podeVerHistorico = usuario?.permissoes?.includes('auditoria');
  /**
   * Define dinamicamente quais abas estarão disponíveis
   * Cada aba é exibida apenas se o usuário tiver a permissão correspondente
   */
const abasDisponiveis = [
  podeVerAuditoria && { label: 'Auditoria', componente: <AuditoriaLogs /> },
  podeVerUsuarios && { label: 'Usuários', componente: <Usuarios /> },
  podeVerEstatisticas && { label: 'Estatísticas', componente: <EstatisticasBoletos /> },
  podeGerenciarPermissoes && { label: 'Permissões', componente: <PermissoesAdmin /> },
  podeVerHistorico && { label: 'Histórico de Permissões', componente: <HistoricoPermissoes /> }
].filter(Boolean);



  return (
    <Box sx={{ padding: 4 }}>
      {/* Título do painel */}
      <Typography variant="h4" gutterBottom>
        Painel Administrativo
      </Typography>

      {/* Navegação por abas */}
      <Tabs
        value={abaAtual}
        onChange={(e, novaAba) => setAbaAtual(novaAba)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {abasDisponiveis.map((aba, index) => (
          <Tab key={index} label={aba.label} />
        ))}
      </Tabs>

      {/* Conteúdo da aba selecionada */}
      <Box sx={{ mt: 4 }}>
        {abasDisponiveis[abaAtual]?.componente}
      </Box>
    </Box>
  );
}

export default PainelAdmin;
