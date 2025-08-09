// frontend/src/App.tsx

import React from 'react';

// A CORREÇÃO ESTÁ AQUI: importamos BrowserRouter e damos a ele o "apelido" de Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EstoquePage from './pages/EstoquePage';
import RegistrarMovimentacaoPage from './pages/RegistrarMovimentacaoPage';
import ValidarMovimentacaoPage from './pages/ValidarMovimentacaoPage';

function App() {
  return (
    // Usamos o <Router> (que na verdade é o BrowserRouter) para envolver toda a aplicação
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Rotas Protegidas que usam o Layout como "pai" */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/estoque" element={<EstoquePage />} />
              <Route path="/registrar-movimentacao" element={<RegistrarMovimentacaoPage />} />
              <Route path="/validar-movimentacao" element={<ValidarMovimentacaoPage />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;