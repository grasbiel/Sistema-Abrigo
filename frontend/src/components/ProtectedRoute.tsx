// frontend/src/components/ProtectedRoute.tsx

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  // Pega o estado do usuário do nosso contexto de autenticação
  const authContext = useContext(AuthContext);

  // Se o contexto não estiver disponível (o que não deve acontecer dentro do AuthProvider),
  // ou se não houver um usuário logado, redireciona para a página de login.
  if (!authContext || !authContext.user) {
    // O atributo 'replace' impede que o usuário volte para a página anterior (protegida) usando o botão "Voltar" do navegador.
    return <Navigate to="/login" replace />;
  }

  // Se o usuário estiver logado, o <Outlet /> funciona como um espaço reservado
  // onde o React Router irá renderizar a página filha solicitada (ex: /dashboard).
  return <Outlet />;
};

export default ProtectedRoute;