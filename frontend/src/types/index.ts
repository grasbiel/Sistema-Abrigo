// Define a forma do payload do nosso token JWT
export interface User {
  user_id: number;
  username: string;
  groups: string[];
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
//Define a forma de um objeto departamento
export interface Departamento {
    id: number;
    nome: string;
}

// Define a forma de um objeto Produto
export interface Produto {
  id: number
  nome: string
  marca: string | null
  unidade_medida: string
  tamanho: number | null
  departamento: number
  descricao_adicional: string | null
  codigo_barras: string | null
  quantidade_em_estoque: number
  quantidade_minima: number
  display_name: string  
}
export interface Movimentacao {
  id: number
  produto: number
  produto_nome: string
  quantidade: number
  tipo: 'entrada' | 'saida'
  data_validade?: string | null
  preco_unitario_doacao?: number | null
  status: 'pendente' | 'aprovada' | 'recusada'
  registrado_por_nome: string
  data_movimentacao: string
}

export interface Crianca {
  id: number;
  nome_completo: string;
  data_nascimento: string; // Datas vem como string da API
  idade: number;
  status_acolhimento: boolean;
  data_entrada: string;
  data_saida: string | null;
}