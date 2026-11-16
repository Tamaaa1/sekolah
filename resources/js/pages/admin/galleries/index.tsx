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
    CalendarDaysIcon,
    CameraIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PhotoIcon,
    PlusIcon,
    TrashIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface GalleryPhoto {
    url: string;
    caption?: string;
    [key: string]: any;
}

interface GalleryItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string | null;
    cover_image: string | null;
    event_date: string | null;
    images: GalleryPhoto[] | null;
    is_active: boolean;
    sort_order: number;
}

interface GalleryPageProps {
    galleries: {
        data: GalleryItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: string[];
    counts?: {
        all: number;
        active: number;
        inactive: number;
    };
    currentStatus?: string;
    filters: {
        q?: string;
        category?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Galeri Kegiatan',
        href: '/admin/galleries',
    },
];

const CATEGORY_PRESETS = [
    'Kegiatan Akademik',
    'Upacara & Peringatan',
    'Ekstrakurikuler',
    'Olahraga & Prestasi',
    'Seni & Budaya',
    'Seremoni Sekolah',
    'Kunjungan & Studi',
];

export default function GalleryIndex({
    galleries,
    categories,
    counts,
    currentStatus = '',
    filters,
}: GalleryPageProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: 'Kegiatan Akademik',
        description: '',
        cover_image: '',
        event_date: new Date().toISOString().split('T')[0],
        images: [] as GalleryPhoto[],
        is_active: true,
        sort_order: 0,
    });
    const [processing, setProcessing] = useState(false);

    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const handleFilter = (statusVal = currentStatus, qVal = search, catVal = selectedCategory) => {
        router.get(
            '/admin/galleries',
            {
                q: qVal || undefined,
                category: catVal || undefined,
                status: statusVal || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter(currentStatus, search, selectedCategory);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            category: 'Kegiatan Akademik',
            description: '',
            cover_image: '',
            event_date: new Date().toISOString().split('T')[0],
            images: [],
            is_active: true,
            sort_order: (galleries.data.length || 0) + 1,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: GalleryItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            category: item.category,
            description: item.description || '',
            cover_image: item.cover_image || '',
            event_date: item.event_date ? item.event_date.split('T')[0] : '',
            images: Array.isArray(item.images) ? item.images : [],
            is_active: item.is_active,
            sort_order: item.sort_order,
        });
        setIsModalOpen(true);
    };

    const addPhotoToAlbum = (url: string) => {
        setFormData((prev) => {
            const nextImages = [...prev.images, { url, caption: '' }];
            return {
                ...prev,
                images: nextImages,
                cover_image: prev.cover_image || url,
            };
        });
    };

    const updatePhotoCaption = (index: number, caption: string) => {
        setFormData((prev) => {
            const nextImages = [...prev.images];
            nextImages[index] = { ...nextImages[index], caption };
            return { ...prev, images: nextImages };
        });
    };

    const removePhotoFromAlbum = (index: number) => {
        setFormData((prev) => {
            const nextImages = prev.images.filter((_, i) => i !== index);
            return {
                ...prev,
                images: nextImages,
                cover_image: prev.cover_image === prev.images[index]?.url ? (nextImages[0]?.url || '') : prev.cover_image,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (editingItem) {
            router.put(`/admin/galleries/${editingItem.id}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Album kegiatan berhasil diperbarui.');
                },
                onError: () => toast.error('Gagal memperbarui album.'),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/admin/galleries', formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Album kegiatan baru berhasil ditambahkan.');
                },
                onError: () => toast.error('Gagal menambahkan album kegiatan.'),
                onFinish: () => setProcessing(false),
            });
        }
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        router.delete(`/admin/galleries/${itemToDelete.id}`, {
            onSuccess: () => {
                setItemToDelete(null);
                toast.success('Album kegiatan berhasil dihapus.');
            },
            onError: () => toast.error('Gagal menghapus album.'),
        });
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Galeri Kegiatan - Admin" />

            <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">
                            Manajemen Galeri Kegiatan
                        </h1>
                        <p className="text-xs text-ink-muted mt-0.5">
                            Kelola album foto momen upacara, perlombaan, dan ragam dokumentasi kegiatan.
                        </p>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Tambah Album Galeri</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                        {[
                            { key: '', label: `Semua (${counts?.all ?? galleries.total})` },
                            { key: 'active', label: `Diterbitkan (${counts?.active ?? 0})` },
                            { key: 'inactive', label: `Draf (${counts?.inactive ?? 0})` },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleFilter(tab.key, search, selectedCategory)}
                                className={`px-3 py-1.5 rounded border transition-colors ${
                                    (currentStatus || '') === tab.key
                                        ? 'bg-prussian text-white border-prussian font-semibold'
                                        : 'bg-white text-ink border-sidebar-border hover:bg-canvas-subtle'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {categories.length > 0 && (
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    handleFilter(currentStatus, search, e.target.value);
                                }}
                                className="h-8 text-xs rounded border border-sidebar-border bg-white px-2.5 text-ink focus:outline-hidden focus:border-prussian"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        )}

                        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-60">
                            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
                            <input
                                type="text"
                                placeholder="Cari album kegiatan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 h-8 text-xs rounded border border-sidebar-border bg-white text-ink placeholder:text-ink-muted/70 focus:outline-hidden focus:border-prussian"
                            />
                        </form>
                    </div>
                </div>

                {/* Table & Mobile Cards */}
                <div className="bg-white rounded border border-sidebar-border shadow-xs overflow-hidden">
                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-canvas-subtle/50 text-ink-muted border-b border-sidebar-border uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3 px-4 text-left">Judul Album</th>
                                    <th className="py-3 px-4 text-left w-48 whitespace-nowrap">Kategori</th>
                                    <th className="py-3 px-4 text-center w-36 whitespace-nowrap">Status</th>
                                    <th className="py-3 px-4 text-left w-36 whitespace-nowrap">Tanggal Kegiatan</th>
                                    <th className="py-3 px-4 text-right w-24 whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {galleries.data.length > 0 ? (
                                    galleries.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-canvas-subtle/30 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-ink">
                                                <div className="flex items-center gap-3">
                                                    {item.cover_image ? (
                                                        <img
                                                            src={item.cover_image}
                                                            alt={item.title}
                                                            className="w-12 h-9 object-cover rounded border border-sidebar-border shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-9 rounded bg-canvas-subtle border border-sidebar-border flex items-center justify-center text-ink-muted shrink-0">
                                                            <PhotoIcon className="w-4 h-4 opacity-40" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="line-clamp-1 font-semibold text-ink">{item.title}</div>
                                                        <div className="text-[11px] text-ink-muted font-normal mt-0.5">
                                                            {Array.isArray(item.images) ? item.images.length : 0} Foto Dokumentasi
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] bg-canvas-subtle text-ink font-medium border border-sidebar-border whitespace-nowrap">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                        item.is_active
                                                            ? 'bg-status-published-bg text-status-published border border-emerald-200'
                                                            : 'bg-canvas-subtle text-ink-muted border border-sidebar-border'
                                                    }`}
                                                >
                                                    {item.is_active ? 'PUBLISHED' : 'DRAF'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-ink-muted whitespace-nowrap">
                                                {formatDate(item.event_date)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 rounded text-prussian hover:bg-canvas-subtle border border-sidebar-border transition-colors"
                                                        title="Sunting Album"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemToDelete(item)}
                                                        className="p-1.5 rounded text-status-urgent hover:bg-red-50 border border-sidebar-border transition-colors"
                                                        title="Hapus Album"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-ink-muted italic">
                                            Tidak ada album kegiatan pada kriteria ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Individual Cards */}
                    <div className="md:hidden divide-y divide-sidebar-border bg-[#FAF9F6]">
                        {galleries.data.length > 0 ? (
                            galleries.data.map((item) => (
                                <div key={item.id} className="p-4 space-y-3 bg-white">
                                    <div className="flex items-start justify-between gap-2.5">
                                        <div className="flex items-center gap-2.5">
                                            {item.cover_image && (
                                                <img
                                                    src={item.cover_image}
                                                    alt={item.title}
                                                    className="w-10 h-10 object-cover rounded border border-sidebar-border shrink-0"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-sm text-ink leading-snug">
                                                    {item.title}
                                                </h3>
                                                <span className="text-[11px] text-ink-muted">
                                                    {item.category} • {Array.isArray(item.images) ? item.images.length : 0} Foto
                                                </span>
                                            </div>
                                        </div>
                                        <span
                                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                                item.is_active
                                                    ? 'bg-status-published-bg text-status-published border border-emerald-200'
                                                    : 'bg-canvas-subtle text-ink-muted border border-sidebar-border'
                                            }`}
                                        >
                                            {item.is_active ? 'PUBLISHED' : 'DRAF'}
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p className="text-xs text-ink-secondary line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-ink-muted">
                                        <span>{formatDate(item.event_date)}</span>
                                    </div>

                                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-sidebar-border/70">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-prussian bg-canvas-subtle hover:bg-canvas-subtle/80 border border-sidebar-border transition-colors"
                                        >
                                            <PencilSquareIcon className="w-3.5 h-3.5" />
                                            <span>Sunting</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setItemToDelete(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-status-urgent bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-ink-muted italic">
                                Tidak ada album kegiatan pada kriteria ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {galleries.links && galleries.links.length > 3 && (
                    <div className="bg-white p-3.5 rounded border border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary shadow-2xs">
                        <div>
                            Menampilkan <strong>{galleries.data.length}</strong> dari <strong>{galleries.total}</strong> album kegiatan
                        </div>
                        <div className="flex items-center gap-1">
                            {galleries.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    disabled={!link.url || link.active}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-2.5 py-1 rounded text-xs border ${
                                        link.active
                                            ? 'bg-prussian text-white border-prussian font-semibold'
                                            : link.url
                                            ? 'bg-white border-sidebar-border hover:bg-canvas-subtle text-ink'
                                            : 'text-ink-muted border-sidebar-border/40 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Create/Edit Modal Dialog */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-line text-ink">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-xl font-bold text-ink">
                                {editingItem ? 'Ubah Album Galeri' : 'Tambah Album Galeri Baru'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div>
                                <Label htmlFor="gal-title" className="text-xs font-semibold text-ink">Judul Kegiatan / Album *</Label>
                                <Input
                                    id="gal-title"
                                    type="text"
                                    required
                                    placeholder="Contoh: Upacara Peringatan Hari Sumpah Pemuda 2026"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="mt-1 border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                />
                                {errors.title && <p className="text-xs text-terracotta mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="gal-category" className="text-xs font-semibold text-ink">Kategori Kegiatan *</Label>
                                    <Input
                                        id="gal-category"
                                        type="text"
                                        list="gal-category-presets"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Pilih atau ketik kategori"
                                        className="mt-1 border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                    />
                                    <datalist id="gal-category-presets">
                                        {CATEGORY_PRESETS.map((cat) => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                    {errors.category && <p className="text-xs text-terracotta mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="gal-date" className="text-xs font-semibold text-ink">Tanggal Kegiatan</Label>
                                    <Input
                                        id="gal-date"
                                        type="date"
                                        value={formData.event_date}
                                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                        className="mt-1 border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                    />
                                </div>
                            </div>

                            {/* Cover Photo */}
                            <div>
                                <Label htmlFor="gal-cover" className="text-xs font-semibold text-ink">Foto Sampul Utama Album</Label>
                                <div className="mt-1 flex gap-2">
                                    <Input
                                        id="gal-cover"
                                        type="text"
                                        placeholder="Pilih dari pustaka atau ketik URL foto..."
                                        value={formData.cover_image}
                                        onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                        className="border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                    />
                                    <MediaPickerModal
                                        title="Pilih Sampul Album"
                                        allowedTypes="images"
                                        onSelect={(url) => setFormData({ ...formData, cover_image: url })}
                                        trigger={
                                            <Button type="button" variant="outline" className="gap-1.5 shrink-0 border-line text-ink hover:bg-canvas-subtle text-xs">
                                                <PhotoIcon className="w-4 h-4" />
                                                Pustaka
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Photo Items in Album */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-ink">Koleksi Foto Kegiatan ({formData.images.length} Foto)</Label>
                                    <MediaPickerModal
                                        title="Tambah Foto ke Album"
                                        allowedTypes="images"
                                        onSelect={(url) => addPhotoToAlbum(url)}
                                        trigger={
                                            <Button type="button" size="sm" variant="outline" className="gap-1.5 text-xs border-line text-ink hover:bg-canvas-subtle">
                                                <PlusIcon className="w-3.5 h-3.5" />
                                                Tambah Foto
                                            </Button>
                                        }
                                    />
                                </div>

                                {formData.images.length === 0 ? (
                                    <div className="mt-2 p-6 rounded-lg border border-dashed border-line text-center text-xs text-ink-muted bg-canvas-subtle/30">
                                        Belum ada foto dalam album ini. Klik tombol "Tambah Foto" di atas untuk menambahkan dokumentasi.
                                    </div>
                                ) : (
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-lg border-line bg-canvas-subtle/20">
                                        {formData.images.map((photo, idx) => (
                                            <div
                                                key={idx}
                                                className="relative flex items-center gap-2 p-2 rounded-lg bg-white border border-line shadow-2xs"
                                            >
                                                <img
                                                    src={photo.url}
                                                    alt="Photo"
                                                    className="w-14 h-14 object-cover rounded-md shrink-0 border border-line"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <Input
                                                        type="text"
                                                        placeholder="Tulis takarir (caption)..."
                                                        value={photo.caption || ''}
                                                        onChange={(e) => updatePhotoCaption(idx, e.target.value)}
                                                        className="h-8 text-xs border-line focus:border-prussian focus:ring-prussian bg-white text-ink"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removePhotoFromAlbum(idx)}
                                                    className="p-1 text-ink-muted hover:text-terracotta hover:bg-terracotta-light rounded transition-colors"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="gal-desc" className="text-xs font-semibold text-ink">Deskripsi Kegiatan</Label>
                                <textarea
                                    id="gal-desc"
                                    rows={3}
                                    placeholder="Jelaskan ringkasan jalannya kegiatan, lokasi, peserta, dan tujuan acara..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-prussian focus:outline-hidden focus:ring-1 focus:ring-prussian leading-relaxed"
                                />
                            </div>

                            {/* Active & Sort */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="gal-active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded border-line text-prussian focus:ring-prussian w-4 h-4"
                                    />
                                    <Label htmlFor="gal-active" className="cursor-pointer text-xs font-medium text-ink">
                                        Tampilkan di halaman publik (Status Aktif)
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2 justify-end">
                                    <Label htmlFor="gal-sort" className="text-xs shrink-0 text-ink-secondary">
                                        Urutan Tampil:
                                    </Label>
                                    <Input
                                        id="gal-sort"
                                        type="number"
                                        min="0"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        className="w-24 h-8 text-xs border-line focus:border-prussian focus:ring-prussian bg-white text-ink"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-line">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={processing}
                                    className="border-line text-ink hover:bg-canvas-subtle text-xs"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-prussian hover:bg-prussian-hover text-white text-xs font-semibold px-4 py-2 shadow-xs"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Buat Album'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    open={!!itemToDelete}
                    onOpenChange={(open) => !open && setItemToDelete(null)}
                    title="Hapus Album Galeri"
                    description={`Apakah Anda yakin ingin menghapus album "${itemToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    variant="danger"
                    onConfirm={confirmDelete}
                />
            </div>
        </AppLayout>
    );
}
