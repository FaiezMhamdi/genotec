// shop.js - Enhanced shopping cart functionality

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

class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    loadCart() {
        try {
            const data = JSON.parse(localStorage.getItem('cart'));
            if (!Array.isArray(data)) return [];
            return data.filter(item =>
                item &&
                typeof item.name === 'string' &&
                typeof item.price === 'number' && isFinite(item.price) &&
                typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity > 0
            );
        } catch {
            return [];
        }
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Cart toggle
        document.getElementById('viewCartBtn')?.addEventListener('click', () => this.toggleCart());
        document.getElementById('mobileViewCart')?.addEventListener('click', () => this.toggleCart());
        document.getElementById('ctaViewCart')?.addEventListener('click', () => this.toggleCart());
        document.querySelector('.close-cart')?.addEventListener('click', () => this.closeCart());
        document.querySelector('.overlay')?.addEventListener('click', () => this.closeCart());

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e));
        });

        // Checkout button
        document.querySelector('.checkout-btn')?.addEventListener('click', () => this.checkout());
    }

    addToCart(event) {
        const button = event.target.closest('.add-to-cart');
        if (!button) return;

        const productCard = button.closest('.product-card');
        if (!productCard) {
            console.error('addToCart: .product-card not found for button', button);
            return;
        }

        const imgEl = productCard.querySelector('img');
        const categoryEl = productCard.querySelector('.product-category');
        const price = parseFloat(button.dataset.price);

        if (isNaN(price)) {
            console.error('addToCart: invalid price', button.dataset.price);
            return;
        }

        const product = {
            id: this.generateId(),
            name: button.dataset.product || 'Unknown Product',
            price: price,
            image: imgEl ? imgEl.src : '',
            category: categoryEl ? categoryEl.textContent : ''
        };

        const existingItem = this.cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            product.quantity = 1;
            this.cart.push(product);
        }

        this.saveToLocalStorage();
        this.updateCartCount();
        this.updateCartDisplay();
        this.showAddToCartAnimation(button);
        this.toggleCart(); // Auto-open cart when adding items
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveToLocalStorage();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateQuantity(index, change) {
        this.cart[index].quantity += change;
        
        if (this.cart[index].quantity <= 0) {
            this.removeFromCart(index);
        } else {
            this.saveToLocalStorage();
            this.updateCartDisplay();
        }
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update all cart count elements
        document.querySelectorAll('#cartCount, .cart-badge').forEach(element => {
            element.textContent = totalItems;
        });

        // Add/remove cart pulse animation
        const cartBadges = document.querySelectorAll('.cart-badge');
        if (totalItems > 0) {
            cartBadges.forEach(badge => badge.classList.add('has-items'));
        } else {
            cartBadges.forEach(badge => badge.classList.remove('has-items'));
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <small>Add some courses or kits to get started!</small>
                </div>
            `;
            if (cartSubtotal) cartSubtotal.textContent = '$0.00';
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        cartItems.innerHTML = '';

        this.cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" onerror="this.src='https://via.placeholder.com/60x60/0b0c10/1f8fff?text=FM'">
                </div>
                <div class="cart-item-details">
                    <h4>${escapeHTML(item.name)}</h4>
                    <div class="cart-item-meta">
                        <span class="cart-item-category">${escapeHTML(item.category)}</span>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease" data-index="${index}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        // Add event listeners to dynamic elements
        cartItems.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.updateQuantity(index, -1);
            });
        });

        cartItems.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.updateQuantity(index, 1);
            });
        });

        cartItems.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.removeFromCart(index);
            });
        });

        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    toggleCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.overlay');

        if (!cartSidebar) return;
        cartSidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }

    closeCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.overlay');

        if (cartSidebar) cartSidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'warning');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        this.showNotification(`Proceeding to checkout - Total: $${total.toFixed(2)}`, 'success');
        
        // Simulate checkout process
        setTimeout(() => {
            this.cart = [];
            this.saveToLocalStorage();
            this.updateCartCount();
            this.updateCartDisplay();
            this.closeCart();
            this.showNotification('Order completed successfully! 🎉', 'success');
        }, 2000);
    }

    showAddToCartAnimation(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i><span>Added!</span>';
        button.classList.add('added');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('added');
        }, 2000);
    }

    showNotification(message, type = 'info') {
        Shared.showNotification(message, type);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        } catch (e) {
            console.error('Failed to save cart to localStorage:', e);
        }
    }

    clearCart() {
        this.cart = [];
        this.saveToLocalStorage();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Shop-specific initialization
// Shared utilities (year update, mobile menu, header scroll, smooth scrolling,
// formatPrice, debounce) are now in shared.js.
document.addEventListener('DOMContentLoaded', () => {
    const cart = new ShoppingCart();

    // Escape key to close cart
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cart.closeCart();
    });

    // Prevent body scroll when cart is open
    document.addEventListener('wheel', (e) => {
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart };
}
