import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    CalendarDaysIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    DocumentPlusIcon,
    MegaphoneIcon,
    NewspaperIcon,
    PhotoIcon,
    PlusIcon,
    TrophyIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

type Post = {
    id: number;
    title: string;
    slug: string;
    type: string;
    status: string;
    created_at: string;
};

type ActivityLog = {
    id: number;
    user_name: string | null;
    action: string;
    module: string;
    description: string;
    created_at: string;
};

type Props = {
    postCount?: number;
    announcementCount?: number;
    staffCount?: number;
    agendaCount?: number;
    extracurricularCount?: number;
    achievementCount?: number;
    mediaCount?: number;
    activityLogCount?: number;
    recentPosts?: Post[];
    recentLogs?: ActivityLog[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

export default function Dashboard({
    postCount = 0,
    announcementCount = 0,
    staffCount = 0,
    agendaCount = 0,
    extracurricularCount = 0,
    achievementCount = 0,
    mediaCount = 0,
    activityLogCount = 0,
    recentPosts = [],
    recentLogs = [],
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CMS Dashboard - Panel Administrasi Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header Welcome Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">
                            Panel Kendali CMS Sekolah
                        </h1>
                        <p className="text-xs text-ink-secondary mt-0.5">
                            Kelola publikasi warta sekolah, dokumen pengumuman, dan informasi akademik.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/posts/create?type=post"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Tulis Berita Baru</span>
                        </Link>
                        <Link
                            href="/admin/posts/create?type=announcement"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-terracotta text-white hover:bg-terracotta-hover text-xs font-semibold transition-colors"
                        >
                            <MegaphoneIcon className="w-4 h-4" />
                            <span>Buat Pengumuman</span>
                        </Link>
                    </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-ink-muted">Warta & Berita</span>
                            <NewspaperIcon className="w-5 h-5 text-prussian" />
                        </div>
                        <div className="font-serif text-3xl font-bold text-ink mt-2">
                            {postCount}
                        </div>
                        <Link
                            href="/admin/posts?type=post"
                            className="text-[11px] font-semibold text-prussian hover:underline mt-2 inline-flex items-center gap-1"
                        >
                            <span>Kelola Berita</span>
                            <ArrowRightIcon className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-ink-muted">Pengumuman Resmi</span>
                            <MegaphoneIcon className="w-5 h-5 text-terracotta" />
                        </div>
                        <div className="font-serif text-3xl font-bold text-ink mt-2">
                            {announcementCount}
                        </div>
                        <Link
                            href="/admin/posts?type=announcement"
                            className="text-[11px] font-semibold text-terracotta hover:underline mt-2 inline-flex items-center gap-1"
                        >
                            <span>Kelola Pengumuman</span>
                            <ArrowRightIcon className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-ink-muted">Guru & Staf TU</span>
                            <AcademicCapIcon className="w-5 h-5 text-prussian" />
                        </div>
                        <div className="font-serif text-3xl font-bold text-ink mt-2">
                            {staffCount}
                        </div>
                        <Link
                            href="/admin/staff"
                            className="text-[11px] font-semibold text-prussian hover:underline mt-2 inline-flex items-center gap-1"
                        >
                            <span>Kelola Direktori</span>
                            <ArrowRightIcon className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-ink-muted">Agenda Terjadwal</span>
                            <CalendarDaysIcon className="w-5 h-5 text-prussian" />
                        </div>
                        <div className="font-serif text-3xl font-bold text-ink mt-2">
                            {agendaCount}
                        </div>
                        <Link
                            href="/admin/agendas"
                            className="text-[11px] font-semibold text-prussian hover:underline mt-2 inline-flex items-center gap-1"
                        >
                            <span>Kelola Agenda</span>
                            <ArrowRightIcon className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                {/* Secondary Quick Stats (Ekskul, Prestasi, Media) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-ink-muted">Ekstrakurikuler Aktif</span>
                            <div className="font-serif text-2xl font-bold text-ink mt-1">
                                {extracurricularCount} Ekskul
                            </div>
                            <Link
                                href="/admin/extracurriculars"
                                className="text-[11px] font-semibold text-prussian hover:underline mt-1 inline-flex items-center gap-1"
                            >
                                <span>Kelola Ekskul</span>
                                <ArrowRightIcon className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-3 bg-canvas-subtle rounded-full text-prussian">
                            <UserGroupIcon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-ink-muted">Rekap Prestasi Siswa</span>
                            <div className="font-serif text-2xl font-bold text-ink mt-1">
                                {achievementCount} Prestasi
                            </div>
                            <Link
                                href="/admin/achievements"
                                className="text-[11px] font-semibold text-prussian hover:underline mt-1 inline-flex items-center gap-1"
                            >
                                <span>Kelola Prestasi</span>
                                <ArrowRightIcon className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-3 bg-canvas-subtle rounded-full text-terracotta">
                            <TrophyIcon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-ink-muted">Berkas & Foto Media</span>
                            <div className="font-serif text-2xl font-bold text-ink mt-1">
                                {mediaCount} Berkas
                            </div>
                            <Link
                                href="/admin/media"
                                className="text-[11px] font-semibold text-prussian hover:underline mt-1 inline-flex items-center gap-1"
                            >
                                <span>Buka Pustaka Media</span>
                                <ArrowRightIcon className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-3 bg-canvas-subtle rounded-full text-prussian">
                            <PhotoIcon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-ink-muted">Log Aktivitas Sistem</span>
                            <div className="font-serif text-2xl font-bold text-ink mt-1">
                                {activityLogCount} Catatan
                            </div>
                            <Link
                                href="/admin/activity-logs"
                                className="text-[11px] font-semibold text-prussian hover:underline mt-1 inline-flex items-center gap-1"
                            >
                                <span>Lihat Riwayat Log</span>
                                <ArrowRightIcon className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-3 bg-canvas-subtle rounded-full text-emerald-700">
                            <ClipboardDocumentListIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Recent Posts Table */}
                <div className="bg-white rounded border border-sidebar-border p-5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-sidebar-border mb-4">
                        <h2 className="font-serif text-lg font-bold text-ink">
                            Publikasi Konten Terakhir
                        </h2>
                        <Link
                            href="/admin/posts"
                            className="text-xs font-semibold text-prussian hover:underline"
                        >
                            Lihat Semua &rarr;
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border text-ink-muted bg-canvas-subtle/50">
                                    <th className="py-2.5 px-3 font-semibold">Judul</th>
                                    <th className="py-2.5 px-3 font-semibold">Tipe</th>
                                    <th className="py-2.5 px-3 font-semibold">Status</th>
                                    <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {recentPosts.length > 0 ? (
                                    recentPosts.map((post) => (
                                        <tr key={post.id} className="hover:bg-canvas-subtle/30">
                                            <td className="py-3 px-3 font-medium text-ink">
                                                {post.title}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-canvas-subtle text-ink">
                                                    {post.type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        post.status === 'published'
                                                            ? 'bg-status-published-bg text-status-published'
                                                            : post.status === 'pending_review'
                                                            ? 'bg-status-pending-bg text-status-pending'
                                                            : 'bg-canvas-subtle text-ink-muted'
                                                    }`}
                                                >
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                    className="font-semibold text-prussian hover:underline"
                                                >
                                                    Sunting
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-ink-muted italic">
                                            Belum ada konten yang dibuat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity Log Table */}
                <div className="bg-white rounded border border-sidebar-border p-5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-sidebar-border mb-4">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-prussian" />
                            <h2 className="font-serif text-lg font-bold text-ink">
                                Log Aktivitas Terakhir
                            </h2>
                        </div>
                        <Link
                            href="/admin/activity-logs"
                            className="text-xs font-semibold text-prussian hover:underline"
                        >
                            Lihat Semua Log &rarr;
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border text-ink-muted bg-canvas-subtle/50">
                                    <th className="py-2.5 px-3 font-semibold w-40">Waktu</th>
                                    <th className="py-2.5 px-3 font-semibold w-36">Pengguna</th>
                                    <th className="py-2.5 px-3 font-semibold w-24">Aksi</th>
                                    <th className="py-2.5 px-3 font-semibold w-32">Modul</th>
                                    <th className="py-2.5 px-3 font-semibold">Deskripsi Aktivitas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-canvas-subtle/30">
                                            <td className="py-3 px-3 font-mono text-[11px] text-ink-muted whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="py-3 px-3 font-medium text-ink whitespace-nowrap">
                                                {log.user_name || 'Sistem'}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    log.action === 'create'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : log.action === 'update'
                                                        ? 'bg-blue-50 text-[#0F2C59] border border-blue-200'
                                                        : log.action === 'delete'
                                                        ? 'bg-rose-50 text-[#C85A32] border border-rose-200'
                                                        : log.action === 'upload'
                                                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                                        : log.action === 'login'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        : 'bg-stone-100 text-stone-600'
                                                }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-ink-muted">
                                                {log.module}
                                            </td>
                                            <td className="py-3 px-3 font-medium text-ink">
                                                {log.description}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-ink-muted italic">
                                            Belum ada aktivitas yang tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
