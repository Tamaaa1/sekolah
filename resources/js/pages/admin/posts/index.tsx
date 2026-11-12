import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
            router.delete(`/admin/posts/${id}`);
        }
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

            <div className="p-6 space-y-6">
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
                                    <th className="py-3 px-4">Judul</th>
                                    <th className="py-3 px-4">Penulis</th>
                                    <th className="py-3 px-4">Kategori</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Tanggal Rilis</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {posts.data.length > 0 ? (
                                    posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-canvas-subtle/30">
                                            <td className="py-3.5 px-4 font-semibold text-ink max-w-xs">
                                                <div className="line-clamp-2">{post.title}</div>
                                                <div className="text-[11px] font-mono text-ink-muted mt-0.5">
                                                    /{post.slug}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-ink-secondary">
                                                {post.author?.name || 'Administrator'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {post.categories && post.categories.length > 0 ? (
                                                    <span className="px-2 py-0.5 rounded bg-canvas-subtle text-ink font-medium">
                                                        {post.categories[0].name}
                                                    </span>
                                                ) : (
                                                    <span className="text-ink-muted">-</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        post.status === 'published'
                                                            ? 'bg-status-published-bg text-status-published'
                                                            : post.status === 'pending_review'
                                                            ? 'bg-status-pending-bg text-status-pending'
                                                            : 'bg-canvas-subtle text-ink-muted'
                                                    }`}
                                                >
                                                    {post.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-ink-muted">
                                                {formatDate(post.published_at)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right space-x-2">
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                    className="inline-flex items-center gap-1 text-prussian hover:underline font-semibold"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                    <span>Edit</span>
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    className="inline-flex items-center gap-1 text-status-urgent hover:underline font-semibold"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                    <span>Hapus</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-ink-muted italic">
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
        </AppLayout>
    );
}
