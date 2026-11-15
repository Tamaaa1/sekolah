import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
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
    ArrowDownTrayIcon,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    DocumentArrowDownIcon,
    DocumentTextIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface DownloadItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string | null;
    file_path: string;
    file_type: string;
    file_size: string | null;
    download_count: number;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
}

interface DownloadPageProps {
    downloads: {
        data: DownloadItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: string[];
    filters: {
        q?: string;
        category?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pusat Unduhan',
        href: '/admin/downloads',
    },
];

const CATEGORY_PRESETS = [
    'Akademik & Kurikulum',
    'Tata Tertib & Kesiswaan',
    'Formulir Layanan',
    'Panduan & Informasi',
    'Surat Keputusan (SK)',
    'Materi Pembelajaran',
];

export default function DownloadIndex({
    downloads,
    categories,
    filters,
}: DownloadPageProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<DownloadItem | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: 'Akademik & Kurikulum',
        description: '',
        file_path: '',
        file_type: 'PDF',
        file_size: '',
        is_active: true,
        sort_order: 0,
    });
    const [processing, setProcessing] = useState(false);

    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const handleFilter = (qVal = search, catVal = selectedCategory) => {
        router.get(
            '/admin/downloads',
            {
                q: qVal || undefined,
                category: catVal || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter();
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            category: 'Akademik & Kurikulum',
            description: '',
            file_path: '',
            file_type: 'PDF',
            file_size: '',
            is_active: true,
            sort_order: (downloads.data.length || 0) + 1,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: DownloadItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            category: item.category,
            description: item.description || '',
            file_path: item.file_path,
            file_type: item.file_type || 'PDF',
            file_size: item.file_size || '',
            is_active: item.is_active,
            sort_order: item.sort_order,
        });
        setIsModalOpen(true);
    };

    const handleFileSelected = (url: string) => {
        let detectedType = 'PDF';
        const ext = url.split('.').pop()?.toUpperCase() || '';
        if (['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'ZIP', 'RAR'].includes(ext)) {
            detectedType = ext;
        }

        setFormData((prev) => ({
            ...prev,
            file_path: url,
            file_type: detectedType,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (editingItem) {
            router.put(`/admin/downloads/${editingItem.id}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Dokumen unduhan berhasil diperbarui.');
                },
                onError: () => toast.error('Gagal memperbarui berkas unduhan.'),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/admin/downloads', formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Dokumen baru berhasil ditambahkan ke pusat unduhan.');
                },
                onError: () => toast.error('Gagal menambahkan dokumen unduhan.'),
                onFinish: () => setProcessing(false),
            });
        }
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        router.delete(`/admin/downloads/${itemToDelete.id}`, {
            onSuccess: () => {
                setItemToDelete(null);
                toast.success('Dokumen unduhan berhasil dihapus.');
            },
            onError: () => toast.error('Gagal menghapus dokumen.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pusat Unduhan - Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <DocumentArrowDownIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                            Pusat Unduhan Dokumen
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Kelola berkas publik, formulir pendaftaran, kalender akademik, dan surat edaran resmi sekolah.
                        </p>
                    </div>

                    <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm">
                        <PlusIcon className="w-4 h-4" />
                        Tambah Dokumen
                    </Button>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Cari judul dokumen atau deskripsi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 text-sm"
                        />
                    </form>

                    <div className="flex items-center gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                handleFilter(search, e.target.value);
                            }}
                            className="h-9 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-neutral-700 dark:text-neutral-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        {(search || selectedCategory) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearch('');
                                    setSelectedCategory('');
                                    handleFilter('', '');
                                }}
                                className="text-xs"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table Section */}
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
                    {downloads.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <DocumentArrowDownIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-3" />
                            <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Belum ada berkas dokumen
                            </p>
                            <p className="text-sm text-neutral-500 max-w-sm mt-1">
                                Dokumen yang Anda unggah akan tersedia untuk diunduh oleh siswa, orang tua, dan masyarakat umum.
                            </p>
                            <Button onClick={openCreateModal} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                                <PlusIcon className="w-4 h-4" />
                                Tambah Dokumen Pertama
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-300">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Dokumen</th>
                                        <th scope="col" className="px-6 py-4">Kategori</th>
                                        <th scope="col" className="px-6 py-4">Format & Ukuran</th>
                                        <th scope="col" className="px-6 py-4 text-center">Diunduh</th>
                                        <th scope="col" className="px-6 py-4 text-center">Status</th>
                                        <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {downloads.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0 mt-0.5">
                                                        <DocumentTextIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <a
                                                            href={`/unduhan/${item.slug}/file`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-semibold text-neutral-900 dark:text-neutral-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition inline-flex items-center gap-1"
                                                        >
                                                            <span>{item.title}</span>
                                                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-60" />
                                                        </a>
                                                        {item.description && (
                                                            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5 max-w-md">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs">
                                                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                                                        {item.file_type}
                                                    </span>
                                                    {item.file_size && (
                                                        <span className="text-neutral-400 ml-2 font-mono">
                                                            {item.file_size}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                    <ArrowDownTrayIcon className="w-3.5 h-3.5 text-neutral-400" />
                                                    {item.download_count.toLocaleString('id-ID')} kali
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {item.is_active ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                        <CheckCircleIcon className="w-3.5 h-3.5" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                                                        <XCircleIcon className="w-3.5 h-3.5" />
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditModal(item)}
                                                        className="h-8 px-2.5 text-xs gap-1"
                                                    >
                                                        <PencilSquareIcon className="w-3.5 h-3.5" />
                                                        Ubah
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setItemToDelete(item)}
                                                        className="h-8 px-2.5 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
                                                    >
                                                        <TrashIcon className="w-3.5 h-3.5" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Create/Edit Modal Dialog */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? 'Ubah Data Dokumen' : 'Tambah Dokumen Unduhan'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div>
                                <Label htmlFor="doc-title">Judul Dokumen *</Label>
                                <Input
                                    id="doc-title"
                                    type="text"
                                    required
                                    placeholder="Contoh: Kalender Pendidikan TA 2026/2027"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="mt-1"
                                />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="doc-category">Kategori Dokumen *</Label>
                                    <Input
                                        id="doc-category"
                                        type="text"
                                        list="doc-category-presets"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Pilih atau ketik kategori"
                                        className="mt-1"
                                    />
                                    <datalist id="doc-category-presets">
                                        {CATEGORY_PRESETS.map((cat) => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                    {errors.category && <p className="text-xs text-rose-600 mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="doc-size">Ukuran Berkas (Opsional)</Label>
                                    <Input
                                        id="doc-size"
                                        type="text"
                                        placeholder="Contoh: 1.2 MB / 450 KB"
                                        value={formData.file_size}
                                        onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            {/* File Path & Media Picker */}
                            <div>
                                <Label htmlFor="doc-file">Tautan / Berkas File *</Label>
                                <div className="mt-1 flex gap-2">
                                    <Input
                                        id="doc-file"
                                        type="text"
                                        required
                                        placeholder="Pilih berkas dari pustaka atau ketik path/URL berkas..."
                                        value={formData.file_path}
                                        onChange={(e) => handleFileSelected(e.target.value)}
                                    />
                                    <MediaPickerModal
                                        title="Pilih Berkas Dokumen"
                                        allowedTypes="all"
                                        onSelect={(url) => handleFileSelected(url)}
                                        trigger={
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="gap-1.5 shrink-0"
                                            >
                                                <DocumentArrowDownIcon className="w-4 h-4" />
                                                Pustaka Berkas
                                            </Button>
                                        }
                                    />
                                </div>
                                {errors.file_path && <p className="text-xs text-rose-600 mt-1">{errors.file_path}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="doc-type">Tipe Format Berkas</Label>
                                    <Input
                                        id="doc-type"
                                        type="text"
                                        placeholder="PDF, DOCX, XLSX, ZIP"
                                        value={formData.file_type}
                                        onChange={(e) => setFormData({ ...formData, file_type: e.target.value.toUpperCase() })}
                                        className="mt-1 font-mono uppercase"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="doc-sort">Urutan Tampil</Label>
                                    <Input
                                        id="doc-sort"
                                        type="number"
                                        min="0"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="doc-desc">Deskripsi Dokumen</Label>
                                <textarea
                                    id="doc-desc"
                                    rows={3}
                                    placeholder="Jelaskan isi singkat atau petunjuk penggunaan dokumen ini..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Active status */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="doc-active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                />
                                <Label htmlFor="doc-active" className="cursor-pointer text-sm font-normal">
                                    Tampilkan di halaman publik (Status Aktif)
                                </Label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={processing}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Dokumen'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    open={!!itemToDelete}
                    onOpenChange={(open) => !open && setItemToDelete(null)}
                    title="Hapus Dokumen Unduhan"
                    description={`Apakah Anda yakin ingin menghapus berkas "${itemToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    variant="danger"
                    onConfirm={confirmDelete}
                />
            </div>
        </AppLayout>
    );
}
