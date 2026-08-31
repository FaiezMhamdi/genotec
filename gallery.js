// gallery.js — Data-driven gallery: all city photos defined here, HTML auto-generated

// ─────────────────────────────────────────────────────────────────────────────
// CITY DATA — add / remove photos here only, no HTML changes needed
// Each city: { id, label, country, flag, color, icon, photos: [{file, ext}] }
// ─────────────────────────────────────────────────────────────────────────────
const CITIES = [
  {
    id: 'barcelona',
    label: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    color: '#00c9a7',
    icon: 'fa-city',
    photos: [
      { file: 'B1',  ext: 'jpg'  },
      { file: 'B2',  ext: 'jpg'  },
      { file: 'B3',  ext: 'jpg'  },
      { file: 'B4',  ext: 'jpg'  },
      { file: 'B5',  ext: 'jpg'  },
      { file: 'B6',  ext: 'jpg'  },
      { file: 'B7',  ext: 'jpeg' },
      { file: 'B8',  ext: 'jpg'  },
      { file: 'B9',  ext: 'jpg'  },
      { file: 'B10', ext: 'jpg'  },
      { file: 'B11', ext: 'jpg'  },
      { file: 'B12', ext: 'jpg'  },
      { file: 'B13', ext: 'jpg'  },
      { file: 'B14', ext: 'jpg'  },
      { file: 'B15', ext: 'jpg'  },
      { file: 'B16', ext: 'jpg'  },
      { file: 'B17', ext: 'jpeg' },
      { file: 'B18', ext: 'jpeg' },
      { file: 'B19', ext: 'jpeg' },
      { file: 'B20', ext: 'jpeg' },
      { file: 'B21', ext: 'jpeg' },
      { file: 'B22', ext: 'jpeg' },
      { file: 'B23', ext: 'jpeg' },
      { file: 'B24', ext: 'jpeg' },
      { file: 'B25', ext: 'jpeg' },
    ]
  },
  {
    id: 'valencia',
    label: 'Valencia',
    country: 'Spain',
    flag: '🇪🇸',
    color: '#f59e0b',
    icon: 'fa-sun',
    photos: [
      { file: 'V1',  ext: 'jpeg' },
      { file: 'V2',  ext: 'jpeg' },
      { file: 'V4',  ext: 'jpeg' },
      { file: 'V5',  ext: 'jpeg' },
      { file: 'V6',  ext: 'jpeg' },
      { file: 'V7',  ext: 'jpeg' },
      { file: 'V8',  ext: 'jpeg' },
      { file: 'V9',  ext: 'jpeg' },
      { file: 'V10', ext: 'jpeg' },
      { file: 'V11', ext: 'jpeg' },
      { file: 'V12', ext: 'jpeg' },
      { file: 'V13', ext: 'jpeg' },
      { file: 'V14', ext: 'jpeg' },
      { file: 'V15', ext: 'jpeg' },
      { file: 'V16', ext: 'jpeg' },
      { file: 'V17', ext: 'jpeg' },
      { file: 'V18', ext: 'jpeg' },
      { file: 'V19', ext: 'jpeg' },
      { file: 'V20', ext: 'jpeg' },
      { file: 'V21', ext: 'jpeg' },
      { file: 'V23', ext: 'jpeg' },
      { file: 'V24', ext: 'jpeg' },
      { file: 'V25', ext: 'jpeg' },
      { file: 'V26', ext: 'jpeg' },
      { file: 'V27', ext: 'jpeg' },

    ]
  },
  {
    id: 'malaga',
    label: 'Malaga',
    country: 'Spain',
    flag: '🇪🇸',
    color: '#22c55e',
    icon: 'fa-umbrella-beach',
    photos: [
      { file: 'M1', ext: 'jpeg' },
      { file: 'M2', ext: 'jpeg' },
      { file: 'M3', ext: 'jpeg' },
      { file: 'M4', ext: 'jpeg' },
      { file: 'M5', ext: 'jpeg' },
      { file: 'M7', ext: 'jpeg' },
      { file: 'M8', ext: 'jpeg' },
      { file: 'M9', ext: 'jpeg' },
      { file: 'M10', ext: 'jpeg' },
      { file: 'M11', ext: 'jpeg' },
      { file: 'M12', ext: 'jpeg' },

    ]
  },
  {
    id: 'lisbon',
    label: 'Lisbon',
    country: 'Portugal',
    flag: '🇵🇹',
    color: '#a855f7',
    icon: 'fa-landmark',
    photos: [
      { file: 'L1', ext: 'jpeg' },
      { file: 'L2', ext: 'jpeg' },
      { file: 'L3', ext: 'jpeg' },
      { file: 'L4', ext: 'jpeg' },
    ]
  },
  {
    id: 'milan',
    label: 'Milan',
    country: 'Italy',
    flag: '🇮🇹',
    color: '#ef4444',
    icon: 'fa-building',
    photos: [
      { file: 'MI1', ext: 'jpeg' },
      { file: 'MI2', ext: 'jpeg' },
    ]
  },
  {
    id: 'munich',
    label: 'Munich',
    country: 'Germany',
    flag: '🇩🇪',
    color: '#35e8ff',
    icon: 'fa-beer',
    photos: [
      { file: 'MU1', ext: 'jpeg' },
      { file: 'MU2', ext: 'jpeg' },
      { file: 'MU3', ext: 'jpeg' },
    ]
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────────────────────
function buildTabs() {
  const tabsEl = document.getElementById('galleryTabs');
  if (!tabsEl) return;

  // "All" tab
  const allBtn = document.createElement('button');
  allBtn.className = 'gtab active';
  allBtn.dataset.cat = 'all';
  allBtn.setAttribute('role', 'tab');
  allBtn.setAttribute('aria-selected', 'true');
  allBtn.innerHTML = '<i class="fas fa-th"></i> All';
  tabsEl.appendChild(allBtn);

  CITIES.forEach(city => {
    const btn = document.createElement('button');
    btn.className = 'gtab';
    btn.dataset.cat = city.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.style.setProperty('--tab-clr', city.color);
    btn.innerHTML = `${city.flag} ${city.label}`;
    tabsEl.appendChild(btn);
  });
}

function buildGrid() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  CITIES.forEach(city => {
    city.photos.forEach((photo, idx) => {
      const src   = `${photo.file}.${photo.ext}`;
      const title = `${city.label} — Training Session ${idx + 1}`;

      const item = document.createElement('div');
      item.className = 'gitem';
      item.dataset.cat   = city.id;
      item.dataset.title = title;
      item.dataset.loc   = `${city.label}, ${city.country}`;

      item.innerHTML = `
        <div class="gitem-inner">
          <img src="${src}" alt="${title}" loading="lazy" decoding="async" />
          <div class="gitem-overlay">
            <div class="gitem-info">
              <span class="gitem-cat" style="--c:${city.color}">
                <i class="fas ${city.icon}"></i> ${city.label}
              </span>
              <h4>${title}</h4>
              <p><i class="fas fa-map-marker-alt"></i> ${city.label}, ${city.country} ${city.flag}</p>
            </div>
            <button class="gitem-zoom" aria-label="View full image">
              <i class="fas fa-expand"></i>
            </button>
          </div>
          <div class="gitem-scan"></div>
        </div>`;

      grid.appendChild(item);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER + LIGHTBOX
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildTabs();
  buildGrid();

  const tabs        = document.querySelectorAll('.gtab');
  const lb          = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lbImg');
  const lbTitle     = document.getElementById('lbTitle');
  const lbLocSpan   = document.querySelector('#lbLoc span');
  const lbCurrent   = document.getElementById('lbCurrent');
  const lbTotal     = document.getElementById('lbTotal');

  let visibleItems = [];
  let currentIndex = 0;

  // ── Filter ──────────────────────────────────────────────────────────────
  function filterCat(cat) {
    const items = document.querySelectorAll('.gitem');
    visibleItems = [];
    items.forEach(item => {
      const match = cat === 'all' || item.dataset.cat === cat;
      item.classList.toggle('hidden', !match);
      if (match) visibleItems.push(item);
    });
    tabs.forEach(t => {
      const active = t.dataset.cat === cat;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
  }

  tabs.forEach(tab => tab.addEventListener('click', () => filterCat(tab.dataset.cat)));

  // Pre-select from URL param
  const initCat = new URLSearchParams(window.location.search).get('cat') || 'all';
  filterCat(initCat);

  // ── Lightbox ─────────────────────────────────────────────────────────────
  function showSlide(idx) {
    const item = visibleItems[idx];
    if (!item) return;
    lbImg.src             = item.querySelector('img').src;
    lbImg.alt             = item.dataset.title;
    lbTitle.textContent   = item.dataset.title;
    lbLocSpan.textContent = item.dataset.loc;
    lbCurrent.textContent = idx + 1;
    lbTotal.textContent   = visibleItems.length;
    currentIndex = idx;
  }

  function openLightbox(item) {
    currentIndex = visibleItems.indexOf(item);
    showSlide(currentIndex);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';
  }

  // Click on any grid item
  document.getElementById('galleryGrid').addEventListener('click', e => {
    const item = e.target.closest('.gitem');
    if (item && !item.classList.contains('hidden')) openLightbox(item);
  });

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

  lb.querySelector('.lb-prev').addEventListener('click', e => {
    e.stopPropagation();
    showSlide((currentIndex - 1 + visibleItems.length) % visibleItems.length);
  });
  lb.querySelector('.lb-next').addEventListener('click', e => {
    e.stopPropagation();
    showSlide((currentIndex + 1) % visibleItems.length);
  });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showSlide((currentIndex - 1 + visibleItems.length) % visibleItems.length);
    if (e.key === 'ArrowRight') showSlide((currentIndex + 1) % visibleItems.length);
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
