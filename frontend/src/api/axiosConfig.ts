// frontend/src/api/axiosConfig.ts

import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { AuthTokens } from '../types';

const baseURL = 'http://127.0.0.1:8000/api/';

const apiClient = axios.create({
  baseURL,
});

// Interceptor para adicionar o token de acesso a cada requisição
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenString = localStorage.getItem('authTokens');
    if (tokenString) {
      const tokens: AuthTokens = JSON.parse(tokenString);
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com respostas de erro (ex: token expirado)
apiClient.interceptors.response.use(
  (response) => response, // Se a resposta for sucesso, apenas a retorna
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Verifica se o erro é 401 (Não Autorizado) e se não é uma tentativa de repetição
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição para não tentar repetir infinitamente

      const tokenString = localStorage.getItem('authTokens');
      if (tokenString) {
        const tokens: AuthTokens = JSON.parse(tokenString);
        const refreshToken = tokens.refresh;

        try {
          // Tenta obter um novo token de acesso usando o refresh token
          const response = await axios.post<{ access: string }>(`${baseURL}token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          const newTokens: AuthTokens = { ...tokens, access: newAccessToken };

          // Atualiza o localStorage com o novo token
          localStorage.setItem('authTokens', JSON.stringify(newTokens));

          // Atualiza o cabeçalho da requisição original com o novo token
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Tenta novamente a requisição original que falhou
          return apiClient(originalRequest);

        } catch (refreshError) {
          console.error("Refresh token inválido ou expirado.", refreshError);
          // Se o refresh falhar, limpa tudo e redireciona para o login
          localStorage.removeItem('authTokens');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    // Para todos os outros erros, apenas rejeita a promise
    return Promise.reject(error);
  }
);


export default apiClient;