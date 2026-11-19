import './style.css';
import { STORAGE_KEY, getSummary, loadProducts } from './store.js';
import { renderProductCard, renderSummaryCards } from './ui.js';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('Elemen #app tidak ditemukan.');
}

let products = loadProducts();

app.innerHTML = `
  <a class="skip-link" href="#main">Lewati ke konten utama</a>

  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="#/katalog" aria-label="Washly — ke katalog">
        <svg class="brand-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3.5c3 3.6 5.5 6.4 5.5 9.4a5.5 5.5 0 0 1-11 0c0-3 2.5-5.8 5.5-9.4Z"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linejoin="round"
          />
          <circle cx="9.6" cy="12.9" r="1" fill="currentColor" />
        </svg>
        <span>Washly</span>
      </a>

      <nav class="site-nav" aria-label="Navigasi utama">
        <a class="nav-link" href="#/katalog" data-route="katalog">Katalog</a>
        <a class="nav-link" href="#/dashboard" data-route="dashboard">Dashboard</a>
      </nav>

      <span class="badge-demo">Demo lokal</span>
    </div>
  </header>

  <main id="main" class="site-main" tabindex="-1">
    <div id="view"></div>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p>Washly · Demo lokal · Tanpa backend · Tanpa login</p>
      <p>Data tersimpan di perangkat ini.</p>
    </div>
  </footer>
`;

const view = document.querySelector('#view');
const main = document.querySelector('#main');
const navLinks = [...document.querySelectorAll('.nav-link')];

const ROUTES = new Set(['#/katalog', '#/dashboard']);
const DOCUMENT_TITLES = {
  katalog: 'Washly — Katalog Produk Laundry',
  dashboard: 'Dashboard — Washly',
};

function getRoute() {
  return window.location.hash === '#/dashboard' ? 'dashboard' : 'katalog';
}

function updateNav(route) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle('is-active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function renderCatalog() {
  const summary = getSummary(products);
  const cards = products.length
    ? products.map((product) => renderProductCard(product)).join('')
    : `
      <div class="empty-state">
        <h3>Katalog masih kosong</h3>
        <p>Tambahkan produk lewat dashboard demo pada tahap berikutnya.</p>
      </div>
    `;

  view.innerHTML = `
    <section class="page" aria-labelledby="page-title">
      <div class="page-intro">
        <div class="container">
          <p class="eyebrow">KATALOG LAUNDRY</p>
          <h1 id="page-title" class="page-title" tabindex="-1">
            Kebutuhan laundry harian, rapi dalam satu katalog.
          </h1>
          <p class="page-lead">
            Deterjen, pewangi, dan perlengkapan pilihan. Cek stok, lalu pesan langsung via WhatsApp.
          </p>
          <p class="stat-row">
            <span>${summary.totalProducts} produk</span>
            <span>${summary.totalStock} stok</span>
            <span>${summary.featured} unggulan</span>
          </p>
        </div>
      </div>

      <div class="container section">
        <div class="section-head">
          <h2 id="catalog-heading">Semua Produk</h2>
          <p class="result-count" aria-live="polite">
            Menampilkan ${products.length} dari ${products.length} produk
          </p>
        </div>
        <section class="product-grid" aria-labelledby="catalog-heading">
          ${cards}
        </section>
      </div>
    </section>
  `;
}

function renderDashboard() {
  const summary = getSummary(products);

  view.innerHTML = `
    <section class="page" aria-labelledby="page-title">
      <div class="container section">
        <header class="page-head">
          <p class="eyebrow">PENGELOLAAN</p>
          <h1 id="page-title" class="page-title" tabindex="-1">Dashboard demo</h1>
          <p class="page-lead">
            Kelola katalog di perangkat ini. Perubahan akan tersimpan lokal setelah fitur CRUD aktif.
          </p>
        </header>

        <div class="notice" role="note">
          <strong>Mode demo.</strong> Tanpa login dan tanpa backend. Data hanya ada di browser ini.
        </div>

        <div class="summary-grid">
          ${renderSummaryCards(summary)}
        </div>

        <div class="placeholder-panel">
          <h2>Pengelolaan produk menyusul</h2>
          <p>
            Tahap scaffold ini menghubungkan data contoh, penyimpanan lokal, dan tampilan katalog.
            Form tambah, ubah, dan hapus produk akan ditambahkan pada tahap berikutnya.
          </p>
        </div>
      </div>
    </section>
  `;
}

function render({ focusHeading = false } = {}) {
  const route = getRoute();

  updateNav(route);
  document.title = DOCUMENT_TITLES[route];

  if (route === 'dashboard') {
    renderDashboard();
  } else {
    renderCatalog();
  }

  if (focusHeading) {
    const heading = view.querySelector('h1');
    heading?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
}

if (!ROUTES.has(window.location.hash)) {
  window.history.replaceState(null, '', '#/katalog');
}

document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
});

window.addEventListener('hashchange', () => render({ focusHeading: true }));

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY || event.key === null) {
    products = loadProducts();
    render();
  }
});

render();
