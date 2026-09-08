# Faturamais — Plataforma de Faturamento SaaS

Projeto de portfólio da ExpoStacker: sistema de faturamento e gestão para e-commerce.

## Stack

- HTML5 semântico
- CSS3 com variáveis e design tokens
- JavaScript vanilla (ES6+, IIFE)
- Persistência dos dados no `localStorage`
- Deploy estático no Cloudflare Pages via GitHub Actions

## Estrutura

- `index.html` — landing page de marketing
- `app.html` — dashboard/SPA demonstrativo
- `style.css` — estilos unificados
- `app.js` — lógica do dashboard (router, helpers, shell)
- `views.js` — views de todas as rotas
- `data.js` — data model central e `computeMetrics`
- `build.js` — copia os assets para `out/`

## Comandos

```bash
npm install
npm run build    # gera out/
npm run serve    # http://localhost:3000  (acessar /app.html localmente)
npm run lint     # verifica qualidade do JS
npm run test     # build + testes E2E com Playwright
npm run test:e2e # só os testes E2E
```

## Acesso local

A SPA é carregada por `app.html` com hash-router (`/#/dashboard`).

- `http://localhost:3000` — landing page
- `http://localhost:3000/app.html` — dashboard

Em produção (Cloudflare Pages) a pretty URL `/app` redireciona para `app.html`.

## Testes

- `tests/functional.spec.js` — valida landing, carregamento de todas as rotas, fluxo cliente/pedido/documento e coerência dos cálculos financeiros.

## Dados e limites

- Todos os dados são fictícios e persistem em `localStorage`.
- Emissão fiscal, PIX, boletos, cartões e integrações são simulações.
- Não há backend, banco real ou comunicação com SEFAZ.
