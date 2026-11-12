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
    AcademicCapIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface StaffItem {
    id: number;
    name: string;
    nip: string | null;
    position: string;
    subject: string | null;
    category: 'kepsek' | 'guru' | 'tendik';
    photo: string | null;
    sort_order: number;
    is_active: boolean;
}

interface StaffPageProps {
    staff: {
        data: StaffItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        category?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guru & Tenaga Kependidikan',
        href: '/admin/staff',
    },
];

export default function StaffIndex({ staff, filters }: StaffPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeCategory, setActiveCategory] = useState(filters.category || 'all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        item: StaffItem | null;
        loading: boolean;
    }>({ open: false, item: null, loading: false });

    const [form, setForm] = useState({
        name: '',
        nip: '',
        position: '',
        subject: '',
        category: 'guru' as 'kepsek' | 'guru' | 'tendik',
        photo: '',
        sort_order: 0,
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search, category: activeCategory === 'all' ? undefined : activeCategory });
    };

    const handleCategoryClick = (cat: string) => {
        setActiveCategory(cat);
        applyFilter({ search, category: cat === 'all' ? undefined : cat });
    };

    const applyFilter = (params: { search?: string; category?: string }) => {
        router.get('/admin/staff', params, { preserveState: true, replace: true });
    };

    const openAddModal = () => {
        setEditingStaff(null);
        setForm({
            name: '',
            nip: '',
            position: '',
            subject: '',
            category: 'guru',
            photo: '',
            sort_order: (staff.data.length + 1) * 5,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: StaffItem) => {
        setEditingStaff(item);
        setForm({
            name: item.name,
            nip: item.nip || '',
            position: item.position,
            subject: item.subject || '',
            category: item.category,
            photo: item.photo || '',
            sort_order: item.sort_order,
            is_active: item.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStaff) {
            router.put(`/admin/staff/${editingStaff.id}`, form, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(`Data "${form.name}" berhasil diperbarui.`);
                },
                onError: () => {
                    toast.error('Gagal memperbarui data guru/staf. Periksa kembali isian formulir.');
                },
            });
        } else {
            router.post('/admin/staff', form, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(`Data "${form.name}" berhasil ditambahkan.`);
                },
                onError: () => {
                    toast.error('Gagal menambahkan data guru/staf. Periksa kembali isian formulir.');
                },
            });
        }
    };

    const handleDelete = (item: StaffItem) => {
        setDeleteModal({ open: true, item, loading: false });
    };

    const confirmDelete = () => {
        if (!deleteModal.item) return;
        setDeleteModal((prev) => ({ ...prev, loading: true }));
        router.delete(`/admin/staff/${deleteModal.item.id}`, {
            onSuccess: () => {
                toast.success(`Data "${deleteModal.item?.name}" berhasil dihapus.`);
                setDeleteModal({ open: false, item: null, loading: false });
            },
            onError: () => {
                toast.error('Gagal menghapus data guru/staf.');
                setDeleteModal((prev) => ({ ...prev, loading: false }));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Direktori Guru & Staf TU - Panel Admin" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD7] pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#1A2228] tracking-tight">
                            Direktori Guru & Staf TU
                        </h1>
                        <p className="text-xs text-[#5A626A] mt-1 font-sans">
                            Kelola profil tenaga pendidik dan kependidikan sekolah dengan foto resmi rasio 3:4 ({staff.total} orang terdata).
                        </p>
                    </div>

                    <Button
                        onClick={openAddModal}
                        className="bg-[#0F2C59] text-white hover:bg-[#0A1F3F] text-xs font-semibold px-4 py-2"
                    >
                        <PlusIcon className="w-4 h-4 mr-1.5" />
                        Tambah Guru / Staf
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 border border-[#E2DFD7] rounded-xs shadow-2xs">
                    <div className="flex flex-wrap gap-1">
                        {[
                            { key: 'all', label: 'Semua Kategori' },
                            { key: 'kepsek', label: 'Kepala Sekolah' },
                            { key: 'guru', label: 'Dewan Guru' },
                            { key: 'tendik', label: 'Tenaga Kependidikan / TU' },
                        ].map((cat) => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => handleCategoryClick(cat.key)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-xs transition ${
                                    activeCategory === cat.key
                                        ? 'bg-[#0F2C59] text-white'
                                        : 'text-[#5A626A] hover:bg-[#FAF9F6] hover:text-[#1A2228]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-72">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3 top-2.5" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, NIP, mapel..."
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
                                <th className="p-3.5 w-16 text-center">Foto 3:4</th>
                                <th className="p-3.5">Nama & NIP</th>
                                <th className="p-3.5">Kategori</th>
                                <th className="p-3.5">Jabatan / Mata Pelajaran</th>
                                <th className="p-3.5 text-center w-24">Urutan</th>
                                <th className="p-3.5 text-center w-24">Status</th>
                                <th className="p-3.5 text-right w-28">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DFD7] text-xs">
                            {staff.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[#5A626A]">
                                        Tidak ada data guru atau tenaga kependidikan yang sesuai.
                                    </td>
                                </tr>
                            ) : (
                                staff.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#FAF9F6]/80 transition">
                                        <td className="p-3 text-center">
                                            <div className="w-10 h-13.5 aspect-[3/4] mx-auto bg-[#F4F0EA] border border-[#D8D2C6] rounded-xs overflow-hidden flex items-center justify-center">
                                                {item.photo ? (
                                                    <img
                                                        src={item.photo}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon className="w-5 h-5 text-[#8C949D]" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-serif font-bold text-sm text-[#1A2228]">
                                                {item.name}
                                            </div>
                                            <div className="text-[11px] text-[#5A626A] font-mono mt-0.5">
                                                NIP: {item.nip || '—'}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-xs uppercase tracking-wider ${
                                                    item.category === 'kepsek'
                                                        ? 'bg-[#0F2C59] text-white'
                                                        : item.category === 'guru'
                                                        ? 'bg-[#EAE6DF] text-[#1A2228]'
                                                        : 'bg-[#C85A32]/10 text-[#C85A32]'
                                                }`}
                                            >
                                                {item.category === 'kepsek'
                                                    ? 'Kepsek'
                                                    : item.category === 'guru'
                                                    ? 'Guru'
                                                    : 'Tendik'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium text-[#1A2228]">
                                                {item.position}
                                            </div>
                                            {item.subject && (
                                                <div className="text-[11px] text-[#5A626A] mt-0.5">
                                                    Mapel: {item.subject}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 text-center font-mono text-xs text-[#5A626A]">
                                            {item.sort_order}
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
                {staff.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {staff.links.map((link, i) => (
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

            {/* Modal Tambah / Sunting Guru */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg bg-white border border-[#D8D2C6] p-6 shadow-xl">
                    <DialogHeader className="border-b border-[#E2DFD7] pb-3">
                        <DialogTitle className="text-lg font-serif font-bold text-[#1A2228]">
                            {editingStaff ? 'Sunting Data Guru / Staf' : 'Tambah Guru / Staf Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Nama Lengkap & Gelar *
                            </Label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Contoh: Drs. H. Mulyadi, M.Pd."
                                required
                                className="mt-1 text-xs border-[#D8D2C6]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    NIP / NUPTK
                                </Label>
                                <Input
                                    value={form.nip}
                                    onChange={(e) => setForm({ ...form, nip: e.target.value })}
                                    placeholder="18 digit NIP"
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Kategori Jabatan *
                                </Label>
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            category: e.target.value as 'kepsek' | 'guru' | 'tendik',
                                        })
                                    }
                                    className="mt-1 w-full h-9 px-3 text-xs border border-[#D8D2C6] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                                >
                                    <option value="guru">Dewan Guru</option>
                                    <option value="kepsek">Kepala Sekolah</option>
                                    <option value="tendik">Tenaga Kependidikan / TU</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Jabatan Resmi *
                                </Label>
                                <Input
                                    value={form.position}
                                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                                    placeholder="Contoh: Guru Matematika"
                                    required
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Mata Pelajaran yang Diampu
                                </Label>
                                <Input
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    placeholder="Contoh: Matematika"
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                        </div>

                        {/* Foto 3:4 */}
                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228] mb-1 block">
                                Foto Resmi (Rasio 3:4)
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-16 aspect-[3/4] bg-[#F4F0EA] border border-[#D8D2C6] rounded-xs overflow-hidden flex items-center justify-center shrink-0">
                                    {form.photo ? (
                                        <img
                                            src={form.photo}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="w-6 h-6 text-[#8C949D]" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex gap-2">
                                        <Input
                                            value={form.photo}
                                            onChange={(e) => setForm({ ...form, photo: e.target.value })}
                                            placeholder="URL foto atau pilih dari Pustaka Media"
                                            className="text-xs border-[#D8D2C6] h-8"
                                        />
                                        <MediaPickerModal
                                            title="Pilih Foto Guru (3:4)"
                                            allowedTypes="images"
                                            onSelect={(url) => setForm({ ...form, photo: url })}
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
                                    <p className="text-[10px] text-[#5A626A]">
                                        Disarankan menggunakan foto formal berlatar belakang polos rasio 3:4.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Urutan Prioritas (Angka kecil lebih awal)
                                </Label>
                                <Input
                                    type="number"
                                    value={form.sort_order}
                                    onChange={(e) =>
                                        setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })
                                    }
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="rounded border-[#D8D2C6] text-[#0F2C59] focus:ring-[#0F2C59]"
                                />
                                <Label htmlFor="is_active" className="text-xs text-[#1A2228] cursor-pointer">
                                    Tampilkan di Direktori Publik
                                </Label>
                            </div>
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
                                {editingStaff ? 'Simpan Perubahan' : 'Tambah Data Guru'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
                title="Hapus Data Guru / Staf"
                description={`Apakah Anda yakin ingin menghapus "${deleteModal.item?.name}"? Data ini tidak dapat dipulihkan.`}
                confirmText="Iya, Hapus"
                cancelText="Tidak"
                variant="danger"
                loading={deleteModal.loading}
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

