import { Link } from 'wouter';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRODUTOS } from '@/lib/produtos';
import ProdutoCard from '@/components/ProdutoCard';

const HERO_IMAGE = '/manus-storage/hero-case-point_8e9dc62b.png';

export default function Home() {
  const produtosDestaque = PRODUTOS.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Acessórios Premium para Eletrônicos
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Cabos, carregadores e películas de proteção de alta qualidade para seus dispositivos
          </p>
          <Link href="/catalogo">
            <div className="btn-primary inline-flex items-center gap-2 cursor-pointer">
              Explorar Catálogo
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Proteção Garantida</h3>
            <p className="text-muted-foreground">
              Todos os produtos com garantia de qualidade e durabilidade
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Carregamento Rápido</h3>
            <p className="text-muted-foreground">
              Tecnologia de carregamento rápido para todos os dispositivos
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Entrega Rápida</h3>
            <p className="text-muted-foreground">
              Frete calculado em tempo real com as melhores transportadoras
            </p>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">Produtos em Destaque</h2>
            <Link href="/catalogo">
              <div className="text-primary font-semibold hover:underline flex items-center gap-2 cursor-pointer">
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtosDestaque.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Explore nossa coleção completa de acessórios premium e encontre exatamente o que você precisa
          </p>
          <Link href="/catalogo">
            <div className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer">
              Acessar Catálogo
            </div>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-card py-12 md:py-16 border-t border-border">
        <div className="container max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Receba Nossas Novidades
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            Inscreva-se para receber ofertas exclusivas e lançamentos de novos produtos
          </p>
          <form className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="Seu email"
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-primary">
              Inscrever
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
