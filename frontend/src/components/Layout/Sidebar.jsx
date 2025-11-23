// ============================
// 📂 Sidebar.jsx
// ============================
// Menu lateral fixo com logo da empresa no topo
// e ícones modernos para navegação.
// ============================

import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // ✅ Hook para acessar o tema global

// Ícones do Material UI
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

// ✅ Logos da empresa (clara e escura)
import logoLight from '../../assets/logo-home-social.jpg';
import logoDark from '../../assets/cropped-polytec-icone-2021-1.png';

function Sidebar() {
  const theme = useTheme(); // ✅ Captura o tema atual (light/dark)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      {/* Logo dinâmica no topo */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <img
          src={theme.palette.mode === 'light' ? logoLight : logoDark} // ✅ Alterna logo conforme tema
          alt="Logo Empresa"
          style={{ height: 50 }}
        />
      </Box>

      {/* Lista de navegação */}
      <List>
        {/* Dashboard */}
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Usuários */}
        <ListItem button component={Link} to="/usuarios">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Usuários" />
        </ListItem>

        {/* Auditoria */}
        <ListItem button component={Link} to="/auditoria">
          <ListItemIcon><SecurityIcon /></ListItemIcon>
          <ListItemText primary="Auditoria" />
        </ListItem>

        {/* Relatórios */}
        <ListItem button component={Link} to="/relatorios">
          <ListItemIcon><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Relatórios" />
        </ListItem>

        {/* Configurações */}
        <ListItem button component={Link} to="/configuracoes">
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Configurações" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
