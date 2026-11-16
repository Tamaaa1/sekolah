import { useState, useEffect, type FormEvent } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SeoHead from '@/components/seo-head';
import {
    CalendarDaysIcon,
    CameraIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    TagIcon,
    XMarkIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface GalleryPhoto {
    url: string;
    caption?: string;
}

interface Gallery {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string | null;
    cover_image: string | null;
    event_date: string | null;
    images: GalleryPhoto[] | null;
}

interface GalleryDirectoryProps {
    settings: Record<string, any>;
    primaryMenu: any;
    galleries: Gallery[];
    categories: string[];
    filters: {
        category?: string;
        q?: string;
    };
}

export default function GalleryDirectory({
    settings,
    primaryMenu,
    galleries = [],
    categories = [],
    filters,
}: GalleryDirectoryProps) {
    const schoolName = settings?.school_name || 'SMP Negeri 5 Sambas';
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [searchQuery, setSearchQuery] = useState(filters.q || '');

    // Lightbox modal state
    const [activeAlbum, setActiveAlbum] = useState<Gallery | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleFilterChange = (cat: string, q = searchQuery) => {
        setSelectedCategory(cat);
        router.get(
            '/galeri',
            {
                category: cat || undefined,
                q: q.trim() || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleFilterChange(selectedCategory, searchQuery);
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSearchQuery('');
        router.get('/galeri');
    };

    const openLightbox = (album: Gallery, startIndex = 0) => {
        setActiveAlbum(album);
        setCurrentPhotoIndex(startIndex);
    };

    const closeLightbox = () => {
        setActiveAlbum(null);
        setCurrentPhotoIndex(0);
    };

    const albumPhotos = activeAlbum
        ? (Array.isArray(activeAlbum.images) && activeAlbum.images.length > 0
              ? activeAlbum.images
              : activeAlbum.cover_image
              ? [{ url: activeAlbum.cover_image, caption: activeAlbum.title }]
              : [])
        : [];

    const nextPhoto = () => {
        if (albumPhotos.length > 0) {
            setCurrentPhotoIndex((prev) => (prev + 1) % albumPhotos.length);
        }
    };

    const prevPhoto = () => {
        if (albumPhotos.length > 0) {
            setCurrentPhotoIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length);
        }
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeAlbum) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeAlbum, albumPhotos.length]);

    const hasActiveFilters = Boolean(filters.q || filters.category || searchQuery.trim() || selectedCategory);
    const featuredAlbum = galleries.length > 0 ? galleries[0] : null;

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <SeoHead
                title={`Galeri & Dokumentasi Kegiatan - ${schoolName}`}
                description={`Koleksi foto kegiatan, upacara, ekstrakurikuler, dan pentas seni budaya di ${schoolName}.`}
                keywords={`galeri ${schoolName}, foto smpn 5 sambas, kegiatan sekolah sambas, dokumentasi smpn 5 sambas`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Page Header (Consistent with News Directory, Staff, and Ekskul) */}
                <div className="border-b border-line pb-6 mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                        Dokumentasi & Memori Sekolah
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                        Galeri Kegiatan Siswa
                    </h1>
                    <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                        Rekam jejak visual aktivitas akademik, ekstrakurikuler, seremoni kenegaraan, serta kebersamaan keluarga besar civitas akademika {schoolName}.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="mt-6 pt-6 border-t border-line flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari album kegiatan..."
                                    className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#D8D2C6] rounded-xs text-[#1A2228] placeholder:text-[#8C949D] focus:outline-none focus:border-prussian focus:ring-1 focus:ring-prussian"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            handleFilterChange(selectedCategory, '');
                                        }}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C949D] hover:text-[#1A2228]"
                                        title="Hapus pencarian"
                                    >
                                        <XMarkIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-prussian text-white text-xs font-semibold rounded-xs hover:bg-prussian-hover transition-colors shrink-0 shadow-2xs"
                            >
                                Cari
                            </button>
                        </form>

                        {/* Controls Toolbar: Category Dropdown, Total Counter, & Reset Filter */}
                        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto text-xs">
                            {/* Category Dropdown */}
                            {categories.length > 0 && (
                                <div className="relative flex items-center">
                                    <TagIcon className="w-3.5 h-3.5 text-[#C85A32] absolute left-3 pointer-events-none" />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                        className="pl-8 pr-8 py-2 text-xs bg-white border border-[#D8D2C6] rounded-xs text-[#1A2228] font-medium focus:outline-none focus:border-prussian focus:ring-1 focus:ring-prussian shadow-2xs cursor-pointer appearance-none"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#5A626A] absolute right-2.5 pointer-events-none" />
                                </div>
                            )}

                            {/* Format Indicator Counter */}
                            <div className="flex items-center gap-2 text-xs text-[#5A626A] font-mono bg-white px-3 py-2 border border-[#D8D2C6] rounded-xs shadow-2xs">
                                <PhotoIcon className="w-4 h-4 text-prussian" />
                                <span>Total: <strong className="text-[#1A2228]">{galleries.length}</strong> Album</span>
                            </div>

                            {/* Reset Filter Button */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="text-xs text-[#C85A32] hover:underline font-medium inline-flex items-center gap-1 px-2 py-1.5"
                                >
                                    <XMarkIcon className="w-3.5 h-3.5" />
                                    <span>Reset Filter</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Highlight / Featured Banner (Only when no search/filters active) */}
                {featuredAlbum && !hasActiveFilters && (
                    <div
                        onClick={() => openLightbox(featuredAlbum)}
                        className="mb-12 bg-white rounded-xs border border-[#E2DFD7] overflow-hidden shadow-xs hover:border-prussian/40 transition group cursor-pointer"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                            <div className="lg:col-span-7 bg-[#FAF9F6] aspect-[16/9] lg:aspect-auto relative overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#E2DFD7]">
                                {featuredAlbum.cover_image ? (
                                    <img
                                        src={featuredAlbum.cover_image}
                                        alt={featuredAlbum.title}
                                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="p-8 text-center flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-prussian/10 text-prussian flex items-center justify-center mb-3">
                                            <PhotoIcon className="w-8 h-8" />
                                        </div>
                                        <span className="font-serif font-bold text-lg text-[#1A2228]">
                                            Dokumentasi Utama
                                        </span>
                                    </div>
                                )}
                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#C85A32] text-white text-[11px] font-bold uppercase tracking-wider rounded-xs shadow-2xs">
                                    ★ Album Sorotan
                                </span>
                                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-2xs text-[11px] font-mono font-semibold bg-black/75 text-white backdrop-blur-xs shadow-2xs">
                                    <PhotoIcon className="w-3.5 h-3.5" />
                                    <span>{Array.isArray(featuredAlbum.images) ? featuredAlbum.images.length : (featuredAlbum.cover_image ? 1 : 0)} Foto</span>
                                </span>
                            </div>

                            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A626A] mb-3">
                                        <span className="px-2 py-0.5 rounded-xs bg-prussian/10 text-prussian font-semibold text-[11px]">
                                            {featuredAlbum.category}
                                        </span>
                                        <span className="flex items-center gap-1 font-mono text-[11px]">
                                            <CalendarDaysIcon className="w-3.5 h-3.5 text-[#5A626A]" />
                                            {featuredAlbum.event_date ? formatDate(featuredAlbum.event_date) : 'Dokumentasi Sekolah'}
                                        </span>
                                    </div>

                                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A2228] group-hover:text-prussian transition-colors leading-snug">
                                        {featuredAlbum.title}
                                    </h2>

                                    <p className="text-sm text-[#5A626A] mt-3 leading-relaxed line-clamp-3">
                                        {featuredAlbum.description || 'Kumpulan potret dan dokumentasi berharga dari seluruh rangkaian kegiatan civitas akademika sekolah.'}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-[#E2DFD7] flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-[#5A626A] font-mono">
                                        <CameraIcon className="w-4 h-4 text-prussian" />
                                        <span>Koleksi Dokumentasi Visual</span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-prussian group-hover:text-[#C85A32] transition-colors group/btn">
                                        <span>Buka Album</span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery Grid Title Header */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E2DFD7]">
                    <h2 className="font-serif text-xl font-bold text-[#1A2228] flex items-center gap-2">
                        <span>Daftar Album Dokumentasi Kegiatan</span>
                        <span className="text-xs font-sans font-normal text-[#5A626A]">
                            ({galleries.length} album)
                        </span>
                    </h2>

                    {hasActiveFilters && (
                        <span className="text-xs text-[#5A626A]">
                            Menampilkan hasil filter / pencarian
                        </span>
                    )}
                </div>

                {/* Gallery Cards Grid */}
                {galleries.length === 0 ? (
                    <div className="bg-white border border-[#E2DFD7] rounded-xs p-12 text-center max-w-xl mx-auto shadow-2xs">
                        <div className="w-14 h-14 bg-[#FAF9F6] border border-[#D8D2C6] rounded-full flex items-center justify-center mx-auto mb-3 text-[#5A626A]">
                            <CameraIcon className="w-6 h-6 text-[#8C949D]" />
                        </div>
                        <h3 className="font-serif font-bold text-lg text-[#1A2228]">
                            Tidak Ada Album yang Sesuai
                        </h3>
                        <p className="text-xs text-[#5A626A] mt-1.5 leading-relaxed">
                            Tidak ditemukan dokumentasi kegiatan dengan kata kunci &ldquo;{searchQuery || selectedCategory}&rdquo;. Coba gunakan kata kunci lain atau bersihkan filter pencarian.
                        </p>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-prussian text-white text-xs font-semibold rounded-xs hover:bg-prussian-hover transition shadow-2xs"
                        >
                            Tampilkan Semua Album
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleries.map((album) => {
                            const photoCount = Array.isArray(album.images) ? album.images.length : (album.cover_image ? 1 : 0);
                            return (
                                <article
                                    key={album.id}
                                    onClick={() => openLightbox(album)}
                                    className="bg-white border border-[#E2DFD7] rounded-xs overflow-hidden shadow-2xs hover:border-prussian/40 hover:shadow-xs transition flex flex-col justify-between group cursor-pointer"
                                >
                                    <div>
                                        {/* Cover Thumbnail */}
                                        <div className="aspect-[16/10] bg-[#FAF9F6] relative overflow-hidden flex items-center justify-center border-b border-[#E2DFD7]">
                                            {album.cover_image ? (
                                                <img
                                                    src={album.cover_image}
                                                    alt={album.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-[#8C949D]">
                                                    <PhotoIcon className="w-10 h-10 text-prussian/60 mb-1" />
                                                    <span className="text-[11px] font-serif font-medium text-[#5A626A]">
                                                        Dokumentasi Kegiatan
                                                    </span>
                                                </div>
                                            )}

                                            {/* Category Pill Overlay */}
                                            <div className="absolute top-2.5 left-2.5">
                                                <span className="px-2 py-0.5 rounded-2xs text-[10px] font-bold uppercase tracking-wider shadow-2xs bg-prussian text-white">
                                                    {album.category}
                                                </span>
                                            </div>

                                            {/* Photo Count Badge */}
                                            <div className="absolute bottom-2.5 right-2.5">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-2xs text-[10px] font-mono font-medium bg-black/75 text-white backdrop-blur-xs shadow-2xs">
                                                    <PhotoIcon className="w-3 h-3" />
                                                    <span>{photoCount} Foto</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-5">
                                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5A626A] mb-2.5">
                                                <span className="font-semibold text-prussian bg-prussian/8 px-2 py-0.5 rounded-xs">
                                                    {album.category}
                                                </span>
                                                <span className="font-mono flex items-center gap-1">
                                                    <CalendarDaysIcon className="w-3.5 h-3.5 text-[#5A626A]" />
                                                    {album.event_date ? formatDate(album.event_date) : 'Dokumentasi Sekolah'}
                                                </span>
                                            </div>

                                            <h3 className="font-serif font-bold text-base text-[#1A2228] group-hover:text-prussian transition-colors leading-snug line-clamp-2">
                                                {album.title}
                                            </h3>

                                            <p className="text-xs text-[#5A626A] mt-2 leading-relaxed line-clamp-3">
                                                {album.description || 'Klik untuk membuka album foto dan melihat seluruh dokumentasi kegiatan.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer Link */}
                                    <div className="px-5 py-3.5 bg-[#FAF9F6] border-t border-[#E2DFD7] flex items-center justify-between text-xs">
                                        <span className="text-[11px] text-[#5A626A] font-mono">
                                            {photoCount} Foto Dokumentasi
                                        </span>

                                        <div className="font-bold text-prussian group-hover:text-[#C85A32] transition-colors inline-flex items-center gap-1 group/link">
                                            <span>Buka Album</span>
                                            <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Lightbox Modal (Archival Styling) */}
                {activeAlbum && albumPhotos.length > 0 && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={closeLightbox}
                    >
                        {/* Header bar in modal */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 border-b border-white/10 pb-3">
                            <div className="min-w-0 pr-4">
                                <span className="inline-block px-2 py-0.5 rounded-2xs text-[10px] font-bold uppercase tracking-wider bg-prussian text-white mb-1 shadow-2xs">
                                    {activeAlbum.category}
                                </span>
                                <h3 className="font-serif text-base sm:text-xl font-bold truncate">
                                    {activeAlbum.title}
                                </h3>
                                <p className="text-[11px] text-stone-300 font-mono mt-0.5">
                                    Foto {currentPhotoIndex + 1} dari {albumPhotos.length}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="rounded-xs bg-white/10 hover:bg-white/20 p-2 text-white transition flex items-center gap-1 text-xs font-semibold shrink-0"
                                title="Tutup Galeri (ESC)"
                            >
                                <XMarkIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">Tutup</span>
                            </button>
                        </div>

                        {/* Navigation Previous */}
                        {albumPhotos.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevPhoto();
                                }}
                                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 rounded-xs bg-black/60 hover:bg-black/90 border border-white/20 p-2.5 text-white transition z-20 shadow-lg"
                                title="Foto Sebelumnya (Panah Kiri)"
                            >
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                        )}

                        {/* Main Photo Center */}
                        <div
                            className="relative max-w-5xl max-h-[75vh] flex flex-col items-center justify-center p-2 z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={albumPhotos[currentPhotoIndex].url}
                                alt={albumPhotos[currentPhotoIndex].caption || activeAlbum.title}
                                className="max-h-[62vh] w-auto max-w-full rounded-xs object-contain shadow-2xl border border-white/10"
                            />

                            {/* Caption text */}
                            {albumPhotos[currentPhotoIndex].caption && (
                                <p className="mt-3 text-center text-xs text-stone-200 max-w-2xl bg-black/70 px-4 py-2 rounded-xs border border-white/10 backdrop-blur-xs leading-relaxed">
                                    {albumPhotos[currentPhotoIndex].caption}
                                </p>
                            )}
                        </div>

                        {/* Navigation Next */}
                        {albumPhotos.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextPhoto();
                                }}
                                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 rounded-xs bg-black/60 hover:bg-black/90 border border-white/20 p-2.5 text-white transition z-20 shadow-lg"
                                title="Foto Selanjutnya (Panah Kanan)"
                            >
                                <ChevronRightIcon className="w-6 h-6" />
                            </button>
                        )}

                        {/* Thumbnail Strip at Bottom */}
                        {albumPhotos.length > 1 && (
                            <div
                                className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 overflow-x-auto py-2 z-20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {albumPhotos.map((thumb, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentPhotoIndex(idx)}
                                        className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-xs overflow-hidden border-2 transition shrink-0 ${
                                            idx === currentPhotoIndex
                                                ? 'border-[#C85A32] scale-105 shadow-md'
                                                : 'border-white/20 opacity-50 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={thumb.url} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
