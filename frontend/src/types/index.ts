// Define a forma do payload do nosso token JWT
export interface User {
  user_id: number;
  username: string;
}

// Define a forma dos tokens que recebemos da API
export interface AuthTokens {
  access: string;
  refresh: string;
}

// Define a forma dos dados para o nosso Dashboard
export interface Indicadores {
  total_criancas_ativas: number;
  produtos_em_alerta: number;
  distribuicao_idade: {
    '0-6': number;
    '7-12': number;
    '13+': number;
  };
}

// Define a forma de um objeto Produto
export interface Produto {
  id: number;
  nome: string;
  departamento: number;
  data_validade: string | null;
  quantidade_em_estoque: number;
  quantidade_minima: number;
}