import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    CalendarDaysIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface AgendaItem {
    id: number;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    location: string | null;
    is_active: boolean;
}

interface AgendaPageProps {
    agendas: {
        data: AgendaItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agenda Akademik',
        href: '/admin/agendas',
    },
];

export default function AgendaIndex({ agendas, filters }: AgendaPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        item: AgendaItem | null;
        loading: boolean;
    }>({ open: false, item: null, loading: false });

    const [form, setForm] = useState({
        title: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        location: '',
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/agendas', { search }, { preserveState: true, replace: true });
    };

    const openAddModal = () => {
        setEditingItem(null);
        setForm({
            title: '',
            description: '',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            location: '',
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: AgendaItem) => {
        setEditingItem(item);
        setForm({
            title: item.title,
            description: item.description || '',
            start_date: item.start_date.substring(0, 10),
            end_date: item.end_date ? item.end_date.substring(0, 10) : '',
            location: item.location || '',
            is_active: item.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            router.put(`/admin/agendas/${editingItem.id}`, form, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(`Agenda "${form.title}" berhasil diperbarui.`);
                },
                onError: () => {
                    toast.error('Gagal memperbarui agenda. Periksa kembali isian formulir.');
                },
            });
        } else {
            router.post('/admin/agendas', form, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(`Agenda "${form.title}" berhasil ditambahkan.`);
                },
                onError: () => {
                    toast.error('Gagal menambahkan agenda. Periksa kembali isian formulir.');
                },
            });
        }
    };

    const handleDelete = (item: AgendaItem) => {
        setDeleteModal({ open: true, item, loading: false });
    };

    const confirmDelete = () => {
        if (!deleteModal.item) return;
        setDeleteModal((prev) => ({ ...prev, loading: true }));
        router.delete(`/admin/agendas/${deleteModal.item.id}`, {
            onSuccess: () => {
                toast.success(`Agenda "${deleteModal.item?.title}" berhasil dihapus.`);
                setDeleteModal({ open: false, item: null, loading: false });
            },
            onError: () => {
                toast.error('Gagal menghapus agenda.');
                setDeleteModal((prev) => ({ ...prev, loading: false }));
            },
        });
    };

    const formatDateRange = (start: string, end: string | null) => {
        const s = new Date(start);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        if (!end || end === start) {
            return s.toLocaleDateString('id-ID', options);
        }
        const e = new Date(end);
        return `${s.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${e.toLocaleDateString('id-ID', options)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agenda Akademik - Panel Admin" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD7] pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#1A2228] tracking-tight">
                            Kalender & Agenda Akademik
                        </h1>
                        <p className="text-xs text-[#5A626A] mt-1 font-sans">
                            Atur jadwal ujian semester, libur sekolah, peringatan hari nasional, dan kegiatan kesiswaan ({agendas.total} jadwal tersimpan).
                        </p>
                    </div>

                    <Button
                        onClick={openAddModal}
                        className="bg-[#0F2C59] text-white hover:bg-[#0A1F3F] text-xs font-semibold px-4 py-2"
                    >
                        <PlusIcon className="w-4 h-4 mr-1.5" />
                        Tambah Agenda
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 border border-[#E2DFD7] rounded-xs shadow-2xs">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-80">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3 top-2.5" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul atau lokasi kegiatan..."
                                className="pl-9 text-xs border-[#D8D2C6] h-9 bg-white"
                            />
                        </div>
                        <Button type="submit" variant="outline" className="border-[#D8D2C6] text-xs h-9">
                            Cari
                        </Button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white border border-[#E2DFD7] rounded-xs overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAF9F6] border-b border-[#E2DFD7] text-[11px] font-semibold text-[#5A626A] uppercase tracking-wider">
                                <th className="p-3.5 w-44">Tanggal Pelaksanaan</th>
                                <th className="p-3.5">Nama Kegiatan / Agenda</th>
                                <th className="p-3.5">Lokasi</th>
                                <th className="p-3.5 text-center w-24">Status</th>
                                <th className="p-3.5 text-right w-28">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DFD7] text-xs">
                            {agendas.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[#5A626A]">
                                        Belum ada jadwal agenda yang tersimpan.
                                    </td>
                                </tr>
                            ) : (
                                agendas.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#FAF9F6]/80 transition">
                                        <td className="p-3">
                                            <div className="flex items-center gap-1.5 font-medium text-[#0F2C59]">
                                                <CalendarDaysIcon className="w-4 h-4 shrink-0 text-[#C85A32]" />
                                                <span>{formatDateRange(item.start_date, item.end_date)}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-serif font-bold text-sm text-[#1A2228]">
                                                {item.title}
                                            </div>
                                            {item.description && (
                                                <div className="text-[11px] text-[#5A626A] line-clamp-1 mt-0.5">
                                                    {item.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1.5 text-[#5A626A]">
                                                <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                                                <span>{item.location || 'Lingkungan Sekolah'}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span
                                                className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-xs ${
                                                    item.is_active
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-stone-100 text-stone-600'
                                                }`}
                                            >
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditModal(item)}
                                                    className="h-8 w-8 p-0 text-[#0F2C59] hover:bg-[#EAE6DF]"
                                                    title="Sunting"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(item)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                    title="Hapus"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {agendas.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {agendas.links.map((link, i) => (
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

            {/* Modal Tambah / Sunting Agenda */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg bg-white border border-[#D8D2C6] p-6 shadow-xl">
                    <DialogHeader className="border-b border-[#E2DFD7] pb-3">
                        <DialogTitle className="text-lg font-serif font-bold text-[#1A2228]">
                            {editingItem ? 'Sunting Agenda Akademik' : 'Tambah Agenda Akademik Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Nama / Judul Kegiatan *
                            </Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Contoh: Asesmen Sumatif Akhir Semester (ASAS)"
                                required
                                className="mt-1 text-xs border-[#D8D2C6]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Tanggal Mulai *
                                </Label>
                                <Input
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                    required
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Tanggal Selesai (Opsional)
                                </Label>
                                <Input
                                    type="date"
                                    value={form.end_date}
                                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Tempat / Lokasi Kegiatan
                            </Label>
                            <Input
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                placeholder="Contoh: Aula Utama & Lapangan SMPN 1"
                                className="mt-1 text-xs border-[#D8D2C6]"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Keterangan Tambahan
                            </Label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Tuliskan petunjuk teknis atau ketentuan pakaian/peralatan yang dibawa..."
                                rows={3}
                                className="mt-1 w-full p-2.5 text-xs border border-[#D8D2C6] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active_agenda"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="rounded border-[#D8D2C6] text-[#0F2C59] focus:ring-[#0F2C59]"
                            />
                            <Label htmlFor="is_active_agenda" className="text-xs text-[#1A2228] cursor-pointer">
                                Tampilkan jadwal di agenda kalender portal publik
                            </Label>
                        </div>

                        <div className="border-t border-[#E2DFD7] pt-4 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className="border-[#D8D2C6] text-xs text-[#1A2228]"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#0F2C59] text-white hover:bg-[#0A1F3F] text-xs font-semibold px-4"
                            >
                                {editingItem ? 'Simpan Perubahan' : 'Tambah Agenda'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
                title="Hapus Agenda Akademik"
                description={`Apakah Anda yakin ingin menghapus agenda "${deleteModal.item?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Iya, Hapus"
                cancelText="Tidak"
                variant="danger"
                loading={deleteModal.loading}
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

