/**
 * Serviço de Cupons e Promoções
 * Gerencia validação, aplicação e histórico de cupons
 */

export interface Cupom {
  id: string;
  codigo: string;
  desconto_percentual: number;
  desconto_fixo: number;
  descricao: string;
  limite_uso: number;
  uso_atual: number;
  ativo: boolean;
  data_inicio: string;
  data_fim: string;
  valor_minimo?: number;
  categorias_validas?: string[];
  criado_em: string;
}

export interface CupomAplicado {
  cupom_id: string;
  codigo: string;
  desconto_valor: number;
  desconto_percentual: number;
  aplicado_em: string;
}

export interface HistoricoCupom {
  cupom_id: string;
  codigo: string;
  usuario_id: string;
  pedido_id: string;
  desconto_valor: number;
  data_uso: string;
}

// Cupons fictícios para demonstração
const CUPONS_DEMO: Cupom[] = [
  {
    id: 'CUPOM_001',
    codigo: 'BEMVINDO10',
    desconto_percentual: 10,
    desconto_fixo: 0,
    descricao: 'Desconto de 10% para novos clientes',
    limite_uso: 100,
    uso_atual: 25,
    ativo: true,
    data_inicio: '2026-01-01',
    data_fim: '2026-12-31',
    valor_minimo: 50,
    criado_em: new Date().toISOString(),
  },
  {
    id: 'CUPOM_002',
    codigo: 'FRETE5',
    desconto_percentual: 0,
    desconto_fixo: 5,
    descricao: 'R$ 5 de desconto no frete',
    limite_uso: 50,
    uso_atual: 12,
    ativo: true,
    data_inicio: '2026-01-01',
    data_fim: '2026-12-31',
    valor_minimo: 100,
    criado_em: new Date().toISOString(),
  },
  {
    id: 'CUPOM_003',
    codigo: 'SUPER20',
    desconto_percentual: 20,
    desconto_fixo: 0,
    descricao: 'Desconto de 20% em compras acima de R$ 200',
    limite_uso: 30,
    uso_atual: 8,
    ativo: true,
    data_inicio: '2026-05-01',
    data_fim: '2026-05-31',
    valor_minimo: 200,
    criado_em: new Date().toISOString(),
  },
  {
    id: 'CUPOM_004',
    codigo: 'CABOS15',
    desconto_percentual: 15,
    desconto_fixo: 0,
    descricao: 'Desconto de 15% em cabos',
    limite_uso: 200,
    uso_atual: 45,
    ativo: true,
    data_inicio: '2026-01-01',
    data_fim: '2026-12-31',
    categorias_validas: ['Cabos'],
    criado_em: new Date().toISOString(),
  },
];

/**
 * Valida um cupom
 */
export function validarCupom(
  codigo: string,
  total_compra: number,
  categoria?: string
): { valido: boolean; cupom?: Cupom; erro?: string } {
  const cupom = CUPONS_DEMO.find((c) => c.codigo.toUpperCase() === codigo.toUpperCase());

  if (!cupom) {
    return { valido: false, erro: 'Cupom não encontrado' };
  }

  if (!cupom.ativo) {
    return { valido: false, erro: 'Cupom inativo' };
  }

  // Verificar data de validade
  const agora = new Date();
  const dataInicio = new Date(cupom.data_inicio);
  const dataFim = new Date(cupom.data_fim);

  if (agora < dataInicio) {
    return { valido: false, erro: 'Cupom ainda não está válido' };
  }

  if (agora > dataFim) {
    return { valido: false, erro: 'Cupom expirado' };
  }

  // Verificar limite de uso
  if (cupom.uso_atual >= cupom.limite_uso) {
    return { valido: false, erro: 'Cupom atingiu o limite de uso' };
  }

  // Verificar valor mínimo
  if (cupom.valor_minimo && total_compra < cupom.valor_minimo) {
    return {
      valido: false,
      erro: `Valor mínimo de R$ ${cupom.valor_minimo.toFixed(2)} necessário`,
    };
  }

  // Verificar categorias válidas
  if (cupom.categorias_validas && categoria && !cupom.categorias_validas.includes(categoria)) {
    return {
      valido: false,
      erro: `Cupom válido apenas para: ${cupom.categorias_validas.join(', ')}`,
    };
  }

  return { valido: true, cupom };
}

/**
 * Calcula o desconto de um cupom
 */
export function calcularDesconto(cupom: Cupom, total_compra: number): number {
  if (cupom.desconto_percentual > 0) {
    return (total_compra * cupom.desconto_percentual) / 100;
  }
  return cupom.desconto_fixo;
}

/**
 * Aplica um cupom ao carrinho
 */
export function aplicarCupom(
  codigo: string,
  total_compra: number,
  categoria?: string
): { sucesso: boolean; cupom_aplicado?: CupomAplicado; erro?: string } {
  const validacao = validarCupom(codigo, total_compra, categoria);

  if (!validacao.valido || !validacao.cupom) {
    return { sucesso: false, erro: validacao.erro };
  }

  const desconto_valor = calcularDesconto(validacao.cupom, total_compra);

  const cupom_aplicado: CupomAplicado = {
    cupom_id: validacao.cupom.id,
    codigo: validacao.cupom.codigo,
    desconto_valor,
    desconto_percentual: validacao.cupom.desconto_percentual,
    aplicado_em: new Date().toISOString(),
  };

  // Salvar no localStorage
  localStorage.setItem('cupom_aplicado_case_point', JSON.stringify(cupom_aplicado));

  return { sucesso: true, cupom_aplicado };
}

/**
 * Obtém o cupom aplicado atual
 */
export function obterCupomAplicado(): CupomAplicado | null {
  const cupom = localStorage.getItem('cupom_aplicado_case_point');
  return cupom ? JSON.parse(cupom) : null;
}

/**
 * Remove o cupom aplicado
 */
export function removerCupomAplicado(): void {
  localStorage.removeItem('cupom_aplicado_case_point');
}

/**
 * Obtém todos os cupons disponíveis
 */
export function obterCuponsDisponiveis(): Cupom[] {
  const agora = new Date();
  return CUPONS_DEMO.filter((cupom) => {
    const dataInicio = new Date(cupom.data_inicio);
    const dataFim = new Date(cupom.data_fim);
    return (
      cupom.ativo &&
      agora >= dataInicio &&
      agora <= dataFim &&
      cupom.uso_atual < cupom.limite_uso
    );
  });
}

/**
 * Registra o uso de um cupom
 */
export function registrarUsoCupom(
  cupom_id: string,
  codigo: string,
  usuario_id: string,
  pedido_id: string,
  desconto_valor: number
): HistoricoCupom {
  const historico: HistoricoCupom = {
    cupom_id,
    codigo,
    usuario_id,
    pedido_id,
    desconto_valor,
    data_uso: new Date().toISOString(),
  };

  // Salvar histórico
  const historicos = JSON.parse(localStorage.getItem('historico_cupons_case_point') || '[]');
  historicos.push(historico);
  localStorage.setItem('historico_cupons_case_point', JSON.stringify(historicos));

  // Incrementar uso do cupom
  const cupom = CUPONS_DEMO.find((c) => c.id === cupom_id);
  if (cupom) {
    cupom.uso_atual += 1;
  }

  return historico;
}

/**
 * Obtém o histórico de cupons usados
 */
export function obterHistoricoCupons(usuario_id?: string): HistoricoCupom[] {
  const historicos = JSON.parse(localStorage.getItem('historico_cupons_case_point') || '[]');
  if (usuario_id) {
    return historicos.filter((h: HistoricoCupom) => h.usuario_id === usuario_id);
  }
  return historicos;
}

/**
 * Formata cupom para exibição
 */
export function formatarCupom(cupom: Cupom): string {
  let descricao = cupom.descricao;

  if (cupom.desconto_percentual > 0) {
    descricao += ` (${cupom.desconto_percentual}% OFF)`;
  } else if (cupom.desconto_fixo > 0) {
    descricao += ` (R$ ${cupom.desconto_fixo.toFixed(2)} OFF)`;
  }

  if (cupom.valor_minimo) {
    descricao += ` - Mínimo: R$ ${cupom.valor_minimo.toFixed(2)}`;
  }

  return descricao;
}

/**
 * Calcula economia com cupom
 */
export function calcularEconomia(cupom_aplicado: CupomAplicado, total_original: number): number {
  return cupom_aplicado.desconto_valor;
}

/**
 * Formata mensagem de cupom para exibição
 */
export function formatarMensagemCupom(cupom: Cupom, desconto: number): string {
  if (cupom.desconto_percentual > 0) {
    return `Cupom ${cupom.codigo} aplicado! Desconto de ${cupom.desconto_percentual}% = R$ ${desconto.toFixed(2)}`;
  }
  return `Cupom ${cupom.codigo} aplicado! Desconto de R$ ${desconto.toFixed(2)}`;
}
