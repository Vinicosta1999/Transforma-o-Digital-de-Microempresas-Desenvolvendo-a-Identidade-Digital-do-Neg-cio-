import React, { createContext, useContext, useState, useEffect } from 'react';
import { Carrinho, ItemCarrinho, Produto } from '@/types';
import { supabaseClient } from '@/lib/supabaseClient';
import { obterCupomAplicado } from '@/lib/cupomService';

interface CarrinhoContextType {
  carrinho: Carrinho;
  adicionarItem: (produto: Produto, quantidade: number) => void;
  removerItem: (produto_id: string) => void;
  atualizarQuantidade: (produto_id: string, quantidade: number) => void;
  limparCarrinho: () => void;
  aplicarDesconto: (desconto: number, cupom_codigo?: string) => void;
  totalItens: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, setCarrinho] = useState<Carrinho>({ 
    itens: [], 
    subtotal: 0, 
    desconto: 0, 
    total: 0 
  });
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  // Obter usuário do localStorage
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario_case_point');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      setUsuarioId(usuario.id);
    }
  }, []);

  // Carregar carrinho do localStorage e Supabase
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho_case_point');
    const cupomAplicado = obterCupomAplicado();
    
    if (carrinhoSalvo) {
      const parsed = JSON.parse(carrinhoSalvo);
      const subtotal = parsed.itens.reduce((acc: number, item: any) => acc + item.preco_unitario * item.quantidade, 0);
      const desconto = cupomAplicado ? cupomAplicado.desconto_valor : 0;
      
      setCarrinho({
        ...parsed,
        subtotal,
        desconto,
        total: subtotal - desconto,
        cupom_codigo: cupomAplicado?.codigo
      });
    }

    // Se usuário está logado, tentar carregar do Supabase
    if (usuarioId && supabaseClient && typeof supabaseClient.getCarrinho === 'function') {
      supabaseClient.getCarrinho(usuarioId).then((carrinhoSupabase) => {
        if (carrinhoSupabase) {
          const subtotal = carrinhoSupabase.itens.reduce((acc: number, item: any) => acc + item.preco_unitario * item.quantidade, 0);
          const desconto = cupomAplicado ? cupomAplicado.desconto_valor : 0;
          
          setCarrinho({
            itens: carrinhoSupabase.itens,
            subtotal,
            desconto,
            total: subtotal - desconto,
            cupom_codigo: cupomAplicado?.codigo
          });
        }
      }).catch((error) => {
        console.warn('Erro ao carregar carrinho do Supabase:', error);
      });
    }
  }, [usuarioId]);

  // Salvar carrinho no localStorage e Supabase
  useEffect(() => {
    localStorage.setItem('carrinho_case_point', JSON.stringify(carrinho));

    if (usuarioId && supabaseClient && typeof supabaseClient.salvarCarrinho === 'function') {
      supabaseClient.salvarCarrinho({
        id: `carrinho_${usuarioId}`,
        usuario_id: usuarioId,
        itens: carrinho.itens,
        total: carrinho.total,
        atualizado_em: new Date().toISOString(),
      }).catch((error) => {
        console.warn('Erro ao salvar carrinho no Supabase:', error);
      });
    }
  }, [carrinho, usuarioId]);

  const adicionarItem = (produto: Produto, quantidade: number) => {
    setCarrinho((prev) => {
      const itemExistente = prev.itens.find((item) => item.produto_id === produto.id);

      let novoItens: ItemCarrinho[];
      if (itemExistente) {
        novoItens = prev.itens.map((item) =>
          item.produto_id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        novoItens = [
          ...prev.itens,
          {
            produto_id: produto.id,
            quantidade,
            preco_unitario: produto.preco,
          },
        ];
      }

      const subtotal = novoItens.reduce((acc, item) => acc + item.preco_unitario * item.quantidade, 0);
      const total = subtotal - prev.desconto;

      return { ...prev, itens: novoItens, subtotal, total };
    });
  };

  const removerItem = (produto_id: string) => {
    setCarrinho((prev) => {
      const novoItens = prev.itens.filter((item) => item.produto_id !== produto_id);
      const subtotal = novoItens.reduce((acc, item) => acc + item.preco_unitario * item.quantidade, 0);
      const total = subtotal - prev.desconto;
      return { ...prev, itens: novoItens, subtotal, total };
    });
  };

  const atualizarQuantidade = (produto_id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(produto_id);
      return;
    }

    setCarrinho((prev) => {
      const novoItens = prev.itens.map((item) =>
        item.produto_id === produto_id ? { ...item, quantidade } : item
      );
      const subtotal = novoItens.reduce((acc, item) => acc + item.preco_unitario * item.quantidade, 0);
      const total = subtotal - prev.desconto;
      return { ...prev, itens: novoItens, subtotal, total };
    });
  };

  const aplicarDesconto = (desconto: number, cupom_codigo?: string) => {
    setCarrinho((prev) => ({
      ...prev,
      desconto,
      cupom_codigo,
      total: prev.subtotal - desconto
    }));
  };

  const limparCarrinho = () => {
    setCarrinho({ itens: [], subtotal: 0, desconto: 0, total: 0 });
    localStorage.removeItem('carrinho_case_point');
    if (usuarioId && supabaseClient && typeof supabaseClient.limparCarrinho === 'function') {
      supabaseClient.limparCarrinho(usuarioId).catch((error) => {
        console.warn('Erro ao limpar carrinho no Supabase:', error);
      });
    }
  };

  const totalItens = carrinho.itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        aplicarDesconto,
        totalItens,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
}
