/**
 * =================================================================
 * TIPOS DE AUTENTICAÇÃO E USUÁRIO
 * =================================================================
 */

/**
 * Define a forma dos tokens que recebemos da API do Django ao fazer login.
 */
export interface AuthTokens {
  access: string;
  refresh: string;
}

/**
 * LoginResponse é um sinônimo (alias) para AuthTokens para clareza no código.
 */
export type LoginResponse = AuthTokens;

/**
 * Define a forma completa do objeto de usuário, como decodificado do token JWT.
 * O backend Django foi customizado para incluir estes campos no token.
 */
export interface Usuario {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  groups: string[]; // Ex: ["ROLE_CONTROLADOR"]
}

/**
 * Define a forma de um Grupo (Cargo), usado na tela de gerenciamento de usuários.
 */
export interface Grupo {
  id: number;
  name: string; // Ex: "Controlador", "Registrador"
}


/**
 * =================================================================
 * TIPOS DAS ENTIDADES PRINCIPAIS DO SISTEMA
 * =================================================================
 */

/**
 * Representa um Departamento (Dispensa, Farmácia, etc.).
 */
export interface Departamento {
  id: number;
  nome: string;
}

/**
 * Representa a "ficha técnica" de um Produto no catálogo do sistema.
 * Note que campos numéricos como DecimalField do Django chegam como string no JSON.
 */
export interface Produto {
  id: number;
  nome: string;
  marca: string | null;
  unidade_medida: string;
  tamanho: string | null; // Vem como string da API (DecimalField)
  departamento: number; // ID do departamento
  descricao_adicional: string | null;
  codigo_barras: string | null;
  quantidade_em_estoque: string; // Vem como string da API (DecimalField)
  quantidade_minima: string; // Vem como string da API (DecimalField)
  display_name: string; // Nome completo para exibição
}

/**
 * Representa uma Criança acolhida no abrigo.
 * Datas vêm como string no formato "AAAA-MM-DD".
 */
export interface Crianca {
  id: number;
  nome_completo: string;
  data_nascimento: string;
  idade: number;
  status_acolhimento: boolean;
  data_entrada: string;
  data_saida: string | null;
}

/**
 * Representa uma Movimentação de estoque (entrada ou saída).
 */
export interface Movimentacao {
  id: number;
  produto: number; // ID do produto
  produto_nome: string;
  quantidade: string; // Vem como string da API (DecimalField)
  tipo: 'entrada' | 'saida';
  data_validade?: string | null;
  preco_unitario_doacao?: string | null; // Vem como string da API (DecimalField)
  status: 'pendente' | 'aprovada' | 'recusada';
  registrado_por_nome: string;
  data_movimentacao: string; // Data e hora vêm como string (ISO 8601)
}

export interface Notificacao {
  id:number
  produto_nome: string
  mensagem: string
  data_criacao: string
  lida: boolean
}

/**
 * Define a forma dos dados para o Dashboard.
 */
export interface Indicadores {
  total_criancas_ativas: number;
  produtos_em_alerta: number;
  distribuicao_idade: {
    '0-6': number;
    '7-12': number;
    '13+': number;
  };
}