# Faturamais — Plataforma de Faturamento SaaS

Projeto de portfólio da ExpoStacker: sistema de faturamento e gestão para e-commerce.

## Estrutura

- `index.html` — landing page de marketing
- `app.html` — dashboard demonstrativo
- `style.css` — estilos unificados
- `app.js` — lógica do dashboard
- `favicon.svg` — ícone da marca

## Funcionalidades

- Landing page com hero, recursos, preços, FAQ e CTA
- Dashboard com vendas, clientes, produtos, financeiro e configurações
- Tema claro/escuro
- Persistência dos dados no `localStorage`
- Formulários de configuração com feedback
- Layout responsivo
- Acessibilidade (skip link, ARIA, contraste)
- SEO e meta tags

## Como rodar localmente

```bash
python -m http.server 8080
```

Acesse:

- `http://localhost:8080` — landing page
- `http://localhost:8080/app.html` — dashboard

## Stack

- HTML5 semântico
- CSS3 com variáveis e design tokens
- JavaScript vanilla (ES6+)
