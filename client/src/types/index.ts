/**
 * Tipos principais da plataforma Case Point E-commerce
 * Design: Premium Tech Store - Fundo escuro com destaque para produtos
 */

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: 'cabos' | 'carregadores' | 'peliculas' | 'outros';
  estoque: number;
  peso: number; // em gramas
  dimensoes: {
    comprimento: number;
    largura: number;
    altura: number;
  };
  criado_em: string;
}

export interface ItemCarrinho {
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
}

export interface Carrinho {
  itens: ItemCarrinho[];
  subtotal: number;
  desconto: number;
  total: number;
  cupom_codigo?: string;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  criado_em: string;
}

export interface Pedido {
  id: string;
  usuario_id: string;
  itens: ItemCarrinho[];
  subtotal: number;
  desconto: number;
  total: number;
  cupom_codigo?: string;
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  endereco_entrega: Usuario['endereco'];
  frete_info?: {
    transportadora: string;
    codigo_rastreamento: string;
    valor: number;
    prazo_dias: number;
  };
  criado_em: string;
  atualizado_em: string;
}

export interface FiltrosProdutos {
  categoria?: string;
  preco_min?: number;
  preco_max?: number;
  busca?: string;
  ordenacao?: 'preco_asc' | 'preco_desc' | 'nome_asc' | 'nome_desc' | 'novo';
}

export interface OpcaoFrete {
  id: string;
  nome: string;
  preco: number;
  prazo: number;
  descricao: string;
  codigo: string | number;
  empresa?: string;
}

export interface CalculoFreteAPI {
  opcoes: OpcaoFrete[];
  peso_total: number;
  dimensoes: {
    comprimento: number;
    largura: number;
    altura: number;
  };
  cep_origem: string;
  cep_destino: string;
}

export interface CalculoFrete {
  cep_origem: string;
  cep_destino: string;
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  valor: number;
  prazo_dias: number;
  transportadora: string;
}

export interface Avaliacao {
  id: string;
  produto_id: string;
  usuario_id: string;
  usuario_nome: string;
  estrelas: number; // 1-5
  comentario: string;
  data_criacao: string;
  util_count: number; // quantas pessoas acharam útil
}

export interface ProdutoComAvaliacao extends Produto {
  avaliacoes?: Avaliacao[];
  media_estrelas?: number;
  total_avaliacoes?: number;
}
