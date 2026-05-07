@AGENTS.md

# Plataforma Jurídica — Documentação do Projeto

## Visão Geral

SaaS jurídico com 4 perfis de usuário (cliente, advogado, engajador, admin). Permite contratação de serviços jurídicos com pagamento via Stripe, geração de contratos em PDF, upload de documentos e comunicação por tickets.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2.5 (App Router, Turbopack) |
| Linguagem | TypeScript |
| Banco / Auth | Supabase (PostgreSQL + Supabase Auth) |
| Storage | Supabase Storage |
| Pagamento | Stripe (Checkout Sessions + Webhooks) |
| E-mail | Resend |
| UI | Tailwind CSS v4 + shadcn/ui + Radix |
| Fonte | Poppins (400/500/600/700) via `next/font/google` |
| PDF | @react-pdf/renderer |
| Validação | Zod + React Hook Form |

## Design System

Paleta roxa definida via variáveis CSS OKLCH em `src/app/globals.css`:

- **Primary** `oklch(0.42 0.21 270)` — roxo #3E36B0 (botões, links, sidebar)
- **Background** `oklch(0.97 0.015 265)` — azul muito claro #F4F7FF
- **Accent** `oklch(0.88 0.07 215)` — azul claro #A6DEF7
- **Gradient hero** `linear-gradient(135deg, oklch(0.50 0.28 265) 0%, oklch(0.42 0.21 270) 100%)`
- Sidebar roxa sólida com texto branco

## Internacionalização (i18n)

Todas as rotas vivem sob o segmento dinâmico `[lang]`. Idiomas suportados: `pt-PT` (padrão), `pt-BR`, `en`, `es`.

- **`src/lib/locales.ts`** — constantes de locale (sem `server-only`, importável por client components)
- **`src/lib/i18n.ts`** — re-exporta de `locales.ts` + `getDictionary(locale)` (server-only)
- **`src/messages/*.json`** — dicionários por idioma
- **`src/proxy.ts`** — detecta locale pelo `Accept-Language` e redireciona `/foo` → `/{locale}/foo`
- **`src/components/layout/LanguageSwitcher.tsx`** — `<Select>` com bandeiras (🇵🇹 🇧🇷 🇬🇧 🇪🇸)
- Moeda: EUR com `Intl.NumberFormat(locale, { currency: 'EUR' })`

## Estrutura de Arquivos

```
src/
├── app/
│   ├── layout.tsx                         # Root layout — <html><body>, Poppins
│   ├── page.tsx                           # Redirect para /pt-PT
│   ├── [lang]/
│   │   ├── layout.tsx                     # Valida locale, retorna children
│   │   ├── page.tsx                       # Landing page localizada
│   │   ├── (public)/
│   │   │   ├── layout.tsx                 # Header público
│   │   │   ├── servicos/page.tsx          # Listagem de serviços
│   │   │   └── contratar/[id]/            # Fluxo de contratação + ContratarForm
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                 # Layout dois painéis (roxo + form)
│   │   │   ├── login/page.tsx
│   │   │   ├── cadastro/page.tsx
│   │   │   └── recuperar-senha/page.tsx
│   │   ├── (cliente)/
│   │   │   ├── layout.tsx                 # Carrega perfil, passa navLabels traduzidos
│   │   │   └── cliente/dashboard/
│   │   │       ├── page.tsx               # Visão geral
│   │   │       ├── casos/                 # Listagem + detalhe [id]
│   │   │       ├── contratos/             # Lista + ContratoUpload
│   │   │       ├── documentos/            # Lista + DocumentUpload
│   │   │       └── tickets/               # Lista + NovoTicketForm + detalhe [id]
│   │   ├── (advogado)/
│   │   │   ├── layout.tsx
│   │   │   └── advogado/dashboard/
│   │   │       ├── page.tsx
│   │   │       ├── casos-disponiveis/     # Lista + AceitarCasoButton
│   │   │       ├── meus-casos/
│   │   │       ├── documentos/
│   │   │       └── tickets/               # Lista + detalhe [id]
│   │   ├── (engajador)/
│   │   │   ├── layout.tsx
│   │   │   └── engajador/dashboard/
│   │   │       ├── page.tsx               # + CopyButton
│   │   │       └── indicacoes/
│   │   └── (admin)/
│   │       ├── layout.tsx
│   │       └── admin/dashboard/
│   │           ├── page.tsx
│   │           ├── usuarios/
│   │           ├── casos/
│   │           └── pagamentos/
│   └── api/
│       ├── pagamentos/route.ts            # Cria Stripe Checkout Session
│       ├── webhooks/stripe/route.ts       # Webhook: cria caso + pagamento
│       └── contratos/route.tsx            # Gera PDF do contrato
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx            # Sidebar + header, recebe navLabels: NavLabels
│   │   └── LanguageSwitcher.tsx           # Select com bandeiras
│   ├── shared/
│   │   └── TicketChat.tsx
│   └── ui/                                # shadcn/ui components
├── lib/
│   ├── locales.ts                         # locales, defaultLocale, hasLocale (sem server-only)
│   ├── i18n.ts                            # getDictionary (server-only)
│   ├── use-lang.ts                        # Hook client para ler lang da URL
│   ├── supabase/client.ts                 # Cliente browser
│   ├── supabase/server.ts                 # Cliente server (cookies)
│   ├── stripe.ts
│   ├── resend.ts
│   └── utils.ts                           # cn, formatCurrency/Date/DateTime, status labels
├── messages/
│   ├── pt-PT.json
│   ├── pt-BR.json
│   ├── en.json
│   └── es.json
├── types/
│   └── database.ts                        # Tipos TypeScript do schema Supabase
├── proxy.ts                               # Lógica de middleware (locale + auth guard)
└── middleware.ts                          # Chama proxy()
supabase/
├── migrations/001_initial_schema.sql      # Schema completo (profiles, cases, tickets…)
└── seed.sql                               # Tipos de serviço iniciais
```

## Banco de Dados (Supabase)

Tabelas principais (ver migration completa em `supabase/migrations/001_initial_schema.sql`):

| Tabela | Descrição |
|---|---|
| `profiles` | Estende `auth.users` — role: `client \| lawyer \| engager \| admin` |
| `lawyers` | OAB, especialidades, status de aprovação |
| `engagers` | Código de indicação, taxa de comissão |
| `service_types` | Catálogo de serviços com preço |
| `cases` | Caso jurídico central — status: `pending → open → in_progress → completed \| cancelled` |
| `case_assignments` | Aceite de casos por advogados |
| `contracts` | Contrato PDF no Storage |
| `payments` | Pagamentos Stripe |
| `documents` | Documentos enviados (Storage) |
| `tickets` | Comunicação cliente ↔ advogado |
| `ticket_messages` | Mensagens de um ticket |

RLS habilitada em todas as tabelas.

## Proteção de Rotas

O `src/proxy.ts` (chamado pelo `src/middleware.ts`) faz:
1. Redireciona URLs sem prefixo de locale para `/{locale}/...` (detectado via `Accept-Language`)
2. Protege rotas de role: `/cliente/*` → `client`, `/advogado/*` → `lawyer`, etc.
3. Redireciona usuário autenticado que acessa `/login` ou `/cadastro` para o dashboard correto

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## Status das Etapas

### Etapa 1 — Estrutura Base ✅ CONCLUÍDA

- [x] Schema SQL completo com RLS
- [x] Clientes Supabase (browser + server)
- [x] Middleware de proteção de rotas por role
- [x] Tipos TypeScript do schema
- [x] Autenticação (login, cadastro, recuperar senha)
- [x] Página pública de serviços
- [x] Fluxo de contratação com Stripe Checkout
- [x] Webhook Stripe → criação de caso + pagamento + PDF
- [x] Painel do cliente (casos, contratos, documentos, tickets)
- [x] Painel do advogado (casos disponíveis, aceite, meus casos, tickets)
- [x] Painel do engajador (link de indicação, histórico)
- [x] Painel admin (usuários, casos, pagamentos)
- [x] Design system roxo (Poppins, gradient hero, sidebar roxa)
- [x] i18n completo — pt-PT / pt-BR / en / es em todas as rotas e componentes
- [x] Seletor de idioma com bandeiras no header

### Etapa 2 — A definir

### Etapa 3 — A definir
