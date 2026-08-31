// components.js - Shared HTML components injected dynamically
// Usage: add <div id="site-header" data-active="home|about|shop|contact"></div>
//        add <div id="site-footer"></div>
//        add <div id="floating-bg"></div>

const Components = {
    navItems: [
        { href: 'index.html', icon: 'fa-home', label: 'Home', key: 'home' },
        { href: 'about.html', icon: 'fa-user', label: 'About', key: 'about' },
        { href: 'services.html', icon: 'fa-envelope', label: 'Services', key: 'Services' },
        { href: 'shop.html', icon: 'fa-shopping-cart', label: 'Courses', key: 'shop' },
        { href: 'team.html', icon: 'fa-users', label: 'Team', key: 'team' },  // <-- ADDED TEAM HERE
        { href: 'gallery.html', icon: 'fa-images', label: 'Gallery', key: 'gallery' }
    ],

    socialLinks: [
        { href: 'https://www.linkedin.com/in/faiez-mhamdi-b2105b191/', icon: 'fa-linkedin', label: 'LinkedIn' },
        { href: 'https://github.com/FaiezMhamdi', icon: 'fa-github', label: 'GitHub' },
        { href: 'https://www.youtube.com/@CyBoRobotica/featured', icon: 'fa-youtube', label: 'YouTube' }
    ],

    renderNavLink(item, activePage, mobile) {
        if (mobile) {
            const active = item.key === activePage ? ' active' : '';
            return `<a href="${item.href}" class="mobile-nav-link${active}">
                <span class="mnl-icon"><i class="fas ${item.icon}"></i></span>
                <span class="mnl-label">${item.label}</span>
            </a>`;
        }
        const active = item.key === activePage ? ' active' : '';
        return `<a href="${item.href}" class="nav-link${active}">${item.label}</a>`;
    },

    renderHeader(activePage) {
        const desktopNav = this.navItems
            .map(item => this.renderNavLink(item, activePage, false))
            .join('\n          ');

        const mobileNav = this.navItems
            .map(item => this.renderNavLink(item, activePage, true))
            .join('\n        ');

        const ctaBtn = `<a href="contact.html" class="nav-cta">
                <span>Contact</span>
                <i class="fas fa-arrow-right"></i>
            </a>`;

        const mobileCta = `<a href="contact.html" class="mobile-cta">
                <i class="fas fa-rocket"></i>
                <span>Contact</span>
            </a>`;

        return `<header class="site-header" id="siteHeader">
    <div class="header-container">

        <!-- Logo -->
        <a href="index.html" class="nav-logo" aria-label="Mectrion Home">
            <img class="nav-logo-mark" src="mectronicon.png" alt="" aria-hidden="true">
            <span class="nav-logo-geno">Mec</span><span class="nav-logo-tec">trion</span>
        </a>

        <!-- Desktop nav -->
        <nav class="nav" aria-label="Main navigation">
            <div class="nav-links">
                ${desktopNav}
            </div>
        </nav>

        <!-- CTA + hamburger -->
        <div class="header-right">
            ${ctaBtn}
            <button class="mobile-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
        </div>
    </div>

    <!-- Mobile drawer -->
    <div class="mobile-menu" role="navigation" aria-label="Mobile navigation">
        <div class="mobile-nav">
            ${mobileNav}
            <!-- Mobile founders -->
            <div class="mobile-founders">
                <p class="mobile-founders-title">Our Founders</p>
                <div class="mobile-founder">
                    <div class="founder-avatar sm"><i class="fas fa-user-astronaut"></i></div>
                    <div><strong>Faiez Mhamdi</strong><span>Co-Founder &amp; Lead Trainer</span></div>
                </div>
                <div class="mobile-founder">
                    <div class="founder-avatar sm" style="--av:#a855f7"><i class="fas fa-user-tie"></i></div>
                    <div><strong>Hassen Ben Hadj</strong><span>Co-Founder &amp; Partner</span></div>
                </div>
            </div>
            ${mobileCta}
        </div>
    </div>
</header>
<script>
(function(){
  var hdr = document.getElementById('siteHeader');
  var tog = hdr && hdr.querySelector('.mobile-toggle');
  var menu = hdr && hdr.querySelector('.mobile-menu');
  if(tog && menu){
    tog.addEventListener('click', function(){
      var open = menu.classList.toggle('active');
      tog.setAttribute('aria-expanded', open);
      tog.classList.toggle('open', open);
    });
  }
  // Team dropdown removed - no longer needed
  window.addEventListener('scroll', function(){
    if(hdr) hdr.classList.toggle('scrolled', window.scrollY > 40);
  });
})();
</script>`;
    },

    renderFooter(linkGroups) {
        const defaultGroups = [
            {
                title: 'Navigation',
                links: [
                    { href: 'index.html', text: 'Home' },
                    { href: 'about.html', text: 'About' },
                    { href: 'services.html', text: 'Services' },
                    { href: 'gallery.html', text: 'Gallery' },
                    { href: 'shop.html', text: 'Shop' },
                    { href: 'team.html', text: 'Team' },  // <-- ADDED TEAM HERE TOO
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
            <p>&copy; <span id="year"></span> Mectrion &mdash; All rights reserved</p>
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

    inject() {
        const headerEl = document.getElementById('site-header');
        if (headerEl) {
            const activePage = headerEl.dataset.active || '';
            headerEl.outerHTML = this.renderHeader(activePage);
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