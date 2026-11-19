import { CATEGORIES, PRODUCT_IMAGE_PATHS } from './products.js';

const CATEGORY_NAMES = new Set(CATEGORIES.map((category) => category.nama));
const IMAGE_PATHS = new Set(PRODUCT_IMAGE_PATHS);
const NON_NEGATIVE_INTEGER = /^\d+$/;

/** Nilai awal form tambah produk. */
export function getDefaultFormValues() {
  return {
    nama: '',
    kategori: CATEGORIES[0]?.nama ?? '',
    harga: '',
    stok: '',
    deskripsi: '',
    imageUrl: PRODUCT_IMAGE_PATHS[0] ?? '',
    unggulan: false,
  };
}

/**
 * Membuat ID baru yang belum dipakai. Fungsi murni dan deterministik:
 * `p-01`, `p-02`, ... memakai nomor terkecil yang tersedia.
 */
export function createProductId(products) {
  const used = new Set(
    (Array.isArray(products) ? products : [])
      .map((product) => product?.id)
      .filter((id) => typeof id === 'string' && id.length > 0),
  );

  let next = 1;
  while (used.has(`p-${String(next).padStart(2, '0')}`)) next += 1;
  return `p-${String(next).padStart(2, '0')}`;
}

/**
 * Memvalidasi satu record produk dari JSON/localStorage. Tidak ada koersi
 * tipe: harga dan stok harus sudah berupa number, `unggulan` harus boolean.
 */
export function parseProductRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'data bukan objek produk.' };
  }

  const id = typeof value.id === 'string' ? value.id.trim() : '';
  if (!id) return { ok: false, error: 'id wajib berupa teks.' };

  const nama = typeof value.nama === 'string' ? value.nama.trim() : '';
  if (nama.length < 3 || nama.length > 60) {
    return { ok: false, error: 'nama wajib 3–60 karakter.' };
  }

  const kategori = typeof value.kategori === 'string' ? value.kategori.trim() : '';
  if (!CATEGORY_NAMES.has(kategori)) {
    return { ok: false, error: 'kategori tidak dikenal.' };
  }

  if (!Number.isSafeInteger(value.harga) || value.harga < 0) {
    return { ok: false, error: 'harga harus bilangan bulat minimal 0.' };
  }

  if (!Number.isSafeInteger(value.stok) || value.stok < 0) {
    return { ok: false, error: 'stok harus bilangan bulat minimal 0.' };
  }

  const deskripsi = typeof value.deskripsi === 'string' ? value.deskripsi.trim() : '';
  if (deskripsi.length > 240) {
    return { ok: false, error: 'deskripsi maksimal 240 karakter.' };
  }

  const imageUrl = typeof value.imageUrl === 'string' ? value.imageUrl.trim() : '';
  if (!IMAGE_PATHS.has(imageUrl)) {
    return { ok: false, error: 'path gambar tidak terdaftar.' };
  }

  if (typeof value.unggulan !== 'boolean') {
    return { ok: false, error: 'unggulan harus bernilai true atau false.' };
  }

  return {
    ok: true,
    product: { id, nama, kategori, harga: value.harga, stok: value.stok, deskripsi, imageUrl, unggulan: value.unggulan },
  };
}

/**
 * Memvalidasi payload array produk. Menerima array langsung atau objek
 * `{ products: [...] }` agar file ekspor lama tetap bisa diimpor.
 */
export function parseProductsPayload(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray(payload.products)
      ? payload.products
      : null;

  if (!list) {
    return { ok: false, products: [], error: 'JSON harus berupa array produk.' };
  }

  const seen = new Set();
  const products = [];

  for (let index = 0; index < list.length; index += 1) {
    const result = parseProductRecord(list[index]);
    if (!result.ok) {
      return { ok: false, products: [], error: `Produk ke-${index + 1}: ${result.error}` };
    }
    if (seen.has(result.product.id)) {
      return { ok: false, products: [], error: `ID "${result.product.id}" duplikat.` };
    }
    seen.add(result.product.id);
    products.push(result.product);
  }

  return { ok: true, products, error: '' };
}

/** JSON.parse + validasi penuh untuk file impor. */
export function parseProductsJson(text) {
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    return { ok: false, products: [], error: 'JSON tidak valid.' };
  }

  return parseProductsPayload(payload);
}

function parseNonNegativeInteger(raw) {
  const value = String(raw ?? '').trim();
  if (!NON_NEGATIVE_INTEGER.test(value)) return null;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

function toBoolean(value) {
  return value === true || value === 'on' || value === 'true' || value === 1;
}

/**
 * Validasi input form secara murni: tidak menyentuh DOM/localStorage dan tidak
 * mengubah argumen. Mengembalikan `product` hanya bila semua field valid.
 *
 * @param {object} values nilai form dari FormData
 * @param {object} options `{ existingProducts, editingId }`
 */
export function validateProductInput(values, options = {}) {
  const { existingProducts = [], editingId = null } = options;
  const source = values && typeof values === 'object' ? values : {};
  const errors = {};

  const nama = String(source.nama ?? '').trim();
  if (nama.length < 3 || nama.length > 60) {
    errors.nama = 'Nama produk wajib diisi (3–60 karakter).';
  }

  const kategori = String(source.kategori ?? '').trim();
  if (!CATEGORY_NAMES.has(kategori)) {
    errors.kategori = 'Pilih kategori yang valid.';
  }

  const harga = parseNonNegativeInteger(source.harga);
  if (harga === null) {
    errors.harga = 'Harga harus berupa angka bulat minimal 0.';
  }

  const stok = parseNonNegativeInteger(source.stok);
  if (stok === null) {
    errors.stok = 'Stok harus berupa angka bulat minimal 0.';
  }

  const deskripsi = String(source.deskripsi ?? '').trim();
  if (deskripsi.length > 240) {
    errors.deskripsi = 'Deskripsi maksimal 240 karakter.';
  }

  const imageUrl = String(source.imageUrl ?? '').trim();
  if (!IMAGE_PATHS.has(imageUrl)) {
    errors.imageUrl = 'Pilih gambar produk yang tersedia.';
  }

  const valid = Object.keys(errors).length === 0;
  const product = valid
    ? {
        id: editingId ? String(editingId) : createProductId(existingProducts),
        nama,
        kategori,
        harga,
        stok,
        deskripsi,
        imageUrl,
        unggulan: toBoolean(source.unggulan),
      }
    : null;

  return { valid, errors, product };
}
