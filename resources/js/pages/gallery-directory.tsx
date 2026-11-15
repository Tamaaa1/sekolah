import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SeoHead from '@/components/seo-head';
import {
    CalendarDaysIcon,
    CameraIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    XMarkIcon,
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

    const handleFilterChange = (cat: string, q = searchQuery) => {
        setSelectedCategory(cat);
        router.get(
            '/galeri',
            {
                category: cat || undefined,
                q: q || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange(selectedCategory, searchQuery);
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

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <SeoHead
                title={`Galeri & Dokumentasi Kegiatan - ${schoolName}`}
                description={`Koleksi foto kegiatan, upacara, ekstrakurikuler, dan pentas seni budaya di ${schoolName}.`}
                keywords={`galeri ${schoolName}, foto smpn 5 sambas, kegiatan sekolah sambas, dokumentasi smpn 5 sambas`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                {/* Header Banner */}
                <div className="border-b border-line pb-8 mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                        Dokumentasi & Memori Sekolah
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink mt-2">
                        Galeri Kegiatan Siswa
                    </h1>
                    <p className="text-ink-secondary text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
                        Rekam jejak visual aktivitas akademik, ekstrakurikuler, seremoni kenegaraan, serta kebersamaan keluarga besar civitas akademika kami.
                    </p>

                    {/* Filter & Search Bar */}
                    <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <button
                                type="button"
                                onClick={() => handleFilterChange('')}
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                                    selectedCategory === ''
                                        ? 'bg-prussian text-white shadow-xs'
                                        : 'bg-white text-ink-secondary border border-line hover:border-line-strong'
                                }`}
                            >
                                Semua Album ({galleries.length})
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleFilterChange(cat)}
                                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                                        selectedCategory === cat
                                            ? 'bg-prussian text-white shadow-xs'
                                            : 'bg-white text-ink-secondary border border-line hover:border-line-strong'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Cari nama album kegiatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full text-sm rounded-full border border-line bg-white py-2 pl-9 pr-8 text-ink focus:border-prussian focus:outline-none shadow-xs"
                            />
                            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        handleFilterChange(selectedCategory, '');
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink"
                                >
                                    <XMarkIcon className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Galleries Grid */}
                {galleries.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-xl border border-line p-8">
                        <CameraIcon className="w-14 h-14 text-neutral-300 mx-auto mb-3" />
                        <h3 className="font-serif text-xl font-bold text-ink">Tidak ada album kegiatan ditemukan</h3>
                        <p className="text-ink-secondary text-sm max-w-md mx-auto mt-1">
                            Tidak ada dokumentasi kegiatan yang sesuai dengan kategori atau pencarian yang dipilih.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCategory('');
                                setSearchQuery('');
                                handleFilterChange('', '');
                            }}
                            className="mt-5 inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-prussian text-white shadow hover:bg-prussian-dark transition"
                        >
                            Tampilkan Semua Album
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleries.map((album) => {
                            const photoCount = Array.isArray(album.images) ? album.images.length : 0;
                            return (
                                <div
                                    key={album.id}
                                    onClick={() => openLightbox(album)}
                                    className="group cursor-pointer rounded-2xl bg-white border border-line hover:border-line-strong hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                                >
                                    {/* Cover Image */}
                                    <div className="relative aspect-16/10 w-full bg-neutral-100 overflow-hidden">
                                        {album.cover_image ? (
                                            <img
                                                src={album.cover_image}
                                                alt={album.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50">
                                                <PhotoIcon className="w-14 h-14 opacity-50" />
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-prussian backdrop-blur-sm shadow-xs border border-line">
                                                {album.category}
                                            </span>
                                        </div>

                                        {/* Photos Count Badge */}
                                        <div className="absolute bottom-3 right-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/75 text-white backdrop-blur-sm">
                                                <PhotoIcon className="w-3.5 h-3.5" />
                                                <span>{photoCount} Foto</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Details */}
                                    <div className="p-6 flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs text-ink-secondary mb-2 font-medium">
                                                <CalendarDaysIcon className="w-4 h-4 text-prussian" />
                                                <span>
                                                    {album.event_date
                                                        ? new Date(album.event_date).toLocaleDateString('id-ID', {
                                                              day: 'numeric',
                                                              month: 'long',
                                                              year: 'numeric',
                                                          })
                                                        : 'Dokumentasi Sekolah'}
                                                </span>
                                            </div>

                                            <h3 className="font-serif text-xl font-bold text-ink group-hover:text-prussian transition leading-snug">
                                                {album.title}
                                            </h3>

                                            <p className="text-ink-secondary text-sm mt-2 line-clamp-2 leading-relaxed">
                                                {album.description || 'Dokumentasi momen kegiatan civitas akademika sekolah.'}
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-3 border-t border-line flex items-center justify-between text-xs font-semibold text-prussian group-hover:text-prussian-dark">
                                            <span>Buka Album Foto</span>
                                            <span className="group-hover:translate-x-1 transition duration-200">→</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Lightbox Modal */}
                {activeAlbum && albumPhotos.length > 0 && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in"
                        onClick={closeLightbox}
                    >
                        {/* Header bar in modal */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
                            <div>
                                <h3 className="font-serif text-lg sm:text-xl font-bold line-clamp-1 drop-shadow-md">
                                    {activeAlbum.title}
                                </h3>
                                <p className="text-xs text-neutral-300">
                                    Foto {currentPhotoIndex + 1} dari {albumPhotos.length}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="rounded-full bg-white/20 hover:bg-white/30 p-2.5 text-white transition"
                                title="Tutup Galeri (ESC)"
                            >
                                <XMarkIcon className="w-6 h-6" />
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
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/40 p-3 text-white transition z-10"
                                title="Foto Sebelumnya (Panah Kiri)"
                            >
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                        )}

                        {/* Main Photo Center */}
                        <div
                            className="relative max-w-5xl max-h-[75vh] flex flex-col items-center justify-center p-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={albumPhotos[currentPhotoIndex].url}
                                alt={albumPhotos[currentPhotoIndex].caption || activeAlbum.title}
                                className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                            />

                            {/* Caption text */}
                            {albumPhotos[currentPhotoIndex].caption && (
                                <p className="mt-3 text-center text-sm text-neutral-200 max-w-2xl bg-black/50 px-4 py-2 rounded-lg backdrop-blur-xs">
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/40 p-3 text-white transition z-10"
                                title="Foto Selanjutnya (Panah Kanan)"
                            >
                                <ChevronRightIcon className="w-6 h-6" />
                            </button>
                        )}

                        {/* Thumbnail Strip at Bottom */}
                        {albumPhotos.length > 1 && (
                            <div
                                className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 overflow-x-auto py-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {albumPhotos.map((thumb, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentPhotoIndex(idx)}
                                        className={`relative h-14 w-20 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                                            idx === currentPhotoIndex
                                                ? 'border-white scale-105'
                                                : 'border-transparent opacity-50 hover:opacity-100'
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
