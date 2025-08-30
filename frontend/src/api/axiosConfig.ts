import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens } from '../types';

const baseURL = 'http://127.0.0.1:8000/api/';

const apiClient = axios.create({
  baseURL,
});

// Interceptor para ADICIONAR o token de acesso a cada requisição
apiClient.interceptors.request.use(
  (config) => {
    const tokenString = localStorage.getItem('authTokens');
    if (tokenString) {
      const tokens: AuthTokens = JSON.parse(tokenString);
      
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // O Django retorna 401 para token expirado
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const tokenString = localStorage.getItem('authTokens');
      if (tokenString) {
        const tokens: AuthTokens = JSON.parse(tokenString);
        
        try {
          // CORREÇÃO: Usa a URL de refresh do Django e envia o refresh token
          const response = await axios.post<{ access: string }>(`${baseURL}token/refresh/`, {
            refresh: tokens.refresh,
          });

          const newAccessToken = response.data.access;
          const newTokens: AuthTokens = { ...tokens, access: newAccessToken };
          localStorage.setItem('authTokens', JSON.stringify(newTokens));

          // Atualiza o cabeçalho da requisição original com o novo token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Tenta novamente a requisição original que tinha falhado
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Se o refresh token também falhar, desloga o usuário
          localStorage.removeItem('authTokens');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 