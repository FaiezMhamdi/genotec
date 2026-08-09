/**
 * @jest-environment jsdom
 */

// Mock scrollIntoView since jsdom doesn't implement it
Element.prototype.scrollIntoView = jest.fn();

describe('shared.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header class="site-header"></header>
      <span id="year"></span>
      <span id="year"></span>
      <button class="mobile-toggle" type="button">
        <div class="hamburger"></div>
      </button>
      <nav class="mobile-menu">
        <a class="mobile-nav-link" href="#section1">Link</a>
      </nav>
      <a href="#section1">Anchor Link</a>
      <div id="section1"></div>
      <button type="submit" class="btn">Submit</button>
      <button type="button" class="async-action">Async</button>
      <button type="button" class="regular">Regular</button>
    `;

    jest.resetModules();
  });

  function loadSharedModule() {
    // Intercept DOMContentLoaded to avoid accumulating listeners across tests
    const callbacks = [];
    const origAddEventListener = document.addEventListener;
    document.addEventListener = function(event, cb, options) {
      if (event === 'DOMContentLoaded') {
        callbacks.push(cb);
      } else {
        origAddEventListener.call(this, event, cb, options);
      }
    };

    require('../shared.js');

    document.addEventListener = origAddEventListener;
    // Call only the captured callback (avoids stale listeners from prior tests)
    if (callbacks.length > 0) {
      callbacks[callbacks.length - 1]();
    }
  }

  describe('Year Update', () => {
    it('should update all #year elements with current year', () => {
      loadSharedModule();

      const yearElements = document.querySelectorAll('#year');
      const currentYear = new Date().getFullYear().toString();

      yearElements.forEach(el => {
        expect(el.textContent).toBe(currentYear);
      });
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle active class on mobile menu when toggle is clicked', () => {
      loadSharedModule();

      const toggle = document.querySelector('.mobile-toggle');
      const mobileMenu = document.querySelector('.mobile-menu');

      toggle.click();
      expect(mobileMenu.classList.contains('active')).toBe(true);

      toggle.click();
      expect(mobileMenu.classList.contains('active')).toBe(false);
    });

    it('should toggle active class on hamburger icon', () => {
      loadSharedModule();

      const toggle = document.querySelector('.mobile-toggle');
      const hamburger = document.querySelector('.hamburger');

      toggle.click();
      expect(hamburger.classList.contains('active')).toBe(true);
    });

    it('should set body overflow to hidden when menu is active', () => {
      loadSharedModule();

      const toggle = document.querySelector('.mobile-toggle');
      toggle.click();

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should reset body overflow when menu is closed', () => {
      loadSharedModule();

      const toggle = document.querySelector('.mobile-toggle');
      toggle.click();
      toggle.click();

      expect(document.body.style.overflow).toBe('');
    });

    it('should close mobile menu when nav link is clicked', () => {
      loadSharedModule();

      const toggle = document.querySelector('.mobile-toggle');
      const mobileMenu = document.querySelector('.mobile-menu');
      const navLink = document.querySelector('.mobile-nav-link');

      toggle.click();
      expect(mobileMenu.classList.contains('active')).toBe(true);

      navLink.click();
      expect(mobileMenu.classList.contains('active')).toBe(false);
    });
  });

  describe('Header Scroll Effect', () => {
    it('should add scrolled class when scrollY > 100', () => {
      loadSharedModule();

      const header = document.querySelector('.site-header');

      Object.defineProperty(window, 'scrollY', { value: 150, writable: true, configurable: true });
      window.dispatchEvent(new Event('scroll'));

      expect(header.classList.contains('scrolled')).toBe(true);
    });

    it('should remove scrolled class when scrollY <= 100', () => {
      loadSharedModule();

      const header = document.querySelector('.site-header');

      Object.defineProperty(window, 'scrollY', { value: 150, writable: true, configurable: true });
      window.dispatchEvent(new Event('scroll'));

      Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true });
      window.dispatchEvent(new Event('scroll'));

      expect(header.classList.contains('scrolled')).toBe(false);
    });
  });

  describe('Smooth Scrolling', () => {
    it('should prevent default on anchor link click', () => {
      loadSharedModule();

      const anchor = document.querySelector('a[href^="#"]');
      const event = new Event('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      anchor.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call scrollIntoView on target element', () => {
      loadSharedModule();

      const target = document.getElementById('section1');
      const anchor = document.querySelector('a[href="#section1"]');
      anchor.click();

      expect(target.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });

  describe('Button Loading States', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should add btn-loading class to submit buttons on click', () => {
      loadSharedModule();

      const submitBtn = document.querySelector('button[type="submit"]');
      submitBtn.click();

      expect(submitBtn.classList.contains('btn-loading')).toBe(true);
    });

    it('should add btn-loading class to async-action buttons', () => {
      loadSharedModule();

      const asyncBtn = document.querySelector('.async-action');
      asyncBtn.click();

      expect(asyncBtn.classList.contains('btn-loading')).toBe(true);
    });

    it('should remove btn-loading class after 2 seconds', () => {
      loadSharedModule();

      const submitBtn = document.querySelector('button[type="submit"]');
      submitBtn.click();

      expect(submitBtn.classList.contains('btn-loading')).toBe(true);

      jest.advanceTimersByTime(2000);
      expect(submitBtn.classList.contains('btn-loading')).toBe(false);
    });

    it('should not add btn-loading to regular buttons without submit type or async-action class', () => {
      loadSharedModule();

      const regularBtn = document.querySelector('.regular');
      regularBtn.click();

      expect(regularBtn.classList.contains('btn-loading')).toBe(false);
    });

    it('should not re-trigger loading if already loading', () => {
      loadSharedModule();

      const submitBtn = document.querySelector('button[type="submit"]');
      submitBtn.click();
      submitBtn.click(); // Second click should be ignored

      jest.advanceTimersByTime(2000);
      expect(submitBtn.classList.contains('btn-loading')).toBe(false);
    });
  });

  describe('Notifications', () => {
    it('should create a notification element in the DOM', () => {
      loadSharedModule();

      const Shared = require('../shared.js');
      Shared.showNotification('Test message', 'success');

      const notification = document.querySelector('.notification');
      expect(notification).not.toBeNull();
      expect(notification.textContent).toContain('Test message');
    });

    it('should remove existing notification before adding new one', () => {
      loadSharedModule();

      const Shared = require('../shared.js');
      Shared.showNotification('First', 'info');
      Shared.showNotification('Second', 'success');

      const notifications = document.querySelectorAll('.notification');
      expect(notifications).toHaveLength(1);
      expect(notifications[0].textContent).toContain('Second');
    });

    it('should apply correct type class', () => {
      loadSharedModule();

      const Shared = require('../shared.js');
      Shared.showNotification('Warning!', 'warning');

      const notification = document.querySelector('.notification');
      expect(notification.classList.contains('notification-warning')).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    it('formatPrice should format a number as USD currency', () => {
      const Shared = require('../shared.js');
      expect(Shared.formatPrice(29.99)).toBe('$29.99');
    });

    it('formatPrice should format zero correctly', () => {
      const Shared = require('../shared.js');
      expect(Shared.formatPrice(0)).toBe('$0.00');
    });

    it('formatPrice should format large numbers with commas', () => {
      const Shared = require('../shared.js');
      expect(Shared.formatPrice(1000)).toBe('$1,000.00');
    });

    describe('debounce', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should delay function execution', () => {
        const Shared = require('../shared.js');
        const fn = jest.fn();
        const debounced = Shared.debounce(fn, 300);

        debounced();
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(300);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should reset timer on subsequent calls', () => {
        const Shared = require('../shared.js');
        const fn = jest.fn();
        const debounced = Shared.debounce(fn, 300);

        debounced();
        jest.advanceTimersByTime(200);
        debounced();
        jest.advanceTimersByTime(200);

        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should pass arguments to the debounced function', () => {
        const Shared = require('../shared.js');
        const fn = jest.fn();
        const debounced = Shared.debounce(fn, 100);

        debounced('arg1', 'arg2');
        jest.advanceTimersByTime(100);

        expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
      });
    });
  });
});
