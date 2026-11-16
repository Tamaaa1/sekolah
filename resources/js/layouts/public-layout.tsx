import { useState, useEffect, type ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import ScrollToTop from '@/components/scroll-to-top';
import ThemeToggle from '@/components/theme-toggle';
import PublicPageSkeleton, { resolvePageTypeFromUrl, type PublicPageType } from '@/components/public-page-skeleton';
import {
    ArrowTopRightOnSquareIcon,
    Bars3Icon,
    CalendarDaysIcon,
    ChevronDownIcon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

type MenuItem = {
    id: number;
    label: string;
    url: string;
    children?: MenuItem[];
};

type Menu = {
    id: number;
    name: string;
    location: string;
    root_items?: MenuItem[];
};

type PublicLayoutProps = {
    children: ReactNode;
    settings?: Record<string, any>;
    primaryMenu?: Menu | null;
};

export default function PublicLayout({
    children,
    settings = {},
    primaryMenu,
}: PublicLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [targetPageType, setTargetPageType] = useState<PublicPageType>('generic');

    const schoolName = settings?.school_name || 'SMP Negeri 5 Sambas';
    const npsn = settings?.npsn || '30100301';
    const email = settings?.email || 'humas@smpn5sambas.sch.id';
    const phone = settings?.phone || '(021) 7890-1234';
    const whatsapp = settings?.whatsapp || '0812-3456-7890';
    const address = settings?.address || 'Jl. Raya Semberang, Kec. Sambas, Kab. Sambas, Prov. Kalimantan Barat';
    const accreditation = settings?.accreditation || 'A (Unggul)';
    const ppdbIsOpen = settings?.ppdb_is_open === true || settings?.ppdb_is_open === 1 || settings?.ppdb_is_open === '1';

    const page = usePage<{ flash?: { error?: string; success?: string } }>();
    const flash = page.props.flash;

    const currentPath = page.url.split('?')[0].replace(/\/+$/, '') || '/';

    const isItemActive = (targetUrl?: string) => {
        if (!targetUrl || targetUrl === '#' || targetUrl === '') return false;
        let cleanTarget = targetUrl.split('?')[0].replace(/\/+$/, '') || '/';
        if (cleanTarget.startsWith('http://') || cleanTarget.startsWith('https://')) {
            try {
                const parsed = new URL(cleanTarget);
                cleanTarget = parsed.pathname.replace(/\/+$/, '') || '/';
            } catch {
                return false;
            }
        }
        if (cleanTarget === '/') {
            return currentPath === '/';
        }
        return currentPath === cleanTarget || currentPath.startsWith(cleanTarget + '/');
    };

    const isParentActive = (children?: MenuItem[]) => {
        if (!children || children.length === 0) return false;
        return children.some((child) => isItemActive(child.url));
    };

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    // Handle universal skeleton loading state during public portal page navigation
    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            try {
                const targetUrl = event.detail?.visit?.url ? event.detail.visit.url.toString() : window.location.pathname;
                setTargetPageType(resolvePageTypeFromUrl(targetUrl));
            } catch {
                setTargetPageType('generic');
            }
            setIsPageLoading(true);
            setMobileMenuOpen(false);
            setOpenDropdown(null);
        });

        const removeFinish = router.on('finish', () => {
            setIsPageLoading(false);
        });

        const removeCancel = router.on('cancel', () => {
            setIsPageLoading(false);
        });

        return () => {
            removeStart();
            removeFinish();
            removeCancel();
        };
    }, []);

    const menuItems: MenuItem[] = primaryMenu?.root_items || [
        { id: 1, label: 'Beranda', url: '/' },
        {
            id: 2,
            label: 'Profil Sekolah',
            url: '#',
            children: [
                { id: 21, label: 'Visi & Misi', url: '/visi-misi-sekolah' },
                { id: 22, label: 'Sejarah Sekolah', url: '/sejarah-sekolah' },
                { id: 23, label: 'Direktori Guru & Staf', url: '/guru-dan-staf' },
                { id: 24, label: 'Sarana & Fasilitas', url: '/fasilitas' },
            ],
        },
        { id: 3, label: 'Berita', url: '/berita' },
        { id: 4, label: 'Ekstrakurikuler', url: '/ekstrakurikuler' },
        { id: 5, label: 'Prestasi', url: '/prestasi' },
        { id: 6, label: 'Agenda', url: '/agenda' },
        { id: 7, label: 'Galeri', url: '/galeri' },
    ];

    return (
        <div className="min-h-screen bg-canvas-paper text-ink font-sans flex flex-col selection:bg-prussian-light selection:text-prussian">
            {/* Top Utility Bar */}
            <div className="bg-prussian text-canvas-paper py-1.5 sm:py-2 px-3 sm:px-4 border-b border-prussian-hover">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                    <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 truncate">
                        <span className="inline-flex items-center gap-1 font-mono shrink-0">
                            <span className="text-canvas-subtle/70">NPSN:</span> {npsn}
                        </span>
                        <span className="text-canvas-subtle/40">•</span>
                        <span className="inline-flex items-center gap-1 truncate">
                            <span className="text-canvas-subtle/70 hidden xs:inline">Akreditasi:</span>{' '}
                            <span className="font-semibold">{accreditation}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                        <ThemeToggle variant="topbar" />
                        <Link
                            href="/dashboard"
                            className="px-2 sm:px-2.5 py-0.5 rounded border border-canvas-subtle/30 text-canvas-paper hover:bg-canvas-paper hover:text-prussian transition-colors font-medium whitespace-nowrap text-[10px] sm:text-xs"
                        >
                            Login Portal
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header & Navigation */}
            <header className="sticky top-0 z-40 bg-surface-card/95 backdrop-blur-xs border-b border-line shadow-xs">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-16 sm:h-20">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 group shrink-0 mr-2 xl:mr-4">
                        <img
                            src={settings?.school_logo || '/images/logo.png'}
                            alt={schoolName}
                            className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 object-contain drop-shadow-xs group-hover:scale-105 transition-transform shrink-0"
                        />
                        <div className="font-serif font-bold text-base sm:text-xl lg:text-base xl:text-xl text-ink tracking-tight leading-tight group-hover:text-prussian transition-colors whitespace-nowrap">
                            {schoolName}
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                        {menuItems.map((item) => {
                            const hasChildren = item.children && item.children.length > 0;
                            const isActive = hasChildren
                                ? isParentActive(item.children)
                                : isItemActive(item.url);

                            return (
                                <div key={item.id} className="relative">
                                    {hasChildren ? (
                                        <div
                                            className="relative"
                                            onMouseEnter={() => setOpenDropdown(item.id)}
                                            onMouseLeave={() => setOpenDropdown(null)}
                                        >
                                            <button
                                                type="button"
                                                className={`relative px-2 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded transition-colors inline-flex items-center gap-1 ${
                                                    isActive
                                                        ? 'text-prussian font-bold bg-prussian/[0.08]'
                                                        : 'text-ink hover:text-prussian hover:bg-canvas-subtle'
                                                }`}
                                            >
                                                <span>{item.label}</span>
                                                <ChevronDownIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 opacity-60" />
                                                {isActive && (
                                                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-prussian rounded-full" />
                                                )}
                                            </button>

                                            {openDropdown === item.id && (
                                                <div className="absolute top-full left-0 min-w-[210px] bg-surface-card rounded border border-line shadow-md py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                                    {item.children!.map((child) => {
                                                        const childActive = isItemActive(child.url);
                                                        return (
                                                            <Link
                                                                key={child.id}
                                                                href={child.url}
                                                                className={`flex items-center justify-between px-3.5 py-2 text-xs xl:text-sm transition-colors ${
                                                                    childActive
                                                                        ? 'bg-prussian/10 text-prussian font-semibold border-l-2 border-prussian pl-3'
                                                                        : 'text-ink hover:bg-canvas-subtle hover:text-prussian'
                                                                }`}
                                                            >
                                                                <span>{child.label}</span>
                                                                {childActive && (
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-prussian" />
                                                                )}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.url}
                                            className={`relative px-2 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded transition-colors inline-flex items-center ${
                                                isActive
                                                    ? 'text-prussian font-bold bg-prussian/[0.08]'
                                                    : 'text-ink hover:text-prussian hover:bg-canvas-subtle'
                                            }`}
                                        >
                                            <span>{item.label}</span>
                                            {isActive && (
                                                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-prussian rounded-full" />
                                            )}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0 ml-1">
                        <Link
                            href="/ppdb"
                            className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 rounded bg-terracotta hover:bg-terracotta-hover text-white text-xs xl:text-sm font-semibold tracking-wide transition-colors shadow-xs ${
                                isItemActive('/ppdb') ? 'ring-2 ring-terracotta ring-offset-2 ring-offset-white' : ''
                            }`}
                        >
                            <span>Info PPDB</span>
                            <span className="w-1.5 h-1.5 xl:w-2 xl:h-2 rounded-full bg-white animate-pulse" />
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
                        <Link
                            href="/ppdb"
                            className={`px-2.5 sm:px-3 py-1.5 rounded bg-terracotta text-white text-xs font-semibold ${
                                isItemActive('/ppdb') ? 'ring-2 ring-terracotta ring-offset-1 ring-offset-white' : ''
                            }`}
                        >
                            PPDB
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 sm:p-2 rounded border border-line text-ink hover:bg-canvas-subtle"
                            aria-label="Buka Menu"
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-line bg-surface-card px-4 py-4 space-y-2">
                        {menuItems.map((item) => {
                            const hasChildren = item.children && item.children.length > 0;
                            const isActive = hasChildren
                                ? isParentActive(item.children)
                                : isItemActive(item.url);

                            return (
                                <div key={item.id} className="border-b border-line/50 pb-2">
                                    {hasChildren ? (
                                        <div>
                                            <div
                                                className={`font-semibold text-sm px-2 py-1 ${
                                                    isActive ? 'text-prussian font-bold' : 'text-ink'
                                                }`}
                                            >
                                                {item.label}
                                            </div>
                                            <div className="pl-3 mt-1 space-y-1">
                                                {item.children!.map((child) => {
                                                    const childActive = isItemActive(child.url);
                                                    return (
                                                        <Link
                                                            key={child.id}
                                                            href={child.url}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className={`flex items-center justify-between px-3 py-1.5 rounded text-sm transition-colors ${
                                                                childActive
                                                                    ? 'bg-prussian/10 text-prussian font-semibold border-l-2 border-prussian pl-2.5'
                                                                    : 'text-ink-secondary hover:text-prussian hover:bg-canvas-subtle'
                                                            }`}
                                                        >
                                                            <span>{child.label}</span>
                                                            {childActive && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-prussian" />
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.url}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-prussian/10 text-prussian font-bold border-l-2 border-prussian pl-2.5'
                                                    : 'text-ink hover:text-prussian hover:bg-canvas-subtle'
                                            }`}
                                        >
                                            <span>{item.label}</span>
                                            {isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-prussian" />
                                            )}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}

                        {/* Mobile Theme Toggle */}
                        <div className="pt-3 border-t border-line/60 flex items-center justify-between px-2">
                            <span className="text-xs font-medium text-ink-secondary">Mode Tampilan</span>
                            <ThemeToggle variant="full" />
                        </div>
                    </div>
                )}
            </header>

            {/* Page Content with Universal Skeleton Loading State */}
            <main className="flex-1">
                {isPageLoading ? (
                    <PublicPageSkeleton type={targetPageType} />
                ) : (
                    <div className="animate-in fade-in duration-150">
                        {children}
                    </div>
                )}
            </main>

            {/* Institutional Editorial Footer */}
            <footer className="bg-prussian text-canvas-paper border-t border-prussian-hover pt-14 pb-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-prussian-hover">
                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={settings?.school_logo || '/images/logo.png'}
                                alt={schoolName}
                                className="w-10 h-10 object-contain drop-shadow-xs"
                            />
                            <div className="font-serif font-bold text-xl text-white">
                                {schoolName}
                            </div>
                        </div>
                        <p className="text-canvas-subtle/80 text-sm leading-relaxed pr-6">
                            Lembaga pendidikan menengah pertama yang berkomitmen mencetak
                            generasi unggul berwawasan kebangsaan, berkarakter budi pekerti luhur,
                            serta menguasai kecakapan abad ke-21.
                        </p>
                        <div className="space-y-2 text-sm text-canvas-subtle/90 pt-2">
                            <div className="flex items-start gap-2">
                                <MapPinIcon className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                                <span>{address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="w-4 h-4 text-terracotta shrink-0" />
                                <span>{phone} / WA: {whatsapp}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <EnvelopeIcon className="w-4 h-4 text-terracotta shrink-0" />
                                <span>{email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Nav Links Column */}
                    <div className="md:col-span-3 space-y-3">
                        <h4 className="font-serif text-base font-semibold text-white tracking-wide uppercase border-b border-prussian-hover pb-2">
                            Tautan Penting
                        </h4>
                        <ul className="space-y-2 text-sm text-canvas-subtle">
                            <li>
                                <Link href="/visi-misi-sekolah" className="hover:text-white transition-colors">
                                    Visi, Misi & Tujuan
                                </Link>
                            </li>
                            <li>
                                <Link href="/guru-dan-staf" className="hover:text-white transition-colors">
                                    Direktori Guru & Tenaga Kependidikan
                                </Link>
                            </li>
                            <li>
                                <Link href="/fasilitas" className="hover:text-white transition-colors">
                                    Sarana & Fasilitas Sekolah
                                </Link>
                            </li>
                            <li>
                                <Link href="/ekstrakurikuler" className="hover:text-white transition-colors">
                                    Kegiatan Ekstrakurikuler Siswa
                                </Link>
                            </li>
                            <li>
                                <Link href="/prestasi" className="hover:text-white transition-colors">
                                    Rekap Prestasi Akademik & Non-Akademik
                                </Link>
                            </li>
                            <li>
                                <Link href="/agenda" className="hover:text-white transition-colors">
                                    Kalender & Agenda Sekolah
                                </Link>
                            </li>
                            <li>
                                <Link href="/galeri" className="hover:text-white transition-colors">
                                    Galeri Foto Kegiatan
                                </Link>
                            </li>
                            <li>
                                <Link href="/kontak" className="hover:text-white transition-colors">
                                    Hubungi Kami & Aspirasi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Google Maps / Lokasi Sekolah Column */}
                    <div className="md:col-span-4 space-y-3">
                        <h4 className="font-serif text-base font-semibold text-white tracking-wide uppercase border-b border-prussian-hover pb-2">
                            Lokasi Sekolah
                        </h4>
                        <div className="overflow-hidden rounded border border-prussian-hover bg-prussian-hover/30 shadow-xs">
                            <iframe
                                title="Peta Lokasi SMP Negeri 5 Sambas"
                                src="https://maps.google.com/maps?q=1.3881886,109.3615345&hl=id&z=17&t=k&output=embed"
                                className="w-full h-36 border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <a
                            href="https://maps.app.goo.gl/2Rq4d9f46ed5ViU96"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
                        >
                            <MapPinIcon className="w-4 h-4 text-terracotta shrink-0" />
                            <span>Buka di Google Maps</span>
                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-80 shrink-0" />
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-canvas-subtle/60">
                    <div>
                        © {new Date().getFullYear()} {schoolName}. Hak Cipta Dilindungi Undang-Undang.
                    </div>
                </div>
            </footer>

            {/* Floating Scroll To Top Button */}
            <ScrollToTop />
        </div>
    );
}

