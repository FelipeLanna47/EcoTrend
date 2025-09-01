/* script.js - lida com renderização e carrinho
   Este arquivo assume que products.js foi carregado antes.
*/

(function () {
  // ----- utilidades -----
  const STORAGE_KEY = 'eco_cart_v1';

  function formatCurrency(value) {
    // retorna "R$ 1.234,56"
    try {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (e) {
      // fallback simples
      return 'R$ ' + value.toFixed(2).replace('.', ',');
    }
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function updateCartBadge() {
    const count = getCart().reduce((acc, it) => acc + (it.qty || 0), 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
  }

  // ----- funções do carrinho -----
  function addToCart(productId, qty = 1) {
    const cart = getCart();
    const id = Number(productId);
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty = (existing.qty || 0) + Number(qty);
    } else {
      cart.push({ id: id, qty: Number(qty) });
    }
    saveCart(cart);
    updateCartBadge();
    // feedback simples
    alert('Produto adicionado ao carrinho!');
    // Se estiver na página do carrinho, re-renderiza
    renderCart();
  }

  function removeFromCart(productId) {
    const id = Number(productId);
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    updateCartBadge();
    renderCart();
  }

  function updateQty(productId, qty) {
    const id = Number(productId);
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, Number(qty) || 1);
      saveCart(cart);
      updateCartBadge();
      renderCart();
    }
  }

  function clearCart() {
    saveCart([]);
    updateCartBadge();
    renderCart();
  }

  // ----- renderizadores de produtos -----
  function createCardHTML(product) {
    return `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p class="muted">${product.category}</p>
        <div class="price">${formatCurrency(product.price)}</div>
        <div style="margin-top:8px;">
          <a class="btn-small" href="produto.html?id=${product.id}">Ver</a>
          <button class="btn-small" data-id="${product.id}" data-action="add">Adicionar</button>
        </div>
      </div>
    `;
  }

  function renderFeatured() {
    const el = document.getElementById('featured-products');
    if (!el || !window.products) return;
    const featured = window.products.filter(p => p.featured);
    el.innerHTML = featured.map(createCardHTML).join('');
    attachAddButtons(el);
  }

  function renderGrid(filter = null, query = '') {
    const grid = document.getElementById('product-grid');
    if (!grid || !window.products) return;
    let list = window.products.slice();
    if (filter) list = list.filter(p => p.category === filter);
    if (query) {
      const q = query.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }
    grid.innerHTML = list.map(createCardHTML).join('');
    attachAddButtons(grid);
  }

  function renderProductPage() {
    const container = document.getElementById('product-details');
    if (!container || !window.products) return;
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id')) || window.products[0].id;
    const product = window.products.find(p => p.id === id);
    if (!product) {
      container.innerHTML = '<p>Produto não encontrado.</p>';
      return;
    }

    container.innerHTML = `
      <div class="product-page">
        <img src="${product.image}" alt="${product.name}" style="max-width:420px;width:100%;border-radius:8px">
        <div class="product-info" style="margin-top:12px">
          <h2>${product.name}</h2>
          <p class="muted">${product.category}</p>
          <p>${product.description || ''}</p>
          <div style="font-weight:700;margin:10px 0">${formatCurrency(product.price)}</div>
          <div style="display:flex; gap:8px; align-items:center">
            <label>Qtd</label>
            <input id="product-qty" type="number" min="1" value="1" style="width:80px;padding:6px;border-radius:6px;border:1px solid #ddd">
            <button id="btn-add-product" class="btn">Adicionar ao carrinho</button>
          </div>
        </div>
      </div>
    `;

    const btn = document.getElementById('btn-add-product');
    btn && btn.addEventListener('click', () => {
      const q = Number(document.getElementById('product-qty').value) || 1;
      addToCart(product.id, q);
    });
  }

  // ----- renderizador do carrinho -----
  function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    const cart = getCart();
    if (!window.products) {
      container.innerHTML = '<p>Sem produtos carregados.</p>';
      return;
    }

    if (cart.length === 0) {
      container.innerHTML = '<p class="muted">Seu carrinho está vazio.</p>';
      document.getElementById('subtotal') && (document.getElementById('subtotal').textContent = 'R$ 0,00');
      document.getElementById('shipping') && (document.getElementById('shipping').textContent = 'R$ 0,00');
      document.getElementById('total') && (document.getElementById('total').textContent = 'R$ 0,00');
      return;
    }

    const byId = Object.fromEntries(window.products.map(p => [p.id, p]));
    container.innerHTML = '';
    cart.forEach(item => {
      const prod = byId[item.id];
      if (!prod) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'cart-item';
      wrapper.innerHTML = `
        <img src="${prod.image}" alt="${prod.name}">
        <div style="flex:1">
          <div style="font-weight:600">${prod.name}</div>
          <div class="muted">${formatCurrency(prod.price)}</div>
          <div style="margin-top:8px; display:flex; gap:8px; align-items:center">
            <label>Qtd</label>
            <input type="number" min="1" value="${item.qty}" style="width:80px;padding:6px;border-radius:6px;border:1px solid #ddd" data-id="${prod.id}" class="cart-qty">
            <button data-id="${prod.id}" class="btn btn-small remove-btn">Remover</button>
          </div>
        </div>
        <div style="font-weight:700">${formatCurrency(prod.price * item.qty)}</div>
      `;
      container.appendChild(wrapper);
    });

    // attach events qty / remove
    container.querySelectorAll('.remove-btn').forEach(b => {
      b.addEventListener('click', () => {
        removeFromCart(Number(b.getAttribute('data-id')));
      });
    });

    container.querySelectorAll('.cart-qty').forEach(input => {
      input.addEventListener('change', () => {
        const id = Number(input.getAttribute('data-id'));
        const val = Number(input.value) || 1;
        updateQty(id, val);
      });
    });

    updateCartTotals();
  }

  function updateCartTotals() {
    const cart = getCart();
    if (!window.products) return;
    const byId = Object.fromEntries(window.products.map(p => [p.id, p]));
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
      const it = cart[i];
      const prod = byId[it.id];
      if (!prod) continue;
      subtotal += prod.price * (it.qty || 0);
    }
    const shipping = subtotal >= 300 ? 0 : (subtotal > 0 ? 29.90 : 0);
    const total = subtotal + shipping;

    const subsEl = document.getElementById('subtotal');
    const shipEl = document.getElementById('shipping');
    const totEl = document.getElementById('total');

    subsEl && (subsEl.textContent = formatCurrency(subtotal));
    shipEl && (shipEl.textContent = formatCurrency(shipping));
    totEl && (totEl.textContent = formatCurrency(total));
  }

  // ----- helpers de UI -----
  function attachAddButtons(root) {
    root.querySelectorAll('[data-action="add"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        addToCart(id, 1);
      });
    });
  }

  // populate category filter on categorias page
  function populateCategoryFilter() {
    const sel = document.getElementById('category-filter');
    if (!sel || !window.products) return;
    const cats = Array.from(new Set(window.products.map(p => p.category)));
    sel.innerHTML = '<option value="">Todas</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
    sel.addEventListener('change', () => {
      const q = document.getElementById('search-input')?.value || '';
      renderGrid(sel.value, q);
    });
  }

  // search input
  function attachSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', () => {
      const sel = document.getElementById('category-filter');
      renderGrid(sel?.value || '', input.value);
    });
  }

  // clear cart button on cart page
  function attachClearCart() {
    const btn = document.getElementById('clear-cart');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (confirm('Deseja limpar o carrinho?')) {
        clearCart();
      }
    });
  }

  // ----- init on DOM ready -----
  document.addEventListener('DOMContentLoaded', () => {
    // update badge
    updateCartBadge();

    // render depending on page
    renderFeatured();
    renderGrid();
    renderProductPage();
    renderCart();

    // categorias page: setup filter + search
    populateCategoryFilter();
    attachSearch();
    attachClearCart();
  });

  // expose for debugging no console
  window.EcoCart = {
    getCart, saveCart, addToCart, removeFromCart, updateQty, clearCart, updateCartTotals, renderCart
  };

})();
