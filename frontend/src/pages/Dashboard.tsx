import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import { Indicadores } from '../types';

const Dashboard: React.FC = () => {
    const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
    const { logoutUser, user } = useContext(AuthContext)!;

    useEffect(() => {
        apiClient.get<Indicadores>('/indicadores/')
            .then(response => {
                setIndicadores(response.data);
            })
            .catch(error => console.error("Erro ao buscar indicadores:", error));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo, {user?.username}!</p>
            <nav>
                <Link to="/estoque">Ver Estoque</Link>
            </nav>
            <button onClick={logoutUser}>Sair</button>
            <hr />
            {indicadores ? (
                <div>
                    <h3>Indicadores do Abrigo</h3>
                    <p><strong>Crianças Ativas:</strong> {indicadores.total_criancas_ativas}</p>
                    <p><strong>Produtos em Alerta de Estoque:</strong> {indicadores.produtos_em_alerta}</p>
                </div>
            ) : (
                <p>Carregando indicadores...</p>
            )}
        </div>
    );
};

export default Dashboard;