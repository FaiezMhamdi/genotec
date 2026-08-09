// script.js - Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update current year
    document.querySelectorAll('#year').forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    // Mobile menu functionality
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburger = document.querySelector('.hamburger');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Header scroll effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href || !/^#[\w-]+$/.test(href)) return;
            const target = document.getElementById(href.slice(1));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-loading')) return;
            
            // Add loading state for forms or async actions
            if (this.type === 'submit' || this.classList.contains('async-action')) {
                this.classList.add('btn-loading');
                setTimeout(() => {
                    this.classList.remove('btn-loading');
                }, 2000);
            }
        });
    });
});
