import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    CalendarDaysIcon,
    ChatBubbleBottomCenterTextIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    EnvelopeOpenIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    PhoneIcon,
    TrashIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface ContactMessageItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface MessagePageProps {
    messages: {
        data: ContactMessageItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    unreadCount: number;
    filters: {
        q?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kotak Pesan Masuk',
        href: '/admin/messages',
    },
];

export default function MessageIndex({
    messages,
    unreadCount,
    filters,
}: MessagePageProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [readingMessage, setReadingMessage] = useState<ContactMessageItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<ContactMessageItem | null>(null);

    const handleFilter = (qVal = search, statusVal = statusFilter) => {
        router.get(
            '/admin/messages',
            {
                q: qVal || undefined,
                status: statusVal !== 'all' ? statusVal : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter();
    };

    const handleOpenMessage = (msg: ContactMessageItem) => {
        setReadingMessage(msg);
        if (!msg.is_read) {
            router.patch(`/admin/messages/${msg.id}/read`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleToggleRead = (msg: ContactMessageItem) => {
        router.patch(`/admin/messages/${msg.id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    msg.is_read ? 'Pesan ditandai belum dibaca.' : 'Pesan ditandai sudah dibaca.'
                );
            },
        });
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        router.delete(`/admin/messages/${itemToDelete.id}`, {
            onSuccess: () => {
                setItemToDelete(null);
                if (readingMessage?.id === itemToDelete.id) {
                    setReadingMessage(null);
                }
                toast.success('Pesan kontak berhasil dihapus.');
            },
            onError: () => toast.error('Gagal menghapus pesan.'),
        });
    };

    const formatWhatsAppUrl = (phone: string, subject: string, senderName: string) => {
        let clean = phone.replace(/\D/g, '');
        if (clean.startsWith('0')) {
            clean = '62' + clean.slice(1);
        }
        const text = encodeURIComponent(
            `Halo Bapak/Ibu ${senderName}, kami dari Humas SMP Negeri 5 Sambas menindaklanjuti pesan Anda terkait "${subject}".`
        );
        return `https://wa.me/${clean}?text=${text}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kotak Masuk Pesan & Aspirasi - Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <EnvelopeIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                            Pesan Masuk & Aspirasi Publik
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Kelola pesan kontak, pengaduan, saran, dan pertanyaan masyarakat dari formulir web sekolah.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span>{unreadCount} Pesan Baru Belum Dibaca</span>
                        </div>
                    )}
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Cari pengirim, email, atau isi pesan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 text-sm"
                        />
                    </form>

                    <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-700 p-1 bg-neutral-50 dark:bg-neutral-800 text-xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter('all');
                                    handleFilter(search, 'all');
                                }}
                                className={`px-3 py-1 rounded-md font-medium transition ${
                                    statusFilter === 'all'
                                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-900'
                                }`}
                            >
                                Semua ({messages.total})
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter('unread');
                                    handleFilter(search, 'unread');
                                }}
                                className={`px-3 py-1 rounded-md font-medium transition ${
                                    statusFilter === 'unread'
                                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-900'
                                }`}
                            >
                                Belum Dibaca {unreadCount > 0 ? `(${unreadCount})` : ''}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter('read');
                                    handleFilter(search, 'read');
                                }}
                                className={`px-3 py-1 rounded-md font-medium transition ${
                                    statusFilter === 'read'
                                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-900'
                                }`}
                            >
                                Sudah Dibaca
                            </button>
                        </div>

                        {search && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearch('');
                                    handleFilter('', statusFilter);
                                }}
                                className="text-xs"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Messages Table */}
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
                    {messages.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <ChatBubbleBottomCenterTextIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-3" />
                            <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                Kotak pesan masih kosong
                            </p>
                            <p className="text-sm text-neutral-500 max-w-sm mt-1">
                                Pesan yang dikirimkan pengunjung melalui formulir halaman Hubungi Kami akan tampil di sini.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-300">
                                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Status</th>
                                        <th scope="col" className="px-6 py-4">Pengirim</th>
                                        <th scope="col" className="px-6 py-4">Subjek & Pesan</th>
                                        <th scope="col" className="px-6 py-4 whitespace-nowrap">Waktu Kirim</th>
                                        <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {messages.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`transition ${
                                                !item.is_read
                                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 font-medium'
                                                    : 'hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40'
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {!item.is_read ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                        Baru
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                        <CheckCircleIcon className="w-3.5 h-3.5 text-neutral-400" />
                                                        Dibaca
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-xs text-neutral-500 font-mono">
                                                        {item.email}
                                                    </span>
                                                    {item.phone && (
                                                        <span className="text-xs text-neutral-500 font-mono mt-0.5">
                                                            {item.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="max-w-md">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenMessage(item)}
                                                        className="text-left font-semibold text-neutral-900 dark:text-neutral-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                                                    >
                                                        {item.subject}
                                                    </button>
                                                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                                                        {item.message}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-500">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenMessage(item)}
                                                        className="h-8 px-2.5 text-xs gap-1"
                                                    >
                                                        <EyeIcon className="w-3.5 h-3.5" />
                                                        Buka
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleToggleRead(item)}
                                                        className="h-8 px-2.5 text-xs gap-1"
                                                        title={item.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                                                    >
                                                        {item.is_read ? (
                                                            <EnvelopeIcon className="w-3.5 h-3.5 text-neutral-500" />
                                                        ) : (
                                                            <EnvelopeOpenIcon className="w-3.5 h-3.5 text-emerald-600" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setItemToDelete(item)}
                                                        className="h-8 px-2.5 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
                                                    >
                                                        <TrashIcon className="w-3.5 h-3.5" />
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

                {/* Message Reader Modal Dialog */}
                {readingMessage && (
                    <Dialog open={!!readingMessage} onOpenChange={(open) => !open && setReadingMessage(null)}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                    <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-emerald-600" />
                                    <span>{readingMessage.subject}</span>
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 pt-2">
                                {/* Sender Info Card */}
                                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-neutral-400" />
                                        <div>
                                            <span className="text-neutral-400">Pengirim:</span>{' '}
                                            <span className="font-semibold text-neutral-900 dark:text-white">
                                                {readingMessage.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <EnvelopeIcon className="w-4 h-4 text-neutral-400" />
                                        <div>
                                            <span className="text-neutral-400">Email:</span>{' '}
                                            <a
                                                href={`mailto:${readingMessage.email}`}
                                                className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                                            >
                                                {readingMessage.email}
                                            </a>
                                        </div>
                                    </div>

                                    {readingMessage.phone && (
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="w-4 h-4 text-neutral-400" />
                                            <div>
                                                <span className="text-neutral-400">No. Telp / WA:</span>{' '}
                                                <span className="font-mono text-neutral-900 dark:text-white">
                                                    {readingMessage.phone}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <CalendarDaysIcon className="w-4 h-4 text-neutral-400" />
                                        <div>
                                            <span className="text-neutral-400">Dikirim:</span>{' '}
                                            <span className="text-neutral-900 dark:text-white">
                                                {new Date(readingMessage.created_at).toLocaleString('id-ID', {
                                                    dateStyle: 'long',
                                                    timeStyle: 'short',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div>
                                    <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                                        Isi Pesan / Saran Pengunjung
                                    </h4>
                                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                                        {readingMessage.message}
                                    </div>
                                </div>

                                {/* Quick Reply Action Buttons */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                    <div className="flex flex-wrap gap-2">
                                        {readingMessage.phone && (
                                            <a
                                                href={formatWhatsAppUrl(
                                                    readingMessage.phone,
                                                    readingMessage.subject,
                                                    readingMessage.name
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                                            >
                                                <PhoneIcon className="w-4 h-4" />
                                                <span>Balas via WhatsApp</span>
                                            </a>
                                        )}

                                        <a
                                            href={`mailto:${readingMessage.email}?subject=Tanggapan: ${encodeURIComponent(
                                                readingMessage.subject
                                            )}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-semibold shadow-xs transition"
                                        >
                                            <EnvelopeIcon className="w-4 h-4" />
                                            <span>Balas via Email</span>
                                        </a>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setReadingMessage(null)}
                                        className="text-xs"
                                    >
                                        Tutup
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    open={!!itemToDelete}
                    onOpenChange={(open) => !open && setItemToDelete(null)}
                    title="Hapus Pesan Kontak"
                    description={`Apakah Anda yakin ingin menghapus pesan dari "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    variant="danger"
                    onConfirm={confirmDelete}
                />
            </div>
        </AppLayout>
    );
}
