import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { ArrowLeftIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

type Agenda = {
    id: number;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    location: string | null;
};

type Props = {
    settings: Record<string, any>;
    primaryMenu: any;
    agendas: Agenda[];
};

export default function AcademicAgendaPage({
    settings,
    primaryMenu,
    agendas = [],
}: Props) {
    const schoolName = settings?.school_name || 'SMP Negeri 1 Nusantara';

    const formatDateRange = (startStr: string, endStr: string | null) => {
        const start = new Date(startStr);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

        if (!endStr || startStr === endStr) {
            return start.toLocaleDateString('id-ID', options);
        }

        const end = new Date(endStr);
        return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('id-ID', options)}`;
    };

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`Kalender & Agenda Akademik - ${schoolName}`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
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
                        Kalender Akademik
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                        Jadwal & Agenda Kegiatan Sekolah
                    </h1>
                    <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                        Informasi lengkap mengenai jadwal pelaksanaan asesmen, rapat orang tua murid,
                        kegiatan tengah semester, dan hari libur resmi.
                    </p>
                </div>

                <div className="space-y-4">
                    {agendas.map((item) => {
                        const start = new Date(item.start_date);
                        const day = start.getDate();
                        const month = start.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
                        const year = start.getFullYear();

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded border border-line p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xs hover:border-line-strong transition-all"
                            >
                                <div className="w-16 h-16 rounded bg-prussian text-white flex flex-col items-center justify-center shrink-0 font-mono leading-none">
                                    <span className="text-2xl font-bold">{day}</span>
                                    <span className="text-xs uppercase tracking-wider mt-1 text-canvas-subtle">
                                        {month}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-xs text-ink-muted mb-1 font-mono">
                                        <CalendarDaysIcon className="w-4 h-4 text-terracotta" />
                                        <span>{formatDateRange(item.start_date, item.end_date)}</span>
                                    </div>

                                    <h3 className="font-serif font-bold text-lg text-ink leading-snug">
                                        {item.title}
                                    </h3>

                                    {item.description && (
                                        <p className="mt-1 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}

                                    {item.location && (
                                        <div className="mt-2 text-xs text-ink-muted flex items-center gap-1">
                                            <MapPinIcon className="w-3.5 h-3.5 text-prussian" />
                                            <span>Tempat: {item.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PublicLayout>
    );
}
