# Case Point — Plataforma de E-commerce de Acessórios Eletrônicos

Plataforma de e-commerce completa e funcional para a loja Case Point, especializada em acessórios premium para dispositivos eletrônicos (cabos, carregadores, películas de proteção).

## 🎯 Visão Geral

**Case Point** é uma plataforma de e-commerce moderna construída com React 19, Tailwind CSS v4 e Supabase. Oferece uma experiência de compra completa com catálogo de produtos, carrinho, checkout com cálculo de frete em tempo real, autenticação de usuários e painel administrativo.

### Design: Premium Tech Store

- **Paleta de Cores**: Fundo escuro (#0F172A), azul-índigo primário (#4F46E5), amarelo-ouro acento (#FBBF24)
- **Tipografia**: Plus Jakarta Sans (display/body) + JetBrains Mono (preços/código)
- **Estilo**: Minimalista elegante com sombras profundas e transições suaves
- **Responsividade**: Mobile-first, totalmente responsivo

## 📋 Funcionalidades

### ✅ Implementadas

- **Catálogo de Produtos**
  - Grid responsivo de produtos com imagens geradas por IA
  - Filtros por categoria (Cabos, Carregadores, Películas)
  - Busca por nome
  - Filtro por faixa de preço
  - Ordenação (Preço, Nome, Mais Recentes)
  - 10 produtos fictícios do Case Point

- **Carrinho de Compras**
  - Adicionar/remover itens
  - Atualizar quantidade
  - Cálculo automático de total
  - Persistência em localStorage
  - Badge com número de itens no header

- **Checkout**
  - Etapas: Endereço → Frete → Pagamento → Confirmação
  - Cálculo de frete simulado (pronto para integração Melhor Envio)
  - Formulário de endereço completo
  - Simulação de processamento de cartão
  - Confirmação de pedido

- **Autenticação**
  - Login/Registro de usuários
  - Persistência de sessão em localStorage
  - Proteção de rotas (checkout requer autenticação)
  - Contexto de autenticação global

- **Painel Administrativo**
  - Dashboard com estatísticas
  - Gerenciamento de produtos
  - Gerenciamento de pedidos
  - Gerenciamento de clientes
  - Tabela de produtos recentes

- **Páginas Adicionais**
  - Home com hero section e produtos em destaque
  - Sobre (missão, visão, valores, equipe)
  - Contato (formulário, informações, FAQ)

- **Componentes UI**
  - Header com navegação
  - Cards de produto com favoritos
  - Modais e diálogos
  - Toast notifications
  - Formulários responsivos

### 🔄 Integração Melhor Envio

Serviço `melhorEnvio.ts` com métodos para:
- Cálculo de frete em tempo real
- Validação de CEP
- Formatação de CEP
- Geração de etiquetas
- Rastreamento de pedidos
- Listagem de transportadoras

**Status**: Simulado localmente. Pronto para integração com API v2 do Melhor Envio.

## 🏗️ Arquitetura

### Estrutura de Pastas

```
client/
├── src/
│   ├── pages/              # Páginas principais
│   │   ├── Home.tsx
│   │   ├── Catalogo.tsx
│   │   ├── Carrinho.tsx
│   │   ├── Login.tsx
│   │   ├── Checkout.tsx
│   │   ├── Admin.tsx
│   │   ├── Sobre.tsx
│   │   ├── Contato.tsx
│   │   └── NotFound.tsx
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Header.tsx
│   │   ├── ProdutoCard.tsx
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/           # React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── CarrinhoContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/               # Utilitários
│   │   ├── produtos.ts    # Catálogo de produtos
│   │   └── melhorEnvio.ts # Integração Melhor Envio
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Roteamento principal
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globais
├── index.html             # HTML template
└── public/                # Assets estáticos
```

### Contextos Globais

- **AuthContext**: Gerencia autenticação e dados do usuário
- **CarrinhoContext**: Gerencia carrinho de compras
- **ThemeContext**: Gerencia tema (dark/light)

### Tipos TypeScript

```typescript
interface Produto { ... }        // Produto do catálogo
interface ItemCarrinho { ... }   // Item no carrinho
interface Carrinho { ... }       // Estado do carrinho
interface Usuario { ... }        // Dados do usuário
interface Pedido { ... }         // Pedido realizado
interface CalculoFrete { ... }   // Cálculo de frete
```

## 🎨 Design System

### Cores (Tailwind OKLCH)

- **Primary**: #4F46E5 (Azul-Índigo)
- **Accent**: #FBBF24 (Amarelo-Ouro)
- **Background**: #0F172A (Azul Escuro)
- **Card**: #1E293B (Cinza Escuro)
- **Destructive**: #EF4444 (Vermelho)

### Componentes CSS

- `.product-card`: Card de produto com hover
- `.product-image`: Imagem com fundo branco
- `.product-info`: Informações do produto
- `.product-price`: Preço em fonte mono
- `.btn-primary`: Botão primário
- `.btn-secondary`: Botão secundário
- `.badge`: Badge de categoria/status
- `.input-field`: Campo de entrada

## 🚀 Como Usar

### Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview de produção
pnpm preview
```

### Fluxo de Compra

1. **Navegue pelo Catálogo**
   - Acesse `/catalogo`
   - Use filtros para encontrar produtos
   - Clique em "Adicionar ao Carrinho"

2. **Revise o Carrinho**
   - Acesse `/carrinho`
   - Ajuste quantidades ou remova itens
   - Clique em "Ir para Checkout"

3. **Faça Login**
   - Acesse `/login`
   - Crie uma conta ou faça login
   - Dados salvos em localStorage

4. **Complete o Checkout**
   - Preencha endereço de entrega
   - Calcule frete (Sedex, PAC, Sedex 12)
   - Insira dados do cartão
   - Confirme pedido

5. **Acesse o Painel Admin**
   - Após login, clique em "Minha Conta"
   - Veja dashboard com estatísticas
   - Gerencie produtos, pedidos e clientes

## 📦 Dados de Teste

### Produtos Fictícios

10 produtos Case Point pré-carregados:
- Cabos (Rede, HDMI, Lightning, USB-C)
- Carregadores (65W, Automotivo, Lightning)
- Películas (3D, Vidro Temperado, Câmera)

### Usuários de Teste

Use qualquer email e senha para testar. Dados salvos em localStorage.

### CEPs para Teste de Frete

- `01310-100` - São Paulo, SP
- `20040020` - Rio de Janeiro, RJ
- `30130010` - Belo Horizonte, MG

## 🔌 Integração Melhor Envio

### Próximos Passos

1. **Obter Token da API**
   - Acesse https://www.melhorenvio.com.br/api/v2/docs
   - Gere um token de autenticação

2. **Configurar Variáveis de Ambiente**
   ```
   VITE_MELHORENVIO_TOKEN=seu_token_aqui
   ```

3. **Atualizar `melhorEnvio.ts`**
   - Substituir simulação por chamadas reais à API
   - Implementar tratamento de erros robusto
   - Adicionar cache de resultados

4. **Testar Integração**
   - Validar cálculos de frete
   - Testar geração de etiquetas
   - Implementar rastreamento

## 📱 Responsividade

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

Todos os componentes são totalmente responsivos com breakpoints Tailwind.

## ♿ Acessibilidade

- Semântica HTML5 correta
- Labels em formulários
- Contraste de cores adequado
- Navegação por teclado
- ARIA labels onde necessário

## 🔐 Segurança

**Nota**: Implementação atual é para demonstração. Em produção:

- Usar Supabase Auth para autenticação real
- Implementar HTTPS
- Validar dados no backend
- Usar variáveis de ambiente seguras
- Implementar rate limiting
- Adicionar CSRF protection

## 📊 Dados Persistidos

- **Carrinho**: localStorage (`carrinho_case_point`)
- **Usuário**: localStorage (`usuario_case_point`)
- **Tema**: localStorage (ThemeContext)

## 🛠️ Tecnologias

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, OKLCH colors
- **Routing**: Wouter
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Forms**: React Hook Form
- **State Management**: React Context + Hooks

## 📝 Próximas Melhorias

- [ ] Integração real com Supabase
- [ ] Integração completa com Melhor Envio API
- [ ] Sistema de pagamento (Stripe/PagSeguro)
- [ ] Histórico de pedidos
- [ ] Avaliações de produtos
- [ ] Wishlist persistente
- [ ] Cupons de desconto
- [ ] Newsletter
- [ ] Analytics
- [ ] Testes automatizados (Jest + React Testing Library)

## 📄 Licença

MIT © 2026 Case Point

## 👥 Suporte

- Email: luiz.fernando.disney@hotmail.com
- Telefone: (11) 99132-5145
- Horário: Seg-Sex 9h às 18h

---

**Desenvolvido com ❤️ para UNIVESP Grupo 08 - Projeto Integrador 2026**
