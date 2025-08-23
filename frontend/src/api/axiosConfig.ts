// frontend/src/api/axiosConfig.ts

import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { AuthTokens } from '../types';

const baseURL = 'http://127.0.0.1:8000/api/';

const apiClient = axios.create({
  baseURL,
});

<<<<<<< HEAD

apiClient.interceptors.request.use(
  (config) => {
    const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh');
    if (!isAuthRoute) {
      const tokenString = localStorage.getItem('authTokens');
      if (tokenString) {
        const tokens: LoginResponse = JSON.parse(tokenString);
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
=======
// Interceptor para adicionar o token de acesso a cada requisição
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenString = localStorage.getItem('authTokens');
    if (tokenString) {
      const tokens: AuthTokens = JSON.parse(tokenString);
      config.headers.Authorization = `Bearer ${tokens.access}`;
>>>>>>> parent of 2afa89a (Mudando o backend de django para spring boot)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

<<<<<<< HEAD

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
      
=======
// Interceptor para lidar com respostas de erro (ex: token expirado)
apiClient.interceptors.response.use(
  (response) => response, // Se a resposta for sucesso, apenas a retorna
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Verifica se o erro é 401 (Não Autorizado) e se não é uma tentativa de repetição
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição para não tentar repetir infinitamente

>>>>>>> parent of 2afa89a (Mudando o backend de django para spring boot)
      const tokenString = localStorage.getItem('authTokens');
      if (tokenString) {
        const tokens: AuthTokens = JSON.parse(tokenString);
        const refreshToken = tokens.refresh;

        try {
<<<<<<< HEAD
          const response = await axios.post<LoginResponse>(`${baseURL}auth/refresh`, {
            refreshToken: tokens.refreshToken,
=======
          // Tenta obter um novo token de acesso usando o refresh token
          const response = await axios.post<{ access: string }>(`${baseURL}token/refresh/`, {
            refresh: refreshToken,
>>>>>>> parent of 2afa89a (Mudando o backend de django para spring boot)
          });

          const newAccessToken = response.data.access;
          const newTokens: AuthTokens = { ...tokens, access: newAccessToken };

          // Atualiza o localStorage com o novo token
          localStorage.setItem('authTokens', JSON.stringify(newTokens));

<<<<<<< HEAD
          originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
=======
          // Atualiza o cabeçalho da requisição original com o novo token
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Tenta novamente a requisição original que falhou
>>>>>>> parent of 2afa89a (Mudando o backend de django para spring boot)
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