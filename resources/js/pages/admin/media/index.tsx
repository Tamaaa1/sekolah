import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowUpTrayIcon,
    DocumentIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
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
    const [uploading, setUploading] = useState(false);

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
            onFinish: () => setUploading(false),
            preserveScroll: true,
        });
    };

    const handleDelete = (item: MediaItem) => {
        if (confirm(`Yakin ingin menghapus berkas "${item.name}"? Tautan gambar pada postingan yang memakai berkas ini mungkin tidak akan muncul.`)) {
            router.delete(`/admin/media/${item.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pustaka Media - Panel Admin" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
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

                {/* Filter and Search */}
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
                </div>

                {/* Grid */}
                {media.data.length === 0 ? (
                    <div className="bg-white border border-[#E2DFD7] p-12 text-center rounded-xs">
                        <PhotoIcon className="w-12 h-12 text-[#5A626A] mx-auto mb-3 stroke-1" />
                        <h3 className="text-base font-serif font-bold text-[#1A2228]">
                            Pustaka Media Masih Kosong
                        </h3>
                        <p className="text-xs text-[#5A626A] mt-1 max-w-sm mx-auto">
                            Klik tombol &ldquo;Unggah Berkas&rdquo; di kanan atas untuk menambahkan foto berita, logo, atau dokumen PDF.
                        </p>
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
        </AppLayout>
    );
}
