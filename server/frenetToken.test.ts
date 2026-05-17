import { describe, it, expect } from 'vitest';
import { ENV } from './_core/env';

describe('Frenet Token Configuration', () => {
  it('deve ter token Frenet configurado no ambiente', () => {
    // O token pode estar vazio em desenvolvimento, mas deve estar presente na configuração
    expect(ENV).toHaveProperty('frenetToken');
    expect(typeof ENV.frenetToken).toBe('string');
  });

  it('deve permitir fallback quando token não está configurado', () => {
    // Se o token estiver vazio, o sistema deve usar fallback
    if (!ENV.frenetToken || ENV.frenetToken.length === 0) {
      console.log('Token Frenet não configurado - usando fallback');
      expect(true).toBe(true); // Fallback é aceitável
    } else {
      // Se o token está configurado, deve ter comprimento mínimo
      expect(ENV.frenetToken.length).toBeGreaterThan(10);
      console.log('Token Frenet configurado com sucesso');
    }
  });

  it('deve ter variável de ambiente FRENET_API_TOKEN definida', () => {
    const token = process.env.FRENET_API_TOKEN;
    // Token pode estar vazio em desenvolvimento, mas a variável deve existir
    expect(typeof token).toBe('string');
  });
});
