import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Package, CheckCircle, Truck, MapPin, AlertCircle } from 'lucide-react';
import { obterRastreamento, calcularProgressoPedido, formatarDataRastreamento, obterLabelStatus, obterCorStatus } from '@/lib/rastreamentoService';
import { obterPedidoPorId } from '@/lib/whatsappService';
import { PedidoRastreamento } from '@/lib/rastreamentoService';
import { PedidoWhatsApp } from '@/lib/whatsappService';

export default function Rastreamento() {
  const [, setLocation] = useLocation();
  const [pedidoId, setPedidoId] = useState('');
  const [rastreamento, setRastreamento] = useState<PedidoRastreamento | null>(null);
  const [pedido, setPedido] = useState<PedidoWhatsApp | null>(null);
  const [buscado, setBuscado] = useState(false);
  const [erro, setErro] = useState('');

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setBuscado(true);

    if (!pedidoId.trim()) {
      setErro('Digite o ID do pedido');
      return;
    }

    const rastreamentoEncontrado = obterRastreamento(pedidoId);
    const pedidoEncontrado = obterPedidoPorId(pedidoId);

    if (!rastreamentoEncontrado || !pedidoEncontrado) {
      setErro('Pedido não encontrado');
      setRastreamento(null);
      setPedido(null);
      return;
    }

    setRastreamento(rastreamentoEncontrado);
    setPedido(pedidoEncontrado);
  };

  const progresso = rastreamento ? calcularProgressoPedido(rastreamento.status_atual) : 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Rastreamento de Pedidos</h1>

        {/* Formulário de Busca */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <form onSubmit={handleBuscar} className="flex gap-2">
            <input
              type="text"
              placeholder="Digite o ID do pedido (ex: PED_1234567890)"
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-6">
              Rastrear
            </button>
          </form>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-500">{erro}</p>
          </div>
        )}

        {/* Resultado */}
        {buscado && rastreamento && pedido && (
          <>
            {/* Informações do Pedido */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Detalhes do Pedido</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm">ID do Pedido</p>
                  <p className="font-bold text-lg">{rastreamento.pedido_id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Código de Rastreamento</p>
                  <p className="font-bold text-lg">{rastreamento.codigo_rastreamento}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Cliente</p>
                  <p className="font-bold">{pedido.cliente_nome}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Data do Pedido</p>
                  <p className="font-bold">{formatarDataRastreamento(rastreamento.data_criacao)}</p>
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Status do Pedido</h2>

              {/* Progresso Visual */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{obterLabelStatus(rastreamento.status_atual)}</span>
                  <span className="text-muted-foreground">{progresso}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progresso}%`,
                      backgroundColor: obterCorStatus(rastreamento.status_atual),
                    }}
                  />
                </div>
              </div>

              {/* Timeline de Status */}
              <div className="space-y-6">
                {rastreamento.historico.map((atualizacao, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: obterCorStatus(atualizacao.status) }}
                      >
                        {atualizacao.status === 'entregue' ? (
                          <CheckCircle size={20} />
                        ) : atualizacao.status === 'enviado' ? (
                          <Truck size={20} />
                        ) : (
                          <Package size={20} />
                        )}
                      </div>
                      {idx < rastreamento.historico.length - 1 && (
                        <div className="w-0.5 h-12 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-bold">{obterLabelStatus(atualizacao.status)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatarDataRastreamento(atualizacao.data)}
                      </p>
                      <p className="text-sm mt-1">{atualizacao.mensagem}</p>
                      {atualizacao.localizacao && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                          <MapPin size={14} />
                          {atualizacao.localizacao}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações de Entrega */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Informações de Entrega</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm">Destinatário</p>
                  <p className="font-semibold">{pedido.cliente_nome}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Endereço</p>
                  <p className="font-semibold">
                    {pedido.cliente_endereco}<br />
                    {pedido.cliente_cidade} - {pedido.cliente_cep}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Contato</p>
                  <p className="font-semibold">{pedido.cliente_email}</p>
                  <p className="font-semibold">{pedido.cliente_telefone}</p>
                </div>
                {rastreamento.estimativa_entrega && (
                  <div>
                    <p className="text-muted-foreground text-sm">Estimativa de Entrega</p>
                    <p className="font-semibold text-green-500">{rastreamento.estimativa_entrega}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Botão Voltar */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setPedidoId('');
                  setRastreamento(null);
                  setPedido(null);
                  setBuscado(false);
                }}
                className="text-primary hover:brightness-110 transition"
              >
                ← Fazer nova busca
              </button>
            </div>
          </>
        )}

        {/* Mensagem Inicial */}
        {!buscado && !rastreamento && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Rastreie seu Pedido</h2>
            <p className="text-muted-foreground">
              Digite o ID do seu pedido acima para acompanhar o status em tempo real
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
