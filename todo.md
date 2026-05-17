# Case Point E-commerce - TODO

## Migração de Páginas
- [x] Copiar todas as páginas do projeto original
- [x] Atualizar App.tsx com todas as rotas
- [x] Testar navegação entre páginas
- [x] Validar componentes Header e Footer

## Implementação de Proxy Frenet
- [x] Criar rota /api/frenet no servidor Express
- [x] Implementar proxy server-side para API Frenet
- [x] Configurar variável de ambiente FRENET_API_TOKEN
- [x] Testar comunicação com API Frenet

## Cálculo de Frete
- [x] Definir peso e dimensões reais dos produtos
- [x] Implementar cálculo de frete com dados reais
- [x] Retornar múltiplas opções de entrega
- [x] Permitir seleção de opção de frete pelo utilizador
- [x] Validar cálculo de frete no checkout

## Exibição de Nomes de Produtos
- [x] Corrigir exibição no Checkout
- [x] Corrigir exibição na Confirmação de Pedido
- [x] Corrigir exibição na mensagem WhatsApp
- [x] Testar em todos os pontos de venda

## Autenticação e Carrinho Persistente
- [x] Implementar contexto de autenticação
- [x] Persistir carrinho no localStorage/banco de dados
- [x] Validar fluxo de login
- [x] Testar restauração de carrinho após logout/login

## Fluxo de Checkout Completo
- [x] Validar formulário de endereço
- [x] Implementar seleção de frete
- [x] Validar método de pagamento
- [x] Testar confirmação de pedido

## Testes e Validação
- [x] Testar todas as páginas
- [x] Validar cálculo de frete com dados reais (vitest)
- [x] Testar fluxo de compra completo
- [x] Validar mensagens de erro
- [x] Testar responsividade em mobile
