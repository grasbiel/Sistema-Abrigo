import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

import apiClient from '../api/axiosConfig';
import { Departamento } from '../types';
import AuthContext from '../context/AuthContext';

// Tipo para a resposta paginada da API de Departamentos
interface PaginatedDepartamentosResponse {
    results: Departamento[];
}

const GerenciarDepartamentosPage: React.FC = () => {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [novoDepartamento, setNovoDepartamento] = useState({ nome: '' });
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext)!

    // Função para buscar os departamentos (usando useCallback para otimização)
    const fetchDepartamentos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<PaginatedDepartamentosResponse>('/departamentos/');
            setDepartamentos(response.data.results);
        } catch (err) {
            console.error("Erro ao buscar departamentos:", err);
            setError('Não foi possível carregar os departamentos.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Busca os dados quando o componente é montado
    useEffect(() => {
        fetchDepartamentos();
    }, [fetchDepartamentos]);

    const handleModalOpen = () => {
        setNovoDepartamento({ nome: '' }); // Reseta o formulário
        setError('');
        setModalOpen(true);
    };
    const handleModalClose = () => setModalOpen(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (!novoDepartamento.nome) {
            setError('O nome do departamento é obrigatório.');
            return;
        }

        try {
            await apiClient.post('/departamentos/', novoDepartamento);
            handleModalClose();
            fetchDepartamentos(); // Atualiza a lista na tela após o cadastro
        } catch (err) {
            console.error("Erro ao cadastrar departamento:", err);
            setError('Falha ao cadastrar. Este departamento já pode existir.');
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nome', headerName: 'Nome do Departamento', flex: 1 },
        // Podemos adicionar uma coluna de 'Ações' (editar/excluir) no futuro
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Gerenciar Departamentos
                </Typography>
                {
                    user?.groups.includes('ROLE_CONTROLADOR') && (
                         <Button variant="contained" startIcon={<AddIcon />} onClick={handleModalOpen}>
                            Adicionar Departamento
                        </Button>
                    )

                }
               
            </Box>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid rows={departamentos} columns={columns} loading={loading} />
            </Paper>

            {/* Modal de Cadastro de Novo Departamento */}
            <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="sm">
                <DialogTitle>Adicionar Novo Departamento</DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && <Typography color="error" sx={{mb: 2}}>{error}</Typography>}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nome"
                            name="nome"
                            label="Nome do Departamento"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={novoDepartamento.nome}
                            onChange={(e) => setNovoDepartamento({ nome: e.target.value })}
                            required
                        />
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

export default GerenciarDepartamentosPage;