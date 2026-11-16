import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    CalendarDaysIcon,
    ChatBubbleBottomCenterTextIcon,
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
    counts?: {
        all: number;
        unread: number;
        read: number;
    };
    unreadCount?: number;
    currentStatus?: string;
    filters: {
        q?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Kotak Pesan Masuk', href: '/admin/messages' },
];

export default function MessageIndex({
    messages,
    counts,
    unreadCount = 0,
    currentStatus = '',
    filters,
}: MessagePageProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [readingMessage, setReadingMessage] = useState<ContactMessageItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<ContactMessageItem | null>(null);

    const activeCounts = counts ?? {
        all: messages.total,
        unread: unreadCount,
        read: Math.max(0, messages.total - unreadCount),
    };

    const handleFilter = (statusVal = currentStatus, qVal = search) => {
        router.get(
            '/admin/messages',
            {
                q: qVal || undefined,
                status: statusVal || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter(currentStatus, search);
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

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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
            <Head title="Manajemen Pesan Masuk - Admin" />

            <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">
                            Manajemen Pesan Masuk
                        </h1>
                        <p className="text-xs text-ink-muted mt-0.5">
                            Kelola pesan kontak, pengaduan, saran, dan pertanyaan masyarakat dari formulir web.
                        </p>
                    </div>

                    {activeCounts.unread > 0 && (
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-urgent-bg text-status-urgent border border-terracotta/30 text-xs font-semibold">
                                <span className="w-2 h-2 rounded-full bg-status-urgent animate-pulse" />
                                <span>{activeCounts.unread} Pesan Belum Dibaca</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Filter Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                        {[
                            { key: '', label: `Semua (${activeCounts.all})` },
                            { key: 'unread', label: `Belum Dibaca (${activeCounts.unread})` },
                            { key: 'read', label: `Sudah Dibaca (${activeCounts.read})` },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleFilter(tab.key, search)}
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

                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
                        <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
                        <input
                            type="text"
                            placeholder="Cari pengirim, subjek, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 h-8 text-xs rounded border border-sidebar-border bg-white text-ink placeholder:text-ink-muted/70 focus:outline-hidden focus:border-prussian"
                        />
                    </form>
                </div>

                {/* Table & Mobile Cards */}
                <div className="bg-white rounded border border-sidebar-border shadow-xs overflow-hidden">
                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-canvas-subtle/50 text-ink-muted border-b border-sidebar-border uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3 px-4 text-center w-28 whitespace-nowrap">Status</th>
                                    <th className="py-3 px-4 text-left w-56 whitespace-nowrap">Pengirim</th>
                                    <th className="py-3 px-4 text-left">Subjek & Pesan</th>
                                    <th className="py-3 px-4 text-left w-40 whitespace-nowrap">Waktu Kirim</th>
                                    <th className="py-3 px-4 text-right w-28 whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {messages.data.length > 0 ? (
                                    messages.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors ${
                                                !item.is_read
                                                    ? 'bg-prussian-light/20 font-medium'
                                                    : 'hover:bg-canvas-subtle/30'
                                            }`}
                                        >
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                {!item.is_read ? (
                                                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-status-urgent-bg text-status-urgent border border-terracotta/30">
                                                        BARU
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-canvas-subtle text-ink-muted border border-sidebar-border">
                                                        DIBACA
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-ink">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[11px] text-ink-muted font-mono mt-0.5">
                                                        {item.email}
                                                    </span>
                                                    {item.phone && (
                                                        <span className="text-[11px] text-ink-muted font-mono">
                                                            {item.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="max-w-md">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenMessage(item)}
                                                        className="text-left font-semibold text-ink hover:text-prussian transition-colors line-clamp-1"
                                                    >
                                                        {item.subject}
                                                    </button>
                                                    <p className="text-xs text-ink-muted line-clamp-1 mt-0.5 font-normal">
                                                        {item.message}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-ink-muted font-mono text-[11px] whitespace-nowrap">
                                                {formatDate(item.created_at)}
                                            </td>

                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenMessage(item)}
                                                        className="p-1.5 rounded text-prussian hover:bg-canvas-subtle border border-sidebar-border transition-colors"
                                                        title="Buka Pesan"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleRead(item)}
                                                        className="p-1.5 rounded text-ink hover:bg-canvas-subtle border border-sidebar-border transition-colors"
                                                        title={item.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                                                    >
                                                        {item.is_read ? (
                                                            <EnvelopeIcon className="w-4 h-4 text-ink-muted" />
                                                        ) : (
                                                            <EnvelopeOpenIcon className="w-4 h-4 text-prussian" />
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemToDelete(item)}
                                                        className="p-1.5 rounded text-status-urgent hover:bg-red-50 border border-sidebar-border transition-colors"
                                                        title="Hapus Pesan"
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
                                            Tidak ada pesan masuk pada kriteria ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Individual Cards */}
                    <div className="md:hidden divide-y divide-sidebar-border bg-[#FAF9F6]">
                        {messages.data.length > 0 ? (
                            messages.data.map((item) => (
                                <div key={item.id} className="p-4 space-y-3 bg-white">
                                    <div className="flex items-start justify-between gap-2.5">
                                        <div>
                                            <h3 className="font-semibold text-sm text-ink leading-snug">
                                                {item.subject}
                                            </h3>
                                            <p className="text-[11px] text-ink-muted mt-0.5">
                                                {item.name} • <span className="font-mono">{item.email}</span>
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                                !item.is_read
                                                    ? 'bg-status-urgent-bg text-status-urgent border border-terracotta/30'
                                                    : 'bg-canvas-subtle text-ink-muted border border-sidebar-border'
                                            }`}
                                        >
                                            {!item.is_read ? 'BARU' : 'DIBACA'}
                                        </span>
                                    </div>

                                    <p className="text-xs text-ink-secondary line-clamp-2">
                                        {item.message}
                                    </p>

                                    <div className="flex items-center justify-between text-[11px] text-ink-muted font-mono">
                                        <span>{formatDate(item.created_at)}</span>
                                        {item.phone && <span>{item.phone}</span>}
                                    </div>

                                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-sidebar-border/70">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenMessage(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-prussian bg-canvas-subtle hover:bg-canvas-subtle/80 border border-sidebar-border transition-colors"
                                        >
                                            <EyeIcon className="w-3.5 h-3.5" />
                                            <span>Buka</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleRead(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-ink bg-canvas-subtle hover:bg-canvas-subtle/80 border border-sidebar-border transition-colors"
                                        >
                                            {item.is_read ? (
                                                <EnvelopeIcon className="w-3.5 h-3.5 text-ink-muted" />
                                            ) : (
                                                <EnvelopeOpenIcon className="w-3.5 h-3.5 text-prussian" />
                                            )}
                                            <span>{item.is_read ? 'Tandai Baru' : 'Sudah Dibaca'}</span>
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
                                Tidak ada pesan masuk pada kriteria ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {messages.links && messages.links.length > 3 && (
                    <div className="bg-white p-3.5 rounded border border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary shadow-2xs">
                        <div>
                            Menampilkan <strong>{messages.data.length}</strong> dari <strong>{messages.total}</strong> pesan masuk
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.links.map((link, idx) => (
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

                {/* Message Reader Modal Dialog */}
                {readingMessage && (
                    <Dialog open={!!readingMessage} onOpenChange={(open) => !open && setReadingMessage(null)}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-sidebar-border text-ink">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
                                    <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-prussian" />
                                    <span>{readingMessage.subject}</span>
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 pt-2">
                                {/* Sender Info Card */}
                                <div className="p-4 rounded-lg bg-canvas-subtle/50 border border-sidebar-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-ink-muted" />
                                        <div>
                                            <span className="text-ink-muted">Pengirim:</span>{' '}
                                            <span className="font-semibold text-ink">
                                                {readingMessage.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <EnvelopeIcon className="w-4 h-4 text-ink-muted" />
                                        <div>
                                            <span className="text-ink-muted">Email:</span>{' '}
                                            <a
                                                href={`mailto:${readingMessage.email}`}
                                                className="font-mono text-prussian hover:underline"
                                            >
                                                {readingMessage.email}
                                            </a>
                                        </div>
                                    </div>

                                    {readingMessage.phone && (
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="w-4 h-4 text-ink-muted" />
                                            <div>
                                                <span className="text-ink-muted">No. Telp / WA:</span>{' '}
                                                <span className="font-mono text-ink">
                                                    {readingMessage.phone}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <CalendarDaysIcon className="w-4 h-4 text-ink-muted" />
                                        <div>
                                            <span className="text-ink-muted">Dikirim:</span>{' '}
                                            <span className="text-ink">
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
                                    <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted font-semibold mb-2">
                                        Isi Pesan / Saran Pengunjung
                                    </h4>
                                    <div className="p-4 rounded-lg border border-sidebar-border bg-white text-sm text-ink leading-relaxed whitespace-pre-wrap">
                                        {readingMessage.message}
                                    </div>
                                </div>

                                {/* Quick Reply Action Buttons */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-sidebar-border">
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
                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-status-published hover:bg-status-published/90 text-white text-xs font-semibold shadow-xs transition"
                                            >
                                                <PhoneIcon className="w-4 h-4" />
                                                <span>Balas via WhatsApp</span>
                                            </a>
                                        )}

                                        <a
                                            href={`mailto:${readingMessage.email}?subject=Tanggapan: ${encodeURIComponent(
                                                readingMessage.subject
                                            )}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-prussian hover:bg-prussian-hover text-white text-xs font-semibold shadow-xs transition"
                                        >
                                            <EnvelopeIcon className="w-4 h-4" />
                                            <span>Balas via Email</span>
                                        </a>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setReadingMessage(null)}
                                        className="text-xs border-sidebar-border text-ink hover:bg-canvas-subtle"
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
