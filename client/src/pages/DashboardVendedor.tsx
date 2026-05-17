import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { BarChart3, TrendingUp, Package, DollarSign, Users, Eye } from 'lucide-react';
import { obterTodosRastreamentos } from '@/lib/rastreamentoService';
import { obterTodosEmails } from '@/lib/emailService';
import { PedidoWhatsApp } from '@/lib/whatsappService';

interface EstatisticaVendas {
  total_pedidos: number;
  total_faturamento: number;
  pedidos_confirmados: number;
  pedidos_enviados: number;
  pedidos_entregues: number;
  clientes_unicos: number;
  ticket_medio: number;
  taxa_conversao: number;
}

export default function DashboardVendedor() {
  const [, setLocation] = useLocation();
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [stats, setStats] = useState<EstatisticaVendas | null>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);

  const SENHA_VENDEDOR = 'luiz123'; // Em produção, usar autenticação segura

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === SENHA_VENDEDOR) {
      setAutenticado(true);
      carregarDados();
    } else {
      alert('Senha incorreta');
    }
  };

  const carregarDados = () => {
    const rastreamentos = obterTodosRastreamentos();
    const emails = obterTodosEmails();
    
    // Calcular estatísticas
    const total_pedidos = rastreamentos.length;
    const pedidos_confirmados = rastreamentos.filter((r) => r.status_atual === 'confirmado').length;
    const pedidos_enviados = rastreamentos.filter((r) => r.status_atual === 'enviado').length;
    const pedidos_entregues = rastreamentos.filter((r) => r.status_atual === 'entregue').length;

    // Simular faturamento (em produção, vir do banco de dados)
    const total_faturamento = total_pedidos * 150; // Média de R$ 150 por pedido
    const ticket_medio = total_pedidos > 0 ? total_faturamento / total_pedidos : 0;

    // Clientes únicos (simulado)
    const clientes_unicos = Math.ceil(total_pedidos * 0.8);

    // Taxa de conversão (simulada)
    const taxa_conversao = total_pedidos > 0 ? (pedidos_entregues / total_pedidos) * 100 : 0;

    setStats({
      total_pedidos,
      total_faturamento,
      pedidos_confirmados,
      pedidos_enviados,
      pedidos_entregues,
      clientes_unicos,
      ticket_medio,
      taxa_conversao,
    });

    // Simular pedidos para exibição
    setPedidos(
      rastreamentos.slice(-10).map((r) => ({
        id: r.pedido_id,
        status: r.status_atual,
        data: r.data_criacao,
        codigo: r.codigo_rastreamento,
      }))
    );
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-md">
          <div className="bg-card border border-border rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-2">Dashboard do Vendedor</h1>
            <p className="text-muted-foreground mb-6">
              Luiz Fernando B. Santos
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Senha de Acesso</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="input-field w-full"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Entrar
              </button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Senha padrão: luiz123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Vendas</h1>
            <p className="text-muted-foreground">Luiz Fernando B. Santos</p>
          </div>
          <button
            onClick={() => {
              setAutenticado(false);
              setSenha('');
            }}
            className="btn-primary"
          >
            Sair
          </button>
        </div>

        {stats && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total de Pedidos */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-muted-foreground">Total de Pedidos</h3>
                  <Package size={24} className="text-primary" />
                </div>
                <p className="text-3xl font-bold">{stats.total_pedidos}</p>
                <p className="text-sm text-muted-foreground mt-2">Todos os pedidos</p>
              </div>

              {/* Faturamento */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-muted-foreground">Faturamento Total</h3>
                  <DollarSign size={24} className="text-green-500" />
                </div>
                <p className="text-3xl font-bold">R$ {stats.total_faturamento.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ticket médio: R$ {stats.ticket_medio.toFixed(2)}
                </p>
              </div>

              {/* Clientes */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-muted-foreground">Clientes Únicos</h3>
                  <Users size={24} className="text-blue-500" />
                </div>
                <p className="text-3xl font-bold">{stats.clientes_unicos}</p>
                <p className="text-sm text-muted-foreground mt-2">Clientes ativos</p>
              </div>

              {/* Taxa de Conversão */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-muted-foreground">Taxa de Entrega</h3>
                  <TrendingUp size={24} className="text-orange-500" />
                </div>
                <p className="text-3xl font-bold">{stats.taxa_conversao.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.pedidos_entregues} de {stats.total_pedidos} entregues
                </p>
              </div>
            </div>

            {/* Status dos Pedidos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Confirmados */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="font-bold">Confirmados</h3>
                </div>
                <p className="text-4xl font-bold text-blue-500">{stats.pedidos_confirmados}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {((stats.pedidos_confirmados / stats.total_pedidos) * 100).toFixed(1)}% do total
                </p>
              </div>

              {/* Enviados */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <h3 className="font-bold">Enviados</h3>
                </div>
                <p className="text-4xl font-bold text-purple-500">{stats.pedidos_enviados}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {((stats.pedidos_enviados / stats.total_pedidos) * 100).toFixed(1)}% do total
                </p>
              </div>

              {/* Entregues */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <h3 className="font-bold">Entregues</h3>
                </div>
                <p className="text-4xl font-bold text-green-500">{stats.pedidos_entregues}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {((stats.pedidos_entregues / stats.total_pedidos) * 100).toFixed(1)}% do total
                </p>
              </div>
            </div>

            {/* Últimos Pedidos */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Eye size={20} />
                Últimos Pedidos
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">ID do Pedido</th>
                      <th className="text-left py-3 px-4 font-semibold">Código de Rastreamento</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="py-3 px-4 font-mono text-xs">{pedido.id}</td>
                        <td className="py-3 px-4 font-mono text-xs">{pedido.codigo}</td>
                        <td className="py-3 px-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor:
                                pedido.status === 'confirmado'
                                  ? 'rgba(59, 130, 246, 0.1)'
                                  : pedido.status === 'enviado'
                                    ? 'rgba(139, 92, 246, 0.1)'
                                    : 'rgba(16, 185, 129, 0.1)',
                              color:
                                pedido.status === 'confirmado'
                                  ? '#3b82f6'
                                  : pedido.status === 'enviado'
                                    ? '#8b5cf6'
                                    : '#10b981',
                            }}
                          >
                            {pedido.status === 'confirmado'
                              ? 'Confirmado'
                              : pedido.status === 'enviado'
                                ? 'Enviado'
                                : 'Entregue'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(pedido.data).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
