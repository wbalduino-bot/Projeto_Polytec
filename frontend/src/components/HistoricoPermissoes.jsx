// frontend/src/components/HistoricoPermissoes.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';

/**
 * Exibe histórico de alterações de permissões registradas na auditoria
 */
function HistoricoPermissoes() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/auditoria?acao=update_permissions', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setLogs(res.data))
    .catch(err => console.error('Erro ao carregar histórico:', err));
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Histórico de Alterações de Permissões
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Administrador</TableCell>
            <TableCell>Usuário Alvo</TableCell>
            <TableCell>Permissões Aplicadas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, i) => (
            <TableRow key={i}>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell>{log.performedBy}</TableCell>
              <TableCell>{log.userId}</TableCell>
              <TableCell>{log.detalhes?.novasPermissoes?.join(', ') || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default HistoricoPermissoes;
