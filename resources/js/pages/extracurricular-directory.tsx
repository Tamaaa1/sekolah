import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    ClockIcon,
    SparklesIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

type Extracurricular = {
    id: number;
    name: string;
    slug: string;
    leader_name: string | null;
    schedule_day: string | null;
    schedule_time: string | null;
    description: string | null;
    cover_image: string | null;
};

type Props = {
    settings: Record<string, any>;
    primaryMenu: any;
    extracurriculars: Extracurricular[];
};

export default function ExtracurricularDirectory({
    settings,
    primaryMenu,
    extracurriculars = [],
}: Props) {
    const schoolName = settings?.school_name || 'SMP Negeri 1 Nusantara';

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`Kegiatan Ekstrakurikuler Siswa - ${schoolName}`} />

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
                        Pengembangan Minat & Bakat
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                        Kegiatan Ekstrakurikuler Siswa
                    </h1>
                    <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                        Wadah aktualisasi diri, pembentukan karakter kemandirian, kepemimpinan,
                        dan keterampilan non-akademik di luar jam belajar formal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {extracurriculars.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded border border-line p-6 flex flex-col justify-between shadow-xs hover:border-line-strong transition-all"
                        >
                            <div>
                                <div className="w-12 h-12 rounded bg-prussian-light text-prussian flex items-center justify-center mb-4 border border-line">
                                    <SparklesIcon className="w-6 h-6 text-prussian" />
                                </div>

                                <h3 className="font-serif font-bold text-xl text-ink leading-tight">
                                    {item.name}
                                </h3>

                                <p className="mt-3 text-ink-secondary text-sm leading-relaxed">
                                    {item.description ||
                                        'Kegiatan ekstrakurikuler unggulan untuk mengasah potensi dan sportivitas siswa.'}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-line space-y-2 text-xs text-ink-secondary">
                                {item.leader_name && (
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-prussian shrink-0" />
                                        <span>Pembina: <strong className="text-ink">{item.leader_name}</strong></span>
                                    </div>
                                )}
                                {(item.schedule_day || item.schedule_time) && (
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4 text-terracotta shrink-0" />
                                        <span>
                                            Jadwal: {item.schedule_day} {item.schedule_time ? `(${item.schedule_time})` : ''}
                                        </span>
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

