import { afterEach, describe, expect, it, vi } from 'vitest';
import { SEED_PRODUCTS } from '../src/products.js';
import { STORAGE_KEY, loadProductsWithStatus, saveProducts } from '../src/store.js';

function setupStorage(initialValue) {
  const map = new Map(initialValue === undefined ? [] : [[STORAGE_KEY, initialValue]]);
  const storage = {
    getItem: vi.fn((key) => (map.has(key) ? map.get(key) : null)),
    setItem: vi.fn((key, value) => map.set(key, String(value))),
    removeItem: vi.fn((key) => map.delete(key)),
    clear: vi.fn(() => map.clear()),
    raw: (key) => map.get(key),
    has: (key) => map.has(key),
  };

  vi.stubGlobal('localStorage', storage);
  return storage;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('parser localStorage', () => {
  it('memakai kunci rasanusa:products:v1', () => {
    expect(STORAGE_KEY).toBe('rasanusa:products:v1');
  });

  it('mengisi data contoh saat kunci belum ada', () => {
    const storage = setupStorage();
    const result = loadProductsWithStatus();

    expect(result.status).toBe('seeded');
    expect(result.products).toHaveLength(8);
    expect(JSON.parse(storage.raw(STORAGE_KEY))).toHaveLength(8);
  });

  it('memulihkan data contoh saat JSON rusak', () => {
    setupStorage('{rusak');
    const result = loadProductsWithStatus();

    expect(result.status).toBe('recovered');
    expect(result.products).toHaveLength(8);
  });

  it('memulihkan data contoh saat struktur bukan array produk', () => {
    setupStorage(JSON.stringify({ products: 'bukan array' }));
    const result = loadProductsWithStatus();

    expect(result.status).toBe('recovered');
    expect(result.products).toHaveLength(8);
  });

  it('memulihkan data contoh saat ada field dengan tipe salah', () => {
    const invalid = [{ ...SEED_PRODUCTS[0], harga: '32000' }];
    setupStorage(JSON.stringify(invalid));

    expect(loadProductsWithStatus().status).toBe('recovered');
  });

  it('memulihkan data contoh saat ID duplikat', () => {
    setupStorage(JSON.stringify([SEED_PRODUCTS[0], SEED_PRODUCTS[0]]));

    expect(loadProductsWithStatus().status).toBe('recovered');
  });

  it('menganggap array kosong sebagai data valid', () => {
    setupStorage('[]');
    const result = loadProductsWithStatus();

    expect(result.status).toBe('ok');
    expect(result.products).toEqual([]);
  });

  it('menyimpan array produk dan membacanya kembali', () => {
    const storage = setupStorage();
    const products = [SEED_PRODUCTS[0]];

    expect(saveProducts(products).ok).toBe(true);
    expect(Array.isArray(JSON.parse(storage.raw(STORAGE_KEY)))).toBe(true);

    const result = loadProductsWithStatus();
    expect(result.status).toBe('ok');
    expect(result.products).toEqual(products);
  });

  it('menandai status unavailable saat localStorage tidak dapat dibaca', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
      setItem: vi.fn(),
    });

    const result = loadProductsWithStatus();

    expect(result.status).toBe('unavailable');
    expect(result.products).toHaveLength(8);
  });
});
