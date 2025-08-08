import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Produto } from '../types';

const EstoquePage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get<Produto[]>('/produtos/')
            .then(response => {
                setProdutos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar produtos:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Carregando produtos...</p>;

    return (
        <div>
            <h1>Estoque de Produtos</h1>
            <Link to="/dashboard">Voltar para o Dashboard</Link>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Em Estoque</th>
                        <th>Estoque Mínimo</th>
                        <th>Validade</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map(produto => (
                        <tr key={produto.id}>
                            <td>{produto.nome}</td>
                            <td>{produto.quantidade_em_estoque}</td>
                            <td>{produto.quantidade_minima}</td>
                            <td>{produto.data_validade || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EstoquePage;