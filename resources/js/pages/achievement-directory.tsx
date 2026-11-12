import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { ArrowLeftIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';

type Achievement = {
    id: number;
    title: string;
    student_name: string;
    competition_name: string;
    level: 'kabupaten' | 'provinsi' | 'nasional' | 'internasional';
    rank: string;
    year: number;
    description: string | null;
};

type Props = {
    settings: Record<string, any>;
    primaryMenu: any;
    achievements: Achievement[];
};

export default function AchievementDirectory({
    settings,
    primaryMenu,
    achievements = [],
}: Props) {
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const schoolName = settings?.school_name || 'SMP Negeri 1 Nusantara';

    const filtered =
        selectedLevel === 'all'
            ? achievements
            : achievements.filter((a) => a.level === selectedLevel);

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`Rekap Prestasi Siswa - ${schoolName}`} />

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
                        Arsip Prestasi & Penghargaan
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                        Rekapitulasi Prestasi Siswa
                    </h1>
                    <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                        Dokumentasi pencapaian gemilang putra-putri terbaik sekolah dalam berbagai ajang
                        kejuaraan tingkat kabupaten, provinsi, nasional, dan internasional.
                    </p>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {[
                            { key: 'all', label: 'Semua Tingkat' },
                            { key: 'internasional', label: 'Internasional' },
                            { key: 'nasional', label: 'Nasional' },
                            { key: 'provinsi', label: 'Provinsi' },
                            { key: 'kabupaten', label: 'Kabupaten/Kota' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedLevel(tab.key)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded border transition-colors ${
                                    selectedLevel === tab.key
                                        ? 'bg-prussian text-white border-prussian'
                                        : 'bg-white text-ink border-line hover:bg-canvas-subtle'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded border border-line p-6 flex items-start gap-4 shadow-xs"
                        >
                            <div className="w-14 h-14 rounded bg-canvas-subtle border border-line flex flex-col items-center justify-center shrink-0">
                                <TrophyIcon className="w-6 h-6 text-terracotta" />
                                <span className="text-[11px] font-bold font-mono text-ink mt-0.5">
                                    {item.year}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-prussian-light text-prussian">
                                        Tingkat {item.level}
                                    </span>
                                    <span className="text-xs font-bold text-terracotta">
                                        {item.rank}
                                    </span>
                                </div>

                                <h3 className="font-serif font-bold text-lg text-ink leading-snug">
                                    {item.title}
                                </h3>

                                <div className="mt-2 text-xs text-ink-secondary space-y-0.5">
                                    <div>
                                        Nama Peserta / Tim: <strong className="text-ink">{item.student_name}</strong>
                                    </div>
                                    <div>Ajang: {item.competition_name}</div>
                                </div>

                                {item.description && (
                                    <p className="mt-2 text-xs text-ink-muted leading-relaxed italic border-t border-line/50 pt-2">
                                        "{item.description}"
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}

