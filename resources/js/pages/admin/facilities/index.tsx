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
    BuildingOffice2Icon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PhotoIcon,
    PlusIcon,
    TrashIcon,
    MapPinIcon,
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface FacilityItem {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string | null;
    image: string | null;
    capacity: string | null;
    location: string | null;
    features: string[] | null;
    is_active: boolean;
    sort_order: number;
}

interface FacilityPageProps {
    facilities: {
        data: FacilityItem[];
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
        title: 'Sarana & Fasilitas',
        href: '/admin/facilities',
    },
];

const CATEGORY_PRESETS = [
    'Ruang Pembelajaran',
    'Sarana Olahraga',
    'Fasilitas Penunjang',
    'Tempat Ibadah',
    'Ruang Layanan Siswa',
];

export default function FacilityIndex({
    facilities,
    categories,
    filters,
}: FacilityPageProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FacilityItem | null>(null);
    const [facilityToDelete, setFacilityToDelete] = useState<FacilityItem | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'Ruang Pembelajaran',
        description: '',
        image: '',
        capacity: '',
        location: '',
        features: [] as string[],
        is_active: true,
        sort_order: 0,
    });
    const [featureInput, setFeatureInput] = useState('');
    const [processing, setProcessing] = useState(false);

    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const handleFilter = (qVal = search, catVal = selectedCategory) => {
        router.get(
            '/admin/facilities',
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
            name: '',
            category: 'Ruang Pembelajaran',
            description: '',
            image: '',
            capacity: '',
            location: '',
            features: [],
            is_active: true,
            sort_order: (facilities.data.length || 0) + 1,
        });
        setFeatureInput('');
        setIsModalOpen(true);
    };

    const openEditModal = (item: FacilityItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            category: item.category,
            description: item.description || '',
            image: item.image || '',
            capacity: item.capacity || '',
            location: item.location || '',
            features: Array.isArray(item.features) ? item.features : [],
            is_active: item.is_active,
            sort_order: item.sort_order,
        });
        setFeatureInput('');
        setIsModalOpen(true);
    };

    const addFeature = () => {
        const val = featureInput.trim();
        if (val && !formData.features.includes(val)) {
            setFormData({
                ...formData,
                features: [...formData.features, val],
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (editingItem) {
            router.put(`/admin/facilities/${editingItem.id}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Data fasilitas berhasil diperbarui.');
                },
                onError: () => toast.error('Gagal memperbarui data fasilitas.'),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/admin/facilities', formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Fasilitas baru berhasil ditambahkan.');
                },
                onError: () => toast.error('Gagal menambahkan fasilitas.'),
                onFinish: () => setProcessing(false),
            });
        }
    };

    const confirmDelete = () => {
        if (!facilityToDelete) return;
        router.delete(`/admin/facilities/${facilityToDelete.id}`, {
            onSuccess: () => {
                setFacilityToDelete(null);
                toast.success('Fasilitas berhasil dihapus.');
            },
            onError: () => toast.error('Gagal menghapus fasilitas.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Sarana & Fasilitas - Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2.5">
                            <BuildingOffice2Icon className="w-7 h-7 text-prussian" />
                            Sarana & Fasilitas Sekolah
                        </h1>
                        <p className="text-xs text-ink-secondary mt-1 font-sans">
                            Kelola direktori sarana prasarana, laboratorium, sarana olahraga, dan fasilitas penunjang belajar mengajar ({facilities.total} fasilitas terdata).
                        </p>
                    </div>

                    <Button onClick={openCreateModal} className="bg-prussian hover:bg-prussian-hover text-white text-xs font-semibold px-4 py-2 gap-1.5 shadow-xs">
                        <PlusIcon className="w-4 h-4" />
                        Tambah Fasilitas Baru
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-line shadow-2xs">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                        <Input
                            type="text"
                            placeholder="Cari fasilitas, lokasi, atau deskripsi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 text-xs h-9 border-line focus:border-prussian focus:ring-prussian bg-white text-ink"
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
                                className="text-xs border-line text-ink hover:bg-canvas-subtle"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Facilities Grid / Table */}
                {facilities.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-line">
                        <BuildingOffice2Icon className="w-12 h-12 text-ink-muted/40 mb-3" />
                        <p className="text-base font-serif font-bold text-ink">
                            Belum ada data fasilitas
                        </p>
                        <p className="text-xs text-ink-secondary max-w-sm mt-1">
                            Fasilitas yang Anda tambahkan akan ditampilkan di halaman publik untuk memberikan informasi sarana sekolah.
                        </p>
                        <Button onClick={openCreateModal} className="mt-4 bg-prussian hover:bg-prussian-hover text-white text-xs font-semibold px-4 py-2 gap-1.5 shadow-xs">
                            <PlusIcon className="w-4 h-4" />
                            Tambah Fasilitas Pertama
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {facilities.data.map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex flex-col rounded-lg border border-line bg-white shadow-2xs overflow-hidden hover:border-line-strong hover:shadow-xs transition"
                            >
                                {/* Thumbnail Image */}
                                <div className="relative aspect-video w-full bg-canvas-subtle overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-ink-muted/50">
                                            <PhotoIcon className="w-12 h-12 opacity-40" />
                                        </div>
                                    )}

                                    {/* Category & Status Overlay Badges */}
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
                                </div>

                                {/* Content Details */}
                                <div className="flex flex-1 flex-col p-4 justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-serif font-bold text-base text-ink line-clamp-1 group-hover:text-prussian transition-colors">
                                                {item.name}
                                            </h3>
                                            <span className="text-xs text-ink-muted font-mono shrink-0">
                                                #{item.sort_order}
                                            </span>
                                        </div>

                                        <p className="text-xs text-ink-secondary mt-1.5 line-clamp-2 leading-relaxed">
                                            {item.description || 'Tidak ada deskripsi rinci.'}
                                        </p>

                                        {/* Meta Tags (Location & Capacity) */}
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-secondary">
                                            {item.location && (
                                                <div className="inline-flex items-center gap-1 bg-canvas-subtle px-2 py-0.5 rounded border border-line/60">
                                                    <MapPinIcon className="w-3.5 h-3.5 text-ink-muted" />
                                                    <span>{item.location}</span>
                                                </div>
                                            )}
                                            {item.capacity && (
                                                <div className="inline-flex items-center gap-1 bg-canvas-subtle px-2 py-0.5 rounded border border-line/60">
                                                    <UserGroupIcon className="w-3.5 h-3.5 text-ink-muted" />
                                                    <span>{item.capacity}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Feature Chips */}
                                        {Array.isArray(item.features) && item.features.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1">
                                                {item.features.slice(0, 3).map((feat, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-block text-[11px] px-2 py-0.5 rounded bg-prussian-light text-prussian border border-prussian/20 font-medium"
                                                    >
                                                        {feat}
                                                    </span>
                                                ))}
                                                {item.features.length > 3 && (
                                                    <span className="text-[11px] px-1.5 py-0.5 text-ink-muted">
                                                        +{item.features.length - 3} lainnya
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer Actions */}
                                    <div className="mt-4 pt-3 border-t border-line flex items-center justify-end gap-1.5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(item)}
                                            className="h-8 px-2.5 text-xs gap-1 text-ink hover:text-prussian hover:bg-canvas-subtle"
                                        >
                                            <PencilSquareIcon className="w-3.5 h-3.5" />
                                            Ubah
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setFacilityToDelete(item)}
                                            className="h-8 px-2.5 text-xs gap-1 text-terracotta hover:text-terracotta-hover hover:bg-terracotta-light"
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
                {facilities.links && facilities.links.length > 3 && (
                    <div className="bg-white p-3.5 rounded-lg border border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary shadow-2xs">
                        <div>
                            Menampilkan <strong>{facilities.data.length}</strong> dari <strong>{facilities.total}</strong> fasilitas
                        </div>
                        <div className="flex items-center gap-1">
                            {facilities.links.map((link, idx) => (
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
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-xl font-bold text-ink">
                                {editingItem ? 'Ubah Data Fasilitas' : 'Tambah Fasilitas Baru'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div>
                                <Label htmlFor="fac-name" className="text-xs font-semibold text-ink">Nama Fasilitas *</Label>
                                <Input
                                    id="fac-name"
                                    type="text"
                                    required
                                    placeholder="Contoh: Laboratorium Komputer Modern"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                />
                                {errors.name && <p className="text-xs text-terracotta mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="fac-category" className="text-xs font-semibold text-ink">Kategori *</Label>
                                    <div className="mt-1 flex gap-2">
                                        <Input
                                            id="fac-category"
                                            type="text"
                                            list="category-options"
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="Pilih atau ketik kategori"
                                            className="border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                        />
                                        <datalist id="category-options">
                                            {CATEGORY_PRESETS.map((cat) => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                    </div>
                                    {errors.category && <p className="text-xs text-terracotta mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="fac-location" className="text-xs font-semibold text-ink">Lokasi / Gedung</Label>
                                    <Input
                                        id="fac-location"
                                        type="text"
                                        placeholder="Contoh: Gedung B Lantai 2"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="mt-1 border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="fac-capacity" className="text-xs font-semibold text-ink">Kapasitas / Daya Tampung</Label>
                                    <Input
                                        id="fac-capacity"
                                        type="text"
                                        placeholder="Contoh: 40 Siswa / Unit PC"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        className="mt-1 border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="fac-sort" className="text-xs font-semibold text-ink">Urutan Tampil (Prioritas)</Label>
                                    <Input
                                        id="fac-sort"
                                        type="number"
                                        min="0"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        className="mt-1 border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                    />
                                </div>
                            </div>

                            {/* Features Checklist / Tags */}
                            <div>
                                <Label className="text-xs font-semibold text-ink">Kelengkapan & Fitur Fasilitas</Label>
                                <div className="mt-1 flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Ketik fitur lalu klik Tambah (contoh: AC, Proyektor, WiFi Dedicated)"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addFeature();
                                            }
                                        }}
                                        className="border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                    />
                                    <Button type="button" variant="outline" onClick={addFeature} className="border-line text-ink hover:bg-canvas-subtle shrink-0">
                                        Tambah
                                    </Button>
                                </div>

                                {formData.features.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {formData.features.map((feat, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-prussian-light text-prussian border border-prussian/30 font-medium"
                                            >
                                                <span>{feat}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(idx)}
                                                    className="hover:text-terracotta cursor-pointer"
                                                >
                                                    <XMarkIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Image Attachment */}
                            <div>
                                <Label htmlFor="fac-image" className="text-xs font-semibold text-ink">Foto / Dokumentasi Fasilitas</Label>
                                <div className="mt-1 flex gap-2">
                                    <Input
                                        id="fac-image"
                                        type="text"
                                        placeholder="Pilih dari pustaka media atau ketik URL foto..."
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="border-line focus:border-prussian focus:ring-prussian text-sm bg-white text-ink"
                                    />
                                    <MediaPickerModal
                                        title="Pilih Foto Fasilitas"
                                        allowedTypes="images"
                                        onSelect={(url) => setFormData({ ...formData, image: url })}
                                        trigger={
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="gap-1.5 shrink-0 border-line text-ink hover:bg-canvas-subtle"
                                            >
                                                <PhotoIcon className="w-4 h-4" />
                                                Pustaka Media
                                            </Button>
                                        }
                                    />
                                </div>

                                {formData.image && (
                                    <div className="mt-2 relative w-40 aspect-video rounded-lg overflow-hidden border border-line">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded p-0.5 hover:bg-black/80 cursor-pointer"
                                        >
                                            <XMarkIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="fac-desc" className="text-xs font-semibold text-ink">Deskripsi Fasilitas</Label>
                                <textarea
                                    id="fac-desc"
                                    rows={3}
                                    placeholder="Jelaskan fungsi, spesifikasi, dan manfaat sarana ini bagi siswa..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-prussian focus:outline-hidden focus:ring-1 focus:ring-prussian"
                                />
                            </div>

                            {/* Status Active Toggle */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="fac-active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded border-line text-prussian focus:ring-prussian w-4 h-4"
                                />
                                <Label htmlFor="fac-active" className="cursor-pointer text-xs font-normal text-ink">
                                    Tampilkan di halaman publik (Status Aktif)
                                </Label>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={processing}
                                    className="border-line text-ink hover:bg-canvas-subtle"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-prussian hover:bg-prussian-hover text-white text-xs font-semibold px-4 py-2"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    open={!!facilityToDelete}
                    onOpenChange={(open) => !open && setFacilityToDelete(null)}
                    title="Hapus Data Fasilitas"
                    description={`Apakah Anda yakin ingin menghapus fasilitas "${facilityToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    variant="danger"
                    onConfirm={confirmDelete}
                />
            </div>
        </AppLayout>
    );
}
