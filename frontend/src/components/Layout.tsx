import React, { useContext } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import CategoryIcon from '@mui/icons-material/Category';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LogoutIcon from '@mui/icons-material/Logout';

import AuthContext from '../context/AuthContext';

const drawerWidth = 240;

const Layout: React.FC = () => {
    const authContext = useContext(AuthContext);

    
    if (!authContext) {
        return null; // Ou um componente de loading/erro
    }
    const { user, logoutUser } = authContext;

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            
            <List>
                
                <ListItem disablePadding component={RouterLink} to="/dashboard">
                    <ListItemButton>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={RouterLink} to="/estoque">
                    <ListItemButton>
                        <ListItemIcon><InventoryIcon /></ListItemIcon>
                        <ListItemText primary="Estoque" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding component={RouterLink} to="/registrar-movimentacao">
                    <ListItemButton>
                        <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                        <ListItemText primary="Registrar Movimentação" />
                    </ListItemButton>
                </ListItem>
                 <ListItem disablePadding component={RouterLink} to="/gerenciar-criancas">
                    <ListItemButton>
                        <ListItemIcon><EscalatorWarningIcon /></ListItemIcon>
                        <ListItemText primary="Gerenciar Crianças" />
                    </ListItemButton>
                </ListItem>
                
                {/* --- SEÇÃO CONDICIONAL PARA O CONTROLADOR --- */}
                {/* Verifica se o usuário pertence ao grupo 'ROLE_CONTROLADOR' */}
                {user?.groups.includes('Controlador') && (
                    <>
                        {/* Divisor para separar os menus de admin */}
                        <Divider sx={{ my: 1 }} /> 
                        
                        <ListItem disablePadding component={RouterLink} to="/validar-movimentacao">
                            <ListItemButton>
                                <ListItemIcon><PlaylistAddCheckIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Validar Movimentações" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component={RouterLink} to="/gerenciar-departamentos">
                            <ListItemButton>
                                <ListItemIcon><CategoryIcon /></ListItemIcon>
                                <ListItemText primary="Departamentos" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component={RouterLink} to="/gerenciar-usuarios">
                            <ListItemButton>
                                <ListItemIcon><SupervisorAccountIcon /></ListItemIcon>
                                <ListItemText primary="Gerenciar Usuários" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
            
            <Divider />

            {/* LISTA PARA A AÇÃO DE SAIR */}
            <List>
                 <ListItem disablePadding onClick={logoutUser}>
                    <ListItemButton>
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Sair" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Sistema de Gestão do Abrigo
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                {drawer}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Espaçador */}
                <Outlet /> {/* Onde as páginas são renderizadas */}
            </Box>
        </Box>
    );
};

export default Layout;