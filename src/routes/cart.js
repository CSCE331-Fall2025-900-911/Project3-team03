// ----- Cart storage helpers (localStorage) -----
const CART_KEY = 'yf_cart_v1';

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
}
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

// ----- Money helpers -----
export function dollars(num) {
  return Number(num).toFixed(2);
}

// Price adjustments (keep in one place so both pages use same rules)
export const PRICING = {
  toppingEach: 0.5,
  milkAdders: { soy: 1.0, oat: 1.0, original: 0 },
  sizeAdders: { small: 0, medium: 0.5, large: 1.5 }
};

export function computePrice(basePrice, { size, milk, toppings }) {
  const sizeAdd = PRICING.sizeAdders[size] || 0;
  const milkAdd = PRICING.milkAdders[milk] || 0;
  const topsAdd = (toppings?.length || 0) * PRICING.toppingEach;
  return Number(basePrice) + sizeAdd + milkAdd + topsAdd;
}

// Optional: render list items on Payment page
export function renderCartInto(container) {
  const cart = getCart();
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = `<p class="empty">Cart is empty.</p>`;
    return { total: 0 };
  }

  let total = 0;

  cart.forEach((item, idx) => {
    const price = computePrice(item.basePrice, item);

    // <div class="cart-line">
    const line = document.createElement('div');
    line.className = 'cart-line';

    // LEFT
    const left = document.createElement('div');
    left.className = 'cart-line-left';

    const nameEl = document.createElement('div');
    nameEl.className = 'cart-line-name';
    nameEl.textContent = item.name || 'Drink';

    const attrsEl = document.createElement('div');
    attrsEl.className = 'cart-line-attrs';

    // one attribute per line (toppings optional)
    const attrTexts = [
      item.size ? `Size: ${item.size}` : null,
      item.temp ? `Temperature: ${item.temp}` : null,
      item.sugar ? `Sugar: ${item.sugar}%` : null,
      item.ice ? `Ice: ${item.ice}%` : null,
      item.milk ? `Milk: ${item.milk}` : null,
      (item.toppings && item.toppings.length ? `Toppings: ${item.toppings.join(', ')}` : null),
    ].filter(Boolean);

    // create <div> for each attribute line
    if (attrTexts.length === 0) {
      const d = document.createElement('div');
      d.textContent = 'No attributes selected';
      attrsEl.appendChild(d);
    } else {
      attrTexts.forEach(text => {
        const d = document.createElement('div');
        d.textContent = text;
        attrsEl.appendChild(d);
      });
    }

    left.appendChild(nameEl);
    left.appendChild(attrsEl);

    // RIGHT
    const right = document.createElement('div');
    right.className = 'cart-line-right';

    const priceEl = document.createElement('span');
    priceEl.className = 'cart-line-price';
    priceEl.textContent = `$${dollars(price)}`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-line';
    removeBtn.setAttribute('aria-label', 'Remove');
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      const c = getCart();
      c.splice(idx, 1);
      saveCart(c);
      renderCartInto(container);
      const totalNode = document.querySelector('.cart-total-price');
      if (totalNode) {
        const newTotal = c.reduce((s, it) => s + computePrice(it.basePrice, it), 0);
        totalNode.textContent = `$${dollars(newTotal)}`;
      }
    });

    right.appendChild(priceEl);
    right.appendChild(removeBtn);

    line.appendChild(left);
    line.appendChild(right);
    container.appendChild(line);

    total += price;
  });

  return { total };
}