# TASKS — Washly

**Rencana kerja implementasi MVP katalog produk laundry, 1 hari latihan**

| Item | Keterangan |
|---|---|
| Versi | 1.0 |
| Sumber | `SPEC.md` v1.0 dan `UI-SPEC.md` v1.0 |
| Total estimasi | ± 7 jam 45 menit kerja + 45 menit buffer |
| Pendekatan | Mobile-first, Vite + JavaScript vanilla, tanpa backend/login |
| Status dokumen | Rencana; **belum ada kode aplikasi yang diubah** |

Dokumen ini memecah `SPEC.md` (perilaku & acceptance criteria) dan `UI-SPEC.md` (tampilan) menjadi tugas yang dapat dieksekusi, diperiksa, dan dicentang. Urutan milestone mengikuti permintaan: scaffold → katalog → pencarian/filter → WhatsApp → CRUD dashboard → localStorage → testing → security → build → deployment.

**Hierarki konflik:** perilaku/data mengikuti `SPEC.md`; visual/ukuran mengikuti `UI-SPEC.md`; urutan pengerjaan mengikuti dokumen ini. Jika implementasi harus menyimpang, catat di bagian **Catatan Deviasi** di akhir dokumen, bukan mengubah `SPEC.md` diam-diam.

---

## 1. Cara Memakai Dokumen

1. Kerjakan berurutan sesuai milestone; jangan mulai milestone berikutnya sebelum exit criteria milestone saat ini lulus.
2. Setiap tugas = satu commit (atau beberapa commit kecil) dengan pesan `feat(...)`, `fix(...)`, `test(...)`, atau `docs(...)`.
3. Centang `[ ]` hanya setelah acceptance criteria diperiksa manual, bukan setelah kode ditulis.
4. Catat waktu aktual jika melebihi estimasi; jika tersangkut > 20 menit, tandai `[!]` dan lanjut ke tugas yang tidak bergantung padanya.
5. Jangan menambah dependensi runtime, backend, login, atau fitur di luar `SPEC.md` tanpa persetujuan reviewer.
6. Jangan menyimpan secret/API key, jangan memakai data pribadi, dan jangan menjalankan perintah destruktif.

**Legenda status:**

- `[ ]` belum dikerjakan
- `[~]` sedang dikerjakan
- `[x]` selesai dan terverifikasi
- `[!]` terblokir (tulis alasannya di Catatan Deviasi)

**Legenda prioritas:** **M** = wajib untuk MVP, **S** = sebaiknya (boleh dipotong bila waktu habis).

---

## 2. Ringkasan Milestone

| Milestone | Fokus | Tugas | Estimasi | Exit criteria |
|---|---|---|---|---|
| M0 | Scaffold & fondasi | T-01–T-03 | 50 m | App jalan, navbar dua tab, data seed + storage adapter siap |
| M1 | Katalog | T-04–T-06 | 65 m | 8 produk tampil dengan aset lokal, hero, kartu, state stok |
| M2 | Pencarian/filter/sort | T-07–T-10 | 65 m | AC-06 s.d. AC-13 lulus |
| M3 | WhatsApp | T-11–T-12 | 25 m | AC-14, AC-15 lulus |
| M4 | CRUD dashboard | T-13–T-18 | 95 m | AC-16 s.d. AC-21 lulus (persistensi final di M5) |
| M5 | localStorage | T-19–T-23 | 45 m | AC-02, AC-22, AC-23 lulus; data bertahan setelah reload |
| M6 | Testing | T-24–T-27 | 50 m | Semua AC aplikasi (01–27) lulus; AC-28 menyusul di M8; responsif & a11y terverifikasi |
| M7 | Security | T-28–T-30 | 30 m | AC-24, AC-27 lulus; tidak ada secret/jejak sensitif |
| M8 | Build | T-31–T-32 | 20 m | AC-28 lulus; ukuran bundle sesuai anggaran |
| M9 | Deployment | T-33–T-34 | 20 m | URL demo dapat diakses dan smoke test lulus |

**Total:** 465 menit (7 jam 45 menit) + buffer 45 menit = **8 jam 30 menit**. Buffer dipakai untuk bug tak terduga; jangan mengisi buffer dengan fitur baru.

**Urutan pemotongan bila mepet:** T-18 (toast, S) → T-22 (sinkron antar-tab, S) → detail animasi/estetika. Fitur **M** dan seluruh AC wajib tidak boleh dipotong.

---

## 3. M0 — Scaffold & Fondasi

### T-01 — Inisialisasi proyek Vite dan skrip npm

**Estimasi:** 15 m · **Dependensi:** — · **Prioritas:** M · **Ref:** SPEC Iterasi 0

**Aktivitas**

- Inisialisasi `package.json` dengan Vite sebagai devDependency dan skrip `dev`, `build`, `preview`.
- Siapkan `index.html`, entry `src/main.js`, dan file style dasar.
- Tambahkan `.gitignore` (node_modules, dist, cache, file `.env*`).
- Tulis README stub: kebutuhan Node LTS, cara install/run/build.

**Acceptance criteria**

- [ ] `npm install` selesai tanpa error.
- [ ] `npm run dev` menyajikan halaman di localhost tanpa error console.
- [ ] `npm run build` dan `npm run preview` berhasil pada scaffold minimal.
- [ ] Daftar dependensi hanya Vite (tanpa framework UI, router, atau pustaka ikon).
- [ ] `.gitignore` mencegah `node_modules/`, `dist/`, dan file `.env*` ikut ter-commit.

**Berkas yang mungkin berubah:** `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/styles.css`, `.gitignore`, `README.md`

---

### T-02 — Shell aplikasi: navbar, routing hash, dan skip link

**Estimasi:** 20 m · **Dependensi:** T-01 · **Prioritas:** M · **Ref:** SPEC F-01/3.1, UI-SPEC 4.1 & 3.2

**Aktivitas**

- Navbar sticky dengan brand Washly dan dua tab: Katalog (`#/katalog`), Dashboard (`#/dashboard`).
- Routing hash tanpa pustaka: hash kosong/tidak dikenal → Katalog; dukung tombol back/forward.
- Skip link "Lewati ke konten utama"; landmark `header`, `nav`, `main`, `footer`.
- Placeholder dua view agar perpindahan tab terlihat.

**Acceptance criteria**

- [ ] Membuka `#/katalog` dan `#/dashboard` menampilkan view berbeda; hash tidak dikenal jatuh ke Katalog.
- [ ] Tab aktif memakai `aria-current="page"` dan gaya aktif sesuai UI-SPEC (bukan hanya warna teks).
- [ ] Skip link adalah elemen fokus pertama dan hanya terlihat saat fokus.
- [ ] Navbar muat pada lebar 360 px tanpa scroll horizontal; tinggi 56 px (mobile) / 64 px (desktop).
- [ ] Tombol back/forward browser berpindah view dengan benar; tidak ada error console.

**Berkas yang mungkin berubah:** `index.html`, `src/main.js`, `src/styles.css`

---

### T-03 — Data layer dasar: config, seed, storage adapter, util

**Estimasi:** 15 m · **Dependensi:** T-01 · **Prioritas:** M · **Ref:** SPEC 5.1–5.4, F-01/F-10, UI-SPEC 2.1

**Aktivitas**

- `src/config.js`: `WHATSAPP_NUMBER` (digit saja, nilai demo fiktif), kunci `washly:products:v1`, daftar 8 path gambar.
- `src/store.js`: 8 data seed persis tabel SPEC 5.2; `load()` seed bila kosong; `save()` menulis `{version:1, products}`; fungsi CRUD dasar yang memanggil `save()`.
- `src/ui.js`: `formatRupiah`, `escapeHtml`, helper toast/empty state (kerangka).
- Komentar singkat bahwa nomor WhatsApp adalah demo fiktif.

**Acceptance criteria**

- [ ] `load()` pada localStorage kosong menghasilkan tepat 8 produk sesuai SPEC 5.2 (total stok 124, 3 unggulan, 1 stok habis).
- [ ] Setelah `save()`, kunci `washly:products:v1` berisi `version: 1` dan array `products`; tidak ada kunci lain yang dibuat aplikasi.
- [ ] `formatRupiah(32000)` menghasilkan `Rp 32.000`; nilai `0` menghasilkan `Rp 0`.
- [ ] Teks `<b>uji</b>` yang dilewatkan `escapeHtml` tampil sebagai teks biasa, bukan HTML aktif.
- [ ] `WHATSAPP_NUMBER` hanya berisi digit, jelas ditandai demo, dan tidak ada API key/secret di repo.
- [ ] Tidak ada request jaringan eksternal saat modul dimuat.

**Berkas yang mungkin berubah:** `src/config.js`, `src/store.js`, `src/ui.js`, `README.md`

---

## 4. M1 — Katalog

### T-04 — Aset placeholder SVG lokal (8 gambar)

**Estimasi:** 20 m · **Dependensi:** T-03 · **Prioritas:** M · **Ref:** SPEC F-02/AC-03, UI-SPEC 2.1 & 5.3

**Aktivitas**

- Buat 8 SVG 4:3 di `public/assets/products/` dengan nama sesuai SPEC: `deterjen-cair.svg`, `deterjen-bubuk.svg`, `pelembut.svg`, `pewangi-lavender.svg`, `parfum-sachet.svg`, `pemutih.svg`, `plastik-kemasan.svg`, `hanger.svg`.
- Gaya: latar aqua/mint muda, monogram atau ikon sederhana, teks kategori; tanpa teks personal.
- Tidak memuat font/gambar eksternal di dalam SVG.

**Acceptance criteria**

- [ ] Delapan berkas ada dengan nama dan path persis seperti data seed.
- [ ] Setiap SVG dapat dibuka langsung di browser, rasio 4:3, tanpa ikon rusak.
- [ ] Total ukuran 8 SVG < 300 KB dan tidak ada referensi `http://`, `https://`, atau skrip di dalamnya.
- [ ] Warna hanya memakai token palet UI-SPEC; tidak ada teks yang gagal kontras.

**Berkas yang mungkin berubah:** `public/assets/products/*.svg`, `src/config.js`

---

### T-05 — Hero katalog dan statistik dinamis

**Estimasi:** 15 m · **Dependensi:** T-04, T-02 · **Prioritas:** M · **Ref:** UI-SPEC 5.1, SPEC F-01

**Aktivitas**

- Hero gradien aqua→mint, eyebrow, judul, subjudul, CTA **Lihat Produk ↓** dan **Kelola Katalog**.
- Statistik "8 produk" dan "124 stok" dihitung dari data, bukan hardcode.
- Panel dekoratif desktop `aria-hidden`; versi mobile tanpa panel.
- CTA utama menggulir ke grid dan memindahkan fokus ke judul seksi.

**Acceptance criteria**

- [ ] Hero tampil di `#/katalog` dengan teks persis UI-SPEC 9 dan tanpa gambar/font eksternal.
- [ ] Angka statistik berubah bila jumlah produk/stok berubah (uji dengan mengubah data di console lalu render ulang).
- [ ] Klik **Lihat Produk** menggulir ke grid tanpa tertutup navbar dan fokus berada di judul "Semua Produk".
- [ ] **Kelola Katalog** membuka `#/dashboard`.
- [ ] Pada 360 px tidak ada scroll horizontal; CTA dapat disentuh dengan target ≥ 44 px.

**Berkas yang mungkin berubah:** `src/catalog.js`, `src/main.js`, `src/styles.css`

---

### T-06 — Grid kartu produk, state stok, dan fallback gambar

**Estimasi:** 30 m · **Dependensi:** T-05, T-03 · **Prioritas:** M · **Ref:** SPEC F-03/AC-01/03/04/05, UI-SPEC 5.3

**Aktivitas**

- Render 8 kartu: gambar 4:3, badge unggulan, nama, chip kategori, harga, stok, deskripsi 2 baris, area CTA.
- State stok: `Stok: n` (>10), `Stok tersisa n` (1–10), badge **Stok habis** (0).
- Fallback gambar gagal → blok monogram inisial; `alt="Ilustrasi {nama}"`.
- Grid 1/2/3/4 kolom pada 360/640/1024/1280 px.
- CTA WhatsApp dirender tetapi belum bertaut sampai T-11/T-12 (jangan membuat tautan rusak).

**Acceptance criteria**

- [ ] Tepat 8 kartu tampil dengan data seed; harga `Rp 32.000` dan kategori benar (AC-01, AC-03).
- [ ] Tiga varian stok terlihat dan berlabel teks sesuai aturan; p-05 menampilkan **Stok habis** (AC-05).
- [ ] Menghapus/merename satu SVG sementara menampilkan placeholder monogram, layout tidak bergeser (AC-04).
- [ ] Semua gambar dimuat dari origin lokal; tidak ada request eksternal (AC-03).
- [ ] Grid tanpa scroll horizontal di 360 px; tinggi kartu konsisten meski deskripsi berbeda.
- [ ] Teks pengguna (nama/kategori/deskripsi) dirender via escape, bukan HTML mentah.
- [ ] Katalog 0 produk menampilkan empty state "Katalog masih kosong" + CTA ke dashboard.

**Berkas yang mungkin berubah:** `src/catalog.js`, `src/ui.js`, `src/styles.css`, `public/assets/products/*.svg`

---

## 5. M2 — Pencarian, Filter, dan Sorting

### T-07 — Pencarian real-time

**Estimasi:** 15 m · **Dependensi:** T-06 · **Prioritas:** M · **Ref:** SPEC F-04/AC-06–08, UI-SPEC 5.2

**Aktivitas**

- Input search 44 px, ikon kaca pembesar, tombol × saat ada teks.
- Cocokkan case-insensitive pada nama, kategori, dan deskripsi; trim spasi.
- Empty state "Tidak ada produk yang cocok" + tombol reset.
- Hasil diperbarui saat mengetik tanpa reload.

**Acceptance criteria**

- [ ] `deterjen` menemukan p-01 dan p-02; `DETERJEN` memberi hasil sama (AC-06).
- [ ] `lavender` menemukan p-04; `perlengkapan` menemukan p-07 dan p-08 (AC-07).
- [ ] `xyz123` menampilkan empty state "Tidak ada produk yang cocok"; tombol × mengosongkan pencarian (AC-08). Tombol **Reset filter** penuh diverifikasi setelah T-08.
- [ ] Tombol × mengosongkan input, mempertahankan fokus di input, dan menghapus filter pencarian.
- [ ] Mengetik tidak memicu kehilangan fokus atau reload halaman.

**Berkas yang mungkin berubah:** `src/catalog.js`, `src/ui.js`, `src/styles.css`

---

### T-08 — Filter kategori, ketersediaan, dan unggulan

**Estimasi:** 20 m · **Dependensi:** T-07 · **Prioritas:** M · **Ref:** SPEC F-05/AC-09–11, UI-SPEC 5.2

**Aktivitas**

- Opsi kategori dinamis: `Semua` + kategori unik urut abjad.
- Filter ketersediaan `Semua/Tersedia/Habis` dan checkbox `Unggulan saja`; kombinasikan dengan AND.
- Chip filter aktif dengan tombol hapus berlabel aksesibel; tombol **Reset filter**.
- Jumlah filter aktif untuk label tombol filter mobile.

**Acceptance criteria**

- [ ] Kategori `Pewangi` hanya menampilkan p-04 dan p-05; opsi kategori tanpa duplikat (AC-09).
- [ ] `Habis` hanya p-05; `Tersedia` menampilkan 7 produk lain (AC-10).
- [ ] Unggulan + `Perlengkapan` hanya p-08; melepas centang memunculkan p-07 dan p-08 (AC-11).
- [ ] Setiap chip filter dapat dihapus dan hasil langsung berubah; label tombol hapus menyebut nama filter.
- [ ] Reset filter mengosongkan pencarian + semua filter, tetapi tidak mengubah sorting.
- [ ] Filter tidak mengubah data di localStorage maupun angka ringkasan dashboard.

**Berkas yang mungkin berubah:** `src/catalog.js`, `src/ui.js`, `src/styles.css`

---

### T-09 — Sorting dan jumlah hasil

**Estimasi:** 15 m · **Dependensi:** T-08 · **Prioritas:** M · **Ref:** SPEC F-06/AC-12–13, UI-SPEC 5.2

**Aktivitas**

- Lima opsi sorting: Nama A–Z (default), Harga terendah, Harga tertinggi, Stok terbanyak, Unggulan dulu.
- Terapkan setelah filter; tie-breaker nama A–Z lalu `id`.
- Baris hasil "Menampilkan {x} dari {y} produk" dengan `aria-live="polite"`.

**Acceptance criteria**

- [ ] Harga terendah: p-06 (15.000) pertama, p-04 (35.000) terakhir; harga tertinggi kebalikannya (AC-12).
- [ ] Stok terbanyak: p-02 (40) pertama, p-05 (0) terakhir (AC-12).
- [ ] Nama A–Z berurutan sesuai daftar di SPEC AC-12; Unggulan dulu menampilkan p-01, p-04, p-08 lebih dulu.
- [ ] Kategori `Bahan Cuci` + cari `1L` + harga terendah → p-03 lalu p-01, teks "Menampilkan 2 dari 8 produk" (AC-13).
- [ ] Mengubah sorting tidak mereset pencarian/filter; urutan selalu deterministik setelah reload data.

**Berkas yang mungkin berubah:** `src/catalog.js`, `src/ui.js`

---

### T-10 — Toolbar mobile dan bottom sheet filter

**Estimasi:** 15 m · **Dependensi:** T-08, T-09 · **Prioritas:** M · **Ref:** UI-SPEC 3.1, 5.2, 7.3; SPEC NFR-R1

**Aktivitas**

- < 1024 px: search penuh, baris **Filter (n)** + sort ringkas; filter dalam bottom sheet.
- ≥ 1024 px: toolbar inline penuh (search, kategori, ketersediaan, unggulan, sort, reset).
- Sheet: fokus terperangkap, `Esc`/backdrop/×/Selesai menutup, fokus kembali ke pemicu; perubahan langsung diterapkan.
- Jangan menduplikasi kontrol sorting di dalam sheet.

**Acceptance criteria**

- [ ] Pada 375 px, sheet dapat dibuka/ditutup dengan mouse, sentuh, `Esc`, dan keyboard; fokus tidak keluar sheet.
- [ ] Mengubah filter di sheet langsung memperbarui grid di belakang dan jumlah filter pada tombol.
- [ ] Setelah menutup sheet, fokus kembali ke tombol **Filter**.
- [ ] Ukuran 768 px dan 1023 px tetap memakai sheet; 1024 px ke atas memakai toolbar inline.
- [ ] Tidak ada scroll horizontal atau kontrol terpotong pada 360/768/1024 px.

**Berkas yang mungkin berubah:** `src/catalog.js`, `src/ui.js`, `src/styles.css`

---

## 6. M3 — Tombol WhatsApp

### T-11 — Pembuat tautan dan pesan WhatsApp

**Estimasi:** 15 m · **Dependensi:** T-06 · **Prioritas:** M · **Ref:** SPEC F-07/AC-14, UI-SPEC 5.4

**Aktivitas**

- Bangun URL `https://wa.me/{nomor}?text={pesan}` dari config; encode dengan `encodeURIComponent`.
- Template pesan persis SPEC F-07 (nama, kategori, harga Rupiah, jumlah 1, pertanyaan ketersediaan).
- Buka tab baru dengan `target="_blank"` dan `rel="noopener noreferrer"`.

**Acceptance criteria**

- [ ] Tautan p-01 mengarah ke `https://wa.me/6281234567890?text=...` (AC-14).
- [ ] Setelah di-decode, pesan memuat nama, kategori, `Rp 32.000`, `Jumlah: 1`, dan baris baru yang benar.
- [ ] Tidak ada karakter rusak/spasi hilang; encode dilakukan sekali, bukan dua kali.
- [ ] Nomor hanya berasal dari `src/config.js`; tidak ada nomor lain di kode/seed.
- [ ] Membuka tautan tidak mengubah stok atau localStorage.

**Berkas yang mungkin berubah:** `src/catalog.js`, `src/ui.js`, `src/config.js`

---

### T-12 — State tombol WhatsApp dan aksesibilitas

**Estimasi:** 10 m · **Dependensi:** T-11 · **Prioritas:** M · **Ref:** SPEC F-07/AC-15, UI-SPEC 5.4

**Aktivitas**

- Stok > 0: tombol aktif berlabel **WhatsApp**, ikon + teks, `aria-label="Pesan {nama} via WhatsApp"`.
- Stok 0: tombol `disabled` berlabel **Stok habis**, tampilan netral, tidak dapat difokus/diklik.
- Terapkan state hover/active/focus dan kontras sesuai UI-SPEC.

**Acceptance criteria**

- [ ] p-01 membuka tab WhatsApp; p-05 menampilkan tombol nonaktif dan tidak membuka apa pun (AC-14/15).
- [ ] Tombol nonaktif memakai atribut `disabled`; tidak bisa diaktifkan dengan keyboard maupun klik.
- [ ] Tombol aktif dapat dijangkau keyboard dengan ring fokus terlihat dan target 44 px.
- [ ] Label aksesibel menyebut nama produk; ikon `aria-hidden`.
- [ ] Tidak ada state "terkirim" palsu setelah klik.

**Berkas yang mungkin berubah:** `src/catalog.js`, `src/styles.css`

---

## 7. M4 — CRUD Dashboard

### T-13 — Header dashboard, banner demo, dan kartu ringkasan

**Estimasi:** 15 m · **Dependensi:** T-03, T-06 · **Prioritas:** M · **Ref:** SPEC F-09/AC-16, UI-SPEC 6.1–6.2

**Aktivitas**

- `#/dashboard`: judul, subjudul, banner "Mode demo — tanpa login, tanpa backend...".
- Tombol **+ Tambah Produk** dan **Reset ke data contoh** (dialog di T-17).
- Empat kartu ringkasan: total produk, total stok, unggulan, stok habis; dihitung dari data.
- Layout 2×2 mobile, 4 kolom ≥ 768 px.

**Acceptance criteria**

- [ ] Data seed menampilkan **8 / 124 / 3 / 1** (AC-16).
- [ ] Mengubah stok/jumlah produk di store langsung memperbarui keempat angka setelah render ulang.
- [ ] Banner demo terlihat dan tidak menyamar sebagai alert error.
- [ ] Kartu ringkasan memiliki label teks; warna bukan satu-satunya pembeda.
- [ ] Tampilan 375 px tidak berdesakan; tombol tetap 44 px.

**Berkas yang mungkin berubah:** `src/dashboard.js`, `src/main.js`, `src/ui.js`, `src/styles.css`

---

### T-14 — Tabel produk desktop dan daftar kartu mobile

**Estimasi:** 20 m · **Dependensi:** T-13 · **Prioritas:** M · **Ref:** SPEC F-08, UI-SPEC 6.3–6.4

**Aktivitas**

- Tabel ≥ 768 px: Nama, Kategori, Harga, Stok, Unggulan, Aksi (Ubah/Hapus).
- < 768 px: daftar kartu dengan dua tombol aksi; tanpa scroll horizontal.
- Caption tersembunyi, `th scope="col"`, nama panjang dipotong dengan `title`.
- Empty state bila 0 produk.

**Acceptance criteria**

- [ ] Tabel menampilkan 8 seed dengan harga, stok, dan unggulan yang benar.
- [ ] Di 375 px tabel berubah menjadi daftar kartu; semua informasi dan aksi tetap tersedia.
- [ ] Aksi **Ubah** dan **Hapus** berlabel teks (bukan ikon tanpa nama) dan memiliki target 44 px.
- [ ] Header tabel terbaca oleh pembaca layar sebagai header kolom.
- [ ] Tidak ada scroll horizontal pada 360–767 px.

**Berkas yang mungkin berubah:** `src/dashboard.js`, `src/ui.js`, `src/styles.css`

---

### T-15 — Modal form tambah dan ubah produk

**Estimasi:** 25 m · **Dependensi:** T-14 · **Prioritas:** M · **Ref:** SPEC F-08, UI-SPEC 6.5/7.6

**Aktivitas**

- Field: nama, kategori (datalist), harga, stok, gambar (select 8 placeholder + preview), deskripsi (counter 240), checkbox unggulan.
- Mode tambah/ubah; `id` tidak ditampilkan dan tidak berubah saat edit.
- Fokus awal field nama; `Esc` dan **Batal** menutup; konfirmasi bila ada perubahan (opsional).
- Layout dua kolom desktop, satu kolom sheet mobile; footer sticky.

**Acceptance criteria**

- [ ] **+ Tambah Produk** membuka form kosong; **Ubah** membuka form terisi data baris terkait.
- [ ] Setelah simpan valid, modal tertutup, produk muncul di dashboard dan katalog, dan fokus kembali ke pemicu.
- [ ] `id` produk lama tidak berubah setelah edit; gambar hanya dapat dipilih dari 8 placeholder.
- [ ] `Esc` menutup tanpa menyimpan; isian tidak bocor ke form produk lain.
- [ ] Modal dapat dioperasikan penuh dengan keyboard; fokus terperangkap dan kembali ke pemicu.

**Berkas yang mungkin berubah:** `src/dashboard.js`, `src/ui.js`, `src/styles.css`

---

### T-16 — Validasi form, pesan error, dan fokus

**Estimasi:** 15 m · **Dependensi:** T-15 · **Prioritas:** M · **Ref:** SPEC 5.3/AC-18, UI-SPEC 4.3

**Aktivitas**

- Terapkan semua aturan validasi SPEC 5.3: nama 3–60, kategori 2–30, harga bulat ≥ 0, stok bulat ≥ 0, deskripsi ≤ 240, gambar wajib.
- Tolak `NaN`, `Infinity`, desimal, dan nilai negatif; trim string.
- Pesan error per field + `aria-describedby`; fokus ke field pertama tidak valid; form tetap terbuka.

**Acceptance criteria**

- [ ] Nama kosong, harga `-5`, stok `2.5`, dan harga `abc` masing-masing memunculkan pesan spesifik dan tidak menyimpan (AC-18).
- [ ] Harga `0` dan stok `0` diterima sebagai nilai valid.
- [ ] Field yang error memiliki border/ikon/teks, bukan hanya warna; pembaca layar mengumumkan pesan.
- [ ] Fokus berpindah ke field tidak valid pertama; data lama tidak berubah saat edit gagal.
- [ ] Nama/kategori dengan spasi di awal/akhir disimpan dalam bentuk ter-trim.

**Berkas yang mungkin berubah:** `src/dashboard.js`, `src/ui.js`, `src/styles.css`

---

### T-17 — Konfirmasi hapus dan reset

**Estimasi:** 10 m · **Dependensi:** T-14 · **Prioritas:** M · **Ref:** SPEC F-08/AC-21/22, UI-SPEC 6.6

**Aktivitas**

- Dialog hapus menyebut nama produk dan akibatnya; fokus awal pada **Batal**.
- Dialog reset menyebut jumlah produk contoh; fokus awal pada **Batal**.
- Aksi destruktif hanya berjalan setelah konfirmasi; pembatalan tidak mengubah data.

**Acceptance criteria**

- [ ] Membatalkan dialog hapus membuat produk tetap ada; menyetujui menghapusnya dari katalog dan dashboard (AC-21).
- [ ] Pesan konfirmasi memuat nama produk yang dipilih.
- [ ] `Esc` pada dialog = batal; fokus kembali ke tombol pemicu.
- [ ] Tidak ada penghapusan tanpa dialog (kecuali pengguna memilih konfirmasi).
- [ ] Ringkasan langsung berubah setelah hapus.

**Berkas yang mungkin berubah:** `src/dashboard.js`, `src/ui.js`, `src/styles.css`

---

### T-18 — Toast, umpan balik, dan pengembalian fokus (S)

**Estimasi:** 10 m · **Dependensi:** T-15, T-17 · **Prioritas:** S · **Ref:** SPEC F-11/AC-29, UI-SPEC 4.5

**Aktivitas**

- Toast sukses/info/error: muncul ± 3 detik, satu per satu, dapat ditutup, `role="status"`/`aria-live="polite"`.
- Pasang pada simpan, hapus, reset, dan kegagalan penyimpanan (setelah T-20).
- Pastikan toast tidak menutupi tombol utama di mobile dan tidak mencuri fokus.

**Acceptance criteria**

- [ ] Simpan/hapus/reset memunculkan toast yang sesuai dalam ≤ 1 detik dan hilang otomatis (AC-29).
- [ ] Toast tidak menghalangi tombol aksi pada 360 px dan tidak memindahkan fokus.
- [ ] Hanya satu toast terlihat; toast baru menggantikan yang lama.
- [ ] Tombol tutup toast dapat dijangkau keyboard.

**Berkas yang mungkin berubah:** `src/ui.js`, `src/dashboard.js`, `src/styles.css`

---

## 8. M5 — localStorage

> Catatan: T-03 sudah menyiapkan adapter baca/tulis agar aplikasi berfungsi sejak awal. Milestone ini memfinalkan kontrak data, pemulihan, kegagalan, reset, dan sinkronisasi.

### T-19 — Validasi skema dan pemulihan data rusak

**Estimasi:** 10 m · **Dependensi:** T-03, T-15 · **Prioritas:** M · **Ref:** SPEC 5.4/AC-23, F-10

**Aktivitas**

- Validasi bentuk `{version:1, products[]}` saat load: tipe field, `id` unik, `imageUrl` dikenal, angka bulat.
- Versi tidak dikenal/JSON rusak → seed ulang + toast info; jangan crash atau layar kosong.
- Item tidak valid diabaikan; bila tidak ada item valid, seed.

**Acceptance criteria**

- [ ] Mengisi kunci dengan `{rusak` lalu reload menampilkan 8 seed dan toast, tanpa error tak tertangani (AC-23).
- [ ] Versi `99` atau array berisi objek tanpa field wajib tidak membuat halaman blank.
- [ ] Data valid yang sudah ada tidak dihapus hanya karena satu item rusak (kecuali tidak ada item valid).
- [ ] Setelah pemulihan, kunci localStorage berisi data seed versi 1 yang valid.

**Berkas yang mungkin berubah:** `src/store.js`, `src/ui.js`, `src/main.js`

---

### T-20 — Penanganan kuota/penyimpanan gagal

**Estimasi:** 10 m · **Dependensi:** T-19 · **Prioritas:** M · **Ref:** SPEC F-10, NFR-S1, UI-SPEC 5.5/6.7

**Aktivitas**

- Tangkap error `setItem`/`getItem` (private mode, kuota) tanpa menghentikan aplikasi.
- Tampilkan banner persisten + toast error yang menjelaskan perubahan hanya berlaku selama sesi.
- Jangan menghapus data lama saat penulisan gagal.

**Acceptance criteria**

- [ ] Dengan `localStorage.setItem` disimulasikan melempar error (DevTools), simpan produk tetap memperbarui UI di memori.
- [ ] Banner dan toast error muncul; tidak ada uncaught error di console.
- [ ] Setelah reload, aplikasi kembali ke data terakhir yang berhasil tersimpan (bukan data setengah jadi).
- [ ] Pesan error tidak menyalahkan pengguna dan menyebut batasan sesi.

**Berkas yang mungkin berubah:** `src/store.js`, `src/dashboard.js`, `src/catalog.js`, `src/ui.js`, `src/styles.css`

---

### T-21 — Reset ke data contoh

**Estimasi:** 5 m · **Dependensi:** T-17, T-19 · **Prioritas:** M · **Ref:** SPEC AC-22

**Aktivitas**

- Reset menulis ulang 8 seed + `version: 1` ke kunci yang sama, lalu render ulang katalog/dashboard.
- Gunakan dialog konfirmasi T-17; tampilkan toast sukses.

**Acceptance criteria**

- [ ] Setelah reset, tepat 8 produk seed tampil dan ringkasan kembali **8 / 124 / 3 / 1** (AC-22).
- [ ] Kunci `washly:products:v1` berisi 8 item valid; tidak ada kunci duplikat.
- [ ] Reset setelah tambah/ubah/hapus benar-benar membuang perubahan lokal.
- [ ] Membatalkan dialog reset tidak mengubah apa pun.

**Berkas yang mungkin berubah:** `src/store.js`, `src/dashboard.js`, `src/ui.js`

---

### T-22 — Sinkronisasi antar-tab (S)

**Estimasi:** 10 m · **Dependensi:** T-19 · **Prioritas:** S · **Ref:** SPEC F-12/AC-30

**Aktivitas**

- Dengarkan event `storage` untuk kunci aplikasi; render ulang katalog, dashboard, dan ringkasan.
- Hindari loop tulis-baca; jangan menimpa state filter pengguna di tab lain.

**Acceptance criteria**

- [ ] Tambah produk di tab A memperbarui tab B tanpa reload dan tanpa error (AC-30).
- [ ] Hapus/reset di satu tab tercermin di tab lain.
- [ ] Tidak ada loop penulisan (periksa Console/Performance) dan filter lokal tab B tidak rusak.
- [ ] Bila fitur dipotong, tandai di Catatan Deviasi dan AC-30 sebagai tidak lulus (opsional).

**Berkas yang mungkin berubah:** `src/main.js`, `src/store.js`, `src/catalog.js`, `src/dashboard.js`

---

### T-23 — Matriks persistensi dan verifikasi skema

**Estimasi:** 10 m · **Dependensi:** T-19–T-21 · **Prioritas:** M · **Ref:** SPEC AC-02/17/19/21

**Aktivitas**

- Uji tambah → reload, ubah → reload, hapus → reload, reset → reload.
- Periksa JSON di DevTools: tipe angka (bukan string), `unggulan` boolean, `id` unik, `imageUrl` lokal.
- Pastikan hanya kunci aplikasi yang dibuat.

**Acceptance criteria**

- [ ] Stok yang diubah menjadi 99 tetap 99 setelah reload (AC-02).
- [ ] Produk baru hasil AC-17 tetap ada setelah reload, dengan ringkasan yang benar (AC-17).
- [ ] Perubahan p-02 (nama/harga/stok/unggulan) bertahan setelah reload dan `id` tetap `p-02` (AC-19).
- [ ] Produk yang dihapus tidak muncul lagi setelah reload (AC-21).
- [ ] JSON tersimpan memiliki `version: 1`, 8 field wajib bertipe benar, dan tidak ada `undefined`/`NaN`.

**Berkas yang mungkin berubah:** `src/store.js`, `TASKS.md`

---

## 9. M6 — Testing

### T-24 — Eksekusi matriks acceptance criteria

**Estimasi:** 20 m · **Dependensi:** M1–M5 · **Prioritas:** M · **Ref:** SPEC 9/AC-01–30

**Aktivitas**

- Jalankan AC-01 s.d. AC-30 di `npm run dev` dan/atau `npm run preview` menggunakan langkah di SPEC.
- Tandai lulus/gagal per AC; catat bukti singkat (perilaku yang terlihat) untuk yang gagal.
- Perbaiki temuan atau buat tugas regresi T-27.

**Acceptance criteria**

- [ ] Semua AC aplikasi wajib (01–27) lulus; AC-28 diverifikasi di M8; AC-29/30 dicatat lulus atau sengaja dipotong.
- [ ] Setiap kegagalan memiliki catatan langkah reproduksi dan status.
- [ ] Data uji dikembalikan ke seed setelah pengujian.
- [ ] Tidak ada error/warning baru di Console selama pengujian.

**Berkas yang mungkin berubah:** `TASKS.md`, `README.md`, `src/*`

---

### T-25 — Responsif, zoom, dan lintas browser

**Estimasi:** 10 m · **Dependensi:** T-24 · **Prioritas:** M · **Ref:** SPEC NFR-R1–R4/AC-26, UI-SPEC 3.1

**Aktivitas**

- Uji 360, 375, 768, 1024, 1280 px; cek grid, toolbar, tabel, modal, toast.
- Uji zoom 200% dan reflow 320 px.
- Uji minimal Chrome/Edge + satu browser lain yang tersedia (Firefox atau Safari).

**Acceptance criteria**

- [ ] Tidak ada scroll horizontal pada 360–1280 px (AC-26).
- [ ] Grid 1/2/3/4 kolom dan ringkasan 2×2/4 kolom sesuai breakpoint.
- [ ] Pada 200% zoom semua konten dan tombol tetap dapat diakses.
- [ ] Modal/sheet, filter, dan tabel berfungsi di kedua browser yang diuji.

**Berkas yang mungkin berubah:** `src/styles.css`, `src/catalog.js`, `src/dashboard.js`

---

### T-26 — Aksesibilitas: keyboard, fokus, dan pembaca layar

**Estimasi:** 10 m · **Dependensi:** T-24 · **Prioritas:** M · **Ref:** SPEC NFR-A1–A6/AC-25, UI-SPEC 8

**Aktivitas**

- Uji alur penuh tanpa mouse: navbar → search → filter → WhatsApp → dashboard → form → simpan/hapus.
- Periksa urutan fokus, ring fokus, label/`aria-label`, `aria-live`, dialog, dan pengembalian fokus.
- Uji reduced motion dan kontras titik-titik utama dengan DevTools.
- Smoke test pembaca layar bila tersedia (NVDA/VoiceOver).

**Acceptance criteria**

- [ ] Semua kontrol dapat dijangkau dengan Tab dan diaktifkan dengan Enter/Space (AC-25).
- [ ] Ring fokus terlihat pada semua latar; tidak ada `outline: none` tanpa pengganti.
- [ ] `Esc` menutup sheet/modal; fokus kembali ke pemicu; fokus terperangkap di dialog.
- [ ] Input punya label; error terhubung `aria-describedby`; toast dan jumlah hasil diumumkan.
- [ ] Preferensi reduced motion menghilangkan transform/slide.

**Berkas yang mungkin berubah:** `index.html`, `src/main.js`, `src/catalog.js`, `src/dashboard.js`, `src/styles.css`

---

### T-27 — Regresi dan perbaikan bug

**Estimasi:** 10 m · **Dependensi:** T-24–T-26 · **Prioritas:** M · **Ref:** SPEC 10.1/DoD

**Aktivitas**

- Perbaiki temuan dari T-24–T-26; ulangi AC terkait dan AC tetangga yang berisiko.
- Bersihkan dead code/console.log sisa debugging.
- Pastikan tidak ada regresi pada filter/sort atau persistensi.

**Acceptance criteria**

- [ ] Semua AC yang sebelumnya gagal kini lulus dan dicatat.
- [ ] Tidak ada `console.log`/debugger tersisa di jalur produksi.
- [ ] Alur utama katalog dan CRUD berjalan tanpa error setelah perbaikan.
- [ ] Perubahan tidak menambah dependensi atau fitur baru.

**Berkas yang mungkin berubah:** `src/*`, `index.html`

---

## 10. M7 — Security

### T-28 — Audit escaping dan anti-XSS

**Estimasi:** 10 m · **Dependensi:** M4, M5 · **Prioritas:** M · **Ref:** SPEC AC-24/NFR-S3

**Aktivitas**

- Tambah produk dengan nama `<img src=x onerror=alert(1)>` dan deskripsi `<b>tebal</b>`.
- Periksa render di kartu, tabel, chip, toast, dan atribut (alt/aria-label/title).
- Audit penggunaan `innerHTML`: hanya untuk template statis; data pengguna selalu di-escape atau `textContent`.

**Acceptance criteria**

- [ ] Muatan XSS tampil sebagai teks biasa di semua tempat; tidak ada `alert` (AC-24).
- [ ] Tidak ada elemen `<img>`/`<b>` baru yang dieksekusi dari input.
- [ ] Nama produk di `aria-label`/`title` juga aman (tidak memutus atribut).
- [ ] Pencarian atas muatan tersebut tidak mengeksekusi apa pun.

**Berkas yang mungkin berubah:** `src/ui.js`, `src/catalog.js`, `src/dashboard.js`

---

### T-29 — Audit secret, privasi, dan jaringan

**Estimasi:** 10 m · **Dependensi:** T-28 · **Prioritas:** M · **Ref:** SPEC AC-27/NFR-S1–S6

**Aktivitas**

- Cari pola `api`, `key`, `token`, `password`, `secret` di repo (kecuali dokumentasi yang menjelaskan larangan).
- Periksa Local/Session Storage dan Network tab; pastikan hanya origin lokal.
- Pastikan data contoh nonpribadi dan nomor WhatsApp ditandai demo.
- Opsional: `npm audit` (tanpa perintah destruktif).

**Acceptance criteria**

- [ ] Tidak ada API key/token/password/secret di kode, config, commit, atau storage (AC-27).
- [ ] Tidak ada request eksternal saat memuat katalog; satu-satunya tautan keluar adalah `wa.me` saat diklik.
- [ ] Tidak ada data pribadi (nama orang, alamat, email, telepon pelanggan) di seed/kode.
- [ ] Hanya kunci `washly:products:v1` (dan kunci milik Vite bila dev) yang terlihat.
- [ ] README menjelaskan nomor WhatsApp demo dan cara menggantinya.

**Berkas yang mungkin berubah:** `src/config.js`, `README.md`, `.gitignore`, `package.json`

---

### T-30 — Whitelist gambar dan keamanan tautan

**Estimasi:** 10 m · **Dependensi:** T-28 · **Prioritas:** M · **Ref:** SPEC NFR-S4, F-07

**Aktivitas**

- Validasi `imageUrl` hanya `assets/products/<nama>.svg` yang terdaftar; tolak URL eksternal, `data:`, `javascript:`, dan path keluar folder.
- Pastikan tautan WhatsApp memakai `target="_blank"` + `rel="noopener noreferrer"`.
- Pastikan tidak ada UI login/otorisasi palsu dan tidak ada penyimpanan data pesanan.

**Acceptance criteria**

- [ ] Manipulasi `imageUrl` di localStorage menjadi URL eksternal tidak memuat gambar eksternal; fallback placeholder muncul.
- [ ] Input `javascript:alert(1)` pada gambar ditolak/diabaikan.
- [ ] Tautan WhatsApp tidak memberi akses `window.opener` ke tab baru.
- [ ] Tidak ada halaman/form login, token, atau klaim keamanan yang menyesatkan.

**Berkas yang mungkin berubah:** `src/store.js`, `src/ui.js`, `src/dashboard.js`, `src/catalog.js`

---

## 11. M8 — Build

### T-31 — Build produksi dan anggaran ukuran

**Estimasi:** 10 m · **Dependensi:** M6, M7 · **Prioritas:** M · **Ref:** SPEC AC-28/NFR-P1–P3

**Aktivitas**

- Jalankan `npm run build`; periksa output `dist/`.
- Ukur JS gzip (< 100 KB) dan total gambar (< 300 KB).
- Pastikan aset memakai path relatif/base yang benar dan tidak ada sumber eksternal.

**Acceptance criteria**

- [ ] `npm run build` selesai tanpa error/warning yang mengganggu (AC-28).
- [ ] JS produksi < 100 KB gzip; total SVG < 300 KB.
- [ ] `dist/` berisi `index.html`, aset JS/CSS, dan 8 SVG; tidak ada file dev/test.
- [ ] Tidak ada URL eksternal di output build.
- [ ] `dist/` tidak ikut ter-commit.

**Berkas yang mungkin berubah:** `vite.config.js`, `package.json`, `index.html`, `.gitignore`

---

### T-32 — QA build preview dan README

**Estimasi:** 10 m · **Dependensi:** T-31 · **Prioritas:** M · **Ref:** SPEC AC-28/DoD

**Aktivitas**

- Jalankan `npm run preview`; ulangi smoke test: AC-01, AC-02, AC-16, AC-17.
- Periksa Console bersih dan aset termuat.
- Lengkapi README: cara run/build/preview, ganti nomor WhatsApp, batasan data lokal, struktur folder, catatan demo.

**Acceptance criteria**

- [ ] Katalog, filter, WhatsApp, CRUD, dan persistensi berfungsi di preview (AC-28).
- [ ] Console bersih; tidak ada 404 aset.
- [ ] README memuat perintah, peringatan nomor demo, dan batasan (tanpa backend/login, data per perangkat).
- [ ] README tidak memuat secret dan tidak menjanjikan fitur di luar scope.

**Berkas yang mungkin berubah:** `README.md`, `index.html`, `src/*`

---

## 12. M9 — Deployment

> **Deviasi yang disadari:** `SPEC.md` menempatkan deployment produksi dan domain kustom di luar scope. Milestone ini hanya **deployment demo statis** untuk latihan (tanpa SLA, tanpa domain kustom, tanpa backend), dan tidak mengubah fitur aplikasi.

### T-33 — Konfigurasi deployment statis

**Estimasi:** 10 m · **Dependensi:** T-31 · **Prioritas:** M (latihan) · **Ref:** SPEC 8 butir 12 (deviasi)

**Aktivitas**

- Pilih satu target: GitHub Pages (disarankan) atau host statis lain (Netlify/Vercel drop). Bila repo tidak punya remote GitHub, gunakan host statis manual dan catat langkahnya di README.
- Sesuaikan `base` Vite bila memakai project page (mis. `/nama-repo/`); hash routing tidak butuh rewrite server.
- Tambahkan workflow build+deploy atau konfigurasi host; jangan menyimpan token di repo.

**Acceptance criteria**

- [ ] Build CI/host berhasil dan memakai `npm ci` + `npm run build`.
- [ ] Base path benar: aset dan 8 SVG termuat tanpa 404 di URL deployment.
- [ ] `#/katalog` dan `#/dashboard` berfungsi langsung pada URL statis (tanpa rewrite).
- [ ] Tidak ada secret di workflow/config; `dist/` tidak di-commit.
- [ ] Situs tersedia via HTTPS.

**Berkas yang mungkin berubah:** `vite.config.js`, `.github/workflows/deploy.yml` (atau `netlify.toml`), `README.md`, `.gitignore`

---

### T-34 — Deploy, smoke test, rollback, dan release note

**Estimasi:** 10 m · **Dependensi:** T-33 · **Prioritas:** M (latihan) · **Ref:** SPEC 10.2/DoD

**Aktivitas**

- Deploy build final; jalankan skrip demo 5 menit pada URL publik.
- Verifikasi persistensi pada perangkat yang sama, tautan WhatsApp, CRUD, dan console.
- Catat commit/versi yang dideploy dan cara rollback (deploy ulang commit sebelumnya).
- Tulis release note singkat + label "demo latihan".

**Acceptance criteria**

- [ ] URL demo menampilkan 8 produk dan ringkasan **8 / 124 / 3 / 1**.
- [ ] Reload mempertahankan perubahan; WhatsApp membuka pesan benar; produk habis nonaktif.
- [ ] CRUD demo berjalan dan tidak ada error console di URL publik.
- [ ] Rollback terdokumentasi (commit/tag sebelumnya) dan dapat dijalankan.
- [ ] Release note menyebut batasan: data lokal per browser, tanpa backend/login, nomor WhatsApp demo.

**Berkas yang mungkin berubah:** `README.md`, `TASKS.md`, `.github/workflows/deploy.yml`

---

## 13. Matriks Ketertelusuran Acceptance Criteria

| AC | Tugas utama | Catatan |
|---|---|---|
| AC-01 | T-03, T-06, T-24 | Seed 8 produk |
| AC-02 | T-03, T-23 | Persistensi reload |
| AC-03 | T-04, T-06 | Aset lokal |
| AC-04 | T-06 | Fallback gambar |
| AC-05 | T-06 | Rupiah & stok |
| AC-06–08 | T-07 | Pencarian & empty state |
| AC-09–11 | T-08 | Filter |
| AC-12–13 | T-09 | Sorting |
| AC-14 | T-11 | Tautan WhatsApp |
| AC-15 | T-12 | Stok habis |
| AC-16 | T-13 | Ringkasan |
| AC-17 | T-15, T-23 | Tambah |
| AC-18 | T-16 | Validasi |
| AC-19 | T-15, T-23 | Ubah |
| AC-20 | T-15 | Batal |
| AC-21 | T-17, T-23 | Hapus |
| AC-22 | T-21 | Reset |
| AC-23 | T-19 | Data rusak |
| AC-24 | T-28 | XSS |
| AC-25 | T-26 | Keyboard/fokus |
| AC-26 | T-25 | Responsif |
| AC-27 | T-29, T-30 | Tanpa jejak sensitif |
| AC-28 | T-31, T-32 | Build |
| AC-29 | T-18 | Toast (S) |
| AC-30 | T-22 | Antar-tab (S) |

**NFR:** performa → T-31/T-32; keamanan → T-28–T-30; aksesibilitas → T-26; responsif → T-25; kualitas → T-24/T-27.

---

## 14. Definisi Selesai (Global)

- [ ] Semua tugas **M** selesai dan acceptance criteria-nya tercentang.
- [ ] Semua AC wajib (AC-01–AC-28) lulus manual; AC-29/30 dicatat.
- [ ] `npm run build` + `npm run preview` bersih; tidak ada error console pada alur utama.
- [ ] Tidak ada secret/API key/data pribadi/request eksternal tak terduga.
- [ ] Tampilan lolos pemeriksaan UI-SPEC 10.1 (kontras, 360 px, keyboard, reduced motion).
- [ ] README memuat cara menjalankan, mengganti nomor WhatsApp, dan batasan demo.
- [ ] URL deployment demo (bila dikerjakan) lulus smoke test dan memiliki catatan rollback.
- [ ] Catatan Deviasi diperbarui bila ada scope/waktu yang berubah.

---

## 15. Catatan Deviasi

Isi hanya bila terjadi penyimpangan dari `SPEC.md`/`UI-SPEC.md`.

| Tanggal | Tugas/AC | Deviasi | Alasan | Dampak | Disetujui oleh |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

**Deviasi yang sudah diketahui sejak awal**

1. **Deployment (M9):** hanya demo statis; domain kustom, monitoring, dan SLA tidak dikerjakan (SPEC out-of-scope butir 12).
2. **Automated test:** tidak menjadi syarat rilis (SPEC out-of-scope butir 11); pengujian manual di M6.
3. **F-11 (toast) dan F-12 (antar-tab):** prioritas S; boleh dipotong bila waktu habis, dengan AC-29/30 ditandai tidak lulus.
4. **Nomor WhatsApp:** tetap fiktif; penggantian nomor latihan dilakukan manual di `src/config.js` dan dicatat di README.
