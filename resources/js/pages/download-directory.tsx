import { useState } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import SeoHead from '@/components/seo-head';
import {
    ArrowDownTrayIcon,
    DocumentArrowDownIcon,
    DocumentTextIcon,
    FolderArrowDownIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

interface Download {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string | null;
    file_path: string;
    file_type: string;
    file_size: string | null;
    download_count: number;
    created_at?: string;
}

interface DownloadDirectoryProps {
    settings: Record<string, any>;
    primaryMenu: any;
    downloads: Download[];
    categories: string[];
    filters: {
        category?: string;
        q?: string;
    };
}

export default function DownloadDirectory({
    settings,
    primaryMenu,
    downloads = [],
    categories = [],
    filters,
}: DownloadDirectoryProps) {
    const schoolName = settings?.school_name || 'SMP Negeri 5 Sambas';
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [searchQuery, setSearchQuery] = useState(filters.q || '');

    const handleFilterChange = (cat: string, q = searchQuery) => {
        setSelectedCategory(cat);
        router.get(
            '/unduhan',
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

    const getFileBadgeColor = (type: string) => {
        const t = (type || '').toUpperCase();
        if (t === 'PDF') {
            return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300';
        }
        if (['DOC', 'DOCX'].includes(t)) {
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
        }
        if (['XLS', 'XLSX'].includes(t)) {
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
        }
        if (['ZIP', 'RAR'].includes(t)) {
            return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
        }
        return 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300';
    };

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <SeoHead
                title={`Pusat Unduhan Dokumen Resmi - ${schoolName}`}
                description={`Unduh berkas resmi, formulir izin, kalender akademik, brosur PPDB, serta tata tertib siswa di ${schoolName}.`}
                keywords={`unduhan ${schoolName}, formulir smpn 5 sambas, kalender akademik sambas, tata tertib siswa smpn 5 sambas`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                {/* Header Banner */}
                <div className="border-b border-line pb-8 mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                        Layanan Administrasi & Informasi Publik
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink mt-2">
                        Pusat Unduhan Dokumen
                    </h1>
                    <p className="text-ink-secondary text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
                        Akses dan unduh formulir layanan sekolah, kalender pendidikan, peraturan tata tertib peserta didik, serta dokumen resmi lainnya secara cepat dan terpercaya.
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
                                Semua Dokumen ({downloads.length})
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
                                placeholder="Cari judul dokumen..."
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

                {/* Downloads List */}
                {downloads.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-xl border border-line p-8">
                        <FolderArrowDownIcon className="w-14 h-14 text-neutral-300 mx-auto mb-3" />
                        <h3 className="font-serif text-xl font-bold text-ink">Tidak ada dokumen ditemukan</h3>
                        <p className="text-ink-secondary text-sm max-w-md mx-auto mt-1">
                            Tidak ada berkas unduhan yang sesuai dengan kategori atau kata kunci yang Anda masukkan.
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
                            Tampilkan Semua Dokumen
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {downloads.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl border border-line p-6 hover:border-line-strong hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${getFileBadgeColor(
                                                    item.file_type
                                                )}`}
                                            >
                                                {item.file_type}
                                            </span>
                                            <span className="text-xs text-ink-secondary font-medium">
                                                {item.category}
                                            </span>
                                        </div>

                                        {item.file_size && (
                                            <span className="text-xs font-mono text-ink-secondary">
                                                {item.file_size}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-serif text-lg sm:text-xl font-bold text-ink mt-3 group-hover:text-prussian transition leading-snug">
                                        {item.title}
                                    </h3>

                                    <p className="text-ink-secondary text-sm mt-2 line-clamp-2 leading-relaxed">
                                        {item.description || 'Dokumen resmi yang diterbitkan untuk keperluan administrasi dan informasi umum.'}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-secondary">
                                        <DocumentArrowDownIcon className="w-4 h-4 text-neutral-400" />
                                        <span>Diunduh {item.download_count.toLocaleString('id-ID')} kali</span>
                                    </span>

                                    <a
                                        href={`/unduhan/${item.slug}/file`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-prussian hover:bg-prussian-dark text-white text-xs font-semibold shadow-xs transition"
                                    >
                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                        <span>Unduh Berkas</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
