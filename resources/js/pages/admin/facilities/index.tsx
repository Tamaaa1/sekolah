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
    counts,
    currentStatus = '',
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

    const handleFilter = (statusVal = currentStatus, qVal = search, catVal = selectedCategory) => {
        router.get(
            '/admin/facilities',
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

            <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">
                            Manajemen Sarana & Fasilitas
                        </h1>
                        <p className="text-xs text-ink-muted mt-0.5">
                            Kelola sarana belajar, gedung, laboratorium, dan fasilitas pendukung sekolah.
                        </p>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Tambah Fasilitas</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                        {[
                            { key: '', label: `Semua (${counts?.all ?? facilities.total})` },
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
                                placeholder="Cari fasilitas..."
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
                                    <th className="py-3 px-4 text-left">Nama Fasilitas</th>
                                    <th className="py-3 px-4 text-left w-48 whitespace-nowrap">Kategori</th>
                                    <th className="py-3 px-4 text-center w-36 whitespace-nowrap">Status</th>
                                    <th className="py-3 px-4 text-left w-48 whitespace-nowrap">Kapasitas / Lokasi</th>
                                    <th className="py-3 px-4 text-right w-24 whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {facilities.data.length > 0 ? (
                                    facilities.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-canvas-subtle/30 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-ink">
                                                <div className="flex items-center gap-3">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-10 h-10 object-cover rounded border border-sidebar-border shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-canvas-subtle border border-sidebar-border flex items-center justify-center text-ink-muted shrink-0">
                                                            <BuildingOffice2Icon className="w-5 h-5 opacity-40" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="line-clamp-1 font-semibold text-ink">{item.name}</div>
                                                        {item.description && (
                                                            <div className="text-[11px] text-ink-muted line-clamp-1 font-normal mt-0.5">
                                                                {item.description}
                                                            </div>
                                                        )}
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
                                                <div>
                                                    {item.location ? <span>{item.location}</span> : <span>-</span>}
                                                    {item.capacity && (
                                                        <span className="text-[11px] text-ink-muted block mt-0.5 font-mono">
                                                            Kapasitas: {item.capacity}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 rounded text-prussian hover:bg-canvas-subtle border border-sidebar-border transition-colors"
                                                        title="Sunting Fasilitas"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFacilityToDelete(item)}
                                                        className="p-1.5 rounded text-status-urgent hover:bg-red-50 border border-sidebar-border transition-colors"
                                                        title="Hapus Fasilitas"
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
                                            Tidak ada data fasilitas pada kriteria ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Individual Cards */}
                    <div className="md:hidden divide-y divide-sidebar-border bg-[#FAF9F6]">
                        {facilities.data.length > 0 ? (
                            facilities.data.map((item) => (
                                <div key={item.id} className="p-4 space-y-3 bg-white">
                                    <div className="flex items-start justify-between gap-2.5">
                                        <div className="flex items-center gap-2.5">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-10 h-10 object-cover rounded border border-sidebar-border shrink-0"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-sm text-ink leading-snug">
                                                    {item.name}
                                                </h3>
                                                <span className="text-[11px] text-ink-muted">
                                                    {item.category}
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

                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                                        <span>{item.location || '-'}</span>
                                        {item.capacity && <span>Kapasitas: {item.capacity}</span>}
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
                                            onClick={() => setFacilityToDelete(item)}
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
                                Tidak ada data fasilitas pada kriteria ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {facilities.links && facilities.links.length > 3 && (
                    <div className="bg-white p-3.5 rounded border border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary shadow-2xs">
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
