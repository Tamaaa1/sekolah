<?php

namespace Database\Seeders;

use App\Models\AcademicAgenda;
use App\Models\Achievement;
use App\Models\Extracurricular;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Post;
use App\Models\Setting;
use App\Models\StaffDirectory;
use App\Models\Taxonomy;
use App\Models\User;
use Illuminate\Database\Seeder;

class InitialSchoolContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first() ?? User::firstOrCreate(
            ['email' => 'admin@sekolah.sch.id'],
            [
                'name' => 'Tata Usaha (Super Admin)',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // 1. Pengaturan Identitas Sekolah
        Setting::set('school_name', 'SMP Negeri 5 Sambas', 'general');
        Setting::set('npsn', '30100301', 'general');
        Setting::set('accreditation', 'A (Unggul)', 'general');
        Setting::set('school_tagline', 'Berkarakter, Berprestasi, dan Berwawasan Global', 'general');
        Setting::set('principal_name', 'Drs. H. Mulyadi, M.Pd.', 'general');
        Setting::set('principal_speech', 'Selamat datang di Portal Resmi SMP Negeri 5 Sambas. Sebagai lembaga pendidikan yang mengedepankan integritas budi pekerti dan keunggulan akademik, kami berkomitmen menyelenggarakan pembelajaran yang bermakna bagi seluruh peserta didik guna menyongsong masa depan bangsa yang gemilang.', 'general');

        Setting::set('phone', '(021) 7890-1234', 'contact');
        Setting::set('whatsapp', '0812-3456-7890', 'contact');
        Setting::set('email', 'humas@smpn5sambas.sch.id', 'contact');
        Setting::set('address', 'Jl. Raya Semberang, Kec. Sambas, Kab. Sambas, Prov. Kalimantan Barat', 'contact');

        Setting::set('ppdb_is_open', true, 'ppdb');
        Setting::set('ppdb_year', '2026/2027', 'ppdb');
        Setting::set('ppdb_brochure_url', '/documents/brosur-ppdb-2026.pdf', 'ppdb');
        Setting::set('ppdb_portal_url', 'https://siap-ppdb.kemdikbud.go.id', 'ppdb');

        // 2. Taksonomi (Kategori & Tag)
        $catBerita = Taxonomy::firstOrCreate(['slug' => 'berita-sekolah'], ['name' => 'Berita Sekolah', 'type' => 'category']);
        $catPrestasi = Taxonomy::firstOrCreate(['slug' => 'prestasi-siswa'], ['name' => 'Prestasi Siswa', 'type' => 'category']);
        $catPengumuman = Taxonomy::firstOrCreate(['slug' => 'pengumuman-resmi'], ['name' => 'Pengumuman Resmi', 'type' => 'category']);
        $catAkademik = Taxonomy::firstOrCreate(['slug' => 'kegiatan-akademik'], ['name' => 'Kegiatan Akademik', 'type' => 'category']);

        // 3. Konten Statis (Pages)
        $pageVisiMisi = Post::firstOrCreate(
            ['slug' => 'visi-misi-sekolah'],
            [
                'author_id' => $admin->id,
                'title' => 'Visi, Misi, dan Tujuan Sekolah',
                'excerpt' => 'Arah dan komitmen pendidikan SMP Negeri 5 Sambas dalam mencetak generasi cerdas berakhlak mulia.',
                'content' => [
                    ['type' => 'heading', 'content' => 'Visi Sekolah'],
                    ['type' => 'paragraph', 'content' => 'Terwujudnya insan pembelajar yang berkarakter Pancasila, unggul dalam ilmu pengetahuan dan teknologi, serta peduli terhadap lingkungan hidup.'],
                    ['type' => 'heading', 'content' => 'Misi Sekolah'],
                    ['type' => 'paragraph', 'content' => '1. Mengembangkan budaya belajar yang kreatif, kritis, dan berorientasi masa depan.'],
                    ['type' => 'paragraph', 'content' => '2. Menanamkan nilai integritas, toleransi, dan kesantunan dalam seluruh aktivitas sekolah.'],
                    ['type' => 'paragraph', 'content' => '3. Mendorong pengembangan minat dan bakat peserta didik melalui kegiatan kokurikuler dan ekstrakurikuler yang terstruktur.']
                ],
                'type' => 'page',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        $pageSejarah = Post::firstOrCreate(
            ['slug' => 'sejarah-sekolah'],
            [
                'author_id' => $admin->id,
                'title' => 'Sejarah Singkat SMP Negeri 5 Sambas',
                'excerpt' => 'Perjalanan panjang dedikasi mencerdaskan anak bangsa sejak berdiri tahun 1978.',
                'content' => [
                    ['type' => 'paragraph', 'content' => 'SMP Negeri 5 Sambas didirikan atas prakarsa tokoh masyarakat dan pemerintah daerah untuk memperluas akses pendidikan berkualitas di Sambas. Selama hampir lima dekade, sekolah ini telah melahirkan ribuan alumni yang berkontribusi nyata di berbagai bidang pembangunan nasional.']
                ],
                'type' => 'page',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        // 4. Berita & Pengumuman
        $berita1 = Post::firstOrCreate(
            ['slug' => 'tim-robotik-smp-raih-emas-olimpiade-nasional-2026'],
            [
                'author_id' => $admin->id,
                'title' => 'Tim Robotik SMP Negeri 5 Sambas Raih Medali Emas Olimpiade Sains Nasional 2026',
                'excerpt' => 'Karya inovasi robot penyortir sampah otomatis rancangan siswa kelas VIII berhasil menyabet predikat juara pertama.',
                'content' => [
                    ['type' => 'paragraph', 'content' => 'Prestasi membanggakan kembali dipersembahkan oleh perwakilan peserta didik SMP Negeri 5 Sambas. Dalam ajang Olimpiade Sains dan Teknologi Nasional tingkat SMP tahun 2026 yang diselenggarakan di Bandung, tim robotik sekolah berhasil mengungguli puluhan peserta dari berbagai provinsi.'],
                    ['type' => 'paragraph', 'content' => 'Kepala Sekolah menyampaikan rasa bangga dan apresiasi setinggi-tingginya kepada tim pembina serta orang tua siswa yang terus mendampingi selama masa persiapan intensif.']
                ],
                'type' => 'post',
                'status' => 'published',
                'is_pinned' => true,
                'published_at' => now(),
            ]
        );
        $berita1->taxonomies()->syncWithoutDetaching([$catPrestasi->id, $catBerita->id]);

        $pengumuman1 = Post::firstOrCreate(
            ['slug' => 'surat-edaran-jadwal-asesmen-akhir-semester-genap-2026'],
            [
                'author_id' => $admin->id,
                'title' => 'Surat Edaran: Jadwal Pelaksanaan Asesmen Sumatif Akhir Semester Genap',
                'excerpt' => 'Informasi penting mengenai jadwal ujian tertulis, ketentuan pakaian seragam, dan tata tertib asesmen.',
                'content' => [
                    ['type' => 'paragraph', 'content' => 'Diberitahukan kepada seluruh orang tua/wali murid kelas VII, VIII, dan IX bahwa Asesmen Sumatif Akhir Semester Genap Tahun Ajaran 2025/2026 akan dimulai pada hari Senin, 18 Mei 2026.'],
                    ['type' => 'paragraph', 'content' => 'Seluruh siswa diharapkan hadir tepat waktu pukul 07.00 WIB dengan mengenakan seragam harian lengkap beserta kartu peserta ujian.']
                ],
                'type' => 'announcement',
                'status' => 'published',
                'is_pinned' => true,
                'published_at' => now(),
            ]
        );
        $pengumuman1->taxonomies()->syncWithoutDetaching([$catPengumuman->id, $catAkademik->id]);

        // 5. Menu Builder Dinamis
        $headerPrimary = Menu::firstOrCreate(['location' => 'header_primary'], ['name' => 'Menu Utama Header']);
        MenuItem::where('menu_id', $headerPrimary->id)->delete();

        $m1 = MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Beranda', 'link_type' => 'custom_url', 'custom_url' => '/', 'sort_order' => 1]);
        $m2 = MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Profil Sekolah', 'link_type' => 'custom_url', 'custom_url' => '#', 'sort_order' => 2]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'parent_id' => $m2->id, 'label' => 'Visi & Misi', 'link_type' => 'internal_post', 'target_id' => $pageVisiMisi->id, 'sort_order' => 1]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'parent_id' => $m2->id, 'label' => 'Sejarah Sekolah', 'link_type' => 'internal_post', 'target_id' => $pageSejarah->id, 'sort_order' => 2]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'parent_id' => $m2->id, 'label' => 'Direktori Guru & Staf', 'link_type' => 'custom_url', 'custom_url' => '/guru-dan-staf', 'sort_order' => 3]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'parent_id' => $m2->id, 'label' => 'Sarana & Fasilitas', 'link_type' => 'custom_url', 'custom_url' => '/fasilitas', 'sort_order' => 4]);

        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Berita & Artikel', 'link_type' => 'custom_url', 'custom_url' => '/berita', 'sort_order' => 3]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Ekstrakurikuler', 'link_type' => 'custom_url', 'custom_url' => '/ekstrakurikuler', 'sort_order' => 4]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Prestasi', 'link_type' => 'custom_url', 'custom_url' => '/prestasi', 'sort_order' => 5]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Agenda Akademik', 'link_type' => 'custom_url', 'custom_url' => '/agenda', 'sort_order' => 6]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Galeri Foto', 'link_type' => 'custom_url', 'custom_url' => '/galeri', 'sort_order' => 7]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Pusat Unduhan', 'link_type' => 'custom_url', 'custom_url' => '/unduhan', 'sort_order' => 8]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Kontak & Saran', 'link_type' => 'custom_url', 'custom_url' => '/kontak', 'sort_order' => 9]);

        // 6. Direktori Guru & GTK
        StaffDirectory::firstOrCreate(
            ['name' => 'Drs. H. Mulyadi, M.Pd.'],
            [
                'nip' => '196805121994031002',
                'position' => 'Kepala Sekolah',
                'subject' => 'Manajemen Pendidikan',
                'category' => 'kepsek',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );
        StaffDirectory::firstOrCreate(
            ['name' => 'Siti Rahmawati, S.Pd., M.Si.'],
            [
                'nip' => '197904222005012008',
                'position' => 'Wakil Kepala Sekolah Bidang Kurikulum',
                'subject' => 'Matematika',
                'category' => 'guru',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );
        StaffDirectory::firstOrCreate(
            ['name' => 'Ahmad Fauzi, S.Pd.'],
            [
                'nip' => '198402152009021004',
                'position' => 'Guru IPA & Pembina OSIS',
                'subject' => 'Ilmu Pengetahuan Alam',
                'category' => 'guru',
                'sort_order' => 3,
                'is_active' => true,
            ]
        );
        StaffDirectory::firstOrCreate(
            ['name' => 'Budi Santoso, S.Kom.'],
            [
                'nip' => '199108102018011001',
                'position' => 'Kepala Tata Usaha & IT Administrator',
                'subject' => 'Administrasi & Teknologi',
                'category' => 'tendik',
                'sort_order' => 4,
                'is_active' => true,
            ]
        );

        // 7. Ekstrakurikuler
        Extracurricular::firstOrCreate(
            ['slug' => 'pramuka-gudep-sambas'],
            [
                'name' => 'Pramuka (Gudep 05-081)',
                'leader_name' => 'Ahmad Fauzi, S.Pd.',
                'schedule_day' => 'Jumat',
                'schedule_time' => '14.00 - 16.30 WIB',
                'description' => 'Membentuk watak kepribadian yang mandiri, disiplin, berjiwa korsa, dan mencintai lingkungan hidup.',
                'is_active' => true,
            ]
        );
        Extracurricular::firstOrCreate(
            ['slug' => 'palang-merah-remaja-pmr'],
            [
                'name' => 'Palang Merah Remaja (PMR Madya)',
                'leader_name' => 'Dewi Lestari, S.Pd.',
                'schedule_day' => 'Rabu',
                'schedule_time' => '15.00 - 17.00 WIB',
                'description' => 'Pelatihan pertolongan pertama pada kecelakaan (P3K), kesiapsiagaan bencana, dan bakti sosial kesehatan.',
                'is_active' => true,
            ]
        );
        Extracurricular::firstOrCreate(
            ['slug' => 'klub-robotik-dan-koding'],
            [
                'name' => 'Klub Robotik & Informatika',
                'leader_name' => 'Budi Santoso, S.Kom.',
                'schedule_day' => 'Sabtu',
                'schedule_time' => '09.00 - 12.00 WIB',
                'description' => 'Pengenalan sensor, mikrokontroler Arduino, perakitan robot pemilah, serta logika dasar pemrograman.',
                'is_active' => true,
            ]
        );

        // 8. Rekap Prestasi Siswa
        Achievement::firstOrCreate(
            ['title' => 'Medali Emas Bidang Robotik Terapan'],
            [
                'student_name' => 'Rizky Ramadhan & Alif Pratama',
                'competition_name' => 'Olimpiade Sains & Teknologi Nasional (OSTN)',
                'level' => 'nasional',
                'rank' => 'Juara 1 (Medali Emas)',
                'year' => 2026,
                'description' => 'Inovasi robot pengangkut sampah ramah lingkungan berbasis energi surya mini.',
            ]
        );
        Achievement::firstOrCreate(
            ['title' => 'Juara 1 Lomba Cipta & Baca Puisi'],
            [
                'student_name' => 'Annisa Zahra Fitri',
                'competition_name' => 'Festival dan Lomba Seni Siswa Nasional (FLS2N)',
                'level' => 'provinsi',
                'rank' => 'Juara 1',
                'year' => 2026,
                'description' => 'Penampilan membacakan puisi karya Chairil Anwar dengan penghayatan vokal terbaik se-DKI Jakarta.',
            ]
        );

        // 9. Agenda Akademik
        AcademicAgenda::firstOrCreate(
            ['title' => 'Asesmen Sumatif Akhir Semester Genap'],
            [
                'description' => 'Penilaian capaian kompetensi pembelajaran seluruh mata pelajaran untuk kelas VII, VIII, dan IX.',
                'start_date' => '2026-05-18',
                'end_date' => '2026-05-26',
                'location' => 'Gedung A dan B SMPN 5 Sambas',
                'is_active' => true,
            ]
        );
        AcademicAgenda::firstOrCreate(
            ['title' => 'Pekan Class Meeting & Lomba Antar-Kelas'],
            [
                'description' => 'Ajang keakraban siswa pasca-ujian mencakup pertandingan futsal, cerdas cermat, dan pentas musik.',
                'start_date' => '2026-06-02',
                'end_date' => '2026-06-05',
                'location' => 'Lapangan Olahraga & Aula Sekolah',
                'is_active' => true,
            ]
        );
        AcademicAgenda::firstOrCreate(
            ['title' => 'Pembagian Rapor Semester Genap & Wisuda Kelas IX'],
            [
                'description' => 'Penyerahan laporan hasil belajar kepada orang tua murid dan pelepasan siswa kelas IX angkatan 2026.',
                'start_date' => '2026-06-19',
                'end_date' => '2026-06-19',
                'location' => 'Aula SMP Negeri 5 Sambas',
                'is_active' => true,
            ]
        );

        // 10. Fasilitas & Sarana Prasarana
        $facilities = [
            [
                'name' => 'Laboratorium Komputer Modern',
                'slug' => 'laboratorium-komputer-modern',
                'category' => 'Ruang Pembelajaran',
                'description' => 'Fasilitas penunjang pembelajaran TIK, literasi digital, asesmen berbasis komputer (ANBK), dan pelatihan koding siswa dengan koneksi internet serat optik kecepatan tinggi.',
                'image' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                'capacity' => '40 Unit PC Komputer',
                'location' => 'Gedung B Lantai 2',
                'features' => ['40 PC All-in-One Core i5', 'Pendingin Ruangan (AC)', 'Proyektor Interaktif', 'Jaringan LAN Gigabit & WiFi Dedicated', 'UPS Backup Listrik'],
                'sort_order' => 1,
            ],
            [
                'name' => 'Perpustakaan Digital "Graha Pustaka"',
                'slug' => 'perpustakaan-digital-graha-pustaka',
                'category' => 'Fasilitas Penunjang',
                'description' => 'Pusat literasi dengan ribuan judul buku cetak, ensiklopedia, jurnal pendidikan, serta terminal akses e-book dan katalog digital bagi seluruh warga sekolah.',
                'image' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
                'capacity' => '80 Siswa',
                'location' => 'Gedung A Lantai 1',
                'features' => ['Ribuan Koleksi Buku', 'Ruang Baca Nyaman & Hening Ber-AC', 'Katalog Digital OPAC', 'Meja Diskusi Kelompok', 'Loker Penyimpanan Penitipan'],
                'sort_order' => 2,
            ],
            [
                'name' => 'Laboratorium IPA & Riset Sains',
                'slug' => 'laboratorium-ipa-dan-riset-sains',
                'category' => 'Ruang Pembelajaran',
                'description' => 'Ruang praktikum sains terpadu yang memadukan eksperimen Fisika, Kimia sederhana, dan Biologi dengan instrumen mikroskopik dan perlengkapan keselamatan kerja lengkap.',
                'image' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
                'capacity' => '36 Siswa',
                'location' => 'Gedung B Lantai 1',
                'features' => ['Mikroskop Binokuler Digital', 'Alat Peraga Anatomi & Fisika', 'Wastafel Praktikum per Meja', 'Peralatan Keselamatan & P3K', 'Ruang Preparasi Bahan Praktikum'],
                'sort_order' => 3,
            ],
            [
                'name' => 'Lapangan Olahraga Serbaguna',
                'slug' => 'lapangan-olahraga-serbaguna',
                'category' => 'Sarana Olahraga',
                'description' => 'Arena aktivitas jasmani luar ruang dengan lantai semen cor bertaraf standar, mendukung cabang olahraga basket, futsal, bola voli, dan bulutangkis.',
                'image' => 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
                'capacity' => '300 Penonton',
                'location' => 'Lapangan Utama Terbuka',
                'features' => ['Ring Basket Portabel Standar', 'Gawang Futsal & Jaring Pengaman', 'Tiang Net Voli Fleksibel', 'Tribun Penonton Teduh', 'Penerangan Lapangan Malam Hari'],
                'sort_order' => 4,
            ],
            [
                'name' => 'Musholla Sekolah "Nurul Ilmi"',
                'slug' => 'musholla-sekolah-nurul-ilmi',
                'category' => 'Tempat Ibadah',
                'description' => 'Sarana pembinaan spiritual dan ibadah berjamaah, kegiatan keputrian, pembacaan Al-Quran pagi, dan peringatan hari besar keagamaan Islam.',
                'image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
                'capacity' => '150 Jamaah',
                'location' => 'Sayap Kanan Belakang Gedung Utama',
                'features' => ['Tempat Wudhu Terpisah Putra/Putri', 'Karpet Sajadah Tebal & Wangi', 'Pendingin Ruangan & Kipas Dinding', 'Sound System Adzan Jernih', 'Rak Al-Quran & Lemari Mukena'],
                'sort_order' => 5,
            ],
            [
                'name' => 'Ruang UKS & Konseling Kesehatan',
                'slug' => 'ruang-uks-dan-konseling-kesehatan',
                'category' => 'Fasilitas Penunjang',
                'description' => 'Unit pelayanan kesehatan pertolongan pertama bagi siswa dan staf yang membutuhkan istirahat atau perawatan medis ringan saat kegiatan belajar mengajar berlangsung.',
                'image' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
                'capacity' => '6 Ranjang Pasien',
                'location' => 'Samping Ruang Bimbingan Konseling (BK)',
                'features' => ['Tempat Tidur Medis Nyaman', 'Persediaan Obat-obatan Esensial', 'Alat Ukur Tinggi & Timbangan Berat', 'Tabung Oksigen Siaga', 'Buku Rekam Medis Ringan'],
                'sort_order' => 6,
            ],
        ];

        foreach ($facilities as $fac) {
            \App\Models\Facility::firstOrCreate(['slug' => $fac['slug']], $fac);
        }

        // 11. Pusat Unduhan Dokumen
        $downloads = [
            [
                'title' => 'Kalender Pendidikan & Akademik Tahun Ajaran 2026/2027',
                'slug' => 'kalender-pendidikan-dan-akademik-2026-2027',
                'category' => 'Akademik & Kurikulum',
                'description' => 'Jadwal lengkap hari efektif belajar, masa ujian sumatif, libur semester, dan agenda kegiatan tahunan sekolah.',
                'file_path' => '/documents/kalender-akademik-2026-2027.pdf',
                'file_type' => 'PDF',
                'file_size' => '1.2 MB',
                'download_count' => 124,
                'sort_order' => 1,
            ],
            [
                'title' => 'Buku Pedoman Tata Tertib & Norma Disiplin Siswa',
                'slug' => 'buku-pedoman-tata-tertib-disiplin-siswa',
                'category' => 'Tata Tertib & Kesiswaan',
                'description' => 'Peraturan resmi hak dan kewajiban peserta didik, etika berpakaian seragam, serta sanksi pelanggaran kedisiplinan di sekolah.',
                'file_path' => '/documents/pedoman-tata-tertib-siswa.pdf',
                'file_type' => 'PDF',
                'file_size' => '2.4 MB',
                'download_count' => 89,
                'sort_order' => 2,
            ],
            [
                'title' => 'Formulir Surat Izin Tidak Masuk Sekolah & Keterangan Sakit',
                'slug' => 'formulir-surat-izin-tidak-masuk-sekolah',
                'category' => 'Formulir Layanan',
                'description' => 'Format surat resmi permohonan izin orang tua/wali murid kepada pihak sekolah ketika berhalangan hadir mengikuti pembelajaran.',
                'file_path' => '/documents/formulir-surat-izin-siswa.docx',
                'file_type' => 'DOCX',
                'file_size' => '240 KB',
                'download_count' => 215,
                'sort_order' => 3,
            ],
            [
                'title' => 'Brosur & Panduan Alur Pendaftaran PPDB 2026',
                'slug' => 'brosur-panduan-alur-pendaftaran-ppdb-2026',
                'category' => 'Panduan & Informasi',
                'description' => 'Petunjuk teknis pendaftaran siswa baru jalur zonasi, afirmasi, prestasi, dan perpindahan tugas orang tua.',
                'file_path' => '/documents/brosur-ppdb-2026.pdf',
                'file_type' => 'PDF',
                'file_size' => '3.8 MB',
                'download_count' => 342,
                'sort_order' => 4,
            ],
            [
                'title' => 'Formulir Registrasi Kegiatan Ekstrakurikuler Siswa',
                'slug' => 'formulir-registrasi-ekstrakurikuler-siswa',
                'category' => 'Formulir Layanan',
                'description' => 'Lembar pendaftaran pemilihan cabang minat bakat ekstrakurikuler wajib dan pilihan bagi siswa kelas VII dan VIII.',
                'file_path' => '/documents/formulir-pendaftaran-ekskul.pdf',
                'file_type' => 'PDF',
                'file_size' => '410 KB',
                'download_count' => 176,
                'sort_order' => 5,
            ],
        ];

        foreach ($downloads as $dl) {
            \App\Models\Download::firstOrCreate(['slug' => $dl['slug']], $dl);
        }

        // 12. Dokumentasi Galeri Kegiatan
        $galleries = [
            [
                'title' => 'Upacara Peringatan Hari Kemerdekaan RI ke-81',
                'slug' => 'upacara-peringatan-hari-kemerdekaan-ri-ke-81',
                'category' => 'Upacara & Peringatan',
                'description' => 'Khidmatnya upacara bendera memperingati HUT Kemerdekaan Republik Indonesia yang diikuti oleh seluruh dewan guru, staf TU, dan siswa-siswi.',
                'cover_image' => 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
                'event_date' => '2026-08-17',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Pengibaran Sang Merah Putih oleh Pasukan Paskibra Sekolah'],
                    ['url' => 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Paduan suara membawakan lagu Indonesia Raya'],
                    ['url' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Amanat Pembina Upacara oleh Kepala Sekolah'],
                ],
                'sort_order' => 1,
            ],
            [
                'title' => 'Gelar Karya P5: Inovasi Kuliner Olahan Khas Sambas',
                'slug' => 'gelar-karya-p5-inovasi-kuliner-khas-sambas',
                'category' => 'Kegiatan Akademik',
                'description' => 'Pameran kreativitas siswa kelas VII dan VIII dalam mengeksplorasi kearifan lokal melalui olahan pangan dan kerajinan tradisional Sambas.',
                'cover_image' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
                'event_date' => '2026-10-24',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Stan pameran karya siswa dengan ragam produk kearifan lokal'],
                    ['url' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Presentasi proses pembuatan produk di hadapan tim penilai'],
                ],
                'sort_order' => 2,
            ],
            [
                'title' => 'Kemah Bhakti Gugus Depan Pramuka Penggalang',
                'slug' => 'kemah-bhakti-gugus-depan-pramuka-penggalang',
                'category' => 'Ekstrakurikuler',
                'description' => 'Kegiatan perkemahan sabtu-minggu (Persami) melatih kepemimpinan, kepedulian lingkungan, pioneering, dan ketangkasan berorganisasi.',
                'cover_image' => 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
                'event_date' => '2026-09-12',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Kegiatan mendirikan tenda regu dan latihan tali temali'],
                    ['url' => 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Upacara api unggun malam keakraban pramuka'],
                ],
                'sort_order' => 3,
            ],
            [
                'title' => 'Pelepasan & Wisuda Siswa-Siswi Angkatan 2026',
                'slug' => 'pelepasan-dan-wisuda-siswa-angkatan-2026',
                'category' => 'Seremoni Sekolah',
                'description' => 'Momen penuh haru dan kebanggaan pelepasan kelulusan peserta didik kelas IX menuju jenjang pendidikan menengah atas.',
                'cover_image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
                'event_date' => '2026-06-20',
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Pengalungan medali kelulusan oleh Kepala Sekolah'],
                    ['url' => 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Foto bersama para wisudawan terbaik angkatan 2026'],
                ],
                'sort_order' => 4,
            ],
        ];

        foreach ($galleries as $gal) {
            \App\Models\Gallery::firstOrCreate(['slug' => $gal['slug']], $gal);
        }
    }
}

