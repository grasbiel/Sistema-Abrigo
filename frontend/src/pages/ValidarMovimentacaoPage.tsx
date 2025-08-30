import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Chip, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { format, parseISO } from 'date-fns';

import apiClient from '../api/axiosConfig';
import { Movimentacao } from '../types';

interface PaginatedMovimentacoesResponse {
    count: number;
    results: Movimentacao[];
}

const ValidarMovimentacaoPage: React.FC = () => {
    const [pendentes, setPendentes] = useState<Movimentacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const fetchPendentes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<PaginatedMovimentacoesResponse>('/movimentacoes/?status=pendente');
            setPendentes(response.data.results);
        } catch (err) {
            console.error("Erro ao buscar movimentações pendentes:", err);
            setFeedback({ type: 'error', message: 'Não foi possível carregar as movimentações.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendentes();
    }, [fetchPendentes]);

    const handleAprovar = useCallback(async (id: number) => {
        setFeedback(null);
        try {
            await apiClient.post(`/movimentacoes/${id}/validar/`);
            setFeedback({ type: 'success', message: 'Movimentação aprovada com sucesso!' });
            fetchPendentes();
        } catch (err) {
            setFeedback({ type: 'error', message: 'Erro ao aprovar a movimentação.' });
        }
    }, [fetchPendentes]);

    const handleRecusar = useCallback(async (id: number) => {
        setFeedback(null);
        try {
            await apiClient.post(`/movimentacoes/${id}/recusar/`);
            setFeedback({ type: 'success', message: 'Movimentação recusada.' });
            fetchPendentes();

        } catch (err) {
            setFeedback({ type: 'error', message: 'Erro ao recusar a movimentação.' });
        }
    }, [fetchPendentes]);

    const columns: GridColDef[] = [
        { field: 'produto_nome', headerName: 'Produto', flex: 1.5 },
        {
            field: 'tipo',
            headerName: 'Tipo',
            width: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.value === 'entrada' ? 'Entrada' : 'Saída'}
                    color={params.value === 'entrada' ? 'success' : 'warning'}
                    size="small"
                    variant="outlined"
                />
            ),
        },
        { field: 'quantidade', headerName: 'Qtd', type: 'number', width: 80, align: 'center', headerAlign: 'center' },
        { field: 'registrado_por_nome', headerName: 'Registrado por', width: 150 },
        {
            field: 'data_movimentacao',
            headerName: 'Data',
            width: 160,
            renderCell: (params) => format(parseISO(params.value), 'dd/MM/yyyy HH:mm')
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<CheckCircleIcon color="success" />} // O ícone já tem a cor
                    label="Aprovar"
                    onClick={() => handleAprovar(id as number)}
                    // A propriedade 'color' foi removida daqui
                />,
                <GridActionsCellItem
                    icon={<CancelIcon color="error" />} // O ícone já tem a cor
                    label="Recusar"
                    onClick={() => handleRecusar(id as number)}
                    // A propriedade 'color' foi removida daqui
                />,
            ],
        },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Validar Movimentações Pendentes
            </Typography>

            {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
            
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={pendentes}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id} // Adicionado para garantir ID único
                    slots={{
                      noRowsOverlay: () => (
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                          Nenhuma movimentação pendente.
                        </Box>
                      )
                    }}
                />
            </Paper>
        </Box>
    );
};

export default ValidarMovimentacaoPage;