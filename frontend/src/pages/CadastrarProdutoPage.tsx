import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Paper, Grid, TextField, Button, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import apiClient from '../api/axiosConfig';

// Tipo para um único Departamento
interface Departamento {
    id: number;
    nome: string;
}

// Tipo para a resposta paginada da API
interface PaginatedDepartamentosResponse {
    count: number;
    results: Departamento[];
}

const CadastrarProdutoPage: React.FC = () => {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [formData, setFormData] = useState({
        nome: '',
        marca: '',
        unidade_medida: 'un',
        tamanho: '',
        departamento: '',
        quantidade_minima: '5.00',
        descricao_adicional: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartamentos = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get<PaginatedDepartamentosResponse>('/departamentos/?page_size=100');
                
                setDepartamentos(response.data.results);

            } catch (err) {
                setError('Não foi possível carregar os departamentos.');
            } finally {
                setLoading(false);
            }
        };
        fetchDepartamentos();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name!]: value as string }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.nome || !formData.departamento || !formData.unidade_medida) {
            setError('Nome, Departamento e Unidade de Medida são obrigatórios.');
            return;
        }

        try {
            await apiClient.post('/produtos/', {
                ...formData,
                tamanho: formData.tamanho ? parseFloat(formData.tamanho) : null,
                quantidade_minima: parseFloat(formData.quantidade_minima),
                departamento: parseInt(formData.departamento),
            });
            setSuccess(`Produto "${formData.nome}" cadastrado com sucesso!`);
            setTimeout(() => navigate('/estoque'), 2000);
        } catch (err) {
            setError('Falha ao cadastrar o produto. Verifique os dados e tente novamente.');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Cadastrar Novo Produto</Typography>
            <Link to="/estoque">Voltar para a Lista de Estoque</Link>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Grid container spacing={2}>
                    <Grid size={{xs:12, sm:8}} >
                        <TextField name="nome" label="Nome do Produto (Ex: Leite em Pó Integral)" value={formData.nome} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid size={{xs:12, sm:4}}>
                        <TextField name="marca" label="Marca (Ex: Ninho)" value={formData.marca} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                        <FormControl fullWidth required>
                            <InputLabel id="unidade-medida-label">Unidade de Medida</InputLabel>
                            <Select name="unidade_medida" labelId="unidade-medida-label" value={formData.unidade_medida} label="Unidade de Medida" onChange={handleChange}>
                                <MenuItem value="un">Unidade</MenuItem>
                                <MenuItem value="kg">Quilograma (kg)</MenuItem>
                                <MenuItem value="g">Grama (g)</MenuItem>
                                <MenuItem value="L">Litro (L)</MenuItem>
                                <MenuItem value="ml">Mililitro (ml)</MenuItem>
                                <MenuItem value="pacote">Pacote</MenuItem>
                                <MenuItem value="caixa">Caixa</MenuItem>
                                <MenuItem value="lata">Lata</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                        <TextField name="tamanho" label="Tamanho/Volume (Ex: 0.4 para 400g)" type="number" value={formData.tamanho} onChange={handleChange} fullWidth />
                    </Grid>
                     <Grid size={{xs:12, sm:6}}>
                        <FormControl fullWidth required>
                            <InputLabel id="departamento-label">Departamento</InputLabel>
                            <Select name="departamento" labelId="departamento-label" value={formData.departamento} label="Departamento" onChange={handleChange}>
                                {departamentos.map(d => (
                                    <MenuItem key={d.id} value={d.id}>{d.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{xs:12, sm:6}} >
                        <TextField name="quantidade_minima" label="Quantidade Mínima de Alerta" type="number" value={formData.quantidade_minima} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid size={{xs:12}}>
                        <TextField name="descricao_adicional" label="Descrição Adicional (Ex: 'Tamanho G')" multiline rows={3} value={formData.descricao_adicional} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <Button type="submit" variant="contained" sx={{ mt: 3 }}>Cadastrar Produto</Button>
            </Box>
        </Paper>
    );
};

export default CadastrarProdutoPage;