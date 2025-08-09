import React, { useContext } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import LogoutIcon from '@mui/icons-material/Logout';

import AuthContext from '../context/AuthContext';

const drawerWidth = 240;

const Layout: React.FC = () => {
    const { user, logoutUser } = useContext(AuthContext)!;

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
                
                {/* Link Condicional para o Controlador */}
                {user?.groups.includes('Controlador') && (
                     <ListItem disablePadding component={RouterLink} to="/validar-movimentacao">
                        <ListItemButton sx={{ backgroundColor: 'rgba(0, 0, 255, 0.08)' }}>
                            <ListItemIcon><PlaylistAddCheckIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Validar Movimentações" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
            <Divider />
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
                <Toolbar /> {/* Espaçador para o conteúdo não ficar atrás da AppBar */}
                <Outlet /> {/* Aqui é onde as páginas (Dashboard, etc.) serão renderizadas */}
            </Box>
        </Box>
    );
}

export default Layout;