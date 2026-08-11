/* Dados do catálogo e funções compartilhadas da Mundix Aviamentos.
   Persistência demonstrativa feita em localStorage para o protótipo estático. */
(function () {
  const meshColors = [
    ['azul-bondi', 'Azul Bondi', '#0086b6'],
    ['verde-hortela', 'Verde Hortelã', '#76c8ad'],
    ['lilas', 'Lilás', '#b3a1da'],
    ['rosa-claro', 'Rosa Claro', '#f4b7c5'],
    ['amarelo-bebe', 'Amarelo Bebê', '#f7df62'],
    ['off-white', 'Off White', '#f5efe3'],
    ['rose-antigo', 'Rosê Antigo', '#c57982'],
    ['very-peri', 'Very Peri', '#6464ae'],
    ['salmao', 'Salmão', '#ec927d'],
    ['caramelo', 'Caramelo', '#b66b31'],
    ['telha', 'Telha', '#a94e37'],
    ['terracota', 'Terracota', '#c76b49'],
    ['marrom', 'Marrom', '#5e4034'],
    ['vermelho', 'Vermelho', '#bf2532'],
    ['mostarda', 'Mostarda', '#c89b25'],
    ['mango', 'Mango', '#f2a20c'],
    ['purpura', 'Púrpura', '#7c2b72'],
    ['bege', 'Bege', '#d7bc96'],
    ['aluminio-cinza', 'Alumínio / Cinza', '#a7a9ab'],
    ['preto', 'Preto', '#17181b'],
    ['chumbo', 'Chumbo', '#44474a'],
    ['marinho', 'Marinho', '#183158'],
    ['azul-mar', 'Azul Mar', '#087eae'],
    ['areia', 'Areia', '#e5d1ab'],
    ['verde-tropical', 'Verde Tropical', '#00a277'],
    ['pink', 'Pink', '#e52f87'],
    ['musgo', 'Musgo', '#6a7839']
  ].map(([id, name, hex], index) => ({ id, name, hex, stock: [22, 17, 9, 13, 25, 18, 7, 11, 16, 19, 10, 14, 8, 21, 15, 12, 7, 19, 10, 20, 6, 8, 15, 17, 11, 13, 9][index] }));

  const amigurumiColors = [
    ['unicornio', 'Unicórnio', 'linear-gradient(135deg, #37cae1 0 24%, #f6d143 24% 45%, #f26299 45% 68%, #5ecb8a 68%)'],
    ['creme', 'Creme', '#f1dfbd'],
    ['canario', 'Canário', '#ffd733'],
    ['solar', 'Solar', '#f5aa13'],
    ['hortencia', 'Hortência', '#738ac8'],
    ['turquesa', 'Turquesa', '#1ab6bd'],
    ['azul-bic', 'Azul Bic', '#185cb4'],
    ['anil-profundo', 'Anil Profundo', '#29357c'],
    ['aquario', 'Aquário', '#53cde0'],
    ['docura', 'Doçura', '#f4aac2'],
    ['quartzo', 'Quartzo', '#d4a9ca'],
    ['chiclete', 'Chiclete', '#eb4d9b'],
    ['macadamia', 'Macadâmia', '#d0aa83'],
    ['roseira', 'Roseira', '#d2778d'],
    ['pitaya', 'Pitaya', '#e63a77'],
    ['camafeu', 'Camafeu', '#c68670'],
    ['tulipa', 'Tulipa', '#e84855'],
    ['cereja', 'Cereja', '#b81835'],
    ['rubi', 'Rubi', '#8e1e38'],
    ['organza', 'Organza', '#aa7cc5'],
    ['tafeta', 'Tafetá', '#6f3c80'],
    ['cetim', 'Cetim', '#49245e'],
    ['rum', 'Rum', '#623a33'],
    ['dark-cheddar', 'Dark Cheddar', '#c25c24'],
    ['tijolo', 'Tijolo', '#b34834'],
    ['laranja', 'Laranja', '#ed7a24'],
    ['petroleo', 'Petróleo', '#12676f'],
    ['musgo', 'Musgo', '#596a37'],
    ['tiffany', 'Tiffany', '#45c3b3'],
    ['nascente', 'Nascente', '#8bd8c6'],
    ['eucalipto', 'Eucalipto', '#669b81'],
    ['bandeira', 'Bandeira', '#16884d'],
    ['pistache', 'Pistache', '#a8c948'],
    ['violeta', 'Violeta', '#7347a7'],
    ['alfazema', 'Alfazema', '#a790ca'],
    ['malva', 'Malva', '#b47caa'],
    ['marsala', 'Marsala', '#7c3444'],
    ['tamara', 'Tâmara', '#8c572f'],
    ['chantily', 'Chantily', '#ffe9d9'],
    ['porcelana', 'Porcelana', '#f8f5eb'],
    ['cacau', 'Cacau', '#5b382d'],
    ['brigadeiro', 'Brigadeiro', '#342622'],
    ['amendoa', 'Amêndoa', '#b98463'],
    ['branco', 'Branco', '#ffffff'],
    ['pedreira', 'Pedreira', '#707273'],
    ['glacial', 'Glacial', '#b9d3de'],
    ['off-white', 'Off White', '#f6f0e4'],
    ['aco', 'Aço', '#7e8992'],
    ['lhama', 'Lhama', '#dfc7a6']
  ].map(([id, name, hex], index) => ({ id, name, hex, stock: 5 + ((index * 7 + 9) % 29) }));

  const products = [
    {
      id: 'fio-malha',
      category: 'Fio de Malha',
      name: 'Fio de Malha Extra Premium com Elastano',
      shortName: 'Fio de Malha Extra Premium',
      tagline: 'Stretch, uniforme e pronto para projetos marcantes.',
      price: 29.9,
      pixPrice: 28.41,
      image: 'assets/fio-malha-preto.png',
      variantBaseImage: 'assets/fio-malha-base-azul-bondi.png',
      meterage: '140 m',
      weight: '260 g',
      composition: '94% poliéster + 6% elastano',
      needle: 'Crochê nº 05 a 12',
      uses: ['Crochê', 'Tricô', 'Macramê', 'Tear', 'Tapeçaria'],
      colors: meshColors,
      description: 'Perfeito para quem busca qualidade, maciez e elasticidade, o Fio de Malha Extra Premium entrega um acabamento uniforme e confortável. Produzido com malhas desenvolvidas especialmente para o fio, não possui emendas ou resíduos têxteis.',
      highlights: ['Efeito stretch: elástico e flexível', 'Espessura uniforme de 25 mm', 'Excelente retenção de cor e brilho', 'Macio e agradável ao toque'],
      sourceName: 'Fischer Fios — especificações do produto',
      sourceUrl: 'https://www.fischerfios.com/fios-de-malha/fio-de-malha-extra-premium'
    },
    {
      id: 'amigurumi',
      category: 'Algodão Mercerizado',
      name: 'Fio Amigurumi 100% Algodão Mercerizado',
      shortName: 'Fio Amigurumi',
      tagline: 'Delicadeza, definição e cor para criar personagens únicos.',
      price: 16,
      pixPrice: 15.2,
      image: 'assets/amigurumi-unicornio.png',
      variantBaseImage: 'assets/amigurumi-base-turquesa.png',
      meterage: '254 m',
      weight: '125 g',
      composition: '100% algodão mercerizado',
      needle: 'Crochê 2,0–4,0 mm · Tricô 2,5–4,5 mm',
      uses: ['Amigurumi', 'Crochê', 'Tricô', 'Bonecos', 'Bichinhos'],
      colors: amigurumiColors,
      description: 'Dê vida às suas criações com o Fio Amigurumi, desenvolvido para trabalhos delicados e detalhados. O algodão mercerizado proporciona brilho sutil, resistência e excelente definição dos pontos.',
      highlights: ['Fio NE 6/5 — 492 TEX', 'Ótimo rendimento em 254 metros', 'Toque agradável e acabamento delicado', 'Sugestão de tapeçaria nº 16'],
      sourceName: 'Círculo — especificações do produto',
      sourceUrl: 'https://www.circulo.com.br/produtos/amigurumi/amigurumi'
    }
  ];

  const storage = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  };

  function defaultInventory() {
    return Object.fromEntries(products.map(product => [product.id, Object.fromEntries(product.colors.map(color => [color.id, color.stock]))]));
  }

  function getInventory() {
    const inventory = storage.get('mundix-inventory', null);
    if (!inventory) {
      const initial = defaultInventory();
      storage.set('mundix-inventory', initial);
      return initial;
    }
    return inventory;
  }

  function setInventory(inventory) { storage.set('mundix-inventory', inventory); }
  function getProduct(id) { return products.find(product => product.id === id); }
  function getColor(productId, colorId) { return getProduct(productId)?.colors.find(color => color.id === colorId); }
  function stockFor(productId, colorId) { return getInventory()?.[productId]?.[colorId] ?? 0; }
  function price(value) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); }

  function getCart() { return storage.get('mundix-cart', []); }
  function saveCart(cart) { storage.set('mundix-cart', cart); window.dispatchEvent(new CustomEvent('mundix:cart')); }
  function addToCart(productId, colorId, amount = 1) {
    const stock = stockFor(productId, colorId);
    if (!stock) return { ok: false, message: 'Esta cor está esgotada no momento.' };
    const cart = getCart();
    const item = cart.find(entry => entry.productId === productId && entry.colorId === colorId);
    const current = item?.quantity || 0;
    if (current + amount > stock) return { ok: false, message: `Temos ${stock} unidade(s) desta cor em estoque.` };
    if (item) item.quantity += amount;
    else cart.push({ productId, colorId, quantity: amount });
    saveCart(cart);
    return { ok: true };
  }
  function updateCartItem(productId, colorId, quantity) {
    const cart = getCart();
    const index = cart.findIndex(entry => entry.productId === productId && entry.colorId === colorId);
    if (index < 0) return;
    if (quantity <= 0) cart.splice(index, 1);
    else cart[index].quantity = Math.min(quantity, stockFor(productId, colorId));
    saveCart(cart);
  }
  function clearCart() { saveCart([]); }
  function cartDetails() {
    return getCart().map(item => ({ ...item, product: getProduct(item.productId), color: getColor(item.productId, item.colorId) }))
      .filter(item => item.product && item.color);
  }
  function cartSubtotal() { return cartDetails().reduce((total, item) => total + item.product.price * item.quantity, 0); }
  function cartCount() { return getCart().reduce((total, item) => total + item.quantity, 0); }

  function getOrders() {
    const current = storage.get('mundix-orders', null);
    if (current) return current;
    const demo = [
      { id: 'MND-1048', createdAt: '2026-08-10T14:20:00', customer: { name: 'Ana Souza', city: 'Uberlândia, MG' }, items: [{ productId: 'amigurumi', colorId: 'tiffany', quantity: 3 }], total: 58.97, shipping: 5, method: 'pix', delivery: 'delivery', status: 'pago' },
      { id: 'MND-1047', createdAt: '2026-08-10T10:05:00', customer: { name: 'Lívia Martins', city: 'Uberlândia, MG' }, items: [{ productId: 'fio-malha', colorId: 'verde-hortela', quantity: 2 }], total: 55.8, shipping: 0, method: 'credito', delivery: 'pickup', status: 'separando' },
      { id: 'MND-1046', createdAt: '2026-08-09T16:42:00', customer: { name: 'Mariana Reis', city: 'São Paulo, SP' }, items: [{ productId: 'fio-malha', colorId: 'very-peri', quantity: 1 }], total: 41.8, shipping: 13.9, method: 'credito', delivery: 'delivery', status: 'enviado' }
    ];
    storage.set('mundix-orders', demo);
    return demo;
  }
  function saveOrders(orders) { storage.set('mundix-orders', orders); }
  function createOrder(payload) {
    const cart = cartDetails();
    if (!cart.length) throw new Error('Seu carrinho está vazio.');
    const inventory = getInventory();
    cart.forEach(item => {
      if ((inventory[item.product.id]?.[item.color.id] || 0) < item.quantity) throw new Error(`Estoque insuficiente para ${item.product.shortName} — ${item.color.name}.`);
    });
    cart.forEach(item => { inventory[item.product.id][item.color.id] -= item.quantity; });
    setInventory(inventory);
    const order = {
      id: `MND-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: new Date().toISOString(),
      customer: payload.customer,
      items: cart.map(item => ({ productId: item.product.id, colorId: item.color.id, quantity: item.quantity })),
      subtotal: cartSubtotal(),
      shipping: payload.shipping,
      total: cartSubtotal() + payload.shipping,
      method: payload.method,
      delivery: payload.delivery,
      status: payload.method === 'pix' ? 'aguardando pagamento' : 'novo'
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    clearCart();
    return order;
  }

  function shippingQuote(cep, subtotal = 0) {
    const digits = String(cep || '').replace(/\D/g, '');
    if (digits.length !== 8) return null;
    const prefix = Number(digits[0]);
    const regions = [
      { name: 'Norte', value: 29.9, days: '8–12 dias úteis' },
      { name: 'Norte / Nordeste', value: 25.9, days: '7–10 dias úteis' },
      { name: 'Nordeste', value: 22.9, days: '6–9 dias úteis' },
      { name: 'Sudeste', value: 15.9, days: '3–6 dias úteis' },
      { name: 'Sudeste / Centro-Oeste', value: 17.9, days: '4–7 dias úteis' },
      { name: 'Sul / Centro-Oeste', value: 18.9, days: '4–7 dias úteis' },
      { name: 'Sul', value: 20.9, days: '5–8 dias úteis' },
      { name: 'Sul', value: 21.9, days: '5–8 dias úteis' },
      { name: 'Sudeste', value: 14.9, days: '3–6 dias úteis' },
      { name: 'São Paulo', value: 12.9, days: '2–5 dias úteis' }
    ];
    const region = regions[prefix] || regions[3];
    const free = subtotal >= 180;
    return { ...region, value: free ? 0 : region.value, free, label: free ? 'Frete grátis' : `Entrega ${region.name}` };
  }

  function asset(color, fallback) {
    return color?.hex || fallback || '#f7dc32';
  }

  window.Mundix = {
    products, getProduct, getColor, stockFor, getInventory, setInventory,
    getCart, addToCart, updateCartItem, clearCart, cartDetails, cartSubtotal, cartCount,
    getOrders, saveOrders, createOrder, shippingQuote, price, asset, storage
  };
})();
