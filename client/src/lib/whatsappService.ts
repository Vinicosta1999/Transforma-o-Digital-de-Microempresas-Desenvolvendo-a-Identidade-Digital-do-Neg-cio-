/**
 * Serviço de Integração WhatsApp para Pagamentos
 * Integra com o microempreendedor Luiz Fernando B. Santos
 * WhatsApp: +55 11 99132-5145
 */

import { Carrinho, ItemCarrinho } from '@/types';
import { PRODUTOS } from './produtos';

const WHATSAPP_NUMERO = '5511991325145'; // Formato internacional sem símbolos
const VENDEDOR_NOME = 'Luiz Fernando B. Santos';

export interface PedidoWhatsApp {
  id: string;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string;
  cliente_endereco: string;
  cliente_cidade: string;
  cliente_cep: string;
  itens: ItemCarrinho[];
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  metodo_pagamento: 'whatsapp' | 'pix' | 'cartao';
  data_pedido: string;
}

/**
 * Formata o número de telefone para o padrão WhatsApp
 * Entrada: "11 99132-5145" ou "11991325145"
 * Saída: "5511991325145"
 */
export function formatarTelefoneWhatsApp(telefone: string): string {
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  // Se não começar com 55 (código Brasil), adicionar
  if (!apenasNumeros.startsWith('55')) {
    return `55${apenasNumeros}`;
  }
  
  return apenasNumeros;
}

/**
 * Gera uma mensagem formatada para enviar ao WhatsApp
 */
export function gerarMensagemPedido(pedido: PedidoWhatsApp): string {
  const linhas = [
    `🛍️ *NOVO PEDIDO - CASE POINT*`,
    ``,
    `📋 *Detalhes do Pedido*`,
    `ID: ${pedido.id}`,
    `Data: ${new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}`,
    ``,
    `👤 *Dados do Cliente*`,
    `Nome: ${pedido.cliente_nome}`,
    `Email: ${pedido.cliente_email}`,
    `Telefone: ${pedido.cliente_telefone}`,
    ``,
    `📍 *Endereço de Entrega*`,
    `${pedido.cliente_endereco}`,
    `${pedido.cliente_cidade} - ${pedido.cliente_cep}`,
    ``,
    `📦 *Produtos*`,
  ];

  // Adicionar itens do pedido
  pedido.itens.forEach((item, idx) => {
    const produto = PRODUTOS.find(p => p.id === item.produto_id);
    const nomeExibicao = produto ? produto.nome : `Produto ID: ${item.produto_id}`;
    
    linhas.push(
      `${idx + 1}. ${nomeExibicao}`,
      `   Quantidade: ${item.quantidade}`,
      `   Preço unitário: R$ ${item.preco_unitario.toFixed(2)}`,
      `   Subtotal: R$ ${(item.preco_unitario * item.quantidade).toFixed(2)}`
    );
  });

  linhas.push(
    ``,
    `💰 *Resumo Financeiro*`,
    `Subtotal: R$ ${pedido.subtotal.toFixed(2)}`,
    `Desconto: R$ ${pedido.desconto.toFixed(2)}`,
    `Frete: R$ ${pedido.frete.toFixed(2)}`,
    `*Total: R$ ${pedido.total.toFixed(2)}*`,
    ``,
    `💳 *Método de Pagamento*`,
    `${pedido.metodo_pagamento === 'whatsapp' ? 'WhatsApp/Transferência' : pedido.metodo_pagamento.toUpperCase()}`,
    ``,
    `✅ Clique no link abaixo para confirmar o pedido:`,
    `https://case-point.com.br/pedido/${pedido.id}`
  );

  return linhas.join('\n');
}

/**
 * Gera um link de WhatsApp para enviar a mensagem
 */
export function gerarLinkWhatsApp(mensagem: string, numero: string = WHATSAPP_NUMERO): string {
  const mensagemCodificada = encodeURIComponent(mensagem);
  return `https://wa.me/${numero}?text=${mensagemCodificada}`;
}

/**
 * Cria um pedido e retorna o link WhatsApp
 */
export function criarPedidoWhatsApp(
  cliente_nome: string,
  cliente_email: string,
  cliente_telefone: string,
  cliente_endereco: string,
  cliente_cidade: string,
  cliente_cep: string,
  carrinho: Carrinho,
  frete: number = 0,
  metodo_pagamento: 'whatsapp' | 'pix' | 'cartao' = 'whatsapp'
): { pedido: PedidoWhatsApp; linkWhatsApp: string } {
  const pedido: PedidoWhatsApp = {
    id: `PED_${Date.now()}`,
    cliente_nome,
    cliente_email,
    cliente_telefone,
    cliente_endereco,
    cliente_cidade,
    cliente_cep,
    itens: carrinho.itens,
    subtotal: carrinho.subtotal,
    desconto: carrinho.desconto,
    frete,
    total: carrinho.subtotal - carrinho.desconto + frete,
    metodo_pagamento,
    data_pedido: new Date().toISOString(),
  };

  const mensagem = gerarMensagemPedido(pedido);
  const linkWhatsApp = gerarLinkWhatsApp(mensagem);

  // Salvar pedido no localStorage para referência
  const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos_case_point') || '[]');
  pedidosSalvos.push(pedido);
  localStorage.setItem('pedidos_case_point', JSON.stringify(pedidosSalvos));

  return { pedido, linkWhatsApp };
}

/**
 * Recupera todos os pedidos salvos
 */
export function obterTodosPedidos(): PedidoWhatsApp[] {
  return JSON.parse(localStorage.getItem('pedidos_case_point') || '[]');
}

/**
 * Recupera um pedido específico pelo ID
 */
export function obterPedidoPorId(id: string): PedidoWhatsApp | null {
  const pedidos = obterTodosPedidos();
  return pedidos.find((p) => p.id === id) || null;
}

/**
 * Formata o valor monetário em Real
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Gera um resumo do pedido para exibição
 */
export function gerarResumoPedido(pedido: PedidoWhatsApp): string {
  return `
Pedido #${pedido.id}
Cliente: ${pedido.cliente_nome}
Total: ${formatarMoeda(pedido.total)}
Status: Aguardando confirmação no WhatsApp
  `.trim();
}
