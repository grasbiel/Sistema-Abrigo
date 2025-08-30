import React, { useState, useEffect, useCallback, useContext } from 'react'; // 1. Adicione useContext
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

import apiClient from '../api/axiosConfig';
import { Departamento } from '../types';
import AuthContext from '../context/AuthContext'; // 2. Importe o AuthContext

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

    // 3. Obtenha os dados do usuário a partir do contexto
    const { user } = useContext(AuthContext)!;

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

    useEffect(() => {
        fetchDepartamentos();
    }, [fetchDepartamentos]);

    const handleModalOpen = () => {
        setNovoDepartamento({ nome: '' });
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
            fetchDepartamentos();
        } catch (err) {
            console.error("Erro ao cadastrar departamento:", err);
            setError('Falha ao cadastrar. Este departamento já pode existir.');
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nome', headerName: 'Nome do Departamento', flex: 1 },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Gerenciar Departamentos
                </Typography>
                
                {/* 4. A lógica condicional agora funciona e não está duplicada */}
                {user?.groups.includes('Controlador') && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleModalOpen}>
                        Adicionar Departamento
                    </Button>
                )}
            </Box>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid rows={departamentos} columns={columns} loading={loading} />
            </Paper>

            {/* Modal de Cadastro */}
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