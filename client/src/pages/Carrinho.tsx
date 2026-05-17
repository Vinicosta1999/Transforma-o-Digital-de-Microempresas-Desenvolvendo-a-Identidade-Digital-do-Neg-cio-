import { Link } from 'wouter';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { PRODUTOS } from '@/lib/produtos';
import AplicarCupom from '@/components/AplicarCupom';

export default function Carrinho() {
  const { carrinho, removerItem, atualizarQuantidade, aplicarDesconto } = useCarrinho();

  if (carrinho.itens.length === 0) {
    return (
      <div className="min-h-screen py-8 bg-[#0f172a]">
        <div className="container">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold mb-4 text-white">Seu Carrinho está Vazio</h1>
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
    <div className="min-h-screen py-8 bg-[#0f172a] text-white">
      <div className="container">
        <Link href="/catalogo">
          <div className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 cursor-pointer transition-colors">
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
                  <div key={item.produto_id} className="bg-[#1e293b] p-4 rounded-xl flex gap-4 border border-slate-800">
                    {/* Imagem */}
                    <div className="bg-white p-1 rounded-lg">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-24 h-24 object-contain rounded-lg"
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 text-slate-100">{produto.nome}</h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                        {produto.descricao}
                      </p>
                      <p className="font-bold text-amber-500">
                        R$ {item.preco_unitario.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantidade e Ações */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removerItem(item.produto_id)}
                        className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition"
                        title="Remover do carrinho"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-3 bg-[#0f172a] p-1 rounded-lg border border-slate-700">
                        <button
                          onClick={() =>
                            atualizarQuantidade(item.produto_id, item.quantidade - 1)
                          }
                          className="p-1 hover:bg-slate-800 rounded text-slate-400"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-semibold text-slate-200">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() =>
                            atualizarQuantidade(item.produto_id, item.quantidade + 1)
                          }
                          className="p-1 hover:bg-slate-800 rounded text-slate-400"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="font-bold text-xl text-white">
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
            <div className="bg-[#1e293b] p-6 rounded-xl sticky top-20 border border-slate-800">
              <h2 className="text-2xl font-bold mb-6">Resumo</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold">R$ {carrinho.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frete</span>
                  <span className="font-semibold text-amber-500">A calcular</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Desconto</span>
                  <span className="font-semibold text-emerald-400">R$ {carrinho.desconto.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-amber-500">
                  R$ {carrinho.total.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                <Link href="/checkout">
                  <div className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl text-center block cursor-pointer transition-colors shadow-lg shadow-indigo-900/20">
                    Ir para Checkout
                  </div>
                </Link>

                <Link href="/catalogo">
                  <div className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 rounded-xl text-center block cursor-pointer transition-colors">
                    Continuar Comprando
                  </div>
                </Link>
              </div>

              <div className="mt-8">
                <AplicarCupom 
                  total_compra={carrinho.subtotal} 
                  onCupomAplicado={(desconto, cupom) => aplicarDesconto(desconto, cupom)} 
                />
              </div>

              <p className="text-xs text-slate-500 text-center mt-6">
                O frete será calculado no checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
