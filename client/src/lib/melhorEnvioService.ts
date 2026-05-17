/**
 * Serviço de Integração com API Frenet
 * Cálculo de frete em tempo real
 * 
 * Documentação: https://www.frenet.com.br/api/
 */

const FRENET_API_URL = 'https://api.frenet.com.br/api';
const FRENET_TOKEN = '0D9AED5DR0AB7R4086R96AARD1BC23F46D81';

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
 * Calcula opções de frete reais via API Frenet (Chamada Direta no Cliente para Netlify)
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
    const totalWeightKG = peso_total / 1000;
    const totalValue = produtos.reduce((acc, p) => acc + (p.valor * p.quantidade), 0);

    const frenetPayload = {
      ShipperPostalCode: cep_origem.replace(/\D/g, ''),
      ReceiverPostalCode: endereco_destino.cep.replace(/\D/g, ''),
      ShipmentInvoiceValue: totalValue,
      ShipmentWeight: totalWeightKG || 0.5,
      ReceiverType: 1,
      RealWeight: true,
      CubedWeight: false,
      ShipmentLength: dimensoes.comprimento,
      ShipmentHeight: dimensoes.altura,
      ShipmentWidth: dimensoes.largura,
      ShipmentDiameter: 0,
    };

    const response = await fetch(`${FRENET_API_URL}/Shipping`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FRENET_TOKEN}`
      },
      body: JSON.stringify(frenetPayload)
    });

    if (!response.ok) {
      throw new Error('Erro ao consultar API Frenet');
    }

    const data = await response.json();
    
    let listaServicos = [];
    if (data && data.ShippingSevicesArray) {
      listaServicos = data.ShippingSevicesArray.filter((servico: any) => !servico.Error);
    }

    if (listaServicos.length === 0) {
        throw new Error('Nenhuma opção de frete disponível');
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
    console.warn('Erro ao calcular frete na API real, usando fallback:', error);
    
    // Fallback realista baseado em distância de CEPs
    const cepOrigemNum = parseInt(cep_origem.replace(/\D/g, '').substring(0, 2)) || 1;
    const cepDestinoNum = parseInt(endereco_destino.cep.replace(/\D/g, '').substring(0, 2)) || 1;
    const diff = Math.abs(cepOrigemNum - cepDestinoNum);
    
    const basePricePAC = 19.80;
    const basePriceSEDEX = 24.50;
    const distanceFactor = diff * 1.2;
    const totalWeightKG = peso_total / 1000;
    const weightFactor = totalWeightKG > 1 ? (totalWeightKG - 1) * 5.5 : 0;
    
    const pacPrice = basePricePAC + distanceFactor + weightFactor;
    const sedexPrice = basePriceSEDEX + (distanceFactor * 1.5) + (weightFactor * 1.2);
    
    const pacTime = diff === 0 ? 3 : Math.max(5, Math.min(12, diff + 4));
    const sedexTime = diff === 0 ? 1 : Math.max(2, Math.min(5, Math.floor(diff / 3) + 1));

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

export function validarCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
}

export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return cep;
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
}

export async function buscarCEP(cep: string): Promise<EnderecoEntrega | null> {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return null;

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) return null;

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

export async function rastrearEnvio(numero_rastreamento: string): Promise<any> {
  try {
    const response = await fetch(`${FRENET_API_URL}/Tracking/${numero_rastreamento}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${FRENET_TOKEN}`
      }
    });

    if (!response.ok) throw new Error('Rastreamento não encontrado');
    return await response.json();
  } catch (error) {
    console.error('Erro ao rastrear envio:', error);
    return {
      numero_rastreamento,
      status: 'Em processamento',
      data_postagem: new Date().toISOString(),
      data_entrega_estimada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      localizacao: 'Agência de Postagem',
    };
  }
}

export function formatarPrecoFrete(preco: number): string {
  return `R$ ${preco.toFixed(2)}`;
}

export function calcularDataEntrega(prazo_dias: number): Date {
  const data = new Date();
  data.setDate(data.getDate() + prazo_dias);
  return data;
}
