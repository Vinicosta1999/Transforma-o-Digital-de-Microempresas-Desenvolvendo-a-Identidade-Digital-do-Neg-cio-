import { useState } from 'react';
import { Link } from 'wouter';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { totalItens } = useCarrinho();
  const { usuario, isAutenticado, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-slate-800 shadow-lg">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              CP
            </div>
            <span className="text-white">Case Point</span>
          </div>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/catalogo">
            <span className="text-slate-300 hover:text-indigo-400 transition font-medium cursor-pointer">Catálogo</span>
          </Link>
          <Link href="/sobre">
            <span className="text-slate-300 hover:text-indigo-400 transition font-medium cursor-pointer">Sobre</span>
          </Link>
          <Link href="/contato">
            <span className="text-slate-300 hover:text-indigo-400 transition font-medium cursor-pointer">Contato</span>
          </Link>
        </nav>

        {/* Ações Direita */}
        <div className="flex items-center gap-4">
          {/* Carrinho */}
          <Link href="/carrinho">
            <div className="relative p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer text-slate-300">
              <ShoppingCart className="w-6 h-6" />
              {totalItens > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItens}
                </span>
              )}
            </div>
          </Link>

          {/* Usuário */}
          {isAutenticado ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-slate-400">{usuario?.nome}</span>
              <Link href="/admin">
                <div className="p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer text-slate-300">
                  <User className="w-6 h-6" />
                </div>
              </Link>
              <button
                onClick={logout}
                className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300"
                title="Sair"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <div className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors">
                <User className="w-4 h-4" />
                Entrar
              </div>
            </Link>
          )}

          {/* Menu Mobile */}
          <button
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition text-slate-300"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="md:hidden bg-[#1e293b] border-t border-slate-800 p-4 space-y-3">
          <Link href="/catalogo">
            <span className="block text-slate-300 hover:text-indigo-400 transition font-medium py-2 cursor-pointer">
              Catálogo
            </span>
          </Link>
          <Link href="/sobre">
            <span className="block text-slate-300 hover:text-indigo-400 transition font-medium py-2 cursor-pointer">
              Sobre
            </span>
          </Link>
          <Link href="/contato">
            <span className="block text-slate-300 hover:text-indigo-400 transition font-medium py-2 cursor-pointer">
              Contato
            </span>
          </Link>
          {isAutenticado ? (
            <>
              <Link href="/admin">
                <span className="block text-slate-300 hover:text-indigo-400 transition font-medium py-2 cursor-pointer">
                  Minha Conta
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuAberto(false);
                }}
                className="w-full text-left text-rose-500 font-medium py-2"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login">
              <div className="block bg-indigo-600 hover:bg-indigo-500 text-white text-center py-2 rounded-lg font-bold cursor-pointer transition-colors">Entrar</div>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
