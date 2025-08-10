import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import {Link as RouterLink} from 'react-router-dom'

import apiClient from '../api/axiosConfig';
import { Produto } from '../types';

// Interface para a resposta paginada da nossa API
interface PaginatedProductsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Produto[];
}

// Definição das colunas da nossa tabela
const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Descrição do Produto', width: 400 },
    { 
        field: 'quantidade_em_estoque', 
        headerName: 'Em Estoque', 
        type: 'number',
        width: 150,
        align: 'center',
        headerAlign: 'center',
    },
    { 
        field: 'quantidade_minima', 
        headerName: 'Estoque Mínimo', 
        type: 'number',
        width: 150,
        align: 'center',
        headerAlign: 'center',
    },
]


const EstoquePage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [rowCount, setRowCount] = useState(0); // Total de itens para a paginação
    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,      // O Data Grid começa na página 0
        pageSize: 10,
    });

    useEffect(() => {
        const fetchProdutos = async () => {
            setLoading(true);
            try {
                // Passamos a página e o tamanho como parâmetros para a API
                // O Data Grid usa página 0, mas a API do Django usa página 1. Por isso, somamos 1.
                const response = await apiClient.get<PaginatedProductsResponse>(
                    `/produtos/?page=${paginationModel.page + 1}&page_size=${paginationModel.pageSize}`
                );
                setProdutos(response.data.results);
                setRowCount(response.data.count);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
    }, [paginationModel]); // A busca é refeita sempre que o modelo de paginação muda

    return (
        <Box>
            <Box sx={{display:'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="h4" gutterBottom>
                Estoque de Produtos
                </Typography>
                <Button variant='contained' component={RouterLink} to="/cadastrar-produto">
                    Adicionar novos produtos
                </Button>
            </Box>
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={produtos}
                    columns={columns}
                    loading={loading}
                    // Configurações da Paginação
                    rowCount={rowCount}
                    pageSizeOptions={[5, 10, 20]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    paginationMode="server" // Informa ao Grid que a paginação é feita no servidor
                />
            </Paper>
        </Box>
    );
};

export default EstoquePage;