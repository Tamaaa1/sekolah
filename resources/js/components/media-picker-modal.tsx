import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowUpTrayIcon,
    CheckCircleIcon,
    DocumentIcon,
    MagnifyingGlassIcon,
    PhotoIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

export interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    file_path: string;
    url: string;
    mime_type: string;
    size: number;
    alt_text?: string;
    created_at?: string;
}

interface MediaPickerModalProps {
    onSelect: (url: string, media?: MediaItem) => void;
    trigger?: React.ReactNode;
    title?: string;
    allowedTypes?: 'images' | 'all';
}

export function MediaPickerModal({
    onSelect,
    trigger,
    title = 'Pilih Berkas Media',
    allowedTypes = 'all',
}: MediaPickerModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<'gallery' | 'upload'>('gallery');
    const [items, setItems] = useState<MediaItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const fetchMedia = async (query = '') => {
        setLoading(true);
        try {
            const url = query
                ? `/admin/media?json=1&search=${encodeURIComponent(query)}`
                : '/admin/media?json=1';
            const res = await fetch(url, { credentials: 'same-origin' });
            if (res.ok) {
                const data = await res.json();
                setItems(data.data || []);
            }
        } catch {
            // silent catch
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMedia(search);
        }
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMedia(search);
    };

    const getCsrfToken = (): string => {
        const meta = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (meta) return meta;

        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        if (match) {
            return decodeURIComponent(match[1]);
        }
        return '';
    };

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('allowed_type', allowedTypes);

        try {
            const token = getCsrfToken();
            const res = await fetch('/admin/media', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                body: formData,
                credentials: 'same-origin',
            });

            if (res.ok) {
                const data = await res.json();
                if (data.media) {
                    setItems((prev) => [data.media, ...prev]);
                    setSelectedItem(data.media);
                    setTab('gallery');
                    fetchMedia('');
                }
            } else {
                const err = await res.json().catch(() => null);
                const validationMsg = err?.errors
                    ? Object.values(err.errors as Record<string, string[]>).flat().join(', ')
                    : null;
                setUploadError(
                    validationMsg ||
                    err?.message ||
                    'Gagal mengunggah berkas. Pastikan ukuran di bawah 5MB dan format sesuai.'
                );
            }
        } catch {
            setUploadError('Terjadi kendala jaringan saat mengunggah berkas.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (item: MediaItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Hapus "${item.name}" dari pustaka media?`)) return;

        try {
            const token = getCsrfToken();
            const res = await fetch(`/admin/media/${item.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
            });

            if (res.ok) {
                setItems((prev) => prev.filter((i) => i.id !== item.id));
                if (selectedItem?.id === item.id) {
                    setSelectedItem(null);
                }
            }
        } catch {
            alert('Gagal menghapus berkas.');
        }
    };

    const handleConfirm = () => {
        if (selectedItem) {
            onSelect(selectedItem.url, selectedItem);
            setIsOpen(false);
        }
    };

    const filteredItems = items.filter((item) => {
        if (allowedTypes === 'images') {
            return item.mime_type.startsWith('image/');
        }
        return true;
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        type="button"
                        variant="outline"
                        className="border-[#D8D2C6] text-[#1A2228] hover:bg-[#FAF9F6] text-xs font-sans"
                    >
                        <PhotoIcon className="w-4 h-4 mr-1.5 text-[#0F2C59]" />
                        Pilih dari Media Library
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 bg-white border border-[#D8D2C6] shadow-xl">
                <DialogHeader className="border-b border-[#E2DFD7] pb-4">
                    <DialogTitle className="text-lg font-serif text-[#1A2228] font-bold">
                        {title}
                    </DialogTitle>
                    <div className="flex gap-4 mt-3">
                        <button
                            type="button"
                            onClick={() => setTab('gallery')}
                            className={`pb-1 text-xs font-semibold uppercase tracking-wider transition border-b-2 ${
                                tab === 'gallery'
                                    ? 'border-[#0F2C59] text-[#0F2C59]'
                                    : 'border-transparent text-[#5A626A] hover:text-[#1A2228]'
                            }`}
                        >
                            Pustaka Media ({filteredItems.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('upload')}
                            className={`pb-1 text-xs font-semibold uppercase tracking-wider transition border-b-2 ${
                                tab === 'upload'
                                    ? 'border-[#0F2C59] text-[#0F2C59]'
                                    : 'border-transparent text-[#5A626A] hover:text-[#1A2228]'
                            }`}
                        >
                            Unggah Berkas Baru
                        </button>
                    </div>
                </DialogHeader>

                {tab === 'upload' ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#D8D2C6] rounded-sm bg-[#FAF9F6] my-4">
                        <ArrowUpTrayIcon className="w-12 h-12 text-[#5A626A] mb-3 stroke-1" />
                        <h4 className="text-sm font-semibold text-[#1A2228] mb-1">
                            Pilih berkas dari komputer Anda
                        </h4>
                        <p className="text-xs text-[#5A626A] mb-4 text-center max-w-sm">
                            {allowedTypes === 'images'
                                ? 'Hanya mendukung berkas gambar JPG, JPEG, PNG, dan WEBP (maksimal 5 MB per berkas).'
                                : 'Mendukung berkas gambar JPG, JPEG, PNG, WEBP, dan dokumen PDF resmi (maksimal 5 MB per berkas).'}
                        </p>
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#0F2C59] text-white text-xs font-medium rounded-sm hover:bg-[#0A1F3F] transition">
                            <input
                                type="file"
                                className="hidden"
                                accept={
                                    allowedTypes === 'images'
                                        ? 'image/jpeg,image/png,image/webp'
                                        : 'image/jpeg,image/png,image/webp,application/pdf,.pdf'
                                }
                                onChange={(e) => handleFileUpload(e.target.files)}
                                disabled={uploading}
                            />
                            {uploading ? 'Mengunggah...' : 'Telusuri Berkas'}
                        </label>
                        {uploadError && (
                            <p className="mt-3 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded border border-red-200">
                                {uploadError}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-hidden my-3">
                        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-4 h-4 text-[#5A626A] absolute left-3 top-2.5" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama berkas..."
                                    className="pl-9 text-xs border-[#D8D2C6] bg-white h-9"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="outline"
                                className="text-xs border-[#D8D2C6] text-[#1A2228] h-9"
                            >
                                Cari
                            </Button>
                        </form>

                        <div className="flex-1 overflow-y-auto pr-1">
                            {loading ? (
                                <div className="py-12 text-center text-xs text-[#5A626A]">
                                    Memuat daftar pustaka media...
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="py-12 text-center text-xs text-[#5A626A]">
                                    Belum ada berkas yang diunggah. Silakan klik tab &ldquo;Unggah Berkas Baru&rdquo;.
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {filteredItems.map((item) => {
                                        const isSelected = selectedItem?.id === item.id;
                                        const isImage = item.mime_type.startsWith('image/');
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedItem(item)}
                                                onDoubleClick={() => {
                                                    setSelectedItem(item);
                                                    onSelect(item.url, item);
                                                    setIsOpen(false);
                                                }}
                                                className={`group relative aspect-square border rounded-sm overflow-hidden cursor-pointer transition p-1 bg-[#FAF9F6] flex flex-col items-center justify-center ${
                                                    isSelected
                                                        ? 'border-2 border-[#0F2C59] ring-2 ring-[#0F2C59]/20'
                                                        : 'border-[#E2DFD7] hover:border-[#0F2C59]/40'
                                                }`}
                                            >
                                                {isImage ? (
                                                    <img
                                                        src={item.url}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded-xs"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center p-2 text-center">
                                                        <DocumentIcon className="w-8 h-8 text-[#0F2C59] mb-1" />
                                                        <span className="text-[10px] text-[#1A2228] font-mono truncate max-w-full">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                )}

                                                {isSelected && (
                                                    <div className="absolute top-1 right-1 bg-[#0F2C59] text-white rounded-full p-0.5">
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDelete(item, e)}
                                                    className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1 rounded-xs hover:bg-red-700 transition"
                                                    title="Hapus berkas"
                                                >
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="border-t border-[#E2DFD7] pt-4 flex items-center justify-between">
                    <div className="text-xs text-[#5A626A] truncate max-w-md">
                        {selectedItem ? (
                            <span>
                                Terpilih: <strong>{selectedItem.name}</strong> ({(selectedItem.size / 1024).toFixed(1)} KB)
                            </span>
                        ) : (
                            'Pilih salah satu berkas di atas untuk digunakan'
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="border-[#D8D2C6] text-xs text-[#1A2228]"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            disabled={!selectedItem}
                            onClick={handleConfirm}
                            className="bg-[#0F2C59] text-white hover:bg-[#0A1F3F] text-xs font-semibold px-4 disabled:opacity-50"
                        >
                            Gunakan Berkas Ini
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

