import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    ArrowDownTrayIcon,
    ArrowLeftIcon,
    ArrowTopRightOnSquareIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentCheckIcon,
    DocumentTextIcon,
    InformationCircleIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

type Props = {
    settings: Record<string, any>;
    primaryMenu: any;
};

export default function PpdbInfo({ settings, primaryMenu }: Props) {
    const schoolName = settings?.school_name || 'SMP Negeri 5 Sambas';
    const ppdbIsOpen =
        settings?.ppdb_is_open === true ||
        settings?.ppdb_is_open === 1 ||
        settings?.ppdb_is_open === '1';
    const ppdbYear = settings?.ppdb_year || '2026/2027';
    const brochureUrl = settings?.ppdb_brochure_url || '';
    const portalUrl =
        settings?.ppdb_portal_url || 'https://siap-ppdb.kemdikbud.go.id';
    const rawWhatsapp = settings?.whatsapp || '081234567890';
    const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
    const waNumber = cleanWhatsapp.startsWith('0')
        ? '62' + cleanWhatsapp.slice(1)
        : cleanWhatsapp;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Halo Panitia PPDB ${schoolName}, saya ingin bertanya mengenai informasi PPDB Tahun Ajaran ${ppdbYear}.`
    )}`;

    const tracks = [
        {
            title: '1. Jalur Zonasi (Kuota 50%)',
            desc: 'Diperuntukkan bagi calon peserta didik baru yang berdomisili di dalam wilayah zonasi yang telah ditetapkan oleh Dinas Pendidikan.',
            reqs: [
                'Kartu Keluarga (KK) minimal 1 tahun',
                'Akta Kelahiran asli & fotokopi',
                'Ijazah / Surat Keterangan Lulus (SKL)',
            ],
        },
        {
            title: '2. Jalur Afirmasi (Kuota 15%)',
            desc: 'Dikhususkan bagi calon peserta didik yang berasal dari keluarga ekonomi tidak mampu serta penyandang disabilitas.',
            reqs: [
                'KIP / KIS / KKS / Bukti PKH Aktif',
                'Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)',
                'Kartu Keluarga & Akta Kelahiran',
            ],
        },
        {
            title: '3. Jalur Prestasi (Kuota 30%)',
            desc: 'Diberikan kepada calon peserta didik dengan prestasi akademik maupun non-akademik di tingkat kabupaten, provinsi, atau nasional.',
            reqs: [
                'Rapor 5 semester terakhir SD/MI',
                'Sertifikat / Piagam kejuaraan resmi kedinasan',
                'Surat keterangan peringkat kelas (jika ada)',
            ],
        },
        {
            title: '4. Jalur Perpindahan Tugas Orang Tua (Kuota 5%)',
            desc: 'Bagi calon peserta didik yang berpindah domisili mengikuti penugasan resmi orang tua/wali dari instansi pemerintah, TNI/Polri, BUMN, atau swasta.',
            reqs: [
                'Surat Keputusan (SK) mutasi kerja orang tua/wali',
                'Surat keterangan domisili penugasan baru',
                'Kartu Keluarga & Akta Kelahiran',
            ],
        },
    ];

    const prepChecklist = [
        {
            icon: DocumentCheckIcon,
            title: 'Kartu Keluarga & Akta Lahir',
            desc: 'Pastikan NIK calon siswa aktif dan domisili KK sesuai ketentuan zonasi.',
        },
        {
            icon: DocumentTextIcon,
            title: 'Ijazah SD / Surat Ket. Lulus',
            desc: 'Siapkan dokumen kelulusan atau surat keterangan nilai rapor 5 semester.',
        },
        {
            icon: SparklesIcon,
            title: 'Sertifikat & Piagam Prestasi',
            desc: 'Kumpulkan piagam kejuaraan akademik, sains, seni, atau olahraga berjenjang.',
        },
        {
            icon: ClockIcon,
            title: 'Pas Foto Formal Terbaru',
            desc: 'Pas foto ukuran 3x4 berwarna dengan seragam sekolah asal latar merah/biru.',
        },
    ];

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`Informasi PPDB Tahun Ajaran ${ppdbYear} - ${schoolName}`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-10">
                {/* STATE 1: PENDAFTARAN DITUTUP / BELUM DIBUKA */}
                {!ppdbIsOpen ? (
                    <div className="space-y-8">
                        {/* Cheerful Colorful Hero Card */}
                        <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-stone-50 rounded-2xl border border-amber-200/80 p-5 sm:px-8 sm:pt-6 sm:pb-8 shadow-sm text-center">
                            {/* Decorative background blobs */}
                            <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute -top-12 -right-12 w-52 h-52 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-200/25 rounded-full blur-2xl pointer-events-none" />

                            {/* Cute Colorful Illustration SVG */}
                            <div className="relative mx-auto mb-3 max-w-md w-full">
                                <svg
                                    viewBox="0 0 460 260"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full h-auto drop-shadow-sm select-none"
                                >
                                    <defs>
                                        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#E0F2FE" />
                                            <stop offset="100%" stopColor="#F0FDF4" />
                                        </linearGradient>
                                        <linearGradient id="backpackGrad" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#FB7185" />
                                            <stop offset="100%" stopColor="#E11D48" />
                                        </linearGradient>
                                        <linearGradient id="pencilGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#FCD34D" />
                                            <stop offset="100%" stopColor="#F59E0B" />
                                        </linearGradient>
                                        <linearGradient id="book1Grad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#38BDF8" />
                                            <stop offset="100%" stopColor="#0284C7" />
                                        </linearGradient>
                                        <linearGradient id="book2Grad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#34D399" />
                                            <stop offset="100%" stopColor="#059669" />
                                        </linearGradient>
                                        <linearGradient id="book3Grad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#F472B6" />
                                            <stop offset="100%" stopColor="#DB2777" />
                                        </linearGradient>
                                        <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#EA580C" />
                                            <stop offset="100%" stopColor="#C2410C" />
                                        </linearGradient>
                                    </defs>

                                    {/* Soft Ground Shadow & Cloud Pill */}
                                    <ellipse cx="230" cy="225" rx="190" ry="22" fill="#F1F5F9" />
                                    <ellipse cx="230" cy="222" rx="150" ry="14" fill="#E2E8F0" opacity="0.6" />

                                    {/* Playful Floating Confetti Dots & Stars */}
                                    <circle cx="50" cy="70" r="6" fill="#F59E0B" opacity="0.8" />
                                    <circle cx="85" cy="40" r="4" fill="#10B981" opacity="0.8" />
                                    <circle cx="395" cy="55" r="5" fill="#EC4899" opacity="0.8" />
                                    <circle cx="420" cy="95" r="7" fill="#8B5CF6" opacity="0.8" />
                                    <circle cx="370" cy="30" r="3.5" fill="#3B82F6" opacity="0.8" />
                                    <circle cx="70" cy="120" r="3.5" fill="#F43F5E" opacity="0.8" />

                                    {/* Twinkling Star Left */}
                                    <path
                                        d="M 60 45 Q 60 52 53 52 Q 60 52 60 59 Q 60 52 67 52 Q 60 52 60 45 Z"
                                        fill="#F59E0B"
                                    />
                                    {/* Twinkling Star Right */}
                                    <path
                                        d="M 390 85 Q 390 92 383 92 Q 390 92 390 99 Q 390 92 397 92 Q 390 92 390 85 Z"
                                        fill="#FBBF24"
                                    />

                                    {/* Looping Paper Airplane Trajectory */}
                                    <path
                                        d="M 75 160 C 50 110, 110 50, 180 65 C 220 75, 230 115, 205 130 C 180 145, 150 120, 180 95 C 230 55, 310 40, 365 70"
                                        fill="none"
                                        stroke="#CBD5E1"
                                        strokeWidth="2.5"
                                        strokeDasharray="6 6"
                                        strokeLinecap="round"
                                    />
                                    {/* Cute Paper Airplane */}
                                    <g transform="translate(365, 66) rotate(15)">
                                        <polygon points="0,0 26,-8 6,10" fill="#38BDF8" />
                                        <polygon points="0,0 26,-8 14,-2" fill="#BAE6FD" />
                                        <polygon points="6,10 26,-8 14,-2" fill="#0284C7" />
                                    </g>

                                    {/* SCHOOL BUILDING (Left-Center Background) */}
                                    <g id="school-building">
                                        {/* Main Wall */}
                                        <rect
                                            x="95"
                                            y="105"
                                            width="120"
                                            height="110"
                                            rx="6"
                                            fill="#FFFFFF"
                                            stroke="#0F2C59"
                                            strokeWidth="3.5"
                                        />
                                        {/* Roof Gable */}
                                        <polygon
                                            points="85,108 155,55 225,108"
                                            fill="url(#roofGrad)"
                                            stroke="#0F2C59"
                                            strokeWidth="3.5"
                                            strokeLinejoin="round"
                                        />
                                        {/* Clock Tower / Bell Attic */}
                                        <rect
                                            x="140"
                                            y="30"
                                            width="30"
                                            height="26"
                                            rx="4"
                                            fill="#F8FAFC"
                                            stroke="#0F2C59"
                                            strokeWidth="3"
                                        />
                                        <polygon
                                            points="135,32 155,14 175,32"
                                            fill="#0F2C59"
                                            stroke="#0F2C59"
                                            strokeWidth="2"
                                        />
                                        {/* Waving Flag */}
                                        <line x1="155" y1="14" x2="155" y2="4" stroke="#0F2C59" strokeWidth="2" />
                                        <path
                                            d="M 155 4 Q 163 2 168 6 Q 163 10 155 9 Z"
                                            fill="#EF4444"
                                            stroke="#EF4444"
                                        />

                                        {/* Clock on Tower */}
                                        <circle cx="155" cy="43" r="8" fill="#FEF08A" stroke="#0F2C59" strokeWidth="2" />
                                        <line x1="155" y1="43" x2="155" y2="39" stroke="#0F2C59" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="155" y1="43" x2="159" y2="43" stroke="#0F2C59" strokeWidth="2" strokeLinecap="round" />

                                        {/* Windows with Blue Tint */}
                                        <rect x="110" y="125" width="22" height="24" rx="3" fill="#BAE6FD" stroke="#0F2C59" strokeWidth="2.5" />
                                        <line x1="121" y1="125" x2="121" y2="149" stroke="#0F2C59" strokeWidth="1.5" />
                                        <line x1="110" y1="137" x2="132" y2="137" stroke="#0F2C59" strokeWidth="1.5" />

                                        <rect x="178" y="125" width="22" height="24" rx="3" fill="#BAE6FD" stroke="#0F2C59" strokeWidth="2.5" />
                                        <line x1="189" y1="125" x2="189" y2="149" stroke="#0F2C59" strokeWidth="1.5" />
                                        <line x1="178" y1="137" x2="200" y2="137" stroke="#0F2C59" strokeWidth="1.5" />

                                        {/* Arched School Door */}
                                        <path
                                            d="M 143 215 L 143 175 Q 155 163 167 175 L 167 215 Z"
                                            fill="#0F2C59"
                                        />
                                        <circle cx="162" cy="195" r="2" fill="#FEF08A" />

                                        {/* School Steps */}
                                        <rect x="135" y="215" width="40" height="4" rx="1.5" fill="#94A3B8" />
                                    </g>

                                    {/* COLORFUL STACK OF BOOKS (Right-Center Foreground) */}
                                    <g id="book-stack">
                                        {/* Bottom Book (Cyan) */}
                                        <rect
                                            x="270"
                                            y="196"
                                            width="130"
                                            height="18"
                                            rx="4"
                                            fill="url(#book1Grad)"
                                            stroke="#0F2C59"
                                            strokeWidth="3"
                                        />
                                        <rect x="278" y="200" width="118" height="10" fill="#FFFFFF" rx="2" />
                                        {/* Ribbon bookmark */}
                                        <path d="M 370 200 L 370 220 L 375 215 L 380 220 L 380 200 Z" fill="#F59E0B" />

                                        {/* Middle Book (Emerald) */}
                                        <g transform="translate(280, 178) rotate(-3)">
                                            <rect
                                                x="0"
                                                y="0"
                                                width="116"
                                                height="18"
                                                rx="4"
                                                fill="url(#book2Grad)"
                                                stroke="#0F2C59"
                                                strokeWidth="3"
                                            />
                                            <rect x="8" y="4" width="104" height="10" fill="#FFFFFF" rx="2" />
                                        </g>

                                        {/* Top Book (Pink/Rose) */}
                                        <g transform="translate(290, 160) rotate(4)">
                                            <rect
                                                x="0"
                                                y="0"
                                                width="100"
                                                height="17"
                                                rx="4"
                                                fill="url(#book3Grad)"
                                                stroke="#0F2C59"
                                                strokeWidth="3"
                                            />
                                            <rect x="8" y="3.5" width="88" height="10" fill="#FFFFFF" rx="2" />
                                        </g>
                                    </g>

                                    {/* CUTE SMILING BACKPACK MASCOT */}
                                    <g id="backpack-mascot" transform="translate(225, 95)">
                                        {/* Backpack Hanging Loop */}
                                        <path
                                            d="M 35 15 C 35 -2, 60 -2, 60 15"
                                            fill="none"
                                            stroke="#BE123C"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 35 15 C 35 -2, 60 -2, 60 15"
                                            fill="none"
                                            stroke="#0F2C59"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />

                                        {/* Side Pocket Left */}
                                        <rect
                                            x="-8"
                                            y="45"
                                            width="14"
                                            height="40"
                                            rx="6"
                                            fill="#E11D48"
                                            stroke="#0F2C59"
                                            strokeWidth="3"
                                        />

                                        {/* Side Pocket Right (Holds a cute ruler) */}
                                        <g transform="translate(86, 32) rotate(10)">
                                            <rect
                                                x="0"
                                                y="0"
                                                width="12"
                                                height="36"
                                                rx="2"
                                                fill="#FEF08A"
                                                stroke="#0F2C59"
                                                strokeWidth="2"
                                            />
                                            <line x1="2" y1="8" x2="8" y2="8" stroke="#0F2C59" strokeWidth="1.5" />
                                            <line x1="2" y1="14" x2="6" y2="14" stroke="#0F2C59" strokeWidth="1" />
                                            <line x1="2" y1="20" x2="8" y2="20" stroke="#0F2C59" strokeWidth="1.5" />
                                        </g>
                                        <rect
                                            x="86"
                                            y="45"
                                            width="14"
                                            height="40"
                                            rx="6"
                                            fill="#E11D48"
                                            stroke="#0F2C59"
                                            strokeWidth="3"
                                        />

                                        {/* Main Backpack Body */}
                                        <rect
                                            x="0"
                                            y="10"
                                            width="92"
                                            height="105"
                                            rx="26"
                                            fill="url(#backpackGrad)"
                                            stroke="#0F2C59"
                                            strokeWidth="3.5"
                                        />

                                        {/* Top Zipper Curved Flap */}
                                        <path
                                            d="M 12 40 Q 46 50 80 40"
                                            fill="none"
                                            stroke="#0F2C59"
                                            strokeWidth="2.5"
                                        />

                                        {/* Front Pouch Pocket */}
                                        <rect
                                            x="14"
                                            y="50"
                                            width="64"
                                            height="50"
                                            rx="16"
                                            fill="#FFE4E6"
                                            stroke="#0F2C59"
                                            strokeWidth="3"
                                        />

                                        {/* CUTE FACE ON FRONT POUCH */}
                                        {/* Left Eye */}
                                        <circle cx="34" cy="70" r="5" fill="#0F2C59" />
                                        <circle cx="36" cy="68" r="1.8" fill="#FFFFFF" />
                                        {/* Right Eye */}
                                        <circle cx="58" cy="70" r="5" fill="#0F2C59" />
                                        <circle cx="60" cy="68" r="1.8" fill="#FFFFFF" />

                                        {/* Rosy Cheeks */}
                                        <ellipse cx="26" cy="76" rx="5" ry="3" fill="#FDA4AF" />
                                        <ellipse cx="66" cy="76" rx="5" ry="3" fill="#FDA4AF" />

                                        {/* Cheerful Smile */}
                                        <path
                                            d="M 41 74 Q 46 82 51 74"
                                            fill="#F43F5E"
                                            stroke="#0F2C59"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />

                                        {/* Little Keyring / Badge Dangling */}
                                        <circle cx="74" cy="94" r="5" fill="#FBBF24" stroke="#0F2C59" strokeWidth="1.5" />
                                        <path d="M 74 92 L 74 96" stroke="#0F2C59" strokeWidth="1" />
                                    </g>

                                    {/* CHEERFUL WAVING PENCIL CHARACTER (Left Foreground) */}
                                    <g id="pencil-character" transform="translate(68, 120) rotate(-14)">
                                        {/* Pink Eraser */}
                                        <rect
                                            x="6"
                                            y="0"
                                            width="20"
                                            height="14"
                                            rx="4"
                                            fill="#FB7185"
                                            stroke="#0F2C59"
                                            strokeWidth="2.5"
                                        />
                                        {/* Metal Ferrule Band */}
                                        <rect
                                            x="6"
                                            y="12"
                                            width="20"
                                            height="7"
                                            fill="#CBD5E1"
                                            stroke="#0F2C59"
                                            strokeWidth="2"
                                        />

                                        {/* Pencil Body */}
                                        <rect
                                            x="6"
                                            y="19"
                                            width="20"
                                            height="55"
                                            fill="url(#pencilGrad)"
                                            stroke="#0F2C59"
                                            strokeWidth="2.5"
                                        />
                                        {/* Vertical stripes on pencil */}
                                        <line x1="12" y1="19" x2="12" y2="74" stroke="#F59E0B" strokeWidth="1.5" />
                                        <line x1="20" y1="19" x2="20" y2="74" stroke="#D97706" strokeWidth="1.5" />

                                        {/* Pencil Sharpened Cone */}
                                        <polygon
                                            points="6,74 26,74 16,92"
                                            fill="#FED7AA"
                                            stroke="#0F2C59"
                                            strokeWidth="2.5"
                                            strokeLinejoin="round"
                                        />
                                        {/* Graphite Tip */}
                                        <polygon points="12,85 20,85 16,92" fill="#0F2C59" />

                                        {/* Pencil Face */}
                                        <circle cx="12" cy="38" r="2.2" fill="#0F2C59" />
                                        <circle cx="20" cy="38" r="2.2" fill="#0F2C59" />
                                        <path
                                            d="M 14 44 Q 16 48 18 44"
                                            fill="none"
                                            stroke="#0F2C59"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <ellipse cx="9" cy="42" rx="2" ry="1.2" fill="#FDA4AF" />
                                        <ellipse cx="23" cy="42" rx="2" ry="1.2" fill="#FDA4AF" />

                                        {/* Cute Waving Arm */}
                                        <path
                                            d="M 26 36 Q 34 30 38 24"
                                            fill="none"
                                            stroke="#0F2C59"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <circle cx="38" cy="24" r="2" fill="#0F2C59" />
                                    </g>
                                </svg>
                            </div>

                            {/* Main Apology & Welcome Heading */}
                            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink tracking-tight max-w-2xl mx-auto">
                                Maaf, Pendaftaran PPDB Belum Dibuka untuk Saat Ini
                            </h1>

                            <p className="text-ink-secondary text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
                                Terima kasih atas antusiasme calon siswa dan orang tua untuk menempuh pendidikan di{' '}
                                <strong className="text-ink font-semibold">{schoolName}</strong>. Saat ini portal pendaftaran daring Tahun Ajaran{' '}
                                <span className="text-prussian font-bold">{ppdbYear}</span> sedang dalam masa jeda atau persiapan pembukaan gelombang berikutnya.
                            </p>

                            {/* Quick Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-amber-200/60 mt-6">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line bg-white hover:bg-canvas-subtle text-ink text-sm font-semibold transition-colors shadow-xs"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 text-ink-muted" />
                                    <span>Kembali ke Beranda</span>
                                </Link>

                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-xs"
                                >
                                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                    <span>Tanya Panitia via WhatsApp</span>
                                </a>

                                {brochureUrl && brochureUrl !== '#' && (
                                    <a
                                        href={brochureUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line bg-white hover:bg-canvas-subtle text-ink text-sm font-semibold transition-colors shadow-xs"
                                    >
                                        <ArrowDownTrayIcon className="w-4 h-4 text-ink-muted" />
                                        <span>Unduh Brosur Informasi (PDF)</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Preparatory Checklist ("Sambil Menunggu, Yuk Siapkan Berkas") */}
                        <div className="bg-white rounded-xl border border-line p-6 sm:p-8 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4 mb-6">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                                        Persiapan Calon Peserta Didik
                                    </span>
                                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink mt-0.5">
                                        Dokumen yang Dapat Dipersiapkan dari Sekarang
                                    </h2>
                                </div>
                                <span className="text-xs text-ink-muted self-start sm:self-auto px-2.5 py-1 rounded bg-canvas-subtle border border-line">
                                    Tips Panitia PPDB
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {prepChecklist.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-lg border border-line bg-canvas-subtle/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="w-9 h-9 rounded-md bg-prussian/10 text-prussian flex items-center justify-center mb-3">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-semibold text-sm text-ink">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                            <div className="mt-3 pt-2 border-t border-line/50 text-[11px] font-mono text-terracotta font-semibold">
                                                Langkah #{idx + 1}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Informative 4 Tracks Reference */}
                        <div>
                            <div className="mb-4">
                                <h2 className="font-serif text-2xl font-bold text-ink">
                                    Informasi Pilihan Jalur PPDB
                                </h2>
                                <p className="text-sm text-ink-secondary mt-1">
                                    Sebagai referensi sebelum pendaftaran dibuka resmi, berikut jalur penerimaan yang tersedia beserta syarat kelengkapannya:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tracks.map((track, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl border border-line p-6 flex flex-col justify-between shadow-xs"
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
                                                Persyaratan Berkas:
                                            </span>
                                            <ul className="space-y-1.5 text-xs text-ink-muted">
                                                {track.reqs.map((req, rIdx) => (
                                                    <li key={rIdx} className="flex items-center gap-2">
                                                        <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notice & Secretariat Info */}
                        <div className="bg-canvas-subtle rounded-xl border border-line p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <InformationCircleIcon className="w-6 h-6 text-prussian shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-sm text-ink">
                                        Pemberitahuan Jadwal Resmi
                                    </h4>
                                    <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                                        Tanggal resmi pembukaan dan petunjuk teknis (Juknis) akan diumumkan melalui portal ini dan papan pengumuman sekolah. Simpan halaman ini atau hubungi Tata Usaha jika membutuhkan bantuan khusus.
                                    </p>
                                </div>
                            </div>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-md border border-emerald-300 shrink-0 transition-colors inline-flex items-center gap-1.5"
                            >
                                <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                                <span>WA Panitia: {rawWhatsapp}</span>
                            </a>
                        </div>
                    </div>
                ) : (
                    /* STATE 2: PENDAFTARAN SEDANG DIBUKA */
                    <div>
                        {/* Header Banner */}
                        <div className="bg-white rounded-xl border border-line p-6 sm:p-10 mb-8 shadow-xs">
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
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-status-published-bg text-status-published font-bold text-xs border border-status-published/20">
                                        <span className="w-2.5 h-2.5 rounded-full bg-status-published animate-pulse" />
                                        Pendaftaran Sedang Dibuka
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <a
                                    href={portalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded bg-terracotta hover:bg-terracotta-hover text-white text-sm font-bold transition-colors shadow-xs"
                                >
                                    <span>Daftar Melalui Portal Resmi</span>
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                </a>

                                {brochureUrl && brochureUrl !== '#' && (
                                    <a
                                        href={brochureUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded border border-line text-ink hover:bg-canvas-subtle text-sm font-semibold transition-colors"
                                    >
                                        <ArrowDownTrayIcon className="w-4 h-4 text-ink-muted" />
                                        <span>Unduh Brosur Petunjuk Teknis (PDF)</span>
                                    </a>
                                )}
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
                                        className="bg-white rounded-xl border border-line p-6 flex flex-col justify-between shadow-xs"
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
                        <div className="bg-canvas-subtle rounded-xl border border-line p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-sm text-ink">
                                    Pusat Layanan & Bantuan Teknis PPDB
                                </h4>
                                <p className="text-xs text-ink-secondary mt-0.5">
                                    Mengalami kendala saat pendaftaran daring? Tim Panitia PPDB siap membantu di ruang Tata Usaha.
                                </p>
                            </div>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono font-semibold text-prussian bg-white hover:bg-canvas-subtle px-3.5 py-2 rounded border border-line shrink-0 transition-colors inline-flex items-center gap-1.5"
                            >
                                <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WhatsApp Panitia: {rawWhatsapp}</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
