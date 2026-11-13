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
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PhotoIcon,
    PlusIcon,
    TrashIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface AchievementItem {
    id: number;
    title: string;
    student_name: string;
    competition_name: string;
    level: 'kabupaten' | 'provinsi' | 'nasional' | 'internasional';
    rank: string;
    year: number;
    image: string | null;
    description: string | null;
}

interface AchievementPageProps {
    achievements: {
        data: AchievementItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        level?: string;
        year?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Prestasi Siswa',
        href: '/admin/achievements',
    },
];

export default function AchievementIndex({
    achievements,
    filters,
}: AchievementPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeLevel, setActiveLevel] = useState(filters.level || 'all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<AchievementItem | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        item: AchievementItem | null;
        loading: boolean;
    }>({ open: false, item: null, loading: false });

    const [form, setForm] = useState({
        title: '',
        student_name: '',
        competition_name: '',
        level: 'kabupaten' as 'kabupaten' | 'provinsi' | 'nasional' | 'internasional',
        rank: '',
        year: new Date().getFullYear(),
        image: '',
        description: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search, level: activeLevel === 'all' ? undefined : activeLevel });
    };

    const handleLevelClick = (lvl: string) => {
        setActiveLevel(lvl);
        applyFilter({ search, level: lvl === 'all' ? undefined : lvl });
    };

    const applyFilter = (params: { search?: string; level?: string }) => {
        router.get('/admin/achievements', params, { preserveState: true, replace: true });
    };

    const openAddModal = () => {
        setEditingItem(null);
        setForm({
            title: '',
            student_name: '',
            competition_name: '',
            level: 'kabupaten',
            rank: 'Juara 1',
            year: new Date().getFullYear(),
            image: '',
            description: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: AchievementItem) => {
        setEditingItem(item);
        setForm({
            title: item.title,
            student_name: item.student_name,
            competition_name: item.competition_name,
            level: item.level,
            rank: item.rank,
            year: item.year,
            image: item.image || '',
            description: item.description || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            router.put(`/admin/achievements/${editingItem.id}`, form, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(`Prestasi "${form.title}" berhasil diperbarui.`);
                },
                onError: () => {
                    toast.error('Gagal memperbarui catatan prestasi. Periksa isian formulir.');
                },
            });
        } else {
            router.post('/admin/achievements', form, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success(`Prestasi "${form.title}" berhasil ditambahkan.`);
                },
                onError: () => {
                    toast.error('Gagal menambahkan catatan prestasi. Periksa isian formulir.');
                },
            });
        }
    };

    const handleDelete = (item: AchievementItem) => {
        setDeleteModal({ open: true, item, loading: false });
    };

    const confirmDelete = () => {
        if (!deleteModal.item) return;
        setDeleteModal((prev) => ({ ...prev, loading: true }));
        router.delete(`/admin/achievements/${deleteModal.item.id}`, {
            onSuccess: () => {
                toast.success(`Catatan prestasi "${deleteModal.item?.title}" berhasil dihapus.`);
                setDeleteModal({ open: false, item: null, loading: false });
            },
            onError: () => {
                toast.error('Gagal menghapus catatan prestasi.');
                setDeleteModal((prev) => ({ ...prev, loading: false }));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prestasi Siswa - Panel Admin" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD7] pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#1A2228] tracking-tight">
                            Prestasi & Penghargaan Siswa
                        </h1>
                        <p className="text-xs text-[#5A626A] mt-1 font-sans">
                            Dokumentasi rekam jejak juara siswa SMPN 1 dalam kompetisi akademik dan non-akademik ({achievements.total} prestasi terdata).
                        </p>
                    </div>

                    <Button
                        onClick={openAddModal}
                        className="bg-[#0F2C59] text-white hover:bg-[#0A1F3F] text-xs font-semibold px-4 py-2"
                    >
                        <PlusIcon className="w-4 h-4 mr-1.5" />
                        Catat Prestasi Baru
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 border border-[#E2DFD7] rounded-xs shadow-2xs">
                    <div className="flex flex-wrap gap-1">
                        {[
                            { key: 'all', label: 'Semua Tingkat' },
                            { key: 'internasional', label: 'Internasional' },
                            { key: 'nasional', label: 'Nasional' },
                            { key: 'provinsi', label: 'Provinsi' },
                            { key: 'kabupaten', label: 'Kabupaten/Kota' },
                        ].map((lvl) => (
                            <button
                                key={lvl.key}
                                type="button"
                                onClick={() => handleLevelClick(lvl.key)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-xs transition ${
                                    activeLevel === lvl.key
                                        ? 'bg-[#0F2C59] text-white'
                                        : 'text-[#5A626A] hover:bg-[#FAF9F6] hover:text-[#1A2228]'
                                }`}
                            >
                                {lvl.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-72">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3 top-2.5" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama siswa atau lomba..."
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
                                <th className="p-3.5 w-16 text-center">Foto</th>
                                <th className="p-3.5">Judul Capaian & Siswa</th>
                                <th className="p-3.5">Nama Kompetisi</th>
                                <th className="p-3.5">Tingkat</th>
                                <th className="p-3.5">Peringkat & Tahun</th>
                                <th className="p-3.5 text-right w-28">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DFD7] text-xs">
                            {achievements.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#5A626A]">
                                        Belum ada catatan prestasi yang tersimpan.
                                    </td>
                                </tr>
                            ) : (
                                achievements.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#FAF9F6]/80 transition">
                                        <td className="p-3 text-center">
                                            <div className="w-12 h-12 bg-[#F4F0EA] border border-[#D8D2C6] rounded-xs overflow-hidden flex items-center justify-center mx-auto">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <TrophyIcon className="w-5 h-5 text-[#C85A32]" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-serif font-bold text-sm text-[#1A2228]">
                                                {item.title}
                                            </div>
                                            <div className="text-[11px] text-[#5A626A] mt-0.5">
                                                Siswa: <span className="font-medium text-[#1A2228]">{item.student_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium text-[#1A2228]">
                                                {item.competition_name}
                                            </div>
                                            {item.description && (
                                                <div className="text-[11px] text-[#5A626A] line-clamp-1 mt-0.5">
                                                    {item.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-xs uppercase tracking-wider ${
                                                    item.level === 'internasional'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        : item.level === 'nasional'
                                                        ? 'bg-[#0F2C59] text-white'
                                                        : item.level === 'provinsi'
                                                        ? 'bg-[#C85A32]/10 text-[#C85A32] border border-[#C85A32]/20'
                                                        : 'bg-stone-100 text-stone-700'
                                                }`}
                                            >
                                                {item.level}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-[#1A2228]">
                                                {item.rank}
                                            </div>
                                            <div className="text-[11px] text-[#5A626A] font-mono mt-0.5">
                                                Tahun {item.year}
                                            </div>
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
                {achievements.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {achievements.links.map((link, i) => (
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

            {/* Modal Tambah / Sunting Prestasi */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg bg-white border border-[#D8D2C6] p-6 shadow-xl">
                    <DialogHeader className="border-b border-[#E2DFD7] pb-3">
                        <DialogTitle className="text-lg font-serif font-bold text-[#1A2228]">
                            {editingItem ? 'Sunting Data Prestasi' : 'Catat Prestasi Siswa Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Judul Prestasi / Capaian *
                            </Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Contoh: Medali Emas Olimpiade Sains Nasional"
                                required
                                className="mt-1 text-xs border-[#D8D2C6]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Nama Siswa / Tim *
                                </Label>
                                <Input
                                    value={form.student_name}
                                    onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                                    placeholder="Nama peraih prestasi"
                                    required
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Tingkat Kompetisi *
                                </Label>
                                <select
                                    value={form.level}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            level: e.target.value as 'kabupaten' | 'provinsi' | 'nasional' | 'internasional',
                                        })
                                    }
                                    className="mt-1 w-full h-9 px-3 text-xs border border-[#D8D2C6] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                                >
                                    <option value="kabupaten">Tingkat Kabupaten / Kota</option>
                                    <option value="provinsi">Tingkat Provinsi</option>
                                    <option value="nasional">Tingkat Nasional</option>
                                    <option value="internasional">Tingkat Internasional</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Nama Penyelenggara / Lomba *
                            </Label>
                            <Input
                                value={form.competition_name}
                                onChange={(e) => setForm({ ...form, competition_name: e.target.value })}
                                placeholder="Contoh: Festival dan Lomba Seni Siswa Nasional (FLS2N)"
                                required
                                className="mt-1 text-xs border-[#D8D2C6]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Peringkat / Medali *
                                </Label>
                                <Input
                                    value={form.rank}
                                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                                    placeholder="Contoh: Juara 1 / Medali Emas"
                                    required
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-[#1A2228]">
                                    Tahun Perolehan *
                                </Label>
                                <Input
                                    type="number"
                                    value={form.year}
                                    onChange={(e) =>
                                        setForm({ ...form, year: parseInt(e.target.value) || 2026 })
                                    }
                                    required
                                    className="mt-1 text-xs border-[#D8D2C6]"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228]">
                                Keterangan Tambahan / Deskripsi Karya
                            </Label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Catatan singkat mengenai karya atau jalannya perlombaan..."
                                rows={2}
                                className="mt-1 w-full p-2.5 text-xs border border-[#D8D2C6] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                            />
                        </div>

                        {/* Foto Dokumentasi */}
                        <div>
                            <Label className="text-xs font-semibold text-[#1A2228] mb-1 block">
                                Foto Piagam / Dokumentasi Penyerahan
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#F4F0EA] border border-[#D8D2C6] rounded-xs overflow-hidden flex items-center justify-center shrink-0">
                                    {form.image ? (
                                        <img
                                            src={form.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%238C949D"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>';
                                            }}
                                        />
                                    ) : (
                                        <PhotoIcon className="w-5 h-5 text-[#8C949D]" />
                                    )}
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                        placeholder="URL foto atau pilih dari Pustaka Media"
                                        className="text-xs border-[#D8D2C6] h-8"
                                    />
                                    <MediaPickerModal
                                        title="Pilih Foto Piagam/Dokumentasi"
                                        allowedTypes="images"
                                        onSelect={(url) => setForm({ ...form, image: url })}
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
                                    {form.image && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setForm({ ...form, image: '' })}
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs h-8 whitespace-nowrap"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5 mr-1" />
                                            Hapus Foto
                                        </Button>
                                    )}
                                </div>
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
                                {editingItem ? 'Simpan Perubahan' : 'Simpan Prestasi'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
                title="Hapus Catatan Prestasi"
                description={`Apakah Anda yakin ingin menghapus catatan prestasi "${deleteModal.item?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Iya, Hapus"
                cancelText="Tidak"
                variant="danger"
                loading={deleteModal.loading}
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

