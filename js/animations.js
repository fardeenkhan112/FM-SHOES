function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;
    const label = document.querySelector('.hero-label');
    const title = document.querySelector('.hero-text h1');
    const desc = document.querySelector('.hero-text p');
    const btns = document.querySelector('.hero-btns');
    const shoe = document.querySelector('.hero-float-wrap');
    const stats = document.querySelector('.hero-stats');
    if (!label || !title) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(label, { y: 20, opacity: 0, duration: 0.6 }, 0.4)
      .from(title, { y: 35, opacity: 0, duration: 0.8 }, 0.55);
    if (desc) tl.from(desc, { y: 20, opacity: 0, duration: 0.6 }, 0.8);
    if (btns) tl.from(btns, { y: 20, opacity: 0, duration: 0.6 }, 1.0);
    if (stats) tl.from(stats, { y: 20, opacity: 0, duration: 0.6 }, 1.2);
    if (shoe) tl.from(shoe, { x: 80, opacity: 0, scale: 0.85, duration: 1.0, ease: 'power4.out' }, 0.6);
}

function initProductCards() {
    const grids = document.querySelectorAll('.products-grid');
    if (!grids.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.product-card');
                cards.forEach((card, i) => { setTimeout(() => card.classList.add('visible'), i * 100); });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    grids.forEach(grid => observer.observe(grid));
    window._productObserver = observer;
}

function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    if (!cards.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = Array.from(cards).indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('visible'), idx * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
}

function initContactCards() {
    const cards = document.querySelectorAll('.contact-info-card, .contact-form-card');
    if (!cards.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
}

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar && window.scrollY > 30) navbar.classList.add('scrolled');
}

export { initHeroAnimation, initProductCards, initFeatureCards, initContactCards, initNavbarScroll };