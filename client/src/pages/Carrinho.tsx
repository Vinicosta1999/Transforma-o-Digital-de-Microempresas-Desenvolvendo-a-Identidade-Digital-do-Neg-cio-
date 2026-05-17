import { Link } from 'wouter';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { PRODUTOS } from '@/lib/produtos';

export default function Carrinho() {
  const { carrinho, removerItem, atualizarQuantidade } = useCarrinho();

  if (carrinho.itens.length === 0) {
    return (
      <div className="min-h-screen py-8 bg-[#0f172a]">
        <div className="container px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Seu Carrinho está Vazio</h1>
            <p className="text-slate-400 mb-8">
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
    <div className="min-h-screen py-4 sm:py-8 bg-[#0f172a] text-white">
      <div className="container px-4">
        <Link href="/catalogo">
          <div className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 sm:mb-8 cursor-pointer transition-colors text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4" />
            Continuar Comprando
          </div>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Itens do Carrinho */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Seu Carrinho</h1>

            <div className="space-y-4">
              {carrinho.itens.map((item) => {
                const produto = PRODUTOS.find((p) => p.id === item.produto_id);
                if (!produto) return null;

                return (
                  <div key={item.produto_id} className="bg-[#1e293b] p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row gap-4 border border-slate-800 relative">
                    {/* Imagem e Info Básica (Mobile Row) */}
                    <div className="flex gap-4 items-start">
                      <div className="bg-white p-1 rounded-lg flex-shrink-0">
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg mb-1 text-slate-100 truncate">{produto.nome}</h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-2 line-clamp-2">
                          {produto.descricao}
                        </p>
                        <div className="flex items-center gap-2">
                          {produto.preco_original && (
                            <span className="text-slate-500 line-through text-[10px] sm:text-xs">
                              R$ {produto.preco_original.toFixed(2)}
                            </span>
                          )}
                          <p className="font-bold text-amber-500 text-sm sm:text-base">
                            R$ {item.preco_unitario.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Botão Remover (Mobile Top Right) */}
                      <button
                        onClick={() => removerItem(item.produto_id)}
                        className="sm:hidden text-rose-500 p-1"
                        title="Remover"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Controles e Preço Total (Mobile Bottom Row) */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-between sm:ml-auto pt-2 sm:pt-0 border-t border-slate-800 sm:border-0">
                      <div className="flex items-center gap-3 bg-[#0f172a] p-1 rounded-lg border border-slate-700">
                        <button
                          onClick={() =>
                            atualizarQuantidade(item.produto_id, item.quantidade - 1)
                          }
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-semibold text-slate-200 text-sm">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() =>
                            atualizarQuantidade(item.produto_id, item.quantidade + 1)
                          }
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500 sm:hidden">Subtotal item</p>
                        <p className="font-bold text-lg sm:text-xl text-white">
                          R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                        </p>
                      </div>

                      {/* Botão Remover (Desktop Only) */}
                      <button
                        onClick={() => removerItem(item.produto_id)}
                        className="hidden sm:block text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition"
                        title="Remover do carrinho"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo do Carrinho */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e293b] p-5 sm:p-6 rounded-xl sticky top-20 border border-slate-800 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Resumo</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold">R$ {carrinho.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-slate-400">Frete</span>
                  <span className="font-semibold text-amber-500">A calcular</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-slate-400">Desconto</span>
                  <span className="font-semibold text-emerald-400">R$ {carrinho.desconto.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg sm:text-xl font-bold">Total</span>
                <span className="text-2xl sm:text-3xl font-bold text-amber-500">
                  R$ {carrinho.total.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                <Link href="/checkout">
                  <div className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 sm:py-4 rounded-xl text-center block cursor-pointer transition-colors shadow-lg shadow-indigo-900/20 text-sm sm:text-base">
                    Ir para Checkout
                  </div>
                </Link>

                <Link href="/catalogo">
                  <div className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 sm:py-4 rounded-xl text-center block cursor-pointer transition-colors text-sm sm:text-base">
                    Continuar Comprando
                  </div>
                </Link>
              </div>

              <p className="text-[10px] sm:text-xs text-slate-500 text-center mt-6">
                O frete será calculado no checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
