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

A API atualmente não possui testes configurados.  

---

## Arquitetura por Feature

### Princípios
- `app/` → apenas rotas e composição
- `features/` → domínio da aplicação (UI + dados)
- `shared/` → componentes reutilizáveis

Essa separação:
- reduz acoplamento
- facilita testes
- melhora manutenção e escalabilidade

---

## Estrutura do Web

```
apps/web/src
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── items/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── me/
│       └── page.tsx
│
├── features/
│   ├── home/
│   │   ├── api/
│   │   │   └── home.client.ts
│   │   ├── components/
│   │   │   ├── HomePage.tsx
│   │   │   ├── HomeFilters.tsx
│   │   │   ├── CollectionGrid.tsx
│   │   │   └── ItemCard.tsx
│   │   ├── styles/
│   │   │   └── *.module.css
│   │   └── index.ts
│   │
│   ├── item-detail/
│   │   ├── api/
│   │   │   └── item-detail.client.ts
│   │   ├── components/
│   │   │   └── ItemDetailPage.tsx
│   │   ├── styles/
│   │   │   └── ItemDetailPage.module.css
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.client.ts
│   │   ├── session.ts
│   │   └── components/
│   │       └── LoginPage.tsx
│   │
│   └── profile/
│       ├── api/
│       │   └── me.client.ts
│       └── components/
│           └── MePage.tsx
│
└── shared/
    └── ui/
        ├── container/
        │   └── Container.tsx
        └── profile/
            └── profile.shortcut.tsx
```

---

## Estrutura da API

```
apps/api/src
├── server.ts
├── app.ts
├── routes/
│   └── index.ts
└── features/
    └── items/
        ├── items.routes.ts
        ├── items.controller.ts
        ├── items.service.ts
        ├── items.data.ts
        └── items.types.ts
```

---

## Estratégia de Renderização

### Home — SSG
- Conteúdo estável
- Performance máxima
- SEO
- Filtros no client

### Detalhe — ISR
- `revalidate = 86400`
- Atualizações sem rebuild
- SEO + performance

### Perfil — CSR
- Depende de token localStorage
- UX de aplicação

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
