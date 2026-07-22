# Nutridash

Dashboard de nutrição em React, convertido a partir do protótipo HTML original
em `../Nutridash`. Toda a estilização foi migrada para Tailwind CSS (com daisyUI
v5 como plugin) e a UI foi quebrada em componentes reutilizáveis.

## Stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- daisyUI v5 (plugin do Tailwind)
- @phosphor-icons/react para os ícones
- ESLint 9 (flat config) + typescript-eslint

## Estrutura

```
src/
├── components/
│   ├── cards/      # AddMealCard, TotalMealsCard
│   ├── forms/      # FormField
│   ├── layout/     # Sidebar, SidebarBrand, SidebarItem, Header
│   ├── macros/     # MacroStat, MacroStatsBar
│   ├── meals/      # MealActionButton, MealFab, MealsList/Table…
│   └── modal/      # AddMealModal e suas sub-partes
├── constants/      # MEAL_CATEGORIES, NAV_ITEMS
├── data/           # mocks de usuário, macros e refeições
├── hooks/          # useMealModal
├── pages/          # DashboardPage
├── styles/         # tailwind + tema sinutre
├── types/          # tipos de domínio
├── App.tsx
└── main.tsx
```

## Scripts

```bash
npm install     # instala dependências
npm run dev     # servidor de desenvolvimento (vite)
npm run build   # build de produção (tsc -b + vite build)
npm run lint    # ESLint em todo o projeto
npm run preview # preview do build
```

## Tema

O tema customizado `sinutre` (paleta verde) está definido em
`src/styles/theme.css` usando a sintaxe `@plugin 'daisyui/theme'` do daisyUI v5.

## Requisitos Obrigatórios

[x] Repositórios públicos no GitHub (Backend & Frontend).
[x] MVP de Backend em produção no Railway.
[x] MVP de Frontend em produção na Vercel.

## Requisitos Complementares

[x] 01: Alteração de alimentos cadastrados (CRUD completo).
[ ] 02: Exclusão de alimentos cadastrados (Em implementação).
[ ] 04: Cadastro de dados complementares (meta calórica, altura, peso) com validação de dados.
[ ] 07: Sistema de alerta visual ao exceder a meta calórica diária.
[ ] 11: Autenticação segura com funcionalidade de Logout.
[ ] 12: Interface personalizada com tema responsivo.

## Funcionalidades Extras (Diferenciais de UX/UI)

Gestão Dinâmica de Refeições: Implementação de menu contextual (ações) por refeição, permitindo edição e exclusão rápida para correção de dados, garantindo maior autonomia ao usuário.

Página de Métricas e Estatísticas: Dashboard analítico integrado à biblioteca Recharts, permitindo a visualização gráfica do consumo calórico em tempo real.

Arquitetura de Rotas: Refatoração e estruturação das rotas de API para garantir o isolamento lógico das requisições (POST/PUT/GET), eliminando conflitos de Foreign Key e garantindo a integridade dos dados vinculados ao userId.

## Desafios Técnicos Superados

Durante o desenvolvimento do MVP, um dos principais desafios foi a estruturação das rotas de API e a integração do Front-end com o back-end via Railway. A resolução envolveu:

Refatoração de API: Correção do aninhamento de rotas (POST/PUT), o que resolvia erros de violação de chave estrangeira (P2003).

Configuração CORS: Ajuste de permissões para permitir que a aplicação na Vercel consumisse dados do servidor em produção de forma segura.

Gestão de Estado: Sincronização eficiente entre o banco de dados e a interface para que as alterações fossem refletidas instantaneamente sem recarregamento forçado.

## Links de Acesso

Frontend (Live): https://sinutre-frontend-phi.vercel.app

Backend (API): https://sinutre-backend-production-5e5d.up.railway.app

---