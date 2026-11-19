import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '../src/products.js';
import {
  getDefaultFormValues,
  parseProductRecord,
  parseProductsJson,
  validateProductInput as validateProduct,
} from '../src/validation.js';

const base = () => ({
  ...getDefaultFormValues(),
  nama: 'Produk Uji Washly',
  kategori: 'Peralatan',
  harga: '15000',
  stok: '2',
  imageUrl: SEED_PRODUCTS[0].imageUrl,
});

describe('validateProduct (validateProductInput)', () => {
  it('menerima harga 0 dan stok 0 sebagai nilai valid', () => {
    const result = validateProduct({ ...base(), harga: '0', stok: '0' });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.product.harga).toBe(0);
    expect(result.product.stok).toBe(0);
  });

  it('menolak nama kosong dan kategori tidak valid', () => {
    const result = validateProduct({ ...base(), nama: '   ', kategori: 'Kategori Asing' });

    expect(result.valid).toBe(false);
    expect(result.errors.nama).toMatch(/Nama produk wajib/);
    expect(result.errors.kategori).toMatch(/kategori yang valid/);
  });

  it('menolak harga dan stok negatif, desimal, serta bukan angka', () => {
    for (const field of ['harga', 'stok']) {
      for (const value of ['-1', '2.5', 'abc', '']) {
        expect(validateProduct({ ...base(), [field]: value }).errors[field]).toMatch(/angka bulat minimal 0/);
      }
    }
  });

  it('menolak deskripsi lebih dari 240 karakter dan path gambar di luar allowlist', () => {
    const result = validateProduct({
      ...base(),
      deskripsi: 'x'.repeat(241),
      imageUrl: '../../assets/products/evil.svg',
    });

    expect(result.errors.deskripsi).toMatch(/maksimal 240/);
    expect(result.errors.imageUrl).toMatch(/gambar produk/);
  });

  it('mempertahankan id saat mode ubah', () => {
    const result = validateProduct({ ...base(), nama: 'Produk Diubah' }, { editingId: 'p-03' });

    expect(result.valid).toBe(true);
    expect(result.product.id).toBe('p-03');
  });
});

describe('parseProductRecord', () => {
  it('menerima record valid dengan tipe field yang benar', () => {
    const result = parseProductRecord(SEED_PRODUCTS[0]);

    expect(result.ok).toBe(true);
    expect(result.product).toEqual(SEED_PRODUCTS[0]);
  });

  it('menolak harga string, stok desimal, dan unggulan bukan boolean', () => {
    expect(parseProductRecord({ ...SEED_PRODUCTS[0], harga: '32000' }).error).toMatch(/harga/);
    expect(parseProductRecord({ ...SEED_PRODUCTS[0], stok: 1.5 }).error).toMatch(/stok/);
    expect(parseProductRecord({ ...SEED_PRODUCTS[0], unggulan: 'true' }).error).toMatch(/unggulan/);
  });

  it('menolak kategori tak valid dan id kosong', () => {
    expect(parseProductRecord({ ...SEED_PRODUCTS[0], kategori: 'Asing' }).error).toMatch(/kategori/);
    expect(parseProductRecord({ ...SEED_PRODUCTS[0], id: '  ' }).error).toMatch(/id/);
  });
});

describe('parseProductsJson', () => {
  it('menolak payload rusak', () => {
    expect(parseProductsJson('{rusak').error).toMatch(/JSON tidak valid/);
    expect(parseProductsJson('{}').error).toMatch(/array produk/);
  });

  it('menolak ID duplikat', () => {
    const result = parseProductsJson(JSON.stringify([SEED_PRODUCTS[0], SEED_PRODUCTS[0]]));

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/duplikat/);
  });

  it('menolak seluruh batch bila satu produk tidak valid', () => {
    const invalid = { ...SEED_PRODUCTS[1], harga: '27000' };
    const result = parseProductsJson(JSON.stringify([SEED_PRODUCTS[0], invalid]));

    expect(result.ok).toBe(false);
    expect(result.products).toEqual([]);
    expect(result.error).toMatch(/Produk ke-2/);
  });
});
