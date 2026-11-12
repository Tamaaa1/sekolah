import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { AcademicCapIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';

type Staff = {
    id: number;
    name: string;
    nip: string | null;
    position: string;
    subject: string | null;
    category: 'kepsek' | 'guru' | 'tendik';
    photo: string | null;
};

type StaffDirectoryProps = {
    settings: Record<string, any>;
    primaryMenu: any;
    staff: {
        kepsek?: Staff[];
        guru?: Staff[];
        tendik?: Staff[];
    };
};

export default function StaffDirectory({
    settings,
    primaryMenu,
    staff,
}: StaffDirectoryProps) {
    const [selectedTab, setSelectedTab] = useState<'all' | 'kepsek' | 'guru' | 'tendik'>('all');
    const schoolName = settings?.school_name || 'SMP Negeri 1 Nusantara';

    const allStaff: Staff[] = [
        ...(staff?.kepsek || []),
        ...(staff?.guru || []),
        ...(staff?.tendik || []),
    ];

    const filteredStaff =
        selectedTab === 'all'
            ? allStaff
            : staff[selectedTab] || [];

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`Direktori Pendidik & Tenaga Kependidikan - ${schoolName}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-prussian hover:underline"
                    >
                        <ArrowLeftIcon className="w-3.5 h-3.5" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                <div className="border-b border-line pb-6 mb-8">
                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                        Profil Pendidik & Tenaga Kependidikan
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                        Dewan Guru & Tenaga Kependidikan
                    </h1>
                    <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                        Tenaga pengajar profesional dan berdedikasi tinggi yang siap membimbing
                        peserta didik mencapai prestasi terbaiknya.
                    </p>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {[
                            { key: 'all', label: 'Semua GTK' },
                            { key: 'kepsek', label: 'Pimpinan Sekolah' },
                            { key: 'guru', label: 'Dewan Guru' },
                            { key: 'tendik', label: 'Tenaga Kependidikan / TU' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedTab(tab.key as any)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded border transition-colors ${
                                    selectedTab === tab.key
                                        ? 'bg-prussian text-white border-prussian'
                                        : 'bg-white text-ink border-line hover:bg-canvas-subtle'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Staff Cards Grid (3:4 ratio portrait layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredStaff.map((person) => (
                        <div
                            key={person.id}
                            className="bg-white rounded border border-line overflow-hidden shadow-xs flex flex-col justify-between hover:border-line-strong transition-all"
                        >
                            {/* Photo Aspect 3:4 */}
                            <div className="aspect-[3/4] bg-canvas-subtle relative flex items-center justify-center border-b border-line">
                                {person.photo ? (
                                    <img
                                        src={person.photo}
                                        alt={person.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center p-4 text-ink-muted">
                                        <div className="w-16 h-16 rounded-full bg-white border border-line mx-auto flex items-center justify-center mb-2">
                                            <UserIcon className="w-8 h-8 text-prussian" />
                                        </div>
                                        <span className="text-[11px] font-mono uppercase tracking-wider">
                                            Pas Foto 3:4
                                        </span>
                                    </div>
                                )}

                                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/90 text-prussian border border-line">
                                    {person.category === 'kepsek'
                                        ? 'Kepsek'
                                        : person.category === 'guru'
                                        ? 'Guru'
                                        : 'Tendik'}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-serif font-bold text-base text-ink leading-snug">
                                        {person.name}
                                    </h3>
                                    <p className="text-xs text-terracotta font-medium mt-1">
                                        {person.position}
                                    </p>
                                    {person.subject && (
                                        <p className="text-xs text-ink-secondary mt-0.5">
                                            Mata Pelajaran: {person.subject}
                                        </p>
                                    )}
                                </div>

                                {person.nip && (
                                    <div className="mt-3 pt-2 border-t border-line/60 text-[11px] font-mono text-ink-muted">
                                        NIP: {person.nip}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}

