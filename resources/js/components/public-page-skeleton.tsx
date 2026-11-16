import { Skeleton } from '@/components/ui/skeleton';

export type PublicPageType =
    | 'home'
    | 'news'
    | 'facility'
    | 'gallery'
    | 'staff'
    | 'agenda'
    | 'extracurricular'
    | 'achievement'
    | 'ppdb'
    | 'post'
    | 'contact'
    | 'generic';

export function resolvePageTypeFromUrl(urlStr: string): PublicPageType {
    try {
        let pathname = urlStr;
        if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
            pathname = new URL(urlStr).pathname;
        } else {
            pathname = urlStr.split('?')[0];
        }
        pathname = pathname.replace(/\/+$/, '') || '/';

        if (pathname === '/') return 'home';

        // Specific section directories
        if (pathname === '/berita' || pathname.startsWith('/berita?')) return 'news';
        if (pathname.startsWith('/berita/')) return 'post'; // Article detail warta

        if (pathname.startsWith('/fasilitas')) return 'facility';
        if (pathname.startsWith('/galeri')) return 'gallery';
        if (pathname.startsWith('/guru-dan-staf')) return 'staff';
        if (pathname.startsWith('/agenda')) return 'agenda';
        if (pathname.startsWith('/ekstrakurikuler')) return 'extracurricular';
        if (pathname.startsWith('/prestasi')) return 'achievement';
        if (pathname.startsWith('/ppdb')) return 'ppdb';
        if (pathname.startsWith('/kontak')) return 'contact';

        // Static profile pages & single slugs
        if (pathname === '/visi-misi-sekolah' || pathname === '/sejarah-sekolah') return 'post';
        if (pathname.split('/').length === 2 && pathname !== '/') return 'post';

        return 'generic';
    } catch {
        return 'generic';
    }
}

interface PublicPageSkeletonProps {
    type?: PublicPageType | string;
}

export default function PublicPageSkeleton({ type = 'generic' }: PublicPageSkeletonProps) {
    switch (type) {
        case 'home':
            return <HomeSkeleton />;
        case 'news':
            return <NewsSkeleton />;
        case 'facility':
            return <FacilitySkeleton />;
        case 'gallery':
            return <GallerySkeleton />;
        case 'staff':
            return <StaffSkeleton />;
        case 'agenda':
            return <AgendaSkeleton />;
        case 'extracurricular':
            return <ExtracurricularSkeleton />;
        case 'achievement':
            return <AchievementSkeleton />;
        case 'ppdb':
            return <PpdbSkeleton />;
        case 'post':
            return <PostDetailSkeleton />;
        case 'contact':
            return <ContactSkeleton />;
        default:
            return <GenericSkeleton />;
    }
}

/* =========================================================================
   1. Home Page Skeleton (1:1 with welcome.tsx)
   ========================================================================= */
function HomeSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 animate-in fade-in duration-150">
            {/* Typographic Headline Banner */}
            <div className="border-b border-line pb-5 sm:pb-6 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 sm:h-12 w-72 sm:w-96" />
                    <Skeleton className="h-4 sm:h-5 w-60 sm:w-80" />
                </div>
                <Skeleton className="h-7 w-48 rounded-sm shrink-0" />
            </div>

            {/* ScrollStack Cards Layout */}
            <div className="space-y-6 sm:space-y-8">
                {/* Card 1: Sambutan Kepala Sekolah & Pengumuman Resmi */}
                <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-line bg-surface-card shadow-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                        {/* Sambutan (Col 7) */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Skeleton className="w-5 h-5 rounded" />
                                    <Skeleton className="h-4 w-44" />
                                </div>
                                <div className="pl-3.5 border-l-2 border-prussian/40 space-y-2 my-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-11/12" />
                                    <Skeleton className="h-4 w-4/5" />
                                </div>
                            </div>
                            <div className="mt-5 pt-3.5 border-t border-line/60 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-36" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>

                        {/* Pengumuman Widget (Col 5) */}
                        <div className="lg:col-span-5 bg-canvas-subtle/50 rounded-lg border border-line p-4 sm:p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between pb-2.5 border-b border-line mb-3">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="w-4 h-4 rounded" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="pb-2.5 border-b border-line/40 last:border-0 last:pb-0 space-y-1.5">
                                            <Skeleton className="h-2.5 w-24" />
                                            <Skeleton className="h-4 w-5/6" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-line/60 flex justify-end">
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Berita & Liputan Terkini (3 Cards Grid) */}
                <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-line bg-surface-card shadow-xs">
                    <div className="flex items-baseline justify-between border-b border-line pb-4 mb-6">
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-36" />
                            <Skeleton className="h-7 w-56" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-canvas-subtle/40 rounded-lg border border-line p-4 sm:p-5 flex flex-col justify-between space-y-3">
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-16 rounded-xs" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-3.5 w-5/6" />
                                </div>
                                <div className="pt-3 border-t border-line/50 flex items-center justify-between">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card 3: Prestasi & Agenda */}
                <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-line bg-surface-card shadow-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                        <div className="lg:col-span-7 space-y-3">
                            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                                <div className="space-y-1">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-4 w-24" />
                            </div>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-canvas-subtle/50 rounded-lg border border-line p-3 flex items-start gap-3">
                                    <Skeleton className="w-10 h-10 rounded shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-3.5 w-16" />
                                            <Skeleton className="h-3.5 w-14" />
                                        </div>
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-5 space-y-3">
                            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                                <div className="space-y-1">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-40" />
                                </div>
                                <Skeleton className="h-4 w-24" />
                            </div>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-canvas-subtle/50 rounded-lg border border-line p-3 flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded shrink-0" />
                                    <div className="space-y-1 flex-1">
                                        <Skeleton className="h-3.5 w-4/5" />
                                        <Skeleton className="h-2.5 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   2. Facility Directory Skeleton (1:1 with facility-directory.tsx)
   ========================================================================= */
function FacilitySkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-150">
            {/* Editorial Section Header */}
            <div className="border-b border-[#E2DFD7] pb-6 mb-8 space-y-2">
                <Skeleton className="h-3 w-48 font-mono" />
                <Skeleton className="h-9 sm:h-11 w-80 max-w-full font-serif" />
                <Skeleton className="h-4 w-full max-w-2xl" />

                {/* Search & Filter Bar */}
                <div className="mt-6 pt-6 border-t border-line flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Search Input + Button */}
                    <div className="flex items-center gap-2 max-w-md w-full">
                        <Skeleton className="h-9 flex-1 rounded-xs" />
                        <Skeleton className="h-9 w-16 rounded-xs shrink-0" />
                    </div>

                    {/* Controls Toolbar: Dropdown & Counter */}
                    <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                        <Skeleton className="h-9 w-36 rounded-xs" />
                        <Skeleton className="h-9 w-40 rounded-xs" />
                    </div>
                </div>
            </div>

            {/* Section Header Title */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E2DFD7]">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>

            {/* 3-Column Card Grid (1:1 with Real Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <article
                        key={i}
                        className="rounded-xs border border-[#E2DFD7] bg-white flex flex-col overflow-hidden shadow-2xs"
                    >
                        {/* Image Cover aspect-16/10 with Category Pill */}
                        <div className="relative aspect-16/10 w-full bg-[#FAF9F6] border-b border-[#E2DFD7]">
                            <Skeleton className="w-full h-full rounded-none" />
                            <div className="absolute top-3 left-3">
                                <Skeleton className="h-5 w-24 rounded-2xs" />
                            </div>
                        </div>

                        {/* Content Details */}
                        <div className="p-5 flex flex-1 flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                {/* Metadata Pills */}
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-3 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                {/* Facility Name */}
                                <Skeleton className="h-5 w-4/5 font-serif" />
                                {/* Description Excerpt */}
                                <Skeleton className="h-3.5 w-full" />
                                <Skeleton className="h-3.5 w-3/4" />
                            </div>

                            {/* Bottom Card Footer */}
                            <div className="pt-3 border-t border-[#E2DFD7] flex items-center justify-between">
                                <Skeleton className="h-4 w-24 rounded-2xs" />
                                <Skeleton className="h-3.5 w-20" />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
   3. News Directory Skeleton (1:1 with news-directory.tsx)
   ========================================================================= */
function NewsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Page Header */}
            <div className="border-b border-line pb-6 mb-8 space-y-2">
                <Skeleton className="h-3 w-52 font-mono" />
                <Skeleton className="h-9 sm:h-11 w-96 max-w-full font-serif" />
                <Skeleton className="h-4 w-full max-w-2xl" />

                {/* Search & Filter Bar */}
                <div className="mt-6 pt-6 border-t border-line flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 max-w-md w-full">
                        <Skeleton className="h-9 flex-1 rounded-xs" />
                        <Skeleton className="h-9 w-16 rounded-xs shrink-0" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                        <Skeleton className="h-9 w-36 rounded-xs" />
                        {/* Format selector buttons */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xs border border-[#D8D2C6]">
                            <Skeleton className="h-7 w-24 rounded-2xs" />
                            <Skeleton className="h-7 w-20 rounded-2xs" />
                            <Skeleton className="h-7 w-24 rounded-2xs" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Article Banner (Col 7 Image on left, Col 5 Content on right) */}
            <div className="mb-12 bg-white rounded-xs border border-[#E2DFD7] overflow-hidden shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    <div className="lg:col-span-7 bg-[#FAF9F6] aspect-[16/9] lg:aspect-auto relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E2DFD7]">
                        <Skeleton className="w-full h-full min-h-[260px] sm:min-h-[320px] rounded-none" />
                        <div className="absolute top-3 left-3">
                            <Skeleton className="h-6 w-28 rounded-xs" />
                        </div>
                    </div>
                    <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-24 rounded-xs" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-7 w-full font-serif" />
                            <Skeleton className="h-7 w-4/5 font-serif" />
                            <Skeleton className="h-3.5 w-full pt-1" />
                            <Skeleton className="h-3.5 w-11/12" />
                            <Skeleton className="h-3.5 w-2/3" />
                        </div>
                        <div className="mt-6 pt-4 border-t border-[#E2DFD7] flex items-center justify-between">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>
                </div>
            </div>

            {/* News Grid Title */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E2DFD7]">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>

            {/* 3-Column Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <article key={i} className="bg-white border border-[#E2DFD7] rounded-xs overflow-hidden shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="aspect-[16/10] bg-[#FAF9F6] relative overflow-hidden border-b border-[#E2DFD7]">
                                <Skeleton className="w-full h-full rounded-none" />
                                <div className="absolute top-2.5 left-2.5">
                                    <Skeleton className="h-4 w-16 rounded-2xs" />
                                </div>
                            </div>
                            <div className="p-5 space-y-2.5">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-20 rounded-xs" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-5 w-full font-serif" />
                                <Skeleton className="h-5 w-3/4 font-serif" />
                                <Skeleton className="h-3.5 w-full pt-1" />
                                <Skeleton className="h-3.5 w-4/5" />
                            </div>
                        </div>
                        <div className="px-5 pb-5 pt-3 border-t border-[#E2DFD7] flex items-center justify-between">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-3.5 w-24" />
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
   4. Gallery Directory Skeleton (1:1 with gallery-directory.tsx)
   ========================================================================= */
function GallerySkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Page Header */}
            <div className="border-b border-line pb-6 mb-8 space-y-2">
                <Skeleton className="h-3 w-48 font-mono" />
                <Skeleton className="h-9 sm:h-11 w-80 max-w-full font-serif" />
                <Skeleton className="h-4 w-full max-w-2xl" />

                {/* Search & Filter Bar */}
                <div className="mt-6 pt-6 border-t border-line flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 max-w-md w-full">
                        <Skeleton className="h-9 flex-1 rounded-xs" />
                        <Skeleton className="h-9 w-16 rounded-xs shrink-0" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                        <Skeleton className="h-9 w-36 rounded-xs" />
                        <Skeleton className="h-9 w-36 rounded-xs" />
                    </div>
                </div>
            </div>

            {/* Gallery Grid Title Header */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E2DFD7]">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>

            {/* 3-Column Album Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <article key={i} className="bg-white border border-[#E2DFD7] rounded-xs overflow-hidden shadow-2xs flex flex-col justify-between">
                        <div>
                            {/* Cover aspect-16/10 with Category Pill top-left & Photo count bottom-right */}
                            <div className="aspect-[16/10] bg-[#FAF9F6] relative overflow-hidden border-b border-[#E2DFD7]">
                                <Skeleton className="w-full h-full rounded-none" />
                                <div className="absolute top-2.5 left-2.5">
                                    <Skeleton className="h-4 w-20 rounded-2xs" />
                                </div>
                                <div className="absolute bottom-2.5 right-2.5">
                                    <Skeleton className="h-4 w-16 rounded-2xs" />
                                </div>
                            </div>
                            <div className="p-5 space-y-2.5">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-20 rounded-xs" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                                <Skeleton className="h-5 w-4/5 font-serif" />
                                <Skeleton className="h-3.5 w-full pt-1" />
                                <Skeleton className="h-3.5 w-3/4" />
                            </div>
                        </div>
                        <div className="px-5 pb-5 pt-3 border-t border-[#E2DFD7] flex items-center justify-between">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-3.5 w-28" />
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
   5. Staff Directory Skeleton (1:1 with staff-directory.tsx)
   ========================================================================= */
function StaffSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="border-b border-line pb-6 mb-8 space-y-2">
                <Skeleton className="h-3 w-56 font-mono" />
                <Skeleton className="h-9 sm:h-11 w-96 max-w-full font-serif" />
                <Skeleton className="h-4 w-full max-w-2xl" />

                {/* 4 Category Tabs */}
                <div className="flex flex-wrap gap-2 mt-6 pt-2">
                    {[100, 130, 110, 180].map((w, idx) => (
                        <Skeleton key={idx} className="h-8 rounded" style={{ width: `${w}px` }} />
                    ))}
                </div>
            </div>

            {/* 4-Column Staff Cards Grid (Aspect 3:4 Portrait Photos) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded border border-line overflow-hidden shadow-xs flex flex-col justify-between">
                        {/* Aspect 3:4 Portrait Photo */}
                        <div className="aspect-[3/4] bg-canvas-subtle relative border-b border-line">
                            <Skeleton className="w-full h-full rounded-none" />
                            <div className="absolute top-2 right-2">
                                <Skeleton className="h-4 w-12 rounded" />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-4/5 font-serif" />
                                <Skeleton className="h-3.5 w-3/5" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <div className="pt-2 border-t border-line/60">
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
   6. Academic Agenda Skeleton (1:1 with academic-agenda.tsx)
   ========================================================================= */
function AgendaSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="border-b border-line pb-6 mb-8 space-y-2">
                <Skeleton className="h-3 w-44 font-mono" />
                <Skeleton className="h-9 sm:h-11 w-88 max-w-full font-serif" />
                <Skeleton className="h-4 w-full max-w-2xl" />
            </div>

            {/* Stack of Agenda Items */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded border border-line p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xs"
                    >
                        {/* Date Block */}
                        <Skeleton className="w-16 h-16 rounded bg-prussian/20 shrink-0" />

                        {/* Event Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-3 w-36" />
                            </div>
                            <Skeleton className="h-5 w-3/4 font-serif" />
                            <Skeleton className="h-3.5 w-full" />
                            <div className="pt-1 flex items-center gap-2">
                                <Skeleton className="w-3.5 h-3.5 rounded" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
   7. Extracurricular Directory Skeleton (1:1 with extracurricular-directory.tsx)
   ========================================================================= */
function ExtracurricularSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="border-b border-line pb-6 mb-8 space-y-2">
                <Skeleton className="h-3 w-52 font-mono" />
                <Skeleton className="h-9 sm:h-11 w-88 max-w-full font-serif" />
                <Skeleton className="h-4 w-full max-w-2xl" />
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded border border-line p-6 flex flex-col justify-between shadow-xs space-y-4"
                    >
                        <div>
                            {/* Icon Box */}
                            <Skeleton className="w-12 h-12 rounded bg-prussian/10 mb-4 border border-line" />
                            {/* Name */}
                            <Skeleton className="h-6 w-3/4 font-serif mb-2" />
                            {/* Description */}
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-3.5 w-5/6 mt-1" />
                        </div>

                        {/* Footer: Pembina & Jadwal */}
                        <div className="pt-4 border-t border-line space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-3.5 w-40" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-3.5 w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
   8. Achievement Directory Skeleton (1:1 with achievement-directory.tsx)
   ========================================================================= */
function AchievementSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="border-b border-line pb-6 mb-8 space-y-2">
                <Skeleton className="h-3 w-48 font-mono" />
                <Skeleton className="h-9 sm:h-11 w-80 max-w-full font-serif" />
                <Skeleton className="h-4 w-full max-w-2xl" />

                {/* 5 Filter Tabs */}
                <div className="flex flex-wrap gap-2 mt-6 pt-2">
                    {[110, 110, 90, 85, 120].map((w, idx) => (
                        <Skeleton key={idx} className="h-8 rounded" style={{ width: `${w}px` }} />
                    ))}
                </div>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded border border-line p-6 flex items-start gap-4 shadow-xs"
                    >
                        {/* Trophy & Year Icon Block */}
                        <Skeleton className="w-14 h-14 rounded bg-canvas-subtle border border-line shrink-0" />

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-24 rounded" />
                                <Skeleton className="h-4 w-20 rounded" />
                            </div>
                            <Skeleton className="h-5 w-4/5 font-serif" />
                            <div className="space-y-1 pt-1">
                                <Skeleton className="h-3.5 w-3/5" />
                                <Skeleton className="h-3.5 w-1/2" />
                            </div>
                            <div className="pt-2 border-t border-line/50">
                                <Skeleton className="h-3 w-full italic" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
   9. PPDB Info Skeleton (1:1 with ppdb-info.tsx)
   ========================================================================= */
function PpdbSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-10 animate-in fade-in duration-150 space-y-8">
            {/* PPDB Hero Card */}
            <div className="bg-white rounded-2xl border border-line p-5 sm:px-8 sm:pt-6 sm:pb-8 shadow-xs text-center space-y-4">
                {/* Illustration Box Placeholder */}
                <div className="mx-auto max-w-md w-full h-44 sm:h-56 rounded-xl bg-canvas-subtle/70 border border-line flex items-center justify-center">
                    <Skeleton className="w-32 h-32 rounded-lg" />
                </div>

                {/* Main Heading */}
                <div className="space-y-2 max-w-2xl mx-auto">
                    <Skeleton className="h-8 sm:h-10 w-full font-serif" />
                    <Skeleton className="h-8 sm:h-10 w-3/4 mx-auto font-serif" />
                    <Skeleton className="h-4 w-5/6 mx-auto pt-2" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-line">
                    <Skeleton className="h-10 w-44 rounded-lg" />
                    <Skeleton className="h-10 w-52 rounded-lg" />
                    <Skeleton className="h-10 w-48 rounded-lg" />
                </div>
            </div>

            {/* Preparation Checklist */}
            <div className="bg-white rounded-xl border border-line p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-40 font-mono" />
                        <Skeleton className="h-6 w-72 font-serif" />
                    </div>
                    <Skeleton className="h-6 w-28 rounded" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-lg border border-line bg-canvas-subtle/50 space-y-3">
                            <Skeleton className="w-9 h-9 rounded-md" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                            <div className="pt-2 border-t border-line/50">
                                <Skeleton className="h-2.5 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4 Tracks Reference */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-56 font-serif" />
                    <Skeleton className="h-3.5 w-full max-w-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-line p-5 shadow-xs space-y-3">
                            <Skeleton className="h-5 w-3/5 font-serif" />
                            <Skeleton className="h-3.5 w-full" />
                            <div className="space-y-1.5 pt-2 border-t border-line/50">
                                <Skeleton className="h-3 w-4/5" />
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   10. Post Detail (Article / Visi Misi / Sejarah) Skeleton (1:1 with post-detail.tsx)
   ========================================================================= */
function PostDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150 space-y-6">
            {/* Article Header */}
            <header className="border-b border-line pb-6 mb-8 space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20 rounded" />
                    <Skeleton className="h-5 w-28 rounded" />
                </div>

                <Skeleton className="h-9 sm:h-12 w-full font-serif" />
                <Skeleton className="h-9 sm:h-12 w-4/5 font-serif" />

                {/* Excerpt quote */}
                <div className="pl-4 border-l-2 border-prussian/40 space-y-2 py-1">
                    <Skeleton className="h-4 w-full italic" />
                    <Skeleton className="h-4 w-5/6 italic" />
                </div>

                {/* Author & Date metadata bar */}
                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="h-3 w-36" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                    </div>
                    <Skeleton className="h-7 w-24 rounded border border-line" />
                </div>
            </header>

            {/* Article Content Box */}
            <article className="bg-white rounded border border-line p-6 sm:p-10 shadow-xs mb-12 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />

                {/* In-content image */}
                <Skeleton className="aspect-16/9 w-full rounded my-6" />

                <Skeleton className="h-6 w-1/3 font-serif mt-6 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
            </article>

            {/* Related Posts */}
            <div className="border-t border-line pt-8 space-y-4">
                <Skeleton className="h-6 w-48 font-serif" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded border border-line p-4 space-y-2">
                            <Skeleton className="aspect-16/10 w-full rounded" />
                            <Skeleton className="h-4 w-4/5 font-serif" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   11. Contact Page Skeleton (1:1 with contact.tsx)
   ========================================================================= */
function ContactSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-in fade-in duration-150">
            {/* Header Banner */}
            <div className="border-b border-line pb-8 mb-10 space-y-2">
                <Skeleton className="h-3 w-48 font-mono" />
                <Skeleton className="h-10 sm:h-12 w-72 font-serif" />
                <Skeleton className="h-4 w-full max-w-2xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: 4 Info Cards & Map (Col 5) */}
                <div className="lg:col-span-5 space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-line p-6 shadow-xs flex items-start gap-3.5">
                            <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-36 font-serif" />
                                <Skeleton className="h-3.5 w-full" />
                                <Skeleton className="h-3.5 w-4/5" />
                            </div>
                        </div>
                    ))}
                    {/* Map Box */}
                    <div className="rounded-2xl border border-line overflow-hidden shadow-xs bg-white">
                        <div className="p-3 bg-neutral-50 border-b border-line flex items-center justify-between">
                            <Skeleton className="h-4 w-44" />
                            <Skeleton className="h-3.5 w-28" />
                        </div>
                        <Skeleton className="w-full h-52 rounded-none" />
                    </div>
                </div>

                {/* Right Column: Contact Message Form (Col 7) */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl border border-line p-6 sm:p-10 shadow-xs space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-5 h-5 rounded" />
                                <Skeleton className="h-4 w-48 font-mono" />
                            </div>
                            <Skeleton className="h-8 sm:h-9 w-4/5 font-serif" />
                            <Skeleton className="h-3.5 w-full" />
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-10 w-full rounded-xs" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3.5 w-20" />
                                    <Skeleton className="h-10 w-full rounded-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3.5 w-28" />
                                    <Skeleton className="h-10 w-full rounded-xs" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-32" />
                                <Skeleton className="h-10 w-full rounded-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-28" />
                                <Skeleton className="h-28 w-full rounded-xs" />
                            </div>
                            <Skeleton className="h-11 w-44 rounded-xs" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   12. Generic Page Skeleton (Fallback)
   ========================================================================= */
function GenericSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150 space-y-6">
            <div className="space-y-3">
                <Skeleton className="h-3 w-36 font-mono" />
                <Skeleton className="h-8 sm:h-10 w-64 font-serif" />
                <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-card p-6 space-y-3 shadow-xs">
                        <Skeleton className="h-40 w-full rounded" />
                        <Skeleton className="h-5 w-3/4 font-serif" />
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}
