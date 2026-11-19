# UI-SPEC — Washly

**Spesifikasi antarmuka untuk katalog produk laundry "Washly"**

| Item | Keterangan |
|---|---|
| Versi | 1.0 |
| Mengacu pada | `SPEC.md` v1.0 (fitur F-01–F-12, AC-01–AC-30) |
| Palet | Aqua & Mint Green |
| Tipografi | Sans-serif sistem (tanpa font eksternal) |
| Pendekatan | Mobile-first, WCAG 2.1 AA |
| Cakupan | Desain visual & interaksi; **tanpa kode aplikasi** |

> Dokumen ini menentukan tampilan, token desain, state, dan wireframe teks. Implementasi belum dimulai. Semua nilai warna, ukuran, dan salinan (copy) di sini mengikat implementasi agar hasilnya dapat diperiksa manual terhadap `SPEC.md`.

---

## 1. Prinsip Desain

1. **Mobile-first, bukan mobile-only.** Tampilan 360 px adalah baseline; penambahan kolom dan kontrol inline terjadi pada breakpoint yang lebih lebar, bukan sebaliknya.
2. **Aqua = aksi, Mint = status.** Aqua dipakai untuk navigasi, tautan, dan tombol utama. Mint dipakai untuk status positif (unggulan, tersimpan, sukses) dan tombol WhatsApp. Warna tidak pernah menjadi satu-satunya pembeda status.
3. **Satu pola navigasi.** Navbar atas dengan dua tab (Katalog, Dashboard) di semua ukuran layar; tidak ada bottom-nav terpisah.
4. **Jujur dan transparan.** Label "Demo lokal", "Tanpa backend", dan "Tanpa login" terlihat, tanpa tombol atau halaman yang berpura-pura menjadi sistem produksi.
5. **Kontras dulu, estetika kedua.** Semua pasangan teks/latar wajib lolos AA (≥ 4.5:1 teks normal, ≥ 3:1 teks besar/komponen). Mint terang hanya dekoratif.
6. **Kontrol besar dan jelas.** Target sentuh minimum 44×44 px; fokus keyboard selalu terlihat; error tidak hanya berwarna merah.
7. **Ringan.** Tanpa gambar hero eksternal, tanpa font dari CDN, tanpa pustaka ikon; ikon berupa SVG inline.

---

## 2. Design Tokens

### 2.1 Warna

#### Palet inti

> Penamaan token (`aqua-*`, `mint-*`, `slate-*`) adalah nama internal untuk spesifikasi ini dan tidak harus mengikuti skala warna Tailwind. Implementasi wajib memakai nilai hex pada tabel.

| Token | Hex | Peran |
|---|---|---|
| `aqua-50` | `#ECFEFF` | Latar lembut, hover sekunder |
| `aqua-100` | `#CFFAFE` | Latar aktif, chip, ilustrasi |
| `aqua-200` | `#A5F3FC` | Border dekoratif, garis aksen |
| `aqua-600` | `#0891B2` | Dekorasi/ikon besar saja (bukan teks putih kecil) |
| `aqua-700` | `#0E7490` | **Primary**: tombol, tautan, fokus, harga |
| `aqua-800` | `#155E75` | Hover primary, teks pada latar aqua muda |
| `aqua-900` | `#083344` | Active/pressed, judul di latar aqua |
| `mint-50` | `#ECFDF5` | Latar lembut kedua, hero |
| `mint-100` | `#D1FAE5` | Badge unggulan, kartu ringkasan positif |
| `mint-200` | `#A7F3D0` | Dekorasi, garis aksen |
| `mint-500` | `#10B981` | **Dekorasi saja** (gagal kontras untuk teks) |
| `mint-700` | `#047857` | **Tombol WhatsApp**, teks sukses |
| `mint-800` | `#065F46` | Hover WhatsApp, teks badge unggulan |
| `ink` | `#0F172A` | Teks utama, judul |
| `slate-600` | `#334155` | Teks isi sekunder |
| `slate-500` | `#475569` | Teks sekunder/label |
| `slate-400` | `#64748B` | Placeholder, meta, ikon nonaktif |
| `border` | `#E2E8F0` | Garis, pemisah, border kartu |
| `border-strong` | `#CBD5E1` | Border input, garis tabel |
| `bg` | `#F8FAFC` | Latar halaman |
| `surface` | `#FFFFFF` | Kartu, navbar, panel |
| `danger` | `#B91C1C` | Error, hapus |
| `danger-bg` | `#FEF2F2` | Latar badge/alert bahaya |
| `warning` | `#92400E` | Stok menipis |
| `warning-bg` | `#FFFBEB` | Latar badge stok menipis |

#### Pasangan kontras yang disetujui

Rasio dihitung dengan rumus WCAG 2.1 (sRGB). Implementasi **tidak boleh** memakai pasangan di luar daftar ini untuk teks.

| Teks | Latar | Rasio | Standar |
|---|---|---|---|
| `#0F172A` ink | `#FFFFFF` surface | 17.85:1 | AAA |
| `#0F172A` ink | `#F8FAFC` bg | 17.06:1 | AAA |
| `#475569` slate-500 | `#FFFFFF` | 7.58:1 | AAA |
| `#64748B` slate-400 (meta/placeholder) | `#FFFFFF` | 4.76:1 | AA |
| `#FFFFFF` | `#0E7490` aqua-700 | 5.36:1 | AA |
| `#FFFFFF` | `#155E75` aqua-800 (hover) | 7.27:1 | AAA |
| `#0E7490` aqua-700 (tautan) | `#FFFFFF` | 5.36:1 | AA |
| `#0E7490` aqua-700 | `#ECFDF5` mint-50 | 5.09:1 | AA |
| `#155E75` aqua-800 | `#ECFEFF` aqua-50 | 6.99:1 | AAA |
| `#083344` aqua-900 | `#CFFAFE` aqua-100 (tab aktif) | 11.97:1 | AAA |
| `#FFFFFF` | `#047857` mint-700 (WhatsApp) | 5.48:1 | AA |
| `#FFFFFF` | `#065F46` mint-800 (hover WA) | 7.68:1 | AAA |
| `#065F46` mint-800 | `#D1FAE5` mint-100 (badge unggulan) | 6.78:1 | AAA |
| `#B91C1C` danger | `#FEF2F2` danger-bg | 5.91:1 | AA |
| `#92400E` warning | `#FFFBEB` warning-bg | 6.84:1 | AA |
| `#FFFFFF` | `#B91C1C` danger (tombol hapus) | 6.47:1 | AA |
| `#FFFFFF` | `#0F172A` ink (tooltip/overlay) | 17.85:1 | AAA |

#### Warna yang dilarang untuk teks

| Pasangan | Rasio | Alasan |
|---|---|---|
| `#FFFFFF` pada `#10B981` mint-500 | 2.54:1 | Gagal AA; mint-500 hanya dekorasi |
| `#FFFFFF` pada `#0891B2` aqua-600 | 3.68:1 | Hanya boleh untuk teks ≥ 24 px/19 px bold atau ikon dekoratif |
| `#64748B` pada `#E2E8F0` | 3.86:1 | Hanya untuk kontrol nonaktif (dikecualikan WCAG), tidak untuk teks informatif |

#### Aturan proporsi & pemakaian

- **60% netral** (putih, `bg`, teks ink), **25% aqua** (nav, tombol, tautan, aksen), **10% mint** (status, WhatsApp), **5% warna status lain** (warning/danger).
- Gradien hanya untuk latar dekoratif hero: `aqua-50 → mint-50 → mint-100` (135°). Tidak ada gradien pada tombol atau teks.
- Mint-500/`aqua-200` hanya untuk bentuk dekoratif tanpa teks (blob, garis, ikon besar `aria-hidden`).
- Status stok selalu disertai teks ("Stok: 24", "Stok tersisa 6", "Stok habis"), bukan warna saja.

### 2.2 Tipografi

| Token | Ukuran / line-height (mobile → desktop) | Berat | Pemakaian |
|---|---|---|---|
| `display` | 32/38 → 44/50 | 700 | Judul hero |
| `h1` | 26/32 → 32/40 | 700 | Judul halaman dashboard |
| `h2` | 20/28 → 24/32 | 700 | Judul seksi ("Filter", "Semua Produk") |
| `h3` | 17/24 → 18/26 | 600 | Nama produk di kartu |
| `body` | 15/23 → 16/26 | 400 | Paragraf, deskripsi |
| `body-sm` | 14/20 | 400 | Helper, deskripsi kartu |
| `label` | 13/18 | 600 | Label form, header tabel, label filter |
| `meta` | 12/16 | 500 | Badge, jumlah hasil, footer |
| `price` | 20/28 → 22/30 | 700 | Harga produk, `tabular-nums` |
| `metric` | 28/32 → 32/36 | 700 | Angka kartu ringkasan, `tabular-nums` |

**Font stack (tanpa unduhan):**

```text
system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif
```

Aturan:

- Tidak memuat font dari Google Fonts/CDN (NFR-P2, NFR-S2).
- Minimum ukuran teks 12 px; teks isi 15–16 px; input **16 px** agar tidak memicu zoom otomatis di iOS.
- Panjang baris paragraf maksimum 65 karakter (`max-width: 65ch`).
- Judul tidak boleh seluruhnya huruf kapital; eyebrow/overline boleh kapital dengan `letter-spacing: 0.08em`.
- Harga dan angka tabel memakai `font-variant-numeric: tabular-nums`.
- `text-wrap: balance` untuk judul, `pretty` untuk paragraf (fallback normal).

### 2.3 Spasi, radius, elevasi

| Kategori | Nilai |
|---|---|
| Skala spasi | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px |
| Padding halaman | 16 px (mobile) / 24 px (tablet) / 32 px (desktop) |
| Jarak antar-seksi | 32–40 px (mobile) / 56–64 px (desktop) |
| Gap grid produk | 16 px / 20 px / 24 px |
| Radius | 8 px (badge kecil), 12 px (tombol/input), 16 px (kartu/modal), 999 px (pill/chip) |
| Shadow-1 | `0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.10)` (kartu diam) |
| Shadow-2 | `0 8px 24px rgba(15,23,42,.12)` (hover kartu, modal, sheet) |
| Border | 1 px `#E2E8F0`; input 1 px `#CBD5E1` |

Kartu tidak memakai shadow besar saat diam; elevasi diberikan saat hover/fokus agar tampilan tetap tenang.

### 2.4 Ikon dan gerak

- Ikon: SVG inline, grid 24 px, `stroke-width: 1.75`, ujung bulat, warna `currentColor`. Ukuran tampil 16/20/24/28 px.
- Ikon wajib `aria-hidden="true"` bila berdampingan dengan teks; jika berdiri sendiri, tombolnya wajib punya `aria-label`.
- Ikon WhatsApp: glyph SVG inline 20 px, putih di dalam tombol mint-700. Tidak memuat aset merek eksternal.
- Durasi transisi: 120–180 ms (`ease-out`). Hover kartu: `translateY(-2px)` + shadow-2; gambar `scale(1.03)`.
- Sheet/ modal: fade + naik 8 px, 180 ms. Toast: fade + naik 4 px, 150 ms.
- `prefers-reduced-motion: reduce` → hilangkan transform/slide; hanya opacity 0–1 tanpa animasi berulang.

### 2.5 Z-index

| Lapisan | Nilai |
|---|---|
| Konten | 0 |
| Navbar sticky | 100 |
| Dropdown/select native | 150 |
| Backdrop sheet/modal | 200 |
| Panel sheet/modal | 210 |
| Toast | 300 |
| Skip link | 400 |

---

## 3. Layout dan Breakpoint

### 3.1 Breakpoint

| Nama | Rentang | Grid katalog | Toolbar filter | Dashboard |
|---|---|---|---|---|
| `base` | 360–639 px | 1 kolom | Search + tombol **Filter** (sheet) + sort ringkas | Ringkasan 2×2; daftar kartu |
| `sm` | 640–767 px | 2 kolom | Sheet | Ringkasan 2×2; daftar kartu |
| `md` | 768–1023 px | 2 kolom | Sheet (sama seperti mobile) | Ringkasan 4 kolom; tabel mulai tampil |
| `lg` | 1024–1279 px | 3 kolom | Inline penuh | Tabel penuh |
| `xl` | ≥ 1280 px | 4 kolom | Inline penuh | Tabel penuh, container 1200 px |

- Container: `max-width: 1200px`, margin auto. Di `xl` tetap 1200 px (bukan full-width) agar kartu tidak melebar berlebihan.
- Tidak ada scroll horizontal pada 360 px (NFR-R1). Pada 320 px, konten harus tetap reflow tanpa kehilangan fungsi (WCAG 1.4.10).
- Grid memakai kolom minimum 240 px; pada 1024–1279 px dengan sidebar tidak ada — katalog full-width container.
- Tabel dashboard: wrapper `overflow-x: auto` hanya untuk `md`/`lg`; di `base`/`sm` tabel diganti daftar kartu (tanpa scroll horizontal).

### 3.2 Anatomi halaman

**Katalog (`#/katalog`)**

1. Skip link
2. Navbar sticky (56/64 px)
3. Hero
4. Toolbar pencarian/filter/sort
5. Baris jumlah hasil + chip filter aktif
6. Grid produk **atau** empty state
7. Footer

**Dashboard (`#/dashboard`)**

1. Skip link
2. Navbar sticky
3. Header dashboard (judul, keterangan, aksi utama)
4. Banner mode demo (info)
5. Kartu ringkasan (4)
6. Tabel (desktop) / daftar kartu (mobile) — tanpa toolbar tambahan
7. Footer

Hero hanya ada di Katalog; Dashboard langsung ke konten agar pengelola cepat bekerja.

---

## 4. Komponen Global

### 4.1 Navbar

| Properti | Mobile | Desktop |
|---|---|---|
| Tinggi | 56 px | 64 px |
| Padding horizontal | 16 px | 32 px |
| Latar | `surface` 95% + `backdrop-filter: blur(8px)` | sama |
| Border bawah | 1 px `border` | sama |
| Posisi | sticky, `top: 0` | sama |
| Z-index | 100 | 100 |

Struktur: `brand` (logo + wordmark) — spacer — `nav` (dua tab) — `badge "Demo lokal"` (disembunyikan < 640 px).

- **Logo:** glyph tetes/busa 28 px, `aqua-700`, `aria-hidden`; wordmark "Washly" 20 px/700 `ink`. Brand adalah tautan ke `#/katalog`.
- **Tab Katalog/Dashboard:** tautan `<a href="#/katalog">` dan `#/dashboard`, tinggi 44 px, padding 0 12 px, radius 12 px, label 14/600.
  - Default: teks `slate-500`, latar transparan.
  - Hover: latar `aqua-50`, teks `aqua-800`.
  - Aktif: latar `aqua-100`, teks `aqua-900`, ikon terisi, `aria-current="page"`, border 1 px `aqua-200`.
  - Fokus: ring 2 px `aqua-700`, offset 2 px.
- **Badge "Demo lokal":** pill 24 px, latar `mint-100`, teks `mint-800`, ikon perisai/rumah 14 px. Hanya informatif, tidak dapat diklik.
- Mobile: wordmark 18–20 px; dua tab dengan ikon 18 px + label 13 px; total lebar harus muat pada 360 px tanpa mengecilkan target sentuh.

### 4.2 Tombol

| Varian | Latar | Teks | Border | Hover | Active | Nonaktif |
|---|---|---|---|---|---|---|
| Primary | `aqua-700` | putih | — | `aqua-800` | `aqua-900` | `border` bg, `slate-400` teks |
| Secondary | `surface` | `aqua-800` | 1 px `aqua-700` | `aqua-50` | `aqua-100` | `border` bg, `slate-400` |
| Ghost | transparan | `aqua-800` | — | `aqua-50` | `aqua-100` | `slate-400` |
| WhatsApp | `mint-700` | putih | — | `mint-800` | `mint-800` + inset shadow | `border` bg, `slate-400` |
| Danger | `danger` | putih | — | `#991B1B` | `#7F1D1D` | `border` bg, `slate-400` |
| Danger-ghost | transparan | `danger` | — | `danger-bg` | `danger-bg` | `slate-400` |

Ukuran:

| Ukuran | Tinggi | Padding-x | Teks | Ikon | Pemakaian |
|---|---|---|---|---|---|
| `sm` | 36 px (hit area 44 px) | 12 px | 13/600 | 16 px | Aksi tabel, chip |
| `md` | 44 px | 16 px | 14/600 | 18 px | Default semua tombol |
| `lg` | 48 px | 20 px | 16/600 | 20 px | CTA hero, submit form |

- Radius 12 px. `display: inline-flex`, gap 8 px, `justify-content: center`.
- Nonaktif wajib memakai atribut `disabled` (bukan hanya kelas visual) dan `aria-disabled` bila memakai elemen non-tombol.
- Tidak ada tombol ikon-saja tanpa `aria-label`; target sentuh tetap 44×44 px.
- Fokus: `outline: 2px solid aqua-700; outline-offset: 2px` (pada latar gelap/aqua: `aqua-900`).

### 4.3 Input, select, textarea

- Tinggi kontrol 44 px; radius 12 px; border 1 px `border-strong`; latar `surface`; teks 16 px `ink`; placeholder `slate-400` 15–16 px.
- Label 13/600 `slate-600`, jarak 6 px di atas kontrol. Placeholder tidak menggantikan label.
- Fokus: border 2 px `aqua-700` + ring 3 px `aqua-100`; tidak menghilangkan outline.
- Error: border 2 px `danger` + ring 3 px `#FEE2E2`; pesan 13/500 `danger` dengan ikon 14 px, `aria-describedby`.
- Helper: 12–13 px `slate-500`, jarak 4 px.
- Select memakai kontrol native yang di-style (chevron SVG inline); semua opsi memakai label teks.
- Textarea deskripsi: 3 baris, `resize: vertical`, counter "0/240" rata kanan.
- Input angka: `inputmode="numeric"`, atribut `min="0"`, `step="1"`; prefiks "Rp" statis di kiri untuk harga.

### 4.4 Chip, badge, dan indikator

| Komponen | Spesifikasi visual | Teks contoh |
|---|---|---|
| Chip kategori (kartu) | pill 24 px, latar `aqua-50`, teks `aqua-800` 12/600 | `Bahan Cuci` |
| Badge Unggulan | pill 24 px, latar `mint-100`, teks `mint-800` 12/600, ikon bintang 12 px | `★ Unggulan` |
| Badge stok habis | pill 24 px, latar `danger-bg`, teks `danger` 12/700, ikon 12 px | `Stok habis` |
| Badge stok menipis | pill 24 px, latar `warning-bg`, teks `warning` 12/600 | `Stok tersisa 6` |
| Indikator stok normal | titik 8 px `mint-700` + teks 14 px `slate-600` | `Stok: 24` |
| Chip filter aktif | pill 32 px, latar `aqua-50`, border `aqua-200`, teks `aqua-800` 13/500, tombol × 20 px | `Bahan Cuci ×` |
| Badge hasil | teks 13 px `slate-500` | `Menampilkan 8 dari 8 produk` |

- Ikon bintang bukan satu-satunya penanda unggulan — selalu ada kata "Unggulan".
- Untuk stok 0, baris indikator stok diganti satu badge **Stok habis** (tidak menampilkan "Stok: 0" sekaligus) agar tidak berulang.

### 4.5 Toast

- Posisi: mobile `bottom: 16px`, kiri-kanan 16 px, lebar penuh maks 400 px; desktop `bottom: 24px; right: 24px`, lebar maks 400 px.
- Latar `ink`, teks putih 14 px, ikon status 20 px (mint untuk sukses, merah untuk error), radius 12 px, shadow-2, padding 12–16 px.
- Sukses: ikon centang `mint-500`/teks putih; error: ikon seru `#FCA5A5`.
- Durasi 3 detik; dapat ditutup tombol × (target 44 px). `role="status"`, `aria-live="polite"`, tidak mencuri fokus.
- Maksimum satu toast terlihat; toast baru menggantikan yang lama.

### 4.6 Modal, sheet, dan dialog konfirmasi

- Desktop: panel tengah, lebar 560 px (form) / 440 px (konfirmasi), radius 16 px, shadow-2, maks tinggi 90vh, body scroll, footer sticky.
- Mobile: sheet dari bawah, lebar 100%, tinggi maks 92dvh, sudut atas 16 px, footer sticky + `safe-area-inset-bottom`.
- Backdrop `rgba(15,23,42,.55)`; klik backdrop menutup **kecuali** form dengan perubahan belum disimpan (tampilkan konfirmasi "Buang perubahan?").
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` judul; fokus awal ke field pertama (form) atau tombol Batal (konfirmasi); fokus terperangkap; `Esc` menutup; fokus kembali ke pemicu.
- Header: judul 18/700 + tombol tutup × 44 px di kanan; border bawah `border`.
- Footer: garis atas `border`, padding 16 px, tombol rata kanan (mobile: dua tombol sama lebar).

### 4.7 Empty state

- Wadah putih radius 16 px, padding 40 px 24 px, teks tengah, maks 480 px.
- Ikon lingkaran 56 px, latar `aqua-50`, ikon `aqua-700`.
- Judul 18/700, deskripsi 14/400 `slate-500`, satu tombol aksi.
- Varian:
  - **Filter/pencarian kosong:** "Tidak ada produk yang cocok" → tombol **Reset filter**.
  - **Katalog kosong (semua produk dihapus):** "Katalog masih kosong" → tombol **Tambah produk pertama** menuju `#/dashboard` dan membuka form.
- Empty state tidak boleh menghilangkan toolbar; pengguna harus tetap bisa mengubah pencarian.

### 4.8 Skip link

- Tautan pertama di DOM: "Lewati ke konten utama".
- Tersembunyi secara visual hingga fokus; saat fokus tampil di kiri atas dengan latar `ink`, teks putih, radius 8 px, padding 12 px 16 px.

---

## 5. Halaman Katalog

### 5.1 Hero

| Aspek | Mobile (base) | Desktop (≥ 1024) |
|---|---|---|
| Tinggi | auto, padding 28 px 16 px 32 px | min-height 288 px, padding 48 px 32 px |
| Latar | gradien `aqua-50 → mint-50` 135° + 2 blob dekoratif | gradien 3 warna `aqua-50 → mint-50 → mint-100` |
| Tata letak | 1 kolom | 2 kolom: teks 60% / panel dekoratif 40% |
| Eyebrow | "KATALOG LAUNDRY" 12/700, `aqua-800`, letter-spacing .08em | sama |
| Judul | "Kebutuhan laundry harian, rapi dalam satu katalog." `display` 32/38 | 44/50, maks 18 kata |
| Subjudul | "Deterjen, pewangi, dan perlengkapan pilihan. Cek stok, lalu pesan langsung via WhatsApp." 15/23 `slate-600`, maks 2–3 baris | 16/26, maks 60ch |
| CTA | **Lihat Produk ↓** (primary, lebar penuh) + **Kelola Katalog** (ghost, di bawahnya) | Dua tombol sejajar: primary + secondary |
| Statistik | Baris chip: `8 produk · 124 stok · via WhatsApp` (13 px) | Panel kartu kaca: 3 baris chip |

Detail:

- Angka "8 produk" dan "124 stok" **diambil dari data** sehingga ikut berubah setelah CRUD.
- Tombol "Lihat Produk" menggulir ke `#katalog-grid` (offset memperhitungkan navbar 56/64 px) dan memindahkan fokus ke judul seksi "Semua Produk".
- Panel dekoratif desktop: `aria-hidden="true"`, berisi 2–3 kartu mini bergaya placeholder (tanpa data produk nyata), blob mint/aqua, dan label "Data lokal". Tidak menampilkan angka palsu.
- Tidak ada gambar hero eksternal, video, atau carousel.
- Hero tidak sticky dan tidak mengulang navigasi.

### 5.2 Toolbar pencarian, filter, sorting

**Desktop / `lg` (inline):**

Satu baris grid: search (min 280 px, `1fr`) + Kategori (160 px) + Ketersediaan (160 px) + checkbox Unggulan (auto) + Urutkan (170 px) + tombol Reset (auto). Label kecil 13/600 di atas setiap kontrol, termasuk search. Urutan ini sama dengan wireframe 7.1.

**Mobile / `base`–`md`:**

- Baris 1: search 44 px lebar penuh (label tersembunyi secara visual, `aria-label="Cari produk"`).
- Baris 2: tombol **Filter** (secondary, menampilkan jumlah filter aktif) + select **Urutkan** ringkas (native) di kanan.
- Panel filter dibuka sebagai **bottom sheet** berisi: Kategori, Ketersediaan, checkbox Unggulan, tombol **Reset filter** (ghost) dan **Selesai** (primary, lebar penuh). Sorting tetap di toolbar, tidak diduplikasi di sheet.
- Perubahan filter di sheet **langsung diterapkan** (tanpa tombol Terapkan); tombol Selesai hanya menutup sheet. Jumlah filter aktif pada tombol = jumlah filter non-default (kategori, ketersediaan, unggulan; pencarian tidak dihitung).
- Sheet dapat ditutup via backdrop, tombol ×, `Esc`, atau Selesai; fokus kembali ke tombol pemicu.

**Search field:**

- Ikon kaca pembesar 18 px di kiri, padding kiri 40 px.
- Placeholder: "Cari nama, kategori, atau deskripsi".
- Tombol × 36 px (hit 44 px) muncul hanya saat ada teks; mengosongkan pencarian dan mengembalikan fokus ke input.
- Tanpa tombol submit; hasil diperbarui saat mengetik. Tanpa debounce yang terasa (> 150 ms tetap boleh, tetapi 8–200 produk harus terasa instan).
- `type="search"`, `autocomplete="off"`, `spellcheck="false"`, `enterkeyhint="search"`.

**Baris hasil & chip aktif:**

- Teks 13 px `slate-500`: `Menampilkan 8 dari 8 produk`, dibungkus `aria-live="polite"` (tanpa mengumumkan setiap ketikan berlebihan — gunakan `aria-live` pada wrapper hasil, bukan input).
- Chip filter aktif di bawah/kanan teks, masing-masing dengan tombol hapus (×) berlabel `Hapus filter Bahan Cuci`.
- Tautan **Reset filter** (ghost, 13 px) hanya tampil bila ada filter/pencarian aktif.
- Sorting **tidak** ditampilkan sebagai chip (bukan filter).

**Perilaku state:**

- Pencarian, filter, dan sorting tidak disimpan ke `localStorage` maupun URL; kembali ke default saat reload. Saat berpindah tab lalu kembali, state dipertahankan selama sesi halaman.
- Filter tidak mengubah data atau badge ringkasan dashboard.

### 5.3 Kartu produk

| Elemen | Spesifikasi |
|---|---|
| Wadah | `surface`, border 1 px `border`, radius 16 px, overflow hidden, flex column, tinggi konsisten |
| Gambar | rasio 4:3, `object-fit: cover`, latar `aqua-50`; badge unggulan absolute 12 px kiri-atas |
| Body | padding 16 px, gap 8 px |
| Nama | `h3` 17–18/600, maks 2 baris dengan ellipsis, tinggi baris tetap |
| Kategori | chip aqua-50 |
| Harga | 20–22/700 `aqua-800`, tabular-nums |
| Stok | ikon titik + teks 14 px; stok 0 diganti badge **Stok habis** (lihat 4.4) |
| Deskripsi | 14/20 `slate-500`, maks 2 baris (`line-clamp`), `min-height: 40px` |
| Pemisah | 1 px `border` sebelum CTA |
| CTA | tombol WhatsApp lebar penuh 44 px dengan ikon 20 px |
| Hover (desktop) | `translateY(-2px)`, border `aqua-200`, shadow-2; hanya bila `hover: hover` |
| Fokus | `:focus-within` ring 2 px `aqua-700` offset 2 px pada kartu |

Aturan tambahan:

- Semua kartu memiliki tinggi body seragam meski deskripsi berbeda (clamp 2 baris).
- Teks panjang (nama, kategori) tidak boleh menembus kartu; `overflow-wrap: anywhere`.
- Harga selalu format `Rp 32.000` (spasi setelah Rp, titik ribuan, tanpa desimal) dan tidak pernah dipecah baris.
- Kartu stok 0: gambar `filter: grayscale(35%) opacity(.8)`, badge **Stok habis**, CTA nonaktif. Kartu tetap dapat difokus dan dibaca.
- Gambar gagal dimuat: tampilkan blok placeholder `aqua-50` dengan monogram 2 huruf (huruf awal nama) 32/700 `aqua-800`; tidak ada ikon rusak. `alt` tetap dipertahankan pada elemen gambar.
- Alt gambar: `Ilustrasi {nama}` (contoh: "Ilustrasi Deterjen Cair Konsentrat 1L"). Jika gambar murni dekoratif, `alt=""`.
- Judul kartu bukan tautan (belum ada halaman detail); hanya CTA yang interaktif.

### 5.4 Tombol WhatsApp

| State | Tampilan | Perilaku |
|---|---|---|
| Default | Latar `mint-700`, teks putih 14/600, ikon WA 20 px, radius 12 px, tinggi 44 px | Membuka `wa.me` di tab baru |
| Hover | Latar `mint-800` | — |
| Active | `mint-800` + inset shadow | — |
| Fokus | Ring 2 px `aqua-900` offset 2 px | — |
| Nonaktif (stok 0) | Latar `border`, teks `slate-400`, ikon ikut memudar | `disabled`, label **Stok habis**, tidak dapat diklik/difokus |
| (Opsional) Loading | Tidak ada — tautan langsung | — |

- Label default: **WhatsApp** + ikon; `aria-label="Pesan {nama} via WhatsApp"` agar konteks produk jelas bagi pembaca layar.
- Ikon dan teks selalu bersama; tidak ada tombol ikon-saja.
- Lebar penuh kartu (termasuk pada desktop) agar target sentuh besar dan konsisten.
- Tombol tidak memakai warna merek WhatsApp terang (#25D366) karena gagal kontras; identitas tetap dikenali lewat ikon dan label.
- Saat diklik, tidak ada state "terkirim" palsu dan tidak ada pengurangan stok otomatis.

### 5.5 State katalog

| State | Tampilan |
|---|---|
| Default | Grid 8 produk + jumlah hasil |
| Pencarian/filter tanpa hasil | Empty state di dalam area grid; toolbar tetap terlihat; tombol Reset filter |
| Katalog kosong (0 produk) | Empty state "Katalog masih kosong" + CTA ke dashboard; hero tetap tampil dengan angka 0 |
| Gambar gagal | Placeholder monogram per kartu |
| Data lokal rusak | Toast info + katalog seed; tidak ada layar error penuh |
| Penyimpanan gagal | Banner peringatan tipis di atas grid (latar `warning-bg`, teks `warning`, tombol tutup) |
| Memuat | Tidak ada spinner; data sinkron. Skeleton hanya untuk gambar (blok `aqua-50` tanpa shimmer bila reduced motion) |

---

## 6. Dashboard Demo

### 6.1 Header

- `h1` "Dashboard demo" 26–32/700.
- Subjudul 14–16 px `slate-500`: "Kelola katalog di perangkat ini. Perubahan langsung tersimpan lokal."
- Banner info (bukan alert): latar `aqua-50`, border `aqua-200`, teks `aqua-800`, ikon info 16 px: "Mode demo — tanpa login, tanpa backend. Data hanya ada di browser ini."
- Aksi kanan (desktop) / bawah judul (mobile): **+ Tambah Produk** (primary, 44 px) dan **Reset ke data contoh** (danger-ghost, 44 px). Di mobile keduanya dapat ditumpuk; Tambah Produk lebih menonjol.
- Tidak ada sapaan personal, avatar, atau notifikasi palsu.

### 6.2 Kartu ringkasan

Grid 2×2 (mobile) / 4 kolom (≥ 768 px), gap 12–16 px.

| Kartu | Ikon | Aksen | Label | Nilai awal |
|---|---|---|---|---|
| Total produk | kotak/daftar | `aqua-700` di `aqua-50` | "Total produk" | 8 |
| Total stok | tumpukan | `aqua-700` di `aqua-50` | "Total stok" | 124 |
| Produk unggulan | bintang | `mint-800` di `mint-100` | "Produk unggulan" | 3 |
| Stok habis | seru | `danger` di `danger-bg` | "Stok habis" | 1 |

- Kartu: `surface`, border, radius 16 px, padding 16–20 px; ikon dalam kotak 36–40 px; nilai `metric` tabular-nums; label 12–13 px.
- Angka dirender ulang tanpa animasi hitung; animasi angka tidak dipakai agar tidak mengganggu pembaca layar.
- Setiap kartu memiliki teks label; warna tidak menjadi satu-satunya makna.
- Ringkasan tidak terpengaruh filter katalog (selalu total keseluruhan).

### 6.3 Tabel produk (≥ 768 px)

| Kolom | Lebar | Isi |
|---|---|---|
| Nama | 30% | Nama 14/600 + badge unggulan inline bila ada |
| Kategori | 16% | Chip kategori |
| Harga | 14% | `Rp 32.000` rata kanan, tabular-nums |
| Stok | 14% | Indikator stok + angka; badge habis/menipis |
| Unggulan | 8% | "Ya"/"Tidak" teks, bukan hanya ikon |
| Aksi | 18% | **Ubah** (secondary sm) + **Hapus** (danger-ghost sm), rata kanan |

- Header 12/600 `slate-500`, huruf kapital, `letter-spacing: .04em`, latar `bg`, sticky di dalam wrapper bila tabel panjang.
- Baris 56 px, border bawah 1 px `border`, hover `bg`.
- Nama panjang dipotong 1 baris + `title`/tooltip native.
- Tabel memakai `<caption class="sr-only">Daftar produk katalog</caption>`; header memakai `<th scope="col">`.
- Empty (0 produk): baris empty state di dalam kartu tabel dengan CTA tambah.
- Tidak ada bulk select, drag-and-drop, atau kolom tambahan.

### 6.4 Daftar kartu (mobile < 768 px)

- Kartu putih, padding 16 px, radius 12–16 px, gap 12 px.
- Baris 1: nama 15/600 (maks 2 baris) + badge unggulan.
- Baris 2: chip kategori + harga 16/700 `aqua-800`.
- Baris 3: status stok.
- Baris 4: dua tombol 44 px: **Ubah** (secondary, flex 1) dan **Hapus** (danger-ghost, flex 1).
- Tidak ada horizontal scroll; seluruh informasi terbaca vertikal.

### 6.5 Form tambah/ubah

Urutan field (mobile 1 kolom; desktop 2 kolom):

| Baris | Field | Kontrol | Catatan |
|---|---|---|---|
| 1 | Nama produk * | text, 100% | `maxlength=60`, helper "3–60 karakter" |
| 2 | Kategori * | input + `datalist` kategori yang ada | helper "Pilih yang ada atau ketik baru" |
| 2 | Harga (Rp) * | number, prefiks "Rp" | `min=0`, `step=1`, inputmode numeric |
| 3 | Stok * | number | `min=0`, `step=1` |
| 3 | Gambar * | select 8 placeholder + preview | preview 96×72 px, radius 8 px, `alt` nama gambar |
| 4 | Deskripsi | textarea 3 baris | `maxlength=240` + counter, lebar penuh |
| 5 | Unggulan | checkbox + label | "Tampilkan sebagai produk unggulan" |
| Footer | — | **Batal** + **Simpan Produk** / **Simpan Perubahan** | primary, 48 px di mobile |

- Judul modal: "Tambah Produk" / "Ubah Produk".
- Mode ubah: `id` tidak ditampilkan dan tidak dapat diedit.
- Setelah simpan: modal tertutup, toast sukses, fokus kembali ke **+ Tambah Produk** (tambah) atau tombol **Ubah** baris terkait (ubah). Baris/kartu yang baru diubah diberi highlight `aqua-50` selama 1.5 detik (opsional, hormati reduced motion).
- Jika penyimpanan localStorage gagal: modal tetap terbuka, banner error di atas footer, data di memori tidak hilang.
- Validasi persis mengikuti `SPEC.md` 5.3; pesan error di bawah field.
- Tombol simpan tidak pernah berstatus "loading" palsu; operasi sinkron.
- Tidak ada upload file/foto; hanya pemilihan placeholder.

### 6.6 Dialog konfirmasi

**Hapus produk**

- Judul: "Hapus produk?"
- Isi: "“Deterjen Cair Konsentrat 1L” akan dihapus dari katalog. Tindakan ini tidak dapat dibatalkan."
- Tombol: **Batal** (secondary) + **Hapus produk** (danger).
- Fokus awal pada Batal (aksi aman).

**Reset ke data contoh**

- Judul: "Reset ke data contoh?"
- Isi: "Semua perubahan lokal akan diganti dengan 8 produk contoh."
- Tombol: **Batal** + **Reset data** (danger).

**Buang perubahan (opsional)**

- Muncul bila form ditutup dengan isian berubah: "Buang perubahan?" → **Lanjut mengedit** / **Buang**.

Catatan: jika waktu implementasi mepet, `window.confirm` dapat dipakai (diizinkan `SPEC.md`), tetapi dialog kustom lebih konsisten secara visual dan aksesibel.

### 6.7 State dashboard

| State | Tampilan |
|---|---|
| Default | Ringkasan + 8 baris/kartu |
| 0 produk | Ringkasan 0 dan empty state dengan CTA tambah |
| Simpan sukses | Toast "Produk berhasil ditambahkan." / "Perubahan disimpan." |
| Hapus sukses | Toast "Produk dihapus." |
| Reset sukses | Toast "Katalog dikembalikan ke data contoh." |
| Data lokal rusak | Toast info "Data lokal tidak valid. Katalog dikembalikan ke data contoh." |
| Penyimpanan gagal | Banner error persisten + toast "Penyimpanan lokal gagal. Perubahan hanya berlaku selama sesi ini." |
| Validasi gagal | Pesan per field + fokus ke field pertama tidak valid; modal tidak tertutup |

---

## 7. Wireframe Teks

Keterangan: `[n]` adalah anotasi yang dijelaskan di bawah tiap wireframe. Lebar karakter bersifat ilustratif, bukan ukuran piksel.

### 7.1 Katalog — Desktop (1280 px)

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  (◉) Washly            [ Katalog ]  Dashboard                       [ Demo lokal ]           │ [1]
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  KATALOG LAUNDRY                                          ╭───────────────────────────────╮  │
│  Kebutuhan laundry harian,                                │  ✦ 8 produk                   │  │
│  rapi dalam satu katalog.                                 │  ✦ 124 stok                   │ [2]
│                                                           │  ✦ Pesan via WhatsApp         │  │
│  Deterjen, pewangi, dan perlengkapan pilihan.             ╰───────────────────────────────╯  │
│  Cek stok, lalu pesan langsung via WhatsApp.                                                 │
│                                                                                              │
│  [ Lihat Produk ↓ ]    [ Kelola Katalog ]                                                    │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  Cari produk             Kategori          Ketersediaan       Unggulan        Urutkan         │
│  [⌕ Cari nama, kategori…] [Semua       ▾]  [Semua       ▾]   [ ] Saja       [Nama A–Z  ▾]    │ [3]
│                                                                                              │
│  Menampilkan 8 dari 8 produk                                                                 │ [4]
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐  ┌─────────────────┐ │
│  │  GAMBAR 4:3        │  │  GAMBAR 4:3        │  │  GAMBAR 4:3        │  │  GAMBAR 4:3     │ │
│  │  [★ Unggulan]      │  │                    │  │                    │  │  [★ Unggulan]   │ │
│  ├────────────────────┤  ├────────────────────┤  ├────────────────────┤  ├─────────────────┤ │ [5]
│  │ Deterjen Cair 1L   │  │ Deterjen Bubuk 800g│  │ Pelembut Pakaian 1L│  │ Pewangi Lavender│ │
│  │ (Bahan Cuci)       │  │ (Bahan Cuci)       │  │ (Bahan Cuci)       │  │ (Pewangi)       │ │
│  │ Rp 32.000          │  │ Rp 21.000          │  │ Rp 27.000          │  │ Rp 35.000       │ │
│  │ ● Stok: 24         │  │ ● Stok: 40         │  │ ● Stok: 18         │  │ ● Stok: 15      │ │
│  │ Deterjen cair …    │  │ Deterjen bubuk …   │  │ Pelembut …         │  │ Pewangi …       │ │
│  │ [   WhatsApp    ]  │  │ [   WhatsApp    ]  │  │ [   WhatsApp    ]  │  │ [  WhatsApp   ] │ │ [6]
│  └────────────────────┘  └────────────────────┘  └────────────────────┘  └─────────────────┘ │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐  ┌─────────────────┐ │
│  │ Parfum Sachet      │  │ Pemutih Pakaian    │  │ Plastik Kemasan    │  │ Hanger Plastik  │ │
│  │ [Stok habis]       │  │                    │  │                    │  │                 │ │
│  │ Rp 18.000          │  │ Rp 15.000          │  │ Rp 24.000          │  │ Rp 19.000       │ │
│  │ [ Stok habis     ] │  │ [   WhatsApp    ]  │  │ [   WhatsApp    ]  │  │ [  WhatsApp   ] │ │ [7]
│  └────────────────────┘  └────────────────────┘  └────────────────────┘  └─────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  Washly · Demo lokal · Tanpa backend · Tanpa login                             © 2026        │ [8]
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

Anotasi:

1. Navbar sticky 64 px; tab aktif bergaya pill aqua; badge "Demo lokal" mint.
2. Hero 2 kolom, gradien aqua→mint, angka statistik dari data; panel kanan dekoratif (`aria-hidden`).
3. Toolbar inline: label kecil di atas kontrol; search dominan; semua target 44 px.
4. Baris hasil `aria-live`; saat filter aktif, chip filter dan tautan Reset muncul di baris ini (lihat 5.2). Sorting tidak menjadi chip.
5. Grid 4 kolom, gap 24 px; badge unggulan menempel pada gambar.
6. CTA WhatsApp lebar penuh, warna mint-700, ikon + label.
7. Produk stok 0 tetap tampil; gambar diredupkan; tombol nonaktif berlabel "Stok habis".
8. Footer netral, menyatakan batasan produk.

### 7.2 Katalog — Mobile (375 px)

```text
┌──────────────────────────────────────────┐
│  (◉) Washly      [Katalog] [Dashboard]   │ [1]
├──────────────────────────────────────────┤
│  KATALOG LAUNDRY                         │
│  Kebutuhan laundry harian, rapi          │ [2]
│  dalam satu katalog.                     │
│  [ Lihat Produk ↓ ]                      │
│  [ Kelola Katalog ]                      │
│  8 produk · 124 stok · via WhatsApp      │
├──────────────────────────────────────────┤
│  [⌕ Cari nama, kategori…          ] [×]  │ [3]
│  [ Filter (1) ▾ ]          [Nama A–Z ▾]  │
│  Menampilkan 4 dari 8 produk             │ [4]
│  ( Bahan Cuci × )   Reset filter         │
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │  GAMBAR 4:3            [★ Unggulan] │  │
│  ├────────────────────────────────────┤  │
│  │ Deterjen Cair Konsentrat 1L        │  │
│  │ (Bahan Cuci)                       │  │ [5]
│  │ Rp 32.000                          │  │
│  │ ● Stok: 24                         │  │
│  │ Deterjen cair pekat untuk cucian…  │  │
│  │ [            WhatsApp            ] │  │ [6]
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  … kartu berikutnya (1 kolom)      │  │
│  └────────────────────────────────────┘  │
├──────────────────────────────────────────┤
│  Washly · Demo lokal                     │ [7]
└──────────────────────────────────────────┘
```

Anotasi:

1. Navbar 56 px; dua tab tetap terlihat tanpa menu hamburger; target ≥ 44 px.
2. Hero dipadatkan: tanpa panel dekoratif, CTA utama selebar layar, statistik satu baris yang boleh wrap.
3. Search penuh + tombol bersihkan; label visual disembunyikan tetapi `aria-label` tersedia.
4. Jumlah hasil + chip aktif; tombol filter menampilkan jumlah filter aktif.
5. Satu kolom, gambar 4:3, nama maksimal 2 baris.
6. Tombol WhatsApp 44 px, nyaman disentuh.
7. Footer ringkas; tidak ada elemen mengambang yang menutupi konten.

### 7.3 Filter — Bottom Sheet Mobile (375 px)

```text
        (latar belakang halaman meredup, tidak interaktif)
┌──────────────────────────────────────────┐
│              ▁▁▁▁▁▁ (handle)             │ [1]
│  Filter                             [×]  │
├──────────────────────────────────────────┤
│  Kategori                                │
│  [ Semua                              ▾ ]│
│                                          │
│  Ketersediaan                            │
│  [ Semua                              ▾ ]│ [2]
│                                          │
│  [✓] Unggulan saja                       │
│                                          │
├──────────────────────────────────────────┤
│  [ Reset filter ]        [   Selesai   ] │ [3]
└──────────────────────────────────────────┘
```

Anotasi:

1. Sheet maksimum 85–92dvh, sudut atas membulat, `role="dialog"`, fokus terperangkap, `Esc` menutup.
2. Hanya filter (Kategori, Ketersediaan, Unggulan); perubahan langsung diterapkan; sorting berada di toolbar, bukan di sheet.
3. Footer sticky; "Reset filter" ghost/danger-ghost, "Selesai" primary selebar sisa ruang; aman terhadap `safe-area-inset-bottom`.

### 7.4 Dashboard — Desktop (1280 px)

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  (◉) Washly              Katalog   [ Dashboard ]                    [ Demo lokal ]             │ [1]
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  Dashboard demo                              [ Reset ke data contoh ]  [ + Tambah Produk ]    │
│  Kelola katalog di perangkat ini.                                                            │
│  Perubahan langsung tersimpan lokal.                                                          │ [2]
│                                                                                              │
│  (i) Mode demo — tanpa login, tanpa backend. Data hanya ada di browser ini.                  │ [3]
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐          │
│  │ ▣  Total produk  │ │ ▣  Total stok    │ │ ★  Produk unggulan│ │ !  Stok habis    │          │
│  │    8             │ │    124           │ │    3             │ │    1             │          │ [4]
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘          │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  NAMA PRODUK          KATEGORI      HARGA        STOK        UNGGULAN      AKSI                │ [5]
│  ──────────────────────────────────────────────────────────────────────────────────────────  │
│  Deterjen Cair 1L     (Bahan Cuci)  Rp 32.000    ● 24        Ya           Ubah   Hapus        │
│  Deterjen Bubuk 800g  (Bahan Cuci)  Rp 21.000    ● 40        Tidak        Ubah   Hapus        │
│  Pelembut Pakaian 1L  (Bahan Cuci)  Rp 27.000    ● 18        Tidak        Ubah   Hapus        │
│  Pewangi Lavender 1L  (Pewangi)     Rp 35.000    ● 15        Ya           Ubah   Hapus        │
│  Parfum Sachet 10 pcs (Pewangi)     Rp 18.000    [Habis]     Tidak        Ubah   Hapus        │
│  …                                                                                           │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  8 produk · data lokal                                                                       │ [6]
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

Anotasi:

1. Navbar yang sama; tab Dashboard aktif.
2. Header dengan dua aksi; Tambah Produk primary, Reset danger-ghost agar tidak bersaing.
3. Banner info aqua, bukan peringatan; menjelaskan batasan demo.
4. Empat kartu ringkasan, angka tabular; aksen berbeda per makna + label teks.
5. Tabel dengan header kapital, baris 56 px, aksi berlabel teks (bukan ikon-saja).
6. Footer ringkas; tanpa pagination karena data kecil.

### 7.5 Dashboard — Mobile (375 px)

```text
┌──────────────────────────────────────────┐
│  (◉) Washly     [Katalog] [Dashboard]    │ [1]
├──────────────────────────────────────────┤
│  Dashboard demo                          │
│  Data tersimpan di perangkat ini.        │ [2]
│  [ + Tambah Produk ]                     │
│  [ Reset ke data contoh ]                │
│  (i) Mode demo, tanpa backend.           │
├──────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  │
│  │ Total produk 8 │  │ Total stok 124 │  │ [3]
│  └────────────────┘  └────────────────┘  │
│  ┌────────────────┐  ┌────────────────┐  │
│  │ Unggulan 3     │  │ Stok habis 1   │  │
│  └────────────────┘  └────────────────┘  │
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │ Deterjen Cair Konsentrat 1L  [★]   │  │
│  │ (Bahan Cuci) · Rp 32.000           │  │ [4]
│  │ ● Stok: 24                         │  │
│  │ [    Ubah    ]   [    Hapus    ]   │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ Deterjen Bubuk 800g                │  │
│  │ (Bahan Cuci) · Rp 21.000           │  │
│  │ ● Stok: 40                         │  │
│  │ [    Ubah    ]   [    Hapus    ]   │  │ [4]
│  └────────────────────────────────────┘  │
│  …                                       │
├──────────────────────────────────────────┤
│  Washly · Demo lokal                     │ [5]
└──────────────────────────────────────────┘
```

Anotasi:

1. Navbar sama; tidak ada bottom-nav.
2. Aksi ditumpuk vertikal, Tambah Produk tetap paling menonjol; banner info dipersingkat.
3. Ringkasan 2×2; angka besar, label di atas.
4. Daftar kartu menggantikan tabel; dua tombol 44 px sejajar; tidak ada scroll horizontal.
5. Footer.

### 7.6 Form Produk — Desktop dan Mobile

```text
DESKTOP — modal 560 px di tengah, backdrop gelap
        ┌────────────────────────────────────────────┐
        │  Tambah Produk                        [×]  │ [1]
        ├────────────────────────────────────────────┤
        │  Nama produk *                             │
        │  [                                      ]  │
        │  3–60 karakter                             │
        │                                            │
        │  Kategori *              Harga (Rp) *      │
        │  [                    ]  [  0           ]  │ [2]
        │                                            │
        │  Stok *                  Gambar *          │
        │  [                    ]  [ Pilih      ▾ ]  │
        │                          [ preview 96×72 ] │
        │                                            │
        │  Deskripsi                                 │
        │  [                                      ]  │
        │  [                                      ]  │
        │                                     0/240  │
        │                                            │
        │  [✓] Tampilkan sebagai produk unggulan     │ [3]
        ├────────────────────────────────────────────┤
        │                    [ Batal ]  [ Simpan ]   │ [4]
        └────────────────────────────────────────────┘

MOBILE — sheet layar penuh (375 px)
┌──────────────────────────────────────────┐
│  Tambah Produk                      [×]  │
├──────────────────────────────────────────┤
│  Nama produk *                           │
│  [                                    ]  │
│  3–60 karakter                           │
│  Kategori *                              │
│  [                                    ]  │
│  Harga (Rp) *                            │
│  [ Rp                               ]   │
│  Stok *                                  │
│  [                                    ]  │
│  Deskripsi                               │
│  [                                    ]  │
│  [                                    ]  │
│  0/240                                   │
│  Gambar *                                │
│  [ Pilih gambar                     ▾ ]  │
│  [ preview 4:3                        ]  │
│  [✓] Tampilkan sebagai unggulan          │
├──────────────────────────────────────────┤
│  [  Batal  ]        [ Simpan Produk  ]   │
└──────────────────────────────────────────┘
```

Anotasi:

1. Judul modal + tombol tutup 44 px; fokus awal ke field Nama.
2. Desktop dua kolom untuk field pendek; mobile satu kolom, urutan tetap logis.
3. Checkbox unggulan dengan label penuh; bukan switch tanpa teks.
4. Footer sticky; tombol Batal secondary, Simpan primary 48 px; jarak aman dari keyboard virtual.

---

## 8. Aksesibilitas

### 8.1 Checklist wajib (WCAG 2.1 AA)

| Area | Requirement | Verifikasi manual |
|---|---|---|
| Bahasa | `<html lang="id">`; istilah asing tidak diterjemahkan paksa | Lihat source/DevTools |
| Landmark | `header`, `nav`, `main`, `footer`; satu `h1` per halaman | DevTools accessibility tree |
| Skip link | Tautan pertama, terlihat saat fokus, menuju `main` | Tekan `Tab` pertama kali |
| Judul | Hierarki h1 → h2 → h3 tanpa lompatan | Inspeksi heading |
| Navbar | Tab memakai `aria-current="page"` untuk halaman aktif | Fokus tab, cek atribut |
| Fokus | Ring 2 px + offset 2 px, tidak pernah `outline: none` tanpa pengganti | Tab melalui semua kontrol |
| Kontrol | Semua input punya label/`aria-label`; error via `aria-describedby` | Inspeksi tiap field |
| Hit target | Minimum 44×44 px, jarak ≥ 8 px antar target | Ukur di DevTools |
| Status | Stok/unggulan/error memakai teks + ikon, bukan warna saja | Matikan warna (simulasi) |
| Live region | Jumlah hasil dan toast `aria-live="polite"`; tidak agresif | Uji dengan screen reader |
| Modal | `role="dialog"`, `aria-modal`, fokus terperangkap, `Esc`, fokus kembali | Uji keyboard |
| Gambar | `alt` deskriptif; dekoratif `alt=""` + `aria-hidden` | Inspeksi |
| Zoom | 200% tanpa kehilangan konten/fungsi; reflow pada 320 px | Zoom browser |
| Gerak | `prefers-reduced-motion` menonaktifkan transform/slide | Emulasi media |
| Waktu | Tidak ada batas waktu, carousel, atau auto-advance | Observasi |
| Tabel | `<caption>` tersembunyi, `th scope="col"`, urutan baca logis | DevTools |

### 8.2 Peta keyboard

| Konteks | Tombol | Aksi |
|---|---|---|
| Global | `Tab` / `Shift+Tab` | Pindah fokus sesuai urutan visual |
| Global | `Enter` pada tab | Pindah halaman |
| Search | `Esc` | Kosongkan pencarian (bila ada teks) |
| Sheet filter | `Esc` | Tutup sheet, fokus ke tombol pemicu |
| Sheet filter | `Tab` | Terperangkap di dalam sheet |
| Modal form | `Esc` | Tutup (konfirmasi bila ada perubahan) |
| Modal form | `Enter` di field teks | Tidak submit otomatis (cegah simpan tak sengaja); submit hanya lewat tombol |
| Dialog konfirmasi | `Esc` | Batal |
| Toast | `Tab` | Dapat mencapai tombol tutup, tetapi toast tidak mencuri fokus |

### 8.3 Detail state fokus per latar

| Latar | Warna ring | Offset |
|---|---|---|
| Putih / `bg` | `aqua-700` | 2 px |
| `aqua-100` / `aqua-50` | `aqua-900` | 2 px |
| `mint-100` | `aqua-900` | 2 px |
| Tombol aqua-700 | `aqua-900` | 2 px |
| Tombol mint-700 | `aqua-900` | 2 px |
| Backdrop gelap | putih | 2 px |

### 8.4 Kontras ikon dan komponen non-teks

- Ikon penting (search, WhatsApp, status) minimal 3:1 terhadap latar.
- Border input `#CBD5E1` terhadap putih = 1.5:1 — **bukan** satu-satunya penanda; fokus menambah border 2 px aqua-700.
- Grafik/indikator tidak ada; tidak perlu pola alternatif.

---

## 9. Copy dan Mikrokopi

Semua teks antarmuka berbahasa Indonesia, sapaan netral, tanpa tanda seru berlebihan.

| Lokasi | Teks |
|---|---|
| Judul tab browser | `Washly — Katalog Produk Laundry` |
| Navbar | `Katalog`, `Dashboard`, badge `Demo lokal` |
| Hero eyebrow | `KATALOG LAUNDRY` |
| Hero judul | `Kebutuhan laundry harian, rapi dalam satu katalog.` |
| Hero subjudul | `Deterjen, pewangi, dan perlengkapan pilihan. Cek stok, lalu pesan langsung via WhatsApp.` |
| CTA hero | `Lihat Produk ↓`, `Kelola Katalog` |
| Search placeholder | `Cari nama, kategori, atau deskripsi` |
| Label filter | `Kategori`, `Ketersediaan`, `Urutkan`, `Unggulan saja` |
| Opsi ketersediaan | `Semua`, `Tersedia`, `Habis` |
| Opsi sorting | `Nama A–Z`, `Harga terendah`, `Harga tertinggi`, `Stok terbanyak`, `Unggulan dulu` |
| Tombol filter mobile | `Filter` / `Filter (2)` |
| Reset | `Reset filter` |
| Jumlah hasil | `Menampilkan {x} dari {y} produk` |
| Stok | `Stok: {n}`, `Stok tersisa {n}`, `Stok habis` |
| CTA produk | `WhatsApp` (aria-label: `Pesan {nama} via WhatsApp`) |
| Empty pencarian | `Tidak ada produk yang cocok` / `Coba kata kunci lain atau reset filter.` |
| Empty katalog | `Katalog masih kosong` / `Tambahkan produk pertama lewat dashboard demo.` |
| Dashboard judul | `Dashboard demo` |
| Banner demo | `Mode demo — tanpa login, tanpa backend. Data hanya ada di browser ini.` |
| Tombol dashboard | `+ Tambah Produk`, `Reset ke data contoh`, `Ubah`, `Hapus` |
| Label ringkasan | `Total produk`, `Total stok`, `Produk unggulan`, `Stok habis` |
| Modal tambah/ubah | `Tambah Produk`, `Ubah Produk`, `Simpan Produk`, `Simpan Perubahan`, `Batal` |
| Field | `Nama produk`, `Kategori`, `Harga (Rp)`, `Stok`, `Deskripsi`, `Gambar` |
| Helper | `3–60 karakter`, `Pilih yang ada atau ketik baru`, `Maksimal 240 karakter` |
| Checkbox | `Tampilkan sebagai produk unggulan` |
| Konfirmasi hapus | `Hapus produk?` / `"{nama}" akan dihapus dari katalog. Tindakan ini tidak dapat dibatalkan.` |
| Konfirmasi reset | `Reset ke data contoh?` / `Semua perubahan lokal akan diganti dengan 8 produk contoh.` |
| Toast sukses | `Produk berhasil ditambahkan.` / `Perubahan disimpan.` / `Produk dihapus.` / `Katalog dikembalikan ke data contoh.` |
| Toast error | `Penyimpanan lokal gagal. Perubahan hanya berlaku selama sesi ini.` |
| Toast data rusak | `Data lokal tidak valid. Katalog dikembalikan ke data contoh.` |
| Footer | `Washly · Demo lokal · Tanpa backend · Tanpa login` |

Aturan copy:

- Nama tombol memakai kata kerja; hindari "OK"/"Submit".
- Konfirmasi destruktif menyebut nama objek dan akibatnya.
- Tidak ada klaim "real-time", "aman", "terenkripsi", atau "gratis ongkir".
- Harga selalu `Rp` + spasi + angka bertitik; tidak memakai "IDR" atau "Rp32rb".

---

## 10. Design QA dan Ketertelusuran

### 10.1 Checklist visual manual

| # | Pemeriksaan | Lulus bila |
|---|---|---|
| UI-01 | Kontras | Semua pasangan teks memakai tabel 2.1; tidak ada teks pada mint-500 |
| UI-02 | Mobile 360/375 | Tidak ada scroll horizontal; navbar muat; kartu 1 kolom; target ≥ 44 px |
| UI-03 | Tablet 768 | Grid 2 kolom; ringkasan 4 kolom; tabel mulai tampil tanpa terpotong |
| UI-04 | Desktop 1280 | Container 1200 px; grid 4 kolom; toolbar inline rapi |
| UI-05 | Zoom 200% | Semua teks/aksi tetap dapat diakses; tidak ada konten terpotong |
| UI-06 | Keyboard | Seluruh alur dapat diselesaikan tanpa mouse; fokus selalu terlihat |
| UI-07 | Screen reader | Tab terbaca, produk terbaca berurutan, error terbaca, toast diumumkan |
| UI-08 | State stok | Tiga varian stok terlihat berbeda dan berlabel teks |
| UI-09 | Gambar rusak | Placeholder monogram muncul, layout tidak bergeser |
| UI-10 | Empty state | Pencarian kosong dan katalog kosong dapat dibedakan dan direset |
| UI-11 | Reduced motion | Tidak ada transform/slide saat preferensi aktif |
| UI-12 | Konsistensi copy | Semua string sesuai Bagian 9; tidak ada teks Inggris liar |

### 10.2 Ketertelusuran ke `SPEC.md`

| Fitur/AC | Komponen UI |
|---|---|
| F-01/AC-01 | Grid katalog, kartu produk, hero statistik |
| F-02/AC-03–04 | Rasio gambar 4:3, placeholder monogram, `alt` |
| F-03/AC-05 | Kartu produk, format Rupiah, indikator stok |
| F-04/AC-06–08 | Search field, tombol bersihkan, empty state |
| F-05/AC-09–11 | Toolbar filter, sheet mobile, chip aktif |
| F-06/AC-12–13 | Select sorting, urutan tampilan |
| F-07/AC-14–15 | Tombol WhatsApp, state nonaktif |
| F-08/AC-17–22 | Header dashboard, tabel/kartu, modal form, dialog konfirmasi |
| F-09/AC-16 | Kartu ringkasan 2×2/4 kolom |
| F-10/AC-23 | Toast data rusak, banner penyimpanan gagal |
| F-11/AC-29 | Toast |
| F-12/AC-30 | Render ulang tanpa perubahan visual khusus |
| NFR-A1–A6 | Bagian 8 |
| NFR-R1–R4 | Bagian 3 dan 10.1 |

### 10.3 Yang tidak termasuk desain ini

- Dark mode dan tema kustom (out of scope `SPEC.md`).
- Ilustrasi/foto hero eksternal, animasi hero, carousel.
- Halaman detail produk, keranjang, checkout, dan halaman login.
- Grafik analitik, kalender, atau laporan.
- PWA, mode offline penuh, dan notifikasi push.
- Desain cetak/invoice.

---

## 11. Handoff Ringkas untuk Implementasi

1. Buat token warna/tipe/spasi sebagai CSS custom properties di `src/styles.css`; jangan menulis hex langsung di komponen.
2. Bangun Navbar + skip link lebih dulu, lalu Katalog (hero → toolbar → grid), baru Dashboard (ringkasan → tabel → form).
3. Gunakan breakpoint 640/768/1024/1280 px; uji 360 px setiap kali menambah komponen.
4. Terapkan state fokus, nonaktif, dan error bersamaan dengan komponennya — jangan ditunda.
5. Cek kontras tiap pasangan baru dengan DevTools sebelum menambah warna.
6. Verifikasi akhir memakai checklist 10.1 dan AC terkait di `SPEC.md`.
