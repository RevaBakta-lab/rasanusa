/**
 * Data contoh katalog Washly.
 *
 * Semua produk, merek, dan deskripsi di bawah ini fiktif dan nonpribadi.
 * Harga dalam Rupiah, stok berupa bilangan bulat, dan `imageUrl` menunjuk
 * ilustrasi SVG lokal buatan sendiri di `public/assets/products/`.
 * Jangan menambahkan data pribadi, API key, atau aset berhak cipta.
 */
export const SEED_PRODUCTS = [
  {
    id: 'p-01',
    nama: 'Deterjen Cair Sekar 1L',
    kategori: 'Bahan Cuci',
    harga: 32000,
    stok: 24,
    deskripsi: 'Deterjen cair pekat untuk cucian harian, mudah dibilas dan tidak meninggalkan sisa.',
    imageUrl: 'assets/products/deterjen-cair-sekar.svg',
    unggulan: true,
  },
  {
    id: 'p-02',
    nama: 'Pelembut Pakaian Sekar 1L',
    kategori: 'Bahan Cuci',
    harga: 27000,
    stok: 18,
    deskripsi: 'Pelembut pakaian wangi lembut agar serat kain tetap nyaman dipakai.',
    imageUrl: 'assets/products/pelembut-sekar.svg',
    unggulan: false,
  },
  {
    id: 'p-03',
    nama: 'Pewangi Lavender Sukma 1L',
    kategori: 'Pewangi',
    harga: 35000,
    stok: 15,
    deskripsi: 'Pewangi khusus laundry dengan aroma lavender segar dan tahan lama.',
    imageUrl: 'assets/products/pewangi-lavender-sukma.svg',
    unggulan: true,
  },
  {
    id: 'p-04',
    nama: 'Parfum Sachet Sukma 10 pcs',
    kategori: 'Pewangi',
    harga: 18000,
    stok: 0,
    deskripsi: 'Parfum sachet praktis untuk memberi wangi pada pakaian selesai dicuci.',
    imageUrl: 'assets/products/parfum-sachet-sukma.svg',
    unggulan: false,
  },
  {
    id: 'p-05',
    nama: 'Hanger Plastik Rapi isi 12',
    kategori: 'Perlengkapan',
    harga: 19000,
    stok: 6,
    deskripsi: 'Hanger plastik kuat untuk menjemur dan menggantung pakaian selesai dicuci.',
    imageUrl: 'assets/products/hanger-rapi.svg',
    unggulan: true,
  },
  {
    id: 'p-06',
    nama: 'Plastik Kemasan Bening 50 pcs',
    kategori: 'Perlengkapan',
    harga: 24000,
    stok: 12,
    deskripsi: 'Plastik kemasan transparan untuk membungkus pakaian bersih sebelum diserahkan.',
    imageUrl: 'assets/products/plastik-kemasan-bening.svg',
    unggulan: false,
  },
  {
    id: 'p-07',
    nama: 'Keranjang Laundry Lipat Rapi 40L',
    kategori: 'Peralatan',
    harga: 85000,
    stok: 8,
    deskripsi: 'Keranjang lipat ringan untuk memilah dan mengangkut cucian harian.',
    imageUrl: 'assets/products/keranjang-lipat.svg',
    unggulan: false,
  },
  {
    id: 'p-08',
    nama: 'Timbangan Gantung Rapi 25 kg',
    kategori: 'Peralatan',
    harga: 145000,
    stok: 4,
    deskripsi: 'Timbangan gantung digital untuk menakar cucian kiloan dengan mudah.',
    imageUrl: 'assets/products/timbangan-gantung.svg',
    unggulan: true,
  },
];

/** Empat kategori tetap yang dipakai di landing page. */
export const CATEGORIES = [
  {
    id: 'bahan-cuci',
    nama: 'Bahan Cuci',
    kode: 'BC',
    deskripsi: 'Deterjen dan pelembut',
  },
  {
    id: 'pewangi',
    nama: 'Pewangi',
    kode: 'PW',
    deskripsi: 'Pewangi dan parfum',
  },
  {
    id: 'perlengkapan',
    nama: 'Perlengkapan',
    kode: 'PK',
    deskripsi: 'Hanger dan kemasan',
  },
  {
    id: 'peralatan',
    nama: 'Peralatan',
    kode: 'PL',
    deskripsi: 'Alat bantu laundry',
  },
];

/** Daftar path gambar yang diizinkan untuk form produk pada tahap berikutnya. */
export const PRODUCT_IMAGE_PATHS = SEED_PRODUCTS.map((product) => product.imageUrl);

/** Opsi sorting yang tersedia di toolbar katalog. */
export const SORT_OPTIONS = [
  { id: 'nama-asc', label: 'Nama A–Z' },
  { id: 'harga-asc', label: 'Harga termurah' },
  { id: 'harga-desc', label: 'Harga termahal' },
];

const compareNama = (a, b) =>
  String(a.nama).localeCompare(String(b.nama), 'id', { sensitivity: 'base' }) ||
  String(a.id).localeCompare(String(b.id));

const SORT_COMPARATORS = {
  'nama-asc': compareNama,
  'harga-asc': (a, b) => Number(a.harga) - Number(b.harga) || compareNama(a, b),
  'harga-desc': (a, b) => Number(b.harga) - Number(a.harga) || compareNama(a, b),
};

/**
 * Fungsi murni untuk mencari, memfilter, dan mengurutkan produk.
 *
 * - Tidak menyentuh DOM, localStorage, atau state global.
 * - Tidak mengubah array/objek yang diterima; selalu mengembalikan array baru.
 * - Pencarian case-insensitive pada nama, kategori, dan deskripsi.
 * - Filter kategori dan pencarian digabung dengan AND, lalu diurutkan.
 *
 * @param {Array} products daftar produk sumber
 * @param {object} options `{ query, kategori, sort }`
 * @returns {Array} produk yang lolos filter dalam urutan baru
 */
export function filterProducts(products, options = {}) {
  const { query = '', kategori = 'semua', sort = 'nama-asc' } = options;
  const keyword = String(query ?? '')
    .trim()
    .toLocaleLowerCase('id-ID');
  const selectedCategory = String(kategori ?? '').trim();
  const source = Array.isArray(products) ? products : [];

  const filtered = source.filter((product) => {
    if (!product) return false;

    if (selectedCategory && selectedCategory !== 'semua' && product.kategori !== selectedCategory) {
      return false;
    }

    if (!keyword) return true;

    return [product.nama, product.kategori, product.deskripsi].some((field) =>
      String(field ?? '')
        .toLocaleLowerCase('id-ID')
        .includes(keyword),
    );
  });

  const comparator = SORT_COMPARATORS[sort] ?? SORT_COMPARATORS['nama-asc'];
  return [...filtered].sort(comparator);
}
