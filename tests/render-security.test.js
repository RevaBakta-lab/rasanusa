import { describe, expect, it } from 'vitest';
import { WHATSAPP_NUMBER, buildWhatsAppUrl } from '../src/config.js';
import { renderProductCard, renderProductTable } from '../src/ui.js';

const maliciousProduct = () => ({
  id: 'p-<img src=x onerror=alert(1)>',
  nama: '<img src=x onerror=alert(1)>',
  kategori: 'Bahan Cuci',
  harga: 32000,
  stok: 3,
  deskripsi: '"><script>alert(1)</script>',
  imageUrl: 'assets/products/deterjen-cair-sekar.svg',
  unggulan: true,
});

describe('escaping renderer', () => {
  it('meng-escape nama dan deskripsi berbahaya pada kartu produk', () => {
    const html = renderProductCard(maliciousProduct());

    expect(html).not.toContain('<img src=x onerror');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('&lt;script&gt;');
  });

  it('meng-escape payload pada tabel dan atribut data-*', () => {
    const html = renderProductTable([maliciousProduct()]);

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('data-edit-id="p-<img');
    expect(html).toContain('data-edit-id="p-&lt;img');
  });

  it('membuat tautan WA ter-encode dengan rel noopener noreferrer', () => {
    const html = renderProductCard(maliciousProduct());
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, maliciousProduct());

    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('%3Cimg');
    expect(html).not.toContain('href="javascript:');
    expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true);
    expect(url).not.toContain('<');
  });
});
