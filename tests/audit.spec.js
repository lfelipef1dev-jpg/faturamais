import { test, expect } from '@playwright/test';

const routes = [
  { name: 'dashboard', path: '/app.html#/dashboard' },
  { name: 'pedidos', path: '/app.html#/pedidos' },
  { name: 'clientes', path: '/app.html#/clientes' },
  { name: 'documentos', path: '/app.html#/documentos' },
  { name: 'cobrancas', path: '/app.html#/cobrancas' },
  { name: 'contas-receber', path: '/app.html#/contas-receber' },
  { name: 'contas-pagar', path: '/app.html#/contas-pagar' },
  { name: 'fluxo-caixa', path: '/app.html#/fluxo-caixa' },
  { name: 'conciliacao', path: '/app.html#/conciliacao' },
  { name: 'dre', path: '/app.html#/dre' },
  { name: 'produtos', path: '/app.html#/produtos' },
  { name: 'movimentacoes', path: '/app.html#/movimentacoes' },
  { name: 'relatorios', path: '/app.html#/relatorios' },
  { name: 'integracoes', path: '/app.html#/integracoes' },
  { name: 'usuarios', path: '/app.html#/usuarios' },
  { name: 'config', path: '/app.html#/config' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const vp of viewports) {
  for (const r of routes) {
    test(`audit: ${r.name} ${vp.name}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      await page.goto(r.path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(600);
      await page.screenshot({
        path: testInfo.outputPath(`${r.name}-${vp.name}.png`),
        fullPage: true
      });
      if (errors.length > 0) {
        console.log(`[${r.name}-${vp.name}] console errors:`, errors.slice(0, 10));
      }
      expect(errors).toHaveLength(0);
    });
  }
}
