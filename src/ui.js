import { WHATSAPP_NUMBER, buildWhatsAppUrl } from './config.js';
import { CATEGORIES, PRODUCT_IMAGE_PATHS } from './products.js';

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

export function renderCategoryBreakdown(products) {
  const counts = new Map(CATEGORIES.map((category) => [category.nama, 0]));
  const known = new Set(counts.keys());
  let otherCount = 0;

  products.forEach((product) => {
    if (counts.has(product.kategori)) {
      counts.set(product.kategori, counts.get(product.kategori) + 1);
    } else {
      otherCount += 1;
    }
  });

  const pills = CATEGORIES.map((category) => {
    const count = counts.get(category.nama);
    return `
      <span class="category-pill">
        <span class="chip">${escapeHtml(category.nama)}</span>
        <strong>${count}</strong>
      </span>
    `;
  }).join('');

  const otherPill = otherCount
    ? `<span class="category-pill"><span class="chip">Lainnya</span><strong>${otherCount}</strong></span>`
    : '';

  return `
    <section class="category-summary" aria-labelledby="category-summary-heading">
      <h2 id="category-summary-heading">Kategori</h2>
      <p>Jumlah produk per kategori. Kategori yang tersedia: ${CATEGORIES.length}.</p>
      <div class="category-pills">${pills}${otherPill}</div>
    </section>
  `;
}

export function renderProductTable(products) {
  if (!products.length) {
    return `
      <div class="empty-state">
        <h3>Belum ada produk</h3>
        <p>Tambahkan produk pertama untuk mengisi katalog publik.</p>
        <button type="button" class="btn btn--primary js-open-form">Tambah produk</button>
      </div>
    `;
  }

  const rows = products
    .map((product) => {
      const stock = getStockMeta(product.stok);
      const id = escapeHtml(product.id);

      return `
        <tr>
          <th scope="row" class="cell-name">
            <span class="table-name">${escapeHtml(product.nama)}</span>
            <span class="table-desc">${escapeHtml(product.deskripsi || '—')}</span>
          </th>
          <td><span class="chip">${escapeHtml(product.kategori)}</span></td>
          <td class="cell-number">${formatRupiah(product.harga)}</td>
          <td class="cell-number"><span class="stock stock--${stock.tone}">${escapeHtml(stock.label)}</span></td>
          <td><span class="flag ${product.unggulan ? 'flag--yes' : ''}">${product.unggulan ? 'Ya' : 'Tidak'}</span></td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn--table js-edit-product" data-edit-id="${id}">Ubah</button>
              <button type="button" class="btn btn--table btn--table-danger js-delete-product" data-delete-id="${id}">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="table-wrap">
      <table class="product-table">
        <thead>
          <tr>
            <th scope="col">Nama</th>
            <th scope="col">Kategori</th>
            <th scope="col">Harga</th>
            <th scope="col">Stok</th>
            <th scope="col">Unggulan</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function formFieldAttributes(name, state, extra = '', withHint = false) {
  const error = state.errors?.[name];
  const describedBy = [withHint ? `${name}-hint` : '', error ? `${name}-error` : '']
    .filter(Boolean)
    .join(' ');

  return [
    `id="field-${name}"`,
    `name="${name}"`,
    `aria-invalid="${error ? 'true' : 'false'}"`,
    describedBy ? `aria-describedby="${describedBy}"` : '',
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

function renderFormField(name, label, control, error, hint = '') {
  return `
    <div class="form-field${error ? ' has-error' : ''}">
      <label for="field-${name}">${label}</label>
      ${control}
      ${hint ? `<p class="field-hint" id="${name}-hint">${escapeHtml(hint)}</p>` : ''}
      <p class="field-error" id="${name}-error" data-error-for="${name}"${error ? '' : ' hidden'}>${escapeHtml(error ?? '')}</p>
    </div>
  `;
}

export function renderProductFormPanel(state) {
  const values = state.values;
  const errors = state.errors ?? {};
  const isEdit = state.mode === 'edit';
  const categoryOptions = CATEGORIES.map((category) => {
    const value = escapeHtml(category.nama);
    return `<option value="${value}"${values.kategori === category.nama ? ' selected' : ''}>${value}</option>`;
  }).join('');
  const imageOptions = PRODUCT_IMAGE_PATHS.map((path) => {
    const value = escapeHtml(path);
    const label = escapeHtml(path.split('/').pop());
    return `<option value="${value}"${values.imageUrl === path ? ' selected' : ''}>${label}</option>`;
  }).join('');

  return `
    <section class="form-panel" aria-labelledby="product-form-title">
      <div class="form-panel-head">
        <div>
          <p class="eyebrow">${isEdit ? 'UBAH PRODUK' : 'TAMBAH PRODUK'}</p>
          <h2 id="product-form-title">${isEdit ? 'Ubah produk' : 'Tambah produk baru'}</h2>
        </div>
        <button type="button" class="btn btn--secondary js-close-form">Tutup</button>
      </div>

      <form id="product-form" class="product-form" novalidate>
        <div class="form-grid">
          ${renderFormField(
            'nama',
            'Nama produk',
            `<input type="text" maxlength="60" autocomplete="off" placeholder="Contoh: Deterjen Cair Sekar 1L" value="${escapeHtml(values.nama)}" ${formFieldAttributes('nama', state)} />`,
            errors.nama,
          )}
          ${renderFormField(
            'kategori',
            'Kategori',
            `<select ${formFieldAttributes('kategori', state)}>${categoryOptions}</select>`,
            errors.kategori,
          )}
          ${renderFormField(
            'harga',
            'Harga (Rp)',
            `<input type="text" inputmode="numeric" autocomplete="off" placeholder="32000" value="${escapeHtml(values.harga)}" ${formFieldAttributes('harga', state, '', true)} />`,
            errors.harga,
            'Angka bulat, minimal 0. Contoh: 32000',
          )}
          ${renderFormField(
            'stok',
            'Stok',
            `<input type="text" inputmode="numeric" autocomplete="off" placeholder="24" value="${escapeHtml(values.stok)}" ${formFieldAttributes('stok', state, '', true)} />`,
            errors.stok,
            'Bilangan bulat, minimal 0.',
          )}
          ${renderFormField(
            'imageUrl',
            'Gambar produk',
            `<select ${formFieldAttributes('imageUrl', state)}>${imageOptions}</select>`,
            errors.imageUrl,
          )}
          <div class="form-field form-field--checkbox">
            <label class="checkbox-label" for="field-unggulan">
              <input type="checkbox" name="unggulan" id="field-unggulan"${values.unggulan ? ' checked' : ''} />
              <span>Tandai sebagai produk unggulan</span>
            </label>
          </div>
          <div class="form-field form-field--wide">
            ${renderFormField(
              'deskripsi',
              'Deskripsi (opsional)',
              `<textarea rows="3" maxlength="240" placeholder="Deskripsi singkat produk" ${formFieldAttributes('deskripsi', state, '', true)}>${escapeHtml(values.deskripsi)}</textarea>`,
              errors.deskripsi,
              'Maksimal 240 karakter.',
            )}
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn--primary">${isEdit ? 'Simpan perubahan' : 'Simpan produk'}</button>
          <button type="button" class="btn btn--secondary js-close-form">Batal</button>
        </div>
      </form>
    </section>
  `;
}

let toastTimer = null;

/** Toast ringan untuk umpan balik CRUD; teks selalu dipakai sebagai textContent. */
export function showToast(message, tone = 'success') {
  const safeTone = ['success', 'info', 'error'].includes(tone) ? tone : 'info';
  let region = document.querySelector('#toast-region');

  if (!region) {
    region = document.createElement('div');
    region.id = 'toast-region';
    region.className = 'toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }

  if (toastTimer) clearTimeout(toastTimer);
  region.replaceChildren();

  const toast = document.createElement('div');
  toast.className = `toast toast--${safeTone}`;
  toast.textContent = message;
  region.append(toast);

  toastTimer = setTimeout(() => toast.remove(), 3200);
}
