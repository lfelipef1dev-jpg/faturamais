import { test, expect } from '@playwright/test';

const routes = [
  'dashboard', 'pedidos', 'clientes', 'documentos', 'cobrancas',
  'contas-receber', 'contas-pagar', 'fluxo-caixa', 'conciliacao', 'dre',
  'produtos', 'movimentacoes', 'relatorios', 'integracoes', 'usuarios', 'config'
];

test('Landing renderiza avisos de demonstração', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const body = await page.locator('body').innerText();
  expect(body).toMatch(/AMBIENTE DEMONSTRATIVO/i);
  expect(body).toMatch(/Não emite notas reais/i);
  expect(body).toMatch(/não processa pagamentos reais/i);
});

test('App abre e dashboard carrega sem erros de console', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('/app.html');
  await page.waitForFunction(() => {
    const el = document.getElementById('app-content');
    return el && el.innerText.length > 0;
  });
  const body = await page.locator('#app-content').innerText();
  expect(body).toMatch(/Receita líquida|Visão geral|A receber/i);
  expect(errors).toEqual([]);
});

for (const route of routes.slice(1)) {
  test(`Rota /#/${route} carrega sem erro`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto(`/app.html#/${route}`);
    await page.waitForFunction(() => {
      const el = document.getElementById('app-content');
      return el && el.innerText.length > 0;
    }, { timeout: 15000 });
    const body = await page.locator('#app-content').innerText();
    expect(body).not.toMatch(/Erro ao carregar/);
    expect(errors).toEqual([]);
  });
}

test('Matemática do dashboard é coerente com seed data', async ({ page }) => {
  await page.goto('/app.html#/dashboard');
  await page.waitForFunction(() => {
    return window.FaturamaisData && typeof window.FaturamaisData.computeMetrics === 'function';
  });
  const m = await page.evaluate(() => window.FaturamaisData.computeMetrics());
  // Pedidos não cancelados: 1041-1048 excluindo 1043
  // 897.90+449.50+1797.80+1799.00+699.80+708.80+1498.70 = 7851.50
  expect(m.totalReceita).toBeCloseTo(7851.50, 2);
  // aReceber: r1(897.90)+r2(2190.00)+r5(1290.00)+r7(4850.00)=9227.90
  expect(m.aReceber).toBeCloseTo(9227.90, 2);
  // aPagar: pa1+pa2+pa4+pa5 = 4500+3200+890+12500 = 21090
  expect(m.aPagar).toBeCloseTo(21090.00, 2);
  // vencido: r2(2190.00) + r5(1290.00) = 3480
  expect(m.vencido).toBeCloseTo(3480.00, 2);
  // ticket médio = 7851.50 / 7
  expect(m.ticketMedio).toBeCloseTo(1121.64, 2);
  // inadimplência = 3480 / 9227.90 * 100
  expect(m.inadimplencia).toBeCloseTo(37.72, 1);
  // taxa recebimento = (8420+3490+708.80) / (...+9227.90) * 100
  expect(m.taxaRecebimento).toBeCloseTo(57.75, 1);
});

test('Fluxo cliente → pedido → documento fiscal', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('/app.html#/cliente/c1');
  await page.waitForSelector('text=Tech Commerce DEMO');

  await page.goto('/app.html#/pedido/1048');
  await page.waitForSelector('text=Pedido #1048');

  const hasDoc = await page.locator('text=NF-e').count() > 0;
  const hasCharge = await page.locator('text=FAT-1028').count() > 0;
  expect(hasDoc).toBe(true);
  expect(hasCharge).toBe(true);
  expect(errors).toEqual([]);
});
