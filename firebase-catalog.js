/* Catálogo remoto da Mundix: uma consulta ao Firestore, com cache local. */
(function () {
  const PROJECT_ID = 'mundix';
  const API_KEY = 'AIzaSyCZxFIpb91Dy_Y3uDeb0SyA3DLJ4jhkk9w';
  const CACHE_KEY = 'mundix-products-cache-v1';
  const CACHE_TIME = 30 * 60 * 1000;
  const paymentRates = { pix: .0049, debito: .0199, credito: .0498 };
  const storage = {
    get: (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
  };

  function decodeValue(value = {}) {
    if ('stringValue' in value) return value.stringValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('booleanValue' in value) return value.booleanValue;
    if ('nullValue' in value) return null;
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
    if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
    return null;
  }
  function decodeFields(fields) {
    return Object.fromEntries(Object.entries(fields || {}).map(([key, value]) => [key, decodeValue(value)]));
  }

  async function fetchProducts() {
    const cached = storage.get(CACHE_KEY, null);
    if (cached?.products?.length && Date.now() - cached.savedAt < CACHE_TIME) return cached.products;
    try {
      const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products?pageSize=100&key=${API_KEY}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Firestore ${response.status}`);
      const payload = await response.json();
      const products = (payload.documents || []).map(document => decodeFields(document.fields)).filter(product => product.active !== false).sort((a, b) => (a.position || 0) - (b.position || 0));
      if (!products.length) throw new Error('Catálogo vazio');
      storage.set(CACHE_KEY, { savedAt: Date.now(), products });
      return products;
    } catch (error) {
      if (cached?.products?.length) return cached.products;
      throw error;
    }
  }

  function createCatalog(products) {
    const paymentAmount = (product, method = 'pix') => {
      const base = typeof product === 'number' ? product : (product.basePrice ?? product.price ?? 0);
      return Math.round(base * (1 + (paymentRates[method] ?? 0)) * 100) / 100;
    };
    const defaultInventory = () => Object.fromEntries(products.map(product => [product.id, Object.fromEntries(product.colors.map(color => [color.id, color.stock]))]));
    function getInventory() {
      const base = defaultInventory(), inventory = storage.get('mundix-inventory', {});
      let dirty = false;
      for (const [productId, colors] of Object.entries(base)) {
        if (!inventory[productId]) { inventory[productId] = colors; dirty = true; }
        else for (const [colorId, stock] of Object.entries(colors)) if (inventory[productId][colorId] == null) { inventory[productId][colorId] = stock; dirty = true; }
      }
      if (dirty || !localStorage.getItem('mundix-inventory')) storage.set('mundix-inventory', inventory);
      return inventory;
    }
    const setInventory = inventory => storage.set('mundix-inventory', inventory);
    const getProduct = id => products.find(product => product.id === id);
    const getColor = (productId, colorId) => getProduct(productId)?.colors.find(color => color.id === colorId);
    const stockFor = (productId, colorId) => getInventory()?.[productId]?.[colorId] ?? 0;
    const price = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    const getCart = () => storage.get('mundix-cart', []);
    const saveCart = cart => { storage.set('mundix-cart', cart); window.dispatchEvent(new CustomEvent('mundix:cart')); };
    function addToCart(productId, colorId, amount = 1) {
      const product = getProduct(productId);
      if (!product || product.price == null) return { ok: false, message: 'Consulte a Mundix para confirmar o valor e a disponibilidade deste produto.' };
      const stock = stockFor(productId, colorId);
      if (!stock) return { ok: false, message: 'Esta cor está esgotada no momento.' };
      const cart = getCart(), item = cart.find(entry => entry.productId === productId && entry.colorId === colorId), current = item?.quantity || 0;
      if (current + amount > stock) return { ok: false, message: `Temos ${stock} unidade(s) desta cor em estoque.` };
      if (item) item.quantity += amount; else cart.push({ productId, colorId, quantity: amount });
      saveCart(cart); return { ok: true };
    }
    function updateCartItem(productId, colorId, quantity) {
      const cart = getCart(), index = cart.findIndex(entry => entry.productId === productId && entry.colorId === colorId);
      if (index < 0) return;
      if (quantity <= 0) cart.splice(index, 1); else cart[index].quantity = Math.min(quantity, stockFor(productId, colorId));
      saveCart(cart);
    }
    const clearCart = () => saveCart([]);
    const cartDetails = () => getCart().map(entry => ({ ...entry, product: getProduct(entry.productId), color: getColor(entry.productId, entry.colorId) })).filter(entry => entry.product && entry.color);
    const cartSubtotal = (method = 'pix') => cartDetails().reduce((total, entry) => total + paymentAmount(entry.product, method) * entry.quantity, 0);
    const cartCount = () => getCart().reduce((total, entry) => total + entry.quantity, 0);
    const getOrders = () => storage.get('mundix-orders', []);
    const saveOrders = orders => storage.set('mundix-orders', orders);
    function createOrder(payload) {
      const cart = cartDetails(); if (!cart.length) throw Error('Seu carrinho está vazio.');
      const inventory = getInventory();
      cart.forEach(entry => { if ((inventory[entry.product.id]?.[entry.color.id] || 0) < entry.quantity) throw Error(`Estoque insuficiente para ${entry.product.shortName} — ${entry.color.name}.`); });
      cart.forEach(entry => inventory[entry.product.id][entry.color.id] -= entry.quantity); setInventory(inventory);
      const subtotal = cartSubtotal(payload.method);
      const order = { id: `MND-${Math.floor(1000 + Math.random() * 8999)}`, createdAt: new Date().toISOString(), customer: payload.customer, items: cart.map(entry => ({ productId: entry.product.id, colorId: entry.color.id, quantity: entry.quantity })), subtotal, shipping: payload.shipping, total: subtotal + payload.shipping, method: payload.method, delivery: payload.delivery, status: payload.method === 'pix' ? 'aguardando pagamento' : 'novo' };
      const orders = getOrders(); orders.unshift(order); saveOrders(orders); clearCart(); return order;
    }
    function shippingQuote(cep, subtotal = 0) {
      const digits = String(cep || '').replace(/\D/g, ''); if (digits.length !== 8) return null;
      const region = [['Norte',29.9,'8–12 dias úteis'],['Norte / Nordeste',25.9,'7–10 dias úteis'],['Nordeste',22.9,'6–9 dias úteis'],['Sudeste',15.9,'3–6 dias úteis'],['Sudeste / Centro-Oeste',17.9,'4–7 dias úteis'],['Sul / Centro-Oeste',18.9,'4–7 dias úteis'],['Sul',20.9,'5–8 dias úteis'],['Sul',21.9,'5–8 dias úteis'],['Sudeste',14.9,'3–6 dias úteis'],['São Paulo',12.9,'2–5 dias úteis']][Number(digits[0])] || ['Sudeste',15.9,'3–6 dias úteis'];
      const free = subtotal >= 180; return { name: region[0], value: free ? 0 : region[1], days: region[2], free, label: free ? 'Frete grátis' : `Entrega ${region[0]}` };
    }
    return { products, getProduct, getColor, stockFor, getInventory, setInventory, getCart, addToCart, updateCartItem, clearCart, cartDetails, cartSubtotal, cartCount, getOrders, saveOrders, createOrder, shippingQuote, price, paymentAmount, paymentRates, asset: (color, fallback) => color?.hex || fallback || '#f7dc32', storage };
  }

  window.MundixReady = fetchProducts().then(products => { window.Mundix = createCatalog(products); return window.Mundix; });
})();
