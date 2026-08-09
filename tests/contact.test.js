/**
 * @jest-environment jsdom
 */

// Mock scrollIntoView since jsdom doesn't implement it
Element.prototype.scrollIntoView = jest.fn();

describe('contact.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contactForm">
        <input type="text" id="name" value="">
        <span id="nameError"></span>
        <input type="email" id="email" value="">
        <span id="emailError"></span>
        <select id="subject">
          <option value="">Select a subject</option>
          <option value="general">General</option>
        </select>
        <span id="subjectError"></span>
        <textarea id="message"></textarea>
        <span id="messageError"></span>
        <button class="submit-btn" type="submit">
          <span>Send Message</span>
        </button>
      </form>
      <div id="successMessage"></div>
      <div class="faq-item">
        <div class="faq-question">FAQ 1</div>
        <div class="faq-answer">Answer 1</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">FAQ 2</div>
        <div class="faq-answer">Answer 2</div>
      </div>
      <a href="#section1">Link 1</a>
      <div id="section1"></div>
    `;

    jest.resetModules();
  });

  function loadContactModule() {
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

    require('../contact.js');

    document.addEventListener = origAddEventListener;
    if (callbacks.length > 0) {
      callbacks[callbacks.length - 1]();
    }
  }

  describe('Form Validation', () => {
    it('should prevent form submission with empty fields', () => {
      loadContactModule();

      const form = document.getElementById('contactForm');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      const nameError = document.getElementById('nameError');
      expect(nameError.classList.contains('show')).toBe(true);
      expect(nameError.textContent).toBe('This field is required');
    });

    it('should show error for invalid email format', () => {
      loadContactModule();

      const emailField = document.getElementById('email');
      emailField.value = 'invalid-email';
      emailField.dispatchEvent(new Event('blur'));

      const emailError = document.getElementById('emailError');
      expect(emailError.classList.contains('show')).toBe(true);
      expect(emailError.textContent).toBe('Please enter a valid email address');
    });

    it('should show error for empty email', () => {
      loadContactModule();

      const emailField = document.getElementById('email');
      emailField.value = '';
      emailField.dispatchEvent(new Event('blur'));

      const emailError = document.getElementById('emailError');
      expect(emailError.classList.contains('show')).toBe(true);
      expect(emailError.textContent).toBe('Email address is required');
    });

    it('should clear error on valid email', () => {
      loadContactModule();

      const emailField = document.getElementById('email');
      emailField.value = 'test@example.com';
      emailField.dispatchEvent(new Event('blur'));

      const emailError = document.getElementById('emailError');
      expect(emailError.classList.contains('show')).toBe(false);
    });

    it('should validate required text fields on blur', () => {
      loadContactModule();

      const nameField = document.getElementById('name');
      nameField.value = '';
      nameField.dispatchEvent(new Event('blur'));

      const nameError = document.getElementById('nameError');
      expect(nameError.classList.contains('show')).toBe(true);
    });

    it('should clear error when user starts typing', () => {
      loadContactModule();

      const nameField = document.getElementById('name');
      nameField.value = '';
      nameField.dispatchEvent(new Event('blur'));

      nameField.value = 'John';
      nameField.dispatchEvent(new Event('input'));

      const nameError = document.getElementById('nameError');
      expect(nameError.classList.contains('show')).toBe(false);
    });

    it('should add error class to invalid fields', () => {
      loadContactModule();

      const nameField = document.getElementById('name');
      nameField.value = '';
      nameField.dispatchEvent(new Event('blur'));

      expect(nameField.classList.contains('error')).toBe(true);
    });

    it('should remove error class on input', () => {
      loadContactModule();

      const nameField = document.getElementById('name');
      nameField.value = '';
      nameField.dispatchEvent(new Event('blur'));
      nameField.value = 'Text';
      nameField.dispatchEvent(new Event('input'));

      expect(nameField.classList.contains('error')).toBe(false);
    });

    it('should validate select field on blur', () => {
      loadContactModule();

      const subjectField = document.getElementById('subject');
      subjectField.value = '';
      subjectField.dispatchEvent(new Event('blur'));

      const subjectError = document.getElementById('subjectError');
      expect(subjectError.classList.contains('show')).toBe(true);
    });

    it('should accept valid form submission and show loading state', () => {
      jest.useFakeTimers();
      loadContactModule();

      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'general';
      document.getElementById('message').value = 'Hello there!';

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      const submitBtn = document.querySelector('.submit-btn');
      expect(submitBtn.disabled).toBe(true);

      jest.advanceTimersByTime(2000);
      const successMessage = document.getElementById('successMessage');
      expect(successMessage.classList.contains('show')).toBe(true);

      jest.useRealTimers();
    });

    it('should reset form after successful submission', () => {
      jest.useFakeTimers();
      loadContactModule();

      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'general';
      document.getElementById('message').value = 'Hello!';

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      jest.advanceTimersByTime(2000);
      expect(document.getElementById('name').value).toBe('');

      jest.useRealTimers();
    });

    it('should hide success message after 5 seconds', () => {
      jest.useFakeTimers();
      loadContactModule();

      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'general';
      document.getElementById('message').value = 'Hello!';

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      jest.advanceTimersByTime(2000);
      const successMessage = document.getElementById('successMessage');
      expect(successMessage.classList.contains('show')).toBe(true);

      jest.advanceTimersByTime(5000);
      expect(successMessage.classList.contains('show')).toBe(false);

      jest.useRealTimers();
    });
  });

  describe('FAQ Toggle', () => {
    it('should toggle active class on FAQ item click', () => {
      loadContactModule();

      const faqQuestion = document.querySelector('.faq-question');
      faqQuestion.click();

      const faqItem = faqQuestion.closest('.faq-item');
      expect(faqItem.classList.contains('active')).toBe(true);
    });

    it('should close other FAQ items when opening a new one', () => {
      loadContactModule();

      const faqQuestions = document.querySelectorAll('.faq-question');
      const faqItems = document.querySelectorAll('.faq-item');

      // Open first item
      faqQuestions[0].click();
      expect(faqItems[0].classList.contains('active')).toBe(true);

      // Open second item - first should close
      faqQuestions[1].click();
      expect(faqItems[0].classList.contains('active')).toBe(false);
      expect(faqItems[1].classList.contains('active')).toBe(true);
    });

    it('should toggle off the same FAQ item on second click', () => {
      loadContactModule();

      const faqQuestion = document.querySelector('.faq-question');
      faqQuestion.click();
      expect(faqQuestion.closest('.faq-item').classList.contains('active')).toBe(true);

      faqQuestion.click();
      expect(faqQuestion.closest('.faq-item').classList.contains('active')).toBe(false);
    });
  });
});
