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

export function renderProductCard(product) {
  const stock = getStockMeta(product.stok);
  const featured = product.unggulan
    ? '<span class="badge badge--featured"><span aria-hidden="true">★</span> Unggulan</span>'
    : '';

  return `
    <article class="product-card">
      <div class="product-media">
        <span class="product-monogram" aria-hidden="true">${escapeHtml(getInitials(product.nama))}</span>
        ${featured}
      </div>
      <div class="product-body">
        <h3 class="product-name">${escapeHtml(product.nama)}</h3>
        <span class="chip">${escapeHtml(product.kategori)}</span>
        <p class="price">${formatRupiah(product.harga)}</p>
        <p class="stock stock--${stock.tone}">${escapeHtml(stock.label)}</p>
        <p class="product-desc">${escapeHtml(product.deskripsi)}</p>
      </div>
    </article>
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
