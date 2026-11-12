import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    ArrowDownTrayIcon,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

type Props = {
    settings: Record<string, any>;
    primaryMenu: any;
};

export default function PpdbInfo({ settings, primaryMenu }: Props) {
    const schoolName = settings?.school_name || 'SMP Negeri 1 Nusantara';
    const ppdbIsOpen = settings?.ppdb_is_open ?? true;
    const ppdbYear = settings?.ppdb_year || '2026/2027';
    const brochureUrl = settings?.ppdb_brochure_url || '#';
    const portalUrl = settings?.ppdb_portal_url || 'https://siap-ppdb.kemdikbud.go.id';

    const tracks = [
        {
            title: '1. Jalur Zonasi (Kuota 50%)',
            desc: 'Diperuntukkan bagi calon peserta didik baru yang berdomisili di dalam wilayah zonasi yang telah ditetapkan oleh Dinas Pendidikan.',
            reqs: ['Kartu Keluarga (KK) minimal 1 tahun', 'Akta Kelahiran', 'Ijazah / Surat Keterangan Lulus'],
        },
        {
            title: '2. Jalur Afirmasi (Kuota 15%)',
            desc: 'Dikhususkan bagi calon peserta didik yang berasal dari keluarga ekonomi tidak mampu serta penyandang disabilitas.',
            reqs: ['KIP / KIS / KKS / Bukti PKH Aktif', 'Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)'],
        },
        {
            title: '3. Jalur Prestasi (Kuota 30%)',
            desc: 'Diberikan kepada calon peserta didik dengan prestasi akademik maupun non-akademik di tingkat kabupaten, provinsi, atau nasional.',
            reqs: ['Rapor 5 semester terakhir', 'Sertifikat kejuaraan resmi kedinasan'],
        },
        {
            title: '4. Jalur Perpindahan Tugas Orang Tua (Kuota 5%)',
            desc: 'Bagi calon peserta didik yang berpindah domisili mengikuti penugasan orang tua/wali dari instansi pemerintah, BUMN, atau swasta.',
            reqs: ['Surat Keputusan (SK) mutasi kerja orang tua', 'Surat domisili penugasan baru'],
        },
    ];

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`Informasi PPDB Tahun Ajaran ${ppdbYear} - ${schoolName}`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Header Banner */}
                <div className="bg-white rounded border border-line p-6 sm:p-10 mb-8 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6 mb-6">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                                Portal Penerimaan Siswa Baru
                            </span>
                            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                                PPDB Tahun Ajaran {ppdbYear}
                            </h1>
                            <p className="text-ink-secondary text-sm mt-1">
                                {schoolName}
                            </p>
                        </div>

                        <div>
                            {ppdbIsOpen ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-status-published-bg text-status-published font-bold text-xs border border-status-published/20">
                                    <span className="w-2.5 h-2.5 rounded-full bg-status-published animate-pulse" />
                                    Pendaftaran Sedang Dibuka
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-status-urgent-bg text-status-urgent font-bold text-xs border border-status-urgent/20">
                                    Pendaftaran Ditutup
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <a
                            href={portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-terracotta hover:bg-terracotta-hover text-white text-sm font-bold transition-colors"
                        >
                            <span>Daftar Melalui Portal Resmi</span>
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </a>

                        <a
                            href={brochureUrl}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded border border-line text-ink hover:bg-canvas-subtle text-sm font-semibold transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4 text-ink-muted" />
                            <span>Unduh Brosur Petunjuk Teknis (PDF)</span>
                        </a>
                    </div>
                </div>

                {/* 4 Jalur Pendaftaran */}
                <div className="mb-10">
                    <h2 className="font-serif text-2xl font-bold text-ink mb-2">
                        Pilihan Jalur Masuk PPDB
                    </h2>
                    <p className="text-sm text-ink-secondary mb-6">
                        Pilihlah salah satu jalur yang sesuai dengan kondisi domisili atau prestasi calon peserta didik.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tracks.map((track, i) => (
                            <div
                                key={i}
                                className="bg-white rounded border border-line p-6 flex flex-col justify-between shadow-xs"
                            >
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-ink">
                                        {track.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-ink-secondary mt-2 leading-relaxed">
                                        {track.desc}
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-line/60">
                                    <span className="text-xs font-semibold text-prussian block mb-2">
                                        Persyaratan Dokumen:
                                    </span>
                                    <ul className="space-y-1.5 text-xs text-ink-muted">
                                        {track.reqs.map((req, rIdx) => (
                                            <li key={rIdx} className="flex items-center gap-2">
                                                <CheckCircleIcon className="w-4 h-4 text-status-published shrink-0" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Kontak Bantuan PPDB */}
                <div className="bg-canvas-subtle rounded border border-line p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-sm text-ink">
                            Pusat Layanan & Bantuan Teknis PPDB
                        </h4>
                        <p className="text-xs text-ink-secondary mt-0.5">
                            Mengalami kendala saat pengunggahan berkas? Tim Panitia PPDB siap membantu di ruang Tata Usaha.
                        </p>
                    </div>
                    <div className="text-xs font-mono font-semibold text-prussian bg-white px-3 py-1.5 rounded border border-line shrink-0">
                        WhatsApp Panitia: {settings?.whatsapp || '0812-3456-7890'}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

