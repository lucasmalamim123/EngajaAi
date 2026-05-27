# Guia de Testes — Plataforma Jurídica
**Ambiente:** Desenvolvimento  
**URL:** https://engaja-ai-theta.vercel.app  
**Data:** 27/05/2026

---

## Contas de Teste

As contas já estão criadas e prontas para uso. Acesse diretamente em:  
**https://engaja-ai-theta.vercel.app/pt-BR/login**

| Perfil | E-mail | Senha |
|---|---|---|
| Cliente | cliente@teste.com | Teste@123 |
| Advogado | advogado@teste.com | Teste@123 |
| Engajador | engajador@teste.com | Teste@123 |
| Admin | admin@teste.com | Teste@123 |

---

## Cartão de Teste (Stripe)

Use estes dados ao efetuar pagamentos — **não é cobrado valor real**.

| Campo | Valor |
|---|---|
| Número | `4242 4242 4242 4242` |
| Validade | qualquer data futura (ex: `12/30`) |
| CVC | qualquer 3 dígitos (ex: `123`) |
| Nome | qualquer nome |

---

## Fluxo de Teste por Perfil

### 1. Cliente
**Login:** https://engaja-ai-theta.vercel.app/pt-BR/login

1. Acesse **Serviços** no menu público e escolha um serviço
2. Preencha os dados do caso e clique em **Contratar**
3. Complete o pagamento com o cartão de teste acima
4. Volte ao painel → **Meus Casos** — o caso deve aparecer com status **Aberto**
5. Acesse **Contratos** — o contrato PDF deve estar disponível para download
6. Acesse **Tickets** → crie um ticket vinculado ao caso
7. Acesse **Documentos** → faça upload de um arquivo

---

### 2. Advogado
**Login:** https://engaja-ai-theta.vercel.app/pt-BR/login

1. Acesse **Casos Disponíveis** — o caso criado pelo cliente deve aparecer
2. Clique em **Aceitar Caso**
3. Acesse **Meus Casos** — o caso deve aparecer com status atualizado
4. Acesse **Tickets** — o ticket criado pelo cliente deve estar visível
5. Responda ao ticket
6. Acesse **Documentos** — os documentos do cliente devem estar visíveis

---

### 3. Engajador
**Login:** https://engaja-ai-theta.vercel.app/pt-BR/login

1. No painel, copie o **link de indicação**
2. Abra o link em uma aba anônima — deve redirecionar para a página de contratação
3. Complete uma contratação via esse link
4. Acesse **Indicações** — o caso deve aparecer no histórico com a comissão estimada

---

### 4. Administrador
**Login:** https://engaja-ai-theta.vercel.app/pt-BR/login

1. Acesse **Usuários** — todos os cadastros devem aparecer com seus perfis
2. Acesse **Casos** — todos os casos criados devem estar listados
3. Acesse **Pagamentos** — os pagamentos efetuados devem aparecer com status **pago**

---

## O que está incluído nesta versão (Etapa 1)

- [x] Cadastro e login — 4 perfis: cliente, advogado, engajador e admin
- [x] Página pública de serviços e fluxo de contratação
- [x] Pagamento via Stripe (modo teste)
- [x] Geração de contrato em PDF após pagamento
- [x] Painel do cliente — casos, contratos, documentos, tickets
- [x] Painel do advogado — casos disponíveis, aceite, meus casos, tickets
- [x] Painel do engajador — link de indicação, histórico
- [x] Painel administrativo — usuários, casos, pagamentos
- [x] Upload de documentos
- [x] Sistema de tickets (mensagens entre cliente e advogado)
- [x] Tradução em 4 idiomas: Português (PT), Português (BR), Inglês, Espanhol
- [x] Layout responsivo (funciona em celular e computador)

---

## Observações

- Este é um ambiente de **desenvolvimento** — os dados podem ser resetados
- Pagamentos são em **modo teste** — nenhuma cobrança real é efetuada
- E-mails transacionais estão ativos (confirmação de pagamento, notificação de novo caso)
- Em caso de dúvida ou problema, entre em contato com o desenvolvedor
