/**
 * Konfigurasi publik Washly.
 *
 * Nomor ini adalah nomor demo fiktif dan sengaja disimpan sebagai konfigurasi
 * nonrahasia: tidak ada API key, token, atau secret di berkas ini. Ganti nilai
 * di bawah untuk latihan memakai nomor sendiri.
 */
export const WHATSAPP_NUMBER = '6281234567890';

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

function formatHarga(value) {
  const amount = Number(value);
  return `Rp ${rupiahFormatter.format(Number.isFinite(amount) ? amount : 0)}`;
}

/**
 * Menerima format internasional, dengan atau tanpa tanda `+`.
 * Contoh: `6281234567890`, `+6281234567890`, `+62 812-3456-7890`.
 * Mengembalikan digit saja (tanpa `+`) atau `null` bila tidak valid.
 */
export function normalizeWhatsAppNumber(nomor) {
  const cleaned = String(nomor ?? '')
    .trim()
    .replace(/[\s\-().]/g, '');

  if (!/^\+?[1-9]\d{7,14}$/.test(cleaned)) return null;

  return cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
}

/**
 * Membuat tautan wa.me untuk satu produk.
 *
 * Fungsi murni: tidak menyentuh DOM/localStorage dan tidak mengubah `produk`.
 * Pesan selalu dienkripsi dengan `encodeURIComponent`, jumlah tetap 1.
 *
 * @param {string} nomor nomor pemilik dalam format internasional
 * @param {object} produk produk yang dipesan
 * @returns {string} URL wa.me
 */
export function buildWhatsAppUrl(nomor, produk) {
  const phone = normalizeWhatsAppNumber(nomor);

  if (!phone) {
    throw new Error('Nomor WhatsApp harus format internasional, misalnya +6281234567890.');
  }

  if (!produk || typeof produk !== 'object') {
    throw new Error('Produk tidak valid.');
  }

  const nama = String(produk.nama ?? '').trim();
  if (!nama) {
    throw new Error('Nama produk wajib diisi.');
  }

  const kategori = String(produk.kategori ?? '').trim() || 'Umum';

  const pesan = [
    'Halo Washly, saya ingin memesan:',
    `Produk: ${nama}`,
    `Kategori: ${kategori}`,
    `Harga: ${formatHarga(produk.harga)}`,
    'Jumlah: 1',
    '',
    'Apakah stok masih tersedia?',
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(pesan)}`;
}
