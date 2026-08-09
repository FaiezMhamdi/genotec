/**
 * @jest-environment jsdom
 */

describe('shop.js', () => {
  let ShoppingCart;
  let cart;

  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value; }),
      removeItem: jest.fn(key => { delete store[key]; }),
      clear: jest.fn(() => { store = {}; }),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();

    document.body.innerHTML = `
      <span id="cartCount">0</span>
      <span class="cart-badge">0</span>
      <div class="cart-sidebar"></div>
      <div class="overlay"></div>
      <div id="cartItems"></div>
      <span id="cartSubtotal">$0.00</span>
      <span id="cartTotal">$0.00</span>
      <button class="close-cart"></button>
      <button class="checkout-btn"></button>
      <div class="product-card">
        <span class="product-category">Course</span>
        <img src="test.jpg" alt="Test Product">
        <button class="add-to-cart" data-product="Python Course" data-price="49.99">Add to Cart</button>
      </div>
    `;

    jest.resetModules();

    // Mock Shared which is loaded before shop.js in the real page
    jest.mock('../shared.js', () => ({
      showNotification: jest.fn(),
      formatPrice: jest.fn(p => `$${p.toFixed(2)}`),
    }), { virtual: true });

    // Need to define Shared globally since shop.js uses it
    global.Shared = {
      showNotification: jest.fn(),
      formatPrice: (p) => `$${p.toFixed(2)}`,
    };

    const shopModule = require('../shop.js');
    ShoppingCart = shopModule.ShoppingCart;
    cart = new ShoppingCart();
  });

  afterEach(() => {
    delete global.Shared;
  });

  describe('ShoppingCart Constructor', () => {
    it('should initialize with empty cart when localStorage is empty', () => {
      expect(cart.cart).toEqual([]);
    });

    it('should load cart from localStorage if data exists', () => {
      const savedCart = [{ name: 'Item', price: 10, quantity: 1 }];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedCart));

      jest.resetModules();
      global.Shared = { showNotification: jest.fn() };
      const { ShoppingCart: SC } = require('../shop.js');
      const newCart = new SC();

      expect(newCart.cart).toEqual(savedCart);
    });
  });

  describe('addToCart', () => {
    it('should add a new item to the cart', () => {
      const addBtn = document.querySelector('.add-to-cart');
      addBtn.click();

      expect(cart.cart).toHaveLength(1);
      expect(cart.cart[0].name).toBe('Python Course');
      expect(cart.cart[0].price).toBe(49.99);
      expect(cart.cart[0].quantity).toBe(1);
    });

    it('should increment quantity for existing item', () => {
      const addBtn = document.querySelector('.add-to-cart');
      addBtn.click();
      addBtn.click();

      expect(cart.cart).toHaveLength(1);
      expect(cart.cart[0].quantity).toBe(2);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item at given index', () => {
      cart.cart = [
        { name: 'A', price: 10, quantity: 1 },
        { name: 'B', price: 20, quantity: 2 }
      ];
      cart.removeFromCart(0);

      expect(cart.cart).toHaveLength(1);
      expect(cart.cart[0].name).toBe('B');
    });
  });

  describe('updateQuantity', () => {
    it('should increase item quantity', () => {
      cart.cart = [{ name: 'A', price: 10, quantity: 1 }];
      cart.updateQuantity(0, 1);

      expect(cart.cart[0].quantity).toBe(2);
    });

    it('should decrease item quantity', () => {
      cart.cart = [{ name: 'A', price: 10, quantity: 3 }];
      cart.updateQuantity(0, -1);

      expect(cart.cart[0].quantity).toBe(2);
    });

    it('should remove item when quantity reaches 0', () => {
      cart.cart = [{ name: 'A', price: 10, quantity: 1 }];
      cart.updateQuantity(0, -1);

      expect(cart.cart).toHaveLength(0);
    });
  });

  describe('updateCartCount', () => {
    it('should update cart count elements with total items', () => {
      cart.cart = [
        { name: 'A', price: 10, quantity: 2 },
        { name: 'B', price: 5, quantity: 3 }
      ];
      cart.updateCartCount();

      expect(document.getElementById('cartCount').textContent).toBe('5');
    });

    it('should show 0 for empty cart', () => {
      cart.cart = [];
      cart.updateCartCount();

      expect(document.getElementById('cartCount').textContent).toBe('0');
    });

    it('should add has-items class to badges when cart has items', () => {
      cart.cart = [{ name: 'A', price: 10, quantity: 1 }];
      cart.updateCartCount();

      expect(document.querySelector('.cart-badge').classList.contains('has-items')).toBe(true);
    });
  });

  describe('updateCartDisplay', () => {
    it('should show empty cart message when cart is empty', () => {
      cart.cart = [];
      cart.updateCartDisplay();

      const cartItems = document.getElementById('cartItems');
      expect(cartItems.innerHTML).toContain('Your cart is empty');
    });

    it('should display cart items with correct info', () => {
      cart.cart = [{
        name: 'Test Course',
        price: 29.99,
        quantity: 2,
        image: 'test.jpg',
        category: 'Course'
      }];
      cart.updateCartDisplay();

      const cartItems = document.getElementById('cartItems');
      expect(cartItems.innerHTML).toContain('Test Course');
      expect(cartItems.innerHTML).toContain('$29.99');
    });

    it('should update subtotal and total', () => {
      cart.cart = [
        { name: 'A', price: 10, quantity: 2, image: 'a.jpg', category: 'Cat' },
        { name: 'B', price: 5.5, quantity: 1, image: 'b.jpg', category: 'Cat' }
      ];
      cart.updateCartDisplay();

      expect(document.getElementById('cartSubtotal').textContent).toBe('$25.50');
      expect(document.getElementById('cartTotal').textContent).toBe('$25.50');
    });
  });

  describe('toggleCart', () => {
    it('should toggle active class on sidebar and overlay', () => {
      const sidebar = document.querySelector('.cart-sidebar');
      const overlay = document.querySelector('.overlay');

      cart.toggleCart();
      expect(sidebar.classList.contains('active')).toBe(true);
      expect(overlay.classList.contains('active')).toBe(true);

      cart.toggleCart();
      expect(sidebar.classList.contains('active')).toBe(false);
      expect(overlay.classList.contains('active')).toBe(false);
    });

    it('should set body overflow hidden when cart is open', () => {
      cart.toggleCart();
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('closeCart', () => {
    it('should remove active class from sidebar and overlay', () => {
      const sidebar = document.querySelector('.cart-sidebar');
      const overlay = document.querySelector('.overlay');

      sidebar.classList.add('active');
      overlay.classList.add('active');
      cart.closeCart();

      expect(sidebar.classList.contains('active')).toBe(false);
      expect(overlay.classList.contains('active')).toBe(false);
    });

    it('should reset body overflow', () => {
      document.body.style.overflow = 'hidden';
      cart.closeCart();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('checkout', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should show warning when cart is empty', () => {
      cart.cart = [];
      cart.checkout();

      expect(global.Shared.showNotification).toHaveBeenCalledWith(
        'Your cart is empty!', 'warning'
      );
    });

    it('should show checkout notification with total', () => {
      cart.cart = [{ name: 'Item', price: 25, quantity: 2 }];
      cart.checkout();

      expect(global.Shared.showNotification).toHaveBeenCalledWith(
        expect.stringContaining('$50.00'), 'success'
      );
    });

    it('should clear cart after checkout delay', () => {
      cart.cart = [{ name: 'Item', price: 25, quantity: 1 }];
      cart.checkout();

      jest.advanceTimersByTime(2000);

      expect(cart.cart).toEqual([]);
    });
  });

  describe('saveToLocalStorage', () => {
    it('should save cart to localStorage', () => {
      cart.cart = [{ name: 'Test', price: 10, quantity: 1 }];
      cart.saveToLocalStorage();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'cart',
        JSON.stringify([{ name: 'Test', price: 10, quantity: 1 }])
      );
    });
  });

  describe('clearCart', () => {
    it('should empty the cart array', () => {
      cart.cart = [{ name: 'Item', price: 10, quantity: 1 }];
      cart.clearCart();
      expect(cart.cart).toEqual([]);
    });

    it('should save empty cart to localStorage', () => {
      cart.cart = [{ name: 'Item', price: 10, quantity: 1 }];
      cart.clearCart();
      expect(localStorage.setItem).toHaveBeenCalledWith('cart', '[]');
    });
  });

  describe('getCartTotal', () => {
    it('should return 0 for empty cart', () => {
      cart.cart = [];
      expect(cart.getCartTotal()).toBe(0);
    });

    it('should calculate total correctly', () => {
      cart.cart = [
        { name: 'A', price: 10, quantity: 2 },
        { name: 'B', price: 5.5, quantity: 3 }
      ];
      expect(cart.getCartTotal()).toBe(36.5);
    });
  });

  describe('getCartItemCount', () => {
    it('should return 0 for empty cart', () => {
      cart.cart = [];
      expect(cart.getCartItemCount()).toBe(0);
    });

    it('should return total quantity across all items', () => {
      cart.cart = [
        { name: 'A', price: 10, quantity: 2 },
        { name: 'B', price: 5, quantity: 3 }
      ];
      expect(cart.getCartItemCount()).toBe(5);
    });
  });
});
