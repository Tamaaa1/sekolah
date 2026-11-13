import { Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    LockClosedIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

type AuthLayoutProps = {
    title?: string;
    description?: string;
    children: React.ReactNode;
};

export default function AuthLayout({
    title = 'Masuk ke Portal Sekolah',
    description = 'Masukkan email dan kata sandi resmi untuk mengakses dashboard SMP Negeri 5 Sambas',
    children,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F6F5F0] dark:bg-[#121417] text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-prussian-light selection:text-prussian relative">
            {/* Ambient Background Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-gradient-to-b from-prussian/5 to-transparent blur-3xl pointer-events-none" />

            {/* Top Bar Navigation */}
            <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-prussian dark:hover:text-white px-3.5 py-2 rounded-lg border border-stone-300/80 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs shadow-2xs hover:shadow-xs transition-all"
                >
                    <ArrowLeftIcon className="w-3.5 h-3.5" />
                    <span>Kembali ke Beranda</span>
                </Link>

                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 font-medium bg-white/60 dark:bg-stone-900/60 px-3 py-1.5 rounded-lg border border-stone-300/60 dark:border-stone-800">
                    <span>NPSN: 20109876</span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span>Akreditasi A</span>
                </div>
            </header>

            {/* Main Auth Card Area */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-xl overflow-hidden">
                        {/* Top Accent Gradient Stripe */}
                        <div className="h-1.5 bg-gradient-to-r from-prussian via-[#1B3B6F] to-terracotta w-full" />

                        {/* Card Content Header */}
                        <div className="p-6 sm:p-8 sm:pb-6 text-center border-b border-stone-100 dark:border-stone-800">
                            <Link href="/" className="inline-block group mb-3">
                                <img
                                    src="/images/logo.png"
                                    alt="SMP Negeri 5 Sambas"
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto drop-shadow-sm group-hover:scale-105 transition-transform"
                                />
                            </Link>

                            <div className="mb-2">
                                <span className="inline-block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-prussian dark:text-sky-300 bg-prussian/5 dark:bg-sky-950/40 px-3 py-0.5 rounded-full border border-prussian/15 dark:border-sky-800/40">
                                    Sistem Informasi Akademik
                                </span>
                            </div>

                            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                                {title}
                            </h1>

                            {description && (
                                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* Form Body */}
                        <div className="p-6 sm:p-8">
                            {children}
                        </div>

                        {/* Card Security Footer */}
                        <div className="px-6 py-3.5 bg-stone-50 dark:bg-stone-900/60 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                            <LockClosedIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Koneksi Aman & Terenkripsi SSL</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Institutional Copyright */}
            <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 text-center text-xs text-stone-500 dark:text-stone-400">
                © {new Date().getFullYear()} SMP Negeri 5 Sambas. Hak Cipta Dilindungi Undang-Undang.
            </footer>
        </div>
    );
}
