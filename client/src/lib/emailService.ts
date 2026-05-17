/**
 * Serviço de Notificações por Email
 * Simula envio de emails para confirmação de pedido e atualizações
 * 
 * Em produção, integrar com serviço real como SendGrid, Mailgun ou AWS SES
 */

export interface EmailNotificacao {
  id: string;
  para: string;
  assunto: string;
  corpo: string;
  tipo: 'confirmacao' | 'atualizacao' | 'entrega' | 'cancelamento';
  pedido_id: string;
  data_envio: string;
  status: 'enviado' | 'falha' | 'pendente';
}

/**
 * Gera email de confirmação de pedido
 */
export function gerarEmailConfirmacao(
  cliente_nome: string,
  cliente_email: string,
  pedido_id: string,
  total: number,
  itens_count: number
): EmailNotificacao {
  const corpo = `
Olá ${cliente_nome},

Seu pedido foi confirmado com sucesso!

📋 Detalhes do Pedido:
- ID: ${pedido_id}
- Total: R$ ${total.toFixed(2)}
- Quantidade de itens: ${itens_count}

Você receberá atualizações sobre o status do seu pedido via email.

Rastreie seu pedido aqui: https://case-point.com.br/rastreamento?id=${pedido_id}

Obrigado por comprar conosco!

Case Point - Acessórios Premium para Eletrônicos
  `.trim();

  return {
    id: `EMAIL_${Date.now()}`,
    para: cliente_email,
    assunto: `Pedido Confirmado - ${pedido_id}`,
    corpo,
    tipo: 'confirmacao',
    pedido_id,
    data_envio: new Date().toISOString(),
    status: 'enviado',
  };
}

/**
 * Gera email de atualização de status
 */
export function gerarEmailAtualizacao(
  cliente_nome: string,
  cliente_email: string,
  pedido_id: string,
  novo_status: string,
  mensagem: string
): EmailNotificacao {
  const corpo = `
Olá ${cliente_nome},

Seu pedido ${pedido_id} foi atualizado!

📦 Novo Status: ${novo_status}
${mensagem}

Acompanhe seu pedido: https://case-point.com.br/rastreamento?id=${pedido_id}

Case Point - Acessórios Premium para Eletrônicos
  `.trim();

  return {
    id: `EMAIL_${Date.now()}`,
    para: cliente_email,
    assunto: `Atualização do Pedido ${pedido_id}`,
    corpo,
    tipo: 'atualizacao',
    pedido_id,
    data_envio: new Date().toISOString(),
    status: 'enviado',
  };
}

/**
 * Gera email de entrega
 */
export function gerarEmailEntrega(
  cliente_nome: string,
  cliente_email: string,
  pedido_id: string,
  data_entrega: string
): EmailNotificacao {
  const corpo = `
Olá ${cliente_nome},

Seu pedido ${pedido_id} foi entregue!

✅ Data de Entrega: ${data_entrega}

Obrigado por comprar conosco. Deixe uma avaliação do seu pedido!

Case Point - Acessórios Premium para Eletrônicos
  `.trim();

  return {
    id: `EMAIL_${Date.now()}`,
    para: cliente_email,
    assunto: `Pedido Entregue - ${pedido_id}`,
    corpo,
    tipo: 'entrega',
    pedido_id,
    data_envio: new Date().toISOString(),
    status: 'enviado',
  };
}

/**
 * Gera email de cancelamento
 */
export function gerarEmailCancelamento(
  cliente_nome: string,
  cliente_email: string,
  pedido_id: string,
  motivo: string
): EmailNotificacao {
  const corpo = `
Olá ${cliente_nome},

Seu pedido ${pedido_id} foi cancelado.

❌ Motivo: ${motivo}

Se você tiver dúvidas, entre em contato conosco via WhatsApp: +55 11 99132-5145

Case Point - Acessórios Premium para Eletrônicos
  `.trim();

  return {
    id: `EMAIL_${Date.now()}`,
    para: cliente_email,
    assunto: `Pedido Cancelado - ${pedido_id}`,
    corpo,
    tipo: 'cancelamento',
    pedido_id,
    data_envio: new Date().toISOString(),
    status: 'enviado',
  };
}

/**
 * Simula envio de email (em produção, integrar com API real)
 */
export async function enviarEmail(email: EmailNotificacao): Promise<boolean> {
  try {
    // Simular delay de envio
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Salvar email no localStorage
    const emails = obterTodosEmails();
    emails.push(email);
    localStorage.setItem('emails_enviados_case_point', JSON.stringify(emails));

    console.log(`✉️ Email enviado para ${email.para}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

/**
 * Obtém todos os emails enviados
 */
export function obterTodosEmails(): EmailNotificacao[] {
  return JSON.parse(localStorage.getItem('emails_enviados_case_point') || '[]');
}

/**
 * Obtém emails de um pedido específico
 */
export function obterEmailsPedido(pedido_id: string): EmailNotificacao[] {
  const emails = obterTodosEmails();
  return emails.filter((e) => e.pedido_id === pedido_id);
}

/**
 * Formata o email para exibição
 */
export function formatarEmailParaExibicao(email: EmailNotificacao): string {
  return `
Para: ${email.para}
Assunto: ${email.assunto}
Data: ${new Date(email.data_envio).toLocaleDateString('pt-BR')}
Status: ${email.status === 'enviado' ? '✅ Enviado' : '❌ Falha'}

${email.corpo}
  `.trim();
}
