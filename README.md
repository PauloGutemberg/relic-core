# reli-core

# reli-core

Monorepo (npm workspaces) com:
- **apps/web**: Next.js (App Router) + React + TypeScript
- **apps/api**: Express + TypeScript (API mock/local)

O projeto representa uma coleção pessoal de jogos (foco em colecionadores), com listagem, filtros, detalhe por slug, login leve e perfil de usuário.

---

## Scripts

### Web (`apps/web`)

Scripts disponíveis:

```bash
npm run -w apps/web dev        # Next.js dev server (porta 5173)
npm run -w apps/web build      # build de produção
npm run -w apps/web start      # server de produção
npm run -w apps/web lint       # lint do Next
npm run -w apps/web test       # testes unitários (Jest)
npm run -w apps/web test:watch # testes em modo watch
npm run -w apps/web typecheck  # tsc --noEmit
```

Configuração de testes:
- **Jest + next/jest**
- Pasta única de testes: `apps/web/tests`
- Mock centralizado de `next/image`
- Testes focados em **componentes de feature**, não em `page.tsx`

---

### API (`apps/api`)

Scripts disponíveis:

```bash
npm run -w apps/api dev    # API com hot reload (ts-node-dev)
npm run -w apps/api build  # build TypeScript
```  

---

## Variáveis de ambiente

### Web (apps/web/.env.local)
- `AUTH_SECRET=dev-secret-ASUH` → segredo para assinar/verificar o cookie session (HMAC).
- `API_BASE_URL=http://localhost:3001/api` → base da API Express (upstream) usada apenas no server.
- Sem NEXT_PUBLIC_*: o browser nunca chama o Express diretamente. Tudo passa pelo BFF /api/* do Next.

## Arquitetura por Feature

### Princípios
- `app/` → apenas rotas e composição (App Router)
- `lib/` → integração com upstream / utilitários server-only (ex.: home.server.ts)
- `components/` → UI compartilhada

Essa separação:
- reduz acoplamento
- facilita testes
- melhora manutenção e escalabilidade

---

## Autenticação e BFF (Next)

### Visão geral
- O browser chama apenas rotas do Next (/api/...).
- O Next (Node runtime) chama o Express (API_BASE_URL/...).
- Sessão no web é via cookie HttpOnly session (HMAC).

### Endpoints (Web/BFF)
- POST /api/auth/login → faz login no upstream e seta cookie session (HttpOnly).
- POST /api/auth/logout → limpa cookie session.
- GET /api/me → proxy do upstream /me usando Authorization: Bearer <apiToken>
- PATCH /api/me → proxy de update do perfil usando Authorization: Bearer <apiToken>
- GET /api/items → lista itens (proxy)
- GET /api/items/[slug] → detalhe (proxy)

### Cookie session
- Payload assinado (base64url + HMAC SHA-256):

### Middleware (proteção de rotas privadas)
- Se tentar acessar /profile sem cookie session → redireciona para /login?returnTo=/profile
- Se tentar acessar /login com cookie session → redireciona para /profile

## Estrutura do Web

```
apps/web
├── middleware.ts
├── src
│   ├── app
│   │   ├── (marketing)/
│   │   ├── (public)/
│   │   │   ├── home/
│   │   │   ├── items/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (private)/
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── items/route.ts
│   │   │   └── me/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── container/
│   │   ├── footer/
│   │   ├── item-detail/
│   │   └── profile/
│   │       └── profile.shortcut.tsx
│   └── lib
│       ├── session.server.ts
│       ├── session.shared.ts
│       ├── home.server.ts
│       ├── item-detail.server.ts
│       └── me.client.ts
└── tests
```

---

## Estrutura da API

```
apps/api/src
├── server.ts
├── app.ts
├── routes/
│   └── index.ts
├── auth/
│   ├── auth.routes.ts
│   ├── auth.controller.ts
│   └── auth.data.ts
└── items/
    ├── items.routes.ts
    ├── items.controller.ts
    ├── items.service.ts
    └── items.data.ts
```

---

## Estratégia de Renderização

A estratégia por página foi escolhida para equilibrar **performance**, **SEO**, **custo de infra**, **frescor dos dados** e **complexidade operacional**. Em geral:

- **SSG/Cache** quando o dado é estável e serve bem para muitos usuários.
- **ISR** quando o dado muda, mas não exige atualização em tempo real.
- **Dinâmico (SSR/CSR híbrido)** quando o dado é **user-specific** e depende de sessão.

---

### Home — SSG/Cache (build-time + cache)

**Por quê**
- A Home é o principal ponto de entrada e costuma ter o maior tráfego. SSG entrega **TTFB mínimo** e alta taxa de cache.
- Conteúdo de catálogo tende a mudar em baixa frequência (ou é aceitável ficar levemente “stale”), então SSG é um ótimo trade-off.
- Melhora **SEO** e **compartilhamento** (pré-render completo).
- Reduz carga no backend: várias visitas reaproveitam a mesma resposta.

**Como aplicamos**
- Busca server-side com `cache: "force-cache"` (ou equivalente) para permitir cache agressivo.
- Interações/filtragem ficam no client para evitar rebuild a cada mudança de filtro.

**Trade-offs**
- Dados podem ficar desatualizados até um novo deploy/revalidação.
- Se o catálogo mudar muito frequentemente, migramos para ISR (ou SSR) sem reescrever o fluxo.

---

### Detalhe do Item — ISR (`revalidate = 86400`)

**Por quê**
- Páginas de detalhe precisam de **SEO** e carregamento rápido, mas o conteúdo pode receber atualizações (descrição, imagem, tags).
- ISR permite ter “quase SSG”: serve página estática, mas **revalida periodicamente** sem precisar rebuild/deploy.
- Reduz custo: não precisamos SSR a cada request.

**Como aplicamos**
- `revalidate = 86400` (1 dia) como baseline: bom para conteúdo editorial/catálogo.
- `generateStaticParams()` garante que itens conhecidos sejam gerados antecipadamente.
- `notFound()` quando o slug não existe (comportamento correto e cacheável).

**Trade-offs**
- Atualizações podem demorar até o próximo ciclo de revalidação.
- Se houver itens que mudam muito, podemos reduzir `revalidate` ou introduzir revalidação on-demand (webhook) no futuro.

---

### Perfil — Dinâmico (SSR + CSR), user-specific (cookie HttpOnly)

> No nosso caso, perfil **não é SSG/ISR** por ser conteúdo **dependente de sessão**.

**Por quê**
- Dados do perfil são **personalizados** e não devem ser cacheados como HTML estático.
- Auth via **cookie HttpOnly**: o client não tem acesso ao token; a verificação de sessão e o fetch do usuário acontecem via BFF (`/api/me`).
- SSR/CSR híbrido mantém boa UX: o layout pode renderizar rápido, e o dado do usuário pode hidratar via fetch com proteção.

**Como aplicamos**
- Middleware faz “gate” de rota privada (presence-only) e redireciona para `/login?returnTo=/profile`.
- UI do perfil consome `/api/me` e faz `PATCH /api/me` para editar dados.
- Sem token em `localStorage` (reduz risco de XSS e simplifica segurança).

**Trade-offs**
- Mais requests do que uma página estática (inevitável para conteúdo autenticado).
- Complexidade maior do que SSG/ISR, mas isolada no BFF e no fluxo de sessão (mais fácil de evoluir e auditar).

---

### Critérios para evoluir essa estratégia
- Se catálogo ficar mais “vivo”: mover Home para ISR (ou cache com revalidate menor).
- Se detalhe precisar de frescor imediato: usar **revalidação on-demand** (webhook) em vez de reduzir muito o TTL.
- Se perfil precisar de performance extrema: fazer SSR do “me” no server (quando seguro), mantendo o cookie HttpOnly e sem expor token no client.
---

## Styling

- **CSS Modules**
- Escopo local
- Sem runtime extra
- Integração nativa com Next.js

---

## Rodando o projeto

### API
```bash
npm run -w apps/api dev
```

### Web
```bash
npm run -w apps/web dev
```
