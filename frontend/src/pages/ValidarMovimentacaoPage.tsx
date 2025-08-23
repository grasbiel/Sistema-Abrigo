import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Movimentacao } from '../types';

const ValidarMovimentacaoPage: React.FC = () => {
    const [pendentes, setPendentes] = useState<Movimentacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchPendentes = () => {
        setLoading(true);
        apiClient.get<Movimentacao[]>('/movimentacoes/?status=pendente')
            .then(res => {
                setPendentes(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchPendentes();
    }, []);

    const handleAprovar = async (id: number) => {
        setMessage('');
        try {
            await apiClient.post(`/movimentacoes/${id}/validar/`);
            setMessage('Movimentação aprovada com sucesso!');
            fetchPendentes(); // Re-busca a lista para remover o item aprovado
        } catch (err) {
            setMessage('Erro ao aprovar a movimentação.');
        }
    };

    if (loading) return <p>Carregando movimentações pendentes...</p>;

    return (
        <div>
            <h1>Validar Movimentações Pendentes</h1>
            <Link to="/dashboard">Voltar para o Dashboard</Link>

            {message && <p>{message}</p>}

            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Tipo</th>
                        <th>Qtd</th>
                        <th>Registrado por</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pendentes.length > 0 ? pendentes.map(mov => (
                        <tr key={mov.id}>
                            <td>{mov.produto_nome}</td>
                            <td>{mov.tipo}</td>
                            <td>{mov.quantidade}</td>
                            <td>{mov.registrado_por_nome}</td>
                            <td>
                                <button onClick={() => handleAprovar(mov.id)}>Aprovar</button>
                                {/* Botão de recusar pode ser implementado no futuro */}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5}>Nenhuma movimentação pendente.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ValidarMovimentacaoPage;