/**
 * Configuração do Supabase
 * Cliente para autenticação e acesso ao banco de dados
 * 
 * Variáveis de ambiente necessárias:
 * VITE_SUPABASE_URL=https://seu-projeto.supabase.co
 * VITE_SUPABASE_ANON_KEY=sua-chave-anonima
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validar variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Variáveis de ambiente do Supabase não configuradas. Usando modo offline (localStorage).'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Verifica se Supabase está disponível
 */
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

/**
 * Tipos de dados do Supabase
 */
export interface ProdutoSupabase {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem_url: string;
  estoque: number;
  criado_em: string;
}

export interface PedidoSupabase {
  id: string;
  usuario_id: string;
  total: number;
  status: string;
  endereco: string;
  cidade: string;
  cep: string;
  criado_em: string;
  atualizado_em: string;
}

export interface CupomSupabase {
  id: string;
  codigo: string;
  desconto_percentual: number;
  desconto_fixo: number;
  limite_uso: number;
  uso_atual: number;
  ativo: boolean;
  data_inicio: string;
  data_fim: string;
  criado_em: string;
}

export interface UsuarioSupabase {
  id: string;
  email: string;
  nome: string;
  telefone: string;
  criado_em: string;
}

/**
 * Funções de autenticação
 */
export async function registrarUsuario(email: string, senha: string, nome: string) {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome },
    },
  });

  if (error) throw error;
  return data;
}

export async function fazerLogin(email: string, senha: string) {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) throw error;
  return data;
}

export async function fazerLogout() {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function obterUsuarioAtual() {
  if (!supabase) {
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Funções de produtos
 */
export async function obterProdutos(): Promise<ProdutoSupabase[]> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function obterProdutoPorId(id: string): Promise<ProdutoSupabase | null> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

/**
 * Funções de pedidos
 */
export async function criarPedido(pedido: Omit<PedidoSupabase, 'id' | 'criado_em' | 'atualizado_em'>) {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data, error } = await supabase
    .from('pedidos')
    .insert([pedido])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function obterPedidosUsuario(usuario_id: string): Promise<PedidoSupabase[]> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('usuario_id', usuario_id)
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Funções de cupons
 */
export async function validarCupom(codigo: string): Promise<CupomSupabase | null> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data, error } = await supabase
    .from('cupons')
    .select('*')
    .eq('codigo', codigo.toUpperCase())
    .eq('ativo', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) return null;

  // Verificar se cupom ainda é válido
  const agora = new Date();
  const dataInicio = new Date(data.data_inicio);
  const dataFim = new Date(data.data_fim);

  if (agora < dataInicio || agora > dataFim) {
    return null;
  }

  // Verificar limite de uso
  if (data.uso_atual >= data.limite_uso) {
    return null;
  }

  return data;
}

export async function usarCupom(cupom_id: string) {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data: cupom, error: erroLeitura } = await supabase
    .from('cupons')
    .select('uso_atual')
    .eq('id', cupom_id)
    .single();

  if (erroLeitura) throw erroLeitura;

  const { error: erroAtualizacao } = await supabase
    .from('cupons')
    .update({ uso_atual: (cupom?.uso_atual || 0) + 1 })
    .eq('id', cupom_id);

  if (erroAtualizacao) throw erroAtualizacao;
}

/**
 * Funções de carrinho
 */
export async function salvarCarrinho(usuario_id: string, itens: any[]) {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { error } = await supabase
    .from('carrinhos')
    .upsert({
      usuario_id,
      itens,
      atualizado_em: new Date().toISOString(),
    });

  if (error) throw error;
}

export async function obterCarrinho(usuario_id: string) {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }

  const { data, error } = await supabase
    .from('carrinhos')
    .select('itens')
    .eq('usuario_id', usuario_id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.itens || [];
}
