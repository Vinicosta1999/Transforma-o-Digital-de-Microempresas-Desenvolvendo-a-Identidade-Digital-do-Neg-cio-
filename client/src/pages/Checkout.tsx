import { useState } from 'react';
import { useLocation } from 'wouter';
import { Truck, MapPin, CreditCard } from 'lucide-react';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { criarPedidoWhatsApp } from '@/lib/whatsappService';
import { buscarCEP, formatarCEP, validarCEP, calcularFrete, OpcaoFrete as OpcaoFreteAPI } from '@/lib/melhorEnvioService';
import { PRODUTOS } from '@/lib/produtos';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { carrinho, limparCarrinho } = useCarrinho();
  const { usuario, isAutenticado } = useAuth();
  const [etapa, setEtapa] = useState<'endereco' | 'frete' | 'pagamento' | 'confirmacao'>(
    'endereco'
  );
  const [carregando, setCarregando] = useState(false);
  const [opcoesFrete, setOpcoesFrete] = useState<OpcaoFreteAPI[]>([]);
  const [frete, setFrete] = useState<OpcaoFreteAPI | null>(null);
  const [metodo_pagamento, setMetodo_pagamento] = useState<'cartao' | 'whatsapp'>('whatsapp');

  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    cep: '',
  });

  const [pagamento, setPagamento] = useState({
    titular: '',
    numero: '',
    validade: '',
    cvv: '',
  });

  const handleCEPChange = async (cep: string) => {
    const cepFormatado = formatarCEP(cep);
    const novoEndereco = { ...endereco, cep: cepFormatado };
    setEndereco(novoEndereco);

    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      setCarregando(true);
      try {
        const dadosEndereco = await buscarCEP(cepLimpo);
        if (dadosEndereco) {
          const enderecoCompleto = {
            ...novoEndereco,
            cep: dadosEndereco.cep,
            rua: dadosEndereco.rua,
            bairro: dadosEndereco.bairro,
            cidade: dadosEndereco.cidade,
            estado: dadosEndereco.estado,
            complemento: dadosEndereco.complemento || '',
          };
          setEndereco(enderecoCompleto);
          toast.success('Endereço preenchido automaticamente!');
          
          // Disparar cálculo de frete automaticamente após preencher endereço
          await handleCalcularFreteAutomatico(enderecoCompleto);
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP');
      } finally {
        setCarregando(false);
      }
    }
  };

  const handleCalcularFreteAutomatico = async (enderecoAtual: typeof endereco) => {
    if (!enderecoAtual.cep || !validarCEP(enderecoAtual.cep)) return;

    try {
      const produtosFrete = carrinho.itens.map(item => {
        const produtoReal = PRODUTOS.find(p => p.id === item.produto_id);
        return {
          id: item.produto_id,
          nome: produtoReal?.nome || 'Produto',
          peso: produtoReal?.peso || 500,
          comprimento: produtoReal?.dimensoes.comprimento || 20,
          largura: produtoReal?.dimensoes.largura || 20,
          altura: produtoReal?.dimensoes.altura || 20,
          valor: item.preco_unitario,
          quantidade: item.quantidade
        };
      });

      const resultado = await calcularFrete(produtosFrete, enderecoAtual);
      
      if (resultado.opcoes.length > 0) {
        setOpcoesFrete(resultado.opcoes);
        setFrete(resultado.opcoes[0]);
        // Se já estiver na etapa de frete ou endereço, garante que as opções apareçam
        if (etapa === 'endereco') {
           // Opcional: avançar automaticamente ou apenas mostrar as opções abaixo
        }
      }
    } catch (error) {
      console.error('Erro no cálculo automático:', error);
    }
  };

  if (!isAutenticado) {
    return (
      <div className="min-h-screen py-8">
        <div className="container text-center">
          <h1 className="text-3xl font-bold mb-4">Faça login para continuar</h1>
          <p className="text-muted-foreground mb-8">
            Você precisa estar logado para completar a compra
          </p>
          <button
            onClick={() => setLocation('/login')}
            className="btn-primary"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  if (carrinho.itens.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container text-center">
          <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-8">
            Adicione produtos antes de fazer checkout
          </p>
          <button
            onClick={() => setLocation('/catalogo')}
            className="btn-primary"
          >
            Voltar ao Catálogo
          </button>
        </div>
      </div>
    );
  }

  const handleCalcularFrete = async () => {
    if (!endereco.cep || !validarCEP(endereco.cep)) {
      toast.error('Digite um CEP válido para calcular o frete');
      return;
    }

    setCarregando(true);
    try {
      const produtosFrete = carrinho.itens.map(item => {
        const produtoReal = PRODUTOS.find(p => p.id === item.produto_id);
        return {
          id: item.produto_id,
          nome: produtoReal?.nome || 'Produto',
          peso: produtoReal?.peso || 500,
          comprimento: produtoReal?.dimensoes.comprimento || 20,
          largura: produtoReal?.dimensoes.largura || 20,
          altura: produtoReal?.dimensoes.altura || 20,
          valor: item.preco_unitario,
          quantidade: item.quantidade
        };
      });

      const resultado = await calcularFrete(produtosFrete, endereco);
      
      if (resultado.opcoes.length > 0) {
        setOpcoesFrete(resultado.opcoes);
        setFrete(resultado.opcoes[0]);
        setEtapa('frete');
        toast.success('Frete calculado com sucesso!');
      } else {
        toast.error('Nenhuma opção de frete encontrada para este CEP');
      }
    } catch (error) {
      toast.error('Erro ao calcular frete. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  const handleConfirmarPagamento = async () => {
    if (metodo_pagamento === 'whatsapp') {
      handlePagamentoWhatsApp();
    } else {
      handlePagamentoCartao();
    }
  };

  const handlePagamentoWhatsApp = () => {
    if (!usuario) {
      toast.error('Usuário não encontrado');
      return;
    }

    try {
      const { pedido, linkWhatsApp } = criarPedidoWhatsApp(
        usuario.nome,
        usuario.email,
        usuario.telefone || '(11) 9999-9999',
        `${endereco.rua}, ${endereco.numero} ${endereco.complemento}`,
        endereco.cidade,
        endereco.cep,
        carrinho,
        frete?.preco || 0,
        'whatsapp'
      );

      const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos_case_point') || '[]');
      pedidosSalvos.push(pedido);
      localStorage.setItem('pedidos_case_point', JSON.stringify(pedidosSalvos));

      toast.success('Abrindo WhatsApp...');
      window.open(linkWhatsApp, '_blank');

      setTimeout(() => {
        limparCarrinho();
        setEtapa('confirmacao');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao processar pedido');
      console.error(error);
    }
  };

  const handlePagamentoCartao = async () => {
    if (!pagamento.titular || !pagamento.numero || !pagamento.validade || !pagamento.cvv) {
      toast.error('Preencha todos os dados do cartão');
      return;
    }

    setCarregando(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Pagamento processado com sucesso!');
      limparCarrinho();
      setEtapa('confirmacao');
    } catch (error) {
      toast.error('Erro ao processar pagamento');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {etapa === 'confirmacao' ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center max-w-md mx-auto">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4">Pedido Confirmado!</h2>
            <p className="text-muted-foreground mb-6">
              {metodo_pagamento === 'whatsapp'
                ? 'Seu pedido foi enviado para o WhatsApp. Aguarde a confirmação do vendedor.'
                : 'Seu pagamento foi processado com sucesso!'}
            </p>
            <button
              onClick={() => setLocation('/catalogo')}
              className="btn-primary w-full"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Etapa 1: Endereço */}
              {(etapa === 'endereco' || etapa === 'frete' || etapa === 'pagamento') && (
                <div className="bg-card p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Endereço de Entrega</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Rua"
                        value={endereco.rua}
                        onChange={(e) =>
                          setEndereco({ ...endereco, rua: e.target.value })
                        }
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Número"
                        value={endereco.numero}
                        onChange={(e) =>
                          setEndereco({ ...endereco, numero: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Complemento (opcional)"
                      value={endereco.complemento}
                      onChange={(e) =>
                        setEndereco({ ...endereco, complemento: e.target.value })
                      }
                      className="input-field"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={endereco.bairro}
                        onChange={(e) =>
                          setEndereco({ ...endereco, bairro: e.target.value })
                        }
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={endereco.cidade}
                        onChange={(e) =>
                          setEndereco({ ...endereco, cidade: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="CEP"
                        value={endereco.cep}
                        onChange={(e) => handleCEPChange(e.target.value)}
                        maxLength={9}
                        className="input-field"
                      />
                      <select
                        value={endereco.estado}
                        onChange={(e) =>
                          setEndereco({ ...endereco, estado: e.target.value })
                        }
                        className="input-field"
                      >
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                      </select>
                    </div>

                    {etapa === 'endereco' && (
                      <button
                        onClick={handleCalcularFrete}
                        disabled={carregando}
                        className="btn-primary w-full disabled:opacity-50"
                      >
                        {carregando ? 'Calculando...' : 'Calcular Frete'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Etapa 2: Frete */}
              {(etapa === 'frete' || etapa === 'pagamento') && opcoesFrete.length > 0 && (
                <div className="bg-card p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Opções de Frete</h2>
                  </div>

                  <div className="space-y-3">
                    {opcoesFrete.map((opcao) => (
                      <div
                        key={opcao.id}
                        onClick={() => setFrete(opcao)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          frete?.id === opcao.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{opcao.nome}</p>
                            {opcao.empresa && (
                              <p className="text-sm text-muted-foreground">{opcao.empresa}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Entrega em {opcao.prazo} dia{opcao.prazo > 1 ? 's' : ''} úteis
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              R$ {opcao.preco.toFixed(2)}
                            </p>
                            {frete?.id === opcao.id && (
                              <p className="text-xs text-primary font-semibold">✓ Selecionado</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {etapa === 'frete' && (
                    <button
                      onClick={() => setEtapa('pagamento')}
                      className="btn-primary w-full mt-4"
                    >
                      Continuar para Pagamento
                    </button>
                  )}
                </div>
              )}

              {/* Etapa 3: Pagamento */}
              {etapa === 'pagamento' && (
                <div className="bg-card p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Método de Pagamento</h2>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                      style={{
                        borderColor: metodo_pagamento === 'whatsapp' ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: metodo_pagamento === 'whatsapp' ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                      }}>
                      <input
                        type="radio"
                        name="pagamento"
                        value="whatsapp"
                        checked={metodo_pagamento === 'whatsapp'}
                        onChange={() => setMetodo_pagamento('whatsapp')}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-bold">WhatsApp (Recomendado)</p>
                        <p className="text-sm text-muted-foreground">Finalize o pedido e combine o pagamento diretamente com o vendedor</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                      style={{
                        borderColor: metodo_pagamento === 'cartao' ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: metodo_pagamento === 'cartao' ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                      }}>
                      <input
                        type="radio"
                        name="pagamento"
                        value="cartao"
                        checked={metodo_pagamento === 'cartao'}
                        onChange={() => setMetodo_pagamento('cartao')}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-bold">Cartão de Crédito</p>
                        <p className="text-sm text-muted-foreground">Pagamento online seguro e imediato</p>
                      </div>
                    </label>

                    {metodo_pagamento === 'cartao' && (
                      <div className="grid grid-cols-1 gap-4 mt-4 animate-in fade-in slide-in-from-top-4">
                        <input
                          type="text"
                          placeholder="Nome no Cartão"
                          value={pagamento.titular}
                          onChange={(e) => setPagamento({ ...pagamento, titular: e.target.value })}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Número do Cartão"
                          value={pagamento.numero}
                          onChange={(e) => setPagamento({ ...pagamento, numero: e.target.value })}
                          className="input-field"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Validade (MM/AA)"
                            value={pagamento.validade}
                            onChange={(e) => setPagamento({ ...pagamento, validade: e.target.value })}
                            className="input-field"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            value={pagamento.cvv}
                            onChange={(e) => setPagamento({ ...pagamento, cvv: e.target.value })}
                            className="input-field"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleConfirmarPagamento}
                      disabled={carregando}
                      className="btn-primary w-full mt-6"
                    >
                      {carregando ? 'Processando...' : `Confirmar ${metodo_pagamento === 'whatsapp' ? 'via WhatsApp' : 'Pagamento'}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg sticky top-20">
                <h3 className="text-xl font-bold mb-6">Resumo do Pedido</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {carrinho.total.toFixed(2)}</span>
                  </div>
                  {frete && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span>R$ {frete.preco.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-primary">
                    R$ {(carrinho.total + (frete?.preco || 0)).toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  {carrinho.itens.map((item) => {
                    const produto = PRODUTOS.find(p => p.id === item.produto_id);
                    return (
                      <div key={item.produto_id} className="text-sm">
                        <p className="font-semibold">{produto?.nome || `Produto ID: ${item.produto_id}`}</p>
                        <p className="text-muted-foreground">
                          {item.quantidade}x R$ {item.preco_unitario.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
