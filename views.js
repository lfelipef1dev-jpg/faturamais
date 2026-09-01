/* Faturamais 2.0 — Views (todas as rotas) */
(function (window, document) {
  'use strict';

  function register(F) {
    const h = F.helpers;
    const D = h.D;
    const route = F.route;
    const fmtBRL = h.fmtBRL, fmtNum = h.fmtNum, fmtDate = h.fmtDate, esc = h.esc;
    const statusBadge = h.statusBadge;
    const barChart = h.barChart, lineChart = h.lineChart, multiLineChart = h.multiLineChart, donutChart = h.donutChart;
    const toast = F.toast, openDrawer = F.openDrawer, navigate = F.navigate;

    /* ===== DASHBOARD ===== */
    route('dashboard', function () {
      const m = D.computeMetrics();
      const orders = D.get('orders').slice(0, 5);
      const receivables = D.get('receivables').filter(function (r) { return r.status === 'vencido' || r.status === 'a_vencer'; });
      const chartData = [
        { label: 'Jan', value: 142000, color: '#0F766E' },
        { label: 'Fev', value: 158000, color: '#0F766E' },
        { label: 'Mar', value: 165000, color: '#0F766E' },
        { label: 'Abr', value: 172000, color: '#0F766E' },
        { label: 'Mai', value: 168000, color: '#0F766E' },
        { label: 'Jun', value: 178000, color: '#0F766E' },
        { label: 'Jul', value: 184720, color: '#0F766E' }
      ];
      const expenseData = [
        { label: 'Jan', value: 98000, color: '#DC2626' },
        { label: 'Fev', value: 105000, color: '#DC2626' },
        { label: 'Mar', value: 112000, color: '#DC2626' },
        { label: 'Abr', value: 118000, color: '#DC2626' },
        { label: 'Mai', value: 115000, color: '#DC2626' },
        { label: 'Jun', value: 122000, color: '#DC2626' },
        { label: 'Jul', value: 128000, color: '#DC2626' }
      ];
      const multiSeries = [
        { name: 'Receita', color: '#0F766E', data: chartData },
        { name: 'Despesas', color: '#DC2626', data: expenseData }
      ];
      const fluxoData = [];
      for (let i = 0; i < 12; i++) { fluxoData.push({ label: 'S' + (i + 1), value: 15000 + Math.random() * 8000 - 3000 }); }

      return '<div class="page-header"><h1>Visão geral</h1><p>Financial Command Center — ambiente demonstrativo</p></div>' +
        '<div class="chart-card" style="margin-bottom:var(--sp-5)"><div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div class="fcc-mega">R$ 184.720</div><div class="fcc-mega-label">Receita líquida no mês</div><div class="fcc-mega-change">▲ +12,8% vs. período anterior</div></div><div style="text-align:right"><span class="badge-status badge-success">Fechado</span><div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:var(--sp-2)">Jul/2026</div></div></div></div>' +
        '<div class="kpi-row">' +
        '<div class="kpi-tile"><div class="kpi-tile-label">A receber</div><div class="kpi-tile-value">' + fmtBRL(m.aReceber) + '</div><div class="kpi-tile-sub">' + receivables.length + ' documentos</div></div>' +
        '<div class="kpi-tile"><div class="kpi-tile-label">A pagar</div><div class="kpi-tile-value negative">' + fmtBRL(m.aPagar) + '</div><div class="kpi-tile-sub">6 contas em aberto</div></div>' +
        '<div class="kpi-tile"><div class="kpi-tile-label">Vencido</div><div class="kpi-tile-value warning">' + fmtBRL(m.vencido) + '</div><div class="kpi-tile-sub">' + m.inadimplencia.toFixed(1) + '% inadimplência</div></div>' +
        '<div class="kpi-tile"><div class="kpi-tile-label">Taxa recebimento</div><div class="kpi-tile-value positive">' + m.taxaRecebimento.toFixed(1) + '%</div><div class="kpi-tile-sub">Últimos 30 dias</div></div>' +
        '</div>' +
        '<div class="chart-card"><div class="chart-card-header"><div><div class="chart-card-title">Receita × Despesas × Resultado</div><div class="chart-card-sub">Últimos 7 meses</div></div></div>' + multiLineChart(multiSeries, { label: 'Receita vs Despesas', width: 800, height: 240 }) + '</div>' +
        '<div class="grid-2">' +
        '<div class="chart-card"><div class="chart-card-header"><div><div class="chart-card-title">Fluxo de caixa projetado — 90 dias</div><div class="chart-card-sub">Próximas 12 semanas</div></div></div>' + lineChart(fluxoData, { label: 'Fluxo de caixa', color: '#2563EB', width: 450, height: 200 }) + '</div>' +
        '<div class="chart-card"><div class="chart-card-header"><div><div class="chart-card-title">Contas que exigem atenção</div><div class="chart-card-sub">Vencidos e a vencer próximos 7 dias</div></div></div>' +
        '<table class="data-table"><thead><tr><th>Documento</th><th>Cliente</th><th>Venc.</th><th>Valor</th><th>Status</th></tr></thead><tbody>' +
        receivables.slice(0, 5).map(function (r) { const c = D.findById('customers', r.customerId); return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'contas-receber\')"><td class="mono">' + esc(r.doc) + '</td><td>' + esc(c ? c.name : '—') + '</td><td>' + fmtDate(r.dueDate) + '</td><td class="num">' + fmtBRL(r.amount) + '</td><td>' + statusBadge(r.status) + '</td></tr>'; }).join('') +
        '</tbody></table></div></div>' +
        '<div class="chart-card"><div class="chart-card-header"><div><div class="chart-card-title">Pedidos recentes</div><div class="chart-card-sub">Últimas vendas registradas</div></div><a href="#" onclick="Faturamais.navigate(\'pedidos\');return false" class="btn btn-ghost btn-sm">Ver todos →</a></div>' +
        '<table class="data-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Canal</th><th>Valor</th><th>Status</th></tr></thead><tbody>' +
        orders.map(function (o) { const c = D.findById('customers', o.customerId); return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'pedido/' + o.id + '\')"><td class="mono">#' + esc(o.id) + '</td><td>' + esc(c ? c.name : '—') + '</td><td>' + fmtDate(o.date) + '</td><td>' + esc(o.channel) + '</td><td class="num">' + fmtBRL(o.total) + '</td><td>' + statusBadge(o.status === 'cancelado' ? 'cancelado_order' : o.status) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== 404 ===== */
    route('404', function (params) {
      return '<div class="empty-state"><h3>Página não encontrada</h3><p>A rota "' + esc(params[0] || '') + '" não existe.</p><button class="btn btn-primary" onclick="Faturamais.navigate(\'dashboard\')">Voltar ao início</button></div>';
    });

    /* ===== PEDIDOS ===== */
    route('pedidos', function () {
      const orders = D.get('orders');
      return '<div class="page-header"><div style="display:flex;justify-content:space-between;align-items:center"><div><h1>Pedidos</h1><p>' + orders.length + ' pedidos registrados</p></div><button class="btn btn-primary" onclick="Faturamais.navigate(\'pedido/novo\')">+ Novo pedido</button></div></div>' +
        '<div class="filters-bar"><input class="filter-input" placeholder="Buscar por nº ou cliente..." id="filter-pedidos"><select class="filter-select" id="filter-status"><option value="">Todos os status</option><option value="pago">Pago</option><option value="faturado">Faturado</option><option value="entregue">Entregue</option><option value="cancelado">Cancelado</option></select></div>' +
        '<div class="chart-card" style="padding:0;overflow:hidden"><table class="data-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Canal</th><th>Pagamento</th><th>Valor</th><th>Status</th></tr></thead><tbody>' +
        orders.map(function (o) { const c = D.findById('customers', o.customerId); return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'pedido/' + o.id + '\')"><td class="mono">#' + esc(o.id) + '</td><td>' + esc(c ? c.name : '—') + '</td><td>' + fmtDate(o.date) + '</td><td>' + esc(o.channel) + '</td><td>' + esc(o.payment) + '</td><td class="num">' + fmtBRL(o.total) + '</td><td>' + statusBadge(o.status === 'cancelado' ? 'cancelado_order' : o.status) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== PEDIDO DETALHE ===== */
    route('pedido', function (params) {
      if (params[0] === 'novo') return renderNovoPedido();
      const o = D.get('orders').find(function (x) { return x.id === params[0]; });
      if (!o) return '<div class="empty-state"><h3>Pedido não encontrado</h3></div>';
      const c = D.findById('customers', o.customerId);
      const inv = o.invoiceId ? D.findById('invoices', o.invoiceId) : null;
      const rec = D.get('receivables').find(function (r) { return r.orderId === o.id; });
      return '<div class="page-header"><div class="detail-header"><div><div class="detail-title">Pedido #' + esc(o.id) + '</div><div class="detail-sub">' + esc(c ? c.name : '—') + ' · ' + fmtDate(o.date) + '</div></div>' + statusBadge(o.status === 'cancelado' ? 'cancelado_order' : o.status) + '</div></div>' +
        '<div class="grid-2"><div class="detail-section"><h3>Itens do pedido</h3><table class="data-table"><thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Total</th></tr></thead><tbody>' +
        o.items.map(function (it) { const p = D.findById('products', it.productId); return '<tr><td>' + esc(p ? p.name : it.productId) + '</td><td>' + it.qty + '</td><td class="num">' + fmtBRL(it.price) + '</td><td class="num">' + fmtBRL(it.price * it.qty) + '</td></tr>'; }).join('') +
        '<tr style="font-weight:700"><td colspan="3" style="text-align:right">Total</td><td class="num">' + fmtBRL(o.total) + '</td></tr></tbody></table></div>' +
        '<div class="detail-section"><h3>Cliente</h3><p style="margin-bottom:var(--sp-2)"><strong>' + esc(c ? c.name : '—') + '</strong></p><p class="text-sm" style="color:var(--text-secondary)">' + esc(c ? c.doc : '') + '</p><p class="text-sm" style="color:var(--text-secondary)">' + esc(c ? c.city : '') + '</p><p class="text-sm" style="color:var(--text-secondary)">' + esc(c ? c.email : '') + '</p><button class="btn btn-ghost btn-sm" style="margin-top:var(--sp-3)" onclick="Faturamais.navigate(\'cliente/' + (c ? c.id : '') + '\')">Ver perfil 360° →</button></div></div>' +
        '<div class="grid-2"><div class="detail-section"><h3>Pagamento</h3><p>Método: <strong>' + esc(o.payment) + '</strong></p><p style="margin-top:var(--sp-2)">Valor: <strong>' + fmtBRL(o.total) + '</strong></p>' + (rec ? '<p style="margin-top:var(--sp-2)">Cobrança: <strong>' + esc(rec.doc) + '</strong> ' + statusBadge(rec.status) + '</p>' : '') + '</div>' +
        '<div class="detail-section"><h3>Faturamento</h3>' + (inv ? '<p>Documento: <a href="#" onclick="Faturamais.navigate(\'documento/' + inv.id + '\');return false">' + esc(inv.type) + ' #' + esc(inv.number) + '</a></p><p style="margin-top:var(--sp-2)">Status: ' + statusBadge(inv.status) + '</p>' : '<p class="text-sm" style="color:var(--text-muted)">Não faturado</p><button class="btn btn-primary btn-sm" style="margin-top:var(--sp-3)" onclick="Faturamais.navigate(\'emitir/' + o.id + '\')">Faturar pedido →</button>') + '</div></div>' +
        '<div class="detail-section"><h3>Timeline</h3><div class="timeline">' +
        '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-date">' + fmtDate(o.date) + '</div><div class="timeline-text">Pedido criado via ' + esc(o.channel) + '</div></div>' +
        (o.status !== 'cancelado' ? '<div class="timeline-item"><div class="timeline-dot success"></div><div class="timeline-date">' + fmtDate(o.date) + '</div><div class="timeline-text">Pagamento confirmado — ' + esc(o.payment) + '</div></div>' : '') +
        (inv ? '<div class="timeline-item"><div class="timeline-dot success"></div><div class="timeline-date">' + fmtDate(inv.date) + '</div><div class="timeline-text">' + esc(inv.type) + ' #' + esc(inv.number) + ' autorizada (SIMULAÇÃO)</div></div>' : '') +
        (o.status === 'cancelado' ? '<div class="timeline-item"><div class="timeline-dot danger"></div><div class="timeline-date">' + fmtDate(o.date) + '</div><div class="timeline-text">Pedido cancelado</div></div>' : '') +
        '</div></div>';
    });

    function renderNovoPedido() {
      const customers = D.get('customers');
      const products = D.get('products');
      return '<div class="page-header"><h1>Novo pedido</h1><p>Criação de pedido demonstrativo</p></div>' +
        '<div class="wizard-steps"><div class="wizard-step active"><div class="wizard-step-num">1</div>Cliente</div><div class="wizard-step"><div class="wizard-step-num">2</div>Itens</div><div class="wizard-step"><div class="wizard-step-num">3</div>Pagamento</div><div class="wizard-step"><div class="wizard-step-num">4</div>Revisão</div></div>' +
        '<div class="detail-section"><h3>Selecionar cliente</h3><div class="form-group"><label class="form-label">Cliente</label><select class="form-select" id="np-cliente">' + customers.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + ' — ' + esc(c.city) + '</option>'; }).join('') + '</select></div>' +
        '<h3 style="margin-top:var(--sp-5)">Adicionar itens</h3><div class="form-group"><label class="form-label">Produto</label><select class="form-select" id="np-produto">' + products.map(function (p) { return '<option value="' + p.id + '" data-price="' + p.price + '">' + esc(p.name) + ' — ' + fmtBRL(p.price) + '</option>'; }).join('') + '</select></div>' +
        '<div class="form-group"><label class="form-label">Quantidade</label><input type="number" class="form-input" id="np-qtd" value="1" min="1"></div>' +
        '<button class="btn btn-secondary btn-sm" id="np-add">+ Adicionar item</button>' +
        '<table class="data-table" id="np-items" style="margin-top:var(--sp-4)"><thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Total</th><th></th></tr></thead><tbody></tbody></table>' +
        '<div class="form-group" style="margin-top:var(--sp-5)"><label class="form-label">Método de pagamento</label><select class="form-select" id="np-pay"><option>PIX</option><option>Boleto</option><option>Cartão</option><option>Link</option></select></div>' +
        '<div class="form-group"><label class="form-label">Canal</label><select class="form-select" id="np-canal"><option>Online</option><option>Marketplace</option><option>Telefone</option><option>Presencial</option></select></div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:var(--sp-4)" id="np-save">Criar pedido (demo)</button></div>';
    }

    /* ===== CLIENTES ===== */
    route('clientes', function () {
      const customers = D.get('customers');
      return '<div class="page-header"><h1>Clientes</h1><p>' + customers.length + ' clientes cadastrados</p></div>' +
        '<div class="filters-bar"><input class="filter-input" placeholder="Buscar cliente..." id="filter-cli"></div>' +
        '<div class="chart-card" style="padding:0;overflow:hidden"><table class="data-table"><thead><tr><th>Cliente</th><th>Documento</th><th>Cidade</th><th>Segmento</th><th>Desde</th><th>Status</th></tr></thead><tbody>' +
        customers.map(function (c) { return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'cliente/' + c.id + '\')"><td><strong>' + esc(c.name) + '</strong></td><td class="mono">' + esc(c.doc) + '</td><td>' + esc(c.city) + '</td><td>' + esc(c.segment) + '</td><td>' + fmtDate(c.since) + '</td><td>' + statusBadge(c.status) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== CLIENTE DETALHE ===== */
    route('cliente', function (params) {
      const c = D.findById('customers', params[0]);
      if (!c) return '<div class="empty-state"><h3>Cliente não encontrado</h3></div>';
      const orders = D.get('orders').filter(function (o) { return o.customerId === c.id; });
      const receivables = D.get('receivables').filter(function (r) { return r.customerId === c.id; });
      const invoices = D.get('invoices').filter(function (i) { return i.customerId === c.id; });
      const totalReceita = orders.filter(function (o) { return o.status !== 'cancelado'; }).reduce(function (s, o) { return s + o.total; }, 0);
      const emAberto = receivables.filter(function (r) { return r.status !== 'recebido' && r.status !== 'cancelado'; }).reduce(function (s, r) { return s + r.amount; }, 0);
      const ticketMedio = orders.length > 0 ? totalReceita / orders.filter(function (o) { return o.status !== 'cancelado'; }).length : 0;
      return '<div class="page-header"><div class="detail-header"><div><div class="detail-title">' + esc(c.name) + '</div><div class="detail-sub">' + esc(c.doc) + ' · ' + esc(c.city) + ' · Cliente desde ' + fmtDate(c.since) + '</div></div>' + statusBadge(c.status) + '</div></div>' +
        '<div class="kpi-row"><div class="kpi-tile"><div class="kpi-tile-label">Receita acumulada</div><div class="kpi-tile-value">' + fmtBRL(totalReceita) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Pedidos</div><div class="kpi-tile-value">' + orders.length + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Ticket médio</div><div class="kpi-tile-value">' + fmtBRL(ticketMedio) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Em aberto</div><div class="kpi-tile-value warning">' + fmtBRL(emAberto) + '</div></div></div>' +
        '<div class="tabs"><div class="tab active" data-tab="resumo">Resumo</div><div class="tab" data-tab="pedidos">Pedidos (' + orders.length + ')</div><div class="tab" data-tab="faturas">Faturas (' + invoices.length + ')</div><div class="tab" data-tab="cobrancas">Cobranças (' + receivables.length + ')</div><div class="tab" data-tab="contatos">Contatos</div><div class="tab" data-tab="timeline">Timeline</div></div>' +
        '<div id="tab-resumo" class="tab-content"><div class="detail-section"><h3>Resumo do cliente</h3><p><strong>Segmento:</strong> ' + esc(c.segment) + '</p><p style="margin-top:var(--sp-2)"><strong>Tipo:</strong> ' + esc(c.type) + '</p><p style="margin-top:var(--sp-2)"><strong>Email:</strong> ' + esc(c.email) + '</p><p style="margin-top:var(--sp-2)"><strong>Telefone:</strong> ' + esc(c.phone) + '</p></div></div>' +
        '<div id="tab-pedidos" class="tab-content" style="display:none"><div class="chart-card" style="padding:0"><table class="data-table"><thead><tr><th>Pedido</th><th>Data</th><th>Valor</th><th>Status</th></tr></thead><tbody>' + orders.map(function (o) { return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'pedido/' + o.id + '\')"><td class="mono">#' + esc(o.id) + '</td><td>' + fmtDate(o.date) + '</td><td class="num">' + fmtBRL(o.total) + '</td><td>' + statusBadge(o.status === 'cancelado' ? 'cancelado_order' : o.status) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
        '<div id="tab-faturas" class="tab-content" style="display:none"><div class="chart-card" style="padding:0"><table class="data-table"><thead><tr><th>Documento</th><th>Tipo</th><th>Data</th><th>Valor</th><th>Status</th></tr></thead><tbody>' + invoices.map(function (i) { return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'documento/' + i.id + '\')"><td class="mono">#' + esc(i.number) + '</td><td>' + esc(i.type) + '</td><td>' + fmtDate(i.date) + '</td><td class="num">' + fmtBRL(i.total) + '</td><td>' + statusBadge(i.status) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
        '<div id="tab-cobrancas" class="tab-content" style="display:none"><div class="chart-card" style="padding:0"><table class="data-table"><thead><tr><th>Documento</th><th>Vencimento</th><th>Valor</th><th>Método</th><th>Status</th></tr></thead><tbody>' + receivables.map(function (r) { return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'contas-receber\')"><td class="mono">' + esc(r.doc) + '</td><td>' + fmtDate(r.dueDate) + '</td><td class="num">' + fmtBRL(r.amount) + '</td><td>' + esc(r.method) + '</td><td>' + statusBadge(r.status) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
        '<div id="tab-contatos" class="tab-content" style="display:none"><div class="detail-section"><h3>Contatos</h3><p><strong>Email:</strong> ' + esc(c.email) + '</p><p style="margin-top:var(--sp-2)"><strong>Telefone:</strong> ' + esc(c.phone) + '</p></div></div>' +
        '<div id="tab-timeline" class="tab-content" style="display:none"><div class="detail-section"><h3>Timeline</h3><div class="timeline"><div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-date">' + fmtDate(c.since) + '</div><div class="timeline-text">Cliente cadastrado</div></div>' + orders.slice(0, 3).map(function (o) { return '<div class="timeline-item"><div class="timeline-dot success"></div><div class="timeline-date">' + fmtDate(o.date) + '</div><div class="timeline-text">Pedido #' + esc(o.id) + ' — ' + fmtBRL(o.total) + '</div></div>'; }).join('') + '</div></div></div>';
    });

    /* ===== DOCUMENTOS ===== */
    route('documentos', function () {
      const invoices = D.get('invoices');
      return '<div class="page-header"><div style="display:flex;justify-content:space-between;align-items:center"><div><h1>Documentos fiscais</h1><p>' + invoices.length + ' documentos — SIMULAÇÃO DEMONSTRATIVA</p></div><button class="btn btn-primary" onclick="Faturamais.navigate(\'emitir\')">+ Emitir documento</button></div></div>' +
        '<div class="chart-card" style="padding:0;overflow:hidden"><table class="data-table"><thead><tr><th>Número</th><th>Tipo</th><th>Cliente</th><th>Data</th><th>Valor</th><th>Tributos</th><th>Status</th></tr></thead><tbody>' +
        invoices.map(function (i) { const c = D.findById('customers', i.customerId); return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'documento/' + i.id + '\')"><td class="mono">#' + esc(i.number) + '</td><td>' + esc(i.type) + '</td><td>' + esc(c ? c.name : '—') + '</td><td>' + fmtDate(i.date) + '</td><td class="num">' + fmtBRL(i.total) + '</td><td class="num">' + fmtBRL(i.taxes) + '</td><td>' + statusBadge(i.status) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== DOCUMENTO DETALHE ===== */
    route('documento', function (params) {
      const inv = D.findById('invoices', params[0]);
      if (!inv) return '<div class="empty-state"><h3>Documento não encontrado</h3></div>';
      const c = D.findById('customers', inv.customerId);
      const company = D.get('company');
      const o = inv.orderId ? D.findById('orders', inv.orderId) : null;
      return '<div class="page-header"><div class="detail-header"><div><div class="detail-title">' + esc(inv.type) + ' DEMO #' + esc(inv.number) + '</div><div class="detail-sub">Emitida em ' + fmtDate(inv.date) + '</div></div>' + statusBadge(inv.status) + '</div></div>' +
        '<div class="danfe-demo-stamp">SIMULAÇÃO DEMONSTRATIVA — DOCUMENTO FICTÍCIO</div>' +
        '<div class="detail-section"><h3>DANFE demonstrativo</h3><div class="danfe">' +
        '<div class="danfe-header"><div class="danfe-box"><div class="danfe-box-title">Emitente</div><strong>' + esc(company.name) + '</strong><br>CNPJ: ' + esc(company.cnpj) + '<br>' + esc(company.address) + '</div>' +
        '<div class="danfe-box" style="text-align:center"><strong style="font-size:14px">DANFE DEMO</strong><br>' + esc(inv.type) + ' nº ' + esc(inv.number) + '<br>Série 001<br>' + statusBadge(inv.status) + '</div>' +
        '<div class="danfe-box"><div class="danfe-box-title">Destinatário</div><strong>' + esc(c ? c.name : '—') + '</strong><br>CNPJ: ' + esc(c ? c.doc : '') + '<br>' + esc(c ? c.city : '') + '</div></div>' +
        (o ? '<table class="data-table" style="margin-top:var(--sp-3)"><thead><tr><th>Código</th><th>Descrição</th><th>Qtd</th><th>Valor</th><th>Total</th></tr></thead><tbody>' + o.items.map(function (it) { const p = D.findById('products', it.productId); return '<tr><td class="mono">' + esc(p ? p.sku : '') + '</td><td>' + esc(p ? p.name : '') + '</td><td>' + it.qty + '</td><td class="num">' + fmtBRL(it.price) + '</td><td class="num">' + fmtBRL(it.price * it.qty) + '</td></tr>'; }).join('') + '</tbody></table>' : '<p style="margin-top:var(--sp-3)">Documento avulso (sem pedido vinculado)</p>') +
        '<div class="danfe-row" style="margin-top:var(--sp-3)"><div class="danfe-box"><div class="danfe-box-title">Valor total</div><strong>' + fmtBRL(inv.total) + '</strong></div><div class="danfe-box"><div class="danfe-box-title">Tributos</div><strong>' + fmtBRL(inv.taxes) + '</strong></div><div class="danfe-box"><div class="danfe-box-title">Chave de acesso (FICTÍCIA)</div><strong style="font-size:9px">' + esc(inv.chave) + '</strong></div><div class="danfe-box"><div class="danfe-box-title">Protocolo (FICTÍCIO)</div><strong>' + esc(inv.protocolo) + '</strong></div></div></div></div>' +
        '<div class="grid-2"><div class="detail-section"><h3>XML demonstrativo</h3><pre style="background:var(--surface-alt);padding:var(--sp-3);border-radius:var(--r-md);font-size:var(--fs-xs);overflow-x:auto;max-height:300px">' + esc(generateDemoXML(inv, c, company, o)) + '</pre><button class="btn btn-secondary btn-sm" style="margin-top:var(--sp-3)" onclick="Faturamais.toast(\'XML demo — simulação não gera arquivo real\',\'warn\')">Baixar XML (demo)</button></div>' +
        '<div class="detail-section"><h3>Timeline</h3><div class="timeline"><div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-date">' + fmtDate(inv.date) + '</div><div class="timeline-text">Documento criado</div></div><div class="timeline-item"><div class="timeline-dot warn"></div><div class="timeline-date">' + fmtDate(inv.date) + '</div><div class="timeline-text">Validando dados (SIMULAÇÃO)</div></div><div class="timeline-item"><div class="timeline-dot warn"></div><div class="timeline-date">' + fmtDate(inv.date) + '</div><div class="timeline-text">Enviando simulação</div></div>' + (inv.status === 'autorizada' ? '<div class="timeline-item"><div class="timeline-dot success"></div><div class="timeline-date">' + fmtDate(inv.date) + '</div><div class="timeline-text">Autorizada — SIMULAÇÃO (protocolo ' + esc(inv.protocolo) + ')</div></div>' : '') + (inv.status === 'cancelada' ? '<div class="timeline-item"><div class="timeline-dot danger"></div><div class="timeline-date">' + fmtDate(inv.date) + '</div><div class="timeline-text">Cancelada — SIMULAÇÃO</div></div>' : '') + '</div></div></div>';
    });

    function generateDemoXML(inv, c, company, o) {
      const items = o ? o.items.map(function (it, idx) { const p = D.findById('products', it.productId); return '    <det nItem="' + (idx + 1) + '">\n      <prod>\n        <cProd>' + esc(p ? p.sku : '') + '</cProd>\n        <xProd>' + esc(p ? p.name : '') + '</xProd>\n        <qCom>' + it.qty + '</qCom>\n        <vUnCom>' + it.price.toFixed(2) + '</vUnCom>\n        <vProd>' + (it.price * it.qty).toFixed(2) + '</vProd>\n      </prod>\n    </det>'; }).join('\n') : '';
      return '<?xml version="1.0" encoding="UTF-8"?>\n<!-- SIMULAÇÃO DEMONSTRATIVA — DOCUMENTO FICTÍCIO -->\n<NFe xmlns="http://www.portalfiscal.inf.br/nfe">\n  <infNFe Id="NFe' + esc(inv.chave.replace(/-/g, '')) + '">\n    <ide>\n      <cNF>' + esc(inv.number) + '</cNF>\n      <serie>001</serie>\n      <dEmi>' + esc(inv.date) + '</dEmi>\n    </ide>\n    <emit>\n      <CNPJ>' + esc(company.cnpj.replace(/\D/g, '')) + '</CNPJ>\n      <xNome>' + esc(company.name) + '</xNome>\n    </emit>\n    <dest>\n      <CNPJ>' + esc(c ? c.doc.replace(/\D/g, '') : '') + '</CNPJ>\n      <xNome>' + esc(c ? c.name : '') + '</xNome>\n    </dest>\n' + items + '\n    <total>\n      <ICMSTot>\n        <vNF>' + inv.total.toFixed(2) + '</vNF>\n        <vTotTrib>' + inv.taxes.toFixed(2) + '</vTotTrib>\n      </ICMSTot>\n    </total>\n  </infNFe>\n</NFe>';
    }

    /* ===== EMITIR ===== */
    route('emitir', function (params) {
      const orderId = params[0];
      const customers = D.get('customers');
      const products = D.get('products');
      const o = orderId ? D.findById('orders', orderId) : null;
      return '<div class="page-header"><h1>Emitir documento</h1><p>Wizard de emissão — SIMULAÇÃO DEMONSTRATIVA</p></div>' +
        '<div class="danfe-demo-stamp">SIMULAÇÃO — NÃO COMUNICA COM SEFAZ</div>' +
        '<div class="wizard-steps"><div class="wizard-step active"><div class="wizard-step-num">1</div>Cliente</div><div class="wizard-step"><div class="wizard-step-num">2</div>Itens</div><div class="wizard-step"><div class="wizard-step-num">3</div>Fiscal</div><div class="wizard-step"><div class="wizard-step-num">4</div>Valores</div><div class="wizard-step"><div class="wizard-step-num">5</div>Revisão</div><div class="wizard-step"><div class="wizard-step-num">6</div>Emitir</div></div>' +
        '<div class="detail-section"><h3>1. Selecionar cliente</h3><div class="form-group"><label class="form-label">Cliente</label><select class="form-select" id="em-cliente">' + customers.map(function (c) { return '<option value="' + c.id + '"' + (o && o.customerId === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></div>' +
        '<h3 style="margin-top:var(--sp-5)">2. Itens</h3>' + (o ? '<p class="text-sm" style="color:var(--text-secondary)">Itens do pedido #' + esc(o.id) + ' pré-carregados</p>' : '<div class="form-group"><label class="form-label">Produto</label><select class="form-select" id="em-produto">' + products.map(function (p) { return '<option value="' + p.id + '" data-price="' + p.price + '">' + esc(p.name) + ' — ' + fmtBRL(p.price) + '</option>'; }).join('') + '</select></div><div class="form-group"><label class="form-label">Quantidade</label><input type="number" class="form-input" value="1" min="1"></div>') +
        '<h3 style="margin-top:var(--sp-5)">3. Dados fiscais</h3><div class="form-group"><label class="form-label">Tipo de documento</label><select class="form-select"><option>NF-e</option><option>NFS-e</option><option>NFC-e</option></select></div><div class="form-group"><label class="form-label">Série</label><input class="form-input" value="001" readonly></div><div class="form-group"><label class="form-label">Ambiente</label><input class="form-input" value="SIMULAÇÃO" readonly style="color:var(--warning);font-weight:600"></div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:var(--sp-4)" id="em-emit">Emitir documento (SIMULAÇÃO)</button></div>';
    });

    /* ===== CONTAS A RECEBER ===== */
    route('contas-receber', function () {
      const receivables = D.get('receivables');
      return '<div class="page-header"><h1>Contas a receber</h1><p>' + receivables.length + ' documentos</p></div>' +
        '<div class="kpi-row"><div class="kpi-tile"><div class="kpi-tile-label">A receber</div><div class="kpi-tile-value">' + fmtBRL(receivables.filter(function (r) { return r.status === 'a_vencer'; }).reduce(function (s, r) { return s + r.amount; }, 0)) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Vencido</div><div class="kpi-tile-value negative">' + fmtBRL(receivables.filter(function (r) { return r.status === 'vencido'; }).reduce(function (s, r) { return s + r.amount; }, 0)) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Recebido</div><div class="kpi-tile-value positive">' + fmtBRL(receivables.filter(function (r) { return r.status === 'recebido'; }).reduce(function (s, r) { return s + r.paidAmount; }, 0)) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Total</div><div class="kpi-tile-value">' + fmtBRL(receivables.reduce(function (s, r) { return s + r.amount; }, 0)) + '</div></div></div>' +
        '<div class="chart-card" style="padding:0;overflow:hidden"><table class="data-table"><thead><tr><th>Documento</th><th>Cliente</th><th>Emissão</th><th>Vencimento</th><th>Valor</th><th>Método</th><th>Status</th><th></th></tr></thead><tbody>' +
        receivables.map(function (r) { const c = D.findById('customers', r.customerId); return '<tr><td class="mono">' + esc(r.doc) + '</td><td>' + esc(c ? c.name : '—') + '</td><td>' + fmtDate(r.issueDate) + '</td><td>' + fmtDate(r.dueDate) + '</td><td class="num">' + fmtBRL(r.amount) + '</td><td>' + esc(r.method) + '</td><td>' + statusBadge(r.status) + '</td><td>' + (r.status === 'a_vencer' || r.status === 'vencido' ? '<button class="btn btn-primary btn-sm" onclick="Faturamais.receivePayment(\'' + r.id + '\')">Receber</button>' : '') + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== CONTAS A PAGAR ===== */
    route('contas-pagar', function () {
      const payables = D.get('payables');
      return '<div class="page-header"><h1>Contas a pagar</h1><p>' + payables.length + ' contas</p></div>' +
        '<div class="kpi-row"><div class="kpi-tile"><div class="kpi-tile-label">A pagar</div><div class="kpi-tile-value">' + fmtBRL(payables.filter(function (p) { return !p.paid; }).reduce(function (s, p) { return s + p.amount; }, 0)) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Pago</div><div class="kpi-tile-value positive">' + fmtBRL(payables.filter(function (p) { return p.paid; }).reduce(function (s, p) { return s + p.amount; }, 0)) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Total</div><div class="kpi-tile-value">' + fmtBRL(payables.reduce(function (s, p) { return s + p.amount; }, 0)) + '</div></div></div>' +
        '<div class="chart-card" style="padding:0;overflow:hidden"><table class="data-table"><thead><tr><th>Fornecedor</th><th>Categoria</th><th>Centro custo</th><th>Competência</th><th>Vencimento</th><th>Valor</th><th>Status</th><th></th></tr></thead><tbody>' +
        payables.map(function (p) { return '<tr><td>' + esc(p.supplier) + '</td><td>' + esc(p.category) + '</td><td>' + esc(p.costCenter) + '</td><td>' + esc(p.competence) + '</td><td>' + fmtDate(p.dueDate) + '</td><td class="num">' + fmtBRL(p.amount) + '</td><td>' + statusBadge(p.paid ? 'pago' : 'a_pagar') + '</td><td>' + (!p.paid ? '<button class="btn btn-primary btn-sm" onclick="Faturamais.payAccount(\'' + p.id + '\')">Pagar</button>' : '') + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== FLUXO DE CAIXA ===== */
    route('fluxo-caixa', function () {
      const data = [];
      let saldo = 50000;
      for (let i = 0; i < 12; i++) { const entradas = 15000 + Math.random() * 8000; const saidas = 10000 + Math.random() * 5000; saldo += entradas - saidas; data.push({ label: 'S' + (i + 1), value: saldo }); }
      return '<div class="page-header"><h1>Fluxo de caixa</h1><p>Projeção 90 dias — ambiente demonstrativo</p></div>' +
        '<div class="chart-card"><div class="chart-card-header"><div><div class="chart-card-title">Saldo projetado</div><div class="chart-card-sub">Próximas 12 semanas</div></div><div><div class="kpi-tile-value positive">' + fmtBRL(saldo) + '</div><div class="kpi-tile-sub">Saldo final projetado</div></div></div>' + lineChart(data, { label: 'Fluxo de caixa projetado', color: '#2563EB', width: 800, height: 280 }) + '</div>' +
        '<div class="chart-card"><h3 style="margin-bottom:var(--sp-4)">Detalhamento</h3><table class="data-table"><thead><tr><th>Período</th><th>Saldo inicial</th><th>Entradas</th><th>Saídas</th><th>Saldo final</th></tr></thead><tbody>' +
        data.map(function (d, i) { const ent = 15000 + Math.random() * 8000; const sai = 10000 + Math.random() * 5000; const si = i === 0 ? 50000 : data[i - 1].value; return '<tr><td>' + esc(d.label) + '</td><td class="num">' + fmtBRL(si) + '</td><td class="num positive">' + fmtBRL(ent) + '</td><td class="num negative">' + fmtBRL(sai) + '</td><td class="num">' + fmtBRL(d.value) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== CONCILIAÇÃO ===== */
    route('conciliacao', function () {
      const transactions = D.get('transactions').filter(function (t) { return !t.reconciled; });
      const reconciled = D.get('transactions').filter(function (t) { return t.reconciled; });
      return '<div class="page-header"><h1>Conciliação bancária</h1><p>Transações DEMO — ambiente demonstrativo</p></div>' +
        '<div class="kpi-row"><div class="kpi-tile"><div class="kpi-tile-label">Pendentes</div><div class="kpi-tile-value warning">' + transactions.length + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Conciliadas</div><div class="kpi-tile-value positive">' + reconciled.length + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">A conciliar</div><div class="kpi-tile-value">' + fmtBRL(transactions.reduce(function (s, t) { return s + Math.abs(t.amount); }, 0)) + '</div></div></div>' +
        '<div class="concil-grid"><div class="concil-card"><h3 style="margin-bottom:var(--sp-4)">Transações pendentes</h3>' +
        transactions.map(function (t) { const r = t.receivableId ? D.findById('receivables', t.receivableId) : null; const c = r ? D.findById('customers', r.customerId) : null; const matchScore = r ? 98 : 0; return '<div style="padding:var(--sp-3);border:1px solid var(--border);border-radius:var(--r-md);margin-bottom:var(--sp-3)"><div style="display:flex;justify-content:space-between"><span class="mono" style="font-weight:700">' + (t.amount > 0 ? '+' : '') + fmtBRL(t.amount) + '</span>' + statusBadge(t.reconciled ? 'pago' : 'a_pagar') + '</div><p class="text-sm" style="color:var(--text-secondary);margin-top:var(--sp-2)">' + esc(t.description) + '</p><p class="text-xs" style="color:var(--text-muted);margin-top:var(--sp-1)">' + fmtDate(t.date) + ' · Ref: ' + esc(t.bankRef) + '</p>' + (r ? '<div class="concil-match"><div><strong>Sugestão:</strong> ' + esc(r.doc) + ' — ' + esc(c ? c.name : '') + '<br><span class="match-score">' + matchScore + '% correspondência</span></div><button class="btn btn-primary btn-sm" onclick="Faturamais.reconcile(\'' + t.id + '\',\'' + r.id + '\')">Conciliar</button></div>' : '<div style="margin-top:var(--sp-2)"><button class="btn btn-ghost btn-sm">Sem sugestão automática</button></div>') + '</div>'; }).join('') || '<div class="empty-state"><p>Nenhuma transação pendente</p></div>' + '</div>' +
        '<div class="concil-card"><h3 style="margin-bottom:var(--sp-4)">Conciliadas recentemente</h3>' + reconciled.map(function (t) { return '<div style="padding:var(--sp-3);border:1px solid var(--border);border-radius:var(--r-md);margin-bottom:var(--sp-3)"><div style="display:flex;justify-content:space-between"><span class="mono" style="font-weight:700">' + (t.amount > 0 ? '+' : '') + fmtBRL(t.amount) + '</span>' + statusBadge('pago') + '</div><p class="text-sm" style="color:var(--text-secondary);margin-top:var(--sp-2)">' + esc(t.description) + '</p></div>'; }).join('') + '</div></div>';
    });

    /* ===== DRE ===== */
    route('dre', function () {
      const m = D.computeMetrics();
      const receitaBruta = m.totalReceita * 1.1;
      const deducoes = receitaBruta * 0.1;
      const receitaLiquida = receitaBruta - deducoes;
      const custos = receitaLiquida * 0.55;
      const margemBruta = receitaLiquida - custos;
      const despesas = m.aPagar;
      const resultadoOp = margemBruta - despesas;
      return '<div class="page-header"><h1>DRE gerencial</h1><p>Demonstração gerencial — NÃO é contabilidade oficial</p></div>' +
        '<div class="chart-card"><table class="data-table"><tbody>' +
        '<tr><td><strong>Receita bruta</strong></td><td class="num">' + fmtBRL(receitaBruta) + '</td></tr>' +
        '<tr><td style="padding-left:var(--sp-4)">(-) Deduções</td><td class="num negative">' + fmtBRL(deducoes) + '</td></tr>' +
        '<tr style="background:var(--surface-alt)"><td><strong>Receita líquida</strong></td><td class="num">' + fmtBRL(receitaLiquida) + '</td></tr>' +
        '<tr><td style="padding-left:var(--sp-4)">(-) Custos</td><td class="num negative">' + fmtBRL(custos) + '</td></tr>' +
        '<tr style="background:var(--surface-alt)"><td><strong>Margem bruta</strong></td><td class="num positive">' + fmtBRL(margemBruta) + '</td></tr>' +
        '<tr><td style="padding-left:var(--sp-4)">(-) Despesas operacionais</td><td class="num negative">' + fmtBRL(despesas) + '</td></tr>' +
        '<tr style="background:var(--primary-soft)"><td><strong>Resultado operacional</strong></td><td class="num positive">' + fmtBRL(resultadoOp) + '</td></tr>' +
        '<tr><td style="padding-left:var(--sp-4)">Margem operacional</td><td class="num">' + (resultadoOp / receitaLiquida * 100).toFixed(1) + '%</td></tr>' +
        '</tbody></table></div>' +
        '<p class="text-xs" style="color:var(--text-muted);text-align:center">Demonstração gerencial simplificada — dados fictícios para ambiente demonstrativo</p>';
    });

    /* ===== COBRANÇAS ===== */
    route('cobrancas', function () {
      const charges = D.get('charges');
      const rules = D.get('chargeRules');
      return '<div class="page-header"><h1>Cobranças</h1><p>Geração de cobranças DEMO — PIX, boleto e link</p></div>' +
        '<div class="danfe-demo-stamp">SIMULAÇÃO — NÃO GERA DOCUMENTOS BANCÁRIOS REAIS</div>' +
        '<div class="chart-card"><div class="chart-card-header"><div><div class="chart-card-title">Cobranças geradas</div></div></div><table class="data-table"><thead><tr><th>Cliente</th><th>Método</th><th>Valor</th><th>Data</th><th>Status</th><th></th></tr></thead><tbody>' +
        charges.map(function (ch) { const r = D.findById('receivables', ch.receivableId); const c = r ? D.findById('customers', r.customerId) : null; return '<tr><td>' + esc(c ? c.name : '—') + '</td><td>' + esc(ch.method) + '</td><td class="num">' + fmtBRL(ch.amount) + '</td><td>' + fmtDate(ch.date) + '</td><td>' + statusBadge(ch.status === 'vencida' ? 'vencida_charge' : ch.status) + '</td><td><button class="btn btn-ghost btn-sm" onclick="Faturamais.viewCharge(\'' + ch.id + '\')">Ver</button></td></tr>'; }).join('') +
        '</tbody></table></div>' +
        '<div class="chart-card"><div class="chart-card-header"><div><div class="chart-card-title">Régua de cobrança</div><div class="chart-card-sub">Automação demonstrativa</div></div></div><table class="data-table"><thead><tr><th>Offset</th><th>Ação</th><th>Canal</th><th>Ativo</th></tr></thead><tbody>' +
        rules.map(function (r) { return '<tr><td class="mono">D' + (r.offset >= 0 ? '+' : '') + r.offset + '</td><td>' + esc(r.action) + '</td><td>' + esc(r.channel) + '</td><td>' + statusBadge(r.active ? 'ativo' : 'inativo') + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== PRODUTOS ===== */
    route('produtos', function () {
      const products = D.get('products');
      return '<div class="page-header"><h1>Produtos</h1><p>' + products.length + ' produtos cadastrados</p></div>' +
        '<div class="kpi-row"><div class="kpi-tile"><div class="kpi-tile-label">Total SKUs</div><div class="kpi-tile-value">' + products.length + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Estoque baixo</div><div class="kpi-tile-value warning">' + products.filter(function (p) { return p.stock <= p.minStock; }).length + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Valor estoque</div><div class="kpi-tile-value">' + fmtBRL(products.reduce(function (s, p) { return s + p.stock * p.cost; }, 0)) + '</div></div></div>' +
        '<div class="chart-card" style="padding:0;overflow:hidden"><table class="data-table"><thead><tr><th>SKU</th><th>Produto</th><th>Categoria</th><th>Estoque</th><th>Reserv.</th><th>Mínimo</th><th>Custo</th><th>Preço</th><th>Status</th></tr></thead><tbody>' +
        products.map(function (p) { return '<tr style="cursor:pointer" onclick="Faturamais.navigate(\'produto/' + p.id + '\')"><td class="mono">' + esc(p.sku) + '</td><td>' + esc(p.name) + '</td><td>' + esc(p.category) + '</td><td class="num">' + p.stock + '</td><td class="num">' + p.reserved + '</td><td class="num">' + p.minStock + '</td><td class="num">' + fmtBRL(p.cost) + '</td><td class="num">' + fmtBRL(p.price) + '</td><td>' + statusBadge(p.stock <= p.minStock ? 'pendente' : 'ativo') + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== PRODUTO DETALHE ===== */
    route('produto', function (params) {
      const p = D.findById('products', params[0]);
      if (!p) return '<div class="empty-state"><h3>Produto não encontrado</h3></div>';
      const moves = D.get('inventoryMoves').filter(function (m) { return m.productId === p.id; });
      const available = p.stock - p.reserved;
      return '<div class="page-header"><div class="detail-header"><div><div class="detail-title">' + esc(p.name) + '</div><div class="detail-sub">SKU: ' + esc(p.sku) + ' · ' + esc(p.category) + '</div></div>' + statusBadge(p.stock <= p.minStock ? 'pendente' : 'ativo') + '</div></div>' +
        '<div class="kpi-row"><div class="kpi-tile"><div class="kpi-tile-label">Disponível</div><div class="kpi-tile-value">' + available + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Reservado</div><div class="kpi-tile-value warning">' + p.reserved + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Estoque mínimo</div><div class="kpi-tile-value">' + p.minStock + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Custo médio</div><div class="kpi-tile-value">' + fmtBRL(p.cost) + '</div></div></div>' +
        '<div class="grid-2"><div class="detail-section"><h3>Detalhes</h3><p>Preço de venda: <strong>' + fmtBRL(p.price) + '</strong></p><p style="margin-top:var(--sp-2)">Margem: <strong>' + (((p.price - p.cost) / p.price) * 100).toFixed(1) + '%</strong></p><p style="margin-top:var(--sp-2)">Valor em estoque: <strong>' + fmtBRL(p.stock * p.cost) + '</strong></p></div>' +
        '<div class="detail-section"><h3>Movimentações recentes</h3><div class="timeline">' + moves.map(function (m) { return '<div class="timeline-item"><div class="timeline-dot ' + (m.type === 'entrada' ? 'success' : 'warn') + '"></div><div class="timeline-date">' + fmtDate(m.date) + '</div><div class="timeline-text">' + (m.type === 'entrada' ? '+' : '−') + m.qty + ' ' + esc(m.reason) + '</div></div>'; }).join('') || '<p class="text-sm" style="color:var(--text-muted)">Sem movimentações</p>' + '</div></div></div>';
    });

    /* ===== MOVIMENTAÇÕES ===== */
    route('movimentacoes', function () {
      const moves = D.get('inventoryMoves');
      return '<div class="page-header"><h1>Movimentações de estoque</h1><p>' + moves.length + ' registros</p></div>' +
        '<div class="chart-card" style="padding:0;overflow:hidden"><table class="data-table"><thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Qtd</th><th>Motivo</th><th>Usuário</th></tr></thead><tbody>' +
        moves.map(function (m) { const p = D.findById('products', m.productId); return '<tr><td>' + fmtDate(m.date) + '</td><td>' + esc(p ? p.name : m.productId) + '</td><td>' + statusBadge(m.type === 'entrada' ? 'ativo' : 'pendente') + '</td><td class="num">' + (m.type === 'entrada' ? '+' : '−') + m.qty + '</td><td>' + esc(m.reason) + '</td><td>' + esc(m.user) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== RELATÓRIOS ===== */
    route('relatorios', function () {
      const orders = D.get('orders');
      const products = D.get('products');
      const m = D.computeMetrics();
      const receitaPorCanal = {};
      orders.filter(function (o) { return o.status !== 'cancelado'; }).forEach(function (o) { receitaPorCanal[o.channel] = (receitaPorCanal[o.channel] || 0) + o.total; });
      const canalData = Object.keys(receitaPorCanal).map(function (k) { return { label: k, value: receitaPorCanal[k] }; });
      const topProducts = products.map(function (p) {
        const sold = D.get('orders').filter(function (o) { return o.status !== 'cancelado'; }).reduce(function (s, o) { return s + o.items.filter(function (i) { return i.productId === p.id; }).reduce(function (s2, i) { return s2 + i.qty; }, 0); }, 0);
        return { name: p.name, sold: sold, price: p.price, receita: sold * p.price };
      }).sort(function (a, b) { return b.receita - a.receita; }).slice(0, 5);
      return '<div class="page-header"><h1>Relatórios</h1><p>Análises gerenciais — ambiente demonstrativo</p></div>' +
        '<div class="kpi-row"><div class="kpi-tile"><div class="kpi-tile-label">Receita total</div><div class="kpi-tile-value">' + fmtBRL(m.totalReceita) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Ticket médio</div><div class="kpi-tile-value">' + fmtBRL(m.ticketMedio) + '</div></div><div class="kpi-tile"><div class="kpi-tile-label">Inadimplência</div><div class="kpi-tile-value warning">' + m.inadimplencia.toFixed(1) + '%</div></div><div class="kpi-tile"><div class="kpi-tile-label">Taxa recebimento</div><div class="kpi-tile-value positive">' + m.taxaRecebimento.toFixed(1) + '%</div></div></div>' +
        '<div class="grid-2"><div class="chart-card"><div class="chart-card-title">Receita por canal</div>' + barChart(canalData, { label: 'Receita por canal', width: 450, height: 200 }) + '</div><div class="chart-card"><div class="chart-card-title">Taxa de recebimento</div>' + donutChart(m.taxaRecebimento, { label: 'Recebimento', color: '#059669' }) + '</div></div>' +
        '<div class="chart-card"><div class="chart-card-title">Top produtos por receita</div><table class="data-table"><thead><tr><th>Produto</th><th>Vendidos</th><th>Preço</th><th>Receita</th></tr></thead><tbody>' +
        topProducts.map(function (p) { return '<tr><td>' + esc(p.name) + '</td><td class="num">' + p.sold + '</td><td class="num">' + fmtBRL(p.price) + '</td><td class="num">' + fmtBRL(p.receita) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== INTEGRAÇÕES ===== */
    route('integracoes', function () {
      const integrations = D.get('integrations');
      return '<div class="page-header"><h1>Integrações</h1><p>Catálogo demonstrativo — todas as integrações são SIMULAÇÕES</p></div>' +
        '<div class="danfe-demo-stamp">SIMULAÇÃO DEMONSTRATIVA — NENHUMA INTEGRAÇÃO É REAL</div>' +
        '<div class="grid-3">' + integrations.map(function (i) { return '<div class="detail-section"><h3>' + esc(i.name) + '</h3><p class="text-sm" style="color:var(--text-secondary)">' + esc(i.desc) + '</p><p style="margin-top:var(--sp-3)">' + statusBadge('simulada') + '</p></div>'; }).join('') + '</div>';
    });

    /* ===== USUÁRIOS ===== */
    route('usuarios', function () {
      const users = D.get('users');
      return '<div class="page-header"><h1>Usuários</h1><p>' + users.length + ' usuários — ambiente demonstrativo</p></div>' +
        '<div class="chart-card" style="padding:0;overflow:hidden"><table class="data-table"><thead><tr><th>Nome</th><th>Email</th><th>Perfil</th><th>Status</th></tr></thead><tbody>' +
        users.map(function (u) { return '<tr><td><div style="display:flex;align-items:center;gap:var(--sp-2)"><div class="avatar" style="width:28px;height:28px;font-size:10px">' + esc(u.avatar) + '</div>' + esc(u.name) + '</div></td><td class="mono">' + esc(u.email) + '</td><td>' + esc(u.role) + '</td><td>' + statusBadge(u.active ? 'ativo' : 'inativo') + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    });

    /* ===== CONFIGURAÇÕES ===== */
    route('config', function () {
      const company = D.get('company');
      const config = D.get('config');
      return '<div class="page-header"><h1>Configurações</h1><p>Configurações do ambiente demonstrativo</p></div>' +
        '<div class="detail-section"><h3>Dados da empresa (DEMO)</h3><div class="form-group"><label class="form-label">Nome</label><input class="form-input" value="' + esc(company.name) + '" readonly></div><div class="form-group"><label class="form-label">CNPJ</label><input class="form-input" value="' + esc(company.cnpj) + '" readonly></div><div class="form-group"><label class="form-label">Endereço</label><input class="form-input" value="' + esc(company.address) + '" readonly></div></div>' +
        '<div class="detail-section"><h3>Fiscal (SIMULAÇÃO)</h3><div class="form-group"><label class="form-label">Regime</label><input class="form-input" value="' + esc(config.fiscal.regime) + '" readonly></div><div class="form-group"><label class="form-label">Ambiente</label><input class="form-input" value="' + esc(config.fiscal.environment) + '" readonly style="color:var(--warning);font-weight:600"></div></div>' +
        '<div class="detail-section"><h3>Financeiro</h3><div class="form-group"><label class="form-label">Conta bancária (DEMO)</label><input class="form-input" value="' + esc(config.financial.bankAccount) + '" readonly></div></div>' +
        '<div class="detail-section"><h3>Notificações</h3><p>Email: ' + statusBadge(config.notifications.email ? 'ativo' : 'inativo') + '</p><p style="margin-top:var(--sp-2)">SMS: ' + statusBadge(config.notifications.sms ? 'ativo' : 'inativo') + '</p><p style="margin-top:var(--sp-2)">WhatsApp: ' + statusBadge(config.notifications.whatsapp ? 'ativo' : 'inativo') + '</p><p style="margin-top:var(--sp-2)">Push: ' + statusBadge(config.notifications.push ? 'ativo' : 'inativo') + '</p></div>';
    });

    /* ===== ACTIONS ===== */
    F.receivePayment = function (receivableId) {
      const r = D.findById('receivables', receivableId);
      if (!r) return;
      openDrawer('Receber pagamento — ' + r.doc,
        '<div class="form-group"><label class="form-label">Valor a receber</label><input class="form-input" value="' + fmtBRL(r.amount) + '" readonly></div><div class="form-group"><label class="form-label">Método</label><select class="form-select"><option>' + esc(r.method) + '</option><option>PIX</option><option>Boleto</option><option>Cartão</option></select></div><div class="form-group"><label class="form-label">Data recebimento</label><input type="date" class="form-input" value="2026-09-01"></div>',
        '<button class="btn btn-ghost" onclick="Faturamais.closeDrawer()">Cancelar</button><button class="btn btn-primary" onclick="Faturamais.confirmReceive(\'' + r.id + '\')">Confirmar recebimento</button>');
    };

    F.confirmReceive = function (receivableId) {
      const r = D.findById('receivables', receivableId);
      if (!r) return;
      D.updateItem('receivables', receivableId, { status: 'recebido', paidAmount: r.amount, paidDate: '2026-09-01' });
      const payments = D.get('payments');
      payments.unshift({ id: 'pay' + Date.now(), receivableId: receivableId, customerId: r.customerId, amount: r.amount, method: r.method, date: '2026-09-01', bankRef: 'TXN-' + Date.now(), reconciled: false });
      D.save('payments', payments);
      const txns = D.get('transactions');
      txns.unshift({ id: 't' + Date.now(), type: 'credito', amount: r.amount, date: '2026-09-01', description: 'Recebimento — ' + r.doc, bankRef: 'TXN-' + Date.now(), reconciled: false, receivableId: receivableId });
      D.save('transactions', txns);
      F.closeDrawer();
      toast('Pagamento recebido — ' + r.doc, 'success');
      navigate('contas-receber');
    };

    F.payAccount = function (payableId) {
      const p = D.findById('payables', payableId);
      if (!p) return;
      D.updateItem('payables', payableId, { paid: true, paidDate: '2026-09-01' });
      toast('Conta paga — ' + p.supplier, 'success');
      navigate('contas-pagar');
    };

    F.reconcile = function (txnId, receivableId) {
      D.updateItem('transactions', txnId, { reconciled: true });
      const recs = D.get('reconciliations');
      recs.unshift({ id: 'rec' + Date.now(), transactionId: txnId, receivableId: receivableId, matchScore: 98, date: '2026-09-01', status: 'conciliado', user: 'Administrador' });
      D.save('reconciliations', recs);
      toast('Conciliação realizada — transação vinculada', 'success');
      navigate('conciliacao');
    };

    F.viewCharge = function (chargeId) {
      const ch = D.findById('charges', chargeId);
      if (!ch) return;
      const r = D.findById('receivables', ch.receivableId);
      const c = r ? D.findById('customers', r.customerId) : null;
      let body = '<p><strong>Cliente:</strong> ' + esc(c ? c.name : '—') + '</p><p style="margin-top:var(--sp-2)"><strong>Valor:</strong> ' + fmtBRL(ch.amount) + '</p><p style="margin-top:var(--sp-2)"><strong>Método:</strong> ' + esc(ch.method) + '</p>';
      if (ch.method === 'PIX' && ch.qrCode) {
        body += '<div style="margin-top:var(--sp-4);text-align:center"><div style="background:#fff;border:1px solid var(--border);padding:var(--sp-4);border-radius:var(--r-md);display:inline-block"><svg viewBox="0 0 100 100" width="160" height="160"><rect width="100" height="100" fill="#fff"/>' + generateQRDemo() + '</svg></div><p class="text-xs" style="color:var(--text-muted);margin-top:var(--sp-2)">QR Code DEMO — fictício</p></div>';
      } else if (ch.method === 'Boleto' && ch.barcode) {
        body += '<div style="margin-top:var(--sp-4);font-family:var(--font-mono);font-size:var(--fs-sm);background:var(--surface-alt);padding:var(--sp-3);border-radius:var(--r-md)">' + esc(ch.barcode) + '</div><p class="text-xs" style="color:var(--text-muted);margin-top:var(--sp-2)">Código de barras DEMO — fictício</p>';
      } else if (ch.method === 'Link' && ch.link) {
        body += '<div style="margin-top:var(--sp-4)"><input class="form-input" value="' + esc(ch.link) + '" readonly><p class="text-xs" style="color:var(--text-muted);margin-top:var(--sp-2)">Link DEMO — fictício</p></div>';
      }
      openDrawer('Cobrança ' + esc(ch.method) + ' DEMO', body, '<button class="btn btn-ghost" onclick="Faturamais.closeDrawer()">Fechar</button>');
    };

    function generateQRDemo() {
      let squares = '';
      for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) { if (Math.random() > 0.5) squares += '<rect x="' + (i * 8 + 2) + '" y="' + (j * 8 + 2) + '" width="7" height="7" fill="#101828"/>'; }
      squares += '<rect x="2" y="2" width="22" height="22" fill="none" stroke="#101828" stroke-width="3"/><rect x="76" y="2" width="22" height="22" fill="none" stroke="#101828" stroke-width="3"/><rect x="2" y="76" width="22" height="22" fill="none" stroke="#101828" stroke-width="3"/>';
      return squares;
    }

    /* ===== TAB SWITCHING ===== */
    document.addEventListener('click', function (e) {
      if (e.target.classList && e.target.classList.contains('tab')) {
        const tabName = e.target.dataset.tab;
        const parent = e.target.closest('.tabs');
        if (parent) {
          parent.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
          e.target.classList.add('active');
          const container = parent.parentElement;
          container.querySelectorAll('.tab-content').forEach(function (c) { c.style.display = 'none'; });
          const target = container.querySelector('#tab-' + tabName);
          if (target) target.style.display = 'block';
        }
      }
    });
  }

  window.FaturamaisViews = { register: register };
})(window, document);
