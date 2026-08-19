(function () {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const page = document.body.dataset.page || 'home';
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);

  const icons = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="6.7"></circle><path d="m16.2 16.2 4.1 4.1"></path></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3.5 4.5h2l1.7 10.1a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 1.9-1.5L20.3 8H6.2"></path><circle cx="9" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="3.5"></circle><path d="M4.5 20c.8-3.8 3.2-5.7 7.5-5.7s6.7 1.9 7.5 5.7"></path></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h13"></path><path d="m13 6 6 6-6 6"></path></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 12H6"></path><path d="m11 6-6 6 6 6"></path></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3.5 7.5 8.5-4 8.5 4v9L12 21l-8.5-4.5z"></path><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"></path></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19.5 10.5c0 5-7.5 10-7.5 10s-7.5-5-7.5-10a7.5 7.5 0 1 1 15 0Z"></path><circle cx="12" cy="10.5" r="2.3"></circle></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.7 8.4c0 5.5-8.7 10.8-8.7 10.8S3.3 13.9 3.3 8.4A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.7 2.2Z"></path></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5.5h11v10H3zM14 9h3.4L21 12.8v2.7h-7z"></path><circle cx="7" cy="17.5" r="1.8"></circle><circle cx="17" cy="17.5" r="1.8"></circle></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19.6 4.4A10 10 0 0 0 3.9 16.5L3 21l4.6-1.2A10 10 0 1 0 19.6 4.4Z"></path><path d="M8.3 7.1c.3-.6.5-.6.8-.6h.6c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5 0 .7l-.5.7c-.1.2 0 .4.1.5.6 1.1 1.5 2 2.7 2.6.2.1.4.1.5 0l.8-.9c.2-.2.4-.2.6-.1l1.8.8c.3.1.4.3.4.5v.6c0 .3-.2.7-.6.9-.5.2-1.2.3-2 .1-1-.2-2.3-.8-3.8-2.3-1.2-1.2-2-2.5-2.3-3.6-.2-.8-.1-1.5.1-2.1Z" fill="currentColor" stroke="none"></path></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4.5" y="10" width="15" height="10" rx="2"></rect><path d="M8 10V7.5a4 4 0 0 1 8 0V10"></path></svg>'
  };

  function icon(name) { return icons[name] || ''; }
  function productClass(product) { return product.id === 'fio-malha' ? 'mesh' : 'amigurumi'; }
  function firstColor(product) { return product.colors.find(color => Mundix.stockFor(product.id, color.id) > 0) || product.colors[0]; }
  function swatchStyle(color) { return `--swatch-color:${Mundix.asset(color)}`; }
  function colorIsGradient(color) { return String(color.hex).includes('gradient'); }

  function renderHeader() {
    const active = item => page === item ? 'active' : '';
    $('#siteHeader').innerHTML = `
      <div class="announcement"><div class="announcement-track"><span>Enviamos para todo o Brasil</span><span>Retire em Uberlândia</span><span class="pix-promo">Pix com 5% de desconto</span></div></div>
      <header class="site-header is-sticky">
        <div class="container nav-row">
          <a class="brand" href="index.html" aria-label="Mundix Aviamentos — início">
            <img class="brand-logo" src="assets/mundix-logo.png" alt="Logo Mundix Aviamentos">
            <span class="brand-wordmark"><strong>Mundix</strong><small>aviamentos</small></span>
          </a>
          <nav class="nav-links" aria-label="Navegação principal">
            <a class="${active('home')}" href="index.html">Início</a>
            <a class="${active('products')}" href="produtos.html">Produtos</a>
            <a href="index.html#como-comprar">Como comprar</a>
          </nav>
          <div class="nav-actions">
            <a class="nav-icon" href="produtos.html" aria-label="Pesquisar produtos">${icon('search')}</a>
            <div class="account-entry">
              <button class="nav-icon account-trigger" type="button" aria-label="Abrir acesso do cliente" aria-expanded="false" data-account-trigger>${icon('user')}</button>
              <div class="account-menu" data-account-menu hidden>
                <span class="account-kicker">Área do cliente</span>
                <strong>Entre para acompanhar seus pedidos.</strong>
                <form data-customer-login data-account-mode="login"><label for="customerEmail">Seu e-mail</label><input id="customerEmail" type="email" required placeholder="voce@email.com"><label for="customerPassword">Senha</label><input id="customerPassword" type="password" required minlength="6" placeholder="Digite sua senha"><button class="button yellow" type="submit" data-account-submit>Entrar</button><button class="account-create" type="button" data-account-create>Não tem conta? <strong>Criar conta</strong></button></form>
                <a class="manager-link" href="admin.html">Entrar no painel de gerência <span>→</span></a>
              </div>
            </div>
            <button class="nav-icon mobile-menu" type="button" aria-label="Abrir menu" data-mobile-menu>${icon('menu')}</button>
            <button class="nav-icon cart-button" type="button" aria-label="Abrir sacola de compras" data-open-cart>${icon('cart')}<span class="cart-label">Sacola</span><span class="cart-count" data-cart-count>0</span></button>
          </div>
        </div>
      </header>`;
    $('[data-open-cart]')?.addEventListener('click', openCart);
    $('[data-mobile-menu]')?.addEventListener('click', () => $('.site-header')?.classList.toggle('mobile-open'));
    const accountTrigger = $('[data-account-trigger]');
    const accountMenu = $('[data-account-menu]');
    accountTrigger?.addEventListener('click', event => { event.stopPropagation(); const open = accountMenu?.hidden; if (accountMenu) accountMenu.hidden = !open; accountTrigger.setAttribute('aria-expanded', String(Boolean(open))); });
    const customerForm = $('[data-customer-login]');
    $('[data-account-create]')?.addEventListener('click', () => {
      const registering = customerForm?.dataset.accountMode !== 'register';
      if (!customerForm) return;
      customerForm.dataset.accountMode = registering ? 'register' : 'login';
      $('.account-menu > strong')?.replaceChildren(document.createTextNode(registering ? 'Crie sua conta e acompanhe seus pedidos.' : 'Entre para acompanhar seus pedidos.'));
      $('[data-account-submit]')?.replaceChildren(document.createTextNode(registering ? 'Criar conta' : 'Entrar'));
      $('[data-account-create]')?.replaceChildren(document.createTextNode(registering ? 'Já tem conta? ' : 'Não tem conta? '), Object.assign(document.createElement('strong'), { textContent: registering ? 'Entrar' : 'Criar conta' }));
    });
    customerForm?.addEventListener('submit', event => { event.preventDefault(); const email = $('#customerEmail')?.value.trim(); const password = $('#customerPassword')?.value; if (!email || !password) return; const registering = customerForm.dataset.accountMode === 'register'; Mundix.storage.set('mundix-customer-email', email); if (accountMenu) accountMenu.hidden = true; accountTrigger?.setAttribute('aria-expanded', 'false'); toast(registering ? 'Conta criada neste navegador.' : 'Login realizado neste navegador.'); });
    document.addEventListener('click', event => { if (accountMenu && !accountMenu.hidden && !event.target.closest('.account-entry')) { accountMenu.hidden = true; accountTrigger?.setAttribute('aria-expanded', 'false'); } });
    updateCartBadge();
  }

  function renderFooter() {
    $('#siteFooter').innerHTML = `
      <footer class="site-footer" id="atendimento">
        <div class="container footer-main">
          <div class="footer-brand">
            <a class="brand" href="index.html"><img class="brand-logo" src="assets/mundix-logo.png" alt="Logo Mundix"><span class="brand-wordmark"><strong>Mundix</strong><small>aviamentos</small></span></a>
            <p>Tudo para o seu artesanato: cores, texturas e qualidade para transformar cada ideia em uma peça única.</p>
          </div>
          <div><div class="footer-title">Navegue</div><div class="footer-links"><a href="index.html">Início</a><a href="produtos.html">Produtos</a><a href="checkout.html">Finalizar compra</a><a href="admin.html">Área da loja</a></div></div>
          <div><div class="footer-title">Atendimento</div><div class="footer-contact"><strong>(34) 3215-8784</strong><a href="https://wa.me/5534998171327" target="_blank" rel="noreferrer">WhatsApp: (34) 99817-1327</a><span>Seg–sex: 9h–18h<br>Sáb: 9h–13h</span></div></div>
          <div><div class="footer-title">Retire na loja</div><div class="footer-contact"><strong>Uberlândia, MG</strong><span>Rua Antônio Salviano de Rezende, 639<br>(Antiga 19) · 38408-228</span><a href="https://www.instagram.com/mundix_aviamentos" target="_blank" rel="noreferrer">@mundix_aviamentos</a></div></div>
        </div>
        <div class="container footer-bottom"><span>© 2026 Mundix Aviamentos. Feito para inspirar.</span><span>Protótipo de loja · frete e pagamentos sujeitos à integração operacional.</span></div>
      </footer>
      <a class="whatsapp-float" href="https://wa.me/5534998171327" target="_blank" rel="noreferrer" aria-label="Falar com a Mundix pelo WhatsApp">${icon('whatsapp')}</a>`;
  }

  function renderCartSystem() {
    $('#cartSystem').innerHTML = `
      <div class="cart-overlay" data-close-cart></div>
      <aside class="cart-drawer" aria-label="Seu carrinho" aria-hidden="true">
        <div class="cart-head"><h2>Seu carrinho</h2><button class="circle-button" type="button" aria-label="Fechar carrinho" data-close-cart>${icon('close')}</button></div>
        <div class="cart-items" data-cart-items></div>
        <div class="cart-foot" data-cart-foot></div>
      </aside>
      <div class="toast" role="status" aria-live="polite"></div>`;
    $$('[data-close-cart]').forEach(element => element.addEventListener('click', closeCart));
    renderCart();
  }

  function openCart() {
    $('.cart-overlay')?.classList.add('visible');
    $('.cart-drawer')?.classList.add('open');
    $('.cart-drawer')?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    renderCart();
  }
  function closeCart() {
    $('.cart-overlay')?.classList.remove('visible');
    $('.cart-drawer')?.classList.remove('open');
    $('.cart-drawer')?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
  }
  function updateCartBadge() { $$('[data-cart-count]').forEach(element => element.textContent = Mundix.cartCount()); }
  function renderCart() {
    const items = Mundix.cartDetails();
    const target = $('[data-cart-items]');
    const foot = $('[data-cart-foot]');
    if (!target || !foot) return;
    if (!items.length) {
      target.innerHTML = `<div class="cart-empty"><div><div style="font-size:33px; margin-bottom:10px">🧶</div>Seu carrinho está esperando<br>pela sua próxima criação.</div></div>`;
      foot.innerHTML = `<a class="button yellow" href="produtos.html">Escolher produtos ${icon('arrow')}</a>`;
      updateCartBadge();
      return;
    }
    target.innerHTML = items.map(item => `
      <article class="cart-item">
        <div class="cart-item-art" style="--cart-tint:${Mundix.asset(item.color, '#f0e467')}"><img src="${item.product.image}" alt="${item.product.shortName}"></div>
        <div class="cart-item-info"><strong>${item.product.shortName}</strong><span><i class="cart-color-dot" style="--cart-color:${Mundix.asset(item.color)}"></i>${item.color.name}</span>
          <div class="quantity-control"><button type="button" data-cart-change="-1" data-product="${item.product.id}" data-color="${item.color.id}" aria-label="Diminuir quantidade">−</button><input value="${item.quantity}" readonly aria-label="Quantidade"><button type="button" data-cart-change="1" data-product="${item.product.id}" data-color="${item.color.id}" aria-label="Aumentar quantidade">+</button></div>
        </div>
        <div class="cart-item-price"><strong>${Mundix.price(item.product.price * item.quantity)}</strong><button class="remove-item" type="button" data-cart-remove data-product="${item.product.id}" data-color="${item.color.id}">remover</button></div>
      </article>`).join('');
    foot.innerHTML = `<div class="cart-total"><span>Subtotal</span><strong>${Mundix.price(Mundix.cartSubtotal())}</strong></div><a class="button yellow" href="checkout.html">Ir para o checkout ${icon('arrow')}</a>`;
    $$('[data-cart-change]', target).forEach(button => button.addEventListener('click', () => {
      const current = Mundix.getCart().find(item => item.productId === button.dataset.product && item.colorId === button.dataset.color)?.quantity || 1;
      Mundix.updateCartItem(button.dataset.product, button.dataset.color, current + Number(button.dataset.cartChange));
      renderCart();
      updateCheckoutSummary();
    }));
    $$('[data-cart-remove]', target).forEach(button => button.addEventListener('click', () => {
      Mundix.updateCartItem(button.dataset.product, button.dataset.color, 0);
      renderCart();
      updateCheckoutSummary();
    }));
    updateCartBadge();
  }

  function toast(message) {
    const element = $('.toast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(window.__mundixToast);
    window.__mundixToast = setTimeout(() => element.classList.remove('visible'), 2900);
  }

  function productCard(product, large = false) {
    const colors = product.colors.slice(0, large ? 9 : 6);
    const detailUrl = `produtos.html?produto=${product.id}`;
    if (large) return `
      <article class="feature-product ${productClass(product)}" data-feature-product="${product.id}">
        <div class="product-card-art"><img src="${product.image}" alt="${product.name}"></div>
        <div class="product-card-copy">
          <span class="product-category">${product.category}</span><h3>${product.shortName}</h3>
          <p>${product.tagline}</p>
          <div class="tiny-swatches">${colors.map(color => `<i style="--swatch:${Mundix.asset(color)}" title="${color.name}"></i>`).join('')}<span style="font-size:10px;margin-left:3px;color:#777">+${product.colors.length - colors.length}</span></div>
          <div class="product-bottom"><div class="product-price"><small>${product.price == null ? 'valor sob consulta' : 'a partir de'}</small><strong>${product.price == null ? 'Consulte o valor' : Mundix.price(product.price)}</strong></div><a class="button small outline" href="${detailUrl}">Ver detalhes ${icon('arrow')}</a></div>
        </div>
      </article>`;
    return `
      <article class="catalog-card ${productClass(product)}" data-product-card="${product.id}">
        <div class="catalog-image"><span class="card-badge">${product.colors.length} cores</span><img src="${product.image}" alt="${product.name}"></div>
        <div class="catalog-copy"><span class="product-category">${product.category}</span><h2>${product.shortName}</h2><p>${product.tagline}</p>
          <div class="info-pills"><span class="info-pill">${product.meterage}</span><span class="info-pill">${product.composition}</span></div>
          <div class="tiny-swatches">${colors.map(color => `<i style="--swatch:${Mundix.asset(color)}" title="${color.name}"></i>`).join('')}<span style="font-size:10px;margin-left:3px;color:#777">+${product.colors.length - colors.length}</span></div>
          <div class="catalog-footer"><div><strong class="product-price" style="font-size:22px">${product.price == null ? 'Consulte o valor' : Mundix.price(product.price)}</strong><span class="color-count">${product.colors.length} variações</span></div><a class="button outline" href="${detailUrl}">Ver detalhes</a></div>
        </div>
      </article>`;
  }

  function renderHomeProducts() {
    const target = $('#homeProducts');
    if (target) target.innerHTML = Mundix.products.slice(0, 4).map(product => productCard(product, true)).join('');
    const gallery = $('#homeGallery');
    if (gallery) gallery.innerHTML = Mundix.products.slice(2, 6).map(product => `<a class="insta-tile" href="produtos.html?produto=${product.id}"><img src="${product.image}" alt="${product.name}"><span class="sr-only">Ver ${product.name}</span></a>`).join('');
  }

  function renderCatalog() {
    const target = $('#catalogGrid');
    const counter = $('#catalogCounter');
    if (!target) return;
    const search = ($('#catalogSearch')?.value || '').toLocaleLowerCase('pt-BR').trim();
    const selectedTypes = $$('[data-filter-type]:checked').map(input => input.value);
    const selectedUses = $$('[data-filter-use]:checked').map(input => input.value);
    const filtered = Mundix.products.filter(product => {
      const text = `${product.name} ${product.category} ${product.uses.join(' ')} ${product.colors.map(c => c.name).join(' ')}`.toLocaleLowerCase('pt-BR');
      return (!search || text.includes(search)) && (!selectedTypes.length || selectedTypes.includes(product.category)) && (!selectedUses.length || selectedUses.some(use => product.uses.includes(use)));
    });
    target.innerHTML = filtered.length ? filtered.map(product => productCard(product)).join('') : '<div class="empty-state" style="grid-column:1/-1">Nenhum fio encontrado com estes filtros.<br><button class="filter-clear" data-clear-filters>Limpar filtros</button></div>';
    if (counter) counter.textContent = `${filtered.length} ${filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
    $('[data-clear-filters]', target)?.addEventListener('click', clearFilters);
  }
  function clearFilters() { $$('[data-filter-type], [data-filter-use]').forEach(input => input.checked = false); if ($('#catalogSearch')) $('#catalogSearch').value = ''; renderCatalog(); }
  function setupCatalog() {
    $('#catalogSearch')?.addEventListener('input', renderCatalog);
    $$('[data-filter-type], [data-filter-use]').forEach(input => input.addEventListener('change', renderCatalog));
    $('#clearFilters')?.addEventListener('click', clearFilters);
    renderCatalog();
  }

  function colorGrid(product, selectedColor) {
    return product.colors.map(color => {
      const stock = Mundix.stockFor(product.id, color.id);
      return `<button type="button" class="color-swatch ${color.id === selectedColor.id ? 'selected' : ''} ${stock === 0 ? 'out' : ''}" style="${swatchStyle(color)}" data-select-color="${color.id}" title="${color.name}${stock ? ` — ${stock} em estoque` : ' — esgotado'}" aria-label="${color.name}${stock ? `, ${stock} em estoque` : ', esgotado'}" ${stock === 0 ? 'disabled' : ''}></button>`;
    }).join('');
  }

  function stockLabel(stock) {
    if (!stock) return '<span class="stock-label out">Esgotado</span>';
    if (stock <= 7) return `<span class="stock-label low">Últimas ${stock} unidades</span>`;
    return `<span class="stock-label">${stock} unidades disponíveis</span>`;
  }

  function hexToRgb(hex) {
    const value = String(hex || '').replace('#', '');
    return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
  }

  function paintMeshColor(canvas, color, source) {
    if (!canvas) return;
    const photo = new Image();
    photo.onload = () => {
      const context = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = photo.naturalWidth;
      canvas.height = photo.naturalHeight;
      context.drawImage(photo, 0, 0);
      if (color.id === 'azul-bondi') return;
      const target = hexToRgb(color.hex);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = pixels.data;
      for (let index = 0; index < data.length; index += 4) {
        const pixel = index / 4;
        const x = pixel % canvas.width;
        const y = Math.floor(pixel / canvas.width);
        const horizontal = x / canvas.width;
        const vertical = y / canvas.height;
        const isYarnArea = horizontal > .16 && horizontal < .84 && ((vertical > .11 && vertical < .35) || (vertical > .675 && vertical < .91));
        if (!isYarnArea) continue;
        const r = data[index], g = data[index + 1], b = data[index + 2];
        const maximum = Math.max(r, g, b);
        const minimum = Math.min(r, g, b);
        const saturation = maximum - minimum;
        const blueYarn = b > r * 1.14 && b > g * 1.06 && saturation > 25;
        if (!blueYarn) continue;
        const luminance = (r * .2126 + g * .7152 + b * .0722) / 255;
        const texture = Math.min(1, .38 + luminance * .72);
        data[index] = Math.round(target.r * texture);
        data[index + 1] = Math.round(target.g * texture);
        data[index + 2] = Math.round(target.b * texture);
      }
      context.putImageData(pixels, 0, 0);
    };
    photo.src = source;
  }

  function paintAmigurumiColor(canvas, color, source, unicornSource) {
    if (!canvas) return;
    const photo = new Image();
    const isUnicorn = color.id === 'unicornio';
    photo.onload = () => {
      const context = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = photo.naturalWidth;
      canvas.height = photo.naturalHeight;
      context.drawImage(photo, 0, 0);
      if (isUnicorn) return;
      const target = hexToRgb(color.hex);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = pixels.data;
      for (let index = 0; index < data.length; index += 4) {
        const r = data[index], g = data[index + 1], b = data[index + 2];
        const maximum = Math.max(r, g, b);
        const minimum = Math.min(r, g, b);
        const saturation = maximum - minimum;
        const turquoiseYarn = g > r * 1.18 && b > r * 1.18 && saturation > 24;
        if (!turquoiseYarn) continue;
        const luminance = (r * .2126 + g * .7152 + b * .0722) / 255;
        const texture = Math.min(1, .38 + luminance * .72);
        data[index] = Math.round(target.r * texture);
        data[index + 1] = Math.round(target.g * texture);
        data[index + 2] = Math.round(target.b * texture);
      }
      context.putImageData(pixels, 0, 0);
    };
    photo.src = isUnicorn ? unicornSource : source;
  }

  function paintGenericColor(canvas, color, source) {
    if (!canvas) return;
    const photo = new Image();
    photo.onload = () => {
      const context = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = photo.naturalWidth; canvas.height = photo.naturalHeight;
      context.drawImage(photo, 0, 0);
      const target = hexToRgb(color.hex);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height), data = pixels.data;
      for (let index = 0; index < data.length; index += 4) {
        const x = (index / 4) % canvas.width, y = Math.floor((index / 4) / canvas.width);
        const horizontal = x / canvas.width, vertical = y / canvas.height;
        const r = data[index], g = data[index + 1], b = data[index + 2];
        const maximum = Math.max(r, g, b), minimum = Math.min(r, g, b);
        const isBackground = minimum > 238 && maximum - minimum < 18;
        const yarnZone = vertical < .36 || vertical > .68 || horizontal < .17 || horizontal > .83;
        if (isBackground || !yarnZone) continue;
        const luminance = (r * .2126 + g * .7152 + b * .0722) / 255;
        const texture = Math.min(1, .34 + luminance * .72);
        data[index] = Math.round(target.r * texture);
        data[index + 1] = Math.round(target.g * texture);
        data[index + 2] = Math.round(target.b * texture);
      }
      context.putImageData(pixels, 0, 0);
    };
    photo.src = source;
  }

  function renderDetail(productId, selectedColorId, quantity = 1) {
    const product = Mundix.getProduct(productId);
    const target = $('#productsContent');
    if (!product || !target) return;
    const selectedColor = Mundix.getColor(productId, selectedColorId) || firstColor(product);
    const stock = Mundix.stockFor(productId, selectedColor.id);
    target.innerHTML = `
      <main class="detail-page container">
        <a class="back-link" href="produtos.html">${icon('back')} Voltar para todos os produtos</a>
        <section class="product-detail">
          <div class="detail-gallery">
            <div class="detail-image ${product.id}" style="--detail-bg:#fff">
              <canvas class="detail-product-canvas" data-mesh-canvas role="img" aria-label="${product.name} na cor ${selectedColor.name}"></canvas>
              <span class="color-image-label">Cor selecionada: ${selectedColor.name}</span>
            </div>
          </div>
          <div class="detail-info">
            <span class="product-category">${product.category} · ${product.meterage}</span>
            <h1>${product.name}</h1><p class="detail-description">${product.description}</p>
            <div class="detail-price-row"><strong>${product.price == null ? 'Consulte o valor' : Mundix.price(product.price)}</strong>${product.price == null ? '<span>Fale conosco para consultar disponibilidade.</span>' : `<span>${Mundix.price(product.pixPrice)} no Pix</span>`}</div>
            <div class="detail-stats"><div class="detail-stat"><span>Composição</span><strong>${product.composition}</strong></div><div class="detail-stat"><span>Peso médio</span><strong>${product.weight}</strong></div><div class="detail-stat"><span>Agulhas</span><strong>${product.needle}</strong></div></div>
            <div class="selector-label"><span>Cor: <b>${selectedColor.name}</b></span>${stockLabel(stock)}</div>
            <div class="color-grid" aria-label="Escolha uma cor">${colorGrid(product, selectedColor)}</div>
            ${product.price == null ? `<a class="button yellow add-large consult-button" target="_blank" rel="noreferrer" href="https://wa.me/5534998171327?text=${encodeURIComponent(`Olá! Gostaria de consultar ${product.name} na cor ${selectedColor.name}.`)}">Consultar no WhatsApp ${icon('arrow')}</a>` : `<div class="quantity-and-add"><div class="quantity-control"><button type="button" data-detail-quantity="-1" aria-label="Diminuir quantidade">−</button><input value="${quantity}" readonly aria-label="Quantidade"><button type="button" data-detail-quantity="1" aria-label="Aumentar quantidade">+</button></div><button class="button yellow add-large" type="button" data-add-detail ${stock === 0 ? 'disabled' : ''}>${stock === 0 ? 'Cor indisponível' : `Adicionar ao carrinho ${icon('cart')}`}</button></div>`}
            <div class="shipping-note">${icon('truck')}<span><b>Envio para todo o Brasil.</b> Informe seu CEP no checkout para receber uma estimativa de entrega ou escolha retirar na loja em Uberlândia.</span></div>
            <div class="detail-facts">
              <section class="detail-fact"><h2>Destaques do produto</h2><ul>${product.highlights.map(item => `<li>${item}</li>`).join('')}</ul></section>
              <section class="detail-fact"><h2>Ideal para</h2><p>${product.uses.join(' · ')}</p></section>
              <section class="detail-fact"><h2>Sobre as cores</h2><p>As imagens e amostras são referências; pode haver pequenas variações de tonalidade conforme o monitor.</p></section>
            </div>
            <p class="source-note">Especificações técnicas de referência: ${product.sourceUrl ? `<a href="${product.sourceUrl}" target="_blank" rel="noreferrer">${product.sourceName}</a>` : product.sourceName}.</p>
          </div>
        </section>
      </main>`;
    if (product.id === 'fio-malha') paintMeshColor($('[data-mesh-canvas]', target), selectedColor, product.variantBaseImage);
    if (product.id === 'amigurumi') paintAmigurumiColor($('[data-mesh-canvas]', target), selectedColor, product.variantBaseImage, product.image);
    if (!['fio-malha', 'amigurumi'].includes(product.id)) paintGenericColor($('[data-mesh-canvas]', target), selectedColor, product.image);
    $$('[data-select-color]', target).forEach(button => button.addEventListener('click', () => renderDetail(productId, button.dataset.selectColor, quantity)));
    $$('[data-detail-quantity]', target).forEach(button => button.addEventListener('click', () => renderDetail(productId, selectedColor.id, Math.max(1, Math.min(stock || 1, quantity + Number(button.dataset.detailQuantity))))));
    $('[data-add-detail]', target)?.addEventListener('click', () => {
      const result = Mundix.addToCart(productId, selectedColor.id, quantity);
      if (result.ok) { toast(`${product.shortName} · ${selectedColor.name} adicionado ao carrinho.`); openCart(); }
      else toast(result.message);
    });
  }

  function renderProductsPage() {
    const id = new URLSearchParams(location.search).get('produto');
    if (id && Mundix.getProduct(id)) renderDetail(id);
    else setupCatalog();
  }

  function updateCheckoutSummary(shipping = null) {
    const target = $('#checkoutSummary');
    if (!target) return;
    const items = Mundix.cartDetails();
    const subtotal = Mundix.cartSubtotal();
    const shippingValue = typeof shipping === 'number' ? shipping : Number(target.dataset.shipping || 0);
    target.dataset.shipping = shippingValue;
    target.innerHTML = `
      <h2>Resumo do pedido</h2>
      <div class="summary-items">${items.length ? items.map(item => `<div class="summary-item"><div class="summary-item-art" style="--summary-bg:${Mundix.asset(item.color)}"><img src="${item.product.image}" alt=""></div><div><strong>${item.product.shortName}</strong><span>${item.color.name} · qtd. ${item.quantity}</span></div><b>${Mundix.price(item.product.price * item.quantity)}</b></div>`).join('') : '<div class="admin-empty">Seu carrinho está vazio.</div>'}</div>
      <div class="summary-rows"><div class="summary-row"><span>Produtos</span><strong>${Mundix.price(subtotal)}</strong></div><div class="summary-row"><span>Entrega</span><strong>${shippingValue ? Mundix.price(shippingValue) : 'A calcular'}</strong></div></div>
      <div class="summary-total"><span>Total</span><strong>${Mundix.price(subtotal + shippingValue)}</strong></div>
      ${items.length ? '<button class="button yellow" type="submit" form="checkoutForm">Confirmar pedido ' + icon('arrow') + '</button>' : '<a class="button yellow" href="produtos.html">Ver produtos ' + icon('arrow') + '</a>'}
      <p class="checkout-note">Ambiente demonstrativo. Não insira dados de cartão reais.</p>`;
  }

  function formatCep(value) { const digits = value.replace(/\D/g, '').slice(0, 8); return digits.replace(/(\d{5})(\d)/, '$1-$2'); }
  function formatPhone(value) { const digits = value.replace(/\D/g, '').slice(0, 11); return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2'); }

  function setupCheckout() {
    const form = $('#checkoutForm');
    if (!form) return;
    updateCheckoutSummary(0);
    const cepInput = $('#checkoutCep');
    const phoneInput = $('#checkoutPhone');
    cepInput?.addEventListener('input', () => { cepInput.value = formatCep(cepInput.value); });
    phoneInput?.addEventListener('input', () => { phoneInput.value = formatPhone(phoneInput.value); });
    $('#calculateShipping')?.addEventListener('click', () => {
      const quote = Mundix.shippingQuote(cepInput.value, Mundix.cartSubtotal());
      const box = $('#shippingResult');
      if (!quote) { box.classList.add('visible'); box.innerHTML = 'Informe um CEP brasileiro válido, com 8 dígitos.'; updateCheckoutSummary(0); return; }
      box.classList.add('visible');
      box.innerHTML = `<strong>${quote.label}: ${quote.free ? 'grátis' : Mundix.price(quote.value)}</strong><br>${quote.days} · estimativa para a sua região.`;
      $('#deliveryHome').checked = true;
      $('#deliveryHome').dataset.shipping = String(quote.value);
      updateCheckoutSummary(quote.value);
    });
    function syncDeliveryFields() {
      const pickup = form.elements.delivery.value === 'pickup';
      const addressFields = $('[data-delivery-address-fields]', form);
      if (addressFields) addressFields.hidden = pickup;
      ['cep', 'street', 'number', 'neighborhood', 'city', 'state'].forEach(name => {
        const field = form.elements[name];
        if (field) field.required = !pickup;
      });
      const shipping = pickup ? 0 : Number($('#deliveryHome').dataset.shipping || 0);
      updateCheckoutSummary(shipping);
    }
    $$('input[name="delivery"]', form).forEach(input => input.addEventListener('change', syncDeliveryFields));
    $$('input[name="payment"]', form).forEach(input => input.addEventListener('change', () => {
      $$('.payment-detail').forEach(detail => detail.classList.remove('visible'));
      $(`#payment-${input.value}`)?.classList.add('visible');
    }));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const items = Mundix.cartDetails();
      if (!items.length) { toast('Adicione produtos ao carrinho antes de finalizar.'); return; }
      const data = new FormData(form);
      const delivery = data.get('delivery') || 'delivery';
      const required = delivery === 'delivery' ? ['name', 'email', 'phone', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'] : ['name', 'email', 'phone'];
      let valid = true;
      $$('[required]', form).forEach(input => input.classList.remove('invalid'));
      required.forEach(name => {
        const input = form.elements[name];
        if (!input || !String(data.get(name) || '').trim()) { input?.classList.add('invalid'); valid = false; }
      });
      if (!/^\S+@\S+\.\S+$/.test(data.get('email') || '')) { form.elements.email.classList.add('invalid'); valid = false; }
      if (delivery === 'delivery' && String(data.get('cep') || '').replace(/\D/g, '').length !== 8) { form.elements.cep.classList.add('invalid'); valid = false; }
      if (!valid) { toast('Confira os campos obrigatórios do checkout.'); return; }
      const shipping = delivery === 'pickup' ? 0 : Number($('#checkoutSummary').dataset.shipping || 0);
      const order = Mundix.createOrder({
        customer: { name: data.get('name'), email: data.get('email'), phone: data.get('phone'), city: `${data.get('city')}, ${data.get('state')}`, address: `${data.get('street')}, ${data.get('number')} — ${data.get('neighborhood')} · ${data.get('cep')}` },
        shipping, method: data.get('payment'), delivery
      });
      location.href = `checkout.html?pedido=${encodeURIComponent(order.id)}`;
    });
  }

  function renderConfirmation(orderId) {
    const order = Mundix.getOrders().find(item => item.id === orderId);
    if (!order) return;
    $('#checkoutContent').innerHTML = `<main class="container confirmation"><section class="confirmation-card"><div class="confirmation-mark">✓</div><h1>Pedido recebido!</h1><p>Obrigada por escolher a Mundix, ${escapeHtml(order.customer.name.split(' ')[0])}. Seu pedido já entrou na fila da loja.</p><div class="order-receipt"><div><span>Pedido</span><strong>${order.id}</strong></div><div><span>Entrega</span><strong>${order.delivery === 'pickup' ? 'Retirar na loja' : 'Entrega no endereço'}</strong></div><div><span>Pagamento</span><strong>${({ pix: 'Pix', debito: 'Cartão de débito', credito: 'Cartão de crédito' })[order.method]}</strong></div><div><span>Total</span><strong>${Mundix.price(order.total)}</strong></div></div><a class="button yellow" href="https://wa.me/5534998171327?text=${encodeURIComponent(`Olá, fiz o pedido ${order.id} pela loja Mundix.`)}" target="_blank" rel="noreferrer">Enviar confirmação no WhatsApp ${icon('arrow')}</a><br><a class="text-link" href="produtos.html">Continuar comprando</a></section></main>`;
  }

  function run() {
    renderHeader(); renderFooter(); renderCartSystem();
    window.addEventListener('mundix:cart', () => { renderCart(); updateCartBadge(); updateCheckoutSummary(); });
    if (page === 'home') renderHomeProducts();
    if (page === 'products') renderProductsPage();
    if (page === 'checkout') {
      const orderId = new URLSearchParams(location.search).get('pedido');
      if (orderId) renderConfirmation(orderId); else setupCheckout();
    }
  }

  window.MundixUI = { icon, toast, updateCheckoutSummary, renderCart, productCard };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
