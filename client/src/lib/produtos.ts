import { Produto } from '@/types';

/**
 * Catálogo de produtos fictícios do Case Point
 * Acessórios premium para dispositivos eletrônicos
 * 
 * URLs de imagens geradas com IA de alto padrão
 */

export const PRODUTOS: Produto[] = [
  {
    id: 'prod_001',
    nome: 'Cabo de Rede Cat6',
    descricao: 'Cabo de rede de alta velocidade Cat6 com conectores RJ45 dourados. Ideal para conexões estáveis e rápidas.',
    preco: 10.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-cabo-rede-cat6-Hkn8FoqthVjWfoqgWfHwCj.webp',
    categoria: 'cabos',
    estoque: 50,
    peso: 150,
    dimensoes: { comprimento: 500, largura: 10, altura: 10 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_002',
    nome: 'Cabo HDMI 2.1',
    descricao: 'Cabo HDMI 2.1 de alta velocidade para conectar dispositivos com suporte a 4K e 8K. Conectores banhados a ouro.',
    preco: 11.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-cabo-hdmi-21-mzoWnm2j8WjKWBvi4LVMy2.webp',
    categoria: 'cabos',
    estoque: 45,
    peso: 120,
    dimensoes: { comprimento: 200, largura: 8, altura: 8 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_003',
    nome: 'Cabo Lightning para iPhone',
    descricao: 'Cabo Lightning original de alta qualidade para iPhone, iPad e AirPods. Certificado Apple MFi.',
    preco: 12.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-cabo-lightning-iphone-mRFgPoav5Ui2XwuePf9MH3.webp',
    categoria: 'cabos',
    estoque: 60,
    peso: 80,
    dimensoes: { comprimento: 100, largura: 6, altura: 6 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_004',
    nome: 'Cabo USB Type-C',
    descricao: 'Cabo USB Type-C de alta velocidade para carregamento rápido e transferência de dados. Compatível com a maioria dos dispositivos modernos.',
    preco: 9.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-cabo-usb-c-XUPhqudFPshFRq7JCDTdc3.webp',
    categoria: 'cabos',
    estoque: 55,
    peso: 90,
    dimensoes: { comprimento: 150, largura: 7, altura: 7 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_005',
    nome: 'Carregador Rápido 65W',
    descricao: 'Carregador de parede com tecnologia de carregamento rápido 65W. Compatível com múltiplos dispositivos.',
    preco: 39.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-carregador-rapido-DMvSG7i3RQVViAHUJdXEkc.webp',
    categoria: 'carregadores',
    estoque: 30,
    peso: 200,
    dimensoes: { comprimento: 80, largura: 50, altura: 50 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_006',
    nome: 'Carregador Automotivo Duplo',
    descricao: 'Carregador para carro com duas portas USB. Carregamento rápido para dois dispositivos simultaneamente.',
    preco: 29.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-carregador-auto-d7AjK93tZQUxh4fSvoQVNJ.webp',
    categoria: 'carregadores',
    estoque: 40,
    peso: 150,
    dimensoes: { comprimento: 60, largura: 40, altura: 40 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_007',
    nome: 'Carregador Lightning para iPhone',
    descricao: 'Carregador rápido para iPhone com certificação Apple. Carregamento seguro e eficiente.',
    preco: 39.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-carregador-lightning-Q9EzDgToDdTzEQ6cyZ8Gny.webp',
    categoria: 'carregadores',
    estoque: 35,
    peso: 120,
    dimensoes: { comprimento: 70, largura: 45, altura: 45 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_008',
    nome: 'Película de Proteção 3D',
    descricao: 'Película de proteção 3D para tela de smartphone. Proteção contra arranhões e impactos.',
    preco: 27.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-pelicula-3d-ZcbavoUGntEyZK7Bkntnnk.webp',
    categoria: 'peliculas',
    estoque: 100,
    peso: 20,
    dimensoes: { comprimento: 150, largura: 80, altura: 2 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_009',
    nome: 'Película de Vidro Temperado',
    descricao: 'Película de vidro temperado com dureza 9H. Proteção máxima para a tela do seu dispositivo.',
    preco: 19.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-pelicula-3d-ZcbavoUGntEyZK7Bkntnnk.webp',
    categoria: 'peliculas',
    estoque: 80,
    peso: 15,
    dimensoes: { comprimento: 140, largura: 70, altura: 1 },
    criado_em: new Date().toISOString(),
  },
  {
    id: 'prod_010',
    nome: 'Película para Câmera',
    descricao: 'Película protetora para câmera traseira de smartphone. Proteção contra arranhões e poeira.',
    preco: 15.90,
    imagem: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663630367347/WKWckgAzXEGr9tqYV6A6yY/produto-pelicula-camera-jAiaLyNBGzdoNu7KPSo3GX.webp',
    categoria: 'peliculas',
    estoque: 90,
    peso: 10,
    dimensoes: { comprimento: 50, largura: 50, altura: 1 },
    criado_em: new Date().toISOString(),
  },
];

/**
 * Filtrar produtos por critérios
 */
export function filtrarProdutos(
  produtos: Produto[],
  categoria?: string,
  busca?: string,
  preco_min?: number,
  preco_max?: number
): Produto[] {
  return produtos.filter((produto) => {
    if (categoria && produto.categoria !== categoria) return false;
    if (busca && !produto.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    if (preco_min !== undefined && produto.preco < preco_min) return false;
    if (preco_max !== undefined && produto.preco > preco_max) return false;
    return true;
  });
}

/**
 * Ordenar produtos
 */
export function ordenarProdutos(
  produtos: Produto[],
  ordenacao: 'preco_asc' | 'preco_desc' | 'nome_asc' | 'nome_desc' | 'novo'
): Produto[] {
  const copia = [...produtos];
  switch (ordenacao) {
    case 'preco_asc':
      return copia.sort((a, b) => a.preco - b.preco);
    case 'preco_desc':
      return copia.sort((a, b) => b.preco - a.preco);
    case 'nome_asc':
      return copia.sort((a, b) => a.nome.localeCompare(b.nome));
    case 'nome_desc':
      return copia.sort((a, b) => b.nome.localeCompare(a.nome));
    case 'novo':
      return copia.sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
    default:
      return copia;
  }
}
