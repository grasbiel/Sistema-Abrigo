import React, { useContext } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import LogoutIcon from '@mui/icons-material/Logout';

import AuthContext from '../context/AuthContext';
<<<<<<< HEAD
import CategoryIcon from '@mui/icons-material/Category';
<<<<<<< HEAD
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
=======
>>>>>>> parent of 3cb17c8 (Add management children and departament)
=======
>>>>>>> parent of 2afa89a (Mudando o backend de django para spring boot)

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
                
<<<<<<< HEAD
                
                {user?.groups.includes('ROLE_CONTROLADOR') && (
                    <ListItem disablePadding component={RouterLink} to="/validar-movimentacao">
                        <ListItemButton >
=======
                {/* Link Condicional para o Controlador */}
                {user?.groups.includes('Controlador') && (
                     <ListItem disablePadding component={RouterLink} to="/validar-movimentacao">
                        <ListItemButton sx={{ backgroundColor: 'rgba(0, 0, 255, 0.08)' }}>
>>>>>>> parent of 2afa89a (Mudando o backend de django para spring boot)
                            <ListItemIcon><PlaylistAddCheckIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Validar Movimentações" />
                        </ListItemButton>
                    </ListItem>
                )}
<<<<<<< HEAD

                <ListItem disablePadding component={RouterLink} to="/gerenciar-criancas">
                    <ListItemButton>
                        <ListItemIcon><EscalatorWarningIcon /></ListItemIcon>
                        <ListItemText primary="Gerenciar Crianças" />
                    </ListItemButton>
                </ListItem>
<<<<<<< HEAD

                {user?.groups.includes('ROLE_CONTROLADOR') && (
                    <ListItem disablePadding component={RouterLink} to="/gerenciar-departamentos">
                        <ListItemButton>
                            <ListItemIcon><CategoryIcon /></ListItemIcon>
                            <ListItemText primary="Departamentos" />
                        </ListItemButton>
                    </ListItem>
                    
                )}
                {user?.groups.includes('ROLE_CONTROLADOR') && (
                    <ListItem disablePadding component={RouterLink} to="/gerenciar-usuarios">
                            <ListItemButton>
                                <ListItemIcon><SupervisorAccountIcon /></ListItemIcon>
                                <ListItemText primary="Gerenciar Usuários" />
                            </ListItemButton>
                    </ListItem>
                )}
=======
>>>>>>> parent of 3cb17c8 (Add management children and departament)
=======
                
                <ListItem disablePadding component={RouterLink} to="/gerenciar-departamentos">
                    <ListItemButton>
                        <ListItemIcon><CategoryIcon /></ListItemIcon>
                        <ListItemText primary="Departamentos" />
                    </ListItemButton>
                </ListItem>
>>>>>>> parent of 2afa89a (Mudando o backend de django para spring boot)
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