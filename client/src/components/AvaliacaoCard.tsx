import { Avaliacao } from '@/types';
import { Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface AvaliacaoCardProps {
  avaliacao: Avaliacao;
  onUtilClick?: (avaliacaoId: string) => void;
}

export default function AvaliacaoCard({ avaliacao, onUtilClick }: AvaliacaoCardProps) {
  const [utilCount, setUtilCount] = useState(avaliacao.util_count || 0);
  const [jaClicou, setJaClicou] = useState(false);

  const handleUtilClick = () => {
    if (!jaClicou) {
      setUtilCount(utilCount + 1);
      setJaClicou(true);
      onUtilClick?.(avaliacao.id);
    }
  };

  const data = new Date(avaliacao.data_criacao).toLocaleDateString('pt-BR');

  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
      {/* Cabeçalho com estrelas e nome */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < avaliacao.estrelas ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
              />
            ))}
          </div>
          <p className="font-semibold text-sm">{avaliacao.usuario_nome}</p>
          <p className="text-xs text-muted-foreground">{data}</p>
        </div>
      </div>

      {/* Comentário */}
      <p className="text-sm text-foreground mb-4 leading-relaxed">{avaliacao.comentario}</p>

      {/* Botão "Útil" */}
      <button
        onClick={handleUtilClick}
        disabled={jaClicou}
        className={`flex items-center gap-2 text-xs px-3 py-1 rounded transition-colors ${
          jaClicou
            ? 'bg-muted text-muted-foreground cursor-default'
            : 'bg-secondary text-secondary-foreground hover:brightness-110'
        }`}
      >
        <ThumbsUp size={14} />
        Útil ({utilCount})
      </button>
    </div>
  );
}
