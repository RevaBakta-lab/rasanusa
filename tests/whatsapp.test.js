import { describe, expect, it } from 'vitest';
import { WHATSAPP_NUMBER, buildWhatsAppUrl, normalizeWhatsAppNumber } from '../src/config.js';

const produk = () => ({
  nama: 'Deterjen Cair Sekar 1L',
  kategori: 'Bahan Cuci',
  harga: 32000,
  stok: 24,
});

describe('normalizeWhatsAppNumber', () => {
  it('menerima format internasional dengan atau tanpa tanda +', () => {
    expect(normalizeWhatsAppNumber('6281234567890')).toBe('6281234567890');
    expect(normalizeWhatsAppNumber('+6281234567890')).toBe('6281234567890');
    expect(normalizeWhatsAppNumber('+62 812-3456-7890')).toBe('6281234567890');
  });

  it('menolak nomor lokal, huruf, dan panjang di luar rentang', () => {
    expect(normalizeWhatsAppNumber('081234567890')).toBeNull();
    expect(normalizeWhatsAppNumber('abc')).toBeNull();
    expect(normalizeWhatsAppNumber('1234567')).toBeNull();
    expect(normalizeWhatsAppNumber('6281234567890123456')).toBeNull();
  });
});

describe('buildWhatsAppUrl', () => {
  it('membuat URL wa.me dengan pesan yang ter-encode', () => {
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, produk());

    expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true);
    expect(url).toContain('%0A');
    expect(url).not.toContain(' ');
    expect(new URL(url).searchParams.get('text')).toBe(
      [
        'Halo Washly, saya ingin memesan:',
        'Produk: Deterjen Cair Sekar 1L',
        'Kategori: Bahan Cuci',
        'Harga: Rp 32.000',
        'Jumlah: 1',
        '',
        'Apakah stok masih tersedia?',
      ].join('\n'),
    );
  });

  it('menolak nomor tujuan yang tidak valid', () => {
    expect(() => buildWhatsAppUrl('0812', produk())).toThrow(/format internasional/);
  });

  it('menolak produk tanpa nama', () => {
    expect(() => buildWhatsAppUrl(WHATSAPP_NUMBER, { ...produk(), nama: '   ' })).toThrow(/Nama produk/);
  });

  it('meng-encode karakter khusus tanpa menyuntikkan HTML ke URL', () => {
    const url = buildWhatsAppUrl('+62 812-3456-7890', {
      ...produk(),
      nama: '<img src=x onerror=alert(1)>',
      kategori: 'Bahan & Cuci',
    });

    expect(url).not.toContain('<');
    expect(new URL(url).searchParams.get('text')).toContain('<img src=x onerror=alert(1)>');
  });
});
