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
        if (pathname.startsWith('/berita') || pathname.startsWith('/pengumuman')) return 'news';
        if (pathname.startsWith('/fasilitas')) return 'facility';
        if (pathname.startsWith('/galeri')) return 'gallery';
        if (pathname.startsWith('/guru-dan-staf')) return 'staff';
        if (pathname.startsWith('/agenda')) return 'agenda';
        if (pathname.startsWith('/ekstrakurikuler')) return 'extracurricular';
        if (pathname.startsWith('/prestasi')) return 'achievement';
        if (pathname.startsWith('/ppdb')) return 'ppdb';
        if (pathname.startsWith('/kontak')) return 'contact';
        if (pathname === '/visi-misi-sekolah' || pathname === '/sejarah-sekolah') return 'post';

        // Check if slug-like post
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

/* 1. Home Page Skeleton */
function HomeSkeleton() {
    return (
        <div className="animate-in fade-in duration-150">
            {/* Hero Section Skeleton */}
            <div className="bg-canvas-paper border-b border-line py-12 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-10 sm:h-14 w-3/4 max-w-2xl" />
                    <Skeleton className="h-5 w-2/3 max-w-xl" />
                    <div className="pt-4 flex items-center gap-3">
                        <Skeleton className="h-10 w-36 rounded" />
                        <Skeleton className="h-10 w-44 rounded" />
                    </div>
                </div>
            </div>

            {/* Sambutan & Pengumuman Card Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="p-6 sm:p-8 rounded-xl border border-line bg-surface-card shadow-xs space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 space-y-4">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-5/6" />
                            <Skeleton className="h-6 w-4/6" />
                            <div className="pt-6 flex items-center gap-3">
                                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-5 p-5 rounded-lg border border-line bg-canvas-subtle/40 space-y-4">
                            <Skeleton className="h-4 w-36" />
                            <div className="space-y-3 pt-2">
                                <Skeleton className="h-12 w-full rounded" />
                                <Skeleton className="h-12 w-full rounded" />
                                <Skeleton className="h-12 w-full rounded" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Section Skeleton */}
                <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 rounded-lg border border-line bg-surface-card space-y-3">
                            <Skeleton className="h-6 w-12 rounded" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* 2. Facility Directory Skeleton */
function FacilitySkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="mb-8 space-y-3">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-9 sm:h-11 w-80 max-w-full" />
                <Skeleton className="h-4 w-full max-w-2xl" />
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-4 border-b border-line/60">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[100, 140, 130, 110, 105].map((w, idx) => (
                        <Skeleton key={idx} className={`h-8 w-[${w}px] rounded-full shrink-0`} style={{ width: `${w}px` }} />
                    ))}
                </div>
                <Skeleton className="h-9 w-full md:w-64 rounded shrink-0" />
            </div>

            {/* 3-Column Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-card overflow-hidden shadow-xs flex flex-col justify-between">
                        <Skeleton className="aspect-[16/10] w-full rounded-none" />
                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-4/5" />
                                <Skeleton className="h-3.5 w-full" />
                                <Skeleton className="h-3.5 w-3/4" />
                            </div>
                            <div className="pt-4 border-t border-line/50 flex items-center justify-between">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* 3. News Directory Skeleton */
function NewsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="mb-8 space-y-3">
                <Skeleton className="h-3 w-52" />
                <Skeleton className="h-9 sm:h-11 w-96 max-w-full" />
                <Skeleton className="h-4 w-full max-w-2xl" />
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-10 pb-4 border-b border-line/60">
                <Skeleton className="h-9 w-full sm:w-80 rounded" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-36 rounded" />
                    <Skeleton className="h-9 w-44 rounded" />
                </div>
            </div>

            {/* Featured Article Skeleton */}
            <div className="mb-10 rounded-lg border border-line bg-surface-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs">
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center space-y-3">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-4/5" />
                    <Skeleton className="h-4 w-full pt-2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-32 pt-2" />
                </div>
                <div className="lg:col-span-7">
                    <Skeleton className="h-64 sm:h-80 w-full rounded-none" />
                </div>
            </div>

            {/* 3-Column Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-card overflow-hidden shadow-xs flex flex-col justify-between">
                        <Skeleton className="aspect-[16/9] w-full rounded-none" />
                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-4/5" />
                                <Skeleton className="h-3.5 w-full pt-1" />
                            </div>
                            <div className="pt-3 border-t border-line/50 flex items-center justify-between">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* 4. Gallery Directory Skeleton */
function GallerySkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="mb-8 space-y-3">
                <Skeleton className="h-3 w-44" />
                <Skeleton className="h-9 sm:h-11 w-88 max-w-full" />
                <Skeleton className="h-4 w-full max-w-xl" />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-line/60 overflow-x-auto">
                {[90, 130, 110, 120, 100].map((w, idx) => (
                    <Skeleton key={idx} className="h-8 rounded-full shrink-0" style={{ width: `${w}px` }} />
                ))}
            </div>

            {/* Photo Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-card overflow-hidden shadow-xs">
                        <Skeleton className="aspect-[4/3] w-full rounded-none" />
                        <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-14 rounded-full" />
                            </div>
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-3.5 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* 5. Staff Directory Skeleton */
function StaffSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="mb-8 space-y-3">
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-9 sm:h-11 w-80 max-w-full" />
                <Skeleton className="h-4 w-full max-w-xl" />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-line/60">
                {[120, 140, 130, 160].map((w, idx) => (
                    <Skeleton key={idx} className="h-9 rounded shrink-0" style={{ width: `${w}px` }} />
                ))}
            </div>

            {/* 4-Column Staff Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-card p-6 text-center space-y-4 shadow-xs">
                        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4 mx-auto" />
                            <Skeleton className="h-3 w-1/2 mx-auto" />
                            <Skeleton className="h-3 w-2/3 mx-auto" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* 6. Academic Agenda Skeleton */
function AgendaSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            {/* Header */}
            <div className="mb-8 space-y-3">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-9 sm:h-11 w-72 max-w-full" />
                <Skeleton className="h-4 w-full max-w-lg" />
            </div>

            {/* Month/Status Filter */}
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-line/60">
                <Skeleton className="h-9 w-32 rounded" />
                <Skeleton className="h-9 w-40 rounded" />
            </div>

            {/* Stack of Agenda Items */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-5 rounded-lg border border-line bg-surface-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Date Block */}
                        <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                        {/* Event Details */}
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-20 rounded-full" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-3.5 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* 7. Extracurricular Directory Skeleton */
function ExtracurricularSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            <div className="mb-8 space-y-3">
                <Skeleton className="h-3 w-52" />
                <Skeleton className="h-9 sm:h-11 w-80 max-w-full" />
                <Skeleton className="h-4 w-full max-w-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-card p-6 space-y-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-5/6" />
                        <div className="pt-3 border-t border-line/50 flex items-center justify-between">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* 8. Achievement Directory Skeleton */
function AchievementSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150">
            <div className="mb-8 space-y-3">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-9 sm:h-11 w-80 max-w-full" />
                <Skeleton className="h-4 w-full max-w-xl" />
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 rounded-lg border border-line bg-surface-card text-center space-y-1.5">
                        <Skeleton className="h-7 w-12 mx-auto" />
                        <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-card p-6 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24 rounded-full" />
                            <Skeleton className="h-3 w-14" />
                        </div>
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                        <Skeleton className="h-3.5 w-full pt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* 9. PPDB Info Skeleton */
function PpdbSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150 space-y-8">
            {/* PPDB Hero Banner */}
            <div className="p-8 sm:p-12 rounded-xl border border-line bg-surface-card text-center space-y-4 shadow-xs">
                <Skeleton className="h-4 w-32 mx-auto rounded-full" />
                <Skeleton className="h-10 sm:h-12 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-2/3 mx-auto" />
                <div className="pt-4 flex justify-center gap-3">
                    <Skeleton className="h-10 w-44 rounded" />
                    <Skeleton className="h-10 w-36 rounded" />
                </div>
            </div>

            {/* Timeline Steps */}
            <div className="p-6 rounded-xl border border-line bg-surface-card space-y-4">
                <Skeleton className="h-5 w-44" />
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-lg border border-line/60 bg-canvas-subtle/30 space-y-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* 10. Post Detail (Article / Visi Misi / Sejarah) Skeleton */
function PostDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-4" />
                <Skeleton className="h-3 w-32" />
            </div>

            {/* Title & Metadata */}
            <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-9 sm:h-12 w-full" />
                <Skeleton className="h-9 sm:h-12 w-3/4" />
                <div className="flex items-center gap-4 pt-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>

            {/* Hero Image */}
            <Skeleton className="aspect-[16/9] w-full rounded-lg" />

            {/* Content Paragraphs */}
            <div className="p-6 sm:p-10 rounded-xl border border-line bg-surface-card space-y-4 shadow-xs">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5 pt-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
        </div>
    );
}

/* 11. Contact Page Skeleton */
function ContactSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150 space-y-8">
            <div className="space-y-3">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-9 sm:h-11 w-72" />
                <Skeleton className="h-4 w-full max-w-lg" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 rounded-lg border border-line bg-surface-card space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3.5 w-full" />
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-xl border border-line bg-surface-card space-y-4 shadow-xs">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3.5 w-full" />
                    <div className="space-y-3 pt-2">
                        <Skeleton className="h-28 w-full rounded-md" />
                        <Skeleton className="h-10 w-40 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* 12. Generic Page Skeleton */
function GenericSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-150 space-y-6">
            <div className="space-y-3">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-8 sm:h-10 w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border border-line bg-surface-card p-6 space-y-3 shadow-xs">
                        <Skeleton className="h-40 w-full rounded" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}
