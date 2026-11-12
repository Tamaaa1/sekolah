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
import { MediaPickerModal } from '@/components/media-picker-modal';
import {
    CalendarDaysIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PhotoIcon,
    PlusIcon,
    TrashIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface ExtracurricularItem {
    id: number;
    name: string;
    slug: string;
    leader_name: string | null;
    schedule_day: string | null;
    schedule_time: string | null;
    description: string | null;
    cover_image: string | null;
    is_active: boolean;
}

interface ExtracurricularPageProps {
    extracurriculars: {
        data: ExtracurricularItem[];
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
        title: 'Ekstrakurikuler',
        href: '/admin/extracurriculars',
    },
];

export default function ExtracurricularIndex({
    extracurriculars,
    filters,
}: ExtracurricularPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ExtracurricularItem | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        item: ExtracurricularItem | null;
        loading: boolean;
    }>({ open: false, item: null, loading: false });

    const [form, setForm] = useState({
        name: '',
        slug: '',
        leader_name: '',
        schedule_day: '',
        schedule_time: '',
        description: '',
        cover_image: '',
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/extracurriculars', { search }, { preserveState: true, replace: true });
    };

    const openAddModal = () => {
        setEditingItem(null);
        setForm({
            name: '',
            slug: '',
            leader_name: '',
            schedule_day: '',
            schedule_time: '',
            description: '',
            cover_image: '',
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: ExtracurricularItem) => {
        setEditingItem(item);
        setForm({
            name: item.name,
            slug: item.slug,
            leader_name: item.leader_name || '',
            schedule_day: item.schedule_day || '',
            schedule_time: item.schedule_time || '',
            description: item.description || '',
            cover_image: item.cover_image || '',
            is_active: item.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            router.put(`/admin/extracurriculars/${editingItem.id}`, form, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(`Ekstrakurikuler "${form.name}" berhasil diperbarui.`);
                },
                onError: () => {
                    toast.error('Gagal memperbarui data ekstrakurikuler. Periksa kembali formulir.');
                },
            });
        } else {
            router.post('/admin/extracurriculars', form, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(`Ekstrakurikuler "${form.name}" berhasil ditambahkan.`);
                },
                onError: () => {
                    toast.error('Gagal menambahkan ekstrakurikuler. Periksa kembali formulir.');
                },
            });
        }
    };

    const handleDelete = (item: ExtracurricularItem) => {
        setDeleteModal({ open: true, item, loading: false });
    };

    const confirmDelete = () => {
        if (!deleteModal.item) return;
        setDeleteModal((prev) => ({ ...prev, loading: true }));
        router.delete(`/admin/extracurriculars/${deleteModal.item.id}`, {
            onSuccess: () => {
                toast.success(`Ekstrakurikuler "${deleteModal.item?.name}" berhasil dihapus.`);
                setDeleteModal({ open: false, item: null, loading: false });
            },
            onError: () => {
                toast.error('Gagal menghapus kegiatan ekstrakurikuler.');
                setDeleteModal((prev) => ({ ...prev, loading: false }));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ekstrakurikuler - Panel Admin" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD7] pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#1A2228] tracking-tight">
                            Kelola Ekstrakurikuler
                        </h1>
                        <p className="text-xs text-[#5A626A] mt-1 font-sans">
                            Atur informasi klub bakat minat, nama pembina, jadwal latihan mingguan, dan foto dokumentasi kegiatan ({extracurriculars.total} ekskul aktif).
                        </p>
                    </div>

                    <Button
                        onClick={openAddModal}
                        className="bg-[#0F2C59] text-white hover:bg-[#0A1F3F] text-xs font-semibold px-4 py-2"
                    >
                        <PlusIcon className="w-4 h-4 mr-1.5" />
                        Tambah Ekskul
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
                                placeholder="Cari nama ekskul atau pembina..."
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
                                <th className="p-3.5 w-20">Sampul</th>
                                <th className="p-3.5">Nama Ekstrakurikuler</th>
                                <th className="p-3.5">Pembina / Pelatih</th>
                                <th className="p-3.5">Jadwal Latihan</th>
                                <th className="p-3.5 text-center w-24">Status</th>
                                <th className="p-3.5 text-right w-28">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DFD7] text-xs">
                            {extracurriculars.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#5A626A]">
                                        Belum ada data ekstrakurikuler yang tersimpan.
                                    </td>
                                </tr>
                            ) : (
                                extracurriculars.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#FAF9F6]/80 transition">
                                        <td className="p-3">
                                            <div className="w-16 h-10 bg-[#F4F0EA] border border-[#D8D2C6] rounded-xs overflow-hidden flex items-center justify-center">
                                                {item.cover_image ? (
                                                    <img
                                                        src={item.cover_image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <PhotoIcon className="w-5 h-5 text-[#8C949D]" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-serif font-bold text-sm text-[#1A2228]">
                                                {item.name}
                                            </div>
                                            <div className="text-[11px] text-[#5A626A] line-clamp-1 max-w-sm mt-0.5">
                                                {item.description || 'Tidak ada deskripsi'}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium text-[#1A2228]">
                                                {item.leader_name || '—'}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1.5 text-[#1A2228]">
                                                <CalendarDaysIcon className="w-4 h-4 text-[#0F2C59]" />
                                                <span>{item.schedule_day || '—'}</span>
                                            </div>
                                            {item.schedule_time && (
                                                <div className="text-[11px] text-[#5A626A] font-mono mt-0.5">
                                                    {item.schedule_time}
                                                </div>
                                            )}
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
                {extracurriculars.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {extracurriculars.links.map((link, i) => (
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

            {/* Modal Tambah / Sunting Ekskul */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg bg-white border border-[#D8D2C6] p-6 shadow-xl">
                    <DialogHeader className="border-b border-[#E2DFD7] pb-3">
                        <DialogTitle className="text-lg font-serif font-bold text-[#1A2228]">
                            {editingItem ? 'Sunting Data Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Nama Ekstrakurikuler *
                            </Label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Contoh: Palang Merah Remaja (PMR)"
                                required
                                className="mt-1 text-xs border-[#D8D2C6]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Pembina / Pelatih
                                </Label>
                                <Input
                                    value={form.leader_name}
                                    onChange={(e) => setForm({ ...form, leader_name: e.target.value })}
                                    placeholder="Nama pembina resmi"
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Hari Latihan Rutin
                                </Label>
                                <Input
                                    value={form.schedule_day}
                                    onChange={(e) => setForm({ ...form, schedule_day: e.target.value })}
                                    placeholder="Contoh: Setiap Jumat"
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Jam Latihan
                            </Label>
                            <Input
                                value={form.schedule_time}
                                onChange={(e) => setForm({ ...form, schedule_time: e.target.value })}
                                placeholder="Contoh: 15.00 - 17.00 WIB"
                                className="mt-1 text-xs border-[#D8D2C6]"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Deskripsi Kegiatan
                            </Label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Tuliskan tujuan dan kegiatan pokok ekstrakurikuler ini..."
                                rows={3}
                                className="mt-1 w-full p-2.5 text-xs border border-[#D8D2C6] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                            />
                        </div>

                        {/* Foto Sampul */}
                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228] mb-1 block">
                                Foto Sampul Kegiatan
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-11 bg-[#F4F0EA] border border-[#D8D2C6] rounded-xs overflow-hidden flex items-center justify-center shrink-0">
                                    {form.cover_image ? (
                                        <img
                                            src={form.cover_image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <PhotoIcon className="w-6 h-6 text-[#8C949D]" />
                                    )}
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        value={form.cover_image}
                                        onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                                        placeholder="URL foto kegiatan"
                                        className="text-xs border-[#D8D2C6] h-8"
                                    />
                                    <MediaPickerModal
                                        title="Pilih Sampul Ekskul"
                                        allowedTypes="images"
                                        onSelect={(url) => setForm({ ...form, cover_image: url })}
                                        trigger={
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="border-[#D8D2C6] text-xs h-8 whitespace-nowrap"
                                            >
                                                Pilih Foto
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active_ekskul"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="rounded border-[#D8D2C6] text-[#0F2C59] focus:ring-[#0F2C59]"
                            />
                            <Label htmlFor="is_active_ekskul" className="text-xs text-[#1A2228] cursor-pointer">
                                Aktifkan dan tampilkan di direktori publik
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
                                {editingItem ? 'Simpan Perubahan' : 'Tambah Ekskul'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
                title="Hapus Ekstrakurikuler"
                description={`Apakah Anda yakin ingin menghapus kegiatan "${deleteModal.item?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Iya, Hapus"
                cancelText="Tidak"
                variant="danger"
                loading={deleteModal.loading}
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

