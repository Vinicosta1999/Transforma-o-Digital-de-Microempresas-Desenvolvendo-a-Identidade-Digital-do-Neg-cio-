import { useLocation } from 'wouter';
import { BarChart3, Package, Users, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PRODUTOS } from '@/lib/produtos';

export default function Admin() {
  const [, setLocation] = useLocation();
  const { isAutenticado, usuario } = useAuth();

  if (!isAutenticado) {
    return (
      <div className="min-h-screen py-8">
        <div className="container text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-8">
            Você precisa estar logado para acessar o painel administrativo
          </p>
          <button
            onClick={() => setLocation('/login')}
            className="btn-primary"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  // Dados simulados para o dashboard
  const stats = [
    {
      titulo: 'Produtos',
      valor: PRODUTOS.length,
      icone: Package,
      cor: 'bg-blue-500',
    },
    {
      titulo: 'Pedidos',
      valor: 24,
      icone: ShoppingBag,
      cor: 'bg-green-500',
    },
    {
      titulo: 'Clientes',
      valor: 156,
      icone: Users,
      cor: 'bg-purple-500',
    },
    {
      titulo: 'Receita',
      valor: 'R$ 12.450',
      icone: BarChart3,
      cor: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {usuario?.nome}! Aqui você pode gerenciar sua loja.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icone;
            return (
              <div key={idx} className="bg-card p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      {stat.titulo}
                    </p>
                    <p className="text-3xl font-bold">{stat.valor}</p>
                  </div>
                  <div className={`${stat.cor} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Seções */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Produtos */}
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Gerenciar Produtos
            </h2>
            <div className="space-y-3">
              <p className="text-muted-foreground mb-4">
                Total de {PRODUTOS.length} produtos no catálogo
              </p>
              <button className="btn-primary w-full">
                Adicionar Novo Produto
              </button>
              <button className="btn-secondary w-full">
                Ver Todos os Produtos
              </button>
            </div>
          </div>

          {/* Pedidos */}
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              Gerenciar Pedidos
            </h2>
            <div className="space-y-3">
              <p className="text-muted-foreground mb-4">
                24 pedidos pendentes de processamento
              </p>
              <button className="btn-primary w-full">
                Ver Todos os Pedidos
              </button>
              <button className="btn-secondary w-full">
                Pedidos Recentes
              </button>
            </div>
          </div>

          {/* Clientes */}
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Gerenciar Clientes
            </h2>
            <div className="space-y-3">
              <p className="text-muted-foreground mb-4">
                156 clientes registrados
              </p>
              <button className="btn-primary w-full">
                Ver Todos os Clientes
              </button>
              <button className="btn-secondary w-full">
                Clientes Ativos
              </button>
            </div>
          </div>

          {/* Relatórios */}
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Relatórios
            </h2>
            <div className="space-y-3">
              <p className="text-muted-foreground mb-4">
                Analise o desempenho da sua loja
              </p>
              <button className="btn-primary w-full">
                Relatório de Vendas
              </button>
              <button className="btn-secondary w-full">
                Relatório de Produtos
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Produtos Recentes */}
        <div className="bg-card p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-bold mb-6">Produtos Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold">Preço</th>
                  <th className="text-left py-3 px-4 font-semibold">Estoque</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {PRODUTOS.slice(0, 5).map((produto) => (
                  <tr key={produto.id} className="border-b border-border hover:bg-secondary transition">
                    <td className="py-3 px-4">{produto.nome}</td>
                    <td className="py-3 px-4 capitalize">{produto.categoria}</td>
                    <td className="py-3 px-4 font-mono">R$ {produto.preco.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        produto.estoque > 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {produto.estoque}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary hover:underline text-sm font-semibold">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
