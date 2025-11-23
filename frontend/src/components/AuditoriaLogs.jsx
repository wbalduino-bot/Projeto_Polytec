// ============================
// 📊 AuditoriaLogs.jsx (Super Avançada)
// ============================
// Recursos:
// - Filtros por ação, usuário e intervalo de datas
// - Gráficos (ações por tipo, usuário e dia)
// - DataGrid avançado com paginação, ordenação, Quick Filter, filtros por coluna
// - Exportação integrada para CSV/Excel/PDF
// - Feedback visual (loading, erros, sucesso)
// - Controle de permissões (admin/gerente)
// ============================

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { AuthContext } from '../context/AuthContext';

// Material UI
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';

// DataGrid Pro (para recursos avançados)
import {
  DataGrid,
  GridToolbar,
  GridToolbarQuickFilter,
  GridToolbarExport
} from '@mui/x-data-grid';

// Chart.js
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function AuditoriaLogs() {
  const { usuario } = useContext(AuthContext);

  // ============================
  // 📌 Estados principais
  // ============================
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Filtros
  const [filtroAcao, setFiltroAcao] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Snackbar
  const [snackbarAberto, setSnackbarAberto] = useState(false);

  // ============================
  // 📥 Carregar logs do backend
  // ============================
  useEffect(() => {
    axios.get('http://localhost:3001/api/auditoria', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      setLogs(res.data.logs || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('❌ Erro ao carregar logs:', err);
      setErro('Erro ao carregar logs de auditoria');
      setLoading(false);
    });
  }, []);

  // ============================
  // 🔎 Aplicar filtros
  // ============================
  const logsFiltrados = logs.filter(log => {
    const timestamp = new Date(log.timestamp);
    const dentroDoIntervalo =
      (!dataInicio || timestamp >= new Date(dataInicio)) &&
      (!dataFim || timestamp <= new Date(dataFim + 'T23:59:59'));

    return (
      (!filtroAcao || log.action?.toLowerCase().includes(filtroAcao.toLowerCase())) &&
      (!filtroUsuario || String(log.performedBy).toLowerCase().includes(filtroUsuario.toLowerCase())) &&
      dentroDoIntervalo
    );
  });

  // ============================
  // 📤 Exportar CSV (manual extra)
  // ============================
  const exportarCSV = () => {
    const csv = Papa.unparse(logsFiltrados.map(log => ({
      Ação: log.action,
      Usuário: log.performedBy,
      'ID do Alvo': log.userId,
      Data: new Date(log.timestamp).toLocaleString()
    })));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'logs_auditoria.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarAberto(true);
  };

  // ============================
  // 📊 Contagens para gráficos
  // ============================
  const contagemPorAcao = logsFiltrados.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  const contagemPorUsuario = logsFiltrados.reduce((acc, log) => {
    acc[log.performedBy] = (acc[log.performedBy] || 0) + 1;
    return acc;
  }, {});

  const contagemPorDia = logsFiltrados.reduce((acc, log) => {
    const dia = new Date(log.timestamp).toLocaleDateString();
    acc[dia] = (acc[dia] || 0) + 1;
    return acc;
  }, {});

  // ============================
  // 🎨 Renderização
  // ============================
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Carregando logs...</Typography>
      </Box>
    );
  }

  if (erro) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert severity="error">{erro}</Alert>
      </Box>
    );
  }

  // Controle de permissão
  const autorizado = usuario?.perfil === 'admin' || usuario?.perfil === 'gerente';

  // Colunas da tabela DataGrid
  const colunas = [
    { field: 'action', headerName: 'Ação', flex: 1, filterable: true },
    { field: 'performedBy', headerName: 'Usuário', flex: 1, filterable: true },
    { field: 'userId', headerName: 'ID do Alvo', flex: 1, filterable: true },
    {
      field: 'timestamp',
      headerName: 'Data',
      flex: 1,
      filterable: true,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    }
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Logs de Auditoria
      </Typography>

      {!autorizado && (
        <Alert severity="warning">
          Você não possui permissão para visualizar os detalhes de auditoria.
        </Alert>
      )}

      {autorizado && (
        <>
          {/* Filtros manuais extras */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <TextField label="Filtrar por ação" value={filtroAcao} onChange={e => setFiltroAcao(e.target.value)} />
            <TextField label="Filtrar por usuário" value={filtroUsuario} onChange={e => setFiltroUsuario(e.target.value)} />
            <TextField label="Data início" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Data fim" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} InputLabelProps={{ shrink: true }} />
            <Button variant="contained" onClick={exportarCSV}>Exportar CSV</Button>
          </Box>

          {/* Gráfico: ações por tipo */}
          {Object.keys(contagemPorAcao).length > 0 && (
            <Paper sx={{ p: 2, mb: 4 }}>
              <Bar
                data={{
                  labels: Object.keys(contagemPorAcao),
                  datasets: [{
                    label: 'Ações por tipo',
                    data: Object.values(contagemPorAcao),
                    backgroundColor: '#1976d2'
                  }]
                }}
                options={{ responsive: true }}
              />
            </Paper>
          )}

          {/* Gráfico: ações por usuário */}
          {Object.keys(contagemPorUsuario).length > 0 && (
            <Paper sx={{ p: 2, mb: 4 }}>
              <Bar
                data={{
                  labels: Object.keys(contagemPorUsuario),
                  datasets: [{
                    label: 'Ações por usuário',
                    data: Object.values(contagemPorUsuario),
                    backgroundColor: '#4caf50'
                  }]
                }}
                options={{ responsive: true }}
              />
            </Paper>
          )}

          {/* Gráfico: ações por dia */}
          {Object.keys(contagemPorDia).length > 0 && (
            <Paper sx={{ p: 2, mb: 4 }}>
              <Line
                data={{
                  labels: Object.keys(contagemPorDia),
                  datasets: [{
                    label: 'Ações por dia',
                    data: Object.values(contagemPorDia),
                    borderColor: '#f44336',
                    backgroundColor: '#ffcdd2',
                    fill: true,
                    tension: 0.3
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true }
                  },
                  scales: {
                    x: { title: { display: true, text: 'Dia' } },
                    y: { title: { display: true, text: 'Quantidade' }, beginAtZero: true }
                  }
                }}
              />
            </Paper>
          )}

          {/* DataGrid avançado com paginação, ordenação, Quick Filter e exportação */}
          <Paper sx={{ height: 600, width: '100%', mt: 4 }}>
            <DataGrid
              rows={logsFiltrados.map((log, i) => ({
                id: i, // id único exigido pelo DataGrid
                ...log
              }))}
              columns={colunas}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              pagination
              disableSelectionOnClick
              autoHeight={false}
              // Toolbar completa (Quick Filter + Export)
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 400 }
                }
              }}
              // Estado inicial com ordenação por data (desc)
              initialState={{
                sorting: {
                  sortModel: [{ field: 'timestamp', sort: 'desc' }]
                },
                pagination: {
                  pageSize: 10
                }
              }}
            />
          </Paper>

          {/* Notificação visual ao exportar */}
          <Snackbar
            open={snackbarAberto}
            autoHideDuration={4000}
            onClose={() => setSnackbarAberto(false)}
          >
            <Alert
              onClose={() => setSnackbarAbererto(false)}
              severity="success"
              sx={{ width: '100%' }}
            >
              Exportação realizada com sucesso!
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
}

export default AuditoriaLogs;
