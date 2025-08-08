import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Supondo que você criou esses arquivos ou os renomeou para .tsx
import ProtectedRoute from './components/ProtectedRoute'; 
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EstoquePage from './pages/EstoquePage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/estoque" element={<EstoquePage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;