# Product Requirements Document (PRD): CMS Portal Sekolah SMP (WordPress-Style)

## 1. Ringkasan Proyek (Project Overview)
Membangun Content Management System (CMS) dan Portal Resmi tingkat Sekolah Menengah Pertama (SMP) yang memiliki fleksibilitas manajemen konten setara WordPress (Gutenberg Block Editor, Dynamic Menu Builder, Media Library, dan Role-Based Access Control), namun dibangun di atas arsitektur monolitik modern menggunakan Laravel 12, Inertia.js (React + SSR), dan MySQL.

* **Target Pengguna:** Pengunjung publik (Siswa, Orang Tua, Calon Wali Murid), Staf Tata Usaha (Super Admin), Guru/Pembina (Editor), dan Pengurus OSIS/Ekskul (Contributor).
* **Prinsip Desain Utama:** Clean Editorial & Institutional Aesthetic ("Anti-AI Slop") dengan memanfaatkan `@heroicons/react` sepenuhnya tanpa ketergantungan pada `lucide-react`.

---

## 2. Tech Stack & Arsitektur Sistem
* **Backend Framework:** Laravel 12 (PHP 8.3+)
* **Frontend & Glue:** React 19 + Inertia.js (dengan fitur **Server-Side Rendering / SSR** aktif untuk optimasi SEO halaman publik)
* **Database:** MySQL 8.0+ (memanfaatkan tipe data `JSON` untuk blok konten dan pengaturan dinamis)
* **Styling & UI Primitives:** Tailwind CSS + Headless UI / Radix UI
* **Iconography:** `@heroicons/react` (`24/outline` untuk navigasi struktural, `24/solid` dan `20/solid` untuk aksi toolbar dan status badge). **Strict Constraint:** Dilarang menggunakan `lucide-react`.
* **Block Editor Engine:** `@blocknote/react` atau `Tiptap` (menyimpan output dalam bentuk JSON terstruktur, mendukung *slash command* `/`, tabel, callout, dan embed).
* **Core Packages:**
  * `spatie/laravel-permission` (RBAC & Otorisasi)
  * `spatie/laravel-medialibrary` (Konversi otomatis foto ke `.webp` & manajemen dokumen PDF)
  * `laravel/fortify` (Autentikasi backend)
  * `tightenco/ziggy` (Sinkronisasi named routes Laravel ke React)

---

## 3. Matriks Hak Akses (Role-Based Access Control)

| Role | Cakupan Akses Utama |
| :--- | :--- |
| **Super Admin (TU / IT)** | Akses penuh ke seluruh modul: pengaturan identitas sekolah, menu builder, manajemen user, direktori guru, persetujuan artikel, dan pengelolaan halaman statis. |
| **Editor (Guru / Humas)** | Membuat, menyunting, dan mempublikasikan berita (`post`), pengumuman (`announcement`), agenda akademik, serta mengelola galeri media. |
| **Contributor (OSIS / Ekskul)** | Menulis draf berita kegiatan siswa/ekskul dan mengunggah foto dokumentasi. Status publikasi tertahan di `pending_review` hingga disetujui Editor/Super Admin. |

---

## 4. Spesifikasi Fitur Fungsional (Functional Requirements)

### 4.1. Modul Inti CMS ("WordPress-Wannabe" Core)
1. **Unified Content Engine (Posts, Pages, Announcements):**
   * Mendukung pembuatan Berita (`post`), Halaman Statis seperti Visi-Misi/Sejarah (`page`), dan Pengumuman Resmi (`announcement`).
   * **Block-Based Editor:** Mendukung blok Heading, Paragraph, Image (dengan *caption* & *alignment*), File Attachment (unduh PDF surat edaran), Table (jadwal/rekap), dan YouTube Embed.
   * **Publishing Workflow:** Mendukung status `draft`, `pending_review`, `scheduled` (terbit otomatis sesuai `published_at`), dan `published`.
   * **Built-in SEO Panel:** Input khusus untuk `meta_title`, `meta_description`, `canonical_url`, dan *preview* kartu OpenGraph (WhatsApp/Facebook share).
2. **Centralized Media Library:**
   * Modal *picker* gambar terpusat seperti WordPress Media Library (bisa memilih gambar yang sudah pernah diunggah atau unggah baru via *drag-and-drop*).
   * Kompresi dan konversi otomatis gambar JPG/PNG ke format `.webp` dengan pembuatan ukuran *thumbnail*, *medium*, dan *hero*.
3. **Dynamic Menu Builder:**
   * Pengelolaan navigasi Header dan Footer secara dinamis dari dashboard tanpa ubah kode.
   * Mendukung struktur *nested dropdown* maksimal 2 level (contoh: Menu "Profil" -> Submenu "Sejarah", "Visi & Misi", "Struktur Organisasi").
4. **Global School Customizer (Settings):**
   * Form terpusat untuk mengubah Nama Sekolah, NPSN, Akreditasi, Logo, Sambutan Kepala Sekolah, Kontak Darurat/TU, Link Sosial Media, dan Banner Pengumuman PPDB.

### 4.2. Modul Spesifik Sekolah Menengah Pertama (SMP)
1. **Direktori Guru & Tenaga Kependidikan (GTK):**
   * CRUD profil guru dan staf TU mencakup foto rasio `3:4`, Nama & Gelar, NIP/NUPTK, Jabatan, serta Mata Pelajaran yang diampu.
2. **Direktori Ekstrakurikuler & Prestasi:**
   * Halaman informasi kegiatan ekskul (Pramuka, PMR, OSIS, Futsal, Tari, dll.) beserta nama pembina, jadwal latihan, dan galeri dokumentasi.
   * Pencatatan rekap prestasi siswa (Tingkat Kabupaten, Provinsi, Nasional) yang terhubung ke halaman beranda.
3. **Kalender & Agenda Akademik:**
   * Pencatatan jadwal kegiatan sekolah (Jadwal Ujian, Pembagian Rapor, Libur Nasional, Class Meeting) yang ditampilkan dalam bentuk daftar agenda di halaman depan.
4. **Portal Informasi PPDB (Penerimaan Peserta Didik Baru):**
   * Halaman khusus dengan *toggle status* (Buka/Tutup), informasi jalur pendaftaran (Zonasi, Afirmasi, Prestasi, Perpindahan Orang Tua), unduhan brosur PDF, dan tautan ke portal pendaftaran dinas/internal.

---

## 5. Skema Database Utama (MySQL Schema Design)

### 5.1. Tabel `posts`
* `id` (BIGINT, PK)
* `author_id` (FK -> `users.id`)
* `title` (VARCHAR 255)
* `slug` (VARCHAR 255, UNIQUE, INDEX)
* `excerpt` (TEXT, Nullable)
* `content` (JSON) — *Menyimpan array objek blok dari BlockNote/Tiptap*
* `type` (ENUM: `'post'`, `'page'`, `'announcement'`)
* `status` (ENUM: `'draft'`, `'pending_review'`, `'scheduled'`, `'published'`)
* `featured_media_id` (BIGINT, Nullable)
* `is_pinned` (BOOLEAN, Default: `false`)
* `meta_title` (VARCHAR 255, Nullable)
* `meta_description` (VARCHAR 500, Nullable)
* `published_at` (TIMESTAMP, Nullable, INDEX)
* `timestamps` & `softDeletes`

### 5.2. Tabel `taxonomies` & `post_taxonomy`
* `id` (BIGINT, PK)
* `name` (VARCHAR 100)
* `slug` (VARCHAR 100, UNIQUE)
* `type` (ENUM: `'category'`, `'tag'`)
* Relasi *Many-to-Many* ke tabel `posts` melalui tabel pivot `post_taxonomy`.

### 5.3. Tabel `menus` & `menu_items`
* `menus`: `id`, `name`, `location` (ENUM: `'header_primary'`, `'header_top'`, `'footer_links'`)
* `menu_items`: `id`, `menu_id` (FK), `parent_id` (FK Self-Referencing, Nullable), `label` (VARCHAR 100), `link_type` (ENUM: `'internal_post'`, `'custom_url'`), `target_id` (BIGINT, Nullable), `custom_url` (VARCHAR 255, Nullable), `sort_order` (INT).

### 5.4. Tabel `staff_directories`
* `id` (BIGINT, PK), `name` (VARCHAR 150), `nip` (VARCHAR 50, Nullable), `position` (VARCHAR 100), `subject` (VARCHAR 100, Nullable), `category` (ENUM: `'kepsek'`, `'guru'`, `'tendik'`), `photo_media_id` (BIGINT, Nullable), `sort_order` (INT), `is_active` (BOOLEAN).

### 5.5. Tabel `settings`
* `key` (VARCHAR 100, PK)
* `value` (JSON)
* `group` (VARCHAR 50, INDEX) — *Contoh group: `'general'`, `'contact'`, `'ppdb'`, `'social'`*

---

## 6. Spesifikasi Desain UI/UX (Design System)

### 6.1. Palet Warna (Editorial Institutional)
* **Surface / Background:** Warm Paper `#FAF9F6` (Halaman bacaan publik), Pure White `#FFFFFF` (Kartu & Area Konten), Slate `#F8FAFC` (Background Dashboard Admin).
* **Primary Brand:** Deep Kemendikbud Navy `#0F172A` (Teks utama & Header), Institutional Cobalt `#1E3A8A` (Tombol utama & Aksen aktif).
* **Accent / Highlight:** Warm Amber `#D97706` (Badge Pengumuman Penting, Pinned Post, dan CTA PPDB).
* **Border & Divider:** Hairline Slate `#E2E8F0` (`border-slate-200`) untuk memisahkan seksi secara tegas seperti koran/majalah modern tanpa *drop shadow* berlebihan.

### 6.2. Tipografi
* **Heading (Publik):** *Instrument Serif* atau *Playfair Display* (memberikan wibawa akademis pada judul berita dan sambutan kepala sekolah).
* **Body & Admin UI:** *Plus Jakarta Sans* atau *Inter* (keterbacaan tinggi pada tabel data, formulir, dan artikel panjang).

### 6.3. Standar Penggunaan `@heroicons/react`
* **Navigasi Sidebar Admin (`24/outline`):**
  * Dashboard: `HomeIcon`
  * Berita & Artikel: `NewspaperIcon`
  * Halaman Statis: `DocumentTextIcon`
  * Pengumuman & Agenda: `MegaphoneIcon`, `CalendarDaysIcon`
  * Media Library: `PhotoIcon`
  * Direktori Guru & Ekskul: `AcademicCapIcon`, `UserGroupIcon`
  * Menu Builder & Pengaturan: `Bars3BottomLeftIcon`, `Cog6ToothIcon`
* **Toolbar Editor & Komponen Publik (`20/solid`):**
  * Unduh Dokumen Resmi: `DocumentArrowDownIcon`
  * Artikel Disematkan (Pinned): `BookmarkIcon`
  * Pencarian Cepat: `MagnifyingGlassIcon`

### 6.4. Struktur Layout Utama
1. **Public Portal Layout:**
   * **Top Utility Bar:** Informasi NPSN, Email Resmi, Nomor WhatsApp TU, dan tautan cepat.
   * **Main Navbar:** Logo SMP di kiri, menu dinamis dengan *dropdown* di tengah, tombol CTA "Info PPDB" di kanan.
   * **Asymmetric Hero & Bento Grid:** Menggabungkan *headline* utama berita sekolah dengan kartu Pengumuman Akademik terbaru (dilengkapi tombol unduh PDF langsung) serta Sambutan Kepala Sekolah.
2. **Zen Block Editor Layout (Admin):**
   * Saat membuat atau mengedit artikel, sidebar navigasi kiri dapat diciutkan (*collapsed*).
   * **Kanvas Tengah (`flex-1`):** Area penulisan WYSIWYG/Block murni dengan lebar baca ideal (`max-w-3xl mx-auto`).
   * **Inspector Panel Kanan (`w-80`):** Accordion pengaturan Status Publikasi, Jadwal Terbit, Slug URL, Kategori/Tag, Featured Image, dan Meta SEO.

---

## 7. Kebutuhan Non-Fungsional (Non-Functional Requirements)
1. **SEO & Kecepatan Muat:** Halaman publik wajib di-render di sisi server menggunakan **Inertia SSR** dan menghasilkan skor Lighthouse SEO minimal 95.
2. **Caching Strategy:** Data `settings` dan struktur `menus` wajib disimpan di dalam cache (`Cache::rememberForever`) dan di-reset otomatis melalui *Model Observer* hanya ketika admin memperbarui data terkait.
3. **Keamanan:** Validasi ketat untuk ekstensi unggahan file (hanya `.jpg`, `.jpeg`, `.png`, `.webp`, dan `.pdf` maksimal 5MB), serta sanitasi struktur JSON pada konten editor sebelum disimpan ke MySQL.

---

## 8. Tahapan Pengembangan (Development Milestones)
* **Fase 1 (Foundation & Auth):** Setup Laravel 12 + Inertia React SSR, konfigurasi Tailwind CSS + `@heroicons/react`, serta autentikasi Fortify dan RBAC `spatie/laravel-permission`.
* **Fase 2 (Core CMS & Media):** Pembuatan skema database `posts` dan `taxonomies`, integrasi `spatie/laravel-medialibrary`, serta pembuatan komponen Media Picker Modal.
* **Fase 3 (Block Editor & Dynamic Menu):** Integrasi BlockNote/Tiptap dengan fitur *upload* gambar ke server, serta pembuatan fitur *drag-and-drop* Dynamic Menu Builder.
* **Fase 4 (Modul Akademik SMP):** Pembuatan CRUD Direktori Guru/Tendik, Ekstrakurikuler, Agenda Sekolah, dan Pengaturan Global (`settings`).
* **Fase 5 (Public Portal & SSR Optimization):** Implementasi desain Editorial pada halaman depan, halaman baca berita, direktori publik, implementasi cache, dan pengujian SSR.