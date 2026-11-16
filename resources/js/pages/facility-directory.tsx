import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SeoHead from '@/components/seo-head';
import {
    ArrowRightIcon,
    BuildingOffice2Icon,
    CheckBadgeIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PhotoIcon,
    TagIcon,
    UserGroupIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

interface Facility {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string | null;
    image: string | null;
    capacity: string | null;
    location: string | null;
    features: string[] | null;
}

interface FacilityDirectoryProps {
    settings: Record<string, any>;
    primaryMenu: any;
    facilities: Facility[];
    categories: string[];
    filters: {
        category?: string;
        q?: string;
    };
}

export default function FacilityDirectory({
    settings,
    primaryMenu,
    facilities = [],
    categories = [],
    filters,
}: FacilityDirectoryProps) {
    const schoolName = settings?.school_name || 'SMP Negeri 5 Sambas';
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [activeModalItem, setActiveModalItem] = useState<Facility | null>(null);

    const handleFilterChange = (cat: string, q = searchQuery) => {
        setSelectedCategory(cat);
        router.get(
            '/fasilitas',
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

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSearchQuery('');
        router.get('/fasilitas');
    };

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveModalItem(null);
            }
        };
        if (activeModalItem) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeModalItem]);

    const hasActiveFilters = Boolean(filters.q || filters.category || searchQuery.trim() || selectedCategory);

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <SeoHead
                title={`Sarana & Fasilitas Pembelajaran - ${schoolName}`}
                description={`Jelajahi sarana prasarana dan fasilitas pendukung pembelajaran di ${schoolName}: Laboratorium Komputer, Laboratorium IPA, Perpustakaan Graha Pustaka, Sarana Olahraga, dan Musholla.`}
                keywords={`fasilitas ${schoolName}, sarana prasarana smpn 5 sambas, lab komputer sambas, perpustakaan smpn 5 sambas`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Page Header (Consistent with News Directory & Gallery Directory) */}
                <div className="border-b border-line pb-6 mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                        Infrastruktur & Lingkungan Belajar
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                        Sarana & Fasilitas Sekolah
                    </h1>
                    <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                        Kami menyediakan sarana dan prasarana modern berstandar pendidikan nasional guna menciptakan ekosistem belajar yang nyaman, aman, interaktif, dan kondusif bagi seluruh peserta didik.
                    </p>

                    {/* Search & Filter Bar (Matching News Directory & Gallery Directory) */}
                    <div className="mt-6 pt-6 border-t border-line flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari sarana atau fasilitas..."
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
                                className="px-4 py-2 bg-prussian text-white text-xs font-semibold rounded-xs hover:bg-prussian-hover transition-colors shrink-0 shadow-2xs cursor-pointer"
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
                                <BuildingOffice2Icon className="w-4 h-4 text-prussian" />
                                <span>Total: <strong className="text-[#1A2228]">{facilities.length}</strong> Fasilitas</span>
                            </div>

                            {/* Reset Filter Button */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="text-xs text-[#C85A32] hover:underline font-medium inline-flex items-center gap-1 px-2 py-1.5 cursor-pointer"
                                >
                                    <XMarkIcon className="w-3.5 h-3.5" />
                                    <span>Reset Filter</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section Header Title */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E2DFD7]">
                    <h2 className="font-serif text-xl font-bold text-[#1A2228] flex items-center gap-2">
                        <span>Daftar Sarana & Fasilitas Sekolah</span>
                        <span className="text-xs font-sans font-normal text-[#5A626A]">
                            ({facilities.length} fasilitas)
                        </span>
                    </h2>

                    {hasActiveFilters && (
                        <span className="text-xs text-[#5A626A]">
                            Menampilkan hasil filter / pencarian
                        </span>
                    )}
                </div>

                {/* Facilities List Grid */}
                {facilities.length === 0 ? (
                    <div className="bg-white border border-[#E2DFD7] rounded-xs p-12 text-center max-w-xl mx-auto shadow-2xs">
                        <div className="w-14 h-14 bg-[#FAF9F6] border border-[#D8D2C6] rounded-full flex items-center justify-center mx-auto mb-3 text-[#5A626A]">
                            <BuildingOffice2Icon className="w-6 h-6 text-[#8C949D]" />
                        </div>
                        <h3 className="font-serif font-bold text-lg text-[#1A2228]">
                            Tidak Ada Fasilitas Ditemukan
                        </h3>
                        <p className="text-xs text-[#5A626A] mt-1.5 leading-relaxed">
                            Tidak ditemukan sarana prasarana dengan kata kunci &ldquo;{searchQuery || selectedCategory}&rdquo;. Coba gunakan kata kunci lain atau bersihkan filter pencarian.
                        </p>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-prussian text-white text-xs font-semibold rounded-xs hover:bg-prussian-hover transition shadow-2xs cursor-pointer"
                        >
                            Tampilkan Semua Fasilitas
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((fac) => (
                            <article
                                key={fac.id}
                                onClick={() => setActiveModalItem(fac)}
                                className="group cursor-pointer rounded-xs border border-[#E2DFD7] bg-white hover:border-[#C85A32] hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden shadow-2xs"
                            >
                                {/* Image Cover */}
                                <div className="relative aspect-16/10 w-full bg-[#FAF9F6] overflow-hidden">
                                    {fac.image ? (
                                        <img
                                            src={fac.image}
                                            alt={fac.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#8C949D] bg-[#FAF9F6]">
                                            <PhotoIcon className="w-12 h-12 opacity-40" />
                                        </div>
                                    )}

                                    {/* Category Pill Tag */}
                                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-2xs text-[11px] font-semibold bg-white/95 text-prussian backdrop-blur-xs border border-[#D8D2C6] shadow-2xs">
                                        {fac.category}
                                    </span>
                                </div>

                                {/* Content Details */}
                                <div className="p-5 flex flex-1 flex-col justify-between">
                                    <div>
                                        {/* Key Info Metadata (Lokasi & Kapasitas) */}
                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5A626A] font-mono mb-2">
                                            {fac.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPinIcon className="w-3.5 h-3.5 text-prussian" />
                                                    <span>{fac.location}</span>
                                                </span>
                                            )}
                                            {fac.capacity && (
                                                <span className="flex items-center gap-1">
                                                    <UserGroupIcon className="w-3.5 h-3.5 text-prussian" />
                                                    <span>{fac.capacity}</span>
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-serif text-lg font-bold text-[#1A2228] group-hover:text-prussian transition-colors leading-snug line-clamp-2">
                                            {fac.name}
                                        </h3>

                                        <p className="text-xs text-[#5A626A] mt-2 line-clamp-3 leading-relaxed">
                                            {fac.description || 'Fasilitas penunjang kegiatan pembelajaran dan pengembangan potensi siswa.'}
                                        </p>

                                        {/* Feature Tags Preview */}
                                        {Array.isArray(fac.features) && fac.features.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {fac.features.slice(0, 3).map((feat, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-xs bg-[#FAF9F6] border border-[#E2DFD7] text-[#1A2228] font-medium"
                                                    >
                                                        <CheckBadgeIcon className="w-3 h-3 text-emerald-600" />
                                                        {feat}
                                                    </span>
                                                ))}
                                                {fac.features.length > 3 && (
                                                    <span className="text-[11px] text-[#5A626A] self-center">
                                                        +{fac.features.length - 3} lainnya
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action link */}
                                    <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex items-center justify-between text-xs font-semibold text-prussian group-hover:text-[#C85A32] transition-colors">
                                        <span>Lihat Detail Kelengkapan</span>
                                        <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Facility Detail Modal: Image on LEFT, Information Text on RIGHT */}
                {activeModalItem && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
                        onClick={() => setActiveModalItem(null)}
                    >
                        <div
                            className="relative w-full max-w-4xl lg:max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D8D2C6] max-h-[92vh] flex flex-col md:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button Top-Right (Desktop & Mobile accessible) */}
                            <button
                                type="button"
                                onClick={() => setActiveModalItem(null)}
                                className="absolute top-3 right-3 z-20 rounded-full bg-white/90 hover:bg-white p-1.5 text-[#1A2228] hover:text-black transition shadow-sm border border-[#D8D2C6] cursor-pointer"
                                title="Tutup Modal (Esc)"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>

                            {/* LEFT COLUMN: Image & Visual Representation */}
                            <div className="md:w-1/2 lg:w-5/12 bg-neutral-900 relative flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[280px] md:min-h-full shrink-0">
                                {activeModalItem.image ? (
                                    <img
                                        src={activeModalItem.image}
                                        alt={activeModalItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center text-white/50 bg-[#163038] p-6 text-center">
                                        <BuildingOffice2Icon className="w-16 h-16 opacity-60 mb-2" />
                                        <span className="text-xs font-mono text-white/70">Dokumentasi Fasilitas Sekolah</span>
                                    </div>
                                )}

                                {/* Category Tag Overlay on Image */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 rounded-xs text-[11px] font-semibold bg-white/95 text-prussian backdrop-blur-xs shadow-sm border border-[#D8D2C6]">
                                        {activeModalItem.category}
                                    </span>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Information Details */}
                            <div className="md:w-1/2 lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[88vh]">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                                            Sarana & Prasarana Sekolah
                                        </span>
                                    </div>

                                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A2228] leading-snug">
                                        {activeModalItem.name}
                                    </h2>

                                    {/* Location & Capacity Badges */}
                                    <div className="mt-3 py-3 border-y border-[#E2DFD7] flex flex-wrap gap-4 text-xs font-mono text-[#5A626A]">
                                        {activeModalItem.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPinIcon className="w-4 h-4 text-prussian shrink-0" />
                                                <span>Lokasi: <strong className="text-[#1A2228] font-sans font-medium">{activeModalItem.location}</strong></span>
                                            </div>
                                        )}
                                        {activeModalItem.capacity && (
                                            <div className="flex items-center gap-1.5">
                                                <UserGroupIcon className="w-4 h-4 text-prussian shrink-0" />
                                                <span>Kapasitas: <strong className="text-[#1A2228] font-sans font-medium">{activeModalItem.capacity}</strong></span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="mt-4">
                                        <h4 className="text-xs font-mono uppercase tracking-wider text-[#5A626A] font-semibold">
                                            Deskripsi & Peruntukan
                                        </h4>
                                        <p className="mt-2 text-xs sm:text-sm text-[#1A2228] leading-relaxed whitespace-pre-line">
                                            {activeModalItem.description || 'Fasilitas penunjang kegiatan pembelajaran dan pengembangan potensi siswa SMP Negeri 5 Sambas.'}
                                        </p>
                                    </div>

                                    {/* Feature Badges List */}
                                    {Array.isArray(activeModalItem.features) && activeModalItem.features.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-[#E2DFD7]">
                                            <h4 className="text-xs font-mono uppercase tracking-wider text-[#5A626A] font-semibold mb-2.5">
                                                Fitur & Fasilitas Unggulan
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {activeModalItem.features.map((feat, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2 text-xs text-[#1A2228] bg-[#FAF9F6] px-3 py-2 rounded-xs border border-[#E2DFD7]"
                                                    >
                                                        <CheckBadgeIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                                                        <span className="font-medium">{feat}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer Controls */}
                                <div className="mt-6 pt-4 border-t border-[#E2DFD7] flex items-center justify-between gap-3">
                                    <span className="text-[11px] font-mono text-[#5A626A] truncate">
                                        SMP Negeri 5 Sambas
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setActiveModalItem(null)}
                                        className="px-4 py-2 text-xs font-semibold rounded-xs bg-prussian text-white hover:bg-prussian-hover transition shadow-2xs cursor-pointer"
                                    >
                                        Tutup Informasi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
