import { Users, Target, Zap } from 'lucide-react';
import { Link } from 'wouter';

export default function Sobre() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Case Point</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Somos especialistas em acessórios premium para dispositivos eletrônicos
          </p>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nossa Missão</h3>
              <p className="text-muted-foreground">
                Fornecer acessórios de alta qualidade que protegem e potencializam seus dispositivos eletrônicos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nossa Visão</h3>
              <p className="text-muted-foreground">
                Ser a marca mais confiável de acessórios eletrônicos no Brasil
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nossos Valores</h3>
              <p className="text-muted-foreground">
                Qualidade, confiabilidade, inovação e atendimento ao cliente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="bg-card py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold mb-8">Nossa História</h2>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Case Point foi fundada em 2020 com a missão de oferecer acessórios de qualidade premium para dispositivos eletrônicos. Começamos como uma pequena loja física em São Paulo e rapidamente expandimos para o e-commerce.
            </p>
            <p>
              Nosso compromisso com a qualidade e o atendimento ao cliente nos permitiu crescer exponencialmente. Hoje, somos uma das marcas mais confiáveis do mercado de acessórios eletrônicos.
            </p>
            <p>
              Todos os nossos produtos são cuidadosamente selecionados e testados para garantir que você receba o melhor. Oferecemos garantia em todos os produtos e suporte ao cliente 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Nosso Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                nome: 'Luiz Fernando B. Santos',
                cargo: 'Fundador & Proprietário',
                descricao: 'Microempreendedor especializado em acessórios eletrônicos premium',
              },
              {
                nome: 'Luiz Fernando B. Santos',
                cargo: 'Gerente de Operações',
                descricao: 'Responsável pela qualidade, logística e atendimento ao cliente',
              },
              {
                nome: 'Luiz Fernando B. Santos',
                cargo: 'Gerente de Vendas',
                descricao: 'Focado em crescimento, satisfação e relacionamento com clientes',
              },
            ].map((membro, idx) => (
              <div key={idx} className="bg-card p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-1">{membro.nome}</h3>
                <p className="text-primary font-semibold mb-3">{membro.cargo}</p>
                <p className="text-muted-foreground">{membro.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg mb-8 opacity-90">
            Explore nossa coleção de acessórios premium
          </p>
          <Link href="/catalogo">
            <div className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer">
              Ir para Catálogo
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
