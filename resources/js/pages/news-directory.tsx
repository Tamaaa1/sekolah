import { useState, type FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    ArrowRightIcon,
    CalendarDaysIcon,
    MagnifyingGlassIcon,
    MegaphoneIcon,
    NewspaperIcon,
    TagIcon,
    UserIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

type Category = {
    id: number;
    name: string;
    slug: string;
    posts_count?: number;
};

type Author = {
    id: number;
    name: string;
};

type PostItem = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    type: 'post' | 'announcement';
    status: string;
    featured_image?: string | null;
    published_at: string | null;
    is_pinned?: boolean;
    author?: Author;
    categories?: Category[];
};

type PaginatedPosts = {
    data: PostItem[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    settings: Record<string, any>;
    primaryMenu: any;
    posts: PaginatedPosts;
    categories: Category[];
    featuredPost?: PostItem | null;
    filters: {
        q: string;
        category: string;
        type: string;
    };
};

export default function NewsDirectory({
    settings,
    primaryMenu,
    posts,
    categories = [],
    featuredPost,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.q || '');
    const schoolName = settings?.school_name || 'SMP Negeri 5 Sambas';

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/berita',
            {
                ...filters,
                q: search.trim() || undefined,
                page: undefined,
            },
            { preserveState: true }
        );
    };

    const handleFilterCategory = (categorySlug: string) => {
        const nextCategory = filters.category === categorySlug ? undefined : categorySlug;
        router.get(
            '/berita',
            {
                ...filters,
                category: nextCategory,
                page: undefined,
            },
            { preserveState: true }
        );
    };

    const handleFilterType = (typeValue: string) => {
        const nextType = filters.type === typeValue ? undefined : typeValue;
        router.get(
            '/berita',
            {
                ...filters,
                type: nextType,
                page: undefined,
            },
            { preserveState: true }
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        router.get('/berita');
    };

    const hasActiveFilters = Boolean(filters.q || filters.category || filters.type);

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`Berita & Warta Sekolah - ${schoolName}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Page Header (Consistent with Staff, Ekskul, and Prestasi pages) */}
                <div className="border-b border-line pb-6 mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                        Kanal Publikasi & Informasi Resmi
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                        Warta, Berita & Artikel Sekolah
                    </h1>
                    <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                        Ikuti publikasi warta terkini, prestasi siswa, program edukatif, dan pengumuman resmi dari seluruh civitas akademika {schoolName}.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="mt-6 pt-6 border-t border-line flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul berita atau artikel..."
                                    className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#D8D2C6] rounded-xs text-[#1A2228] placeholder:text-[#8C949D] focus:outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C949D] hover:text-[#1A2228]"
                                    >
                                        <XMarkIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#0F2C59] text-white text-xs font-semibold rounded-xs hover:bg-[#0F2C59]/90 transition-colors shrink-0 shadow-2xs"
                            >
                                Cari
                            </button>
                        </form>

                        {/* Content Type Selector */}
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xs border border-[#D8D2C6] self-start lg:self-auto text-xs">
                            <button
                                type="button"
                                onClick={() => handleFilterType('')}
                                className={`px-3 py-1.5 rounded-2xs font-semibold transition-colors ${
                                    !filters.type
                                        ? 'bg-[#0F2C59] text-white shadow-2xs'
                                        : 'text-[#5A626A] hover:text-[#1A2228]'
                                }`}
                            >
                                Semua Format
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterType('post')}
                                className={`px-3 py-1.5 rounded-2xs font-semibold transition-colors flex items-center gap-1.5 ${
                                    filters.type === 'post'
                                        ? 'bg-[#0F2C59] text-white shadow-2xs'
                                        : 'text-[#5A626A] hover:text-[#1A2228]'
                                }`}
                            >
                                <NewspaperIcon className="w-3.5 h-3.5" />
                                <span>Berita</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterType('announcement')}
                                className={`px-3 py-1.5 rounded-2xs font-semibold transition-colors flex items-center gap-1.5 ${
                                    filters.type === 'announcement'
                                        ? 'bg-[#0F2C59] text-white shadow-2xs'
                                        : 'text-[#5A626A] hover:text-[#1A2228]'
                                }`}
                            >
                                <MegaphoneIcon className="w-3.5 h-3.5" />
                                <span>Pengumuman</span>
                            </button>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-line/60">
                            <span className="text-xs text-[#5A626A] flex items-center gap-1 font-medium mr-1">
                                <TagIcon className="w-3.5 h-3.5 text-[#C85A32]" />
                                Kategori:
                            </span>

                            <button
                                type="button"
                                onClick={() => handleFilterCategory('')}
                                className={`px-2.5 py-1 text-xs rounded-xs font-medium transition-all ${
                                    !filters.category
                                        ? 'bg-[#C85A32] text-white font-semibold'
                                        : 'bg-white text-[#5A626A] border border-[#D8D2C6] hover:bg-[#FAF9F6] hover:text-[#1A2228]'
                                }`}
                            >
                                Semua
                            </button>

                            {categories.map((cat) => {
                                const isActive = filters.category === cat.slug;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleFilterCategory(cat.slug)}
                                        className={`px-2.5 py-1 text-xs rounded-xs font-medium transition-all inline-flex items-center gap-1.5 ${
                                            isActive
                                                ? 'bg-[#C85A32] text-white font-semibold shadow-2xs'
                                                : 'bg-white text-[#5A626A] border border-[#D8D2C6] hover:bg-[#FAF9F6] hover:text-[#1A2228]'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        {cat.posts_count !== undefined && cat.posts_count > 0 && (
                                            <span
                                                className={`text-[10px] px-1 rounded-full font-mono ${
                                                    isActive ? 'bg-white/20 text-white' : 'bg-[#FAF9F6] text-[#5A626A]'
                                                }`}
                                            >
                                                {cat.posts_count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="ml-auto text-xs text-[#C85A32] hover:underline font-medium inline-flex items-center gap-1"
                                >
                                    <XMarkIcon className="w-3.5 h-3.5" />
                                    <span>Reset Filter</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Highlight / Featured Banner (Only on page 1 when no search/filters) */}
                {featuredPost && !hasActiveFilters && posts.current_page === 1 && (
                    <div className="mb-12 bg-white rounded-xs border border-[#E2DFD7] overflow-hidden shadow-xs hover:border-[#0F2C59]/40 transition group">
                        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                            <div className="lg:col-span-7 bg-[#FAF9F6] aspect-[16/9] lg:aspect-auto relative overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#E2DFD7]">
                                {featuredPost.featured_image ? (
                                    <img
                                        src={featuredPost.featured_image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="p-8 text-center flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center mb-3">
                                            <NewspaperIcon className="w-8 h-8" />
                                        </div>
                                        <span className="font-serif font-bold text-lg text-[#1A2228]">
                                            Sorotan Warta Utama
                                        </span>
                                    </div>
                                )}
                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#C85A32] text-white text-[11px] font-bold uppercase tracking-wider rounded-xs shadow-2xs">
                                    ★ Liputan Khusus
                                </span>
                            </div>

                            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A626A] mb-3">
                                        {featuredPost.categories && featuredPost.categories.length > 0 && (
                                            <span className="px-2 py-0.5 rounded-xs bg-[#0F2C59]/10 text-[#0F2C59] font-semibold text-[11px]">
                                                {featuredPost.categories[0].name}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 font-mono text-[11px]">
                                            <CalendarDaysIcon className="w-3.5 h-3.5 text-[#5A626A]" />
                                            {formatDate(featuredPost.published_at)}
                                        </span>
                                    </div>

                                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A2228] group-hover:text-[#0F2C59] transition-colors leading-snug">
                                        <Link href={`/${featuredPost.slug}`}>
                                            {featuredPost.title}
                                        </Link>
                                    </h2>

                                    <p className="text-sm text-[#5A626A] mt-3 leading-relaxed line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-[#E2DFD7] flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-[#5A626A]">
                                        <UserIcon className="w-4 h-4 text-[#8C949D]" />
                                        <span>Oleh: {featuredPost.author?.name || 'Redaksi Sekolah'}</span>
                                    </div>

                                    <Link
                                        href={`/${featuredPost.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2C59] hover:text-[#C85A32] transition-colors group/btn"
                                    >
                                        <span>Baca Selengkapnya</span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* News Grid Title */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E2DFD7]">
                    <h2 className="font-serif text-xl font-bold text-[#1A2228] flex items-center gap-2">
                        <span>Daftar Artikel & Pengumuman</span>
                        <span className="text-xs font-sans font-normal text-[#5A626A]">
                            ({posts.total} publikasi)
                        </span>
                    </h2>

                    {hasActiveFilters && (
                        <span className="text-xs text-[#5A626A]">
                            Menampilkan hasil pencarian / filter
                        </span>
                    )}
                </div>

                {/* News Grid */}
                {posts.data.length === 0 ? (
                    <div className="bg-white border border-[#E2DFD7] rounded-xs p-12 text-center max-w-xl mx-auto shadow-2xs">
                        <div className="w-14 h-14 bg-[#FAF9F6] border border-[#D8D2C6] rounded-full flex items-center justify-center mx-auto mb-3 text-[#5A626A]">
                            <MagnifyingGlassIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif font-bold text-lg text-[#1A2228]">
                            Tidak Ada Warta yang Sesuai
                        </h3>
                        <p className="text-xs text-[#5A626A] mt-1.5 leading-relaxed">
                            Tidak ditemukan artikel atau pengumuman dengan kata kunci &ldquo;{filters.q || filters.category}&rdquo;. Coba gunakan kata kunci lain atau bersihkan filter.
                        </p>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F2C59] text-white text-xs font-semibold rounded-xs hover:bg-[#0F2C59]/90 transition"
                        >
                            Tampilkan Semua Berita
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.data.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white border border-[#E2DFD7] rounded-xs overflow-hidden shadow-2xs hover:border-[#0F2C59]/40 hover:shadow-xs transition flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Cover Thumbnail */}
                                    <Link
                                        href={`/${post.slug}`}
                                        className="aspect-[16/10] bg-[#FAF9F6] relative overflow-hidden flex items-center justify-center border-b border-[#E2DFD7] block"
                                    >
                                        {post.featured_image ? (
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-[#8C949D]">
                                                {post.type === 'announcement' ? (
                                                    <MegaphoneIcon className="w-10 h-10 text-[#C85A32]/70 mb-1" />
                                                ) : (
                                                    <NewspaperIcon className="w-10 h-10 text-[#0F2C59]/60 mb-1" />
                                                )}
                                                <span className="text-[11px] font-serif font-medium text-[#5A626A]">
                                                    {post.type === 'announcement' ? 'Pengumuman Resmi' : 'Warta Sekolah'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Type Pill Overlay */}
                                        <div className="absolute top-2.5 left-2.5">
                                            <span
                                                className={`px-2 py-0.5 rounded-2xs text-[10px] font-bold uppercase tracking-wider shadow-2xs ${
                                                    post.type === 'announcement'
                                                        ? 'bg-[#C85A32] text-white'
                                                        : 'bg-[#0F2C59] text-white'
                                                }`}
                                            >
                                                {post.type === 'announcement' ? 'Pengumuman' : 'Warta'}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Body */}
                                    <div className="p-5">
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5A626A] mb-2.5">
                                            {post.categories && post.categories.length > 0 && (
                                                <span className="font-semibold text-[#0F2C59] bg-[#0F2C59]/8 px-2 py-0.5 rounded-xs">
                                                    {post.categories[0].name}
                                                </span>
                                            )}
                                            <span className="font-mono">
                                                {formatDate(post.published_at)}
                                            </span>
                                        </div>

                                        <h3 className="font-serif font-bold text-base text-[#1A2228] group-hover:text-[#0F2C59] transition-colors leading-snug line-clamp-2">
                                            <Link href={`/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h3>

                                        <p className="text-xs text-[#5A626A] mt-2 leading-relaxed line-clamp-3">
                                            {post.excerpt || 'Klik untuk membaca rincian artikel dan informasi selengkapnya.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Link */}
                                <div className="px-5 py-3.5 bg-[#FAF9F6] border-t border-[#E2DFD7] flex items-center justify-between text-xs">
                                    <span className="text-[11px] text-[#5A626A] truncate max-w-[140px]">
                                        {post.author?.name || 'Humas Sekolah'}
                                    </span>

                                    <Link
                                        href={`/${post.slug}`}
                                        className="font-bold text-[#0F2C59] hover:text-[#C85A32] transition-colors inline-flex items-center gap-1 group/link"
                                    >
                                        <span>Baca Rincian</span>
                                        <ArrowRightIcon className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {posts.last_page > 1 && (
                    <div className="mt-12 pt-6 border-t border-[#E2DFD7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                        <span className="text-[#5A626A]">
                            Menampilkan {posts.from || 0} - {posts.to || 0} dari total {posts.total} publikasi
                        </span>

                        <div className="flex items-center gap-1">
                            {posts.prev_page_url ? (
                                <Link
                                    href={posts.prev_page_url}
                                    className="px-3 py-1.5 bg-white border border-[#D8D2C6] rounded-xs text-[#1A2228] hover:bg-[#FAF9F6] font-medium"
                                >
                                    &larr; Sebelumnya
                                </Link>
                            ) : (
                                <span className="px-3 py-1.5 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xs text-[#8C949D] cursor-not-allowed">
                                    &larr; Sebelumnya
                                </span>
                            )}

                            <div className="hidden sm:flex items-center gap-1 mx-1">
                                {posts.links
                                    .filter((l) => !l.label.includes('Previous') && !l.label.includes('Next'))
                                    .map((l, idx) => (
                                        <Link
                                            key={idx}
                                            href={l.url || '#'}
                                            className={`px-3 py-1.5 rounded-xs text-xs font-semibold ${
                                                l.active
                                                    ? 'bg-[#0F2C59] text-white shadow-2xs'
                                                    : 'bg-white border border-[#D8D2C6] text-[#1A2228] hover:bg-[#FAF9F6]'
                                            }`}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: l.label }} />
                                        </Link>
                                    ))}
                            </div>

                            {posts.next_page_url ? (
                                <Link
                                    href={posts.next_page_url}
                                    className="px-3 py-1.5 bg-white border border-[#D8D2C6] rounded-xs text-[#1A2228] hover:bg-[#FAF9F6] font-medium"
                                >
                                    Selanjutnya &rarr;
                                </Link>
                            ) : (
                                <span className="px-3 py-1.5 bg-[#FAF9F6] border border-[#E2DFD7] rounded-xs text-[#8C949D] cursor-not-allowed">
                                    Selanjutnya &rarr;
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

