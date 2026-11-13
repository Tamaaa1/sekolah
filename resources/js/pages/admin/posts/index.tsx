import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { toast } from 'sonner';
import {
    DocumentPlusIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

type Category = {
    id: number;
    name: string;
};

type Author = {
    id: number;
    name: string;
};

type Post = {
    id: number;
    title: string;
    slug: string;
    type: string;
    status: string;
    is_pinned: boolean;
    published_at: string | null;
    created_at: string;
    author?: Author;
    categories?: Category[];
};

type PaginatedPosts = {
    data: Post[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    posts: PaginatedPosts;
    currentType: string;
    currentStatus?: string;
    counts: {
        all: number;
        published: number;
        pending_review: number;
        draft: number;
    };
};

export default function PostsIndex({
    posts,
    currentType = 'post',
    currentStatus = '',
    counts,
}: Props) {
    const typeLabel =
        currentType === 'post'
            ? 'Berita & Artikel'
            : currentType === 'announcement'
            ? 'Pengumuman Resmi'
            : 'Halaman Statis';

    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        id: number | null;
        title: string;
        loading: boolean;
    }>({ open: false, id: null, title: '', loading: false });

    const handleDelete = (id: number, title: string) => {
        setDeleteModal({ open: true, id, title, loading: false });
    };

    const confirmDelete = () => {
        if (!deleteModal.id) return;
        setDeleteModal((prev) => ({ ...prev, loading: true }));
        router.delete(`/admin/posts/${deleteModal.id}`, {
            onSuccess: () => {
                toast.success(`${typeLabel} "${deleteModal.title}" berhasil dihapus.`);
                setDeleteModal({ open: false, id: null, title: '', loading: false });
            },
            onError: () => {
                toast.error(`Gagal menghapus ${typeLabel.toLowerCase()}.`);
                setDeleteModal((prev) => ({ ...prev, loading: false }));
            },
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
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: typeLabel, href: `/admin/posts?type=${currentType}` },
            ]}
        >
            <Head title={`Kelola ${typeLabel}`} />

            <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">
                            Manajemen {typeLabel}
                        </h1>
                        <p className="text-xs text-ink-muted mt-0.5">
                            Kelola penerbitan, peninjauan draf, dan jadwal rilis konten.
                        </p>
                    </div>

                    <div>
                        <Link
                            href={`/admin/posts/create?type=${currentType}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Tambah {typeLabel}</span>
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs Status */}
                <div className="flex flex-wrap gap-2 text-xs">
                    {[
                        { key: '', label: `Semua (${counts.all})` },
                        { key: 'published', label: `Diterbitkan (${counts.published})` },
                        { key: 'pending_review', label: `Menunggu Review (${counts.pending_review})` },
                        { key: 'draft', label: `Draf (${counts.draft})` },
                    ].map((tab) => (
                        <Link
                            key={tab.key}
                            href={`/admin/posts?type=${currentType}${tab.key ? `&status=${tab.key}` : ''}`}
                            className={`px-3 py-1.5 rounded border transition-colors ${
                                currentStatus === tab.key
                                    ? 'bg-prussian text-white border-prussian font-semibold'
                                    : 'bg-white text-ink border-sidebar-border hover:bg-canvas-subtle'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded border border-sidebar-border shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-canvas-subtle/50 text-ink-muted border-b border-sidebar-border uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3 px-4 text-left">Judul Artikel</th>
                                    <th className="py-3 px-4 text-left w-48 whitespace-nowrap">Kategori</th>
                                    <th className="py-3 px-4 text-center w-36 whitespace-nowrap">Status</th>
                                    <th className="py-3 px-4 text-left w-36 whitespace-nowrap">Tanggal Rilis</th>
                                    <th className="py-3 px-4 text-right w-24 whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {posts.data.length > 0 ? (
                                    posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-canvas-subtle/30 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-ink">
                                                <div className="line-clamp-2">{post.title}</div>
                                            </td>
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                {post.categories && post.categories.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {post.categories.map((cat) => (
                                                            <span
                                                                key={cat.id}
                                                                className="inline-block px-2.5 py-0.5 rounded text-[11px] bg-canvas-subtle text-ink font-medium border border-sidebar-border whitespace-nowrap"
                                                            >
                                                                {cat.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-ink-muted">-</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                        post.status === 'published'
                                                            ? 'bg-status-published-bg text-status-published border border-emerald-200'
                                                            : post.status === 'pending_review'
                                                            ? 'bg-status-pending-bg text-status-pending border border-amber-200'
                                                            : 'bg-canvas-subtle text-ink-muted border border-sidebar-border'
                                                    }`}
                                                >
                                                    {post.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-ink-muted whitespace-nowrap">
                                                {formatDate(post.published_at)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                                    <Link
                                                        href={`/admin/posts/${post.id}/edit`}
                                                        className="p-1.5 rounded text-prussian hover:bg-canvas-subtle border border-sidebar-border transition-colors"
                                                        title="Sunting Artikel"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(post.id, post.title)}
                                                        className="p-1.5 rounded text-status-urgent hover:bg-red-50 border border-sidebar-border transition-colors"
                                                        title="Hapus Artikel"
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
                                            Tidak ada konten pada kriteria ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="p-4 border-t border-sidebar-border flex items-center justify-between text-xs">
                            <span className="text-ink-muted">
                                Halaman {posts.current_page} dari {posts.last_page} (Total {posts.total})
                            </span>
                            <div className="flex gap-2">
                                {posts.prev_page_url && (
                                    <Link
                                        href={posts.prev_page_url}
                                        className="px-3 py-1 rounded border border-sidebar-border bg-white hover:bg-canvas-subtle"
                                    >
                                        &larr; Sebelumnya
                                    </Link>
                                )}
                                {posts.next_page_url && (
                                    <Link
                                        href={posts.next_page_url}
                                        className="px-3 py-1 rounded border border-sidebar-border bg-white hover:bg-canvas-subtle"
                                    >
                                        Selanjutnya &rarr;
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
                title={`Hapus ${typeLabel}?`}
                description={`Apakah Anda yakin ingin menghapus "${deleteModal.title}"? Data artikel ini akan dipindahkan ke tempat sampah dan tidak lagi dapat diakses pengunjung.`}
                confirmText="Iya, Hapus"
                cancelText="Tidak"
                variant="danger"
                loading={deleteModal.loading}
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}

