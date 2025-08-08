import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios'; // <-- Importe os tipos aqui

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

apiClient.interceptors.request.use(
  // Adicione o tipo para o parâmetro 'config'
  (config: InternalAxiosRequestConfig) => { 
    const tokenString = localStorage.getItem('authTokens');
    if (tokenString) {
      const tokens = JSON.parse(tokenString);
      config.headers.Authorization = `Bearer ${tokens?.access}`;
    }
    return config;
  },
  // Adicione o tipo para o parâmetro 'error'
  (error: AxiosError) => { 
    return Promise.reject(error);
  }
);

export default apiClient;