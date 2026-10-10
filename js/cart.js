import { currentUser, WHATSAPP_NUMBER, db, firebaseReady } from './firebase-config.js';
import { PRODUCTS } from './products.js';

let cart = [];

function getCartKey() {
    return currentUser ? `cart_${currentUser.uid}` : 'cart_guest';
}

function saveCart() {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    if (firebaseReady && currentUser && db) {
        try { db.ref('carts/' + currentUser.uid).set(cart); } catch(e) {}
    }
    updateCartBadge();
}

function loadCart() {
    const s = localStorage.getItem(getCartKey());
    cart = s ? JSON.parse(s) : [];
    updateCartBadge();
}

function updateCartBadge() {
    const b = document.getElementById('cartBadge');
    if (!b) return;
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    b.style.display = count > 0 ? 'flex' : 'none';
    b.textContent = count;
}

function addToCart(pid, size) {
    // Check login
    if (!currentUser) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login or sign up first to add items to cart.',
                confirmButtonColor: '#0284C7',
                confirmButtonText: '<i class="fas fa-sign-in-alt"></i> Login',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                cancelButtonColor: '#64748B',
                background: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html';
                }
            });
        }
        // Size modal bhi band karo
        if (typeof window.closeSizeModal === 'function') window.closeSizeModal();
        return;
    }

    const p = PRODUCTS.find(x => x.id === pid);
    if (!p) return;
    const key = pid + '_' + size;
    const existing = cart.find(i => i.key === key);
    if (existing) { existing.qty++; }
    else { cart.push({ key, id: p.id, name: p.name, price: p.price, image: p.image, size, qty: 1 }); }
    saveCart();
    if (typeof window.showToast === 'function') window.showToast(`${p.name} (${size}) added to cart`);
}

function removeFromCart(key) {
    cart = cart.filter(i => i.key !== key);
    saveCart(); renderCart();
    if (typeof window.showToast === 'function') window.showToast('Item removed from cart', 'fa-trash-can');
}

function updateQty(key, delta) {
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(key); return; }
    saveCart(); renderCart();
}

function renderCart() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    if (!cart.length) {
        container.innerHTML = `<div class="cart-empty"><i class="fas fa-bag-shopping"></i><h3>Your cart is empty</h3><p>Browse our collection and add items you love.</p><a href="products.html" class="btn-primary">Browse Products</a></div>`;
        return;
    }
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal > 3000 ? 0 : 200;
    container.innerHTML = cart.map(i => `
        <div class="cart-item">
            <div class="cart-item-img"><img src="${i.image}" alt="${i.name}" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&q=80'"></div>
            <div class="cart-item-info">
                <h3>${i.name}</h3>
                <div class="item-meta">Size: ${i.size}</div>
                <div class="price">PKR ${i.price.toLocaleString()}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQty('${i.key}',-1)">−</button>
                    <span class="qty-value">${i.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${i.key}',1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${i.key}')"><i class="fas fa-xmark"></i></button>
        </div>`).join('') + `
        <div class="cart-summary">
            <div class="cart-summary-row"><span>Subtotal</span><span>PKR ${subtotal.toLocaleString()}</span></div>
            <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:#22C55E;font-weight:700">Free</span>' : 'PKR ' + shipping}</span></div>
            ${shipping ? '<p style="font-size:.72rem;color:#64748B;margin-top:-4px;">Free shipping on orders above PKR 3,000</p>' : ''}
            <div class="cart-summary-row total"><span>Total</span><span>PKR ${(subtotal + shipping).toLocaleString()}</span></div>
            <button class="btn-full" style="margin-top:20px;background:#25D366;" onclick="orderCartWhatsApp()"><i class="fab fa-whatsapp"></i>&nbsp; Order via WhatsApp</button>
        </div>`;
}

function orderCartWhatsApp() {
    if (!cart.length) return;
    let msg = "Hello, I want to order from Naz Boot House:\n\n";
    let total = 0;
    cart.forEach((i, idx) => {
        const lineTotal = i.price * i.qty;
        total += lineTotal;
        msg += `${idx + 1}. *${i.name}* (Size: ${i.size})\n   PKR ${i.price.toLocaleString()} x ${i.qty} = PKR ${lineTotal.toLocaleString()}\n\n`;
    });
    const shipping = total > 3000 ? 0 : 200;
    msg += `---\n*Subtotal:* PKR ${total.toLocaleString()}\n*Shipping:* ${shipping === 0 ? 'Free' : 'PKR ' + shipping}\n*Total:* PKR ${(total + shipping).toLocaleString()}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/923152995797?text=${encodeURIComponent(msg)}`, '_blank');
}

export { saveCart, loadCart, updateCartBadge, addToCart, removeFromCart, updateQty, renderCart, orderCartWhatsApp };