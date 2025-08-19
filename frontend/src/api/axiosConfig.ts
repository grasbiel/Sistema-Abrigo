import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { LoginResponse } from '../types';

const baseURL = 'http://127.0.0.1:8000/api/';

const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    const tokenString = localStorage.getItem('authTokens');
    if (tokenString) {
      const tokens: LoginResponse = JSON.parse(tokenString);
      // Agora a propriedade 'accessToken' existe e o erro some
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const tokenString = localStorage.getItem('authTokens');
      if (tokenString) {
        const tokens: LoginResponse = JSON.parse(tokenString);
        
        try {
          const response = await axios.post<LoginResponse>(`${baseURL}auth/refresh`, {
            refreshToken: tokens.refreshToken, // Agora a propriedade 'refreshToken' existe
          });

          const newTokens = response.data;
          localStorage.setItem('authTokens', JSON.stringify(newTokens));

          originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`; // E 'accessToken' também

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