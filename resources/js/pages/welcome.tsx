import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import ScrollStack, { ScrollStackItem } from '@/components/ui/scroll-stack';
import {
    AcademicCapIcon,
    ArrowDownTrayIcon,
    ArrowRightIcon,
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
    photo_url?: string | null;
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
    const schoolName = settings?.school_name || 'SMP Negeri 5 Sambas';
    const tagline = settings?.school_tagline || 'Berkarakter, Berprestasi, dan Berwawasan Global';
    const speech = settings?.principal_speech || 'Selamat datang di Portal Resmi SMP Negeri 5 Sambas...';
    const principalName = principal?.name || settings?.principal_name || 'Drs. H. Mulyadi, M.Pd.';
    const principalPosition = principal?.position || 'Kepala Sekolah';
    const principalPhoto = principal?.photo_url || principal?.photo || null;
    const heroBannerImage = settings?.hero_banner_image || null;
    const heroBannerCaption = settings?.hero_banner_caption || null;

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
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
                {heroBannerImage ? (
                    /* Immersive Hero Banner: Clean typography over the image */
                    <div className="relative mb-8 rounded-lg overflow-hidden border border-stone-300/80 shadow-xs min-h-[300px] sm:min-h-[360px] md:min-h-[400px] flex flex-col justify-end">
                        {/* Background Image */}
                        <img
                            src={heroBannerImage}
                            alt={heroBannerCaption || schoolName}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Architectural Editorial Scrim / Gradient Overlay for high-contrast legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F3F]/95 via-[#0A1F3F]/50 to-transparent" />

                        {/* Headline & Tagline Overlay */}
                        <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-3xl">
                            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                                {schoolName}
                            </h1>
                            <p className="text-white/90 text-base sm:text-lg mt-2.5 font-normal leading-relaxed max-w-2xl">
                                {tagline}
                            </p>
                            {heroBannerCaption && (
                                <p className="text-xs text-white/70 mt-3 font-sans italic">
                                    {heroBannerCaption}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Default Typographic Headline Banner (when no image banner is set) */
                    <div className="border-b border-line pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
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
                )}

                {/* Scroll Stack Sections: 4 Cards */}
                <div className="mt-8">
                    <ScrollStack
                        useWindowScroll={true}
                        stackPosition="96px"
                        itemDistance={100}
                        itemStackDistance={24}
                        itemScale={0.035}
                        baseScale={0.88}
                        dimAmount={0.14}
                        holdDistance={160}
                        smoothScroll={false}
                    >
                        {/* Section 1: Sambutan Kepala Sekolah & Pengumuman Resmi */}
                        <ScrollStackItem itemClassName="p-6 sm:p-8 lg:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                {/* Sambutan Kepala Sekolah (Col 7) */}
                                <div className="lg:col-span-7 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <AcademicCapIcon className="w-5 h-5 text-prussian" />
                                            <span className="text-xs font-semibold uppercase tracking-wider text-prussian">
                                                Sambutan Kepala Sekolah
                                            </span>
                                        </div>
                                        <blockquote className="font-serif italic text-ink text-base sm:text-lg lg:text-xl leading-relaxed pl-4 border-l-2 border-prussian my-2">
                                            &ldquo;{speech}&rdquo;
                                        </blockquote>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {principalPhoto ? (
                                                <img
                                                    src={principalPhoto}
                                                    alt={principalName}
                                                    className="w-11 h-11 rounded-full object-cover object-top border border-stone-300/80 shrink-0 bg-stone-100"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-full bg-stone-100 border border-stone-300/80 flex items-center justify-center text-ink-muted shrink-0">
                                                    <UserIcon className="w-5 h-5 text-ink-muted" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-ink truncate">{principalName}</div>
                                                <div className="text-xs text-ink-muted truncate">{principalPosition}</div>
                                            </div>
                                        </div>
                                        <Link
                                            href="/guru-dan-staf"
                                            className="text-xs font-semibold text-prussian hover:underline inline-flex items-center gap-1 shrink-0"
                                        >
                                            <span>Lihat Profil GTK</span>
                                            <ArrowRightIcon className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Recent Announcements Widget (Col 5) */}
                                <div className="lg:col-span-5 bg-canvas-subtle/50 rounded-lg border border-line p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
                                            <div className="flex items-center gap-2">
                                                <MegaphoneIcon className="w-4 h-4 text-terracotta" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                                                    Pengumuman Resmi
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-ink-muted font-mono">Warta Terbaru</span>
                                        </div>

                                        <div className="space-y-3">
                                            {announcements.length > 0 ? (
                                                announcements.slice(0, 3).map((item) => (
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
                                                <p className="text-xs text-ink-muted italic py-4 text-center">
                                                    Belum ada pengumuman terbaru.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {announcements.length > 0 && (
                                        <div className="mt-3 pt-2.5 border-t border-line/60 text-right">
                                            <Link
                                                href="/pengumuman"
                                                className="text-xs font-semibold text-prussian hover:underline inline-flex items-center gap-1"
                                            >
                                                <span>Semua Pengumuman</span>
                                                <ArrowRightIcon className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollStackItem>

                        {/* Section 2: Berita & Dokumentasi */}
                        <ScrollStackItem itemClassName="p-6 sm:p-8 lg:p-10">
                            <div className="flex items-end justify-between border-b border-line pb-4 mb-6">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                                        Berita & Dokumentasi
                                    </span>
                                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-0.5">
                                        Warta & Liputan Terkini
                                    </h2>
                                </div>
                                <Link
                                    href="/berita"
                                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-prussian hover:underline"
                                >
                                    <span>Indeks Berita</span>
                                    <ChevronRightIcon className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {latestPosts.length > 0 ? (
                                    latestPosts.slice(0, 3).map((post) => (
                                        <article
                                            key={post.id}
                                            className="bg-canvas-subtle/40 rounded-lg border border-line p-5 flex flex-col justify-between hover:border-line-strong hover:bg-white hover:shadow-xs transition-all group"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 text-xs text-ink-muted">
                                                    {post.categories && post.categories[0] && (
                                                        <span className="px-2 py-0.5 rounded-xs bg-white border border-line text-ink font-medium text-[11px]">
                                                            {post.categories[0].name}
                                                        </span>
                                                    )}
                                                    <span className="text-[11px]">{formatDate(post.published_at)}</span>
                                                </div>

                                                <Link href={`/${post.slug}`}>
                                                    <h3 className="font-serif font-bold text-base sm:text-lg text-ink group-hover:text-prussian transition-colors leading-snug line-clamp-2">
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
                        </ScrollStackItem>

                        {/* Section 3: Prestasi Siswa & Agenda Akademik */}
                        <ScrollStackItem itemClassName="p-6 sm:p-8 lg:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                {/* Prestasi Siswa (Col 7) */}
                                <div className="lg:col-span-7 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-end justify-between border-b border-line pb-3 mb-4">
                                            <div className="flex items-center gap-2">
                                                <TrophyIcon className="w-5 h-5 text-terracotta" />
                                                <div>
                                                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                                                        Prestasi Siswa
                                                    </h2>
                                                    <p className="text-[11px] text-ink-muted">
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

                                        <div className="space-y-3">
                                            {achievements.length > 0 ? (
                                                achievements.slice(0, 3).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-canvas-subtle/50 rounded-lg border border-line p-3.5 flex items-start gap-3.5 shadow-2xs"
                                                    >
                                                        <div className="w-10 h-10 rounded bg-white border border-line flex flex-col items-center justify-center shrink-0 text-prussian">
                                                            <SparklesIcon className="w-4 h-4 text-terracotta" />
                                                            <span className="text-[9px] font-bold font-mono">{item.year}</span>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-prussian-light text-prussian">
                                                                    {item.level}
                                                                </span>
                                                                <span className="text-xs font-semibold text-terracotta">
                                                                    {item.rank}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-serif font-bold text-sm text-ink leading-snug truncate">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-[11px] text-ink-secondary mt-0.5 truncate">
                                                                {item.student_name} • {item.competition_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-ink-muted italic py-4 text-center">
                                                    Belum ada catatan prestasi.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Agenda Akademik (Col 5) */}
                                <div className="lg:col-span-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-end justify-between border-b border-line pb-3 mb-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarDaysIcon className="w-5 h-5 text-prussian" />
                                                <div>
                                                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                                                        Agenda Akademik
                                                    </h2>
                                                    <p className="text-[11px] text-ink-muted">
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

                                        <div className="space-y-2.5">
                                            {upcomingAgendas.length > 0 ? (
                                                upcomingAgendas.slice(0, 3).map((agenda) => {
                                                    const startDate = new Date(agenda.start_date);
                                                    const day = startDate.getDate();
                                                    const month = startDate.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();

                                                    return (
                                                        <div
                                                            key={agenda.id}
                                                            className="bg-canvas-subtle/50 rounded-lg border border-line p-3 flex items-center gap-3 shadow-2xs"
                                                        >
                                                            <div className="w-10 h-10 rounded bg-prussian text-white flex flex-col items-center justify-center shrink-0 font-mono leading-none">
                                                                <span className="text-sm font-bold">{day}</span>
                                                                <span className="text-[9px] uppercase tracking-wider mt-0.5 text-canvas-subtle">
                                                                    {month}
                                                                </span>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-xs text-ink leading-snug line-clamp-1">
                                                                    {agenda.title}
                                                                </h4>
                                                                {agenda.location && (
                                                                    <p className="text-[10px] text-ink-muted mt-0.5 truncate">
                                                                        Lokasi: {agenda.location}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-xs text-ink-muted italic py-4 text-center">
                                                    Belum ada agenda terdekat.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollStackItem>

                        {/* Section 4: PPDB Banner */}
                        <ScrollStackItem itemClassName="p-6 sm:p-10 lg:p-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-3 max-w-2xl">
                                    <span className="inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-terracotta-light text-terracotta border border-terracotta/20">
                                        PPDB Tahun Ajaran {settings?.ppdb_year || '2026/2027'}
                                    </span>
                                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
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
                                        className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-sm font-bold text-center transition-colors shadow-xs"
                                    >
                                        Informasi & Alur Pendaftaran
                                    </Link>
                                    {settings?.ppdb_brochure_url && (
                                        <a
                                            href={settings.ppdb_brochure_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto px-5 py-3.5 rounded-lg border border-line text-ink hover:bg-canvas-subtle text-sm font-semibold text-center inline-flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4 text-ink-muted" />
                                            <span>Unduh Brosur</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </ScrollStackItem>
                    </ScrollStack>
                </div>
            </section>
        </PublicLayout>
    );
}
