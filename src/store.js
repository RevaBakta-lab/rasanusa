import { SEED_PRODUCTS } from './products.js';
import { parseProductRecord, parseProductsPayload } from './validation.js';

/**
 * Sumber kebenaran data Washly: localStorage pada perangkat ini.
 * Tidak ada backend, tidak ada data pribadi, tidak ada secret.
 */
export const STORAGE_KEY = 'rasanusa:products:v1';

/** Disimpan untuk kompatibilitas dokumentasi; payload kini berupa array produk. */
export const SCHEMA_VERSION = 1;

export function createSeedProducts() {
  return SEED_PRODUCTS.map((product) => ({ ...product }));
}

/** Validator bentuk minimal sebelum data dari localStorage dipakai. */
export function isValidProduct(product) {
  return parseProductRecord(product).ok;
}

/**
 * Menyimpan array produk sebagai JSON. Mengembalikan hasil agar UI dapat
 * menampilkan peringatan bila penyimpanan gagal (quota/private mode).
 */
export function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

function seedStorage() {
  const products = createSeedProducts();
  saveProducts(products);
  return products;
}

/**
 * Memuat dan memvalidasi produk dari localStorage.
 *
 * Status:
 * - `ok`: data valid (array kosong juga valid).
 * - `seeded`: kunci belum ada, data contoh dipakai.
 * - `recovered`: JSON rusak/struktur tidak valid, data contoh dipulihkan.
 * - `unavailable`: localStorage tidak bisa dibaca.
 */
export function loadProductsWithStatus() {
  let raw;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { products: createSeedProducts(), status: 'unavailable' };
  }

  if (raw === null) {
    return { products: seedStorage(), status: 'seeded' };
  }

  try {
    const parsed = parseProductsPayload(JSON.parse(raw));
    if (!parsed.ok) {
      return { products: seedStorage(), status: 'recovered' };
    }

    return { products: parsed.products, status: 'ok' };
  } catch {
    return { products: seedStorage(), status: 'recovered' };
  }
}

/** Pembungkus untuk kode yang hanya butuh array produk. */
export function loadProducts() {
  return loadProductsWithStatus().products;
}

export function resetProducts() {
  return seedStorage();
}

export function getProductById(products, id) {
  return products.find((product) => product.id === id) ?? null;
}

/** Angka ringkasan untuk dashboard. */
export function getSummary(products) {
  return products.reduce(
    (summary, product) => {
      summary.totalProducts += 1;
      summary.totalStock += product.stok;
      if (product.unggulan) summary.featured += 1;
      if (product.stok === 0) summary.outOfStock += 1;
      return summary;
    },
    { totalProducts: 0, totalStock: 0, featured: 0, outOfStock: 0 },
  );
}
