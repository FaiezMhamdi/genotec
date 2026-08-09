// enhancements.js - Futuristic UI enhancements
// Typed text effect, scroll animations, particle background, micro-interactions, preloader

const Enhancements = {

  // ─── Typed Text Effect ───────────────────────────────────────────
  typedText: {
    words: ['Robotics & AI', 'Python & Code', 'Innovation', 'Technology'],
    el: null,
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    init() {
      this.el = document.getElementById('typed-text');
      if (!this.el) return;
      this.tick();
    },
    tick() {
      const current = this.words[this.wordIndex];
      if (this.isDeleting) {
        this.charIndex--;
      } else {
        this.charIndex++;
      }

      this.el.textContent = current.substring(0, this.charIndex);

      let speed = this.isDeleting ? 50 : 100;

      if (!this.isDeleting && this.charIndex === current.length) {
        speed = 2000; // Pause at end
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        speed = 500; // Pause before new word
      }

      setTimeout(() => this.tick(), speed);
    }
  },

  // ─── Scroll Animations ──────────────────────────────────────────
  scrollAnimations: {
    init() {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        section.classList.add('scroll-reveal');
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      sections.forEach(section => observer.observe(section));
    }
  },

  // ─── Particle Background ────────────────────────────────────────
  particles: {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    init() {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'particle-canvas';
      document.body.prepend(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createParticles();
      this.animate();

      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
    },
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    createParticles() {
      const count = Math.min(80, Math.floor(window.innerWidth / 15));
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    },
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;

        // Mouse repulsion
        if (this.mouse.x !== null) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            p.x += dx * 0.02;
            p.y += dy * 0.02;
          }
        }

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(31, 143, 255, ${p.opacity})`;
        this.ctx.fill();

        // Draw connections
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(31, 143, 255, ${0.15 * (1 - dist / 120)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      });

      requestAnimationFrame(() => this.animate());
    }
  },

  // ─── Micro-interactions ─────────────────────────────────────────
  microInteractions: {
    init() {
      // Glow pulse on buttons
      document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.classList.add('glow-pulse');
      });

      // Magnetic hover effect on buttons
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        });
      });

      // Cursor glow trail
      const cursor = document.createElement('div');
      cursor.className = 'cursor-glow';
      document.body.appendChild(cursor);

      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
    }
  },

  // ─── Preloader ──────────────────────────────────────────────────
  preloader: {
    init() {
      const loader = document.createElement('div');
      loader.id = 'preloader';
      loader.innerHTML = `
        <div class="preloader-content">
          <div class="preloader-logo">F/M</div>
          <div class="preloader-bar"><div class="preloader-progress"></div></div>
        </div>
      `;
      document.body.prepend(loader);

      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('loaded');
          setTimeout(() => loader.remove(), 600);
        }, 800);
      });
    }
  },

  // ─── Initialize All ─────────────────────────────────────────────
  init() {
    this.preloader.init();
    this.particles.init();
    this.typedText.init();
    this.scrollAnimations.init();
    this.microInteractions.init();
  }
};

// Run preloader immediately, rest after DOM ready
Enhancements.preloader.init();
document.addEventListener('DOMContentLoaded', () => {
  Enhancements.particles.init();
  Enhancements.typedText.init();
  Enhancements.scrollAnimations.init();
  Enhancements.microInteractions.init();
});
