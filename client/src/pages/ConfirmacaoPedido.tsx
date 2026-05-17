import { useParams, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { CheckCircle, MessageCircle, Copy, AlertCircle } from 'lucide-react';
import { obterPedidoPorId, gerarMensagemPedido, gerarLinkWhatsApp, formatarMoeda } from '@/lib/whatsappService';
import { PedidoWhatsApp } from '@/lib/whatsappService';
import { toast } from 'sonner';
import { PRODUTOS } from '@/lib/produtos';

export default function ConfirmacaoPedido() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [pedido, setPedido] = useState<PedidoWhatsApp | null>(null);
  const [linkWhatsApp, setLinkWhatsApp] = useState('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const pedidoId = params.id;
    if (pedidoId) {
      const pedidoEncontrado = obterPedidoPorId(pedidoId);
      if (pedidoEncontrado) {
        setPedido(pedidoEncontrado);
        const mensagem = gerarMensagemPedido(pedidoEncontrado);
        const link = gerarLinkWhatsApp(mensagem);
        setLinkWhatsApp(link);
      }
    }
  }, [params.id]);

  const handleCopiarMensagem = () => {
    if (pedido) {
      const mensagem = gerarMensagemPedido(pedido);
      navigator.clipboard.writeText(mensagem);
      setCopiado(true);
      toast.success('Mensagem copiada!');
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleAbrirWhatsApp = () => {
    if (linkWhatsApp) {
      window.open(linkWhatsApp, '_blank');
    }
  };

  if (!pedido) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold mb-2">Pedido não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              Não conseguimos localizar o pedido solicitado.
            </p>
            <button
              onClick={() => setLocation('/catalogo')}
              className="btn-primary"
            >
              Voltar ao Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl">
        {/* Cabeçalho */}
        <div className="bg-card border border-border rounded-lg p-8 mb-6 text-center">
          <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
          <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
          <p className="text-muted-foreground">
            Seu pedido foi criado com sucesso. Agora confirme via WhatsApp.
          </p>
        </div>

        {/* Detalhes do Pedido */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Detalhes do Pedido</h2>

          <div className="space-y-3 mb-6 pb-6 border-b border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID do Pedido:</span>
              <span className="font-semibold">{pedido.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data:</span>
              <span>{new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span>{pedido.cliente_nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{pedido.cliente_email}</span>
            </div>
          </div>

          {/* Endereço */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="font-semibold mb-3">Endereço de Entrega</h3>
            <p className="text-sm text-muted-foreground">
              {pedido.cliente_endereco}<br />
              {pedido.cliente_cidade} - {pedido.cliente_cep}
            </p>
          </div>

          {/* Produtos */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="font-semibold mb-3">Produtos</h3>
            <div className="space-y-2">
              {pedido.itens.map((item, idx) => {
                const produto = PRODUTOS.find(p => p.id === item.produto_id);
                const nomeExibicao = produto ? produto.nome : `Produto ${item.produto_id}`;
                return (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {nomeExibicao} × {item.quantidade}
                    </span>
                    <span>{formatarMoeda(item.preco_unitario * item.quantidade)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatarMoeda(pedido.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete:</span>
              <span>{formatarMoeda(pedido.frete)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
              <span>Total:</span>
              <span className="text-primary">{formatarMoeda(pedido.total)}</span>
            </div>
          </div>
        </div>

        {/* Ações WhatsApp */}
        <div className="bg-card border border-green-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle size={24} className="text-green-500" />
            <h2 className="text-xl font-bold">Confirmar via WhatsApp</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Clique no botão abaixo para enviar os detalhes do pedido para o WhatsApp do vendedor.
            Luiz Fernando B. Santos confirmará seu pedido em breve.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleAbrirWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              <MessageCircle size={20} />
              Abrir WhatsApp
            </button>

            <button
              onClick={handleCopiarMensagem}
              className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold py-3 px-4 rounded-lg transition"
            >
              <Copy size={20} />
              {copiado ? 'Copiado!' : 'Copiar Mensagem'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-secondary rounded-lg text-sm">
            <p className="font-semibold mb-2">📱 Número do Vendedor:</p>
            <p className="text-muted-foreground">
              +55 11 99132-5145<br />
              Luiz Fernando B. Santos
            </p>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Próximos Passos</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span>Clique em "Abrir WhatsApp" para enviar o pedido</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span>Aguarde a confirmação do vendedor no WhatsApp</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span>Realize o pagamento conforme as instruções</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <span>Seu pedido será preparado e enviado</span>
            </li>
          </ol>
        </div>

        {/* Botão Voltar */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setLocation('/catalogo')}
            className="text-primary hover:brightness-110 transition"
          >
            ← Voltar ao Catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
