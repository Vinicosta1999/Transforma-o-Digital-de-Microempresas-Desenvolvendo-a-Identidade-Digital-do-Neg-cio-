import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Produto } from '@/types';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { toast } from 'sonner';

interface ProdutoCardProps {
  produto: Produto;
  onDetalhes?: (produto: Produto) => void;
}

export default function ProdutoCard({ produto, onDetalhes }: ProdutoCardProps) {
  const { adicionarItem } = useCarrinho();
  const [favorito, setFavorito] = useState(false);
  const [adicionando, setAdicionando] = useState(false);

  const handleAdicionarAoCarrinho = async () => {
    setAdicionando(true);
    try {
      adicionarItem(produto, 1);
      toast.success(`${produto.nome} adicionado ao carrinho!`);
    } catch (erro) {
      toast.error('Erro ao adicionar ao carrinho');
    } finally {
      setAdicionando(false);
    }
  };

  const handleToggleFavorito = () => {
    setFavorito(!favorito);
    toast.success(favorito ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const desconto = Math.floor(Math.random() * 30); // Simulação de desconto

  return (
    <div className="product-card group">
      {/* Imagem */}
      <div className="product-image relative overflow-hidden">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badge de Desconto */}
        {desconto > 0 && (
          <div className="absolute top-3 left-3 badge badge-sale">
            -{desconto}%
          </div>
        )}

        {/* Botão Favorito */}
        <button
          onClick={handleToggleFavorito}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-accent transition"
          title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={`w-5 h-5 ${favorito ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
          />
        </button>

        {/* Overlay com botão */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAdicionarAoCarrinho}
            disabled={adicionando || produto.estoque === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            {adicionando ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>

      {/* Informações */}
      <div className="product-info">
        <h3 className="font-bold text-lg mb-1 line-clamp-2 hover:text-primary transition cursor-pointer">
          {produto.nome}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {produto.descricao}
        </p>

        {/* Preço */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="product-price">R$ {produto.preco.toFixed(2)}</span>
          {desconto > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {(produto.preco / (1 - desconto / 100)).toFixed(2)}
            </span>
          )}
        </div>

        {/* Status de Estoque */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold ${
              produto.estoque > 0 ? 'text-green-400' : 'text-destructive'
            }`}
          >
            {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Fora de estoque'}
          </span>
          {onDetalhes && (
            <button
              onClick={() => onDetalhes(produto)}
              className="text-primary text-xs font-semibold hover:underline"
            >
              Detalhes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
