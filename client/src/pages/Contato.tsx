import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contato() {
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // Simular envio de email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    } catch (erro) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl text-white/90">
            Estamos aqui para ajudar. Envie sua mensagem e entraremos em contato em breve.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Informações de Contato */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-muted-foreground">luiz.fernando.disney@hotmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Telefone</h3>
                    <p className="text-muted-foreground">(11) 99132-5145</p>
                    <p className="text-muted-foreground">Seg-Sex: 9h às 18h</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Endereço</h3>
                    <p className="text-muted-foreground">
                      Av. Paulista, 1000<br />
                      São Paulo, SP 01311-100<br />
                      Brasil
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-card p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Assunto</label>
                    <select
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="duvida">Dúvida sobre Produto</option>
                      <option value="pedido">Informação sobre Pedido</option>
                      <option value="reclamacao">Reclamação</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mensagem</label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      placeholder="Sua mensagem..."
                      rows={6}
                      className="input-field resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={carregando}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    {carregando ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {[
                {
                  pergunta: 'Qual é o prazo de entrega?',
                  resposta: 'O prazo varia de 3 a 7 dias úteis dependendo da transportadora e localização. Você pode escolher a opção desejada no checkout.',
                },
                {
                  pergunta: 'Vocês oferecem garantia?',
                  resposta: 'Sim! Todos os nossos produtos possuem garantia de 12 meses contra defeitos de fabricação.',
                },
                {
                  pergunta: 'Como faço para rastrear meu pedido?',
                  resposta: 'Você receberá um email com o código de rastreamento assim que seu pedido for enviado.',
                },
                {
                  pergunta: 'Qual é a política de devolução?',
                  resposta: 'Você tem 30 dias para devolver produtos em perfeito estado e receber o reembolso integral.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-card p-6 rounded-lg">
                  <h3 className="font-bold mb-2">{item.pergunta}</h3>
                  <p className="text-muted-foreground">{item.resposta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
