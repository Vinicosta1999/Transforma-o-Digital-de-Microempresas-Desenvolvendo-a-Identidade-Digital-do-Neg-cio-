import { useState } from 'react';
import { aplicarCupom, removerCupomAplicado, obterCupomAplicado, obterCuponsDisponiveis, formatarMensagemCupom } from '@/lib/cupomService';
import { Ticket, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AplicarCupomProps {
  total_compra: number;
  onCupomAplicado?: (desconto: number) => void;
}

export default function AplicarCupom({ total_compra, onCupomAplicado }: AplicarCupomProps) {
  const [codigo, setCodigo] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(obterCupomAplicado());
  const [mostraCuponsDisponiveis, setMostraCuponsDisponiveis] = useState(false);

  const handleAplicarCupom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    const resultado = aplicarCupom(codigo, total_compra);

    if (resultado.sucesso && resultado.cupom_aplicado) {
      setCupomAplicado(resultado.cupom_aplicado);
      setCodigo('');
      toast.success(formatarMensagemCupom(
        { codigo: resultado.cupom_aplicado.codigo } as any,
        resultado.cupom_aplicado.desconto_valor
      ));
      onCupomAplicado?.(resultado.cupom_aplicado.desconto_valor);
    } else {
      toast.error(resultado.erro || 'Erro ao aplicar cupom');
    }
  };

  const handleRemoverCupom = () => {
    removerCupomAplicado();
    setCupomAplicado(null);
    setCodigo('');
    toast.success('Cupom removido');
    onCupomAplicado?.(0);
  };

  const cuponsDisponiveis = obterCuponsDisponiveis();

  return (
    <div className="space-y-4">
      {/* Cupom Aplicado */}
      {cupomAplicado && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Check size={20} className="text-green-500" />
            <div>
              <p className="font-semibold text-green-500">Cupom aplicado!</p>
              <p className="text-sm text-muted-foreground">
                {cupomAplicado.codigo} - Desconto de R$ {cupomAplicado.desconto_valor.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoverCupom}
            className="text-green-500 hover:brightness-110 transition"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Formulário de Cupom */}
      {!cupomAplicado && (
        <form onSubmit={handleAplicarCupom} className="space-y-2">
          <label className="block text-sm font-semibold">Código de Cupom</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite seu código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-6">
              <Ticket size={18} />
            </button>
          </div>
        </form>
      )}

      {/* Cupons Disponíveis */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => setMostraCuponsDisponiveis(!mostraCuponsDisponiveis)}
          className="text-sm text-primary hover:brightness-110 transition font-semibold"
        >
          {mostraCuponsDisponiveis ? '▼' : '▶'} Ver cupons disponíveis ({cuponsDisponiveis.length})
        </button>

        {mostraCuponsDisponiveis && (
          <div className="mt-4 space-y-2">
            {cuponsDisponiveis.length > 0 ? (
              cuponsDisponiveis.map((cupom) => (
                <div
                  key={cupom.id}
                  className="bg-secondary rounded-lg p-3 cursor-pointer hover:bg-secondary/80 transition"
                  onClick={() => {
                    setCodigo(cupom.codigo);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{cupom.codigo}</p>
                      <p className="text-xs text-muted-foreground">{cupom.descricao}</p>
                    </div>
                    <div className="text-right">
                      {cupom.desconto_percentual > 0 ? (
                        <p className="font-bold text-primary">{cupom.desconto_percentual}% OFF</p>
                      ) : (
                        <p className="font-bold text-primary">R$ {cupom.desconto_fixo.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                  {cupom.valor_minimo && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Mínimo: R$ {cupom.valor_minimo.toFixed(2)}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum cupom disponível no momento</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
