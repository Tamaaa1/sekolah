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
    filters: {
        q?: string;
        category?: string;
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

    const handleFilter = (qVal = search, catVal = selectedCategory) => {
        router.get(
            '/admin/galleries',
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Galeri Kegiatan - Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2.5">
                            <CameraIcon className="w-7 h-7 text-prussian" />
                            Galeri & Dokumentasi Kegiatan
                        </h1>
                        <p className="text-xs text-ink-secondary mt-1">
                            Kelola album foto momen bersejarah, upacara, perlombaan, dan ragam kegiatan sekolah.
                        </p>
                    </div>

                    <Button onClick={openCreateModal} className="bg-prussian hover:bg-prussian-hover text-white text-xs font-semibold px-4 py-2 gap-1.5 shadow-xs">
                        <PlusIcon className="w-4 h-4" />
                        Tambah Album Foto
                    </Button>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-line shadow-2xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                        <Input
                            type="text"
                            placeholder="Cari judul album atau deskripsi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 text-xs h-9 border-line focus:border-prussian focus:ring-prussian bg-white text-ink placeholder:text-ink-muted/70"
                        />
                    </form>

                    <div className="flex items-center gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                handleFilter(search, e.target.value);
                            }}
                            className="h-9 text-xs rounded-md border border-line bg-white px-3 text-ink focus:border-prussian focus:outline-hidden focus:ring-1 focus:ring-prussian"
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
                                className="text-xs h-9 border-line text-ink hover:bg-canvas-subtle"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Galleries Grid */}
                {galleries.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-line">
                        <CameraIcon className="w-12 h-12 text-ink-muted/40 mb-3" />
                        <p className="text-base font-serif font-bold text-ink">
                            Belum ada album galeri
                        </p>
                        <p className="text-xs text-ink-secondary max-w-sm mt-1">
                            Abadikan momen kegiatan siswa, pentas seni, dan agenda sekolah dalam album foto yang rapi.
                        </p>
                        <Button onClick={openCreateModal} className="mt-4 bg-prussian hover:bg-prussian-hover text-white text-xs font-semibold px-4 py-2 gap-1.5 shadow-xs">
                            <PlusIcon className="w-4 h-4" />
                            Buat Album Pertama
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {galleries.data.map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex flex-col rounded-lg border border-line bg-white shadow-2xs overflow-hidden hover:border-line-strong hover:shadow-xs transition"
                            >
                                {/* Thumbnail Cover */}
                                <div className="relative aspect-video w-full bg-canvas-subtle overflow-hidden">
                                    {item.cover_image ? (
                                        <img
                                            src={item.cover_image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-ink-muted/50">
                                            <PhotoIcon className="w-12 h-12 opacity-40" />
                                        </div>
                                    )}

                                    {/* Category & Status Overlay */}
                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-ink backdrop-blur-xs border border-line/80 shadow-2xs">
                                            {item.category}
                                        </span>
                                    </div>

                                    <div className="absolute top-2.5 right-2.5">
                                        {item.is_active ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-status-published/95 text-white backdrop-blur-xs shadow-2xs">
                                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-ink-muted/90 text-white backdrop-blur-xs">
                                                <XCircleIcon className="w-3.5 h-3.5" />
                                                Nonaktif
                                            </span>
                                        )}
                                    </div>

                                    {/* Photo Count Pill */}
                                    <div className="absolute bottom-2.5 right-2.5">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-prussian/85 text-white backdrop-blur-xs font-mono shadow-2xs">
                                            <PhotoIcon className="w-3.5 h-3.5" />
                                            {Array.isArray(item.images) ? item.images.length : 0} Foto
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="flex flex-1 flex-col p-4 justify-between">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-1.5 font-mono">
                                            <CalendarDaysIcon className="w-3.5 h-3.5" />
                                            <span>
                                                {item.event_date
                                                    ? new Date(item.event_date).toLocaleDateString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      })
                                                    : 'Tanggal tidak diset'}
                                            </span>
                                        </div>

                                        <h3 className="font-serif font-bold text-base text-ink line-clamp-2 group-hover:text-prussian transition-colors">
                                            {item.title}
                                        </h3>

                                        <p className="text-xs text-ink-secondary mt-1.5 line-clamp-2 leading-relaxed">
                                            {item.description || 'Tidak ada deskripsi singkat.'}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditModal(item)}
                                            className="h-8 px-2.5 text-xs gap-1 border-line text-ink hover:text-prussian hover:bg-canvas-subtle"
                                        >
                                            <PencilSquareIcon className="w-3.5 h-3.5" />
                                            Ubah
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setItemToDelete(item)}
                                            className="h-8 px-2.5 text-xs gap-1 text-terracotta hover:text-terracotta-hover hover:bg-terracotta-light border-terracotta/30"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {galleries.links && galleries.links.length > 3 && (
                    <div className="bg-white p-3.5 rounded-lg border border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary shadow-2xs">
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
                                            ? 'bg-white border-line hover:bg-canvas-subtle text-ink'
                                            : 'text-ink-muted border-line/40 cursor-not-allowed'
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
