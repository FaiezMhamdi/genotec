// components.js - Shared HTML components injected dynamically
// Usage: add <div id="site-header" data-active="home|about|shop|contact"></div>
//        add <div id="site-footer"></div>
//        add <div id="floating-bg"></div>

const Components = {
    navItems: [
        { href: 'index.html', icon: 'fa-home', label: 'Home', key: 'home' },
        { href: 'about.html', icon: 'fa-user', label: 'About', key: 'about' },
        { href: 'shop.html', icon: 'fa-shopping-cart', label: 'Shop', key: 'shop', badge: true },
        { href: 'contact.html', icon: 'fa-envelope', label: 'Contact', key: 'contact' }
    ],

    socialLinks: [
        { href: 'https://www.linkedin.com/in/faiez-mhamdi-b2105b191/', icon: 'fa-linkedin', label: 'LinkedIn' },
        { href: 'https://github.com/FaiezMhamdi', icon: 'fa-github', label: 'GitHub' },
        { href: 'https://www.youtube.com/@CyBoRobotica/featured', icon: 'fa-youtube', label: 'YouTube' }
    ],

    renderNavLink(item, activePage, mobile) {
        const cls = mobile ? 'mobile-nav-link' : 'nav-link';
        const active = item.key === activePage ? ' active' : '';
        const badge = item.badge
            ? `<span class="cart-badge"${mobile ? '' : ' id="cartCount"'}>0</span>`
            : '';
        return `<a href="${item.href}" class="${cls}${active}">
            <i class="fas ${item.icon}"></i>
            <span>${item.label}</span>
            ${badge}
        </a>`;
    },

    renderHeader(activePage, ctaOverride, mobileCtaOverride) {
        const desktopNav = this.navItems
            .map(item => this.renderNavLink(item, activePage, false))
            .join('\n          ');

        const mobileNav = this.navItems
            .map(item => this.renderNavLink(item, activePage, true))
            .join('\n        ');

        const ctaBtn = ctaOverride ||
            `<button class="cta-button">
                <span>Start Learning</span>
                <i class="fas fa-rocket"></i>
            </button>`;

        const mobileCta = mobileCtaOverride ||
            `<button class="mobile-cta">
                <i class="fas fa-rocket"></i>
                <span>Start Learning</span>
            </button>`;

        return `<header class="site-header">
    <div class="header-container">
        <div class="brand">
            <div class="logo-container">
                <div class="logo-mark">
                    <span class="logo-main">F/M</span>
                    <span class="logo-subtitle">Robotics</span>
                    <div class="logo-glow"></div>
                </div>
                <div class="logo-pulse"></div>
            </div>
        </div>

        <nav class="nav" aria-label="Main navigation">
            <div class="nav-links">
                ${desktopNav}
            </div>
        </nav>

        <div class="header-actions">
            ${ctaBtn}
        </div>

        <button class="mobile-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
    </div>

    <div class="mobile-menu" role="navigation" aria-label="Mobile navigation">
        <div class="mobile-nav">
            ${mobileNav}
            ${mobileCta}
        </div>
    </div>
</header>`;
    },

    renderFooter(linkGroups) {
        const defaultGroups = [
            {
                title: 'Navigation',
                links: [
                    { href: 'index.html', text: 'Home' },
                    { href: 'about.html', text: 'About' },
                    { href: 'shop.html', text: 'Shop' },
                    { href: 'contact.html', text: 'Contact' }
                ]
            },
            {
                title: 'Courses',
                links: [
                    { href: '#', text: 'Python Programming' },
                    { href: '#', text: 'Robotics Kits' },
                    { href: '#', text: 'AI & Machine Learning' }
                ]
            },
            {
                title: 'Connect',
                links: this.socialLinks.map(s => ({
                    href: s.href,
                    text: `<i class="fab ${s.icon}"></i> ${s.label}`,
                    external: true
                }))
            }
        ];

        const groups = linkGroups || defaultGroups;

        const groupsHtml = groups.map(g => {
            const linksHtml = g.links.map(l => {
                const target = l.external ? ' target="_blank" rel="noopener noreferrer"' : '';
                return `<a href="${l.href}"${target}>${l.text}</a>`;
            }).join('\n            ');
            return `<div class="link-group">
            <h4>${g.title}</h4>
            ${linksHtml}
          </div>`;
        }).join('\n          ');

        const socialsHtml = this.socialLinks.map(s =>
            `<a href="${s.href}" target="_blank" rel="noopener noreferrer"><i class="fab ${s.icon}"></i></a>`
        ).join('\n          ');

        return `<footer class="site-footer" role="contentinfo">
    <div class="footer-content">
        <div class="footer-main">
            <div class="footer-brand">
                <div class="footer-text">
                    <p>Shaping the future of tech education</p>
                </div>
            </div>
            <div class="footer-links">
                ${groupsHtml}
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <span id="year"></span> Faiez Mhamdi &mdash; All rights reserved</p>
            <div class="socials">
                ${socialsHtml}
            </div>
        </div>
    </div>
</footer>`;
    },

    renderFloatingBg() {
        return `<div class="floating-elements">
    <div class="floating-element el-1"></div>
    <div class="floating-element el-2"></div>
    <div class="floating-element el-3"></div>
</div>`;
    },

    ctaPresets: {
        cart: {
            desktop: `<button class="cta-button" id="viewCartBtn">
                <span>View Cart</span>
                <i class="fas fa-shopping-cart"></i>
            </button>`,
            mobile: `<button class="mobile-cta" id="mobileViewCart">
                <i class="fas fa-shopping-cart"></i>
                <span>View Cart</span>
            </button>`
        }
    },

    inject() {
        const headerEl = document.getElementById('site-header');
        if (headerEl) {
            const activePage = headerEl.dataset.active || '';
            const preset = this.ctaPresets[headerEl.dataset.cta];
            const ctaOverride = preset ? preset.desktop : null;
            const mobileCta = preset ? preset.mobile : null;
            headerEl.outerHTML = this.renderHeader(activePage, ctaOverride, mobileCta);
        }

        const footerEl = document.getElementById('site-footer');
        if (footerEl) {
            const customGroups = footerEl.dataset.groups
                ? JSON.parse(footerEl.dataset.groups)
                : null;
            footerEl.outerHTML = this.renderFooter(customGroups);
        }

        const floatingEl = document.getElementById('floating-bg');
        if (floatingEl) {
            floatingEl.outerHTML = this.renderFloatingBg();
        }
    }
};

// Inject immediately for any elements already in the DOM (header, floating-bg)
Components.inject();

// Re-run after full DOM is parsed to catch footer and any late elements
document.addEventListener('DOMContentLoaded', () => Components.inject());
