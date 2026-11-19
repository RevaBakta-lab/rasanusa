import { SEED_PRODUCTS } from './products.js';

/**
 * Sumber kebenaran data Washly: localStorage pada perangkat ini.
 * Tidak ada backend, tidak ada data pribadi, tidak ada secret.
 */
export const STORAGE_KEY = 'washly:products:v1';
export const SCHEMA_VERSION = 1;

const IMAGE_PATH_PATTERN = /^assets\/products\/[a-z0-9-]+\.svg$/;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0;

export function createSeedProducts() {
  return SEED_PRODUCTS.map((product) => ({ ...product }));
}

/** Validasi bentuk minimal sebelum data dari localStorage dipakai. */
export function isValidProduct(product) {
  if (!product || typeof product !== 'object') return false;

  return (
    isNonEmptyString(product.id) &&
    typeof product.nama === 'string' &&
    product.nama.trim().length >= 3 &&
    product.nama.trim().length <= 60 &&
    typeof product.kategori === 'string' &&
    product.kategori.trim().length >= 2 &&
    product.kategori.trim().length <= 30 &&
    isNonNegativeInteger(product.harga) &&
    isNonNegativeInteger(product.stok) &&
    typeof product.deskripsi === 'string' &&
    product.deskripsi.length <= 240 &&
    typeof product.imageUrl === 'string' &&
    IMAGE_PATH_PATTERN.test(product.imageUrl) &&
    typeof product.unggulan === 'boolean'
  );
}

/**
 * Menyimpan daftar produk. Mengembalikan hasil agar UI dapat menampilkan
 * peringatan bila penyimpanan gagal (quota/private mode).
 */
export function saveProducts(products) {
  try {
    const payload = { version: SCHEMA_VERSION, products };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
 * Memuat produk dari localStorage. Bila kosong, rusak, atau tidak sesuai
 * skema, data contoh dipakai agar aplikasi tidak pernah blank.
 */
export function loadProducts() {
  let raw;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return createSeedProducts();
  }

  if (!raw) return seedStorage();

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== SCHEMA_VERSION || !Array.isArray(parsed.products)) {
      return seedStorage();
    }

    const seenIds = new Set();
    const products = parsed.products.filter((product) => {
      if (!isValidProduct(product) || seenIds.has(product.id)) return false;
      seenIds.add(product.id);
      return true;
    });

    return products.length > 0 ? products : seedStorage();
  } catch {
    return seedStorage();
  }
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
