import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    ExclamationTriangleIcon,
    ShieldExclamationIcon,
    ServerStackIcon,
    WrenchScrewdriverIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    NewspaperIcon,
} from '@heroicons/react/24/outline';

interface ErrorPageProps {
    status: number;
    message?: string;
    settings?: Record<string, any>;
}

export default function ErrorPage({ status, message, settings }: ErrorPageProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/berita', { q: searchQuery.trim() });
        }
    };

    const getErrorDetails = () => {
        switch (status) {
            case 404:
                return {
                    badge: 'Kesalahan 404',
                    title: 'Halaman Tidak Ditemukan',
                    description:
                        'Alamat halaman yang Anda tuju tidak ditemukan, sudah dihapus, atau tautan yang Anda masukkan mungkin keliru.',
                    icon: ExclamationTriangleIcon,
                    accentColor: 'text-amber-500 dark:text-amber-400',
                    bgBadge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
                };
            case 403:
                return {
                    badge: 'Kesalahan 403',
                    title: 'Akses Ditolak',
                    description:
                        'Anda tidak memiliki izin untuk mengakses direktori atau halaman ini. Silakan hubungi pengelola sistem bila ini merupakan kekeliruan.',
                    icon: ShieldExclamationIcon,
                    accentColor: 'text-rose-500 dark:text-rose-400',
                    bgBadge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
                };
            case 503:
                return {
                    badge: 'Kesalahan 503',
                    title: 'Layanan Sedang Pemeliharaan',
                    description:
                        'Sistem portal sekolah sedang dalam proses pemeliharaan terjadwal. Kami akan segera kembali beroperasi normal dalam waktu dekat.',
                    icon: WrenchScrewdriverIcon,
                    accentColor: 'text-blue-500 dark:text-blue-400',
                    bgBadge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
                };
            case 500:
            default:
                return {
                    badge: `Kesalahan ${status || 500}`,
                    title: 'Terjadi Kesalahan Server',
                    description:
                        'Terjadi gangguan internal pada server saat memproses permintaan Anda. Tim teknis kami telah mencatat peristiwa ini untuk penanganan segera.',
                    icon: ServerStackIcon,
                    accentColor: 'text-red-500 dark:text-red-400',
                    bgBadge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60',
                };
        }
    };

    const info = getErrorDetails();
    const IconComponent = info.icon;

    return (
        <PublicLayout settings={settings}>
            <Head title={`${status} - ${info.title} | SMP Negeri 5 Sambas`} />

            <div className="relative min-h-[65vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl text-center">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border mb-6 ${info.bgBadge}">
                        <IconComponent className={`w-4 h-4 ${info.accentColor}`} />
                        <span>{info.badge}</span>
                    </div>

                    {/* Numeric Code Background Decor */}
                    <h1 className="text-7xl sm:text-9xl font-black tracking-tight text-neutral-200 dark:text-neutral-800 select-none">
                        {status}
                    </h1>

                    {/* Title & Description */}
                    <div className="-mt-8 sm:-mt-12 relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {info.title}
                        </h2>
                        <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
                            {message || info.description}
                        </p>
                    </div>

                    {/* Search Bar for 404 / Missing Content */}
                    {status === 404 && (
                        <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto">
                            <label htmlFor="error-search" className="sr-only">
                                Cari artikel atau berita sekolah
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    id="error-search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari artikel, agenda, atau pengumuman..."
                                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-3 pl-11 pr-24 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition"
                                />
                                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 h-5 w-5 text-neutral-400" />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition shadow-sm"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            <span>Kembali Sebelumnya</span>
                        </button>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                        >
                            <HomeIcon className="w-4 h-4" />
                            <span>Ke Beranda Utama</span>
                        </Link>

                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition shadow-sm"
                        >
                            <NewspaperIcon className="w-4 h-4" />
                            <span>Arsip Berita</span>
                        </Link>
                    </div>

                    {/* Assistance Hint */}
                    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                        Butuh bantuan lebih lanjut? Silakan hubungi bagian Tata Usaha sekolah melalui nomor atau email pada bagian informasi kontak di bawah.
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
