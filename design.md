# Design System & UI Specification (`DESIGN.md`)
**Project:** CMS Portal Sekolah SMP + `@heroicons/react`
**Design Theme:** *Archival Stone & Prussian Ink* (Editorial Institutional)

---

## 1. Filosofi Visual ("Anti-AI Slop" Rules)
Untuk memastikan website memiliki karakter institusi pendidikan yang berwibawa, abadi (*timeless*), dan ramah bagi mata semua kalangan (siswa, guru, hingga orang tua/wali murid), aturan berikut wajib dipatuhi:

1. **Dilarang Menggunakan Warna Bawaan `slate-*`, `indigo-*`, atau `blue-600`:** Seluruh warna netral wajib berbasis *warm stone/paper* (ada sedikit unsur hangat kertas cetak, bukan abu-abu kebiruan dingin khas template SaaS AI).
2. **Garis Batas Tegas (*Hairline Borders*), Bukan *Drop Shadow* Tebal:** Pisahkan antar-seksi dan kartu berita menggunakan garis `1px solid #E2DFD7` seperti tata letak surat kabar modern, bukan efek bayangan kabur (`shadow-xl` atau `backdrop-blur`).
3. **Zero Gradient & Zero Neon:** Tidak ada gradasi warna pada tombol, teks, maupun *background*. Seluruh blok warna bersifat solid dan memiliki kontras tinggi (standar WCAG AAA/AA).
4. **Strict Heroicons Policy:** Seluruh ikon menggunakan `@heroicons/react` (`24/outline` untuk navigasi struktural, `20/solid` untuk aksi cepat dan penanda dokumen). Dilarang menggunakan `lucide-react`.

---

## 2. Sistem Palet Warna Terkunci (80 / 15 / 5 Rule)

### A. Surface & Neutral (80% Proporsi Layar)
Berfungsi sebagai kanvas bacaan yang teduh di mata dan menonjolkan foto dokumentasi siswa.
* **`canvas-paper` (`#F6F5F0`):** Background utama halaman publik (kertas arsip hangat).
* **`canvas-admin` (`#F2F0EA`):** Background area kerja dashboard CMS admin.
* **`surface-card` (`#FFFFFF`):** Permukaan kartu berita, tabel, dan area kanvas ketik editor.
* **`surface-subtle` (`#ECEAE2`):** Background untuk kotak kutipan sambutan Kepala Sekolah, *table header*, atau *hover state* pada menu.
* **`border-hairline` (`#E2DFD7`):** Garis pemisah struktural standar (`1px`).
* **`border-strong` (`#C8C4B8`):** Garis batas input form dan kartu yang sedang disorot.

### B. Typography & Ink (Kontras Tinggi / WCAG AAA)
* **`ink-primary` (`#181816`):** Hitam arang hangat untuk seluruh judul berita dan isi paragraf artikel (rasio kontras **16.4:1** di atas `#F6F5F0`).
* **`ink-secondary` (`#52504A`):** Teks pendukung, ringkasan berita (*excerpt*), dan jabatan guru (rasio kontras **7.2:1**).
* **`ink-muted` (`#78756D`):** Tanggal rilis berita, penulis, keterangan foto (*caption*), dan *placeholder* input.

### C. Institutional Brand & Action (15% + 5% Proporsi Layar)
* **`brand-ink` (`#163038` - *Prussian Ink*):** Warna otoritas utama (Top Utility Bar, Footer, Tombol Primer Admin, dan state aktif navigasi).
* **`brand-ink-hover` (`#0F2228`):** State *hover* untuk elemen `brand-ink`.
* **`accent-terracotta` (`#B83B2A` - *Burnt Terracotta*):** Titik fokus utama (Tombol CTA "Info PPDB", ikon unduh PDF Surat Edaran, dan indikator *Pinned Announcement*).
* **`accent-terracotta-hover` (`#962E20`):** State *hover* untuk tombol CTA utama.

### D. Status & Semantic (Khusus Badge & Notifikasi)
Dibuat dengan saturasi teredam agar menyatu dengan tema kertas hangat:
* **Published / Akademik (`#234E38`):** Deep Forest Green (Teks/Dot) di atas `#E6EFEA`.
* **Pending Review / Agenda (`#8C581C`):** Warm Ochre (Teks/Dot) di atas `#F7EFE4`.
* **Urgent / Ditolak (`#9E2A2B`):** Crimson Seal (Teks/Dot) di atas `#F9EBEB`.

---

## 3. Konfigurasi Tailwind CSS (`tailwind.config.js` / CSS Variables)

Salin konfigurasi ini langsung ke dalam proyek Laravel + React Anda:

```javascript
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                canvas: {
                    paper: '#F6F5F0',
                    admin: '#F2F0EA',
                    subtle: '#ECEAE2',
                },
                surface: {
                    DEFAULT: '#FFFFFF',
                },
                line: {
                    DEFAULT: '#E2DFD7',
                    strong: '#C8C4B8',
                },
                ink: {
                    DEFAULT: '#181816',
                    secondary: '#52504A',
                    muted: '#78756D',
                },
                prussian: {
                    DEFAULT: '#163038',
                    hover: '#0F2228',
                    light: '#E8EFF1',
                },
                terracotta: {
                    DEFAULT: '#B83B2A',
                    hover: '#962E20',
                    light: '#F9ECEA',
                },
            },
            fontFamily: {
                serif: ['"Newsreader"', '"Instrument Serif"', ...defaultTheme.fontFamily.serif],
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
                mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
            },
            borderRadius: {
                DEFAULT: '4px',
                md: '6px',
                lg: '8px',
            },
        },
    },
    plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};