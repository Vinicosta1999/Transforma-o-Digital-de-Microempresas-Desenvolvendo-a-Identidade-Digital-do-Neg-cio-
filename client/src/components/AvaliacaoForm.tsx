import { Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface AvaliacaoFormProps {
  onSubmit: (estrelas: number, comentario: string) => void;
  isLoading?: boolean;
}

export default function AvaliacaoForm({ onSubmit, isLoading }: AvaliacaoFormProps) {
  const [estrelas, setEstrelas] = useState(0);
  const [hoverEstrelas, setHoverEstrelas] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (estrelas === 0) {
      alert('Por favor, selecione uma classificação por estrelas');
      return;
    }
    if (comentario.trim().length < 10) {
      alert('O comentário deve ter pelo menos 10 caracteres');
      return;
    }
    onSubmit(estrelas, comentario);
    setEstrelas(0);
    setComentario('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Deixe sua avaliação</h3>

      {/* Seleção de estrelas */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Classificação</label>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setEstrelas(i + 1)}
              onMouseEnter={() => setHoverEstrelas(i + 1)}
              onMouseLeave={() => setHoverEstrelas(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={
                  i < (hoverEstrelas || estrelas)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }
              />
            </button>
          ))}
        </div>
        {estrelas > 0 && <p className="text-sm text-muted-foreground mt-2">{estrelas} estrela(s)</p>}
      </div>

      {/* Campo de comentário */}
      <div className="mb-6">
        <label htmlFor="comentario" className="block text-sm font-medium mb-2">
          Seu comentário
        </label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Compartilhe sua experiência com este produto..."
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {comentario.length}/500 caracteres
        </p>
      </div>

      {/* Botão de envio */}
      <Button
        type="submit"
        disabled={isLoading || estrelas === 0 || comentario.trim().length < 10}
        className="w-full"
      >
        {isLoading ? 'Enviando...' : 'Enviar Avaliação'}
      </Button>
    </form>
  );
}
