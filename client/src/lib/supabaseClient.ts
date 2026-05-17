/**
 * Cliente Supabase para integração com banco de dados
 * Configuração para carrinho persistente e avaliações
 * 
 * Variáveis de ambiente necessárias:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */

// Simulação de cliente Supabase (use a biblioteca real em produção)
// import { createClient } from '@supabase/supabase-js';

export interface CarrinhoSupabase {
  id: string;
  usuario_id: string;
  itens: {
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
  }[];
  total: number;
  atualizado_em: string;
}

export interface AvaliacaoSupabase {
  id: string;
  produto_id: string;
  usuario_id: string;
  usuario_nome: string;
  estrelas: number;
  comentario: string;
  data_criacao: string;
  util_count: number;
}

/**
 * Simulação de cliente Supabase
 * Em produção, substituir por:
 * const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
 */

class SupabaseClientMock {
  private carrinhos: Map<string, CarrinhoSupabase> = new Map();
  private avaliacoes: Map<string, AvaliacaoSupabase> = new Map();

  // Carrinho
  async getCarrinho(usuarioId: string): Promise<CarrinhoSupabase | null> {
    return this.carrinhos.get(usuarioId) || null;
  }

  async salvarCarrinho(carrinho: CarrinhoSupabase): Promise<CarrinhoSupabase> {
    this.carrinhos.set(carrinho.usuario_id, carrinho);
    return carrinho;
  }

  async limparCarrinho(usuarioId: string): Promise<void> {
    this.carrinhos.delete(usuarioId);
  }

  // Avaliações
  async getAvaliacoesProduto(produtoId: string): Promise<AvaliacaoSupabase[]> {
    return Array.from(this.avaliacoes.values()).filter((a) => a.produto_id === produtoId);
  }

  async adicionarAvaliacao(avaliacao: Omit<AvaliacaoSupabase, 'id'>): Promise<AvaliacaoSupabase> {
    const id = `avaliacao_${Date.now()}`;
    const novaAvaliacao: AvaliacaoSupabase = { ...avaliacao, id };
    this.avaliacoes.set(id, novaAvaliacao);
    return novaAvaliacao;
  }

  async atualizarUtilCount(avaliacaoId: string): Promise<void> {
    const avaliacao = this.avaliacoes.get(avaliacaoId);
    if (avaliacao) {
      avaliacao.util_count += 1;
    }
  }
}

export const supabaseClient = new SupabaseClientMock();

/**
 * Função para calcular média de estrelas
 */
export function calcularMediaEstrelas(avaliacoes: AvaliacaoSupabase[]): number {
  if (avaliacoes.length === 0) return 0;
  const soma = avaliacoes.reduce((acc, a) => acc + a.estrelas, 0);
  return Math.round((soma / avaliacoes.length) * 10) / 10;
}

/**
 * Função para ordenar avaliações por útil
 */
export function ordenarAvaliacoesPorUtil(avaliacoes: AvaliacaoSupabase[]): AvaliacaoSupabase[] {
  return [...avaliacoes].sort((a, b) => (b.util_count || 0) - (a.util_count || 0));
}
