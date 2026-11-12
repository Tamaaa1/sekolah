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
        $admin = User::first();

        // 1. Pengaturan Identitas Sekolah
        Setting::set('school_name', 'SMP Negeri 1 Nusantara', 'general');
        Setting::set('npsn', '20109876', 'general');
        Setting::set('accreditation', 'A (Unggul)', 'general');
        Setting::set('school_tagline', 'Berkarakter, Berprestasi, dan Berwawasan Global', 'general');
        Setting::set('principal_name', 'Drs. H. Mulyadi, M.Pd.', 'general');
        Setting::set('principal_speech', 'Selamat datang di Portal Resmi SMP Negeri 1 Nusantara. Sebagai lembaga pendidikan yang mengedepankan integritas budi pekerti dan keunggulan akademik, kami berkomitmen menyelenggarakan pembelajaran yang bermakna bagi seluruh peserta didik guna menyongsong masa depan bangsa yang gemilang.', 'general');

        Setting::set('phone', '(021) 7890-1234', 'contact');
        Setting::set('whatsapp', '0812-3456-7890', 'contact');
        Setting::set('email', 'humas@smpn1nusantara.sch.id', 'contact');
        Setting::set('address', 'Jl. Pendidikan Bangsa No. 45, Kebayoran Baru, Jakarta Selatan', 'contact');

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
                'excerpt' => 'Arah dan komitmen pendidikan SMP Negeri 1 Nusantara dalam mencetak generasi cerdas berakhlak mulia.',
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
                'title' => 'Sejarah Singkat SMP Negeri 1 Nusantara',
                'excerpt' => 'Perjalanan panjang dedikasi mencerdaskan anak bangsa sejak berdiri tahun 1978.',
                'content' => [
                    ['type' => 'paragraph', 'content' => 'SMP Negeri 1 Nusantara didirikan atas prakarsa tokoh masyarakat dan pemerintah daerah untuk memperluas akses pendidikan berkualitas di kawasan ibu kota. Selama hampir lima dekade, sekolah ini telah melahirkan ribuan alumni yang berkontribusi nyata di berbagai bidang pembangunan nasional.']
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
                'title' => 'Tim Robotik SMP Negeri 1 Raih Medali Emas Olimpiade Sains Nasional 2026',
                'excerpt' => 'Karya inovasi robot penyortir sampah otomatis rancangan siswa kelas VIII berhasil menyabet predikat juara pertama.',
                'content' => [
                    ['type' => 'paragraph', 'content' => 'Prestasi membanggakan kembali dipersembahkan oleh perwakilan peserta didik SMP Negeri 1 Nusantara. Dalam ajang Olimpiade Sains dan Teknologi Nasional tingkat SMP tahun 2026 yang diselenggarakan di Bandung, tim robotik sekolah berhasil mengungguli puluhan peserta dari berbagai provinsi.'],
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

        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Berita & Artikel', 'link_type' => 'custom_url', 'custom_url' => '/berita', 'sort_order' => 3]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Ekstrakurikuler', 'link_type' => 'custom_url', 'custom_url' => '/ekstrakurikuler', 'sort_order' => 4]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Prestasi', 'link_type' => 'custom_url', 'custom_url' => '/prestasi', 'sort_order' => 5]);
        MenuItem::create(['menu_id' => $headerPrimary->id, 'label' => 'Agenda Akademik', 'link_type' => 'custom_url', 'custom_url' => '/agenda', 'sort_order' => 6]);

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
            ['slug' => 'pramuka-gudep-nusantara'],
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
                'location' => 'Gedung A dan B SMPN 1 Nusantara',
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
                'location' => 'Aula Graha Utama Nusantara',
                'is_active' => true,
            ]
        );
    }
}
