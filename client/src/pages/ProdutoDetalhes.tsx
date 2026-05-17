import { useParams, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { PRODUTOS } from '@/lib/produtos';
import { Produto, Avaliacao } from '@/types';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ChevronLeft } from 'lucide-react';
import AvaliacaoCard from '@/components/AvaliacaoCard';
import AvaliacaoForm from '@/components/AvaliacaoForm';
import { supabaseClient, calcularMediaEstrelas, ordenarAvaliacoesPorUtil } from '@/lib/supabaseClient';

export default function ProdutoDetalhes() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { adicionarItem } = useCarrinho();

  const produtoId = params.id;
  const produto = PRODUTOS.find((p) => p.id === produtoId);

  const [quantidade, setQuantidade] = useState(1);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mediaEstrelas, setMediaEstrelas] = useState(0);
  const [imagemAtual, setImagemAtual] = useState(0);
  const [produtosRelacionados, setProdutosRelacionados] = useState<Produto[]>([]);
  const [adicionadoAoCarrinho, setAdicionadoAoCarrinho] = useState(false);

  useEffect(() => {
    if (produto) {
      supabaseClient.getAvaliacoesProduto(produto.id).then((avals) => {
        const avaliacoesFormatadas: Avaliacao[] = avals.map((a) => ({
          id: a.id,
          produto_id: a.produto_id,
          usuario_id: a.usuario_id,
          usuario_nome: a.usuario_nome,
          estrelas: a.estrelas,
          comentario: a.comentario,
          data_criacao: a.data_criacao,
          util_count: a.util_count,
        }));
        setAvaliacoes(avaliacoesFormatadas);
        setMediaEstrelas(calcularMediaEstrelas(avaliacoesFormatadas));
      });

      const relacionados = PRODUTOS.filter(
        (p) => p.categoria === produto.categoria && p.id !== produto.id
      ).slice(0, 4);
      setProdutosRelacionados(relacionados);
    }
  }, [produto]);

  if (!produto) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button onClick={() => setLocation('/catalogo')}>Voltar ao Catálogo</Button>
        </div>
      </div>
    );
  }

  const galeria = [produto.imagem];
  const avaliacoesOrdenadas = ordenarAvaliacoesPorUtil(avaliacoes);

  const handleAdicionarAoCarrinho = () => {
    adicionarItem(produto, quantidade);
    setAdicionadoAoCarrinho(true);
    setTimeout(() => setAdicionadoAoCarrinho(false), 2000);
  };

  const handleAdicionarAvaliacao = async (estrelas: number, comentario: string) => {
    const usuarioSalvo = localStorage.getItem('usuario_case_point');
    if (!usuarioSalvo) {
      alert('Faça login para deixar uma avaliação');
      setLocation('/login');
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);
    const novaAvaliacao = await supabaseClient.adicionarAvaliacao({
      produto_id: produto.id,
      usuario_id: usuario.id,
      usuario_nome: usuario.nome,
      estrelas,
      comentario,
      data_criacao: new Date().toISOString(),
      util_count: 0,
    });

    const avaliacaoFormatada: Avaliacao = {
      id: novaAvaliacao.id,
      produto_id: novaAvaliacao.produto_id,
      usuario_id: novaAvaliacao.usuario_id,
      usuario_nome: novaAvaliacao.usuario_nome,
      estrelas: novaAvaliacao.estrelas,
      comentario: novaAvaliacao.comentario,
      data_criacao: novaAvaliacao.data_criacao,
      util_count: novaAvaliacao.util_count,
    };

    setAvaliacoes([...avaliacoes, avaliacaoFormatada]);
    setMediaEstrelas(calcularMediaEstrelas([...avaliacoes, avaliacaoFormatada]));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container py-4">
          <button
            onClick={() => setLocation('/catalogo')}
            className="flex items-center gap-2 text-primary hover:brightness-110 transition-all"
          >
            <ChevronLeft size={18} />
            Voltar ao Catálogo
          </button>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="bg-card rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
              <img
                src={galeria[imagemAtual]}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{produto.nome}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(mediaEstrelas)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {mediaEstrelas.toFixed(1)} ({avaliacoes.length} avaliações)
              </span>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-primary">R$ {produto.preco.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Fora de estoque'}
              </p>
            </div>

            <p className="text-foreground mb-6 leading-relaxed">{produto.descricao}</p>

            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Especificações</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peso:</span>
                  <span>{produto.peso}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensões:</span>
                  <span>
                    {produto.dimensoes.comprimento} × {produto.dimensoes.largura} × {produto.dimensoes.altura} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categoria:</span>
                  <span className="capitalize">{produto.categoria}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  className="px-3 py-2 hover:bg-secondary transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2">{quantidade}</span>
                <button
                  onClick={() => setQuantidade(quantidade + 1)}
                  className="px-3 py-2 hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAdicionarAoCarrinho}
                disabled={produto.estoque === 0}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                {adicionadoAoCarrinho ? 'Adicionado!' : 'Adicionar ao Carrinho'}
              </Button>
            </div>
          </div>
        </div>

        {produtosRelacionados.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {produtosRelacionados.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setLocation(`/produto/${p.id}`)}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={p.imagem}
                      alt={p.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{p.nome}</h3>
                    <p className="text-primary font-bold">R$ {p.preco.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-12">
          <h2 className="text-2xl font-bold mb-8">Avaliações e Comentários</h2>

          <AvaliacaoForm onSubmit={handleAdicionarAvaliacao} />

          {avaliacoesOrdenadas.length > 0 ? (
            <div className="space-y-4">
              {avaliacoesOrdenadas.map((avaliacao) => (
                <AvaliacaoCard
                  key={avaliacao.id}
                  avaliacao={avaliacao}
                  onUtilClick={(id) => supabaseClient.atualizarUtilCount(id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
