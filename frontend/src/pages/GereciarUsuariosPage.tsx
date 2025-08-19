import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
    Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, Grid, FormControl, InputLabel, Select, 
    MenuItem, Chip, SelectChangeEvent 
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

import apiClient from '../api/axiosConfig';
import { Usuario, Grupo } from '../types';
import AuthContext from '../context/AuthContext';

// Interface para a resposta paginada da API de Usuários
interface PaginatedUsuariosResponse {
    count: number;
    results: Usuario[];
}

const GerenciarUsuariosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', first_name: '', last_name: '', email: '', group_id: '' });
    const [error, setError] = useState('');
    
    // Estados para a paginação do Data Grid
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    const { user } = useContext(AuthContext)!;

    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        try {
            // CORREÇÃO AQUI: Fazemos a requisição com os parâmetros de paginação
            const response = await apiClient.get<PaginatedUsuariosResponse>(
                `/usuarios/?page=${paginationModel.page + 1}&page_size=${paginationModel.pageSize}`
            );
            // CORREÇÃO AQUI: Pegamos o array de dentro de 'results' e o total de 'count'
            setUsuarios(response.data.results);
            setRowCount(response.data.count);
        } catch (error) { 
            console.error("Erro ao buscar usuários:", error); 
        } finally {
            setLoading(false);
        }
    }, [paginationModel]);

    const fetchGrupos = useCallback(async () => {
        try {
            const response = await apiClient.get<Grupo[]>('/grupos/');
            setGrupos(response.data);
        } catch (error) { console.error("Erro ao buscar grupos:", error); }
    }, []);

    useEffect(() => {
        fetchGrupos();
    }, [fetchGrupos]);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const handleModalOpen = () => { setFormData({ username: '', password: '', first_name: '', last_name: '', email: '', group_id: '' }); setError(''); setModalOpen(true); };
    const handleModalClose = () => setModalOpen(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name!]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (!formData.username || !formData.password || !formData.group_id) { setError('Usuário, Senha e Cargo são obrigatórios.'); return; }

        try {
            await apiClient.post('/usuarios/', { ...formData, group_id: parseInt(formData.group_id) });
            handleModalClose();
            fetchUsuarios();
        } catch (err) { setError('Falha ao cadastrar. O nome de usuário já pode existir.'); }
    };

    const columns: GridColDef[] = [
        { field: 'username', headerName: 'Usuário', width: 150 },
        { field: 'first_name', headerName: 'Nome', width: 150 },
        { field: 'last_name', headerName: 'Sobrenome', width: 150 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'groups', headerName: 'Cargo', width: 200, renderCell: (params) => (
            <Box>{(params.value as string[]).map((group: string) => <Chip key={group} label={group} size="small" color={group === 'Controlador' ? 'primary' : 'default'} />)}</Box>
        )},
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Gerenciar Usuários</Typography>
                {user?.groups.includes('Controlador') && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleModalOpen}>Novo Usuário</Button>
                )}
            </Box>
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid 
                    rows={usuarios} 
                    columns={columns} 
                    loading={loading}
                    // Configurações da Paginação do Lado do Servidor
                    rowCount={rowCount}
                    pageSizeOptions={[5, 10, 20]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    paginationMode="server"
                />
            </Paper>

            {/* Modal de Cadastro */}
            <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="sm">
                <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && <Typography color="error" sx={{mb: 2}}>{error}</Typography>}
                        <Grid container spacing={2} sx={{pt: 1}}>
                            <Grid size={{xs:12}}><TextField name="username" label="Nome de Usuário" onChange={handleChange} fullWidth required autoFocus /></Grid>
                            <Grid size={{xs:12}}><TextField name="password" label="Senha" type="password" onChange={handleChange} fullWidth required /></Grid>
                            <Grid size={{xs:12, sm:6}}><TextField name="first_name" label="Nome" onChange={handleChange} fullWidth /></Grid>
                            <Grid size={{xs:12, sm:6}}><TextField name="last_name" label="Sobrenome" onChange={handleChange} fullWidth /></Grid>
                            <Grid size={{xs:12}}><TextField name="email" label="Email" type="email" onChange={handleChange} fullWidth /></Grid>
                            <Grid size={{xs:12}}>
                                <FormControl fullWidth required>
                                    <InputLabel id="group-select-label">Cargo</InputLabel>
                                    <Select name="group_id" labelId="group-select-label" value={formData.group_id} label="Cargo" onChange={handleChange}>
                                        {grupos.map(g => (<MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose}>Cancelar</Button>
                        <Button type="submit" variant="contained">Salvar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
};

export default GerenciarUsuariosPage;