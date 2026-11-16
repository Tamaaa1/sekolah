import { useState } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SeoHead from '@/components/seo-head';
import {
    BuildingOffice2Icon,
    CheckBadgeIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PhotoIcon,
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

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <SeoHead
                title={`Sarana & Fasilitas Pembelajaran - ${schoolName}`}
                description={`Jelajahi sarana prasarana dan fasilitas pendukung pembelajaran di ${schoolName}: Laboratorium Komputer, Laboratorium IPA, Perpustakaan Graha Pustaka, Sarana Olahraga, dan Musholla.`}
                keywords={`fasilitas ${schoolName}, sarana prasarana smpn 5 sambas, lab komputer sambas, perpustakaan smpn 5 sambas`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                {/* Header Banner */}
                <div className="border-b border-line pb-8 mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                        Infrastruktur & Lingkungan Belajar
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink mt-2">
                        Sarana & Fasilitas Sekolah
                    </h1>
                    <p className="text-ink-secondary text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
                        Kami menyediakan sarana dan prasarana modern berstandar pendidikan nasional guna menciptakan ekosistem belajar yang nyaman, aman, interaktif, dan kondusif bagi seluruh peserta didik.
                    </p>

                    {/* Search & Category Filter Bar */}
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
                                Semua Fasilitas ({facilities.length})
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
                                placeholder="Cari nama fasilitas..."
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

                {/* Facilities List Grid */}
                {facilities.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-xl border border-line p-8">
                        <BuildingOffice2Icon className="w-14 h-14 text-neutral-300 mx-auto mb-3" />
                        <h3 className="font-serif text-xl font-bold text-ink">Tidak ada fasilitas ditemukan</h3>
                        <p className="text-ink-secondary text-sm max-w-md mx-auto mt-1">
                            Tidak ada sarana prasarana yang sesuai dengan kata kunci pencarian atau kategori yang dipilih.
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
                            Tampilkan Semua Fasilitas
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilities.map((fac) => (
                            <div
                                key={fac.id}
                                onClick={() => setActiveModalItem(fac)}
                                className="group cursor-pointer rounded-2xl bg-white border border-line hover:border-line-strong hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Image Cover */}
                                <div className="relative aspect-16/10 w-full bg-neutral-100 overflow-hidden">
                                    {fac.image ? (
                                        <img
                                            src={fac.image}
                                            alt={fac.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50">
                                            <PhotoIcon className="w-14 h-14 opacity-50" />
                                        </div>
                                    )}

                                    {/* Category Pill Tag */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-prussian backdrop-blur-sm shadow-xs border border-line">
                                            {fac.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-6 flex flex-1 flex-col justify-between">
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-ink group-hover:text-prussian transition leading-snug">
                                            {fac.name}
                                        </h3>

                                        <p className="text-ink-secondary text-sm mt-2 line-clamp-3 leading-relaxed">
                                            {fac.description || 'Fasilitas penunjang kegiatan pembelajaran dan pengembangan potensi siswa.'}
                                        </p>

                                        {/* Key Info Metadata */}
                                        <div className="mt-4 pt-4 border-t border-line/60 flex flex-wrap gap-3 text-xs text-ink-secondary">
                                            {fac.location && (
                                                <div className="inline-flex items-center gap-1.5 font-medium">
                                                    <MapPinIcon className="w-4 h-4 text-prussian" />
                                                    <span>{fac.location}</span>
                                                </div>
                                            )}
                                            {fac.capacity && (
                                                <div className="inline-flex items-center gap-1.5 font-medium">
                                                    <UserGroupIcon className="w-4 h-4 text-prussian" />
                                                    <span>{fac.capacity}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Feature Tags Preview */}
                                        {Array.isArray(fac.features) && fac.features.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {fac.features.slice(0, 3).map((feat, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium"
                                                    >
                                                        <CheckBadgeIcon className="w-3.5 h-3.5 text-prussian" />
                                                        {feat}
                                                    </span>
                                                ))}
                                                {fac.features.length > 3 && (
                                                    <span className="text-[11px] px-2 py-0.5 text-ink-secondary">
                                                        +{fac.features.length - 3} lainnya
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action link */}
                                    <div className="mt-6 pt-3 border-t border-line flex items-center justify-between text-xs font-semibold text-prussian group-hover:text-prussian-dark">
                                        <span>Lihat Detail Kelengkapan</span>
                                        <span className="group-hover:translate-x-1 transition duration-200">→</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Facility Detail Modal */}
                {activeModalItem && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
                        onClick={() => setActiveModalItem(null)}
                    >
                        <div
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-line max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setActiveModalItem(null)}
                                className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-ink hover:bg-white transition shadow-sm"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>

                            {/* Modal Header Photo */}
                            {activeModalItem.image && (
                                <div className="relative aspect-video w-full bg-neutral-100 shrink-0">
                                    <img
                                        src={activeModalItem.image}
                                        alt={activeModalItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-3 left-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-prussian shadow-sm">
                                            {activeModalItem.category}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto">
                                {!activeModalItem.image && (
                                    <span className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-semibold bg-prussian-light text-prussian">
                                        {activeModalItem.category}
                                    </span>
                                )}

                                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                                    {activeModalItem.name}
                                </h2>

                                <div className="mt-3 flex flex-wrap gap-4 text-xs sm:text-sm text-ink-secondary pb-4 border-b border-line">
                                    {activeModalItem.location && (
                                        <div className="inline-flex items-center gap-1.5 font-medium">
                                            <MapPinIcon className="w-4 h-4 text-prussian" />
                                            <span>Lokasi: {activeModalItem.location}</span>
                                        </div>
                                    )}
                                    {activeModalItem.capacity && (
                                        <div className="inline-flex items-center gap-1.5 font-medium">
                                            <UserGroupIcon className="w-4 h-4 text-prussian" />
                                            <span>Daya Tampung: {activeModalItem.capacity}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-xs font-mono uppercase tracking-wider text-ink-secondary font-semibold">
                                        Deskripsi Sarana
                                    </h4>
                                    <p className="mt-2 text-sm text-ink leading-relaxed whitespace-pre-line">
                                        {activeModalItem.description || 'Tidak ada deskripsi detail tambahan.'}
                                    </p>
                                </div>

                                {Array.isArray(activeModalItem.features) && activeModalItem.features.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-line">
                                        <h4 className="text-xs font-mono uppercase tracking-wider text-ink-secondary font-semibold mb-3">
                                            Fitur & Perlengkapan Unggulan
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {activeModalItem.features.map((feat, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 text-xs sm:text-sm text-ink bg-neutral-50 px-3 py-2 rounded-lg border border-line"
                                                >
                                                    <CheckBadgeIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-neutral-50 border-t border-line flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setActiveModalItem(null)}
                                    className="px-5 py-2 text-sm font-semibold rounded-lg bg-prussian text-white hover:bg-prussian-dark transition"
                                >
                                    Tutup Informasi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
