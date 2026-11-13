import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowUpTrayIcon,
    DocumentIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    Squares2X2Icon,
    TableCellsIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    file_path: string;
    url: string;
    mime_type: string;
    size: number;
    alt_text?: string;
    created_at: string;
}

interface MediaPageProps {
    media: {
        data: MediaItem[];
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
        title: 'Pustaka Media',
        href: '/admin/media',
    },
];

export default function MediaIndex({ media, filters }: MediaPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [uploading, setUploading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        item: MediaItem | null;
        loading: boolean;
    }>({ open: false, item: null, loading: false });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/media', { search }, { preserveState: true, replace: true });
    };

    const handleUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        router.post('/admin/media', formData, {
            onSuccess: () => {
                toast.success('Berkas berhasil diunggah ke Pustaka Media.');
            },
            onError: () => {
                toast.error('Gagal mengunggah berkas. Pastikan ukuran di bawah 10MB.');
            },
            onFinish: () => setUploading(false),
            preserveScroll: true,
        });
    };

    const handleDelete = (item: MediaItem) => {
        setDeleteModal({ open: true, item, loading: false });
    };

    const confirmDelete = () => {
        if (!deleteModal.item) return;
        setDeleteModal((prev) => ({ ...prev, loading: true }));
        router.delete(`/admin/media/${deleteModal.item.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Berkas "${deleteModal.item?.name}" berhasil dihapus.`);
                setDeleteModal({ open: false, item: null, loading: false });
            },
            onError: () => {
                toast.error('Gagal menghapus berkas.');
                setDeleteModal((prev) => ({ ...prev, loading: false }));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pustaka Media - Panel Admin" />

            <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD7] pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#1A2228] tracking-tight">
                            Pustaka Media
                        </h1>
                        <p className="text-xs text-[#5A626A] mt-1 font-sans">
                            Kelola semua berkas gambar, foto dokumentasi, dan surat edaran PDF sekolah ({media.total} berkas terdata).
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#0F2C59] text-white text-xs font-semibold rounded-xs hover:bg-[#0A1F3F] transition shadow-xs">
                            <ArrowUpTrayIcon className="w-4 h-4 mr-1.5" />
                            <span>{uploading ? 'Mengunggah...' : 'Unggah Berkas'}</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => handleUpload(e.target.files)}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>

                {/* Filter, Search, and View Mode Toggle */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 border border-[#E2DFD7] rounded-xs shadow-2xs">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-80">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3 top-2.5" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama berkas..."
                                className="pl-9 text-xs border-[#D8D2C6] h-9 bg-white"
                            />
                        </div>
                        <Button type="submit" variant="outline" className="border-[#D8D2C6] text-xs h-9">
                            Cari
                        </Button>
                    </form>

                    <div className="flex items-center gap-1 border border-[#D8D2C6] p-0.5 rounded-xs bg-[#FAF9F6] self-end sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-xs text-xs font-medium flex items-center gap-1.5 transition ${
                                viewMode === 'table'
                                    ? 'bg-[#0F2C59] text-white shadow-2xs'
                                    : 'text-[#5A626A] hover:text-[#1A2228] hover:bg-white'
                            }`}
                            title="Tampilan Tabel"
                        >
                            <TableCellsIcon className="w-4 h-4" />
                            <span className="text-[11px]">Tabel</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-xs text-xs font-medium flex items-center gap-1.5 transition ${
                                viewMode === 'grid'
                                    ? 'bg-[#0F2C59] text-white shadow-2xs'
                                    : 'text-[#5A626A] hover:text-[#1A2228] hover:bg-white'
                            }`}
                            title="Tampilan Grid Galeri"
                        >
                            <Squares2X2Icon className="w-4 h-4" />
                            <span className="text-[11px]">Grid</span>
                        </button>
                    </div>
                </div>

                {/* Content: Empty State, Table View, or Grid View */}
                {media.data.length === 0 ? (
                    <div className="bg-white border border-[#E2DFD7] p-12 text-center rounded-xs shadow-2xs">
                        <PhotoIcon className="w-12 h-12 text-[#5A626A] mx-auto mb-3 stroke-1" />
                        <h3 className="text-base font-serif font-bold text-[#1A2228]">
                            Pustaka Media Masih Kosong
                        </h3>
                        <p className="text-xs text-[#5A626A] mt-1 max-w-sm mx-auto">
                            Klik tombol &ldquo;Unggah Berkas&rdquo; di kanan atas untuk menambahkan foto berita, logo, atau dokumen PDF.
                        </p>
                    </div>
                ) : viewMode === 'table' ? (
                    <div className="bg-white border border-[#E2DFD7] rounded-xs overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#FAF9F6] border-b border-[#E2DFD7] text-[11px] font-semibold text-[#5A626A] uppercase tracking-wider">
                                        <th className="p-3.5 w-16 text-center whitespace-nowrap">Pratinjau</th>
                                        <th className="p-3.5">Nama Berkas</th>
                                        <th className="p-3.5 w-32 whitespace-nowrap">Tipe</th>
                                        <th className="p-3.5 w-28 whitespace-nowrap">Ukuran</th>
                                        <th className="p-3.5 w-36 whitespace-nowrap">Tanggal Unggah</th>
                                        <th className="p-3.5 text-right w-28 whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2DFD7] text-xs">
                                    {media.data.map((item) => {
                                        const isImage = item.mime_type.startsWith('image/');
                                        return (
                                            <tr key={item.id} className="hover:bg-[#FAF9F6]/80 transition">
                                                <td className="p-3 text-center">
                                                    <div className="w-12 h-12 bg-[#F4F0EA] border border-[#D8D2C6] rounded-xs overflow-hidden flex items-center justify-center mx-auto">
                                                        {isImage ? (
                                                            <img
                                                                src={item.url}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <DocumentIcon className="w-6 h-6 text-[#0F2C59]" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-semibold text-sm text-[#1A2228] line-clamp-1" title={item.name}>
                                                        {item.name}
                                                    </div>
                                                    <div className="text-[11px] text-[#5A626A] font-mono line-clamp-1 mt-0.5">
                                                        {item.file_name}
                                                    </div>
                                                </td>
                                                <td className="p-3 whitespace-nowrap">
                                                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono bg-stone-100 text-[#1A2228] rounded-xs uppercase">
                                                        {item.mime_type.split('/')[1] || item.mime_type}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-[#5A626A] font-mono whitespace-nowrap">
                                                    {(item.size / 1024).toFixed(0)} KB
                                                </td>
                                                <td className="p-3 text-[#5A626A] font-mono whitespace-nowrap">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </td>
                                                <td className="p-3 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="px-2 py-1 text-[#0F2C59] hover:bg-[#FAF9F6] border border-[#D8D2C6] rounded-xs text-xs font-semibold inline-flex items-center gap-0.5"
                                                            title="Buka Berkas"
                                                        >
                                                            Buka ↗
                                                        </a>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(item)}
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            title="Hapus"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {media.data.map((item) => {
                            const isImage = item.mime_type.startsWith('image/');
                            return (
                                <div
                                    key={item.id}
                                    className="group bg-white border border-[#E2DFD7] rounded-xs overflow-hidden flex flex-col justify-between hover:border-[#0F2C59]/50 transition shadow-2xs"
                                >
                                    <div className="aspect-square bg-[#FAF9F6] relative overflow-hidden flex items-center justify-center p-2">
                                        {isImage ? (
                                            <img
                                                src={item.url}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-2xs"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <DocumentIcon className="w-10 h-10 text-[#0F2C59] mb-1" />
                                                <span className="text-[10px] text-[#5A626A] font-mono uppercase">
                                                    PDF
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1 rounded-xs hover:bg-red-700 transition"
                                            title="Hapus berkas"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="p-2.5 border-t border-[#E2DFD7] bg-white">
                                        <p className="text-xs font-semibold text-[#1A2228] truncate" title={item.name}>
                                            {item.name}
                                        </p>
                                        <div className="flex items-center justify-between text-[10px] text-[#5A626A] mt-1 font-mono">
                                            <span>{(item.size / 1024).toFixed(0)} KB</span>
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#0F2C59] hover:underline"
                                            >
                                                Buka ↗
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {media.last_page > 1 && (
                    <div className="flex justify-center gap-1 pt-4">
                        {media.links.map((link, i) => (
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

            <ConfirmationModal
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
                title="Hapus Berkas Media"
                description={`Apakah Anda yakin ingin menghapus "${deleteModal.item?.name}"? Tautan gambar pada postingan yang memakai berkas ini mungkin tidak akan muncul lagi.`}
                confirmText="Iya, Hapus"
                cancelText="Tidak"
                variant="danger"
                loading={deleteModal.loading}
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

