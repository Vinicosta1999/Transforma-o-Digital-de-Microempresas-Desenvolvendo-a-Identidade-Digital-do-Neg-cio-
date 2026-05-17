/**
 * Serviço de Rastreamento de Pedidos
 * Gerencia o histórico de status dos pedidos
 */

export type StatusPedido = 'confirmado' | 'preparando' | 'enviado' | 'entregue' | 'cancelado';

export interface AtualizacaoStatus {
  status: StatusPedido;
  data: string;
  mensagem: string;
  localizacao?: string;
}

export interface PedidoRastreamento {
  pedido_id: string;
  status_atual: StatusPedido;
  historico: AtualizacaoStatus[];
  data_criacao: string;
  data_atualizacao: string;
  estimativa_entrega?: string;
  codigo_rastreamento?: string;
}

const STATUS_LABELS: Record<StatusPedido, string> = {
  confirmado: 'Pedido Confirmado',
  preparando: 'Preparando Envio',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const STATUS_CORES: Record<StatusPedido, string> = {
  confirmado: '#3b82f6', // azul
  preparando: '#f59e0b', // âmbar
  enviado: '#8b5cf6', // roxo
  entregue: '#10b981', // verde
  cancelado: '#ef4444', // vermelho
};

/**
 * Cria um novo rastreamento de pedido
 */
export function criarRastreamento(pedido_id: string): PedidoRastreamento {
  const agora = new Date().toISOString();
  
  return {
    pedido_id,
    status_atual: 'confirmado',
    historico: [
      {
        status: 'confirmado',
        data: agora,
        mensagem: 'Seu pedido foi confirmado com sucesso!',
      },
    ],
    data_criacao: agora,
    data_atualizacao: agora,
    codigo_rastreamento: `CASE${Date.now()}`,
  };
}

/**
 * Atualiza o status de um pedido
 */
export function atualizarStatusPedido(
  rastreamento: PedidoRastreamento,
  novo_status: StatusPedido,
  mensagem: string,
  localizacao?: string
): PedidoRastreamento {
  const atualizacao: AtualizacaoStatus = {
    status: novo_status,
    data: new Date().toISOString(),
    mensagem,
    localizacao,
  };

  return {
    ...rastreamento,
    status_atual: novo_status,
    historico: [...rastreamento.historico, atualizacao],
    data_atualizacao: new Date().toISOString(),
  };
}

/**
 * Obtém o label do status
 */
export function obterLabelStatus(status: StatusPedido): string {
  return STATUS_LABELS[status];
}

/**
 * Obtém a cor do status
 */
export function obterCorStatus(status: StatusPedido): string {
  return STATUS_CORES[status];
}

/**
 * Calcula o progresso do pedido (0-100%)
 */
export function calcularProgressoPedido(status: StatusPedido): number {
  const progresso: Record<StatusPedido, number> = {
    confirmado: 25,
    preparando: 50,
    enviado: 75,
    entregue: 100,
    cancelado: 0,
  };
  return progresso[status];
}

/**
 * Salva rastreamento no localStorage
 */
export function salvarRastreamento(rastreamento: PedidoRastreamento): void {
  const rastreamentos = obterTodosRastreamentos();
  const indice = rastreamentos.findIndex((r) => r.pedido_id === rastreamento.pedido_id);
  
  if (indice >= 0) {
    rastreamentos[indice] = rastreamento;
  } else {
    rastreamentos.push(rastreamento);
  }
  
  localStorage.setItem('rastreamentos_case_point', JSON.stringify(rastreamentos));
}

/**
 * Obtém rastreamento de um pedido específico
 */
export function obterRastreamento(pedido_id: string): PedidoRastreamento | null {
  const rastreamentos = obterTodosRastreamentos();
  return rastreamentos.find((r) => r.pedido_id === pedido_id) || null;
}

/**
 * Obtém todos os rastreamentos
 */
export function obterTodosRastreamentos(): PedidoRastreamento[] {
  return JSON.parse(localStorage.getItem('rastreamentos_case_point') || '[]');
}

/**
 * Formata a data para exibição
 */
export function formatarDataRastreamento(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Gera estimativa de entrega (simulado)
 */
export function gerarEstimativaEntrega(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toLocaleDateString('pt-BR');
}
