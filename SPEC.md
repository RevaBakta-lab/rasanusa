# SPEC — Washly

**Katalog produk laundry berbasis web (latihan 1 hari)**

| Item | Keterangan |
|---|---|
| Versi dokumen | 1.0 (draft untuk direview) |
| Tanggal | 19 November 2026 |
| Status | Siap diimplementasikan |
| Stack | Vite + JavaScript vanilla (ES modules) |
| Backend | Tidak ada |
| Target rilis | MVP latihan, 1 hari kerja |

> Dokumen ini adalah spesifikasi. Belum ada kode aplikasi di dalamnya; potongan JSON/format pesan di bawah hanya artefak spesifikasi.

---

## 1. Tujuan

Membangun **Washly**, katalog produk laundry satu halaman yang bisa dipakai dua peran pada **satu perangkat dan satu browser**:

1. **Calon pembeli** melihat produk, mencari, memfilter, mengurutkan, lalu menghubungi pengelola lewat tombol WhatsApp.
2. **Pengelola laundry** mengelola katalog lewat dashboard demo: tambah, ubah, hapus produk, dan melihat ringkasan total produk/stok.

Tujuan pembelajaran (latihan 1 hari):

- Melatih alur kerja end-to-end: spesifikasi → implementasi → verifikasi manual.
- Melatih CRUD di sisi klien dengan penyimpanan `localStorage`.
- Melatih rendering data, validasi form, dan penanganan empty/error state tanpa framework.
- Menegaskan batas produk: **tanpa backend, tanpa login, tanpa data pribadi**.

**Definisi sukses MVP:** seluruh acceptance criteria di Bagian 9 lulus secara manual di Chrome/Edge terbaru, data bertahan setelah reload, dan tidak ada error di console.

---

## 2. Pengguna dan Peran

| Peran | Deskripsi | Cara mengakses | Kebutuhan utama |
|---|---|---|---|
| Calon pembeli | Pengunjung yang ingin melihat produk dan memesan via WhatsApp | Tab **Katalog** (`#/katalog`) | Cari cepat, informasi harga/stok jelas, CTA pesan |
| Pengelola laundry | Pemilik/staf yang mendemokan pengelolaan katalog | Tab **Dashboard** (`#/dashboard`) | CRUD cepat, validasi jelas, ringkasan stok |

**Aturan peran (penting):**

- Tidak ada autentikasi, registrasi, atau "login palsu". Perpindahan peran hanya lewat navigasi tab.
- Dashboard adalah **demo pengelolaan**, bukan panel produksi. Tidak ada hak akses berbeda; keduanya memakai data yang sama di perangkat yang sama.
- Satu perangkat = satu sumber data. Tidak ada sinkronisasi antar perangkat/pengguna.

---

## 3. Ruang Lingkup dan Asumsi

### 3.1 Asumsi

1. Aplikasi dijalankan lokal (`npm run dev`) atau sebagai build statis (`npm run build` + `npm run preview`).
2. Produk contoh adalah barang habis pakai laundry (deterjen, pewangi, perlengkapan) — **bukan** data pribadi pelanggan.
3. Nomor WhatsApp adalah **nomor demo fiktif** yang dapat diganti di satu tempat (`src/config.js`).
4. Browser modern: 2 versi terakhir Chrome, Edge, Firefox, Safari; viewport minimum 360 px.
5. Review dilakukan manual mengikuti Bagian 9; tidak ada automated test sebagai syarat MVP.
6. Bahasa antarmuka: Indonesia. Mata uang: Rupiah tanpa desimal.

### 3.2 Prinsip produk

- **Satu halaman, dua tab.** Navigasi memakai hash (`#/katalog`, `#/dashboard`) agar state dapat dibuka ulang dan diperiksa manual.
- **Data lokal adalah sumber kebenaran.** Semua perubahan langsung tersimpan di `localStorage`; tidak ada server.
- **Jujur soal batasan.** Tidak ada tombol/checkout palsu, tidak ada "login", tidak ada klaim pembayaran online.
- **Ketergantungan minimal.** Hanya `vite` sebagai devDependency. Tanpa UI framework, tanpa library state, tanpa CDN.

---

## 4. Daftar Fitur (MVP)

Legenda prioritas: **M** = wajib (harus selesai hari ini), **S** = sebaiknya (bila waktu tersisa).

| ID | Fitur | Prioritas | Ringkasan |
|---|---|---|---|
| F-01 | Katalog 8 produk contoh | M | Data awal di-seed otomatis saat pertama dibuka |
| F-02 | Foto/placeholder lokal | M | 8 gambar SVG lokal di `public/assets/products/`, tanpa request jaringan eksternal |
| F-03 | Kartu produk | M | Menampilkan nama, kategori, harga Rupiah, stok, badge unggulan, deskripsi singkat |
| F-04 | Pencarian | M | Cari pada nama, kategori, dan deskripsi; tidak peka huruf besar/kecil |
| F-05 | Filter | M | Filter kategori, ketersediaan stok, dan produk unggulan; bisa dikombinasikan |
| F-06 | Sorting | M | Nama A–Z, harga termurah/termahal, stok terbanyak, produk unggulan lebih dulu |
| F-07 | Tombol pesan WhatsApp | M | Membuka `wa.me` dengan pesan terisi otomatis; nonaktif saat stok 0 |
| F-08 | Dashboard CRUD | M | Tambah, ubah, hapus produk dengan validasi dan konfirmasi hapus |
| F-09 | Ringkasan katalog | M | Total produk, total stok, jumlah unggulan, jumlah produk habis |
| F-10 | Penyimpanan `localStorage` | M | Persistensi otomatis, pemulihan saat reload, reset ke data contoh |
| F-11 | Toast notifikasi | S | Umpan balik singkat untuk simpan/hapus/reset/error penyimpanan |
| F-12 | Sinkronisasi antar-tab | S | Perubahan di satu tab browser tercermin di tab lain lewat event `storage` |

### 4.1 Detail perilaku per fitur

**F-01/F-02 — Data dan gambar awal**

- Saat `localStorage` kosong, aplikasi menulis 8 produk contoh (Bagian 5.2) lalu menampilkannya.
- Setiap produk memakai `imageUrl` lokal, mis. `assets/products/deterjen-cair.svg`. Tidak boleh ada URL `http(s)` pada data contoh.
- Jika gambar gagal dimuat, tampilkan placeholder abu-abu dengan inisial nama produk (bukan ikon rusak). Tidak ada permintaan ke jaringan luar.
- Placeholder dibuat konsisten: latar warna per kategori, inisial/ikon sederhana, teks nama produk.

**F-03 — Kartu produk**

- Urutan elemen: gambar → badge "Unggulan" (jika ada) → nama → kategori → harga → stok → deskripsi (maks. 2 baris dengan ellipsis) → tombol WhatsApp.
- Harga: `Rp 32.000` (titik ribuan, tanpa desimal, tanpa spasi setelah "Rp" selain satu spasi).
- Stok: `Stok: 24` untuk > 10, `Stok tersisa 6` untuk 1–10, dan badge merah **Stok habis** untuk 0.
- Kartu dengan stok 0 tetap tampil (tidak disembunyikan) dan tombol pesan nonaktif.

**F-04 — Pencarian**

- Input teks dengan tombol bersihkan (×). Pencarian dijalankan saat mengetik (tanpa tombol submit), spasi di awal/akhir diabaikan.
- Cocok bila kata kunci (case-insensitive) adalah substring dari `nama`, `kategori`, atau `deskripsi`.
- Kata kunci kosong = tidak memfilter.
- Bila hasil kosong, tampilkan empty state: "Tidak ada produk yang cocok" + tombol **Reset filter**.

**F-05 — Filter**

- **Kategori:** `Semua` + daftar kategori unik dari data (urut abjad). Default `Semua`.
- **Ketersediaan:** `Semua`, `Tersedia` (stok > 0), `Habis` (stok = 0). Default `Semua`.
- **Unggulan saja:** checkbox. Default tidak dicentang.
- Semua filter digabung dengan logika **AND**. Filter tidak mengubah data, hanya tampilan.
- Jumlah hasil ditampilkan: "Menampilkan X dari Y produk".
- Tombol **Reset** mengosongkan kata kunci dan mengembalikan semua filter ke default (sorting tidak direset).

**F-06 — Sorting**

| Nilai | Label UI | Aturan |
|---|---|---|
| `nama-asc` | Nama A–Z | `localeCompare('id')`, default |
| `harga-asc` | Harga terendah | Naik |
| `harga-desc` | Harga tertinggi | Turun |
| `stok-desc` | Stok terbanyak | Turun |
| `unggulan` | Unggulan dulu | `unggulan` true lebih dulu, lalu nama A–Z |

- Tie-breaker selalu `nama` A–Z, lalu `id`, agar urutan deterministik dan dapat diperiksa manual.
- Sorting diterapkan setelah filter; mengubah sorting tidak mereset filter.

**F-07 — WhatsApp**

- Tombol membuka `https://wa.me/<nomor>?text=<pesan>` di tab baru (`target="_blank"`, `rel="noopener noreferrer"`).
- Nomor diambil dari konstanta `WHATSAPP_NUMBER` di `src/config.js` (format internasional tanpa `+`, hanya digit; nilai demo `6281234567890`).
- Pesan (UTF-8, `encodeURIComponent`):

  ```text
  Halo Washly, saya ingin memesan:
  Produk: {nama}
  Kategori: {kategori}
  Harga: Rp {harga}
  Jumlah: 1

  Apakah stok masih tersedia?
  ```

- Bila stok 0: tombol berlabel **Stok habis**, `disabled`, dan tidak dapat membuka WhatsApp.
- Tidak ada keranjang, jumlah kustom, atau checkout. Satu klik = satu produk, jumlah 1.

**F-08 — Dashboard CRUD**

- Tabel/daftar produk dengan kolom: Nama, Kategori, Harga, Stok, Unggulan, Aksi (Ubah, Hapus).
- **Tambah:** tombol **+ Tambah Produk** membuka form (dialog/modal atau panel). Setelah simpan, produk muncul di katalog dan tabel.
- **Ubah:** form terisi data lama; `id` tidak berubah.
- **Hapus:** wajib konfirmasi (`window.confirm` cukup) dengan nama produk pada pesan. Setelah hapus, ringkasan dan katalog ikut berubah.
- Form memakai validasi Bagian 5.3. Pesan error ditampilkan di dekat field terkait dan fokus berpindah ke field pertama yang tidak valid.
- Tombol **Batal** atau tombol `Esc` menutup form tanpa menyimpan perubahan.
- Tombol **Reset ke data contoh** meminta konfirmasi, lalu mengembalikan 8 produk seed.
- Tidak ada upload file; `imageUrl` dipilih dari 8 placeholder lokal yang tersedia (dropdown) sehingga path selalu aman.

**F-09 — Ringkasan**

Empat kartu di atas tabel dashboard, dihitung ulang setiap kali data berubah:

| Kartu | Perhitungan |
|---|---|
| Total Produk | `products.length` |
| Total Stok | jumlah semua `stok` |
| Produk Unggulan | jumlah `unggulan === true` |
| Stok Habis | jumlah `stok === 0` |

Nilai awal dengan data seed: **8 / 124 / 3 / 1**.

**F-10 — Penyimpanan**

- Kunci: `washly:products:v1`. Nilai: JSON `{ "version": 1, "products": [...] }` (lihat 5.4).
- Setiap operasi tambah/ubah/hapus/reset langsung menulis ke `localStorage` (sinkron, tanpa tombol "Simpan ke perangkat").
- Jika data tidak ada → seed. Jika JSON rusak/versi tidak dikenal → seed ulang + toast "Data lokal tidak valid, katalog dikembalikan ke data contoh".
- Jika `localStorage` gagal (quota/private mode), tampilkan toast error dan pertahankan data di memori selama sesi; jelaskan bahwa perubahan tidak akan bertahan setelah reload.
- Tidak menyimpan data sensitif apa pun (tanpa API key, token, nomor pelanggan, atau data pribadi).

**F-11 — Toast (S)**

- Muncul 3 detik di pojok, `role="status"`, `aria-live="polite"`.
- Varian: sukses (simpan/hapus/reset), info (data direset otomatis), error (penyimpanan gagal).

**F-12 — Sinkronisasi antar-tab (S)**

- Mendengarkan event `storage` untuk kunci `washly:products:v1`, lalu merender ulang katalog, dashboard, dan ringkasan.
- Tidak wajib untuk lulus MVP; jika diimplementasikan, tidak boleh menyebabkan loop penulisan.

---

## 5. Model Data

### 5.1 Entitas `Product`

| Field | Tipe | Wajib | Aturan validasi | Contoh |
|---|---|---|---|---|
| `id` | string | ya | Unik, tidak diubah saat edit. Format `p-` + slug/nomor, atau `crypto.randomUUID()` | `p-01` |
| `nama` | string | ya | Di-trim; 3–60 karakter; tidak boleh hanya spasi | `Deterjen Cair Konsentrat 1L` |
| `kategori` | string | ya | Di-trim; 2–30 karakter; dipilih dari kategori yang ada atau diketik baru | `Bahan Cuci` |
| `harga` | number | ya | Bilangan bulat Rupiah, `>= 0`; tanpa desimal; tanpa pemisah ribuan di data | `32000` |
| `stok` | number | ya | Bilangan bulat, `>= 0`; tanpa desimal | `24` |
| `deskripsi` | string | tidak | Di-trim; maks. 240 karakter; boleh kosong | `Cairan pekat untuk cucian harian.` |
| `imageUrl` | string | ya | Harus salah satu path lokal `assets/products/*.svg` yang terdaftar | `assets/products/deterjen-cair.svg` |
| `unggulan` | boolean | ya | `true` / `false`; default `false` | `true` |

Catatan:

- `harga` dan `stok` disimpan sebagai **number**, bukan string. Format Rupiah hanya untuk tampilan.
- Input form berupa teks/angka; konversi dilakukan sebelum validasi (`Number(...)`, tolak `NaN`, `Infinity`, desimal, dan nilai negatif).
- Tidak ada field tambahan di luar model (mis. `createdAt` boleh ditambahkan sebagai metadata internal tetapi tidak ditampilkan dan tidak diwajibkan).

### 5.2 Data contoh (seed, 8 produk)

Semua data fiktif dan nonpribadi. Total stok = 124; unggulan = 3; stok habis = 1.

| id | nama | kategori | harga | stok | unggulan | imageUrl |
|---|---|---|---|---|---|---|
| p-01 | Deterjen Cair Konsentrat 1L | Bahan Cuci | 32000 | 24 | true | `assets/products/deterjen-cair.svg` |
| p-02 | Deterjen Bubuk 800g | Bahan Cuci | 21000 | 40 | false | `assets/products/deterjen-bubuk.svg` |
| p-03 | Pelembut Pakaian 1L | Bahan Cuci | 27000 | 18 | false | `assets/products/pelembut.svg` |
| p-04 | Pewangi Laundry Lavender 1L | Pewangi | 35000 | 15 | true | `assets/products/pewangi-lavender.svg` |
| p-05 | Parfum Laundry Sachet 10 pcs | Pewangi | 18000 | 0 | false | `assets/products/parfum-sachet.svg` |
| p-06 | Pemutih Pakaian 500ml | Bahan Cuci | 15000 | 9 | false | `assets/products/pemutih.svg` |
| p-07 | Plastik Kemasan 25x35 cm (50 pcs) | Perlengkapan | 24000 | 12 | false | `assets/products/plastik-kemasan.svg` |
| p-08 | Hanger Plastik (isi 12) | Perlengkapan | 19000 | 6 | true | `assets/products/hanger.svg` |

Deskripsi seed (masing-masing 1 kalimat, ≤ 240 karakter) diambil dari daftar berikut agar konsisten:

1. p-01: "Deterjen cair pekat untuk cucian harian, mudah dibilas."
2. p-02: "Deterjen bubuk serbaguna untuk mesin cuci maupun cuci tangan."
3. p-03: "Pelembut pakaian dengan wangi lembut dan tahan lama."
4. p-04: "Pewangi khusus laundry dengan aroma lavender segar."
5. p-05: "Parfum sachet praktis untuk memberi wangi pada pakaian."
6. p-06: "Pemutih pakaian untuk kain putih dan noda membandel."
7. p-07: "Plastik kemasan transparan untuk membungkus pakaian bersih."
8. p-08: "Hanger plastik kuat untuk menggantung pakaian selesai dicuci."

### 5.3 Aturan validasi form

| Field | Aturan | Pesan error (contoh) |
|---|---|---|
| Nama | Wajib; 3–60 karakter setelah trim | "Nama produk wajib diisi (3–60 karakter)." |
| Kategori | Wajib; 2–30 karakter setelah trim | "Kategori wajib diisi (2–30 karakter)." |
| Harga | Wajib; angka bulat; `>= 0` | "Harga harus berupa angka bulat minimal 0." |
| Stok | Wajib; angka bulat; `>= 0` | "Stok harus berupa angka bulat minimal 0." |
| Deskripsi | Opsional; maks. 240 karakter | "Deskripsi maksimal 240 karakter." |
| Gambar | Wajib; salah satu placeholder terdaftar | "Pilih gambar produk." |

Perilaku tambahan:

- Validasi dijalankan saat submit, bukan saat mengetik; setelah submit pertama, error diperbarui saat field diubah.
- Nilai tidak valid **tidak** disimpan; form tetap terbuka dan data lama (mode ubah) tidak berubah.
- Karakter `<`, `>`, `&`, kutip, dan karakter non-ASCII harus tampil sebagai teks biasa (di-escape saat rendering) — tidak boleh dieksekusi sebagai HTML/JS.
- Harga `0` dan stok `0` adalah nilai **valid**; string kosong tidak valid.

### 5.4 Skema penyimpanan

```json
{
  "version": 1,
  "products": [
    {
      "id": "p-01",
      "nama": "Deterjen Cair Konsentrat 1L",
      "kategori": "Bahan Cuci",
      "harga": 32000,
      "stok": 24,
      "deskripsi": "Deterjen cair pekat untuk cucian harian, mudah dibilas.",
      "imageUrl": "assets/products/deterjen-cair.svg",
      "unggulan": true
    }
  ]
}
```

- Kunci: `washly:products:v1`.
- Saat memuat: validasi bentuk minimal (array `products`, setiap item punya `id` unik dan field wajib bertipe benar). Item tidak valid diabaikan; bila tidak ada item valid, seed ulang.
- Migrasi versi: jika `version !== 1` atau tidak dikenal, seed ulang dan beri tahu pengguna (MVP tidak menyediakan migrasi).

### 5.5 Struktur folder yang diusulkan

```text
washly/
├─ index.html
├─ package.json
├─ vite.config.js
├─ public/
│  └─ assets/products/        # 8 placeholder SVG lokal
├─ src/
│  ├─ main.js                 # bootstrap, routing hash, event global
│  ├─ config.js               # WHATSAPP_NUMBER, storage key, konstanta
│  ├─ store.js                # load/save/seed/CRUD + validasi data
│  ├─ catalog.js              # render kartu, pencarian, filter, sorting
│  ├─ dashboard.js            # tabel, form CRUD, ringkasan, reset
│  ├─ ui.js                   # format Rupiah, escape HTML, toast, empty state
│  └─ styles.css
└─ SPEC.md
```

---

## 6. Nonfunctional Requirements

### 6.1 Performa

| ID | Requirement | Cara verifikasi |
|---|---|---|
| NFR-P1 | Halaman katalog tampil < 2 detik pada `npm run preview` di perangkat latihan | Ukur dengan DevTools → Network, muat ulang |
| NFR-P2 | Tidak ada request jaringan eksternal selain dokumentasi/pengembangan | Network tab: semua aset berasal dari origin lokal |
| NFR-P3 | Bundle JS produksi < 100 KB (gzip), total aset gambar < 300 KB | Lihat output `npm run build` |
| NFR-P4 | Pencarian/filter/sorting terasa instan (< 100 ms untuk 8–200 produk) | Uji ketik cepat, tidak ada lag terlihat |

### 6.2 Keamanan dan privasi

| ID | Requirement |
|---|---|
| NFR-S1 | Tidak ada API key, token, kredensial, atau secret di repo, kode, maupun `localStorage` |
| NFR-S2 | Tidak ada backend, panggilan API, atau pengiriman data ke pihak ketiga; satu-satunya tautan keluar adalah `wa.me` saat pengguna menekan tombol |
| NFR-S3 | Semua teks yang berasal dari input pengguna di-escape sebelum masuk ke DOM (hindari `innerHTML` dengan string mentah) |
| NFR-S4 | `imageUrl` dibatasi ke daftar path lokal; tidak menerima URL eksternal, `javascript:`, atau path keluar folder |
| NFR-S5 | Tidak ada login palsu, form kredensial, atau klaim keamanan yang menyesatkan |
| NFR-S6 | Data contoh nonpribadi: tanpa nama orang, nomor telepon pelanggan, alamat, atau email nyata |
| NFR-S7 | Tidak ada perintah berbahaya (hapus massal, `sudo`, instalasi global) dalam skrip proyek |

### 6.3 Aksesibilitas

| ID | Requirement |
|---|---|
| NFR-A1 | Semua input punya `<label>` atau `aria-label`; error terhubung ke field via `aria-describedby` |
| NFR-A2 | Navigasi keyboard penuh: tab ke semua kontrol, fokus terlihat, modal form mengembalikan fokus ke tombol pemicu |
| NFR-A3 | Kontras teks minimal 4.5:1 (teks normal) pada latar terang/gelap yang dipakai |
| NFR-A4 | Tombol nonaktif memakai atribut `disabled`, bukan hanya warna pudar |
| NFR-A5 | Gambar punya `alt` deskriptif; gambar dekoratif memakai `alt=""` |
| NFR-A6 | Toast memakai `role="status"`/`aria-live="polite"`; tidak mencuri fokus |

### 6.4 Responsif dan kompatibilitas

| ID | Requirement |
|---|---|
| NFR-R1 | Layout berfungsi pada lebar 360 px, 768 px, dan 1280 px tanpa scroll horizontal |
| NFR-R2 | Katalog: 1 kolom (< 640 px), 2 kolom (640–1023 px), 3–4 kolom (≥ 1024 px) |
| NFR-R3 | Tabel dashboard dapat di-scroll horizontal atau berubah menjadi kartu pada layar kecil; tombol aksi tetap dapat dijangkau |
| NFR-R4 | Berjalan di 2 versi terakhir Chrome, Edge, Firefox, Safari (desktop) |

### 6.5 Kualitas dan pemeliharaan

| ID | Requirement |
|---|---|
| NFR-Q1 | JavaScript vanilla ES modules; tanpa framework UI/state; tanpa CDN |
| NFR-Q2 | Satu sumber konstanta (`config.js`) untuk nomor WhatsApp, kunci storage, dan path gambar |
| NFR-Q3 | Fungsi format Rupiah, escape, validasi, dan filter bersifat murni (mudah diuji manual dari console) |
| NFR-Q4 | Tidak ada error/warning di console selama alur utama (katalog, CRUD, reload) |
| NFR-Q5 | Kode diberi komentar singkat pada bagian non-obvious (mis. validasi data localStorage) |
| NFR-Q6 | `npm run dev`, `npm run build`, `npm run preview` berhasil tanpa perubahan konfigurasi tambahan |

### 6.6 Batasan operasional latihan

- Total waktu implementasi ± 1 hari kerja (8 jam efektif) — lihat Bagian 10.
- Tidak menambah dependensi runtime di luar Vite.
- Tidak mengejar fitur di luar Bagian 4 dan Bagian 8.

---

## 7. Risiko dan Mitigasi

| # | Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|---|
| R-01 | `localStorage` dibersihkan/private mode → data hilang | Sedang | Sedang | Seed otomatis saat kosong; toast jelas; tombol reset; dokumentasi batasan di UI |
| R-02 | JSON lokal rusak (edit manual/versi lama) | Sedang | Rendah | Validasi saat load, fallback seed, jangan crash |
| R-03 | Nomor WhatsApp demo dipakai sungguhan | Tinggi (privasi) | Rendah | Nomor fiktif jelas, satu konstanta, peringatan di `config.js` dan README; tidak ada nomor nyata di seed |
| R-04 | XSS lewat nama/deskripsi produk | Tinggi | Rendah | Escape semua teks; larang `innerHTML` dengan data mentah; uji dengan `<img onerror>` |
| R-05 | Scope creep (login, cart, pembayaran, backend) | Tinggi (waktu) | Tinggi | Out-of-scope eksplisit; review di akhir tiap iterasi |
| R-06 | Waktu 1 hari tidak cukup | Sedang | Sedang | Prioritas M/S; F-11/F-12 boleh dipotong; timebox per iterasi |
| R-07 | Placeholder SVG tidak konsisten/rusak | Rendah | Sedang | Template SVG tunggal + warna per kategori; fallback inisial saat `error` |
| R-08 | Sorting/filter tidak deterministik → sulit diverifikasi | Rendah | Sedang | Tie-breaker `nama` lalu `id`; data seed tetap |
| R-09 | Quota `localStorage` penuh | Rendah | Rendah | Tangkap error, tampilkan toast, lanjut di memori |
| R-10 | Dua tab menimpa data satu sama lain | Rendah | Rendah | Last-write-wins; F-12 hanya menyegarkan tampilan, bukan merge |
| R-11 | Perbedaan format `id-ID` antar browser | Rendah | Rendah | `Intl.NumberFormat('id-ID')` dengan fallback manual `Rp ` + titik ribuan |
| R-12 | Dashboard dianggap panel produksi | Sedang (ekspektasi) | Sedang | Label "Dashboard demo", tanpa auth, catatan batasan di UI |

---

## 8. Out of Scope (tidak dikerjakan)

1. Backend, database, API, serverless function, atau sinkronisasi cloud.
2. Login, registrasi, peran/hak akses, sesi, "login palsu", atau halaman admin terproteksi.
3. Keranjang, checkout, pembayaran online, ongkir, kupon, atau riwayat pesanan.
4. Reservasi/pengurangan stok otomatis saat pesan WhatsApp diklik.
5. Upload foto, kamera, kompresi gambar, atau penyimpanan gambar di cloud.
6. Multi-pengguna, multi-cabang, atau sinkronisasi real-time antar perangkat.
7. Notifikasi email/push, integrasi WhatsApp API resmi, atau chatbot.
8. Pencetakan invoice, laporan penjualan, grafik analitik, ekspor/impor CSV.
9. PWA/installable app, service worker, mode offline penuh.
10. Dark mode, multi-bahasa, tema kustom.
11. Automated test (unit/E2E) dan pipeline CI/CD sebagai syarat rilis.
12. Deployment produksi dan domain kustom.
13. Optimasi SEO tingkat lanjut (sitemap, SSR, structured data).

---

## 9. Acceptance Criteria (verifikasi manual)

**Persiapan:** jalankan `npm run dev` (atau `npm run build` + `npm run preview`), buka aplikasi, lalu buka DevTools → Application → Local Storage dan Console. Untuk uji "pertama kali", hapus kunci `washly:products:v1` lalu reload.

Format: setiap AC berisi prasyarat, langkah, dan hasil yang diharapkan. AC dinyatakan **LULUS** hanya jika seluruh hasil sesuai.

### 9.1 Katalog dan data awal

**AC-01 — Seed otomatis saat pertama dibuka**
- **Prasyarat:** `washly:products:v1` tidak ada.
- **Langkah:** buka `#/katalog`.
- **Hasil:**
  1. Tepat **8 kartu produk** tampil.
  2. Nama, kategori, harga, dan stok sesuai tabel 5.2.
  3. Kunci `washly:products:v1` muncul di Local Storage dengan `version: 1` dan 8 item.
  4. Tidak ada error di Console.

**AC-02 — Persistensi setelah reload**
- **Prasyarat:** AC-01 lulus.
- **Langkah:** ubah satu produk (mis. stok p-02 menjadi `99`), lalu reload halaman.
- **Hasil:** nilai `99` tetap tampil di katalog dan dashboard; tidak kembali ke data seed.

**AC-03 — Placeholder lokal**
- **Langkah:** buka DevTools → Network, filter `Img`, reload katalog.
- **Hasil:**
  1. Delapan gambar dimuat dari origin lokal (`assets/products/*.svg`).
  2. Tidak ada request ke domain eksternal.
  3. Setiap gambar punya `alt` yang menyebut nama produk.

**AC-04 — Gambar gagal dimuat**
- **Langkah:** di DevTools, blokir/rename sementara satu file SVG lalu reload.
- **Hasil:** kartu tetap tampil dengan placeholder inisial, bukan ikon rusak; layout tidak berantakan; tidak ada error tak tertangani.

**AC-05 — Format Rupiah dan indikator stok**
- **Langkah:** periksa kartu p-01, p-08, dan p-05.
- **Hasil:**
  1. p-01 menampilkan `Rp 32.000` (tanpa `,00`).
  2. p-08 (stok 6) menampilkan penanda stok menipis.
  3. p-05 (stok 0) menampilkan badge **Stok habis** dan tombol pesan nonaktif.

### 9.2 Pencarian, filter, sorting

**AC-06 — Pencarian nama**
- **Langkah:** ketik `deterjen` pada kolom cari.
- **Hasil:** hanya p-01 dan p-02 tampil; teks "Menampilkan 2 dari 8 produk"; pencarian tidak peka huruf besar/kecil (`DETERJEN` memberi hasil sama).

**AC-07 — Pencarian kategori/deskripsi**
- **Langkah:** cari `lavender`, lalu `perlengkapan`.
- **Hasil:** `lavender` menemukan p-04 (nama/deskripsi); `perlengkapan` menemukan p-07 dan p-08 (kategori).

**AC-08 — Empty state pencarian**
- **Langkah:** ketik `xyz123`.
- **Hasil:** tidak ada kartu; muncul pesan "Tidak ada produk yang cocok" dan tombol **Reset filter**; klik tombol mengembalikan 8 produk.

**AC-09 — Filter kategori**
- **Langkah:** pilih kategori `Pewangi`.
- **Hasil:** hanya p-04 dan p-05 tampil; opsi kategori berisi `Semua`, `Bahan Cuci`, `Pewangi`, `Perlengkapan` (urut abjad, tanpa duplikat).

**AC-10 — Filter ketersediaan**
- **Langkah:** pilih `Habis`, lalu `Tersedia`.
- **Hasil:** `Habis` hanya menampilkan p-05 (1 produk); `Tersedia` menampilkan 7 produk lainnya.

**AC-11 — Filter unggulan dan kombinasi**
- **Langkah:** centang **Unggulan saja**, lalu tambahkan kategori `Perlengkapan`.
- **Hasil:** hanya p-08 tampil; jumlah hasil "Menampilkan 1 dari 8 produk"; menghapus centang mengembalikan p-07 dan p-08.

**AC-12 — Sorting**
- **Langkah:** pada kondisi tanpa filter, pilih tiap opsi sorting.
- **Hasil:**
  1. `Harga terendah`: p-06 (15.000) pertama, p-04 (35.000) terakhir.
  2. `Harga tertinggi`: kebalikannya.
  3. `Stok terbanyak`: p-02 (40) pertama, p-05 (0) terakhir.
  4. `Nama A–Z`: Deterjen Bubuk, Deterjen Cair, Hanger Plastik, Parfum Laundry, Pelembut Pakaian, Pemutih Pakaian, Pewangi Lavender, Plastik Kemasan.
  5. `Unggulan dulu`: p-01, p-04, p-08 di depan, lalu sisanya A–Z.

**AC-13 — Sorting + filter + pencarian bersamaan**
- **Langkah:** kategori `Bahan Cuci` + cari `1L` + sort `Harga terendah`.
- **Hasil:** hanya p-03 (Pelembut 1L) dan p-01 (Deterjen Cair 1L) tampil, urut p-03 (27.000) lalu p-01 (32.000); jumlah hasil "Menampilkan 2 dari 8 produk"; tidak ada error.

### 9.3 WhatsApp

**AC-14 — Tautan WhatsApp valid**
- **Langkah:** klik tombol pesan pada p-01 (boleh dibatalkan setelah tab terbuka).
- **Hasil:**
  1. Tab baru membuka `https://wa.me/6281234567890?text=...`.
  2. Pesan berisi nama, kategori, harga `Rp 32.000`, dan `Jumlah: 1`.
  3. Spasi/baris baru ter-encode benar (tidak ada karakter rusak).

**AC-15 — Produk habis tidak bisa dipesan**
- **Langkah:** periksa p-05; coba klik/aktifkan tombolnya.
- **Hasil:** tombol berlabel **Stok habis**, `disabled`, tidak membuka tab baru, dan tidak dapat difokus/klik.

### 9.4 Dashboard CRUD dan ringkasan

**AC-16 — Ringkasan awal**
- **Langkah:** buka `#/dashboard` dengan data seed.
- **Hasil:** kartu menunjukkan **8** total produk, **124** total stok, **3** unggulan, **1** stok habis.

**AC-17 — Tambah produk valid**
- **Langkah:** klik **+ Tambah Produk**, isi: nama `Sabun Cuci Batang`, kategori `Bahan Cuci`, harga `8000`, stok `30`, deskripsi `Sabun batang untuk noda ringan.`, gambar `Pemutih Pakaian`, unggulan tidak dicentang; simpan.
- **Hasil:**
  1. Form tertutup dan toast sukses muncul.
  2. Produk baru tampil di tabel dashboard dan katalog (9 produk).
  3. Ringkasan berubah menjadi **9 / 154 / 3 / 1**.
  4. Data bertahan setelah reload.

**AC-18 — Validasi form**
- **Langkah:** buka form tambah, lalu submit dengan: nama kosong, harga `-5`, stok `2.5`, lalu harga `abc`.
- **Hasil:** form tidak tersimpan; pesan error spesifik muncul di field terkait; fokus berpindah ke field tidak valid pertama; data lama tidak berubah.

**AC-19 — Ubah produk**
- **Langkah:** ubah p-02: nama menjadi `Deterjen Bubuk 1kg`, harga `25000`, stok `0`, centang unggulan; simpan.
- **Hasil:** perubahan tampil di tabel dan katalog; `id` tetap `p-02`; ringkasan menjadi total stok `84`, unggulan `4`, stok habis `2`; p-02 di katalog menampilkan **Stok habis** dan tombol pesan nonaktif.

**AC-20 — Batal mengubah**
- **Langkah:** buka form ubah p-01, ubah nama menjadi `XXX`, klik **Batal**.
- **Hasil:** form tertutup; nama p-01 tetap `Deterjen Cair Konsentrat 1L`; tidak ada perubahan di `localStorage`.

**AC-21 — Hapus produk**
- **Langkah:** klik **Hapus** pada p-07, lalu batalkan konfirmasi; ulangi dan setujui.
- **Hasil:**
  1. Saat dibatalkan, produk tetap ada.
  2. Saat disetujui, produk hilang dari tabel dan katalog (7 produk).
  3. Pesan konfirmasi menyebut nama produk.
  4. Ringkasan dan total stok berkurang sesuai (dari data seed: total stok menjadi 112).

**AC-22 — Reset ke data contoh**
- **Langkah:** setelah beberapa perubahan, klik **Reset ke data contoh** dan setujui.
- **Hasil:** kembali tepat 8 produk seed; ringkasan **8 / 124 / 3 / 1**; katalog konsisten; toast reset muncul.

### 9.5 Penyimpanan, keandalan, dan kualitas

**AC-23 — Data lokal rusak**
- **Langkah:** di DevTools, set `washly:products:v1` menjadi `{rusak`, lalu reload.
- **Hasil:** aplikasi tidak blank/crash; data seed dimuat; toast memberi tahu data lokal tidak valid; tidak ada error tak tertangani di Console.

**AC-24 — Escape input (anti-XSS)**
- **Langkah:** tambah produk dengan nama `<img src=x onerror=alert(1)>` dan deskripsi `<b>tebal</b>`.
- **Hasil:** teks tampil apa adanya sebagai teks biasa di kartu dan tabel; tidak ada dialog `alert`; tidak ada elemen `<img>`/`<b>` baru yang dieksekusi.

**AC-25 — Keyboard dan fokus**
- **Langkah:** navigasi seluruh alur katalog → dashboard → form → simpan hanya dengan `Tab`, `Enter`, `Esc`.
- **Hasil:** semua kontrol dapat dijangkau; fokus terlihat; `Esc` menutup form tanpa menyimpan; setelah form tertutup fokus kembali ke tombol pemicu.

**AC-26 — Responsif**
- **Langkah:** uji lebar 360 px, 768 px, dan 1280 px (DevTools device toolbar).
- **Hasil:** tidak ada scroll horizontal; grid 1/2/3–4 kolom sesuai NFR-R2; tombol aksi dashboard tetap dapat digunakan.

**AC-27 — Tanpa jejak sensitif**
- **Langkah:** cari `api`, `key`, `token`, `password`, `secret` di repo dan di Local Storage/Session Storage; periksa Network tab saat memuat katalog.
- **Hasil:** tidak ada secret/API key; tidak ada data pribadi; tidak ada request eksternal selain saat tombol WhatsApp diklik.

**AC-28 — Build produksi bersih**
- **Langkah:** jalankan `npm run build` lalu `npm run preview`; ulangi AC-01, AC-16, dan AC-17.
- **Hasil:** build sukses tanpa error; ukuran JS < 100 KB gzip; semua AC tersebut lulus di preview; Console bersih.

**AC-29 — (Opsional, F-11) Toast**
- **Langkah:** simpan, hapus, dan reset data.
- **Hasil:** toast yang sesuai muncul ≤ 1 detik, hilang otomatis setelah ± 3 detik, dan tidak menghalangi tombol utama.

**AC-30 — (Opsional, F-12) Sinkronisasi antar-tab**
- **Langkah:** buka aplikasi di dua tab; tambah produk di tab A.
- **Hasil:** tab B memperbarui katalog/ringkasan tanpa reload dan tanpa error; tidak terjadi loop penulisan.

### 9.6 Matriks ketertelusuran

| Fitur | AC terkait |
|---|---|
| F-01 Seed 8 produk | AC-01, AC-02, AC-22 |
| F-02 Placeholder lokal | AC-03, AC-04 |
| F-03 Kartu produk | AC-05, AC-26 |
| F-04 Pencarian | AC-06, AC-07, AC-08 |
| F-05 Filter | AC-09, AC-10, AC-11, AC-13 |
| F-06 Sorting | AC-12, AC-13 |
| F-07 WhatsApp | AC-14, AC-15 |
| F-08 CRUD | AC-17, AC-18, AC-19, AC-20, AC-21, AC-22, AC-24 |
| F-09 Ringkasan | AC-16, AC-17, AC-19, AC-21 |
| F-10 localStorage | AC-01, AC-02, AC-23, AC-27 |
| F-11 Toast (S) | AC-29 |
| F-12 Antar-tab (S) | AC-30 |
| NFR aksesibilitas | AC-25 |
| NFR build/performa | AC-28 |

---

## 10. Implementation Plan per Iterasi

Total timebox ± 8 jam efektif + buffer. Setiap iterasi berakhir dengan aplikasi yang **dapat dijalankan** dan AC terkait diperiksa.

### Iterasi 0 — Fondasi (45 menit)

- **Aktivitas:** inisialisasi proyek Vite (vanilla), `package.json` dengan `dev`/`build`/`preview`, struktur folder Bagian 5.5, `config.js` (nomor WhatsApp demo, storage key, daftar gambar), kerangka `index.html` dengan dua tab.
- **Deliverable:** aplikasi kosong berjalan di `npm run dev`; dua tab dapat berpindah via hash.
- **Exit criteria:** tidak ada error console; `npm run build` sukses.

### Iterasi 1 — Data layer dan seed (90 menit)

- **Aktivitas:** `store.js`: definisi model, 8 data seed, `load()` (validasi + fallback seed), `save()` (try/catch quota), `list()`, `create()`, `update()`, `remove()`, `reset()`; util `formatRupiah`, `escapeHtml`, generator `id`.
- **Deliverable:** data dapat dimuat/disimpan; console dapat menampilkan 8 produk.
- **Exit criteria:** AC-01, AC-02 (persistensi dasar), AC-23, AC-27 lulus.

### Iterasi 2 — Katalog dan aset lokal (90 menit)

- **Aktivitas:** 8 SVG placeholder di `public/assets/products/`; render grid kartu (gambar, badge, nama, kategori, harga, indikator stok, deskripsi, CTA); fallback gambar gagal; styling dasar responsif.
- **Deliverable:** katalog lengkap dari data seed.
- **Exit criteria:** AC-01, AC-03, AC-04, AC-05 lulus; layout 360/768/1280 px rapi.

### Iterasi 3 — Pencarian, filter, sorting (75 menit)

- **Aktivitas:** state tampilan (`query`, `kategori`, `ketersediaan`, `hanyaUnggulan`, `sort`); pipeline filter → sort (dengan tie-breaker); kontrol UI + jumlah hasil; empty state + reset; opsi kategori dinamis.
- **Deliverable:** katalog interaktif penuh.
- **Exit criteria:** AC-06 s.d. AC-13 lulus.

### Iterasi 4 — Tombol WhatsApp (45 menit)

- **Aktivitas:** builder pesan + `encodeURIComponent`; status `disabled` untuk stok 0; `target="_blank"` + `rel`; label tombol adaptif.
- **Deliverable:** CTA pesan berfungsi.
- **Exit criteria:** AC-14, AC-15 lulus; nomor hanya berasal dari `config.js`.

### Iterasi 5 — Dashboard CRUD dan ringkasan (120 menit)

- **Aktivitas:** tabel produk; form tambah/ubah (field + dropdown gambar); validasi per field dengan pesan dan fokus; konfirmasi hapus; reset data; empat kartu ringkasan yang dihitung ulang setiap perubahan; sinkronisasi katalog setelah CRUD.
- **Deliverable:** dashboard demo lengkap.
- **Exit criteria:** AC-16 s.d. AC-22 lulus.

### Iterasi 6 — Pengerasan dan UX (60 menit)

- **Aktivitas:** toast (F-11); penanganan error storage; escape audit pada semua render; aksesibilitas (label, `aria-describedby`, fokus modal, `Esc`); responsif tabel; (opsional) sinkronisasi `storage` (F-12).
- **Deliverable:** aplikasi stabil dan ramah keyboard.
- **Exit criteria:** AC-24, AC-25, AC-26, AC-29 lulus; Console bersih di alur utama.

### Iterasi 7 — QA, build, dan demo (45 menit)

- **Aktivitas:** jalankan seluruh AC-01 s.d. AC-30 di `npm run preview`; perbaiki temuan; siapkan skrip demo 5 menit; catat batasan di README (nomor WhatsApp demo, data lokal, tanpa backend).
- **Deliverable:** build final + checklist AC terisi.
- **Exit criteria:** semua AC wajib (M) lulus; AC opsional dicatat lulus/tidak; AC-28 lulus.

### 10.1 Buffer dan aturan pemotongan

- Buffer 30–45 menit disediakan di akhir hari untuk perbaikan bug.
- Jika waktu mepet, urutan pemotongan: F-12 → F-11 → animasi/estetika. Fitur M tidak boleh dipotong; bila terpaksa, catat sebagai deviasi di README dan minta persetujuan reviewer.
- Setiap iterasi wajib diakhiri dengan commit yang dapat dijalankan (tidak ada state setengah jadi di akhir iterasi).

### 10.2 Skrip demo (5 menit)

1. Buka `#/katalog` dengan data seed — tunjukkan 8 produk dan ringkasan visual stok.
2. Cari `deterjen`, filter `Bahan Cuci`, sort `Harga terendah` — tunjukkan hasil dan jumlahnya.
3. Klik pesan pada p-01 — tunjukkan pesan WhatsApp terisi.
4. Buka p-05 — tunjukkan tombol **Stok habis** nonaktif.
5. Buka `#/dashboard` — tambah produk, ubah stok, hapus, tunjukkan ringkasan berubah.
6. Reload — tunjukkan data bertahan; lalu reset ke data contoh.

---

## 11. Definisi Selesai (DoD)

MVP dinyatakan selesai bila:

- [ ] Semua fitur **M** (F-01 s.d. F-10) terimplementasi sesuai Bagian 4.
- [ ] Semua AC wajib pada Bagian 9 lulus secara manual, dengan bukti berupa checklist terisi (dan screenshot opsional).
- [ ] `npm run build` + `npm run preview` sukses; tidak ada error console pada alur utama.
- [ ] Tidak ada secret, API key, data pribadi, atau request eksternal tak terduga (AC-27).
- [ ] Tidak ada login palsu, backend tersembunyi, atau klaim fitur di luar Bagian 4.
- [ ] README singkat memuat cara menjalankan, cara mengganti nomor WhatsApp, dan batasan data lokal.

---

## 12. Pertanyaan Terbuka (untuk reviewer)

1. Apakah kategori sebaiknya dibatasi ke 3 nilai tetap (Bahan Cuci, Pewangi, Perlengkapan), atau pengelola boleh mengetik kategori baru? *Usulan: bebas diketik, dropdown menampilkan yang sudah ada.*
2. Apakah tombol WhatsApp perlu pilihan jumlah? *Usulan: tidak untuk MVP (jumlah 1) agar scope tetap 1 hari.*
3. Apakah ringkasan perlu juga tampil di katalog (mis. "8 produk tersedia")? *Usulan: cukup di dashboard.*
4. Apakah nomor WhatsApp demo perlu diganti dengan nomor latihan nyata milik peserta? *Usulan: tetap fiktif, diubah manual di `config.js` saat demo.*
