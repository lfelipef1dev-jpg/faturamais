/* Faturamais 2.0 — Router + Shell
   SPA hash-based. Carrega views sob demanda. */

(function (window, document) {
  'use strict';

  const D = window.FaturamaisData;

  /* ===== HELPERS ===== */
  const $ = function (sel) { return document.querySelector(sel); };
  const $$ = function (sel) { return Array.from(document.querySelectorAll(sel)); };
  const el = function (tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(function (c) {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  };
  const fmtBRL = function (v) { return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  const fmtNum = function (v) { return Number(v).toLocaleString('pt-BR'); };
  const fmtDate = function (d) { if (!d) return '—'; const [y, m, day] = d.split('-'); return day + '/' + m + '/' + y; };
  const esc = function (s) { const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; };

  const STATUS_MAP = {
    'a_vencer': { label: 'A vencer', cls: 'badge-info' },
    'vencido': { label: 'Vencido', cls: 'badge-danger' },
    'recebido': { label: 'Recebido', cls: 'badge-success' },
    'parcial': { label: 'Parcial', cls: 'badge-warn' },
    'cancelado': { label: 'Cancelado', cls: 'badge-neutral' },
    'a_pagar': { label: 'A pagar', cls: 'badge-info' },
    'pago': { label: 'Pago', cls: 'badge-success' },
    'autorizada': { label: 'Autorizada', cls: 'badge-success' },
    'rejeitada': { label: 'Rejeitada', cls: 'badge-danger' },
    'cancelada': { label: 'Cancelada', cls: 'badge-neutral' },
    'processando': { label: 'Processando', cls: 'badge-warn' },
    'rascunho': { label: 'Rascunho', cls: 'badge-neutral' },
    'ativo': { label: 'Ativo', cls: 'badge-success' },
    'inativo': { label: 'Inativo', cls: 'badge-neutral' },
    'pago_order': { label: 'Pago', cls: 'badge-success' },
    'faturado': { label: 'Faturado', cls: 'badge-info' },
    'entregue': { label: 'Entregue', cls: 'badge-success' },
    'pendente': { label: 'Pendente', cls: 'badge-warn' },
    'cancelado_order': { label: 'Cancelado', cls: 'badge-neutral' },
    'gerada': { label: 'Gerada', cls: 'badge-info' },
    'vencida_charge': { label: 'Vencida', cls: 'badge-danger' },
    'simulada': { label: 'Simulada', cls: 'badge-warn' }
  };
  const statusBadge = function (status) {
    const s = STATUS_MAP[status] || { label: status, cls: 'badge-neutral' };
    return '<span class="badge-status ' + s.cls + '">' + esc(s.label) + '</span>';
  };

  function toast(msg, type) {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'toast show ' + (type || '');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.className = 'toast'; }, 3000);
  }

  /* ===== ROUTER ===== */
  const routes = {};
  function route(path, handler) { routes[path] = handler; }

  function navigate(path) {
    window.location.hash = '#/' + path;
  }

  function parseHash() {
    const h = window.location.hash.replace(/^#\/?/, '');
    return h || 'dashboard';
  }

  function render() {
    const path = parseHash();
    const parts = path.split('/');
    const base = parts[0];
    const params = parts.slice(1);

    const handler = routes[base] || routes['404'];
    const content = $('#app-content');

    // Update nav
    $$('.nav-item').forEach(function (n) {
      n.classList.toggle('active', n.dataset.route === base);
    });

    // Update breadcrumbs
    updateBreadcrumbs(base, params);

    content.innerHTML = '<div style="padding:var(--sp-10);text-align:center;color:var(--text-muted)">Carregando...</div>';
    try {
      const html = handler(params, content);
      if (html) content.innerHTML = html;
      content.scrollTop = 0;
    } catch (e) {
      content.innerHTML = '<div class="empty-state"><h3>Erro ao carregar</h3><p>' + esc(e.message) + '</p></div>';
      console.error(e);
    }
  }

  function updateBreadcrumbs(base, params) {
    const labels = {
      'dashboard': 'Visão geral',
      'pedidos': 'Pedidos',
      'pedido': 'Pedido',
      'clientes': 'Clientes',
      'cliente': 'Cliente',
      'documentos': 'Documentos',
      'documento': 'Documento',
      'emitir': 'Emitir documento',
      'cobrancas': 'Cobranças',
      'contas-receber': 'Contas a receber',
      'contas-pagar': 'Contas a pagar',
      'fluxo-caixa': 'Fluxo de caixa',
      'conciliacao': 'Conciliação',
      'dre': 'DRE gerencial',
      'produtos': 'Produtos',
      'produto': 'Produto',
      'movimentacoes': 'Movimentações',
      'relatorios': 'Relatórios',
      'integracoes': 'Integrações',
      'usuarios': 'Usuários',
      'config': 'Configurações'
    };
    const bc = $('#breadcrumbs');
    let html = '<a href="#" onclick="window.Faturamais.navigate(\'dashboard\');return false">Início</a>';
    if (base !== 'dashboard') {
      html += '<span>/</span><span>' + esc(labels[base] || base) + '</span>';
      if (params.length) html += '<span>/</span><span>' + esc(params[0]) + '</span>';
    }
    bc.innerHTML = html;
  }

  /* ===== SHELL INTERACTIONS ===== */
  function initShell() {
    // Sidebar toggle (mobile)
    $('#sidebar-toggle').addEventListener('click', function () {
      $('#sidebar').classList.toggle('open');
    });

    // Nav items
    $$('.nav-item').forEach(function (n) {
      n.addEventListener('click', function () {
        navigate(n.dataset.route);
        if (window.innerWidth <= 768) $('#sidebar').classList.remove('open');
      });
    });

    // Notifications
    $('#notif-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      renderNotifications();
      $('#notif-panel').classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#notif-panel') && !e.target.closest('#notif-btn')) {
        $('#notif-panel').classList.remove('open');
      }
    });

    // Command palette
    $('#search-trigger').addEventListener('click', openCmd);
    $('#search-trigger').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') openCmd();
    });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openCmd();
      }
      if (e.key === 'Escape') {
        $('#cmd-overlay').classList.remove('open');
        $('#drawer').classList.remove('open');
        $('#drawer-overlay').classList.remove('open');
        $('#notif-panel').classList.remove('open');
      }
    });
    $('#cmd-overlay').addEventListener('click', function (e) {
      if (e.target === this) this.classList.remove('open');
    });
    $('#cmd-input').addEventListener('input', renderCmdResults);
    $('#cmd-input').addEventListener('keydown', cmdKeydown);

    // Drawer close
    $('#drawer-close').addEventListener('click', closeDrawer);
    $('#drawer-overlay').addEventListener('click', closeDrawer);

    // Hash change
    window.addEventListener('hashchange', render);
  }

  function renderNotifications() {
    const notifs = D.get('notifications');
    const list = $('#notif-list');
    if (!notifs.length) {
      list.innerHTML = '<div style="padding:var(--sp-5);text-align:center;color:var(--text-muted);font-size:var(--fs-sm)">Sem notificações</div>';
      return;
    }
    list.innerHTML = notifs.slice(0, 10).map(function (n) {
      return '<div class="notif-item' + (n.read ? '' : ' unread') + '">' +
        '<div class="notif-icon ' + n.severity + '">' + getNotifIcon(n.type) + '</div>' +
        '<div class="notif-content"><div class="notif-title">' + esc(n.title) + '</div>' +
        '<div class="notif-desc">' + esc(n.desc) + '</div>' +
        '<div class="notif-time">' + esc(n.date) + '</div></div></div>';
    }).join('');
  }

  function getNotifIcon(type) {
    const icons = {
      'vencido': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      'estoque': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      'recebido': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
      'conciliacao': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      'pedido': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>'
    };
    return icons[type] || icons.pedido;
  }

  /* ===== COMMAND PALETTE ===== */
  const CMD_ACTIONS = [
    { label: 'Novo pedido', cat: 'Vendas', icon: '🛒', action: function () { navigate('pedido/novo'); } },
    { label: 'Emitir documento', cat: 'Faturamento', icon: '📄', action: function () { navigate('emitir'); } },
    { label: 'Nova cobrança', cat: 'Cobranças', icon: '💳', action: function () { navigate('cobrancas'); } },
    { label: 'Novo cliente', cat: 'CRM', icon: '👤', action: function () { navigate('clientes'); } },
    { label: 'Ver dashboard', cat: 'Visão geral', icon: '📊', action: function () { navigate('dashboard'); } },
    { label: 'Contas a receber', cat: 'Financeiro', icon: '📥', action: function () { navigate('contas-receber'); } },
    { label: 'Contas a pagar', cat: 'Financeiro', icon: '📤', action: function () { navigate('contas-pagar'); } },
    { label: 'Fluxo de caixa', cat: 'Financeiro', icon: '💰', action: function () { navigate('fluxo-caixa'); } },
    { label: 'Conciliação bancária', cat: 'Financeiro', icon: '🔄', action: function () { navigate('conciliacao'); } },
    { label: 'DRE gerencial', cat: 'Financeiro', icon: '📈', action: function () { navigate('dre'); } },
    { label: 'Produtos', cat: 'Estoque', icon: '📦', action: function () { navigate('produtos'); } },
    { label: 'Movimentações', cat: 'Estoque', icon: '🔄', action: function () { navigate('movimentacoes'); } },
    { label: 'Relatórios', cat: 'Análises', icon: '📋', action: function () { navigate('relatorios'); } },
    { label: 'Integrações', cat: 'Sistema', icon: '🔌', action: function () { navigate('integracoes'); } },
    { label: 'Usuários', cat: 'Sistema', icon: '👥', action: function () { navigate('usuarios'); } },
    { label: 'Configurações', cat: 'Sistema', icon: '⚙️', action: function () { navigate('config'); } }
  ];

  let cmdSelected = 0;
  function openCmd() {
    $('#cmd-overlay').classList.add('open');
    $('#cmd-input').value = '';
    cmdSelected = 0;
    renderCmdResults();
    setTimeout(function () { $('#cmd-input').focus(); }, 50);
  }

  function renderCmdResults() {
    const q = ($('#cmd-input').value || '').toLowerCase();
    let results = CMD_ACTIONS;
    if (q) {
      results = CMD_ACTIONS.filter(function (a) {
        return a.label.toLowerCase().indexOf(q) >= 0 || a.cat.toLowerCase().indexOf(q) >= 0;
      });
    }
    // Also search data
    if (q && q.length >= 2) {
      const customers = D.get('customers').filter(function (c) { return c.name.toLowerCase().indexOf(q) >= 0; }).slice(0, 3);
      const orders = D.get('orders').filter(function (o) { return o.id.indexOf(q) >= 0; }).slice(0, 3);
      const invoices = D.get('invoices').filter(function (i) { return i.number.indexOf(q) >= 0; }).slice(0, 3);
      customers.forEach(function (c) { results.push({ label: c.name, cat: 'Cliente', icon: '👤', action: function () { navigate('cliente/' + c.id); } }); });
      orders.forEach(function (o) { results.push({ label: 'Pedido #' + o.id, cat: 'Vendas', icon: '🛒', action: function () { navigate('pedido/' + o.id); } }); });
      invoices.forEach(function (i) { results.push({ label: 'Documento ' + i.number, cat: 'Faturamento', icon: '📄', action: function () { navigate('documento/' + i.id); } }); });
    }
    cmdSelected = Math.min(cmdSelected, results.length - 1);
    $('#cmd-results').innerHTML = results.length ? results.map(function (r, i) {
      return '<div class="cmd-item' + (i === cmdSelected ? ' selected' : '') + '" data-idx="' + i + '">' +
        '<span>' + r.icon + '</span><span>' + esc(r.label) + '</span>' +
        '<span class="cmd-item-category">' + esc(r.cat) + '</span></div>';
    }).join('') : '<div style="padding:var(--sp-5);text-align:center;color:var(--text-muted);font-size:var(--fs-sm)">Nenhum resultado</div>';
    $$('#cmd-results .cmd-item').forEach(function (item) {
      item.addEventListener('click', function () {
        const idx = parseInt(this.dataset.idx);
        if (results[idx]) {
          $('#cmd-overlay').classList.remove('open');
          results[idx].action();
        }
      });
    });
    window._cmdResults = results;
  }

  function cmdKeydown(e) {
    const results = window._cmdResults || [];
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdSelected = Math.min(cmdSelected + 1, results.length - 1); renderCmdResults(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdSelected = Math.max(cmdSelected - 1, 0); renderCmdResults(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[cmdSelected]) { $('#cmd-overlay').classList.remove('open'); results[cmdSelected].action(); } }
  }

  /* ===== DRAWER ===== */
  function openDrawer(title, bodyHtml, footerHtml) {
    $('#drawer-title').textContent = title;
    $('#drawer-body').innerHTML = bodyHtml;
    $('#drawer-footer').innerHTML = footerHtml || '';
    $('#drawer').classList.add('open');
    $('#drawer-overlay').classList.add('open');
  }
  function closeDrawer() {
    $('#drawer').classList.remove('open');
    $('#drawer-overlay').classList.remove('open');
  }

  /* ===== SVG CHARTS ===== */
  function barChart(data, opts) {
    opts = opts || {};
    const w = opts.width || 600, h = opts.height || 200;
    const max = Math.max.apply(null, data.map(function (d) { return Math.abs(d.value); })) * 1.15;
    const barW = (w - 40) / data.length;
    const bars = data.map(function (d, i) {
      const bh = (Math.abs(d.value) / max) * (h - 40);
      const y = h - 20 - bh;
      const color = d.color || (d.value >= 0 ? '#059669' : '#DC2626');
      return '<rect x="' + (20 + i * barW + 4) + '" y="' + y + '" width="' + (barW - 8) + '" height="' + bh + '" rx="3" fill="' + color + '"/>' +
        '<text x="' + (20 + i * barW + barW / 2) + '" y="' + (h - 5) + '" text-anchor="middle" font-size="10" fill="#98A2B3">' + esc(d.label) + '</text>';
    }).join('');
    return '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.label || 'Gráfico') + '">' + bars + '</svg>';
  }

  function lineChart(data, opts) {
    opts = opts || {};
    const w = opts.width || 600, h = opts.height || 200;
    const max = Math.max.apply(null, data.map(function (d) { return d.value; })) * 1.15;
    const min = Math.min(0, Math.min.apply(null, data.map(function (d) { return d.value; })));
    const range = max - min || 1;
    const stepX = (w - 40) / (data.length - 1 || 1);
    const pts = data.map(function (d, i) {
      const x = 20 + i * stepX;
      const y = h - 20 - ((d.value - min) / range) * (h - 40);
      return { x: x, y: y, value: d.value, label: d.label };
    });
    const path = pts.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y; }).join(' ');
    const area = path + ' L' + pts[pts.length - 1].x + ' ' + (h - 20) + ' L' + pts[0].x + ' ' + (h - 20) + ' Z';
    const labels = pts.map(function (p) { return '<text x="' + p.x + '" y="' + (h - 5) + '" text-anchor="middle" font-size="10" fill="#98A2B3">' + esc(p.label) + '</text>'; }).join('');
    const color = opts.color || '#0F766E';
    return '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.label || 'Gráfico') + '">' +
      '<path d="' + area + '" fill="' + color + '" opacity="0.1"/>' +
      '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="2"/>' +
      pts.map(function (p) { return '<circle cx="' + p.x + '" cy="' + p.y + '" r="3" fill="' + color + '"/>'; }).join('') +
      labels + '</svg>';
  }

  function multiLineChart(series, opts) {
    opts = opts || {};
    const w = opts.width || 600, h = opts.height || 220;
    const allVals = series.reduce(function (a, s) { return a.concat(s.data.map(function (d) { return d.value; })); }, []);
    const max = Math.max.apply(null, allVals) * 1.15;
    const min = 0;
    const range = max - min || 1;
    const labels = series[0].data.map(function (d) { return d.label; });
    const stepX = (w - 50) / (labels.length - 1 || 1);
    const lines = series.map(function (s) {
      const pts = s.data.map(function (d, i) {
        const x = 40 + i * stepX;
        const y = h - 30 - ((d.value - min) / range) * (h - 50);
        return { x: x, y: y };
      });
      const path = pts.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y; }).join(' ');
      return '<path d="' + path + '" fill="none" stroke="' + s.color + '" stroke-width="2.5"/>' +
        pts.map(function (p) { return '<circle cx="' + p.x + '" cy="' + p.y + '" r="3" fill="' + s.color + '"/>'; }).join('');
    }).join('');
    const labelEls = labels.map(function (l, i) {
      return '<text x="' + (40 + i * stepX) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="10" fill="#98A2B3">' + esc(l) + '</text>';
    }).join('');
    const legend = series.map(function (s) {
      return '<rect x="10" y="5" width="12" height="12" rx="2" fill="' + s.color + '"/><text x="28" y="15" font-size="11" fill="#475467">' + esc(s.name) + '</text>';
    }).join('');
    return '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.label || 'Gráfico') + '">' +
      '<g transform="translate(0,0)">' + legend + '</g>' + lines + labelEls + '</svg>';
  }

  function donutChart(value, opts) {
    opts = opts || {};
    const w = opts.width || 160, h = opts.height || 160;
    const r = 60, cx = w / 2, cy = h / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    const color = opts.color || '#0F766E';
    return '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + value + '%">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#E4E7EC" stroke-width="12"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="12" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>' +
      '<text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" font-size="22" font-weight="700" fill="' + color + '">' + value + '%</text></svg>';
  }

  /* ===== EXPORT ===== */
  window.Faturamais = {
    navigate: navigate,
    toast: toast,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    route: route,
    render: render,
    helpers: { $, $$, el, fmtBRL, fmtNum, fmtDate, esc, statusBadge, barChart, lineChart, multiLineChart, donutChart, D }
  };

  /* ===== INIT ===== */
  document.addEventListener('DOMContentLoaded', function () {
    initShell();
    // Register all view modules
    if (window.FaturamaisViews) window.FaturamaisViews.register(window.Faturamais);
    render();
  });
})(window, document);
