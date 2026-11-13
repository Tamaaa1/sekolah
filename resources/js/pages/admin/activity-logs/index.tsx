import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ArrowPathIcon,
    ClockIcon,
    FunnelIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    TrashIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface ActivityLogItem {
    id: number;
    user_id: number | null;
    user_name: string | null;
    user_email: string | null;
    action: string;
    module: string;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    properties: Record<string, unknown> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

interface ActivityLogsPageProps {
    logs: {
        data: ActivityLogItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        module?: string;
        action?: string;
    };
    availableModules: string[];
    stats: {
        total: number;
        today: number;
        creates: number;
        updates: number;
        deletes: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Log Aktivitas',
        href: '/admin/activity-logs',
    },
];

export default function ActivityLogIndex({
    logs,
    filters,
    availableModules,
    stats,
}: ActivityLogsPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeModule, setActiveModule] = useState(filters.module || 'all');
    const [activeAction, setActiveAction] = useState(filters.action || 'all');
    const [detailModal, setDetailModal] = useState<{
        open: boolean;
        item: ActivityLogItem | null;
    }>({ open: false, item: null });

    const [clearModal, setClearModal] = useState({
        open: false,
        period: 'older_than_30_days' as 'older_than_30_days' | 'all',
        loading: false,
    });

    const applyFilters = (params: { search?: string; module?: string; action?: string }) => {
        const query: Record<string, string> = {};
        if (params.search) query.search = params.search;
        if (params.module && params.module !== 'all') query.module = params.module;
        if (params.action && params.action !== 'all') query.action = params.action;

        router.get('/admin/activity-logs', query, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search, module: activeModule, action: activeAction });
    };

    const handleModuleChange = (mod: string) => {
        setActiveModule(mod);
        applyFilters({ search, module: mod, action: activeAction });
    };

    const handleActionChange = (act: string) => {
        setActiveAction(act);
        applyFilters({ search, module: activeModule, action: act });
    };

    const handleResetFilters = () => {
        setSearch('');
        setActiveModule('all');
        setActiveAction('all');
        router.get('/admin/activity-logs', {}, { preserveState: true, replace: true });
    };

    const handleClearLogs = () => {
        setClearModal((prev) => ({ ...prev, loading: true }));
        router.delete('/admin/activity-logs', {
            data: { period: clearModal.period },
            onSuccess: () => {
                toast.success('Pembersihan catatan log berhasil dilakukan.');
                setClearModal({ open: false, period: 'older_than_30_days', loading: false });
            },
            onError: () => {
                toast.error('Gagal membersihkan log aktivitas.');
                setClearModal((prev) => ({ ...prev, loading: false }));
            },
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getActionBadge = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create':
                return (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Tambah
                    </span>
                );
            case 'update':
                return (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase tracking-wider bg-blue-50 text-[#0F2C59] border border-blue-200">
                        Ubah
                    </span>
                );
            case 'delete':
                return (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase tracking-wider bg-rose-50 text-[#C85A32] border border-rose-200">
                        Hapus
                    </span>
                );
            case 'upload':
                return (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                        Unggah
                    </span>
                );
            case 'login':
                return (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                        Masuk
                    </span>
                );
            case 'logout':
                return (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                        Keluar
                    </span>
                );
            default:
                return (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase tracking-wider bg-stone-100 text-stone-700">
                        {action}
                    </span>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Aktivitas - Panel Admin" />

            <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD7] pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#1A2228] tracking-tight">
                            Log Aktivitas Sistem
                        </h1>
                        <p className="text-xs text-[#5A626A] mt-1 font-sans">
                            Rekam jejak seluruh tindakan penambahan, pengubahan, penghapusan data, dan riwayat login di panel administrasi ({stats.total} total log).
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setClearModal({ open: true, period: 'older_than_30_days', loading: false })}
                            variant="outline"
                            className="border-[#D8D2C6] text-xs text-[#1A2228] hover:bg-[#FAF9F6] h-9"
                        >
                            <TrashIcon className="w-4 h-4 mr-1.5 text-stone-600" />
                            Bersihkan Log
                        </Button>
                    </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border border-[#E2DFD7] rounded-xs p-3.5 shadow-2xs">
                        <div className="text-[11px] font-semibold text-[#5A626A] uppercase tracking-wider">
                            Total Aktivitas
                        </div>
                        <div className="text-xl font-serif font-bold text-[#0F2C59] mt-1">
                            {stats.total.toLocaleString('id-ID')}
                        </div>
                    </div>
                    <div className="bg-white border border-[#E2DFD7] rounded-xs p-3.5 shadow-2xs">
                        <div className="text-[11px] font-semibold text-[#5A626A] uppercase tracking-wider">
                            Aktivitas Hari Ini
                        </div>
                        <div className="text-xl font-serif font-bold text-[#C85A32] mt-1">
                            {stats.today.toLocaleString('id-ID')}
                        </div>
                    </div>
                    <div className="bg-white border border-[#E2DFD7] rounded-xs p-3.5 shadow-2xs">
                        <div className="text-[11px] font-semibold text-[#5A626A] uppercase tracking-wider">
                            Penambahan Baru
                        </div>
                        <div className="text-xl font-serif font-bold text-emerald-700 mt-1">
                            {stats.creates.toLocaleString('id-ID')}
                        </div>
                    </div>
                    <div className="bg-white border border-[#E2DFD7] rounded-xs p-3.5 shadow-2xs">
                        <div className="text-[11px] font-semibold text-[#5A626A] uppercase tracking-wider">
                            Perubahan Data
                        </div>
                        <div className="text-xl font-serif font-bold text-blue-700 mt-1">
                            {stats.updates.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>

                {/* Filters and Search Bar */}
                <div className="bg-white p-3 border border-[#E2DFD7] rounded-xs shadow-2xs space-y-3">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3 top-2.5" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari deskripsi, nama pengguna, email, atau IP..."
                                    className="pl-9 text-xs border-[#D8D2C6] h-9 bg-white"
                                />
                            </div>
                            <Button type="submit" variant="outline" className="border-[#D8D2C6] text-xs h-9">
                                Cari
                            </Button>
                        </form>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-[#5A626A]">
                                <FunnelIcon className="w-3.5 h-3.5" />
                                <span>Aksi:</span>
                            </div>
                            <select
                                value={activeAction}
                                onChange={(e) => handleActionChange(e.target.value)}
                                className="text-xs border border-[#D8D2C6] rounded-xs px-2.5 py-1.5 bg-white text-[#1A2228] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                            >
                                <option value="all">Semua Aksi</option>
                                <option value="create">Tambah (Create)</option>
                                <option value="update">Ubah (Update)</option>
                                <option value="delete">Hapus (Delete)</option>
                                <option value="upload">Unggah (Upload)</option>
                                <option value="login">Masuk (Login)</option>
                                <option value="logout">Keluar (Logout)</option>
                            </select>

                            <select
                                value={activeModule}
                                onChange={(e) => handleModuleChange(e.target.value)}
                                className="text-xs border border-[#D8D2C6] rounded-xs px-2.5 py-1.5 bg-white text-[#1A2228] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                            >
                                <option value="all">Semua Bagian / Modul</option>
                                {availableModules.map((mod) => (
                                    <option key={mod} value={mod}>
                                        {mod}
                                    </option>
                                ))}
                            </select>

                            {(search || activeModule !== 'all' || activeAction !== 'all') && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="text-xs text-[#C85A32] hover:underline px-2 py-1 flex items-center gap-1"
                                >
                                    <ArrowPathIcon className="w-3 h-3" />
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table & Mobile Cards */}
                <div className="bg-white border border-[#E2DFD7] rounded-xs overflow-hidden shadow-2xs">
                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF9F6] border-b border-[#E2DFD7] text-[11px] font-semibold text-[#5A626A] uppercase tracking-wider">
                                    <th className="p-3.5 w-44 whitespace-nowrap">Waktu</th>
                                    <th className="p-3.5 w-48 whitespace-nowrap">Pengguna</th>
                                    <th className="p-3.5 w-24 whitespace-nowrap text-center">Aksi</th>
                                    <th className="p-3.5 w-36 whitespace-nowrap">Modul</th>
                                    <th className="p-3.5">Deskripsi Aktivitas</th>
                                    <th className="p-3.5 w-32 whitespace-nowrap">Alamat IP</th>
                                    <th className="p-3.5 w-16 text-right whitespace-nowrap">Rincian</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2DFD7] text-xs">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-[#5A626A]">
                                            Belum ada catatan aktivitas yang sesuai dengan filter pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#FAF9F6]/80 transition">
                                            <td className="p-3 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-[#1A2228] font-mono text-[11px]">
                                                    <ClockIcon className="w-3.5 h-3.5 text-[#5A626A] shrink-0" />
                                                    <span>{formatDateTime(item.created_at)}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center font-bold text-[10px]">
                                                        {item.user_name ? item.user_name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-[#1A2228] line-clamp-1">
                                                            {item.user_name || 'Sistem'}
                                                        </div>
                                                        {item.user_email && (
                                                            <div className="text-[10px] text-[#5A626A] font-mono">
                                                                {item.user_email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center whitespace-nowrap">
                                                {getActionBadge(item.action)}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs bg-[#FAF9F6] text-[#1A2228] border border-[#D8D2C6]">
                                                    {item.module}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-[#1A2228] font-medium leading-relaxed">
                                                    {item.description}
                                                </div>
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                <span className="text-[11px] font-mono text-[#5A626A]">
                                                    {item.ip_address || '—'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right whitespace-nowrap">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDetailModal({ open: true, item })}
                                                    className="h-8 w-8 p-0 text-[#0F2C59] hover:bg-[#EAE6DF]"
                                                    title="Lihat Detail Log"
                                                >
                                                    <InformationCircleIcon className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Individual Cards */}
                    <div className="md:hidden divide-y divide-[#E2DFD7] bg-[#FAF9F6]">
                        {logs.data.length === 0 ? (
                            <div className="p-8 text-center text-xs text-[#5A626A] bg-white">
                                Belum ada catatan aktivitas yang sesuai dengan filter pencarian.
                            </div>
                        ) : (
                            logs.data.map((item) => (
                                <div key={item.id} className="p-4 space-y-3 bg-white">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center font-bold text-xs shrink-0">
                                                {item.user_name ? item.user_name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-xs text-[#1A2228] truncate">
                                                    {item.user_name || 'Sistem'}
                                                </div>
                                                <div className="text-[10px] text-[#5A626A] font-mono flex items-center gap-1 mt-0.5">
                                                    <ClockIcon className="w-3 h-3 text-[#5A626A]" />
                                                    <span>{formatDateTime(item.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            {getActionBadge(item.action)}
                                        </div>
                                    </div>

                                    <div className="text-xs text-[#1A2228] font-medium leading-relaxed bg-[#FAF9F6] p-2.5 rounded-xs border border-[#E2DFD7]">
                                        {item.description}
                                    </div>

                                    <div className="pt-2 flex items-center justify-between border-t border-[#E2DFD7] text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-xs bg-[#FAF9F6] text-[#1A2228] border border-[#D8D2C6]">
                                                {item.module}
                                            </span>
                                            <span className="text-[10px] font-mono text-[#5A626A]">
                                                IP: {item.ip_address || '—'}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDetailModal({ open: true, item })}
                                            className="h-7 px-2.5 text-xs text-[#0F2C59] border-[#D8D2C6] hover:bg-[#FAF9F6] flex items-center gap-1"
                                        >
                                            <InformationCircleIcon className="w-3.5 h-3.5" />
                                            <span>Rincian</span>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {logs.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={`text-xs ${
                                    link.active
                                        ? 'bg-[#0F2C59] text-white'
                                        : 'border-[#D8D2C6] text-[#1A2228]'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Detail Log */}
            <Dialog open={detailModal.open} onOpenChange={(open) => setDetailModal((prev) => ({ ...prev, open }))}>
                <DialogContent className="max-w-lg bg-white border border-[#D8D2C6] p-6 shadow-xl">
                    <DialogHeader className="border-b border-[#E2DFD7] pb-3">
                        <DialogTitle className="text-base font-serif font-bold text-[#1A2228] flex items-center gap-2">
                            <ShieldCheckIcon className="w-5 h-5 text-[#0F2C59]" />
                            Rincian Catatan Aktivitas
                        </DialogTitle>
                    </DialogHeader>

                    {detailModal.item && (
                        <div className="space-y-4 pt-2 text-xs">
                            <div className="grid grid-cols-2 gap-3 bg-[#FAF9F6] p-3 rounded-xs border border-[#E2DFD7]">
                                <div>
                                    <div className="text-[10px] uppercase font-semibold text-[#5A626A]">Waktu Kejadian</div>
                                    <div className="font-mono text-[#1A2228] mt-0.5">{formatDateTime(detailModal.item.created_at)}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-semibold text-[#5A626A]">Jenis Aksi</div>
                                    <div className="mt-0.5">{getActionBadge(detailModal.item.action)}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-semibold text-[#5A626A]">Pelaksana / Akun</div>
                                    <div className="font-semibold text-[#1A2228] mt-0.5">{detailModal.item.user_name || 'Sistem'}</div>
                                    <div className="text-[10px] text-[#5A626A]">{detailModal.item.user_email || '—'}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-semibold text-[#5A626A]">Bagian / Modul</div>
                                    <div className="font-semibold text-[#0F2C59] mt-0.5">{detailModal.item.module}</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] uppercase font-semibold text-[#5A626A] mb-1">Deskripsi Lengkap</div>
                                <div className="p-3 bg-white border border-[#D8D2C6] rounded-xs text-[#1A2228] font-medium leading-relaxed">
                                    {detailModal.item.description}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2 bg-[#FAF9F6] p-3 rounded-xs border border-[#E2DFD7] font-mono text-[11px]">
                                <div>
                                    <span className="text-[#5A626A]">Alamat IP: </span>
                                    <span className="text-[#1A2228] font-semibold">{detailModal.item.ip_address || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[#5A626A]">Peramban (User Agent): </span>
                                    <span className="text-[#1A2228] break-all">{detailModal.item.user_agent || '—'}</span>
                                </div>
                            </div>

                            {detailModal.item.properties && Object.keys(detailModal.item.properties).length > 0 && (
                                <div>
                                    <div className="text-[10px] uppercase font-semibold text-[#5A626A] mb-1">Data Tambahan (Metadata)</div>
                                    <pre className="p-2.5 bg-stone-900 text-stone-100 rounded-xs font-mono text-[10px] overflow-x-auto max-h-40">
                                        {JSON.stringify(detailModal.item.properties, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div className="border-t border-[#E2DFD7] pt-3 flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setDetailModal({ open: false, item: null })}
                                    className="border-[#D8D2C6] text-xs"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Bersihkan Log */}
            <Dialog open={clearModal.open} onOpenChange={(open) => setClearModal((prev) => ({ ...prev, open }))}>
                <DialogContent className="max-w-md bg-white border border-[#D8D2C6] p-6 shadow-xl">
                    <DialogHeader className="border-b border-[#E2DFD7] pb-3">
                        <DialogTitle className="text-base font-serif font-bold text-[#1A2228] flex items-center gap-2">
                            <TrashIcon className="w-5 h-5 text-[#C85A32]" />
                            Bersihkan Catatan Log Aktivitas
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-2 text-xs">
                        <p className="text-[#5A626A]">
                            Pilih periode catatan log aktivitas yang ingin dibersihkan dari basis data:
                        </p>

                        <div className="space-y-2">
                            <label className="flex items-start gap-2.5 p-3 border border-[#E2DFD7] rounded-xs cursor-pointer hover:bg-[#FAF9F6]">
                                <input
                                    type="radio"
                                    name="clear_period"
                                    checked={clearModal.period === 'older_than_30_days'}
                                    onChange={() => setClearModal((prev) => ({ ...prev, period: 'older_than_30_days' }))}
                                    className="mt-0.5 text-[#0F2C59]"
                                />
                                <div>
                                    <div className="font-semibold text-[#1A2228]">Hapus yang lebih dari 30 hari (Disarankan)</div>
                                    <div className="text-[11px] text-[#5A626A] mt-0.5">Mempertahankan riwayat aktivitas bulan berjalan untuk rekam jejak pemeriksaan.</div>
                                </div>
                            </label>

                            <label className="flex items-start gap-2.5 p-3 border border-[#E2DFD7] rounded-xs cursor-pointer hover:bg-[#FAF9F6]">
                                <input
                                    type="radio"
                                    name="clear_period"
                                    checked={clearModal.period === 'all'}
                                    onChange={() => setClearModal((prev) => ({ ...prev, period: 'all' }))}
                                    className="mt-0.5 text-[#C85A32]"
                                />
                                <div>
                                    <div className="font-semibold text-[#C85A32]">Hapus seluruh riwayat aktivitas</div>
                                    <div className="text-[11px] text-[#5A626A] mt-0.5">Mengosongkan seluruh tabel log. Tindakan ini tidak dapat dibatalkan.</div>
                                </div>
                            </label>
                        </div>

                        <div className="border-t border-[#E2DFD7] pt-4 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setClearModal((prev) => ({ ...prev, open: false }))}
                                className="border-[#D8D2C6] text-xs text-[#1A2228]"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleClearLogs}
                                disabled={clearModal.loading}
                                className="bg-[#C85A32] text-white hover:bg-[#A64522] text-xs font-semibold px-4"
                            >
                                {clearModal.loading ? 'Membersihkan...' : 'Iya, Bersihkan Log'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
