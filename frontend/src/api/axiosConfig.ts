import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { LoginResponse } from '../types';

const baseURL = 'http://127.0.0.1:8000/api/';

const apiClient = axios.create({
  baseURL,
});


apiClient.interceptors.request.use(
  (config) => {
    const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh');
    if (!isAuthRoute) {
      const tokenString = localStorage.getItem('authTokens');
      if (tokenString) {
        const tokens: LoginResponse = JSON.parse(tokenString);
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptor para LIDAR com respostas de erro (ex: token expirado)
apiClient.interceptors.response.use(
  (response) => response, // Se a resposta for de sucesso, não faz nada
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 0) {
        // Isso é um erro de rede, geralmente acontece quando o backend está offline.
        return Promise.reject(new Error("Erro de rede. Verifique a conexão com o backend."));
    }
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const tokenString = localStorage.getItem('authTokens');
      if (tokenString) {
        const tokens: LoginResponse = JSON.parse(tokenString);
        
        try {
          const response = await axios.post<LoginResponse>(`${baseURL}auth/refresh`, {
            refreshToken: tokens.refreshToken,
          });

          const newTokens = response.data;
          localStorage.setItem('authTokens', JSON.stringify(newTokens));

          originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
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