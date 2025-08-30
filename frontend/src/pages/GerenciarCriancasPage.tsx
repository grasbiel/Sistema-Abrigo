import React, { useState, useEffect, useCallback, useContext } from 'react'; // 1. Adicione useContext
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid'; // Importe GridPaginationModel
import AddIcon from '@mui/icons-material/Add';

import apiClient from '../api/axiosConfig';
import { Crianca } from '../types';
import AuthContext from '../context/AuthContext'; 

interface PaginatedCriancasResponse {
    count: number;
    results: Crianca[];
}

const GerenciarCriancasPage: React.FC = () => {
    const [criancas, setCriancas] = useState<Crianca[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ nome_completo: '', data_nascimento: '', data_entrada: new Date().toISOString().split('T')[0] });

    // Estados para paginação
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    
    // 3. Obtenha os dados do usuário a partir do contexto
    const { user } = useContext(AuthContext)!;

    const fetchCriancas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<PaginatedCriancasResponse>(
                `/criancas/?page=${paginationModel.page + 1}&page_size=${paginationModel.pageSize}`
            );
            setCriancas(response.data.results);
            setRowCount(response.data.count);
        } catch (error) {
            console.error("Erro ao buscar crianças:", error);
        } finally {
            setLoading(false);
        }
    }, [paginationModel]);

    useEffect(() => {
        fetchCriancas();
    }, [fetchCriancas]);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await apiClient.post('/criancas/', formData);
            handleModalClose();
            fetchCriancas();
        } catch (error) {
            console.error("Erro ao cadastrar criança:", error);
        }
    };

    const columns: GridColDef[] = [
        { field: 'nome_completo', headerName: 'Nome Completo', width: 300 },
        { field: 'idade', headerName: 'Idade', type: 'number', width: 100 },
        { field: 'data_entrada', headerName: 'Data de Entrada', width: 150 },
        { field: 'status_acolhimento', headerName: 'Status Ativo', type: 'boolean', width: 120 },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Gerenciar Crianças
                </Typography>
                
                {/* 4. A lógica condicional agora funciona porque a variável 'user' existe */}
                {user?.groups.includes('ROLE_CONTROLADOR') && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleModalOpen}>
                        Cadastrar Criança
                    </Button>
                )}
            </Box>
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid 
                    rows={criancas} 
                    columns={columns} 
                    loading={loading} 
                    getRowId={(row) => row.id}
                    rowCount={rowCount}
                    pageSizeOptions={[5, 10, 20]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    paginationMode="server"
                />
            </Paper>

            {/* Modal de Cadastro */}
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Cadastrar Nova Criança</DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        {/* 5. Corrigido 'size' para 'item' e adicionado 'xs' e 'sm' */}
                        <Grid container spacing={2} sx={{pt: 1}}>
                            <Grid size={{xs:12}}>
                                <TextField name="nome_completo" label="Nome Completo" onChange={handleChange} fullWidth required autoFocus />
                            </Grid>
                            <Grid size={{xs:12, sm:6}}>
                                <TextField name="data_nascimento" label="Data de Nascimento" type="date" onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid  size={{xs:12, sm:6}}>
                                <TextField name="data_entrada" label="Data de Entrada" type="date" value={formData.data_entrada} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
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

export default GerenciarCriancasPage;