import { Link } from 'wouter';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { PRODUTOS } from '@/lib/produtos';

export default function Carrinho() {
  const { carrinho, removerItem, atualizarQuantidade } = useCarrinho();

  if (carrinho.itens.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Seu Carrinho está Vazio</h1>
            <p className="text-muted-foreground mb-8">
              Explore nosso catálogo e adicione alguns produtos
            </p>
            <Link href="/catalogo">
              <div className="btn-primary inline-flex items-center gap-2 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Continuar Comprando
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <Link href="/catalogo">
          <div className="flex items-center gap-2 text-primary hover:underline mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Continuar Comprando
          </div>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Itens do Carrinho */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>

            <div className="space-y-4">
              {carrinho.itens.map((item) => {
                const produto = PRODUTOS.find((p) => p.id === item.produto_id);
                if (!produto) return null;

                return (
                  <div key={item.produto_id} className="bg-card p-4 rounded-lg flex gap-4">
                    {/* Imagem */}
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="w-24 h-24 object-cover rounded-lg bg-white"
                    />

                    {/* Informações */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{produto.nome}</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {produto.descricao}
                      </p>
                      <p className="font-mono font-bold text-accent">
                        R$ {item.preco_unitario.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantidade e Ações */}
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => removerItem(item.produto_id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"
                        title="Remover do carrinho"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2 bg-secondary rounded-lg">
                        <button
                          onClick={() =>
                            atualizarQuantidade(item.produto_id, item.quantidade - 1)
                          }
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() =>
                            atualizarQuantidade(item.produto_id, item.quantidade + 1)
                          }
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="font-bold text-lg">
                        R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo do Carrinho */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Resumo</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">R$ {carrinho.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-semibold text-accent">A calcular</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="font-semibold text-green-400">R$ 0,00</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-accent">
                  R$ {carrinho.total.toFixed(2)}
                </span>
              </div>

              <Link href="/checkout">
                <div className="btn-primary w-full text-center block mb-3 cursor-pointer">
                  Ir para Checkout
                </div>
              </Link>

              <Link href="/catalogo">
                <div className="btn-secondary w-full text-center block cursor-pointer">
                  Continuar Comprando
                </div>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                O frete será calculado no checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
