import { useState, useEffect } from 'react';
import { Truck, AlertCircle, Loader } from 'lucide-react';
import { calcularFrete, formatarPrecoFrete, calcularDataEntrega, validarCEP } from '@/lib/melhorEnvioService';
import { ProdutoFrete, OpcaoFrete, EnderecoEntrega } from '@/lib/melhorEnvioService';
import { toast } from 'sonner';

interface SeletorFreteProps {
  produtos: ProdutoFrete[];
  endereco: EnderecoEntrega;
  onFreteSelected?: (frete: OpcaoFrete) => void;
}

export default function SeletorFrete({ produtos, endereco, onFreteSelected }: SeletorFreteProps) {
  const [opcoes, setOpcoes] = useState<OpcaoFrete[]>([]);
  const [freteSelected, setFreteSelected] = useState<OpcaoFrete | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarOpcoesFrete();
  }, [endereco, produtos]);

  const carregarOpcoesFrete = async () => {
    try {
      setCarregando(true);
      setErro('');

      if (!validarCEP(endereco.cep)) {
        setErro('CEP inválido');
        return;
      }

      const resultado = await calcularFrete(produtos, endereco);
      setOpcoes(resultado.opcoes);

      if (resultado.opcoes.length > 0) {
        setFreteSelected(resultado.opcoes[0]);
        onFreteSelected?.(resultado.opcoes[0]);
      }
    } catch (err) {
      setErro('Erro ao calcular frete');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleSelecionarFrete = (frete: OpcaoFrete) => {
    setFreteSelected(frete);
    onFreteSelected?.(frete);
    toast.success(`${frete.nome} selecionado`);
  };

  if (carregando) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center gap-3">
        <Loader size={20} className="animate-spin" />
        <span>Calculando opções de frete...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle size={20} className="text-red-500" />
        <p className="text-red-500">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold flex items-center gap-2">
        <Truck size={20} />
        Opções de Frete
      </h3>

      {opcoes.length > 0 ? (
        <div className="space-y-2">
          {opcoes.map((frete) => (
            <div
              key={frete.id}
              onClick={() => handleSelecionarFrete(frete)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                freteSelected?.id === frete.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{frete.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    Entrega em {frete.prazo} dia{frete.prazo > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    até {calcularDataEntrega(frete.prazo).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {formatarPrecoFrete(frete.preco)}
                  </p>
                  {freteSelected?.id === frete.id && (
                    <p className="text-xs text-primary font-semibold">✓ Selecionado</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhuma opção de frete disponível</p>
      )}

      <button
        onClick={carregarOpcoesFrete}
        className="text-sm text-primary hover:brightness-110 transition"
      >
        ↻ Recalcular frete
      </button>
    </div>
  );
}
