import './style.css';
import { CATEGORIES, SORT_OPTIONS, filterProducts } from './products.js';
import { STORAGE_KEY, getSummary, loadProducts } from './store.js';
import {
  escapeHtml,
  formatRupiah,
  getStockMeta,
  renderCategoryCard,
  renderNoResultsState,
  renderProductCard,
  renderSummaryCards,
} from './ui.js';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('Elemen #app tidak ditemukan.');
}

let products = loadProducts();

app.innerHTML = `
  <a class="skip-link" href="#main">Lewati ke konten utama</a>

  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="#/beranda" aria-label="Washly — ke beranda">
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
        <a class="nav-link" href="#/beranda" data-route="beranda">Beranda</a>
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
      <p>Washly · Perlengkapan laundry lokal · Demo tanpa backend</p>
      <p>Data tersimpan di perangkat ini.</p>
    </div>
  </footer>
`;

const view = document.querySelector('#view');
const main = document.querySelector('#main');
const navLinks = [...document.querySelectorAll('.nav-link')];

const ROUTES = new Set(['#/beranda', '#/katalog', '#/dashboard']);
const DOCUMENT_TITLES = {
  beranda: 'Washly — Perlengkapan Laundry Lokal',
  katalog: 'Katalog — Washly',
  dashboard: 'Dashboard — Washly',
};

const DEFAULT_FILTERS = { query: '', kategori: 'semua', sort: 'nama-asc' };
let catalogState = { ...DEFAULT_FILTERS };

function getRoute() {
  if (window.location.hash === '#/katalog') return 'katalog';
  if (window.location.hash === '#/dashboard') return 'dashboard';
  return 'beranda';
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

function renderEmptyState() {
  return `
    <div class="empty-state">
      <h3>Katalog masih kosong</h3>
      <p>Tambahkan produk lewat dashboard demo untuk melihatnya di sini.</p>
      <a class="btn btn--primary" href="#/dashboard">Buka Dashboard</a>
    </div>
  `;
}

function renderFilterToolbar() {
  const allSelected = catalogState.kategori === 'semua' ? ' selected' : '';
  const categoryOptions = CATEGORIES.map((category) => {
    const value = escapeHtml(category.nama);
    const selected = catalogState.kategori === category.nama ? ' selected' : '';
    return `<option value="${value}"${selected}>${value}</option>`;
  }).join('');
  const sortOptions = SORT_OPTIONS.map((option) => {
    const selected = catalogState.sort === option.id ? ' selected' : '';
    return `<option value="${option.id}"${selected}>${option.label}</option>`;
  }).join('');

  return `
    <div class="toolbar" role="group" aria-label="Cari dan filter produk">
      <div class="toolbar-row">
        <div class="field field--search">
          <label for="product-search">Cari produk</label>
          <input
            id="product-search"
            class="js-product-search"
            type="search"
            value="${escapeHtml(catalogState.query)}"
            placeholder="Nama, kategori, atau deskripsi"
            autocomplete="off"
          />
        </div>
        <div class="field">
          <label for="category-filter">Kategori</label>
          <select id="category-filter" class="js-category-filter">
            <option value="semua"${allSelected}>Semua kategori</option>
            ${categoryOptions}
          </select>
        </div>
        <div class="field">
          <label for="product-sort">Urutkan</label>
          <select id="product-sort" class="js-sort">${sortOptions}</select>
        </div>
        <div class="field field--action">
          <button type="button" class="btn btn--secondary js-reset-filters">Reset</button>
        </div>
      </div>
    </div>
  `;
}

function renderFilterResults() {
  if (products.length === 0) return renderEmptyState();

  const visibleProducts = filterProducts(products, catalogState);
  const headingId = getRoute() === 'katalog' ? 'catalog-heading' : 'landing-products-heading';
  const count = `<p class="result-count" aria-live="polite">Menampilkan ${visibleProducts.length} dari ${products.length} produk</p>`;
  const grid = visibleProducts.length
    ? `<div class="product-grid" aria-labelledby="${headingId}">${visibleProducts
        .map((product) => renderProductCard(product))
        .join('')}</div>`
    : renderNoResultsState();

  return `${count}${grid}`;
}

function updateFilterResults() {
  const target = view.querySelector('.js-results');
  if (!target) return;
  target.innerHTML = renderFilterResults();
}

function syncFilterToolbar() {
  const search = view.querySelector('.js-product-search');
  const category = view.querySelector('.js-category-filter');
  const sort = view.querySelector('.js-sort');

  if (search) search.value = catalogState.query;
  if (category) category.value = catalogState.kategori;
  if (sort) sort.value = catalogState.sort;
}

function renderHeroPreview(product) {
  if (!product) return '';

  const stock = getStockMeta(product.stok);

  return `
    <article class="hero-preview">
      <div class="product-media hero-preview__media">
        <img
          class="product-photo"
          src="${escapeHtml(product.imageUrl)}"
          alt=""
          width="400"
          height="300"
          loading="lazy"
          decoding="async"
        />
        <span class="product-monogram" aria-hidden="true">${escapeHtml(product.nama.charAt(0))}</span>
      </div>
      <div class="hero-preview__body">
        <span class="badge badge--mint">★ Unggulan</span>
        <strong class="hero-preview__name">${escapeHtml(product.nama)}</strong>
        <span class="hero-preview__price">${formatRupiah(product.harga)}</span>
        <span class="hero-preview__stock stock stock--${stock.tone}">${escapeHtml(stock.label)}</span>
      </div>
    </article>
  `;
}

function renderLanding() {
  const summary = getSummary(products);
  const categories = CATEGORIES.map((category) =>
    renderCategoryCard(
      category,
      products.filter((product) => product.kategori === category.nama).length,
    ),
  ).join('');
  const previewProduct = products.find((product) => product.unggulan && product.stok > 0) ?? products[0];

  view.innerHTML = `
    <section class="page" aria-labelledby="page-title">
      <div class="hero">
        <div class="container hero-inner">
          <div class="hero-copy">
            <p class="eyebrow">PERLENGKAPAN LAUNDRY LOKAL</p>
            <h1 id="page-title" class="hero-title" tabindex="-1">
              Kebutuhan laundry harian, rapi dalam satu katalog.
            </h1>
            <p class="hero-lead">
              Deterjen, pewangi, perlengkapan, dan peralatan pilihan. Harga dalam Rupiah, stok
              jelas, dan siap dipesan lewat WhatsApp.
            </p>
            <div class="hero-actions">
              <a class="btn btn--primary" href="#/katalog">Buka Katalog</a>
              <a class="btn btn--secondary" href="#/dashboard">Kelola Katalog</a>
            </div>
            <dl class="hero-stats">
              <div>
                <dt>Produk</dt>
                <dd>${summary.totalProducts}</dd>
              </div>
              <div>
                <dt>Kategori</dt>
                <dd>${CATEGORIES.length}</dd>
              </div>
              <div>
                <dt>Stok tersedia</dt>
                <dd>${summary.totalStock}</dd>
              </div>
            </dl>
          </div>

          <div class="hero-panel" aria-hidden="true">
            <span class="hero-bubble hero-bubble--one"></span>
            <span class="hero-bubble hero-bubble--two"></span>
            <span class="hero-bubble hero-bubble--three"></span>
            ${renderHeroPreview(previewProduct)}
          </div>
        </div>
      </div>

      <div class="section section--tint">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow">EMPAT KATEGORI</p>
              <h2 id="categories-heading">Dari mencuci sampai merapikan</h2>
            </div>
            <p class="section-note">Semua kebutuhan operasional laundry harian.</p>
          </div>
          <div class="category-grid" aria-labelledby="categories-heading">
            ${categories}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow">KATALOG SINGKAT</p>
              <h2 id="landing-products-heading">Delapan produk contoh</h2>
            </div>
            <a class="text-link" href="#/katalog">
              Buka katalog lengkap <span aria-hidden="true">→</span>
            </a>
          </div>
          <p class="section-note">
            Cari berdasarkan nama, kategori, atau deskripsi. Harga dalam Rupiah dan stok diperbarui dari data toko.
          </p>
          ${renderFilterToolbar()}
          <div class="js-results">${renderFilterResults()}</div>
        </div>
      </div>

      <div class="cta-band">
        <div class="container cta-inner">
          <div>
            <p class="eyebrow eyebrow--light">SIAP BELANJA?</p>
            <h2>Cek stok dan harga di katalog.</h2>
            <p>Delapan produk contoh, empat kategori, tanpa login.</p>
          </div>
          <a class="btn btn--light" href="#/katalog">Buka Katalog</a>
        </div>
      </div>
    </section>
  `;
}

function renderCatalog() {
  const summary = getSummary(products);

  view.innerHTML = `
    <section class="page" aria-labelledby="page-title">
      <div class="page-intro">
        <div class="container">
          <a class="back-link" href="#/beranda">← Beranda</a>
          <p class="eyebrow">KATALOG LAUNDRY</p>
          <h1 id="page-title" class="page-title" tabindex="-1">Katalog perlengkapan laundry.</h1>
          <p class="page-lead">
            Delapan produk contoh dalam empat kategori. Harga Rupiah dan stok tersedia.
          </p>
          <p class="stat-row">
            <span>${summary.totalProducts} produk</span>
            <span>${summary.totalStock} stok</span>
            <span>${summary.featured} unggulan</span>
            <span>${summary.outOfStock} stok habis</span>
          </p>
        </div>
      </div>

      <div class="container section">
        <div class="section-head">
          <h2 id="catalog-heading">Semua Produk</h2>
        </div>
        <p class="section-note">
          Gunakan pencarian, kategori, dan urutan di bawah untuk menyempitkan daftar produk.
        </p>
        ${renderFilterToolbar()}
        <div class="js-results">${renderFilterResults()}</div>
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
            Tahap ini menghubungkan data contoh, penyimpanan lokal, dan tampilan katalog.
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
  } else if (route === 'katalog') {
    renderCatalog();
  } else {
    renderLanding();
  }

  syncFilterToolbar();

  if (focusHeading) {
    const heading = view.querySelector('h1');
    heading?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
}

if (!ROUTES.has(window.location.hash)) {
  window.history.replaceState(null, '', '#/beranda');
}

document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
});

view.addEventListener(
  'error',
  (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement) {
      target.closest('.product-media')?.classList.add('is-fallback');
    }
  },
  true,
);

view.addEventListener('input', (event) => {
  if (!event.target.matches('.js-product-search')) return;
  catalogState.query = event.target.value;
  updateFilterResults();
});

view.addEventListener('change', (event) => {
  const target = event.target;

  if (target.matches('.js-category-filter')) {
    catalogState.kategori = target.value;
    updateFilterResults();
  } else if (target.matches('.js-sort')) {
    catalogState.sort = target.value;
    updateFilterResults();
  }
});

view.addEventListener('click', (event) => {
  if (!event.target.closest('.js-reset-filters')) return;

  catalogState = { ...DEFAULT_FILTERS };
  syncFilterToolbar();
  updateFilterResults();
});

window.addEventListener('hashchange', () => render({ focusHeading: true }));

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY || event.key === null) {
    products = loadProducts();
    render();
  }
});

render();
