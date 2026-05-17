import { useState } from 'react';
import { useLocation } from 'wouter';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, registrar } = useAuth();
  const [isRegistro, setIsRegistro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      if (isRegistro) {
        if (!formData.nome) {
          toast.error('Por favor, preencha o nome');
          return;
        }
        await registrar(formData.email, formData.nome, formData.senha);
        toast.success('Conta criada com sucesso!');
      } else {
        await login(formData.email, formData.senha);
        toast.success('Login realizado com sucesso!');
      }

      setLocation('/');
    } catch (erro) {
      toast.error(isRegistro ? 'Erro ao criar conta' : 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="bg-card p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">CP</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {isRegistro ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-muted-foreground">
              {isRegistro
                ? 'Crie sua conta para começar a comprar'
                : 'Faça login para acessar sua conta'}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistro && (
              <div>
                <label className="block text-sm font-medium mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full disabled:opacity-50"
            >
              {carregando
                ? 'Processando...'
                : isRegistro
                  ? 'Criar Conta'
                  : 'Entrar'}
            </button>
          </form>

          {/* Toggle Registro/Login */}
          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-muted-foreground">
              {isRegistro ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              <button
                onClick={() => setIsRegistro(!isRegistro)}
                className="text-primary font-semibold hover:underline ml-2"
              >
                {isRegistro ? 'Entrar' : 'Criar Conta'}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-secondary rounded-lg text-sm text-muted-foreground">
            <p className="font-semibold mb-2">🔐 Modo Demo</p>
            <p>Use qualquer email e senha para testar. Os dados são salvos localmente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
