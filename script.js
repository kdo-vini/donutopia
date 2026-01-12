/* ==========================================
   DONUTOPIA - JavaScript
   Interatividade e Animações
   ========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    initMobileMenu();

    // Smooth Scroll
    initSmoothScroll();

    // Scroll Reveal Animations
    initScrollReveal();

    // Header Scroll Effect
    initHeaderScroll();

    // FAQ Accordion
    initFAQ();
});

/* ==========================================
   Mobile Menu
   ========================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
}

/* ==========================================
   Smooth Scroll
   ========================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   Scroll Reveal Animations
   ========================================== */
function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .product-card, .step-card, .location-card, .feature-card'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Reveal on scroll
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }

    // Initial check
    reveal();

    // Check on scroll
    window.addEventListener('scroll', reveal, { passive: true });
}

/* ==========================================
   Header Scroll Effect
   ========================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(93, 64, 55, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(93, 64, 55, 0.1)';
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ==========================================
   FAQ Accordion
   ========================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/* ==========================================
   Lazy Loading Images
   ========================================== */
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for older browsers
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

/* ==========================================
   Analytics Helper (Optional)
   ========================================== */
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track WhatsApp clicks
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function () {
        trackEvent('Contact', 'WhatsApp Click', 'CTA');
    });
});

// Track Instagram clicks
document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
    link.addEventListener('click', function () {
        trackEvent('Social', 'Instagram Click', 'CTA');
    });
});

/* ==========================================
   Menu & Ordering System Logic
   ========================================== */

const menuData = {
    tradicional: {
        title: "Donuts Tradicionais",
        items: [
            { category: "Clássicos", price: 10.00, flavors: ["Chocolate", "Açúcar e Canela", "Chocolate Branco"] },
            { category: "Recheados", price: 12.00, flavors: ["Brigadeiro Meio Amargo", "Doce de Leite", "Beijinho", "Nesquik"] },
            { category: "Gourmet", price: 14.00, flavors: ["Oreo", "Kit Kat", "Nutella", "Limão Siciliano"] }
        ]
    },
    mini: {
        title: "Mini Cake Donuts",
        items: [
            { category: "Clássicos", price: 2.50, flavors: ["Chocolate", "Açúcar e Canela", "Chocolate Branco"] },
            { category: "Recheados", price: 3.50, flavors: ["Brigadeiro Meio Amargo", "Doce de Leite", "Beijinho", "Nesquik"] },
            { category: "Gourmet", price: 4.50, flavors: ["Oreo", "Kit Kat", "Nutella", "Limão Siciliano"] }
        ]
    }
};

let currentType = 'tradicional';
let cart = {}; // key: "Name - Type", value: { qty, price, category }

document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initCart();
});

function initMenu() {
    const container = document.getElementById('menu-container');
    const typeBtns = document.querySelectorAll('.type-btn');

    if (!container) return;

    // Initial Render
    renderMenu(currentType);

    // Type Switching
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            renderMenu(currentType);
        });
    });
}

function renderMenu(type) {
    const container = document.getElementById('menu-container');
    const data = menuData[type];

    let html = '';

    data.items.forEach(category => {
        html += `
            <div class="menu-category">
                <h3 class="menu-category-title">${category.category}</h3>
                <div class="menu-items-row">
                    ${category.flavors.map(flavor => createMenuItem(flavor, category.category, category.price, type)).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateQuantityDisplays();
}

function createMenuItem(name, category, price, type) {
    const id = `${name} - ${type}`; // Unique ID for cart
    // Using string replacement for price formatting
    const formattedPrice = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return `
        <div class="menu-item-card">
            <div class="menu-item-header">
                <span class="menu-item-name">${name}</span>
                <span class="menu-item-price">${formattedPrice}</span>
            </div>
            <div class="menu-item-description">
                ${type === 'mini' ? 'Mini Cake Donut fofinho.' : 'Donut grande tradicional.'}
            </div>
            <div class="menu-item-actions">
                <div class="quantity-control">
                    <button class="qty-btn minus" onclick="updateItemQty('${name}', '${category}', ${price}, -1, '${type}')">-</button>
                    <input type="number" 
                           class="qty-input" 
                           id="qty-${id.replace(/[^a-zA-Z0-9]/g, '')}" 
                           value="0" 
                           min="0"
                           onchange="setItemQty('${name}', '${category}', ${price}, '${type}', this.value)"
                           oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : 0">
                    <button class="qty-btn plus" onclick="updateItemQty('${name}', '${category}', ${price}, 1, '${type}')">+</button>
                </div>
            </div>
        </div>
    `;
}

// Global function to access from onclick
window.updateItemQty = function (name, category, price, change, type) {
    const id = `${name} - ${type}`;

    if (!cart[id]) {
        cart[id] = { name, category, price, type, qty: 0 };
    }

    cart[id].qty += change;

    if (cart[id].qty <= 0) {
        delete cart[id];
    }

    updateQuantityDisplays();
    updateFloatingCart();
};

window.setItemQty = function (name, category, price, type, value) {
    const id = `${name} - ${type}`;
    const qty = parseInt(value) || 0;

    if (qty <= 0) {
        delete cart[id];
    } else {
        cart[id] = { name, category, price, type, qty };
    }

    updateQuantityDisplays();
    updateFloatingCart();
};

function updateQuantityDisplays() {
    // Update currently visible items
    const allInputs = document.querySelectorAll('.qty-input');
    allInputs.forEach(el => el.value = '0');

    Object.keys(cart).forEach(id => {
        const item = cart[id];
        // Only update if visible (matches current type)
        if (item.type === currentType) {
            const cleanId = id.replace(/[^a-zA-Z0-9]/g, '');
            const input = document.getElementById(`qty-${cleanId}`);
            if (input) {
                input.value = item.qty;
            }
        }
    });
}

/* ==========================================
   Cart & Checkout
   ========================================== */
function initCart() {
    const openBtn = document.getElementById('open-cart-btn');
    const modal = document.getElementById('checkout-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const deliveryRadios = document.getElementsByName('delivery-type');
    const sendBtn = document.getElementById('send-order-btn');
    const paymentSelect = document.getElementById('payment-method');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Delivery toggle logic
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', updateModalTotal);
    });

    // Payment method toggle logic
    if (paymentSelect) {
        paymentSelect.addEventListener('change', toggleCashChange);
    }

    // Toggle change input visibility
    const needChangeCheckbox = document.getElementById('need-change');
    if (needChangeCheckbox) {
        needChangeCheckbox.addEventListener('change', function () {
            const wrapper = document.getElementById('change-value-wrapper');
            if (this.checked) {
                wrapper.classList.remove('hidden');
            } else {
                wrapper.classList.add('hidden');
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', generateWhatsAppMessage);
    }

    // Ensure initial state is synced
    toggleCashChange();
}

function toggleCashChange() {
    const payment = document.getElementById('payment-method').value;
    const cashGroup = document.getElementById('cash-change-group');

    if (payment === 'Dinheiro') {
        cashGroup.classList.remove('hidden');
    } else {
        cashGroup.classList.add('hidden');
        // Reset fields
        document.getElementById('need-change').checked = false;
        document.getElementById('change-value-wrapper').classList.add('hidden');
        document.getElementById('change-value').value = '';
    }
}

function updateFloatingCart() {
    const floatCart = document.getElementById('floating-cart');
    const countSpan = floatCart.querySelector('.cart-count');
    const totalSpan = floatCart.querySelector('.cart-total');

    let totalQty = 0;
    let totalPrice = 0;

    Object.values(cart).forEach(item => {
        totalQty += item.qty;
        totalPrice += item.qty * item.price;
    });

    countSpan.textContent = `${totalQty} itens`;
    totalSpan.textContent = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (totalQty > 0) {
        floatCart.classList.remove('hidden');
    } else {
        floatCart.classList.add('hidden');
    }
}

function openModal() {
    const modal = document.getElementById('checkout-modal');
    const preview = document.getElementById('cart-items-preview');
    modal.classList.remove('hidden');

    // Render Items
    let html = '';
    let subtotal = 0;

    Object.values(cart).forEach(item => {
        const itemTotal = item.qty * item.price;
        subtotal += itemTotal;
        html += `
            <div class="cart-item-row">
                <span>${item.qty}x ${item.name} (${item.type === 'mini' ? 'Mini' : 'Gd'})</span>
                <span>${itemTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
        `;
    });

    preview.innerHTML = html;
    document.getElementById('modal-subtotal').textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    updateModalTotal();
}

function closeModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function updateModalTotal() {
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const addressGroup = document.getElementById('address-group');
    const deliveryNote = document.getElementById('delivery-note');

    let subtotal = 0;
    Object.values(cart).forEach(item => subtotal += (item.qty * item.price));

    let deliveryFee = 0;
    if (deliveryType === 'delivery') {
        deliveryFee = 8.00;
        addressGroup.classList.remove('hidden');
        deliveryNote.classList.remove('hidden');
    } else {
        addressGroup.classList.add('hidden');
        deliveryNote.classList.add('hidden');
    }

    const finalTotal = subtotal + deliveryFee;
    document.getElementById('modal-total-final').textContent = finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function generateWhatsAppMessage() {
    const name = document.getElementById('customer-name').value;
    const payment = document.getElementById('payment-method').value;
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const address = document.getElementById('delivery-address').value;

    // Calculate totals first for validation
    let subtotal = 0;
    Object.values(cart).forEach(item => {
        subtotal += item.qty * item.price;
    });
    let deliveryFee = deliveryType === 'delivery' ? 8.00 : 0;
    const finalTotal = subtotal + deliveryFee;

    // Change logic
    const needChange = document.getElementById('need-change').checked;
    const changeValueRaw = document.getElementById('change-value').value;

    if (!name) {
        showToast('Por favor, digite seu nome.');
        return;
    }

    if (deliveryType === 'delivery' && !address) {
        showToast('Por favor, informe o endereço de entrega.');
        return;
    }

    if (payment === 'Dinheiro' && needChange) {
        if (!changeValueRaw) {
            showToast('Por favor, informe para quanto você precisa de troco.');
            return;
        }

        // Simple currency parsing with global regex for separators
        const changeAmount = parseFloat(changeValueRaw.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());

        if (isNaN(changeAmount) || changeAmount <= finalTotal) {
            showToast('O valor para troco deve ser maior que o total do pedido.');
            return;
        }
    }

    let message = `*Novo Pedido - Donutopia*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Pedido:*\n`;

    Object.values(cart).forEach(item => {
        const itemTotal = item.qty * item.price;
        message += `${item.qty}x ${item.name} (${item.type === 'mini' ? 'Mini' : 'Trad.'}) - ${itemTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    });

    if (deliveryType === 'delivery') {
        message += `\n*Entrega:* Delivery (Promissão) - R$ 8,00\n`;
        message += `*Endereço:* ${address}\n`;
    } else {
        message += `\n*Entrega:* Retirada no Local\n`;
    }

    message += `\n*Total Final: ${finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n`;
    message += `*Pagamento:* ${payment}\n`;

    if (payment === 'Dinheiro' && needChange) {
        message += `*Troco para:* ${changeValueRaw}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const phone = '5514997000091';

    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
}

function clearCart() {
    cart = {};
    updateQuantityDisplays();
    updateFloatingCart();
    closeModal();
    showToast('Sacola esvaziada! 🍩');
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🍩</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Remove toast after animation (3s total)
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
