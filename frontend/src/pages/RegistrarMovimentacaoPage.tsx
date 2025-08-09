import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, TextField, Button, Alert, CircularProgress, SelectChangeEvent } from '@mui/material';

import apiClient from '../api/axiosConfig';
import { Produto } from '../types';

interface PaginatedProductsResponse {
    results: Produto[];
}

const RegistrarMovimentacaoPage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Estados do formulário
    const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
    const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>('entrada');
    const [quantidade, setQuantidade] = useState<string>('1');
    const [dataValidade, setDataValidade] = useState<string>(''); // Novo estado para validade
    const [justificativa, setJustificativa] = useState<string>('');
    
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get<PaginatedProductsResponse>('/produtos/?page_size=1000');
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

        if (!produtoSelecionado || parseFloat(quantidade) <= 0) {
            setError('Por favor, preencha todos os campos obrigatórios corretamente.');
            return;
        }

        const payload: any = {
            produto: parseInt(produtoSelecionado),
            quantidade: parseFloat(quantidade),
            tipo: tipoMovimentacao,
            justificativa,
        };

        // Adiciona a data de validade ao payload APENAS se for uma entrada e se foi preenchida
        if (tipoMovimentacao === 'entrada' && dataValidade) {
            payload.data_validade = dataValidade;
        }

        try {
            await apiClient.post('/movimentacoes/', payload);
            setSuccess('Movimentação registrada com sucesso! Ela aguarda aprovação do controlador.');
            setTimeout(() => navigate('/dashboard'), 2500);
        } catch (err) {
            setError('Falha ao registrar a movimentação. Verifique os dados e tente novamente.');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Registrar Movimentação de Estoque</Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="produto-select-label">Produto</InputLabel>
                    <Select labelId="produto-select-label" value={produtoSelecionado} label="Produto" onChange={(e: SelectChangeEvent) => setProdutoSelecionado(e.target.value)}>
                        <MenuItem value=""><em>Selecione um produto</em></MenuItem>
                        {produtos.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.display_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl component="fieldset" margin="normal">
                    <RadioGroup row name="tipo" value={tipoMovimentacao} onChange={e => setTipoMovimentacao(e.target.value as 'entrada' | 'saida')}>
                        <FormControlLabel value="entrada" control={<Radio />} label="Entrada" />
                        <FormControlLabel value="saida" control={<Radio />} label="Saída" />
                    </RadioGroup>
                </FormControl>
                
                <TextField label="Quantidade" type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} InputProps={{ inputProps: { min: 0.01, step: "0.01" } }} fullWidth margin="normal" required />

                {/* --- CAMPO CONDICIONAL PARA DATA DE VALIDADE --- */}
                {tipoMovimentacao === 'entrada' && (
                    <TextField
                        label="Data de Validade (opcional)"
                        type="date"
                        value={dataValidade}
                        onChange={e => setDataValidade(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                )}
                
                <TextField label="Justificativa (opcional)" multiline rows={3} value={justificativa} onChange={e => setJustificativa(e.target.value)} fullWidth margin="normal" />

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>Registrar Movimentação</Button>
            </Box>
        </Paper>
    );
};

export default RegistrarMovimentacaoPage;