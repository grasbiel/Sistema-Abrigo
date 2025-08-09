// frontend/src/pages/Dashboard.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Grid, Typography, CircularProgress, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ChildCareIcon from '@mui/icons-material/ChildCare';

import apiClient from '../api/axiosConfig';
import { Indicadores } from '../types';
import AuthContext from '../context/AuthContext';
import { AxiosError } from 'axios';

const Dashboard: React.FC = () => {
    const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useContext(AuthContext)!;

    useEffect(() => {
        apiClient.get<Indicadores>('/indicadores/')
            .then(response => setIndicadores(response.data))
            .catch((error: AxiosError) => console.error("Erro ao buscar indicadores:", error.response?.data || error.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="50vh"><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard Principal
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Bem-vindo(a), <strong>{user?.username}</strong>!
            </Typography>
            
            <Grid container spacing={3} mt={2}>
                <Grid size={{xs:12, sm:6, md:4}}>
                    <Card>
                        <CardContent>
                            <PeopleIcon color="primary" sx={{ fontSize: 40, float: 'right' }}/>
                            <Typography color="text.secondary" gutterBottom>Crianças Ativas</Typography>
                            <Typography variant="h4">{indicadores?.total_criancas_ativas || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs:12, sm:6, md:4}}>
                    <Card>
                        <CardContent>
                            <WarningAmberIcon color="error" sx={{ fontSize: 40, float: 'right' }}/>
                            <Typography color="text.secondary" gutterBottom>Produtos em Alerta</Typography>
                            <Typography variant="h4">{indicadores?.produtos_em_alerta || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs:12, sm:6, md:4}}>
                    <Card>
                        <CardContent>
                            <ChildCareIcon color="success" sx={{ fontSize: 40, float: 'right' }}/>
                            <Typography color="text.secondary" gutterBottom>Faixas Etárias</Typography>
                            <Typography variant="body2">
                                0-6 anos: {indicadores?.distribuicao_idade['0-6'] || 0}<br/>
                                7-12 anos: {indicadores?.distribuicao_idade['7-12'] || 0}<br/>
                                13+ anos: {indicadores?.distribuicao_idade['13+'] || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;