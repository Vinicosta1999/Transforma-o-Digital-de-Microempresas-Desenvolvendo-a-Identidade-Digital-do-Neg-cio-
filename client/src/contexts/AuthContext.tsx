import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '@/types';

interface AuthContextType {
  usuario: Usuario | null;
  isAutenticado: boolean;
  isCarregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  registrar: (email: string, nome: string, senha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isCarregando, setIsCarregando] = useState(true);

  // Simular carregamento do usuário do localStorage
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario_case_point');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setIsCarregando(false);
  }, []);

  const login = async (email: string, senha: string) => {
    // Simulação de login - em produção, chamar API Supabase
    const usuarioMock: Usuario = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      nome: email.split('@')[0],
      criado_em: new Date().toISOString(),
    };
    setUsuario(usuarioMock);
    localStorage.setItem('usuario_case_point', JSON.stringify(usuarioMock));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario_case_point');
  };

  const registrar = async (email: string, nome: string, senha: string) => {
    // Simulação de registro - em produção, chamar API Supabase
    const usuarioMock: Usuario = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      nome,
      criado_em: new Date().toISOString(),
    };
    setUsuario(usuarioMock);
    localStorage.setItem('usuario_case_point', JSON.stringify(usuarioMock));
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAutenticado: !!usuario,
        isCarregando,
        login,
        logout,
        registrar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
