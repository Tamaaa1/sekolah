import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    AcademicCapIcon,
    ArrowDownTrayIcon,
    ArrowRightIcon,
    BookmarkIcon,
    CalendarDaysIcon,
    ChevronRightIcon,
    MegaphoneIcon,
    SparklesIcon,
    TrophyIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

type Category = {
    id: number;
    name: string;
    slug: string;
};

type Author = {
    id: number;
    name: string;
};

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    type: string;
    is_pinned: boolean;
    published_at: string | null;
    categories?: Category[];
    author?: Author;
    featured_image?: string | null;
};

type Agenda = {
    id: number;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    location: string | null;
};

type Achievement = {
    id: number;
    title: string;
    student_name: string;
    competition_name: string;
    level: string;
    rank: string;
    year: number;
};

type Staff = {
    id: number;
    name: string;
    position: string;
    photo: string | null;
    nip: string | null;
};

type WelcomeProps = {
    settings: Record<string, any>;
    primaryMenu: any;
    pinnedPost: Post | null;
    latestPosts: Post[];
    announcements: Post[];
    upcomingAgendas: Agenda[];
    achievements: Achievement[];
    principal: Staff | null;
};

export default function Welcome({
    settings,
    primaryMenu,
    pinnedPost,
    latestPosts = [],
    announcements = [],
    upcomingAgendas = [],
    achievements = [],
    principal,
}: WelcomeProps) {
    const schoolName = settings?.school_name || 'SMP Negeri 1 Nusantara';
    const tagline = settings?.school_tagline || 'Berkarakter, Berprestasi, dan Berwawasan Global';
    const speech = settings?.principal_speech || 'Selamat datang di Portal Resmi SMP Negeri 1 Nusantara...';
    const principalName = principal?.name || settings?.principal_name || 'Drs. H. Mulyadi, M.Pd.';
    const principalPosition = principal?.position || 'Kepala Sekolah';

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`${schoolName} - ${tagline}`} />

            {/* Asymmetric Hero & Bento Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
                {/* School Headline Banner */}
                <div className="border-b border-line pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-prussian font-semibold">
                            Edisi Informasi & Warta Resmi
                        </span>
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ink mt-2 tracking-tight">
                            {schoolName}
                        </h1>
                        <p className="text-ink-secondary text-base md:text-lg mt-2 max-w-2xl font-normal leading-relaxed">
                            {tagline}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-canvas-subtle text-ink-secondary text-xs font-medium border border-line">
                            <span className="w-2 h-2 rounded-full bg-status-published" />
                            Tahun Ajaran Aktif 2025/2026
                        </span>
                    </div>
                </div>

                {/* Hero Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Primary Headline Post (Col 7) */}
                    <div className="lg:col-span-7 bg-white rounded border border-line p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                        {pinnedPost ? (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-terracotta-light text-terracotta border border-terracotta/20">
                                        <BookmarkIcon className="w-3.5 h-3.5" />
                                        Sorotan Utama
                                    </span>
                                    {pinnedPost.categories && pinnedPost.categories[0] && (
                                        <span className="text-xs font-medium text-ink-muted">
                                            {pinnedPost.categories[0].name}
                                        </span>
                                    )}
                                    <span className="text-xs text-ink-muted">•</span>
                                    <span className="text-xs text-ink-muted">
                                        {formatDate(pinnedPost.published_at)}
                                    </span>
                                </div>

                                <Link href={`/${pinnedPost.slug}`} className="group">
                                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ink group-hover:text-prussian transition-colors leading-tight">
                                        {pinnedPost.title}
                                    </h2>
                                </Link>

                                <p className="mt-4 text-ink-secondary text-sm sm:text-base leading-relaxed">
                                    {pinnedPost.excerpt ||
                                        'Klik untuk membaca laporan selengkapnya mengenai perkembangan dan torehan prestasi akademik terbaru.'}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-ink">
                                    Selamat Datang di Portal Resmi {schoolName}
                                </h2>
                                <p className="mt-3 text-ink-secondary text-sm">
                                    Pusat keterbukaan informasi publik dan arsip kegiatan akademik sekolah.
                                </p>
                            </div>
                        )}

                        <div className="pt-6 mt-6 border-t border-line flex items-center justify-between">
                            <span className="text-xs text-ink-muted font-mono">
                                Redaksi Humas Sekolah
                            </span>
                            {pinnedPost && (
                                <Link
                                    href={`/${pinnedPost.slug}`}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-prussian hover:text-prussian-hover transition-colors"
                                >
                                    <span>Baca Berita Lengkap</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Column Bento: Announcements & Headmaster Speech (Col 5) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Sambutan Kepala Sekolah Box */}
                        <div className="bg-canvas-subtle rounded border border-line p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <AcademicCapIcon className="w-5 h-5 text-prussian" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-prussian">
                                    Sambutan Kepala Sekolah
                                </span>
                            </div>
                            <blockquote className="font-serif italic text-ink text-sm sm:text-base leading-relaxed pl-3 border-l-2 border-prussian">
                                "{speech}"
                            </blockquote>
                            <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-ink">{principalName}</div>
                                    <div className="text-[11px] text-ink-muted">{principalPosition}</div>
                                </div>
                                <Link
                                    href="/guru-dan-staf"
                                    className="text-xs font-medium text-prussian hover:underline"
                                >
                                    Lihat GTK &rarr;
                                </Link>
                            </div>
                        </div>

                        {/* Recent Announcements Widget */}
                        <div className="bg-white rounded border border-line p-5 shadow-xs flex-1">
                            <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
                                <div className="flex items-center gap-2">
                                    <MegaphoneIcon className="w-4 h-4 text-terracotta" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-ink">
                                        Pengumuman Resmi
                                    </span>
                                </div>
                                <span className="text-[11px] text-ink-muted">Terbaru</span>
                            </div>

                            <div className="space-y-3">
                                {announcements.length > 0 ? (
                                    announcements.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group block pb-2.5 border-b border-line/40 last:border-0 last:pb-0"
                                        >
                                            <div className="text-[11px] text-ink-muted mb-0.5">
                                                {formatDate(item.published_at)}
                                            </div>
                                            <Link
                                                href={`/${item.slug}`}
                                                className="text-xs sm:text-sm font-semibold text-ink group-hover:text-prussian transition-colors line-clamp-2"
                                            >
                                                {item.title}
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-ink-muted italic py-2">
                                        Belum ada pengumuman terbaru.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Berita Terbaru & Warta Sekolah */}
            <section className="bg-white border-y border-line py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-end justify-between border-b border-line pb-4 mb-8">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                                Berita & Dokumentasi
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">
                                Warta & Liputan Terkini
                            </h2>
                        </div>
                        <Link
                            href="/berita"
                            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-prussian hover:underline"
                        >
                            <span>Indeks Berita</span>
                            <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latestPosts.length > 0 ? (
                            latestPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-canvas-paper rounded border border-line p-5 flex flex-col justify-between hover:border-line-strong transition-all group"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-xs text-ink-muted">
                                            {post.categories && post.categories[0] && (
                                                <span className="px-2 py-0.5 rounded-xs bg-canvas-subtle text-ink font-medium">
                                                    {post.categories[0].name}
                                                </span>
                                            )}
                                            <span>{formatDate(post.published_at)}</span>
                                        </div>

                                        <Link href={`/${post.slug}`}>
                                            <h3 className="font-serif font-bold text-lg text-ink group-hover:text-prussian transition-colors leading-snug line-clamp-3">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        <p className="mt-2 text-ink-secondary text-xs leading-relaxed line-clamp-3">
                                            {post.excerpt || 'Klik untuk membaca laporan selengkapnya.'}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                                        <Link
                                            href={`/${post.slug}`}
                                            className="font-semibold text-prussian hover:underline inline-flex items-center gap-1"
                                        >
                                            <span>Selengkapnya</span>
                                            <ArrowRightIcon className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center text-ink-muted text-sm italic">
                                Belum ada publikasi berita tambahan.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Rekap Prestasi Siswa & Agenda Akademik (Dual Grid) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Prestasi Unggulan (Col 7) */}
                    <div className="lg:col-span-7">
                        <div className="flex items-end justify-between border-b border-line pb-3 mb-6">
                            <div className="flex items-center gap-2">
                                <TrophyIcon className="w-6 h-6 text-terracotta" />
                                <div>
                                    <h2 className="font-serif text-2xl font-bold text-ink">
                                        Prestasi Siswa
                                    </h2>
                                    <p className="text-xs text-ink-muted">
                                        Torehan kejuaraan akademik & seni budaya
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/prestasi"
                                className="text-xs font-semibold text-prussian hover:underline"
                            >
                                Semua Prestasi &rarr;
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {achievements.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded border border-line p-4 flex items-start gap-4 shadow-xs"
                                >
                                    <div className="w-12 h-12 rounded bg-canvas-subtle border border-line flex flex-col items-center justify-center shrink-0 text-prussian">
                                        <SparklesIcon className="w-5 h-5 text-terracotta" />
                                        <span className="text-[10px] font-bold font-mono">{item.year}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-prussian-light text-prussian">
                                                {item.level}
                                            </span>
                                            <span className="text-xs font-semibold text-terracotta">
                                                {item.rank}
                                            </span>
                                        </div>
                                        <h4 className="font-serif font-bold text-base text-ink leading-snug">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-ink-secondary mt-0.5">
                                            Peserta: <span className="font-medium text-ink">{item.student_name}</span> • {item.competition_name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Kalender & Agenda Mendatang (Col 5) */}
                    <div className="lg:col-span-5">
                        <div className="flex items-end justify-between border-b border-line pb-3 mb-6">
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="w-6 h-6 text-prussian" />
                                <div>
                                    <h2 className="font-serif text-2xl font-bold text-ink">
                                        Agenda Akademik
                                    </h2>
                                    <p className="text-xs text-ink-muted">
                                        Jadwal penting kegiatan sekolah
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/agenda"
                                className="text-xs font-semibold text-prussian hover:underline"
                            >
                                Kalender Lengkap &rarr;
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {upcomingAgendas.map((agenda) => {
                                const startDate = new Date(agenda.start_date);
                                const day = startDate.getDate();
                                const month = startDate.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();

                                return (
                                    <div
                                        key={agenda.id}
                                        className="bg-white rounded border border-line p-4 flex items-center gap-4 shadow-xs"
                                    >
                                        <div className="w-12 h-12 rounded bg-prussian text-white flex flex-col items-center justify-center shrink-0 font-mono leading-none">
                                            <span className="text-base font-bold">{day}</span>
                                            <span className="text-[10px] uppercase tracking-wider mt-0.5 text-canvas-subtle">
                                                {month}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-ink leading-snug line-clamp-2">
                                                {agenda.title}
                                            </h4>
                                            {agenda.location && (
                                                <p className="text-[11px] text-ink-muted mt-0.5">
                                                    Lokasi: {agenda.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* PPDB Banner Section */}
            <section className="bg-canvas-subtle border-t border-line py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="bg-white rounded border border-line-strong p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
                        <div className="space-y-2 max-w-2xl">
                            <span className="inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-terracotta-light text-terracotta border border-terracotta/20">
                                PPDB Tahun Ajaran {settings?.ppdb_year || '2026/2027'}
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                                Bergabunglah Menjadi Bagian dari Insan Pembelajar Berkarakter
                            </h3>
                            <p className="text-sm text-ink-secondary leading-relaxed">
                                Pendaftaran terbuka melalui 4 jalur: Zonasi, Afirmasi, Prestasi, dan
                                Perpindahan Tugas Orang Tua. Pastikan berkas administratif Anda telah lengkap.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                            <Link
                                href="/ppdb"
                                className="w-full sm:w-auto px-6 py-3 rounded bg-terracotta hover:bg-terracotta-hover text-white text-sm font-bold text-center transition-colors"
                            >
                                Informasi & Alur Pendaftaran
                            </Link>
                            <a
                                href={settings?.ppdb_brochure_url || '#'}
                                className="w-full sm:w-auto px-5 py-3 rounded border border-line text-ink hover:bg-canvas-subtle text-sm font-semibold text-center inline-flex items-center justify-center gap-2 transition-colors"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 text-ink-muted" />
                                <span>Unduh Brosur</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
