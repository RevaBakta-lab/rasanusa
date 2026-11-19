import { WHATSAPP_NUMBER, buildWhatsAppUrl } from './config.js';

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Semua teks dari data pengguna wajib lewat fungsi ini sebelum masuk DOM. */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

export function formatRupiah(value) {
  const amount = Number(value);
  return `Rp ${rupiahFormatter.format(Number.isFinite(amount) ? amount : 0)}`;
}

export function getInitials(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

/** Label dan warna status stok; teks selalu ada agar tidak bergantung warna. */
export function getStockMeta(stock) {
  if (stock === 0) return { label: 'Stok habis', tone: 'danger' };
  if (stock <= 10) return { label: `Stok tersisa ${stock}`, tone: 'warning' };
  return { label: `Stok: ${stock}`, tone: 'normal' };
}

function renderOrderButton(product) {
  const nama = escapeHtml(product.nama);
  const tersedia = Number(product.stok) > 0;

  if (!tersedia) {
    return `
      <button type="button" class="btn btn--whatsapp" disabled aria-label="Stok habis, ${nama} tidak dapat dipesan">
        <span class="wa-icon" aria-hidden="true">WA</span>
        <span>Stok habis</span>
      </button>
    `;
  }

  const url = escapeHtml(buildWhatsAppUrl(WHATSAPP_NUMBER, product));

  return `
    <a
      class="btn btn--whatsapp"
      href="${url}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pesan ${nama} via WhatsApp"
    >
      <span class="wa-icon" aria-hidden="true">WA</span>
      <span>Pesan via WhatsApp</span>
    </a>
  `;
}

export function renderProductCard(product) {
  const stock = getStockMeta(product.stok);
  const featured = product.unggulan
    ? '<span class="badge badge--featured"><span aria-hidden="true">★</span> Unggulan</span>'
    : '';

  return `
    <article class="product-card">
      <div class="product-media">
        <img
          class="product-photo"
          src="${escapeHtml(product.imageUrl)}"
          alt="Ilustrasi ${escapeHtml(product.nama)}"
          width="400"
          height="300"
          loading="lazy"
          decoding="async"
        />
        <span class="product-monogram" aria-hidden="true">${escapeHtml(getInitials(product.nama))}</span>
        ${featured}
      </div>
      <div class="product-body">
        <h3 class="product-name">${escapeHtml(product.nama)}</h3>
        <span class="chip">${escapeHtml(product.kategori)}</span>
        <p class="price">${formatRupiah(product.harga)}</p>
        <p class="stock stock--${stock.tone}">${escapeHtml(stock.label)}</p>
        <p class="product-desc">${escapeHtml(product.deskripsi)}</p>
        <div class="product-action">${renderOrderButton(product)}</div>
      </div>
    </article>
  `;
}

export function renderCategoryCard(category, count) {
  const productLabel = count === 1 ? '1 produk' : `${count} produk`;

  return `
    <article class="category-card">
      <span class="category-code" aria-hidden="true">${escapeHtml(category.kode)}</span>
      <div class="category-body">
        <h3>${escapeHtml(category.nama)}</h3>
        <p>${escapeHtml(category.deskripsi)}</p>
      </div>
      <span class="category-count">${productLabel}</span>
    </article>
  `;
}

export function renderNoResultsState() {
  return `
    <div class="empty-state">
      <h3>Tidak ada produk yang cocok</h3>
      <p>Coba kata kunci lain atau atur ulang filter pencarian.</p>
      <button type="button" class="btn btn--primary js-reset-filters" data-reset-filters>Reset filter</button>
    </div>
  `;
}

export function renderSummaryCards(summary) {
  const cards = [
    { label: 'Total produk', value: summary.totalProducts, icon: '▦', tone: 'aqua' },
    { label: 'Total stok', value: summary.totalStock, icon: '▤', tone: 'aqua' },
    { label: 'Produk unggulan', value: summary.featured, icon: '★', tone: 'mint' },
    { label: 'Stok habis', value: summary.outOfStock, icon: '!', tone: 'danger' },
  ];

  return cards
    .map(
      (card) => `
        <article class="summary-card summary-card--${card.tone}">
          <span class="summary-icon" aria-hidden="true">${card.icon}</span>
          <span class="summary-label">${card.label}</span>
          <strong class="summary-value">${card.value}</strong>
        </article>
      `,
    )
    .join('');
}
