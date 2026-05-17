import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Produto } from '@/types';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { toast } from 'sonner';

interface ProdutoCardProps {
  produto: Produto;
  onDetalhes?: (produto: Produto) => void;
}

export default function ProdutoCard({ produto, onDetalhes }: ProdutoCardProps) {
  const { adicionarItem } = useCarrinho();
  const [adicionando, setAdicionando] = useState(false);

  const handleAdicionarAoCarrinho = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdicionando(true);
    try {
      adicionarItem(produto, 1);
      toast.success(`${produto.nome} adicionado ao carrinho!`, {
        duration: 2000,
      });
    } catch (erro) {
      toast.error('Erro ao adicionar ao carrinho');
    } finally {
      setTimeout(() => setAdicionando(false), 500);
    }
  };

  const percentualDesconto = produto.preco_original 
    ? Math.round(((produto.preco_original - produto.preco) / produto.preco_original) * 100)
    : 0;

  return (
    <div 
      className="group bg-[#1e293b] rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg cursor-pointer flex flex-col h-full"
      onClick={() => onDetalhes?.(produto)}
    >
      {/* Imagem com Botão Adicionar */}
      <div className="relative aspect-square bg-white p-4 overflow-hidden flex-shrink-0">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge de Desconto */}
        {percentualDesconto > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg shadow-lg z-10">
            {percentualDesconto}% OFF
          </div>
        )}

        {/* Botão Adicionar - Visível no hover em desktop, sempre visível ou acessível em mobile */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 sm:bg-black/0 sm:group-hover:bg-black/10 transition-all duration-300">
          <button
            onClick={handleAdicionarAoCarrinho}
            disabled={adicionando || produto.estoque === 0}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold flex items-center gap-2 shadow-2xl transform sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">{adicionando ? '...' : 'Adicionar'}</span>
          </button>
        </div>
      </div>

      {/* Informações */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-bold text-slate-100 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {produto.nome}
          </h3>
          <p className="text-slate-400 text-[10px] sm:text-xs line-clamp-2 h-7 sm:h-8 leading-relaxed">
            {produto.descricao}
          </p>
        </div>

        <div className="pt-2">
          {/* Preço */}
          <div className="flex items-baseline flex-wrap gap-1 sm:gap-2">
            <span className="text-lg sm:text-xl font-bold text-amber-500">
              R$ {produto.preco.toFixed(2)}
            </span>
            {produto.preco_original && (
              <span className="text-[10px] sm:text-xs text-slate-500 line-through">
                R$ {produto.preco_original.toFixed(2)}
              </span>
            )}
          </div>

          {/* Estoque */}
          <div className="pt-1">
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
              produto.estoque > 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}>
              {produto.estoque > 0 ? 'Em Estoque' : 'Esgotado'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
