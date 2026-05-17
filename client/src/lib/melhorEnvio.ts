/**
 * Serviço de Integração com Melhor Envio API v2
 * 
 * Documentação: https://www.melhorenvio.com.br/api/v2/docs
 * 
 * Este serviço fornece métodos para:
 * - Cálculo de frete em tempo real
 * - Consulta de transportadoras disponíveis
 * - Geração de etiquetas de envio
 * - Rastreamento de pedidos
 */

import { CalculoFrete, ItemCarrinho, Produto } from '@/types';

/**
 * Configuração da API Melhor Envio
 * Em produção, usar variáveis de ambiente
 */
const MELHOR_ENVIO_API_URL = 'https://api.melhorenvio.com.br/api/v2';
const MELHOR_ENVIO_TOKEN = process.env.VITE_MELHORENVIO_TOKEN || 'seu_token_aqui';

/**
 * Interface para resposta da API Melhor Envio
 */
interface MelhorEnvioResponse {
  id: number;
  name: string;
  code: string;
  price: string;
  delivery_time: number;
  delivery_range: {
    min: number;
    max: number;
  };
  packages: Array<{
    price: string;
    discount: string;
    currency: string;
    delivery_time: number;
    delivery_range: {
      min: number;
      max: number;
    };
  }>;
}

/**
 * Calcular frete para um conjunto de produtos
 * 
 * @param itens - Itens do carrinho
 * @param cepDestino - CEP de destino
 * @param cepOrigem - CEP de origem (padrão: São Paulo)
 * @returns Promise com opções de frete
 */
export async function calcularFrete(
  itens: ItemCarrinho[],
  cepDestino: string,
  cepOrigem: string = '01310-100'
): Promise<CalculoFrete[]> {
  try {
    // Calcular peso total e dimensões (simulado)
    const pesoTotal = itens.length * 500; // 500g por item
    const altura = 20;
    const largura = 15;
    const comprimento = 30;

    // Simulação de resposta da API
    // Em produção, fazer chamada real à API
    const opcoes: CalculoFrete[] = [
      {
        cep_origem: cepOrigem,
        cep_destino: cepDestino,
        peso: pesoTotal,
        altura,
        largura,
        comprimento,
        valor: 15.0 + (parseInt(cepDestino.slice(0, 2)) * 0.5),
        prazo_dias: 3,
        transportadora: 'Sedex',
      },
      {
        cep_origem: cepOrigem,
        cep_destino: cepDestino,
        peso: pesoTotal,
        altura,
        largura,
        comprimento,
        valor: 8.0 + (parseInt(cepDestino.slice(0, 2)) * 0.3),
        prazo_dias: 7,
        transportadora: 'PAC',
      },
      {
        cep_origem: cepOrigem,
        cep_destino: cepDestino,
        peso: pesoTotal,
        altura,
        largura,
        comprimento,
        valor: 25.0 + (parseInt(cepDestino.slice(0, 2)) * 0.8),
        prazo_dias: 1,
        transportadora: 'Sedex 12',
      },
    ];

    return opcoes;
  } catch (erro) {
    console.error('Erro ao calcular frete:', erro);
    throw new Error('Falha ao calcular frete. Tente novamente.');
  }
}

/**
 * Validar CEP
 */
export function validarCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
}

/**
 * Formatar CEP
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return cep;
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
}

/**
 * Gerar etiqueta de envio (simulado)
 * Em produção, integrar com API real
 */
export async function gerarEtiqueta(
  pedidoId: string,
  transportadora: string,
  endereco: any
): Promise<{ codigo: string; url: string }> {
  try {
    // Simulação
    const codigo = `ML${Date.now()}`;
    const url = `https://melhorenvio.com.br/etiqueta/${codigo}`;

    return { codigo, url };
  } catch (erro) {
    console.error('Erro ao gerar etiqueta:', erro);
    throw new Error('Falha ao gerar etiqueta de envio.');
  }
}

/**
 * Rastrear pedido
 */
export async function rastrearPedido(codigoRastreamento: string): Promise<any> {
  try {
    // Simulação
    return {
      codigo: codigoRastreamento,
      status: 'em_transito',
      data_postagem: new Date().toISOString(),
      data_entrega_estimada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      eventos: [
        {
          data: new Date().toISOString(),
          status: 'Objeto postado',
          local: 'São Paulo, SP',
        },
      ],
    };
  } catch (erro) {
    console.error('Erro ao rastrear pedido:', erro);
    throw new Error('Falha ao rastrear pedido.');
  }
}

/**
 * Listar transportadoras disponíveis
 */
export async function listarTransportadoras(): Promise<Array<{ id: number; nome: string }>> {
  return [
    { id: 1, nome: 'Sedex' },
    { id: 2, nome: 'PAC' },
    { id: 3, nome: 'Sedex 12' },
    { id: 4, nome: 'Loggi' },
    { id: 5, nome: 'Jadlog' },
  ];
}
