import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, TextField, Button, Alert, CircularProgress } from '@mui/material';

import apiClient from '../api/axiosConfig';
import { Produto } from '../types';

// Interface para a resposta paginada da nossa API
interface PaginatedProductsResponse {
    count: number;
    results: Produto[];
}

const RegistrarMovimentacaoPage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
    const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>('entrada');
    const [quantidade, setQuantidade] = useState<number>(1);
    const [justificativa, setJustificativa] = useState<string>('');
    
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                // CORREÇÃO AQUI:
                // 1. Pedimos uma página grande para garantir que todos os produtos venham para o dropdown.
                // 2. Esperamos o objeto de resposta paginada.
                const response = await apiClient.get<PaginatedProductsResponse>('/produtos/?page_size=1000');
                
                // 3. Acessamos o array de produtos dentro da chave 'results'.
                setProdutos(response.data.results);

            } catch (err) {
                setError('Não foi possível carregar a lista de produtos.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!produtoSelecionado || quantidade <= 0) {
            setError('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const payload = {
            produto: parseInt(produtoSelecionado),
            quantidade,
            tipo: tipoMovimentacao,
            justificativa,
        };

        try {
            await apiClient.post('/movimentacoes/', payload);
            setSuccess('Movimentação registrada com sucesso! Ela aguarda aprovação do controlador.');
            setTimeout(() => navigate('/dashboard'), 2500);
        } catch (err) {
            setError('Falha ao registrar a movimentação. Verifique os dados e tente novamente.');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Registrar Movimentação de Estoque
            </Typography>
            <Link to="/dashboard">Voltar para o Dashboard</Link>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="produto-select-label">Produto</InputLabel>
                    <Select
                        labelId="produto-select-label"
                        id="produto"
                        value={produtoSelecionado}
                        label="Produto"
                        onChange={e => setProdutoSelecionado(e.target.value)}
                    >
                        <MenuItem value=""><em>Selecione um produto</em></MenuItem>
                        {produtos.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl component="fieldset" margin="normal">
                    <RadioGroup row name="tipo" value={tipoMovimentacao} onChange={e => setTipoMovimentacao(e.target.value as 'entrada' | 'saida')}>
                        <FormControlLabel value="entrada" control={<Radio />} label="Entrada" />
                        <FormControlLabel value="saida" control={<Radio />} label="Saída" />
                    </RadioGroup>
                </FormControl>
                
                <TextField
                    label="Quantidade"
                    type="number"
                    value={quantidade}
                    onChange={e => setQuantidade(parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Justificativa (opcional para entradas)"
                    multiline
                    rows={3}
                    value={justificativa}
                    onChange={e => setJustificativa(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Registrar Movimentação
                </Button>
            </Box>
        </Paper>
    );
};

export default RegistrarMovimentacaoPage;