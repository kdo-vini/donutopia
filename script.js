/* ==========================================
   DONUTOPIA - JavaScript
   Interatividade e Animações
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    initMobileMenu();
    
    // Smooth Scroll
    initSmoothScroll();
    
    // Scroll Reveal Animations
    initScrollReveal();
    
    // Header Scroll Effect
    initHeaderScroll();
});

/* ==========================================
   Mobile Menu
   ========================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
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
        link.addEventListener('click', function(e) {
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
    
    window.addEventListener('scroll', function() {
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
    link.addEventListener('click', function() {
        trackEvent('Contact', 'WhatsApp Click', 'CTA');
    });
});

// Track Instagram clicks
document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('Social', 'Instagram Click', 'CTA');
    });
});
