// frontend/src/components/SnackbarNotificacao.jsx

import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Componente de notificação visual (snackbar)
 * Recebe mensagem, tipo e controle de visibilidade
 */
function SnackbarNotificacao({ open, onClose, mensagem, tipo }) {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert onClose={onClose} severity={tipo} sx={{ width: '100%' }}>
        {mensagem}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarNotificacao;
