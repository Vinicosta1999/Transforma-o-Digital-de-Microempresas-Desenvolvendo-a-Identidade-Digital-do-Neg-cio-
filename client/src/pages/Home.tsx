import { Link } from 'wouter';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRODUTOS } from '@/lib/produtos';
import ProdutoCard from '@/components/ProdutoCard';

const HERO_IMAGE = '/assets/hero-case-point.png';

export default function Home() {
  const produtosDestaque = PRODUTOS.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="inline-block px-4 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary-foreground text-sm font-bold mb-6 tracking-wider uppercase">
            Qualidade Premium
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Acessórios que <span className="text-primary">Potencializam</span> seu Estilo
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-zinc-200 font-medium leading-relaxed drop-shadow-lg">
            Cabos, carregadores e películas de proteção de alta performance para quem não aceita menos que o melhor.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/catalogo">
              <div className="btn-primary text-lg px-10 py-4 rounded-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-300 flex items-center gap-3 cursor-pointer">
                Explorar Catálogo
                <ArrowRight className="w-6 h-6" />
              </div>
            </Link>
            <Link href="/sobre">
              <div className="px-10 py-4 rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 text-lg font-semibold cursor-pointer">
                Nossa História
              </div>
            </Link>
          </div>
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
