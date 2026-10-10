import { auth, WHATSAPP_NUMBER, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from './firebase-config.js';
import { renderFeatured, renderAllProducts, renderFilterBar, setFilter, openSizeModal, closeSizeModal, selectSize, confirmAddToCart, PRODUCTS } from './products.js';
import { loadCart, updateCartBadge, addToCart, removeFromCart, updateQty, renderCart, orderCartWhatsApp } from './cart.js';
import { handleLogin, handleSignup, handleGoogleLogin, handleLogout, handleAuthClick, clearErrors } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { initHeroAnimation, initProductCards, initFeatureCards, initContactCards, initNavbarScroll } from './animations.js';

// Toast
function showToast(message, icon = 'fa-circle-check') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 2800);
}

// Password Toggle
function togglePw(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) icon.className = input.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// Mobile Menu
function closeMobile() {
    const h = document.getElementById('hamburger');
    const m = document.getElementById('mobileMenu');
    const o = document.getElementById('mobileOverlay');
    if (h) h.classList.remove('active');
    if (m) m.classList.remove('open');
    if (o) o.classList.remove('open');
    document.body.style.overflow = '';
}

// Navbar scroll
window.addEventListener('scroll', () => {
    const n = document.getElementById('navbar');
    if (n) n.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// Loader
window.addEventListener('load', () => {
    setTimeout(() => { const l = document.getElementById('loader'); if (l) l.classList.add('hidden'); }, 400);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) closeMobile();
        else { hamburger.classList.add('active'); mobileMenu.classList.add('open'); mobileOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });
}
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobile);
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => { if (link.id !== 'mobileAuthLink') closeMobile(); });
});

// Contact Form
function handleContact(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY)
            .then(() => { form.style.display = 'none'; const s = document.getElementById('formSuccess'); if (s) s.classList.add('show'); btn.innerHTML = orig; btn.disabled = false; })
            .catch(() => { showToast('Failed to send. Try WhatsApp.', 'fa-circle-exclamation'); btn.innerHTML = orig; btn.disabled = false; });
    } else { showToast('Use WhatsApp for quick contact.', 'fa-circle-info'); btn.innerHTML = orig; btn.disabled = false; }
}

// WhatsApp single product
function orderOnWhatsApp(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const msg = `Hello, I want to order from Naz Boot House:\n\n*${p.name}*\nPrice: PKR ${p.price.toLocaleString()}\nAvailable Sizes: ${p.sizes.join(', ')}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Attach to window
window.showToast = showToast;
window.closeMobile = closeMobile;
window.handleContact = handleContact;
window.setFilter = setFilter;
window.openSizeModal = openSizeModal;
window.closeSizeModal = closeSizeModal;
window.selectSize = selectSize;
window.confirmAddToCart = confirmAddToCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQty = updateQty;
window.renderCart = renderCart;
window.orderOnWhatsApp = orderOnWhatsApp;
window.orderCartWhatsApp = orderCartWhatsApp;
window.handleAuthClick = handleAuthClick;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleGoogleLogin = handleGoogleLogin;
window.clearErrors = clearErrors;
window.togglePw = togglePw;

// INIT
onAuthStateChanged(auth, () => {
    loadCart();
    updateCartBadge();
    initNavbarScroll();
    initHeroAnimation();
    initProductCards();
    initFeatureCards();
    initContactCards();
    renderFeatured();

    if (document.getElementById('filterBar')) {
        const params = new URLSearchParams(window.location.search);
        const filter = params.get('filter') || 'all';
        renderFilterBar();
        renderAllProducts(filter);
        setTimeout(() => {
            const activeBtn = document.querySelector(`.filter-btn[onclick*="'${filter}'"]`);
            if (activeBtn) { document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); activeBtn.classList.add('active'); }
        }, 60);
    }

    if (document.getElementById('cartContent')) renderCart();
});