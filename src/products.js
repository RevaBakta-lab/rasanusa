/**
 * Data contoh katalog Washly.
 *
 * Semua data fiktif dan nonpribadi. `imageUrl` menunjuk placeholder lokal yang
 * akan ditambahkan pada tahap katalog; sampai saat itu UI memakai monogram.
 * Jangan menambahkan API key, nomor pelanggan, atau data pribadi di sini.
 */
export const SEED_PRODUCTS = [
  {
    id: 'p-01',
    nama: 'Deterjen Cair Konsentrat 1L',
    kategori: 'Bahan Cuci',
    harga: 32000,
    stok: 24,
    deskripsi: 'Deterjen cair pekat untuk cucian harian, mudah dibilas.',
    imageUrl: 'assets/products/deterjen-cair.svg',
    unggulan: true,
  },
  {
    id: 'p-02',
    nama: 'Deterjen Bubuk 800g',
    kategori: 'Bahan Cuci',
    harga: 21000,
    stok: 40,
    deskripsi: 'Deterjen bubuk serbaguna untuk mesin cuci maupun cuci tangan.',
    imageUrl: 'assets/products/deterjen-bubuk.svg',
    unggulan: false,
  },
  {
    id: 'p-03',
    nama: 'Pelembut Pakaian 1L',
    kategori: 'Bahan Cuci',
    harga: 27000,
    stok: 18,
    deskripsi: 'Pelembut pakaian dengan wangi lembut dan tahan lama.',
    imageUrl: 'assets/products/pelembut.svg',
    unggulan: false,
  },
  {
    id: 'p-04',
    nama: 'Pewangi Laundry Lavender 1L',
    kategori: 'Pewangi',
    harga: 35000,
    stok: 15,
    deskripsi: 'Pewangi khusus laundry dengan aroma lavender segar.',
    imageUrl: 'assets/products/pewangi-lavender.svg',
    unggulan: true,
  },
  {
    id: 'p-05',
    nama: 'Parfum Laundry Sachet 10 pcs',
    kategori: 'Pewangi',
    harga: 18000,
    stok: 0,
    deskripsi: 'Parfum sachet praktis untuk memberi wangi pada pakaian.',
    imageUrl: 'assets/products/parfum-sachet.svg',
    unggulan: false,
  },
  {
    id: 'p-06',
    nama: 'Pemutih Pakaian 500ml',
    kategori: 'Bahan Cuci',
    harga: 15000,
    stok: 9,
    deskripsi: 'Pemutih pakaian untuk kain putih dan noda membandel.',
    imageUrl: 'assets/products/pemutih.svg',
    unggulan: false,
  },
  {
    id: 'p-07',
    nama: 'Plastik Kemasan 25x35 cm (50 pcs)',
    kategori: 'Perlengkapan',
    harga: 24000,
    stok: 12,
    deskripsi: 'Plastik kemasan transparan untuk membungkus pakaian bersih.',
    imageUrl: 'assets/products/plastik-kemasan.svg',
    unggulan: false,
  },
  {
    id: 'p-08',
    nama: 'Hanger Plastik (isi 12)',
    kategori: 'Perlengkapan',
    harga: 19000,
    stok: 6,
    deskripsi: 'Hanger plastik kuat untuk menggantung pakaian selesai dicuci.',
    imageUrl: 'assets/products/hanger.svg',
    unggulan: true,
  },
];

/** Daftar path gambar yang diizinkan untuk form produk pada tahap berikutnya. */
export const PRODUCT_IMAGE_PATHS = SEED_PRODUCTS.map((product) => product.imageUrl);
