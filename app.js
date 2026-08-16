window.onerror = function (msg, url, line) {
  document.body.innerHTML = '<pre style="padding:2rem;background:#111;color:#ff4d4d;font-size:1rem;white-space:pre-wrap;">Erro JavaScript:\n' + msg + '\nLinha: ' + line + '\nArquivo: ' + url + '</pre>';
};

(function () {
  'use strict';

  const MOCK_DATA = {
    vendas: [
      { id: '#4521', cliente: 'João Silva', email: 'joao@email.com', valor: 299.90, status: 'Pago', data: '2024-06-14T14:32' },
      { id: '#4520', cliente: 'Maria Souza', email: 'maria@email.com', valor: 149.90, status: 'Pago', data: '2024-06-14T11:15' },
      { id: '#4519', cliente: 'Pedro Lima', email: 'pedro@email.com', valor: 899.00, status: 'Pendente', data: '2024-06-13T18:20' },
      { id: '#4518', cliente: 'Ana Costa', email: 'ana@email.com', valor: 59.90, status: 'Pago', data: '2024-06-13T09:45' },
      { id: '#4517', cliente: 'Carlos Mendes', email: 'carlos@email.com', valor: 499.00, status: 'Enviado', data: '2024-06-12T16:00' },
      { id: '#4516', cliente: 'Fernanda Lima', email: 'fernanda@email.com', valor: 1299.90, status: 'Pago', data: '2024-06-12T10:30' },
      { id: '#4515', cliente: 'Roberto Santos', email: 'roberto@email.com', valor: 349.90, status: 'Cancelado', data: '2024-06-11T14:22' },
      { id: '#4514', cliente: 'Juliana Moraes', email: 'juliana@email.com', valor: 199.90, status: 'Enviado', data: '2024-06-11T08:10' }
    ],
    clientes: [
      { nome: 'João Silva', email: 'joao@email.com', telefone: '(13) 99999-1111', compras: 12, total: 3240.00, status: 'Ativo', avatar: 'JS' },
      { nome: 'Maria Souza', email: 'maria@email.com', telefone: '(13) 99999-2222', compras: 8, total: 1890.50, status: 'Ativo', avatar: 'MS' },
      { nome: 'Pedro Lima', email: 'pedro@email.com', telefone: '(13) 99999-3333', compras: 3, total: 2450.00, status: 'Pendente', avatar: 'PL' },
      { nome: 'Ana Costa', email: 'ana@email.com', telefone: '(13) 99999-4444', compras: 24, total: 5120.00, status: 'Ativo', avatar: 'AC' },
      { nome: 'Carlos Mendes', email: 'carlos@email.com', telefone: '(13) 99999-5555', compras: 6, total: 1450.00, status: 'Ativo', avatar: 'CM' },
      { nome: 'Fernanda Lima', email: 'fernanda@email.com', telefone: '(13) 99999-6666', compras: 1, total: 1299.90, status: 'Novo', avatar: 'FL' },
      { nome: 'Roberto Santos', email: 'roberto@email.com', telefone: '(13) 99999-7777', compras: 2, total: 549.80, status: 'Inativo', avatar: 'RS' },
      { nome: 'Juliana Moraes', email: 'juliana@email.com', telefone: '(13) 99999-8888', compras: 5, total: 890.00, status: 'Ativo', avatar: 'JM' }
    ],
    produtos: [
      { nome: 'Fone Bluetooth Pro X1', estoque: 45, vendidos: 234, preco: 299.90, status: 'Ativo' },
      { nome: 'Smartwatch Ultra Fit', estoque: 12, vendidos: 89, preco: 499.90, status: 'Ativo' },
      { nome: 'Camiseta Tech DryFit', estoque: 120, vendidos: 567, preco: 89.90, status: 'Ativo' },
      { nome: 'Tênis Runner Air Max', estoque: 8, vendidos: 412, preco: 349.90, status: 'Baixo' },
      { nome: 'Mochila Anti-Furto Pro', estoque: 67, vendidos: 156, preco: 199.90, status: 'Ativo' },
      { nome: 'Powerbank Ultra 20K', estoque: 34, vendidos: 67, preco: 149.90, status: 'Ativo' },
      { nome: 'Cafeteira Smart WiFi', estoque: 3, vendidos: 201, preco: 899.90, status: 'Baixo' },
      { nome: 'Óculos Polarizados', estoque: 89, vendidos: 45, preco: 179.90, status: 'Ativo' }
    ],
    transacoes: [
      { data: '2024-06-14', descricao: 'Venda #4521', tipo: 'Entrada', valor: 299.90 },
      { data: '2024-06-14', descricao: 'Venda #4520', tipo: 'Entrada', valor: 149.90 },
      { data: '2024-06-14', descricao: 'Fornecedor TechGear', tipo: 'Saída', valor: -4500.00 },
      { data: '2024-06-13', descricao: 'Venda #4518', tipo: 'Entrada', valor: 59.90 },
      { data: '2024-06-13', descricao: 'Ads Google/Meta', tipo: 'Saída', valor: -2100.00 }
    ],
    config: {
      empresa: 'LojaDemo E-commerce',
      email: 'contato@lojademo.com.br',
      cnpj: '12.345.678/0001-90',
      telefone: '(13) 3333-4444',
      notificacoes: ['vendas', 'estoque', 'relatorio']
    }
  };

  function clone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return obj;
    }
  }

  function getData(key) {
    try {
      const stored = localStorage.getItem('faturamais_' + key);
      return stored ? JSON.parse(stored) : clone(MOCK_DATA[key]);
    } catch (e) {
      return clone(MOCK_DATA[key]);
    }
  }

  function setData(key, value) {
    try {
      localStorage.setItem('faturamais_' + key, JSON.stringify(value));
    } catch (e) {}
  }

  function initData() {
    Object.keys(MOCK_DATA).forEach(function (key) {
      if (localStorage.getItem('faturamais_' + key) === null) {
        setData(key, getData(key));
      }
    });
  }

  const STATUS_CLASS = {
    Pago: 'done', Pendente: 'pending', Enviado: 'shipping', Cancelado: 'cancelado',
    Ativo: 'done', Inativo: 'cancelado', Novo: 'pending', Baixo: 'warning',
    Entrada: 'done', Saída: 'pending'
  };

  function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3000);
  }

  function calcularKPIs() {
    const vendas = getData('vendas');
    const clientes = getData('clientes');
    const produtos = getData('produtos');
    const transacoes = getData('transacoes');

    const faturamento = vendas.filter(function (v) { return v.status === 'Pago'; }).reduce(function (a, v) { return a + v.valor; }, 0);
    const clientesAtivos = clientes.filter(function (c) { return c.status === 'Ativo'; }).length;
    const pedidosHoje = vendas.filter(function (v) { return v.data && v.data.indexOf('2024-06-14') === 0; }).length;
    const totalVisitas = 4105;
    const conversao = totalVisitas ? pedidosHoje / totalVisitas : 0;

    const receita = transacoes.filter(function (t) { return t.tipo === 'Entrada'; }).reduce(function (a, t) { return a + t.valor; }, 0);
    const despesas = Math.abs(transacoes.filter(function (t) { return t.tipo === 'Saída'; }).reduce(function (a, t) { return a + t.valor; }, 0));
    const lucro = receita - despesas;
    const margem = receita > 0 ? ((lucro / receita) * 100) : 0;

    const vendidosMes = produtos.reduce(function (a, p) { return a + p.vendidos; }, 0);
    const estoqueTotal = produtos.reduce(function (a, p) { return a + p.estoque; }, 0);

    return {
      faturamento: faturamento,
      clientesAtivos: clientesAtivos,
      pedidosHoje: pedidosHoje,
      conversao: conversao,
      receita: receita,
      despesas: despesas,
      lucro: lucro,
      margem: margem,
      vendidosMes: vendidosMes,
      estoqueTotal: estoqueTotal,
      totalClientes: clientes.length,
      ativos: clientes.filter(function (c) { return c.status === 'Ativo'; }).length,
      novos: clientes.filter(function (c) { return c.status === 'Novo'; }).length,
      inativos: clientes.filter(function (c) { return c.status === 'Inativo'; }).length,
      pendentes: vendas.filter(function (v) { return v.status === 'Pendente'; }).length,
      cancelados: vendas.filter(function (v) { return v.status === 'Cancelado'; }).length,
      estoqueBaixo: produtos.filter(function (p) { return p.status === 'Baixo'; }).length
    };
  }

  function carregarTema() {
    const salvo = localStorage.getItem('faturamais_tema');
    const escuro = salvo === 'dark';
    document.body.classList.toggle('dark', escuro);
    updateTemaIcon(escuro);
  }

  function toggleTema() {
    const escuro = !document.body.classList.contains('dark');
    document.body.classList.toggle('dark', escuro);
    localStorage.setItem('faturamais_tema', escuro ? 'dark' : 'light');
    updateTemaIcon(escuro);
  }

  function updateTemaIcon(escuro) {
    const icon = document.getElementById('tema-icon');
    if (!icon) return;
    icon.innerHTML = escuro
      ? '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  }

  function navegar(pagina, el) {
    var views = document.querySelectorAll('.content');
    for (var i = 0; i < views.length; i++) views[i].style.display = 'none';

    var view = document.getElementById('view-' + pagina);
    if (view) view.style.display = 'block';

    var navs = document.querySelectorAll('.nav-item');
    for (var j = 0; j < navs.length; j++) {
      navs[j].classList.remove('active');
      navs[j].removeAttribute('aria-current');
    }
    if (el) {
      el.classList.add('active');
      el.setAttribute('aria-current', 'page');
    }

    var tituloMap = {
      dashboard: 'Dashboard', vendas: 'Vendas', clientes: 'Clientes',
      produtos: 'Produtos', financeiro: 'Financeiro', config: 'Configurações'
    };
    var pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = tituloMap[pagina] || pagina;
    var main = document.getElementById('main-content');
    if (main) main.focus();

    if (pagina === 'dashboard') renderDashboard();
    if (pagina === 'vendas') renderVendas();
    if (pagina === 'clientes') renderClientes();
    if (pagina === 'produtos') renderProdutos();
    if (pagina === 'financeiro') renderFinanceiro();
    if (pagina === 'config') renderConfig();

    if (window.innerWidth <= 768) {
      var sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.remove('open');
    }
  }

  function renderKPIs(kpis) {
    return '<div class="kpi-grid" role="region" aria-label="Indicadores principais">' +
      '<div class="kpi-card"><div class="kpi-label">Faturamento (Mês)</div><div class="kpi-value">' + formatCurrency(kpis.faturamento) + '</div><div class="kpi-change positive">+12,5% vs mês anterior</div></div>' +
      '<div class="kpi-card"><div class="kpi-label">Clientes Ativos</div><div class="kpi-value">' + kpis.clientesAtivos + '</div><div class="kpi-change positive">+' + kpis.novos + ' novos</div></div>' +
      '<div class="kpi-card"><div class="kpi-label">Pedidos Hoje</div><div class="kpi-value">' + kpis.pedidosHoje + '</div><div class="kpi-change positive">+23% vs ontem</div></div>' +
      '<div class="kpi-card"><div class="kpi-label">Conversão</div><div class="kpi-value">' + (kpis.conversao * 100).toFixed(1) + '%</div><div class="kpi-change positive">+0,4%</div></div>' +
    '</div>';
  }

  function renderDashboard() {
    var k = calcularKPIs();
    var vendas = getData('vendas');
    var meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    var valores = [32500, 38400, 41200, 47850, 52300, 47850];
    var max = Math.max.apply(null, valores);
    var bars = '';
    for (var i = 0; i < valores.length; i++) {
      bars += '<div class="bar" style="height:' + ((valores[i] / max) * 100).toFixed(1) + '%" title="' + meses[i] + ': ' + formatCurrency(valores[i]) + '"><span>' + meses[i] + '</span></div>';
    }

    var recentes = '';
    for (var r = 0; r < Math.min(5, vendas.length); r++) {
      var v = vendas[r];
      recentes += '<tr><td>' + v.id + '</td><td><strong>' + v.cliente + '</strong></td><td>' + formatCurrency(v.valor) + '</td><td><span class="status ' + (STATUS_CLASS[v.status] || 'done') + '">' + v.status + '</span></td><td>' + formatDate(v.data) + '</td></tr>';
    }

    document.getElementById('view-dashboard').innerHTML =
      renderKPIs(k) +
      '<div class="charts-row">' +
        '<div class="chart-card large">' +
          '<h3>Faturamento por Mês</h3>' +
          '<div class="chart-bars" role="img" aria-label="Gráfico de faturamento mensal">' + bars + '</div>' +
        '</div>' +
        '<div class="chart-card">' +
          '<h3>Vendas por Canal</h3>' +
          '<div class="donut-chart" role="img" aria-label="65% orgânico, 35% pago">' +
            '<svg viewBox="0 0 100 100" aria-hidden="true">' +
              '<circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" stroke-width="12"/>' +
              '<circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-600)" stroke-width="12" stroke-dasharray="150 251"/>' +
              '<circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" stroke-width="12" stroke-dasharray="70 251" stroke-dashoffset="-150"/>' +
            '</svg>' +
            '<div class="donut-center">65%</div>' +
          '</div>' +
          '<div class="legend">' +
            '<span><span class="dot" style="background:var(--accent-600)"></span>Orgânico</span>' +
            '<span><span class="dot" style="background:var(--primary)"></span>Pago</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="table-card">' +
        '<h3>Últimos Pedidos</h3>' +
        '<div class="table-scroll">' +
          '<table>' +
            '<caption class="sr-only">Lista dos últimos pedidos</caption>' +
            '<thead><tr><th scope="col">ID</th><th scope="col">Cliente</th><th scope="col">Valor</th><th scope="col">Status</th><th scope="col">Data</th></tr></thead>' +
            '<tbody>' + recentes + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function renderVendas() {
    var k = calcularKPIs();
    var vendas = getData('vendas');
    var rows = '';
    for (var i = 0; i < vendas.length; i++) {
      var v = vendas[i];
      rows += '<tr><td>' + v.id + '</td><td><strong>' + v.cliente + '</strong></td><td>' + v.email + '</td><td>' + formatCurrency(v.valor) + '</td><td><span class="status ' + (STATUS_CLASS[v.status] || 'done') + '">' + v.status + '</span></td><td>' + formatDate(v.data) + '</td></tr>';
    }

    document.getElementById('view-vendas').innerHTML =
      '<div class="kpi-grid">' +
        '<div class="kpi-card"><div class="kpi-label">Vendas Hoje</div><div class="kpi-value">' + k.pedidosHoje + '</div><div class="kpi-change positive">+23%</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Ticket Médio</div><div class="kpi-value">' + formatCurrency(k.pedidosHoje ? k.faturamento / k.pedidosHoje : 0) + '</div><div class="kpi-change positive">+8%</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Pendentes</div><div class="kpi-value">' + k.pendentes + '</div><div class="kpi-change">Aguardando</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Cancelados</div><div class="kpi-value">' + k.cancelados + '</div><div class="kpi-change">' + (vendas.length ? ((k.cancelados / vendas.length) * 100).toFixed(1) : '0,0') + '%</div></div>' +
      '</div>' +
      '<div class="table-card">' +
        '<h3>Todas as Vendas</h3>' +
        '<div class="table-scroll">' +
          '<table>' +
            '<caption class="sr-only">Todas as vendas registradas</caption>' +
            '<thead><tr><th scope="col">ID</th><th scope="col">Cliente</th><th scope="col">E-mail</th><th scope="col">Valor</th><th scope="col">Status</th><th scope="col">Data</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function renderClientes() {
    var k = calcularKPIs();
    var clientes = getData('clientes');
    var rows = '';
    for (var i = 0; i < clientes.length; i++) {
      var c = clientes[i];
      rows += '<tr><td><div class="cliente-avatar" aria-hidden="true">' + c.avatar + '</div></td><td><strong>' + c.nome + '</strong></td><td>' + c.email + '</td><td>' + c.telefone + '</td><td>' + c.compras + '</td><td>' + formatCurrency(c.total) + '</td><td><span class="status ' + (STATUS_CLASS[c.status] || 'done') + '">' + c.status + '</span></td></tr>';
    }

    document.getElementById('view-clientes').innerHTML =
      '<div class="kpi-grid">' +
        '<div class="kpi-card"><div class="kpi-label">Total de Clientes</div><div class="kpi-value">' + k.totalClientes + '</div><div class="kpi-change positive">+' + k.novos + ' este mês</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Ativos</div><div class="kpi-value">' + k.ativos + '</div><div class="kpi-change positive">' + (k.totalClientes ? ((k.ativos / k.totalClientes) * 100).toFixed(0) : '0') + '%</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Novos</div><div class="kpi-value">' + k.novos + '</div><div class="kpi-change positive">+12%</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Inativos</div><div class="kpi-value">' + k.inativos + '</div><div class="kpi-change">' + (k.totalClientes ? ((k.inativos / k.totalClientes) * 100).toFixed(0) : '0') + '%</div></div>' +
      '</div>' +
      '<div class="table-card">' +
        '<h3>Lista de Clientes</h3>' +
        '<div class="table-scroll">' +
          '<table>' +
            '<caption class="sr-only">Lista de clientes</caption>' +
            '<thead><tr><th scope="col"></th><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Telefone</th><th scope="col">Compras</th><th scope="col">Total</th><th scope="col">Status</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function renderProdutos() {
    var k = calcularKPIs();
    var produtos = getData('produtos');
    var rows = '';
    for (var i = 0; i < produtos.length; i++) {
      var p = produtos[i];
      rows += '<tr><td><strong>' + p.nome + '</strong></td><td>' + p.estoque + '</td><td>' + p.vendidos + '</td><td>' + formatCurrency(p.preco) + '</td><td><span class="status ' + (STATUS_CLASS[p.status] || 'done') + '">' + p.status + '</span></td></tr>';
    }

    document.getElementById('view-produtos').innerHTML =
      '<div class="kpi-grid">' +
        '<div class="kpi-card"><div class="kpi-label">Total de Produtos</div><div class="kpi-value">' + produtos.length + '</div><div class="kpi-change">' + produtos.length + ' itens</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Em Estoque</div><div class="kpi-value">' + k.estoqueTotal + '</div><div class="kpi-change">Unidades</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Estoque Baixo</div><div class="kpi-value">' + k.estoqueBaixo + '</div><div class="kpi-change warning">Alerta</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Vendidos (Mês)</div><div class="kpi-value">' + k.vendidosMes + '</div><div class="kpi-change positive">+18%</div></div>' +
      '</div>' +
      '<div class="table-card">' +
        '<h3>Gestão de Produtos</h3>' +
        '<div class="table-scroll">' +
          '<table>' +
            '<caption class="sr-only">Lista de produtos</caption>' +
            '<thead><tr><th scope="col">Produto</th><th scope="col">Estoque</th><th scope="col">Vendidos</th><th scope="col">Preço</th><th scope="col">Status</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function renderFinanceiro() {
    var k = calcularKPIs();
    var transacoes = getData('transacoes');
    var meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    var valores = [32000, 28500, 41500, 30500, 48500, 35500];
    var max = Math.max.apply(null, valores);
    var bars = '';
    for (var i = 0; i < valores.length; i++) {
      bars += '<div class="bar" style="height:' + ((valores[i] / max) * 100).toFixed(1) + '%" title="' + meses[i] + ': ' + formatCurrency(valores[i]) + '"><span>' + meses[i] + '</span></div>';
    }

    var rows = '';
    for (var i = 0; i < transacoes.length; i++) {
      var t = transacoes[i];
      rows += '<tr><td>' + new Date(t.data).toLocaleDateString('pt-BR') + '</td><td>' + t.descricao + '</td><td><span class="status ' + (t.tipo === 'Entrada' ? 'done' : 'pending') + '">' + t.tipo + '</span></td><td style="color:' + (t.tipo === 'Entrada' ? 'var(--accent-600)' : 'var(--danger)') + ';font-weight:700">' + (t.tipo === 'Entrada' ? '+' : '') + formatCurrency(Math.abs(t.valor)) + '</td></tr>';
    }

    document.getElementById('view-financeiro').innerHTML =
      '<div class="kpi-grid">' +
        '<div class="kpi-card"><div class="kpi-label">Receita (Mês)</div><div class="kpi-value">' + formatCurrency(k.receita) + '</div><div class="kpi-change positive">+12,5%</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Despesas</div><div class="kpi-value">' + formatCurrency(k.despesas) + '</div><div class="kpi-change">Fixas</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Lucro Líquido</div><div class="kpi-value">' + formatCurrency(k.lucro) + '</div><div class="kpi-change positive">+15%</div></div>' +
        '<div class="kpi-card"><div class="kpi-label">Margem</div><div class="kpi-value">' + k.margem.toFixed(0) + '%</div><div class="kpi-change positive">+2%</div></div>' +
      '</div>' +
      '<div class="charts-row">' +
        '<div class="chart-card large">' +
          '<h3>Fluxo de Caixa</h3>' +
          '<div class="chart-bars" role="img" aria-label="Gráfico de fluxo de caixa">' + bars + '</div>' +
        '</div>' +
        '<div class="chart-card">' +
          '<h3>Despesas por Categoria</h3>' +
          '<div class="donut-chart" role="img" aria-label="Produtos 45%, Marketing 30%, Operacional 25%">' +
            '<svg viewBox="0 0 100 100" aria-hidden="true">' +
              '<circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" stroke-width="12"/>' +
              '<circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-600)" stroke-width="12" stroke-dasharray="120 251"/>' +
              '<circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" stroke-width="12" stroke-dasharray="70 251" stroke-dashoffset="-120"/>' +
              '<circle cx="50" cy="50" r="40" fill="none" stroke="var(--danger)" stroke-width="12" stroke-dasharray="50 251" stroke-dashoffset="-190"/>' +
            '</svg>' +
            '<div class="donut-center">12k</div>' +
          '</div>' +
          '<div class="legend">' +
            '<span><span class="dot" style="background:var(--accent-600)"></span>Produtos</span>' +
            '<span><span class="dot" style="background:var(--primary)"></span>Marketing</span>' +
            '<span><span class="dot" style="background:var(--danger)"></span>Operacional</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="table-card">' +
        '<h3>Transações Recentes</h3>' +
        '<div class="table-scroll">' +
          '<table>' +
            '<caption class="sr-only">Transações financeiras recentes</caption>' +
            '<thead><tr><th scope="col">Data</th><th scope="col">Descrição</th><th scope="col">Tipo</th><th scope="col">Valor</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function renderConfig() {
    var c = getData('config');
    document.getElementById('view-config').innerHTML =
      '<div class="config-grid">' +
        '<div class="config-card">' +
          '<h3>Perfil da Empresa</h3>' +
          '<form class="config-form" onsubmit="return false;">' +
            '<label for="empresa-nome">Nome da empresa</label>' +
            '<input type="text" id="empresa-nome" value="' + c.empresa + '">' +
            '<label for="empresa-email">E-mail</label>' +
            '<input type="email" id="empresa-email" value="' + c.email + '">' +
            '<label for="empresa-cnpj">CNPJ</label>' +
            '<input type="text" id="empresa-cnpj" value="' + c.cnpj + '">' +
            '<label for="empresa-telefone">Telefone</label>' +
            '<input type="tel" id="empresa-telefone" value="' + c.telefone + '">' +
            '<button type="button" class="btn btn-primary" id="btn-salvar-empresa">Salvar Alterações</button>' +
          '</form>' +
        '</div>' +
        '<div class="config-card">' +
          '<h3>Segurança</h3>' +
          '<form class="config-form" onsubmit="return false;">' +
            '<label for="senha-atual">Senha atual</label>' +
            '<input type="password" id="senha-atual" placeholder="********">' +
            '<label for="senha-nova">Nova senha</label>' +
            '<input type="password" id="senha-nova" placeholder="Mínimo 8 caracteres">' +
            '<label for="senha-confirmar">Confirmar nova senha</label>' +
            '<input type="password" id="senha-confirmar" placeholder="Repita a senha">' +
            '<label for="mfa" class="checkbox"><input type="checkbox" id="mfa" checked> Autenticação em 2 fatores</label>' +
            '<button type="button" class="btn btn-primary" id="btn-salvar-senha">Atualizar Senha</button>' +
          '</form>' +
        '</div>' +
        '<div class="config-card">' +
          '<h3>Notificações</h3>' +
          '<form class="config-form" onsubmit="return false;">' +
            '<label for="notif-vendas" class="checkbox"><input type="checkbox" id="notif-vendas" ' + (c.notificacoes.indexOf('vendas') >= 0 ? 'checked' : '') + '> E-mail de novas vendas</label>' +
            '<label for="notif-estoque" class="checkbox"><input type="checkbox" id="notif-estoque" ' + (c.notificacoes.indexOf('estoque') >= 0 ? 'checked' : '') + '> E-mail de estoque baixo</label>' +
            '<label for="notif-clientes" class="checkbox"><input type="checkbox" id="notif-clientes" ' + (c.notificacoes.indexOf('clientes') >= 0 ? 'checked' : '') + '> E-mail de novos clientes</label>' +
            '<label for="notif-relatorio" class="checkbox"><input type="checkbox" id="notif-relatorio" ' + (c.notificacoes.indexOf('relatorio') >= 0 ? 'checked' : '') + '> Relatório semanal</label>' +
            '<button type="button" class="btn btn-primary" id="btn-salvar-notif">Salvar Preferências</button>' +
          '</form>' +
        '</div>' +
        '<div class="config-card">' +
          '<h3>Integração de Pagamento</h3>' +
          '<form class="config-form" onsubmit="return false;">' +
            '<label for="pix-chave">Chave PIX</label>' +
            '<input type="text" id="pix-chave" value="' + c.cnpj + '" readonly style="background:var(--surface-elevated)">' +
            '<label for="webhook">Webhook URL</label>' +
            '<input type="text" id="webhook" value="https://api.faturamais.com.br/webhook/pix" readonly style="background:var(--surface-elevated)">' +
            '<p style="color:var(--accent-600);font-weight:700">Integração ativa e funcionando</p>' +
            '<p style="font-weight:700">5.247 transações processadas</p>' +
            '<button type="button" class="btn btn-secondary" id="btn-testar-webhook">Testar Webhook</button>' +
          '</form>' +
        '</div>' +
      '</div>';

    setTimeout(function () {
      document.getElementById('btn-salvar-empresa').addEventListener('click', salvarEmpresa);
      document.getElementById('btn-salvar-senha').addEventListener('click', function () { showToast('Senha atualizada com sucesso'); });
      document.getElementById('btn-salvar-notif').addEventListener('click', salvarNotificacoes);
      document.getElementById('btn-testar-webhook').addEventListener('click', function () { showToast('Webhook testado com sucesso'); });
    }, 0);
  }

  function salvarEmpresa() {
    var cfg = getData('config');
    cfg.empresa = document.getElementById('empresa-nome').value;
    cfg.email = document.getElementById('empresa-email').value;
    cfg.cnpj = document.getElementById('empresa-cnpj').value;
    cfg.telefone = document.getElementById('empresa-telefone').value;
    setData('config', cfg);
    showToast('Alterações salvas com sucesso');
  }

  function salvarNotificacoes() {
    var checks = ['vendas', 'estoque', 'clientes', 'relatorio'];
    var notificacoes = [];
    for (var i = 0; i < checks.length; i++) {
      var el = document.getElementById('notif-' + checks[i]);
      if (el && el.checked) notificacoes.push(checks[i]);
    }
    var cfg = getData('config');
    cfg.notificacoes = notificacoes;
    setData('config', cfg);
    showToast('Preferências salvas com sucesso');
  }

  function setupSidebar() {
    var toggle = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');
    if (toggle) {
      toggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
      toggle.addEventListener('click', function () {
        var open = sidebar.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
      });
    }

    var navs = document.querySelectorAll('.nav-item');
    for (var i = 0; i < navs.length; i++) {
      navs[i].addEventListener('click', (function (btn) {
        return function () { navegar(btn.dataset.page, btn); };
      })(navs[i]));
    }

    var temaBtn = document.getElementById('tema-btn');
    if (temaBtn) temaBtn.addEventListener('click', toggleTema);
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      initData();
      carregarTema();
      setupSidebar();
      var firstNav = document.querySelector('.nav-item.active') || document.querySelector('.nav-item');
      if (firstNav) navegar(firstNav.dataset.page, firstNav);
    } catch (e) {
      document.body.innerHTML = '<pre style="padding:2rem;background:#111;color:#ff4d4d;font-size:1rem;white-space:pre-wrap;">Erro de inicialização:\n' + e.message + '\n' + e.stack + '</pre>';
    }
  });
})();
