/**
 * Serviço de Integração com Melhor Envio API v2
 * Cálculo de frete em tempo real
 * 
 * Documentação: https://www.melhorenvio.com.br/api/v2/docs
 */

/**
 * O token da API Frenet é gerido exclusivamente no servidor.
 * Nunca é exposto ao cliente por razões de segurança.
 * Todas as requisições passam pelo proxy server-side em /api/frenet
 */

const API_URL = '/api/frenet';

export interface ProdutoFrete {
  id: string;
  nome: string;
  peso: number; // em gramas
  comprimento: number; // em cm
  largura: number; // em cm
  altura: number; // em cm
  valor: number; // em reais
  quantidade: number;
}

export interface EnderecoEntrega {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface OpcaoFrete {
  id: string;
  nome: string;
  preco: number;
  prazo: number; // em dias
  descricao: string;
  codigo: string | number;
  empresa?: string;
}

export interface CalculoFrete {
  opcoes: OpcaoFrete[];
  peso_total: number;
  dimensoes: {
    comprimento: number;
    largura: number;
    altura: number;
  };
  cep_origem: string;
  cep_destino: string;
}

/**
 * Calcula peso total e dimensões dos produtos para o Melhor Envio
 */
function prepararVolumes(produtos: ProdutoFrete[]) {
  return produtos.map(p => ({
    id: p.id,
    width: p.largura || 20,
    height: p.altura || 20,
    length: p.comprimento || 20,
    weight: (p.peso || 500) / 1000, // Melhor Envio usa KG
    insurance_value: p.valor,
    quantity: p.quantidade
  }));
}

/**
 * Calcula opções de frete reais via proxy server-side
 * O token é gerido no servidor, nunca exposto ao cliente
 */
export async function calcularFrete(
  produtos: ProdutoFrete[],
  endereco_destino: EnderecoEntrega,
  cep_origem: string = '01310-100'
): Promise<CalculoFrete> {
  const peso_total = produtos.reduce((acc, p) => acc + (p.peso * p.quantidade), 0);
  const dimensoes = {
    comprimento: Math.max(...produtos.map(p => p.comprimento), 20),
    largura: Math.max(...produtos.map(p => p.largura), 20),
    altura: produtos.reduce((acc, p) => acc + (p.altura * p.quantidade), 0)
  };

  try {
    const volumes = prepararVolumes(produtos);

    // Fazer requisição para o proxy server-side
    const response = await fetch(`${API_URL}/shipping/quote`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { postal_code: cep_origem.replace(/\D/g, '') },
        to: { postal_code: endereco_destino.cep.replace(/\D/g, '') },
        products: volumes
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao consultar API de frete');
    }

    const data = await response.json();
    
    let listaServicos = [];
    if (data && data.ShippingSevicesArray) {
      listaServicos = data.ShippingSevicesArray.filter((servico: any) => !servico.Error);
    }

    const opcoes: OpcaoFrete[] = listaServicos.map((servico: any) => {
      const nomeEmpresa = servico.Carrier || "Entrega";
      const nomeServico = servico.ServiceDescription || "Padrão";
      const diasPrazo = servico.DeliveryTime || "3";

      return {
        id: String(servico.ServiceCode || Math.random()),
        nome: nomeServico,
        empresa: nomeEmpresa,
        preco: parseFloat(servico.ShippingPrice) || 0,
        prazo: parseInt(diasPrazo),
        descricao: `${nomeEmpresa} ${nomeServico} - Entrega em ${diasPrazo} dias úteis`,
        codigo: servico.ServiceCode
      };
    });

    return {
      opcoes,
      peso_total,
      dimensoes,
      cep_origem,
      cep_destino: endereco_destino.cep
    };

  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    // Retornar cálculo dinâmico simulado baseado no CEP como fallback
    const cepOrigemNum = parseInt(cep_origem.replace(/\D/g, '').substring(0, 2)) || 1;
    const cepDestinoNum = parseInt(endereco_destino.cep.replace(/\D/g, '').substring(0, 2)) || 1;
    const diff = Math.abs(cepOrigemNum - cepDestinoNum);
    
    const basePrice = 15.0;
    const distanceFactor = diff * 1.5;
    const weightFactor = (peso_total / 1000) * 2.0;
    
    const pacPrice = basePrice + distanceFactor + weightFactor;
    const sedexPrice = (basePrice + distanceFactor + weightFactor) * 1.8;
    const pacTime = Math.max(3, Math.min(15, diff + 2));
    const sedexTime = Math.max(1, Math.min(5, Math.floor(diff / 2) + 1));

    return {
      opcoes: [
        {
          id: 'fallback-sedex',
          nome: 'SEDEX',
          empresa: 'Correios',
          preco: sedexPrice,
          prazo: sedexTime,
          descricao: `SEDEX - Entrega em ${sedexTime} dias úteis`,
          codigo: 'SEDEX'
        },
        {
          id: 'fallback-pac',
          nome: 'PAC',
          empresa: 'Correios',
          preco: pacPrice,
          prazo: pacTime,
          descricao: `PAC - Entrega em ${pacTime} dias úteis`,
          codigo: 'PAC'
        }
      ],
      peso_total,
      dimensoes,
      cep_origem,
      cep_destino: endereco_destino.cep
    };
  }
}

/**
 * Valida CEP
 */
export function validarCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
}

/**
 * Formata CEP
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return cep;
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
}

/**
 * Busca informações de CEP usando a API ViaCEP
 */
export async function buscarCEP(cep: string): Promise<EnderecoEntrega | null> {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return null;

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      cep: formatarCEP(cepLimpo),
      rua: data.logradouro || '',
      numero: '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      complemento: data.complemento || '',
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}

/**
 * Gera etiqueta de envio (simulado)
 */
export async function gerarEtiqueta(
  pedido_id: string,
  opcao_frete: OpcaoFrete,
  endereco: EnderecoEntrega
): Promise<{ numero_rastreamento: string; url_etiqueta: string }> {
  try {
    const numero_rastreamento = `BR${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      numero_rastreamento,
      url_etiqueta: `https://www.melhorenvio.com.br/rastreio/${numero_rastreamento}`,
    };
  } catch (error) {
    console.error('Erro ao gerar etiqueta:', error);
    throw new Error('Erro ao gerar etiqueta');
  }
}

/**
 * Rastreia envio via proxy server-side
 */
export async function rastrearEnvio(numero_rastreamento: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/tracking/${numero_rastreamento}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Rastreamento não encontrado');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao rastrear envio:', error);
    // Retornar fallback
    return {
      numero_rastreamento,
      status: 'Em processamento',
      data_postagem: new Date().toISOString(),
      data_entrega_estimada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      localizacao: 'Agência de Postagem',
    };
  }
}

/**
 * Formata preço de frete para exibição
 */
export function formatarPrecoFrete(preco: number): string {
  return `R$ ${preco.toFixed(2)}`;
}

/**
 * Calcula data de entrega
 */
export function calcularDataEntrega(prazo_dias: number): Date {
  const data = new Date();
  data.setDate(data.getDate() + prazo_dias);
  return data;
}
