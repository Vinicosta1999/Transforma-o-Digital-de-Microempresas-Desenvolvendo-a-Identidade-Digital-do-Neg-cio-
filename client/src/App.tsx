import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CarrinhoProvider } from "./contexts/CarrinhoContext";
import Header from "./components/Header";

// Páginas
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Carrinho from "./pages/Carrinho";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";
import ConfirmacaoPedido from "./pages/ConfirmacaoPedido";
import Rastreamento from "./pages/Rastreamento";
import DashboardVendedor from "./pages/DashboardVendedor";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalogo" component={Catalogo} />
      <Route path="/produto/:id" component={ProdutoDetalhes} />
      <Route path="/carrinho" component={Carrinho} />
      <Route path="/login" component={Login} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/pedido/:id" component={ConfirmacaoPedido} />
      <Route path="/rastreamento" component={Rastreamento} />
      <Route path="/dashboard-vendedor" component={DashboardVendedor} />
      <Route path="/admin" component={Admin} />
      <Route path="/sobre" component={Sobre} />
      <Route path="/contato" component={Contato} />
      <Route path="/404" component={NotFound} />
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <CarrinhoProvider>
            <TooltipProvider>
              <Toaster />
              <div className="flex flex-col min-h-screen bg-[#0f172a]">
                <Header />
                <main className="flex-1">
                  <Router />
                </main>
                <footer className="bg-[#0f172a] border-t border-slate-800 py-8 mt-16 text-white">
                  <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                      <div>
                        <h3 className="font-bold mb-4">Sobre</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                          <li><a href="#" className="hover:text-indigo-400 transition">Sobre Nós</a></li>
                          <li><a href="#" className="hover:text-indigo-400 transition">Carreiras</a></li>
                          <li><a href="#" className="hover:text-indigo-400 transition">Blog</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-4">Suporte</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                          <li><a href="#" className="hover:text-indigo-400 transition">Contato</a></li>
                          <li><a href="#" className="hover:text-indigo-400 transition">FAQ</a></li>
                          <li><a href="#" className="hover:text-indigo-400 transition">Rastreamento</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                          <li><a href="#" className="hover:text-indigo-400 transition">Privacidade</a></li>
                          <li><a href="#" className="hover:text-indigo-400 transition">Termos</a></li>
                          <li><a href="#" className="hover:text-indigo-400 transition">Cookies</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-4">Redes Sociais</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                          <li><a href="#" className="hover:text-indigo-400 transition">Facebook</a></li>
                          <li><a href="#" className="hover:text-indigo-400 transition">Instagram</a></li>
                          <li><a href="#" className="hover:text-indigo-400 transition">Twitter</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                      <p>&copy; 2026 Case Point. Todos os direitos reservados.</p>
                    </div>
                  </div>
                </footer>
              </div>
            </TooltipProvider>
          </CarrinhoProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
