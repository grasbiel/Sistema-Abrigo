import React, { createContext, useState, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Usuario, AuthTokens } from '../types';

interface AuthContextType {
  user: Usuario | null;
  authTokens: AuthTokens | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')!) : null
    );
    
    const [user, setUser] = useState<Usuario | null>(() => {
        const tokenString = localStorage.getItem('authTokens');
        if (tokenString) {
            try {
                const tokens: AuthTokens = JSON.parse(tokenString);
                return jwtDecode(tokens.access);
            } catch (error) {
                return null;
            }
        }
        return null;
    });

    const navigate = useNavigate();

    const loginUser = async (username: string, password: string) => {
        try {
            // --- CORREÇÃO DA URL AQUI ---
            // A rota de login do Django com simple-jwt é /token/
            const response = await apiClient.post<AuthTokens>('/token/', { username, password });
            
            if (response.status === 200) {
                const data = response.data;
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Erro no login!", error);
            alert("Usuário ou senha inválidos!");
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    const contextData: AuthContextType = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};