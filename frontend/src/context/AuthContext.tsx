import React, { createContext, useState, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { User, AuthTokens } from '../types'; // Importando nossos tipos

// Definindo o tipo para o valor do nosso contexto
interface AuthContextType {
  user: User | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')!) : null
    );
    const [user, setUser] = useState<User | null>(() => 
        localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')!).access) : null
    );
    const navigate = useNavigate();

    const loginUser = async (username: string, password: string) => {
        try {
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
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};