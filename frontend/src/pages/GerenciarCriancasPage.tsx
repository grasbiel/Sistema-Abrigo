import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

import apiClient from '../api/axiosConfig';
import { Crianca } from '../types'; // Certifique-se que o tipo Crianca está completo em types/index.ts

const GerenciarCriancasPage: React.FC = () => {
    const [criancas, setCriancas] = useState<Crianca[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ nome_completo: '', data_nascimento: '', data_entrada: new Date().toISOString().split('T')[0] });

    const fetchCriancas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<Crianca[]>('/criancas/');
            setCriancas(response.data);
        } catch (error) {
            console.error("Erro ao buscar crianças:", error);
        } finally {
            setLoading(false);
        }
    }, []);

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
            fetchCriancas(); // Atualiza a lista após o cadastro
        } catch (error) {
            console.error("Erro ao cadastrar criança:", error);
            // Aqui você pode adicionar um estado de erro para exibir no modal
        }
    };

    const columns: GridColDef[] = [
        { field: 'nome_completo', headerName: 'Nome Completo', width: 300 },
        { field: 'idade', headerName: 'Idade', type: 'number', width: 100 },
        { field: 'data_entrada', headerName: 'Data de Entrada', width: 150 },
        { field: 'status_acolhimento', headerName: 'Status', type: 'boolean', width: 120 },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Gerenciar Crianças</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleModalOpen}>
                    Cadastrar Criança
                </Button>
            </Box>
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid rows={criancas} columns={columns} loading={loading} getRowId={(row) => row.id} />
            </Paper>

            {/* Modal de Cadastro */}
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Cadastrar Nova Criança</DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{pt: 1}}>
                            <Grid size={{xs:12}}>
                                <TextField name="nome_completo" label="Nome Completo" onChange={handleChange} fullWidth required autoFocus />
                            </Grid>
                            <Grid size={{xs:12, sm:6}}>
                                <TextField name="data_nascimento" label="Data de Nascimento" type="date" onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                            </Grid>
                             <Grid size={{xs:12, sm:6}}>
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