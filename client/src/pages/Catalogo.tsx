import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { PRODUTOS, filtrarProdutos, ordenarProdutos } from '@/lib/produtos';
import { FiltrosProdutos } from '@/types';
import ProdutoCard from '@/components/ProdutoCard';

const CATEGORIAS = [
  { id: 'cabos', nome: 'Cabos' },
  { id: 'carregadores', nome: 'Carregadores' },
  { id: 'peliculas', nome: 'Películas' },
];

const ORDENACOES = [
  { id: 'novo', nome: 'Mais Recentes' },
  { id: 'preco_asc', nome: 'Menor Preço' },
  { id: 'preco_desc', nome: 'Maior Preço' },
  { id: 'nome_asc', nome: 'Nome (A-Z)' },
];

export default function Catalogo() {
  const [filtros, setFiltros] = useState<FiltrosProdutos>({
    ordenacao: 'novo',
  });
  const [filtrosAberto, setFiltrosAberto] = useState(false);

  const produtosFiltrados = useMemo(() => {
    let resultado = filtrarProdutos(
      PRODUTOS,
      filtros.categoria,
      filtros.busca,
      filtros.preco_min,
      filtros.preco_max
    );

    if (filtros.ordenacao) {
      resultado = ordenarProdutos(resultado, filtros.ordenacao as any);
    }

    return resultado;
  }, [filtros]);

  const handleFiltroChange = (novosFiltros: Partial<FiltrosProdutos>) => {
    setFiltros((prev) => ({ ...prev, ...novosFiltros }));
  };

  const precoMin = Math.min(...PRODUTOS.map((p) => p.preco));
  const precoMax = Math.max(...PRODUTOS.map((p) => p.preco));

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Catálogo de Produtos</h1>
          <p className="text-muted-foreground">
            {produtosFiltrados.length} produto(s) encontrado(s)
          </p>
        </div>

        {/* Barra de Busca */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={filtros.busca || ''}
              onChange={(e) => handleFiltroChange({ busca: e.target.value })}
              className="input-field pl-10 w-full"
            />
          </div>

          <select
            value={filtros.ordenacao || 'novo'}
            onChange={(e) => handleFiltroChange({ ordenacao: e.target.value as any })}
            className="input-field md:w-48"
          >
            {ORDENACOES.map((ord) => (
              <option key={ord.id} value={ord.id}>
                {ord.nome}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFiltrosAberto(!filtrosAberto)}
            className="md:hidden btn-secondary flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar de Filtros */}
          <div
            className={`md:col-span-1 ${
              filtrosAberto ? 'block' : 'hidden'
            } md:block bg-card p-6 rounded-lg h-fit sticky top-20`}
          >
            <h3 className="text-lg font-bold mb-4">Filtros</h3>

            {/* Categorias */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Categoria</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="categoria"
                    value=""
                    checked={!filtros.categoria}
                    onChange={() => handleFiltroChange({ categoria: undefined })}
                    className="w-4 h-4"
                  />
                  <span>Todas</span>
                </label>
                {CATEGORIAS.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="categoria"
                      value={cat.id}
                      checked={filtros.categoria === cat.id}
                      onChange={() => handleFiltroChange({ categoria: cat.id })}
                      className="w-4 h-4"
                    />
                    <span>{cat.nome}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Faixa de Preço */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Preço</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Mínimo</label>
                  <input
                    type="number"
                    min={precoMin}
                    max={precoMax}
                    value={filtros.preco_min || precoMin}
                    onChange={(e) =>
                      handleFiltroChange({ preco_min: parseFloat(e.target.value) })
                    }
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Máximo</label>
                  <input
                    type="number"
                    min={precoMin}
                    max={precoMax}
                    value={filtros.preco_max || precoMax}
                    onChange={(e) =>
                      handleFiltroChange({ preco_max: parseFloat(e.target.value) })
                    }
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            {/* Botão Limpar Filtros */}
            <button
              onClick={() => setFiltros({ ordenacao: 'novo' })}
              className="w-full btn-secondary text-sm"
            >
              Limpar Filtros
            </button>
          </div>

          {/* Grid de Produtos */}
          <div className="md:col-span-3">
            {produtosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtosFiltrados.map((produto) => (
                  <ProdutoCard key={produto.id} produto={produto} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">
                  Nenhum produto encontrado com os filtros selecionados
                </p>
                <button
                  onClick={() => setFiltros({ ordenacao: 'novo' })}
                  className="btn-primary"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
