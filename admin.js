(function () {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const statusLabel = {
    'novo': ['Novo', 'new'],
    'aguardando pagamento': ['Aguardando Pix', 'warning'],
    'pago': ['Pago', 'paid'],
    'separando': ['Separando', 'warning'],
    'enviado': ['Enviado', 'shipped'],
    'concluído': ['Concluído', 'paid']
  };
  const paymentLabel = { pix: 'Pix', debito: 'Débito', credito: 'Crédito' };

  function productClass(product) { return product.id === 'fio-malha' ? 'mesh' : 'amigurumi'; }
  function colorName(order) { return order.items.map(item => `${Mundix.getProduct(item.productId)?.shortName || 'Item'} · ${Mundix.getColor(item.productId, item.colorId)?.name || ''} ×${item.quantity}`).join(', '); }
  function formatDate(value) { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
  function statusTag(status) { const [label, className] = statusLabel[status] || [status, '']; return `<span class="tag ${className}">${label}</span>`; }

  function metrics() {
    const orders = Mundix.getOrders();
    const total = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const inventory = Mundix.getInventory();
    const low = Object.values(inventory).flatMap(byColor => Object.values(byColor)).filter(stock => stock <= 7).length;
    const pending = orders.filter(order => ['novo', 'aguardando pagamento', 'separando'].includes(order.status)).length;
    return { orders, total, low, pending };
  }

  function renderLogin() {
    const target = $('#adminApp');
    target.innerHTML = `<main class="admin-login"><section class="login-card"><img class="brand-logo" src="assets/mundix-logo.png" alt="Logo Mundix"><h1>Área da loja</h1><p>Acompanhe pedidos, visualize o estoque por cor e mantenha sua operação organizada.</p><form id="adminLogin"><div class="field"><label for="adminPassword">Senha de acesso</label><input id="adminPassword" type="password" required placeholder="Digite a senha"></div><p class="field-help" id="adminLoginError" hidden>Senha incorreta. Tente novamente.</p><button class="button yellow" type="submit">Entrar no painel →</button></form><p class="login-hint">Ambiente demonstrativo · senha: <b>mundix2026</b></p></section></main>`;
    $('#adminLogin').addEventListener('submit', event => {
      event.preventDefault();
      if ($('#adminPassword').value === 'mundix2026') {
        Mundix.storage.set('mundix-admin-session', true);
        renderAdmin();
      } else $('#adminLoginError').hidden = false;
    });
  }

  function dashboardContent(data) {
    const recent = data.orders.slice(0, 4);
    return `<section class="admin-section active" data-admin-section="dashboard">
      <div class="admin-metrics">
        <article class="metric-card"><small>Vendas registradas</small><strong>${Mundix.price(data.total)}</strong><span>em ${data.orders.length} pedido(s)</span></article>
        <article class="metric-card"><small>Pedidos em ação</small><strong>${data.pending}</strong><span>novo, Pix ou separando</span></article>
        <article class="metric-card"><small>Estoque baixo</small><strong>${data.low}</strong><span>cores com até 7 un.</span></article>
        <article class="metric-card"><small>Catálogo ativo</small><strong>2</strong><span>76 cores cadastradas</span></article>
      </div>
      <div class="admin-grid"><article class="admin-panel"><div class="admin-panel-head"><h2>Ritmo de vendas</h2><span class="tag paid">últimos 7 dias</span></div><div class="sales-chart">${[35, 53, 43, 66, 48, 88, 70].map((height, index) => `<div class="chart-col"><i style="height:${height}%"></i><span>${['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][index]}</span></div>`).join('')}</div></article><article class="admin-panel"><div class="admin-panel-head"><h2>Pedidos recentes</h2><button class="text-link" data-go-tab="orders">Ver todos</button></div><div class="quick-list">${recent.map(order => `<div class="quick-row"><div><strong>${order.id}</strong><br><span style="color:var(--muted);font-size:10px">${escapeHtml(order.customer.name)}</span></div><div style="text-align:right">${statusTag(order.status)}<br><strong style="display:block;margin-top:4px">${Mundix.price(order.total)}</strong></div></div>`).join('') || '<div class="admin-empty">Ainda não há pedidos.</div>'}</div></article></div>
    </section>`;
  }

  function ordersContent(data) {
    return `<section class="admin-section" data-admin-section="orders"><article class="admin-panel"><div class="admin-panel-head"><div><h2>Pedidos</h2><span style="color:var(--muted);font-size:10px">Atualize o andamento de cada compra.</span></div><span class="tag">${data.orders.length} no total</span></div><div class="orders-table-wrap"><table class="orders-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Itens</th><th>Entrega</th><th>Pagamento</th><th>Total</th><th>Status</th></tr></thead><tbody>${data.orders.map(order => `<tr><td><strong>${order.id}</strong><br><span style="color:var(--muted);font-size:9px">${formatDate(order.createdAt)}</span></td><td>${escapeHtml(order.customer.name)}<br><span style="color:var(--muted);font-size:9px">${escapeHtml(order.customer.city || '')}</span></td><td>${escapeHtml(colorName(order))}</td><td>${order.delivery === 'pickup' ? 'Retirada' : 'Entrega'}</td><td>${paymentLabel[order.method] || order.method}</td><td><strong>${Mundix.price(order.total)}</strong></td><td><select data-order-status="${order.id}">${Object.keys(statusLabel).map(status => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${statusLabel[status][0]}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div></article></section>`;
  }

  function inventoryContent() {
    const inventory = Mundix.getInventory();
    return `<section class="admin-section" data-admin-section="inventory">${Mundix.products.map(product => `<article class="inventory-product"><div class="inventory-product-head"><div><h2>${product.shortName}</h2><span>${product.colors.length} cores · ${product.meterage} · ${product.price == null ? 'valor sob consulta' : Mundix.price(product.price)}</span></div><span class="tag">${Object.values(inventory[product.id]).reduce((sum, stock) => sum + stock, 0)} unidades</span></div><div class="inventory-grid">${product.colors.map(color => { const stock = inventory[product.id][color.id] ?? 0; return `<div class="inventory-cell"><i style="--inventory-color:${Mundix.asset(color)}"></i><strong title="${color.name}">${color.name}</strong><div class="stock-edit"><button type="button" data-stock-change="-1" data-product="${product.id}" data-color="${color.id}" aria-label="Diminuir estoque de ${color.name}">−</button><span>${stock}</span><button type="button" data-stock-change="1" data-product="${product.id}" data-color="${color.id}" aria-label="Aumentar estoque de ${color.name}">+</button></div></div>`; }).join('')}</div></article>`).join('')}</section>`;
  }

  function settingsContent() {
    return `<section class="admin-section" data-admin-section="settings"><article class="admin-panel" style="max-width:670px"><div class="admin-panel-head"><h2>Configurações da loja</h2><span class="tag warning">protótipo</span></div><p style="color:var(--muted);font-size:12px;line-height:1.65">Este painel salva pedidos e estoque neste navegador para demonstração. Para publicar a loja, conecte uma base de dados, autenticação segura, gateway de pagamento e uma calculadora de frete (Correios ou Melhor Envio).</p><div class="quick-list" style="margin-top:19px"><div class="quick-row"><div><strong>Retirada na loja</strong><br><span style="color:var(--muted);font-size:10px">Uberlândia, MG</span></div><span class="tag paid">ativo</span></div><div class="quick-row"><div><strong>Frete por CEP</strong><br><span style="color:var(--muted);font-size:10px">Estimativa por região, em todo o Brasil</span></div><span class="tag warning">simulado</span></div><div class="quick-row"><div><strong>Pagamentos</strong><br><span style="color:var(--muted);font-size:10px">Pix, débito e crédito</span></div><span class="tag warning">integrar gateway</span></div></div></article></section>`;
  }

  function renderAdmin(activeTab = 'dashboard') {
    const target = $('#adminApp');
    const data = metrics();
    target.innerHTML = `<div class="admin-shell"><aside class="admin-sidebar"><div class="admin-side-brand"><img class="brand-logo" src="assets/mundix-logo.png" alt=""><div><strong>Mundix</strong><small>painel da loja</small></div></div><nav class="admin-nav" aria-label="Navegação do painel"><button class="active" data-admin-tab="dashboard">◫ Visão geral</button><button data-admin-tab="orders">▤ Pedidos</button><button data-admin-tab="inventory">◌ Estoque por cor</button><button data-admin-tab="settings">⚙ Configurações</button></nav><div class="admin-side-foot">Modo demonstrativo<br>Dados guardados neste navegador.</div></aside><main class="admin-main"><div class="admin-top"><div><span class="eyebrow">operação mundix</span><h1>Olá, equipe.</h1></div><div class="admin-top-right"><span class="tag paid">loja aberta</span><span class="admin-avatar">MX</span></div></div>${dashboardContent(data)}${ordersContent(data)}${inventoryContent()}${settingsContent()}</main></div>`;
    const inventorySection = $('[data-admin-section="inventory"]', target);
    if (inventorySection) {
      inventorySection.insertAdjacentHTML('afterbegin', '<div class="inventory-toolbar"><label class="inventory-search">⌕ <input id="inventorySearch" type="search" placeholder="Buscar produto ou cor"></label><button class="inventory-filter active" type="button" data-inventory-filter="all">Todos</button><button class="inventory-filter" type="button" data-inventory-filter="low">Estoque baixo</button><span class="inventory-tip">Use − e + para ajustar cada cor.</span></div>');
      $$('.inventory-product', inventorySection).forEach((product, index) => product.dataset.inventoryProduct = index);
    }
    $$('[data-admin-tab]', target).forEach(button => button.addEventListener('click', () => showTab(button.dataset.adminTab)));
    $$('[data-go-tab]', target).forEach(button => button.addEventListener('click', () => showTab(button.dataset.goTab)));
    $$('[data-order-status]', target).forEach(select => select.addEventListener('change', () => {
      const orders = Mundix.getOrders(); const order = orders.find(item => item.id === select.dataset.orderStatus); if (order) { order.status = select.value; Mundix.saveOrders(orders); MundixUI.toast(`Pedido ${order.id} atualizado para ${statusLabel[order.status][0]}.`); renderAdmin('orders'); }
    }));
    $('#inventorySearch', target)?.addEventListener('input', event => filterInventory(event.target.value));
    $$('[data-inventory-filter]', target).forEach(button => button.addEventListener('click', () => {
      $$('[data-inventory-filter]', target).forEach(item => item.classList.toggle('active', item === button));
      filterInventory($('#inventorySearch', target)?.value || '', button.dataset.inventoryFilter);
    }));
    $$('[data-stock-change]', target).forEach(button => button.addEventListener('click', () => {
      const inventory = Mundix.getInventory(); const current = inventory[button.dataset.product][button.dataset.color] || 0; inventory[button.dataset.product][button.dataset.color] = Math.max(0, current + Number(button.dataset.stockChange)); Mundix.setInventory(inventory); MundixUI.toast('Estoque atualizado.'); renderAdmin('inventory');
    }));
    showTab(activeTab);
  }
  function showTab(tab) {
    $$('[data-admin-section]').forEach(section => section.classList.toggle('active', section.dataset.adminSection === tab));
    $$('[data-admin-tab]').forEach(button => button.classList.toggle('active', button.dataset.adminTab === tab));
  }
  function filterInventory(query = '', mode = document.querySelector('[data-inventory-filter].active')?.dataset.inventoryFilter || 'all') {
    const needle = query.trim().toLocaleLowerCase('pt-BR');
    $$('[data-inventory-product]').forEach(product => {
      let visible = 0;
      $$('.inventory-cell', product).forEach(cell => {
        const stock = Number($('.stock-edit span', cell)?.textContent || 0);
        const matchesSearch = !needle || cell.textContent.toLocaleLowerCase('pt-BR').includes(needle) || $('h2', product).textContent.toLocaleLowerCase('pt-BR').includes(needle);
        cell.hidden = !(matchesSearch && (mode !== 'low' || stock <= 7));
        if (!cell.hidden) visible += 1;
      });
      product.hidden = visible === 0;
    });
  }
  function init() { if (Mundix.storage.get('mundix-admin-session', false)) renderAdmin(); else renderLogin(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
