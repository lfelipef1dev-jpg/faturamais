/* Faturamais 2.0 — Data Model Central
   Todos os dados se relacionam: customers -> orders -> invoices -> receivables -> payments -> reconciliations
   products -> inventory -> orders (baixa estoque)
   Persistencia: localStorage */

(function (window) {
  'use strict';

  const STORAGE_PREFIX = 'faturamais2_';

  /* ===== SEED DATA — todos ficticios ===== */
  const SEED = {
    company: {
      name: 'Tech Commerce DEMO',
      cnpj: '12.345.678/0001-90',
      ie: '123.456.789.123',
      im: '456.789',
      address: 'Rua das Palmeiras, 123 — Santos/SP',
      cep: '11010-000',
      phone: '(13) 3333-4444',
      email: 'contato@techcommerce.demo',
      regime: 'Simples Nacional',
      cityCode: '1234'
    },

    users: [
      { id: 'u1', name: 'Administrador', email: 'admin@techcommerce.demo', role: 'admin', avatar: 'AD', active: true },
      { id: 'u2', name: 'Juliana Financeiro', email: 'juliana@techcommerce.demo', role: 'financeiro', avatar: 'JF', active: true },
      { id: 'u3', name: 'Carlos Vendas', email: 'carlos@techcommerce.demo', role: 'vendas', avatar: 'CV', active: true },
      { id: 'u4', name: 'Ana Estoque', email: 'ana@techcommerce.demo', role: 'estoque', avatar: 'AE', active: true }
    ],

    customers: [
      { id: 'c1', name: 'Tech Commerce DEMO', doc: '12.345.678/0001-90', type: 'PJ', email: 'contato@techcommerce.demo', phone: '(13) 3333-4444', city: 'Santos/SP', segment: 'Tecnologia', since: '2024-01-15', status: 'ativo' },
      { id: 'c2', name: 'Casa Norte DEMO', doc: '98.765.432/0001-10', type: 'PJ', email: 'contato@casanorte.demo', phone: '(13) 3222-1111', city: 'Guarujá/SP', segment: 'Varejo', since: '2024-02-20', status: 'ativo' },
      { id: 'c3', name: 'Urban Shop DEMO', doc: '11.222.333/0001-44', type: 'PJ', email: 'contato@urbanshop.demo', phone: '(11) 9999-8888', city: 'São Paulo/SP', segment: 'E-commerce', since: '2024-03-10', status: 'ativo' },
      { id: 'c4', name: 'Mercado Sol DEMO', doc: '44.555.666/0001-77', type: 'PJ', email: 'contato@mercadosol.demo', phone: '(13) 3444-5555', city: 'São Vicente/SP', segment: 'Alimentação', since: '2024-04-05', status: 'ativo' },
      { id: 'c5', name: 'Loja Verde DEMO', doc: '77.888.999/0001-22', type: 'PJ', email: 'contato@lojaverde.demo', phone: '(13) 3555-6666', city: 'Praia Grande/SP', segment: 'Sustentável', since: '2024-05-12', status: 'ativo' },
      { id: 'c6', name: 'ConstruMais DEMO', doc: '22.333.444/0001-55', type: 'PJ', email: 'contato@construmais.demo', phone: '(13) 3666-7777', city: 'Cubatão/SP', segment: 'Construção', since: '2024-06-18', status: 'inativo' }
    ],

    products: [
      { id: 'p1', sku: 'HP-001', name: 'Headphone Pro X1 DEMO', category: 'Eletrônicos', cost: 184.00, price: 349.00, stock: 18, reserved: 3, minStock: 10, unit: 'un', status: 'ativo' },
      { id: 'p2', sku: 'SW-002', name: 'Smartwatch Ultra Fit DEMO', category: 'Eletrônicos', cost: 280.00, price: 499.00, stock: 12, reserved: 1, minStock: 8, unit: 'un', status: 'ativo' },
      { id: 'p3', sku: 'CT-003', name: 'Camiseta Tech DryFit DEMO', category: 'Vestuário', cost: 35.00, price: 89.90, stock: 120, reserved: 5, minStock: 50, unit: 'un', status: 'ativo' },
      { id: 'p4', sku: 'TN-004', name: 'Tênis Runner Air Max DEMO', category: 'Vestuário', cost: 180.00, price: 349.90, stock: 8, reserved: 0, minStock: 12, unit: 'un', status: 'ativo' },
      { id: 'p5', sku: 'MO-005', name: 'Mochila Anti-Furto Pro DEMO', category: 'Acessórios', cost: 95.00, price: 199.90, stock: 67, reserved: 2, minStock: 20, unit: 'un', status: 'ativo' },
      { id: 'p6', sku: 'PB-006', name: 'Powerbank Ultra 20K DEMO', category: 'Eletrônicos', cost: 78.00, price: 149.90, stock: 34, reserved: 0, minStock: 15, unit: 'un', status: 'ativo' },
      { id: 'p7', sku: 'CF-007', name: 'Cafeteira Smart WiFi DEMO', category: 'Eletrodomésticos', cost: 520.00, price: 899.90, stock: 3, reserved: 0, minStock: 5, unit: 'un', status: 'ativo' },
      { id: 'p8', sku: 'OC-008', name: 'Óculos Polarizados DEMO', category: 'Acessórios', cost: 85.00, price: 179.90, stock: 89, reserved: 1, minStock: 30, unit: 'un', status: 'ativo' }
    ],

    inventoryMoves: [
      { id: 'im1', productId: 'p1', type: 'entrada', qty: 30, reason: 'Reposição de estoque', date: '2026-08-15', user: 'Ana Estoque' },
      { id: 'im2', productId: 'p1', type: 'saida', qty: 1, reason: 'Pedido #1042', date: '2026-08-20', user: 'Sistema' },
      { id: 'im3', productId: 'p1', type: 'saida', qty: 2, reason: 'Pedido #1048', date: '2026-08-25', user: 'Sistema' },
      { id: 'im4', productId: 'p1', type: 'entrada', qty: 20, reason: 'Reposição de estoque', date: '2026-08-28', user: 'Ana Estoque' },
      { id: 'im5', productId: 'p7', type: 'saida', qty: 5, reason: 'Pedido #1050', date: '2026-08-30', user: 'Sistema' }
    ],

    orders: [
      { id: '1048', customerId: 'c1', date: '2026-08-28', channel: 'Online', items: [{ productId: 'p1', qty: 2, price: 349.00 }, { productId: 'p5', qty: 1, price: 199.90 }], total: 897.90, payment: 'PIX', status: 'faturado', invoiceId: 'inv184', createdAt: '2026-08-28T14:30' },
      { id: '1047', customerId: 'c2', date: '2026-08-27', channel: 'Marketplace', items: [{ productId: 'p3', qty: 5, price: 89.90 }], total: 449.50, payment: 'Boleto', status: 'pago', createdAt: '2026-08-27T10:15' },
      { id: '1046', customerId: 'c3', date: '2026-08-26', channel: 'Online', items: [{ productId: 'p2', qty: 3, price: 499.00 }, { productId: 'p6', qty: 2, price: 149.90 }], total: 1797.80, payment: 'Cartão', status: 'faturado', invoiceId: 'inv183', createdAt: '2026-08-26T16:45' },
      { id: '1045', customerId: 'c4', date: '2026-08-25', channel: 'Telefone', items: [{ productId: 'p8', qty: 10, price: 179.90 }], total: 1799.00, payment: 'PIX', status: 'entregue', createdAt: '2026-08-25T09:20' },
      { id: '1044', customerId: 'c5', date: '2026-08-24', channel: 'Online', items: [{ productId: 'p4', qty: 2, price: 349.90 }], total: 699.80, payment: 'Link', status: 'pago', createdAt: '2026-08-24T11:30' },
      { id: '1043', customerId: 'c1', date: '2026-08-23', channel: 'Online', items: [{ productId: 'p7', qty: 1, price: 899.90 }], total: 899.90, payment: 'PIX', status: 'cancelado', createdAt: '2026-08-23T15:00' },
      { id: '1042', customerId: 'c2', date: '2026-08-20', channel: 'Marketplace', items: [{ productId: 'p1', qty: 1, price: 349.00 }, { productId: 'p8', qty: 2, price: 179.90 }], total: 708.80, payment: 'Boleto', status: 'faturado', invoiceId: 'inv182', createdAt: '2026-08-20T13:45' },
      { id: '1041', customerId: 'c3', date: '2026-08-18', channel: 'Online', items: [{ productId: 'p3', qty: 10, price: 89.90 }, { productId: 'p5', qty: 3, price: 199.90 }], total: 1498.70, payment: 'Cartão', status: 'pago', createdAt: '2026-08-18T08:15' }
    ],

    invoices: [
      { id: 'inv184', number: '000184', type: 'NF-e', orderId: '1048', customerId: 'c1', date: '2026-08-28', total: 897.90, taxes: 89.79, status: 'autorizada', chave: '3526-0828-1234-5678-9012-3456-7890-1234-5678-9012-3456', protocolo: '3526-0000-0184', danfe: true, createdAt: '2026-08-28T14:35' },
      { id: 'inv183', number: '000183', type: 'NF-e', orderId: '1046', customerId: 'c3', date: '2026-08-26', total: 1797.80, taxes: 179.78, status: 'autorizada', chave: '3526-0826-1234-5678-9012-3456-7890-1234-5678-9012-3456-7891', protocolo: '3526-0000-0183', danfe: true, createdAt: '2026-08-26T16:50' },
      { id: 'inv182', number: '000182', type: 'NF-e', orderId: '1042', customerId: 'c2', date: '2026-08-20', total: 708.80, taxes: 70.88, status: 'autorizada', chave: '3526-0820-1234-5678-9012-3456-7890-1234-5678-9012-3456-7892', protocolo: '3526-0000-0182', danfe: true, createdAt: '2026-08-20T13:50' },
      { id: 'inv181', number: '000181', type: 'NFS-e', orderId: null, customerId: 'c4', date: '2026-08-15', total: 1200.00, taxes: 60.00, status: 'autorizada', chave: '3526-0815-1234-5678-9012-3456-7890-1234-5678-9012-3456-7893', protocolo: '3526-0000-0181', danfe: false, createdAt: '2026-08-15T10:00' },
      { id: 'inv180', number: '000180', type: 'NFC-e', orderId: '1044', customerId: 'c5', date: '2026-08-24', total: 699.80, taxes: 69.98, status: 'cancelada', chave: '3526-0824-1234-5678-9012-3456-7890-1234-5678-9012-3456-7894', protocolo: '3526-0000-0180', danfe: true, createdAt: '2026-08-24T11:35' }
    ],

    receivables: [
      { id: 'r1', customerId: 'c1', doc: 'FAT-1028', invoiceId: 'inv184', orderId: '1048', issueDate: '2026-08-28', dueDate: '2026-09-05', amount: 897.90, method: 'PIX', status: 'a_vencer', paidAmount: 0, paidDate: null },
      { id: 'r2', customerId: 'c2', doc: 'FAT-1021', invoiceId: null, orderId: null, issueDate: '2026-08-15', dueDate: '2026-08-29', amount: 2190.00, method: 'Boleto', status: 'vencido', paidAmount: 0, paidDate: null },
      { id: 'r3', customerId: 'c3', doc: 'FAT-1018', invoiceId: 'inv183', orderId: '1046', issueDate: '2026-08-20', dueDate: '2026-08-27', amount: 8420.00, method: 'Cartão', status: 'recebido', paidAmount: 8420.00, paidDate: '2026-08-27' },
      { id: 'r4', customerId: 'c4', doc: 'FAT-1015', invoiceId: null, orderId: null, issueDate: '2026-08-10', dueDate: '2026-08-24', amount: 3490.00, method: 'PIX', status: 'recebido', paidAmount: 3490.00, paidDate: '2026-08-23' },
      { id: 'r5', customerId: 'c5', doc: 'FAT-1012', invoiceId: null, orderId: null, issueDate: '2026-08-05', dueDate: '2026-08-19', amount: 1290.00, method: 'Link', status: 'vencido', paidAmount: 0, paidDate: null },
      { id: 'r6', customerId: 'c1', doc: 'FAT-1009', invoiceId: 'inv182', orderId: '1042', issueDate: '2026-08-01', dueDate: '2026-08-15', amount: 708.80, method: 'Boleto', status: 'recebido', paidAmount: 708.80, paidDate: '2026-08-14' },
      { id: 'r7', customerId: 'c3', doc: 'FAT-1029', invoiceId: null, orderId: null, issueDate: '2026-08-30', dueDate: '2026-09-13', amount: 4850.00, method: 'PIX', status: 'a_vencer', paidAmount: 0, paidDate: null }
    ],

    payables: [
      { id: 'pa1', supplier: 'Fornecedor TechGear DEMO', category: 'Mercadorias', costCenter: 'Operacional', competence: '2026-08', dueDate: '2026-09-10', amount: 4500.00, status: 'a_pagar', paid: false },
      { id: 'pa2', supplier: 'Aluguel Galpão DEMO', category: 'Infraestrutura', costCenter: 'Administrativo', competence: '2026-08', dueDate: '2026-09-05', amount: 3200.00, status: 'a_pagar', paid: false },
      { id: 'pa3', supplier: 'Ads Google/Meta DEMO', category: 'Marketing', costCenter: 'Comercial', competence: '2026-08', dueDate: '2026-08-28', amount: 2100.00, status: 'pago', paid: true, paidDate: '2026-08-28' },
      { id: 'pa4', supplier: 'Energia Elétrica DEMO', category: 'Utilidades', costCenter: 'Administrativo', competence: '2026-08', dueDate: '2026-09-08', amount: 890.00, status: 'a_pagar', paid: false },
      { id: 'pa5', supplier: 'Folha de Pagamento DEMO', category: 'Pessoal', costCenter: 'Administrativo', competence: '2026-08', dueDate: '2026-09-05', amount: 12500.00, status: 'a_pagar', paid: false },
      { id: 'pa6', supplier: 'Software/SaaS DEMO', category: 'Tecnologia', costCenter: 'TI', competence: '2026-08', dueDate: '2026-08-30', amount: 480.00, status: 'pago', paid: true, paidDate: '2026-08-30' }
    ],

    payments: [
      { id: 'pay1', receivableId: 'r3', customerId: 'c3', amount: 8420.00, method: 'Cartão', date: '2026-08-27', bankRef: 'TXN-99812', reconciled: true },
      { id: 'pay2', receivableId: 'r4', customerId: 'c4', amount: 3490.00, method: 'PIX', date: '2026-08-23', bankRef: 'TXN-99745', reconciled: true },
      { id: 'pay3', receivableId: 'r6', customerId: 'c1', amount: 708.80, method: 'Boleto', date: '2026-08-14', bankRef: 'TXN-99521', reconciled: false }
    ],

    transactions: [
      { id: 't1', type: 'credito', amount: 8420.00, date: '2026-08-27', description: 'Recebimento — Urban Shop DEMO', bankRef: 'TXN-99812', reconciled: true, receivableId: 'r3' },
      { id: 't2', type: 'credito', amount: 3490.00, date: '2026-08-23', description: 'Recebimento PIX — Mercado Sol DEMO', bankRef: 'TXN-99745', reconciled: true, receivableId: 'r4' },
      { id: 't3', type: 'credito', amount: 708.80, date: '2026-08-14', description: 'Recebimento boleto — Tech Commerce DEMO', bankRef: 'TXN-99521', reconciled: false, receivableId: 'r6' },
      { id: 't4', type: 'debito', amount: -2100.00, date: '2026-08-28', description: 'Ads Google/Meta DEMO', bankRef: 'TXN-99850', reconciled: true, payableId: 'pa3' },
      { id: 't5', type: 'debito', amount: -480.00, date: '2026-08-30', description: 'Software/SaaS DEMO', bankRef: 'TXN-99900', reconciled: true, payableId: 'pa6' },
      { id: 't6', type: 'credito', amount: 4850.00, date: '2026-09-01', description: 'Recebimento identificado — sem correspondência', bankRef: 'TXN-00015', reconciled: false, receivableId: null }
    ],

    reconciliations: [
      { id: 'rec1', transactionId: 't1', receivableId: 'r3', matchScore: 98, date: '2026-08-27', status: 'conciliado', user: 'Juliana Financeiro' },
      { id: 'rec2', transactionId: 't2', receivableId: 'r4', matchScore: 95, date: '2026-08-23', status: 'conciliado', user: 'Juliana Financeiro' },
      { id: 'rec3', transactionId: 't4', payableId: 'pa3', matchScore: 92, date: '2026-08-28', status: 'conciliado', user: 'Juliana Financeiro' }
    ],

    notifications: [
      { id: 'n1', type: 'vencido', title: 'FAT-1021 vencida', desc: 'Casa Norte DEMO — R$ 2.190,00 — venceu 29/08', date: '2026-08-29', read: false, severity: 'danger' },
      { id: 'n2', type: 'estoque', title: 'Estoque baixo: Cafeteira Smart WiFi', desc: 'Apenas 3 unidades disponíveis (mínimo: 5)', date: '2026-08-30', read: false, severity: 'warn' },
      { id: 'n3', type: 'recebido', title: 'Pagamento recebido', desc: 'Urban Shop DEMO — R$ 8.420,00 via Cartão', date: '2026-08-27', read: true, severity: 'success' },
      { id: 'n4', type: 'conciliacao', title: 'Conciliação pendente', desc: '1 transação sem correspondência — R$ 4.850,00', date: '2026-09-01', read: false, severity: 'info' },
      { id: 'n5', type: 'pedido', title: 'Novo pedido #1048', desc: 'Tech Commerce DEMO — R$ 897,90', date: '2026-08-28', read: true, severity: 'info' }
    ],

    charges: [
      { id: 'ch1', receivableId: 'r1', customerId: 'c1', method: 'PIX', amount: 897.90, status: 'gerada', qrCode: '00020126580014BR.GOV.BCB.PIX0136demo-pix-tech-commerce-102852040000530398658045303986596', date: '2026-08-28' },
      { id: 'ch2', receivableId: 'r2', customerId: 'c2', method: 'Boleto', amount: 2190.00, status: 'vencida', barcode: '23793-38128-900000-00021900-000000-000000-000000-000000', date: '2026-08-15' },
      { id: 'ch3', receivableId: 'r7', customerId: 'c3', method: 'Link', amount: 4850.00, status: 'gerada', link: 'https://demo.faturamais.expostacker.com.br/pay/link-demo-1029', date: '2026-08-30' }
    ],

    chargeRules: [
      { id: 'cr1', offset: -3, action: 'Lembrete de vencimento', channel: 'E-mail', active: true },
      { id: 'cr2', offset: 0, action: 'Vence hoje', channel: 'E-mail + SMS', active: true },
      { id: 'cr3', offset: 3, action: 'Cobrança', channel: 'E-mail + WhatsApp', active: true },
      { id: 'cr4', offset: 7, action: 'Segundo lembrete', channel: 'E-mail + Telefone', active: true },
      { id: 'cr5', offset: 15, action: 'Escalonamento', channel: 'WhatsApp + Carta', active: false }
    ],

    integrations: [
      { id: 'int1', name: 'Pix Gateway DEMO', category: 'Pagamentos', status: 'simulada', desc: 'Geração de QR Code PIX (simulação demonstrativa)' },
      { id: 'int2', name: 'Boleto Bank DEMO', category: 'Pagamentos', status: 'simulada', desc: 'Geração de boletos (simulação demonstrativa)' },
      { id: 'int3', name: 'Card Processor DEMO', category: 'Pagamentos', status: 'simulada', desc: 'Processamento de cartão (simulação)' },
      { id: 'int4', name: 'Marketplace A DEMO', category: 'Marketplaces', status: 'simulada', desc: 'Sincronização de pedidos (simulação)' },
      { id: 'int5', name: 'Marketplace B DEMO', category: 'Marketplaces', status: 'simulada', desc: 'Sincronização de produtos (simulação)' },
      { id: 'int6', name: 'ERP Cont DEMO', category: 'ERP', status: 'simulada', desc: 'Exportação de dados contábeis (simulação)' },
      { id: 'int7', name: 'Contador Online DEMO', category: 'Contabilidade', status: 'simulada', desc: 'Envio de documentos fiscais (simulação)' },
      { id: 'int8', name: 'Email Service DEMO', category: 'Comunicação', status: 'simulada', desc: 'Envio de e-mails transacionais (simulação)' }
    ],

    config: {
      fiscal: { regime: 'Simples Nacional', cityCode: '1234', nfSeries: '001', environment: 'SIMULAÇÃO' },
      financial: { bankAccount: 'Banco DEMO — Ag 0001 — CC 12345-6', defaultPaymentTerm: 15 },
      notifications: { email: true, sms: false, whatsapp: true, push: true }
    }
  };

  /* ===== HELPERS ===== */
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getAll() {
    const result = {};
    Object.keys(SEED).forEach(function (key) {
      try {
        const stored = localStorage.getItem(STORAGE_PREFIX + key);
        result[key] = stored ? JSON.parse(stored) : clone(SEED[key]);
      } catch (e) {
        result[key] = clone(SEED[key]);
      }
    });
    return result;
  }

  function get(key) {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      return stored ? JSON.parse(stored) : clone(SEED[key]);
    } catch (e) {
      return clone(SEED[key]);
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {}
  }

  function save(key, value) {
    set(key, value);
  }

  function reset() {
    Object.keys(SEED).forEach(function (key) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    });
  }

  function findById(collection, id) {
    const data = get(collection);
    return data.find(function (item) { return item.id === id; });
  }

  function updateItem(collection, id, updates) {
    const data = get(collection);
    const idx = data.findIndex(function (item) { return item.id === id; });
    if (idx >= 0) {
      data[idx] = Object.assign({}, data[idx], updates);
      set(collection, data);
      return data[idx];
    }
    return null;
  }

  function addItem(collection, item) {
    const data = get(collection);
    data.unshift(item);
    set(collection, data);
    return item;
  }

  function removeItem(collection, id) {
    const data = get(collection);
    const filtered = data.filter(function (item) { return item.id !== id; });
    set(collection, filtered);
  }

  /* ===== COMPUTED METRICS ===== */
  function computeMetrics() {
    const orders = get('orders');
    const receivables = get('receivables');
    const payables = get('payables');
    const products = get('products');

    const totalReceita = orders.filter(function (o) { return o.status !== 'cancelado'; }).reduce(function (s, o) { return s + o.total; }, 0);
    const aReceber = receivables.filter(function (r) { return r.status === 'a_vencer' || r.status === 'vencido'; }).reduce(function (s, r) { return s + r.amount; }, 0);
    const vencido = receivables.filter(function (r) { return r.status === 'vencido'; }).reduce(function (s, r) { return s + r.amount; }, 0);
    const recebido = receivables.filter(function (r) { return r.status === 'recebido'; }).reduce(function (s, r) { return s + r.paidAmount; }, 0);
    const aPagar = payables.filter(function (p) { return !p.paid; }).reduce(function (s, p) { return s + p.amount; }, 0);
    const totalPedidos = orders.length;
    const ticketMedio = totalPedidos > 0 ? totalReceita / orders.filter(function (o) { return o.status !== 'cancelado'; }).length : 0;
    const taxaRecebimento = (recebido + aReceber) > 0 ? (recebido / (recebido + aReceber)) * 100 : 0;
    const estoqueBaixo = products.filter(function (p) { return p.stock <= p.minStock; }).length;
    const inadimplencia = aReceber > 0 ? (vencido / aReceber) * 100 : 0;

    return {
      totalReceita: totalReceita,
      aReceber: aReceber,
      vencido: vencido,
      recebido: recebido,
      aPagar: aPagar,
      totalPedidos: totalPedidos,
      ticketMedio: ticketMedio,
      taxaRecebimento: taxaRecebimento,
      estoqueBaixo: estoqueBaixo,
      inadimplencia: inadimplencia,
      saldoCaixa: recebido - payables.filter(function (p) { return p.paid; }).reduce(function (s, p) { return s + p.amount; }, 0)
    };
  }

  window.FaturamaisData = {
    SEED: SEED,
    getAll: getAll,
    get: get,
    set: set,
    save: save,
    reset: reset,
    findById: findById,
    updateItem: updateItem,
    addItem: addItem,
    removeItem: removeItem,
    computeMetrics: computeMetrics,
    clone: clone
  };
})(window);
