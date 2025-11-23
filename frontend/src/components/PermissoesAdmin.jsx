// frontend/src/components/PermissoesAdmin.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button
} from '@mui/material';

/**
 * Componente que permite visualizar e editar permissões de usuários
 * Exibe uma tabela com checkboxes para cada permissão
 */
function PermissoesAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  // Permissões disponíveis no sistema
  const permissoesDisponiveis = ['auditoria', 'usuarios', 'estatisticas'];

  // Carrega a lista de usuários do backend
  useEffect(() => {
    axios.get('http://localhost:3001/usuarios', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setUsuarios(res.data))
    .catch(err => console.error('Erro ao carregar usuários:', err));
  }, []);

  // Alterna uma permissão para um usuário
  const togglePermissao = (userId, permissao) => {
    setUsuarios(prev =>
      prev.map(user =>
        user._id === userId
          ? {
              ...user,
              permissoes: user.permissoes.includes(permissao)
                ? user.permissoes.filter(p => p !== permissao)
                : [...user.permissoes, permissao]
            }
          : user
      )
    );
  };

  // Salva as permissões atualizadas no backend
  const salvarPermissoes = () => {
    axios.put('http://localhost:3001/permissoes', usuarios, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => alert('Permissões atualizadas com sucesso!'))
    .catch(() => alert('Erro ao salvar permissões.'));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gerenciar Permissões de Usuários
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuário</TableCell>
            {permissoesDisponiveis.map(permissao => (
              <TableCell key={permissao}>{permissao}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map(user => (
            <TableRow key={user._id}>
              <TableCell>{user.nome}</TableCell>
              {permissoesDisponiveis.map(permissao => (
                <TableCell key={permissao}>
                  <Checkbox
                    checked={user.permissoes.includes(permissao)}
                    onChange={() => togglePermissao(user._id, permissao)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={salvarPermissoes}>
          Salvar Alterações
        </Button>
      </Box>
    </Box>
  );
}

export default PermissoesAdmin;
