# Faturamais — Projeto de Portfolio

## O que e

Demonstracao estatica de ERP/Financial Operations SaaS para PMEs.
Sem backend, sem banco real, sem coleta de dados, sem servico comercial real.
Projeto do ecossistema ExpoStacker.

## Stack

- HTML/CSS/vanilla JS (sem framework)
- Fontes self-hosted: Inter (body) + JetBrains Mono (numeros)
- Build: `npm run build` copia arquivos para `out/`
- Deploy: Cloudflare Pages via GitHub Actions
- Persistencia: localStorage (dados demo)

## Comandos

```bash
npm run build    # copia arquivos para out/
```

Nao ha dev server. Para preview local, servir `out/` com qualquer servidor estatico.

## Deploy — Regra Padrao

1. Git commit nas mudancas locais
2. Git push para `origin/main`
3. GitHub Actions dispara: build -> deploy para Cloudflare Pages
4. Cloudflare Pages publica em `faturamais.pages.dev`
5. CNAME `faturamais.expostacker.com.br` -> `faturamais.pages.dev`

### Verificar status

```bash
gh run list --limit 3
gh run view <run-id>
```

## Git

- Repo: https://github.com/lfelipef1dev-jpg/faturamais
- Branch principal: `main`

## Regras do projeto

- **NUNCA** pushar sem validacao visual do usuario
- **NUNCA** commitar credenciais
- **NUNCA** adicionar backend, banco real, formulario de coleta, ou CRM real
- Manter como demo de portfolio — sem atendimento comercial
- **TODOS** os dados devem ser ficticios e identificados como demonstrativos
- **NUNCA** apresentar depoimentos ficticios como clientes reais
- **NUNCA** afirmar metricas reais (+2.500 empresas, R$ 1,2 bi, 99,9% uptime)
- **NUNCA** afirmar integracoes reais quando forem simulacoes
- **NUNCA** afirmar emissao fiscal real ou comunicacao com SEFAZ
- **NUNCA** afirmar processamento PIX/boleto real
- Fontes self-hosted (sem Google Fonts CDN)
- Respeitar `prefers-reduced-motion`
- WCAG 2.2 AA em contraste de cores
- Matematica financeira deve ser coerente (receitas, despesas, saldos, margens)

## Dominio

- Producao: `https://faturamais.expostacker.com.br`
- Cloudflare Pages: `faturamais.pages.dev`

## Arquitetura V2

- `index.html` — landing page publica
- `app.html` — SPA shell do ERP demonstrativo
- `app.js` — router + data model + views
- `style.css` — design system FINTECH + ERP
- `favicon.svg` — icone da marca

## Data Model Central

Todos os dados se relacionam:
- customers -> orders -> invoices -> receivables -> payments -> reconciliations
- products -> inventory -> orders (baixa estoque)
- orders -> invoices (faturamento)
- invoices -> receivables (contas a receber)
- receivables -> payments (recebimento)
- payments -> reconciliations (conciliacao bancaria)
- Tudo persiste em localStorage
