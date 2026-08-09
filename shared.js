// shared.js - Shared utilities used across all pages

// Prevent XSS when interpolating user-controllable strings into HTML
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const Shared = {
    updateYear() {
        document.querySelectorAll('#year').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    },

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');

        if (mobileToggle && mobileMenu && hamburger) {
            mobileToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
                mobileToggle.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
            });

            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                    mobileToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    },

    setupHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 100);
        });
    },

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (!href || !/^#[\w-]+$/.test(href)) return;
                const target = document.getElementById(href.slice(1));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    },

    setupButtonLoadingStates() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function () {
                if (this.classList.contains('btn-loading')) return;
                if (this.type === 'submit' || this.classList.contains('async-action')) {
                    this.classList.add('btn-loading');
                    setTimeout(() => this.classList.remove('btn-loading'), 2000);
                }
            });
        });
    },

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${escapeHTML(icons[type] || 'info-circle')}"></i>
                <span>${escapeHTML(message)}</span>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    },

    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    init() {
        this.updateYear();
        this.setupMobileMenu();
        this.setupHeaderScroll();
        this.setupSmoothScrolling();
        this.setupButtonLoadingStates();
    }
};

document.addEventListener('DOMContentLoaded', () => Shared.init());

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Shared;
}
