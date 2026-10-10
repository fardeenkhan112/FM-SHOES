const PRODUCTS = [
    { id:1, name:"Sport Runner Pro", price:5200, category:"running", gender:"men", description:"High-performance running shoes with breathable mesh and cushioned sole.", image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80", sizes:["S","M","L","XL"], featured:true },
    { id:2, name:"Classic White Sneaker", price:3500, category:"casual", gender:"men", description:"Clean minimalist design for everyday casual wear.", image:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop&q=80", sizes:["M","L","XL"], featured:true },
    { id:3, name:"Executive Oxford", price:6800, category:"formal", gender:"men", description:"Premium leather oxford shoes for business and formal events.", image:"https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&h=500&fit=crop&q=80", sizes:["S","M","L","XL"], featured:true },
    { id:4, name:"Trail Blazer X", price:5200, category:"sports", gender:"men", description:"Rugged trail shoes with grip and waterproof upper.", image:"https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=500&fit=crop&q=80", sizes:["M","L","XL"], featured:false },
    { id:5, name:"Heritage Boot", price:7800, category:"boots", gender:"men", description:"Classic leather boots built for durability and style.", image:"https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=500&fit=crop&q=80", sizes:["M","L","XL"], featured:false },
    { id:6, name:"Urban Street", price:3800, category:"casual", gender:"men", description:"Street-style sneakers with bold design elements.", image:"https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=500&fit=crop&q=80", sizes:["S","M","L"], featured:false },
    { id:7, name:"Air Flex Lite", price:4500, category:"running", gender:"men", description:"Ultra-lightweight running shoes with responsive cushioning.", image:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop&q=80", sizes:["S","M","L","XL"], featured:true },
    { id:8, name:"Women's Aura Walk", price:4200, category:"casual", gender:"women", description:"Elegant walking shoes designed for women's comfort.", image:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop&q=80", sizes:["S","M","L"], featured:true },
    { id:9, name:"Women's Sprint Pro", price:4800, category:"running", gender:"women", description:"Performance running shoes built for women athletes.", image:"https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=500&h=500&fit=crop&q=80", sizes:["S","M","L","XL"], featured:true },
    { id:10, name:"Women's Classy Heel", price:5500, category:"formal", gender:"women", description:"Stylish formal heels for office and events.", image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop&q=80", sizes:["S","M","L"], featured:false },
    { id:11, name:"Kids' Fun Runner", price:2200, category:"casual", gender:"kids", description:"Colorful and comfortable shoes for active kids.", image:"https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop&q=80", sizes:["S","M","L"], featured:true },
    { id:12, name:"Kids' School Pro", price:2500, category:"casual", gender:"kids", description:"Durable school shoes that handle everyday rough use.", image:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=500&fit=crop&q=80", sizes:["S","M","L","XL"], featured:false },
    { id:13, name:"Kids' Sport Star", price:2800, category:"sports", gender:"kids", description:"Lightweight sports shoes for young athletes.", image:"https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop&q=80", sizes:["S","M","L"], featured:false },
    { id:14, name:"Power Grip", price:4900, category:"sports", gender:"men", description:"Basketball-inspired shoes with superior ankle support.", image:"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&q=80", sizes:["M","L","XL"], featured:true },
    { id:15, name:"Women's Daily Walk", price:3600, category:"casual", gender:"women", description:"Lightweight everyday sneakers for women.", image:"https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop&q=80", sizes:["S","M","L","XL"], featured:false }
];

const ALL_SIZES = ["S","M","L","XL"];

function createProductCard(product) {
    const sizesHTML = ALL_SIZES.map(s => {
        const avail = product.sizes.includes(s);
        return `<span class="size-btn ${avail ? 'avail' : ''}">${s}</span>`;
    }).join('');
    return `<div class="product-card">
        <div class="product-card-img">
            <span class="product-card-category">${product.gender} · ${product.category}</span>
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80'">
        </div>
        <div class="product-card-body">
            <h3>${product.name}</h3>
            <p class="desc">${product.description}</p>
            <div class="size-selector">${sizesHTML}</div>
            <div class="product-card-footer">
                <span class="product-price">PKR ${product.price.toLocaleString()}<small>PKR</small></span>
                <div class="product-actions">
                    <button class="btn-icon btn-cart-add" onclick="openSizeModal(${product.id})" title="Add to Cart"><i class="fas fa-cart-plus"></i></button>
                    <button class="btn-icon btn-whatsapp" onclick="orderOnWhatsApp(${product.id})" title="WhatsApp"><i class="fab fa-whatsapp"></i></button>
                </div>
            </div>
        </div>
    </div>`;
}

let selectedSize = null;
let modalProductId = null;

function openSizeModal(pid) {
    const p = PRODUCTS.find(x => x.id === pid);
    if (!p) return;
    modalProductId = pid;
    selectedSize = null;
    const overlay = document.getElementById('sizeModalOverlay');
    if (!overlay) return;
    overlay.querySelector('.size-modal h3').textContent = p.name;
    overlay.querySelector('.modal-price').textContent = 'PKR ' + p.price.toLocaleString();
    overlay.querySelector('.sizes').innerHTML = ALL_SIZES.map(s => {
        const a = p.sizes.includes(s);
        return `<button class="size-opt ${a ? '' : 'unavailable'}" onclick="${a ? `selectSize('${s}',this)` : ''}" ${a ? '' : 'disabled'}>${s}${a ? '' : ' ✕'}</button>`;
    }).join('');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function selectSize(size, btn) {
    selectedSize = size;
    document.querySelectorAll('.size-modal .size-opt').forEach(b => b.classList.remove('selected'));
    if (btn) btn.classList.add('selected');
}

function closeSizeModal() {
    const o = document.getElementById('sizeModalOverlay');
    if (o) o.classList.remove('open');
    document.body.style.overflow = '';
    selectedSize = null;
    modalProductId = null;
}

function confirmAddToCart() {
    if (!selectedSize) {
        const c = document.getElementById('toastContainer');
        if (c) {
            const t = document.createElement('div');
            t.className = 'toast';
            t.innerHTML = `<i class="fas fa-circle-exclamation" style="color:#F59E0B"></i><span>Please select a size first</span>`;
            t.style.borderLeftColor = '#F59E0B';
            c.appendChild(t);
            setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 300); }, 2500);
        }
        return;
    }
    addToCart(modalProductId, selectedSize);
    closeSizeModal();
}

function renderFeatured() {
    const g = document.getElementById('featuredGrid');
    if (g) g.innerHTML = PRODUCTS.filter(p => p.featured).map(createProductCard).join('');
}

function renderAllProducts(filter = 'all') {
    const g = document.getElementById('allProductsGrid');
    if (!g) return;
    let items = PRODUCTS;
    if (filter === 'men') items = PRODUCTS.filter(p => p.gender === 'men');
    else if (filter === 'women') items = PRODUCTS.filter(p => p.gender === 'women');
    else if (filter === 'kids') items = PRODUCTS.filter(p => p.gender === 'kids');
    else if (filter !== 'all') items = PRODUCTS.filter(p => p.category === filter);
    g.innerHTML = items.length
        ? items.map(createProductCard).join('')
        : '<p style="text-align:center;color:#64748B;grid-column:1/-1;padding:48px;font-size:.92rem;">No products found in this category.</p>';
}

function renderFilterBar() {
    const b = document.getElementById('filterBar');
    if (!b) return;
    const filters = ['all','men','women','kids','running','casual','formal','sports','boots'];
    b.innerHTML = filters.map(c =>
        `<button class="filter-btn ${c === 'all' ? 'active' : ''}" onclick="setFilter('${c}',this)">${c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}</button>`
    ).join('');
}

function setFilter(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderAllProducts(cat);
    setTimeout(() => {
        const g = document.getElementById('allProductsGrid');
        if (g) g.querySelectorAll('.product-card').forEach(card => card.classList.add('visible'));
    }, 50);
}

document.addEventListener('click', e => {
    if (e.target.id === 'sizeModalOverlay') closeSizeModal();
});

export { PRODUCTS, createProductCard, renderFeatured, renderAllProducts, renderFilterBar, setFilter, openSizeModal, closeSizeModal, selectSize, confirmAddToCart };