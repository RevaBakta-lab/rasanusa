import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS, filterProducts } from '../src/products.js';

const ids = (products) => products.map((product) => product.id);

describe('filterProducts', () => {
  it('mencari nama secara case-insensitive', () => {
    expect(ids(filterProducts(SEED_PRODUCTS, { query: 'SEKAR' }))).toEqual(['p-01', 'p-02']);
  });

  it('mencari kata kunci pada kategori', () => {
    expect(ids(filterProducts(SEED_PRODUCTS, { query: 'perlengkapan' }))).toEqual(['p-05', 'p-06']);
  });

  it('mencari kata kunci pada deskripsi', () => {
    expect(ids(filterProducts(SEED_PRODUCTS, { query: 'SERAT KAIN' }))).toEqual(['p-02']);
  });

  it('menggabungkan kategori, pencarian, dan sorting harga', () => {
    expect(
      ids(filterProducts(SEED_PRODUCTS, { kategori: 'Pewangi', query: 'sukma', sort: 'harga-asc' })),
    ).toEqual(['p-04', 'p-03']);
    expect(
      ids(filterProducts(SEED_PRODUCTS, { kategori: 'Pewangi', query: 'sukma', sort: 'harga-desc' })),
    ).toEqual(['p-03', 'p-04']);
  });

  it('mengurutkan harga termurah dan termahal', () => {
    expect(ids(filterProducts(SEED_PRODUCTS, { sort: 'harga-asc' }))).toEqual([
      'p-04',
      'p-05',
      'p-06',
      'p-02',
      'p-01',
      'p-03',
      'p-07',
      'p-08',
    ]);
    expect(ids(filterProducts(SEED_PRODUCTS, { sort: 'harga-desc' }))).toEqual([
      'p-08',
      'p-07',
      'p-03',
      'p-01',
      'p-02',
      'p-06',
      'p-05',
      'p-04',
    ]);
  });

  it('mengurutkan nama A–Z sebagai default', () => {
    expect(ids(filterProducts(SEED_PRODUCTS))).toEqual([
      'p-01',
      'p-05',
      'p-07',
      'p-04',
      'p-02',
      'p-03',
      'p-06',
      'p-08',
    ]);
  });

  it('mengembalikan array kosong dan tetap murni', () => {
    const before = JSON.stringify(SEED_PRODUCTS);
    const result = filterProducts(SEED_PRODUCTS, { query: 'xyz123' });

    expect(result).toEqual([]);
    expect(result).not.toBe(SEED_PRODUCTS);
    expect(JSON.stringify(SEED_PRODUCTS)).toBe(before);
  });
});
