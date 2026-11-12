import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    ArrowLeftIcon,
    ArrowUpTrayIcon,
    BookmarkIcon,
    CalendarDaysIcon,
    CheckIcon,
    DocumentTextIcon,
    EyeIcon,
    GlobeAltIcon,
    PhotoIcon,
} from '@heroicons/react/24/outline';

type Category = {
    id: number;
    name: string;
};

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: any;
    type: string;
    status: string;
    is_pinned: boolean;
    meta_title: string | null;
    meta_description: string | null;
    published_at: string | null;
    categories?: Category[];
};

type Props = {
    post: Post | null;
    type: string;
    categories: Category[];
    tags: any[];
};

export default function PostForm({
    post,
    type = 'post',
    categories = [],
}: Props) {
    const isEdit = !!post;
    const { auth } = usePage().props as any;
    const isContributor = auth?.user?.roles?.includes('Contributor');

    const defaultContentString = () => {
        if (!post?.content) return '';
        if (typeof post.content === 'string') return post.content;
        if (Array.isArray(post.content)) {
            return post.content
                .map((b: any) => (typeof b === 'string' ? b : b.content || ''))
                .join('\n\n');
        }
        return '';
    };

    const { data, setData, post: submitPost, put: updatePost, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: defaultContentString(),
        type: post?.type || type,
        status: post?.status || (isContributor ? 'pending_review' : 'published'),
        is_pinned: post?.is_pinned || false,
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
        published_at: post?.published_at ? post.published_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
        category_ids: post?.categories ? post.categories.map((c) => c.id) : [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            updatePost(`/admin/posts/${post.id}`);
        } else {
            submitPost('/admin/posts');
        }
    };

    const toggleCategory = (id: number) => {
        if (data.category_ids.includes(id)) {
            setData('category_ids', data.category_ids.filter((cId) => cId !== id));
        } else {
            setData('category_ids', [...data.category_ids, id]);
        }
    };

    const typeTitle =
        data.type === 'post'
            ? 'Berita'
            : data.type === 'announcement'
            ? 'Pengumuman'
            : 'Halaman Statis';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: `Semua ${typeTitle}`, href: `/admin/posts?type=${data.type}` },
                { title: isEdit ? 'Sunting Konten' : 'Tulis Baru', href: '#' },
            ]}
        >
            <Head title={`${isEdit ? 'Sunting' : 'Tulis'} ${typeTitle}`} />

            <form onSubmit={handleSubmit} className="p-6">
                {/* Top Action Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/admin/posts?type=${data.type}`}
                            className="p-1.5 rounded border border-sidebar-border hover:bg-canvas-subtle text-ink"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="font-serif font-bold text-xl text-ink">
                                {isEdit ? `Sunting ${typeTitle}` : `Buat ${typeTitle} Baru`}
                            </h1>
                            <span className="text-[11px] font-mono text-ink-muted">
                                {data.slug ? `URL: /${data.slug}` : 'URL otomatis terbuat dari judul'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEdit && (
                            <a
                                href={`/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded border border-sidebar-border bg-white hover:bg-canvas-subtle text-xs font-semibold inline-flex items-center gap-1 text-ink"
                            >
                                <EyeIcon className="w-4 h-4 text-ink-muted" />
                                <span>Lihat di Web</span>
                            </a>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                            <CheckIcon className="w-4 h-4" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan & Publikasikan'}</span>
                        </button>
                    </div>
                </div>

                {/* Zen Editor Layout: Left Canvas + Right Inspector */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Canvas (Writing Space) */}
                    <div className="flex-1 w-full bg-white rounded border border-sidebar-border p-6 sm:p-10 shadow-xs space-y-6">
                        {/* Title Input */}
                        <div>
                            <input
                                type="text"
                                placeholder={`Ketik judul ${typeTitle.toLowerCase()} di sini...`}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full font-serif text-2xl sm:text-3xl font-bold text-ink placeholder:text-ink-muted/50 border-0 border-b border-sidebar-border focus:border-prussian focus:ring-0 pb-3 px-0 bg-transparent transition-colors"
                                required
                            />
                            {errors.title && (
                                <p className="text-xs text-status-urgent mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Excerpt Input */}
                        <div>
                            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
                                Ringkasan Pendek (Excerpt)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Tuliskan ringkasan 1-2 kalimat sebagai pembuka atau pratinjau kartu berita..."
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                className="w-full text-sm text-ink-secondary border border-sidebar-border rounded p-3 focus:border-prussian focus:ring-1 focus:ring-prussian"
                            />
                        </div>

                        {/* Body / Content Editor Canvas */}
                        <div>
                            <div className="flex items-center justify-between border-b border-sidebar-border pb-2 mb-2">
                                <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                                    Isi Konten Artikel
                                </label>
                                <span className="text-[11px] text-ink-muted font-mono">
                                    Editor Zen Mode
                                </span>
                            </div>

                            <textarea
                                rows={14}
                                placeholder="Mulai menulis konten artikel di sini. Paragraf terpisah dengan baris baru..."
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full text-sm sm:text-base text-ink leading-relaxed border border-sidebar-border rounded p-4 focus:border-prussian focus:ring-1 focus:ring-prussian font-sans"
                            />
                            {errors.content && (
                                <p className="text-xs text-status-urgent mt-1">{errors.content}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Inspector Panel (w-80) */}
                    <div className="w-full lg:w-80 shrink-0 space-y-5">
                        {/* Status & Publication Box */}
                        <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs space-y-3">
                            <h3 className="font-serif font-bold text-sm text-ink border-b border-sidebar-border pb-2">
                                Status & Visibilitas
                            </h3>

                            <div>
                                <label className="block text-xs font-medium text-ink-secondary mb-1">
                                    Status Publikasi
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full text-xs border border-sidebar-border rounded p-2 focus:border-prussian"
                                >
                                    {!isContributor && (
                                        <option value="published">Diterbitkan (Published)</option>
                                    )}
                                    <option value="pending_review">Menunggu Peninjauan (Review)</option>
                                    <option value="draft">Draf Pribadi</option>
                                </select>
                                {isContributor && (
                                    <p className="text-[11px] text-ink-muted mt-1 italic">
                                        Peran Anda Contributor: postingan wajib ditinjau oleh Editor/Admin sebelum terbit.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-ink-secondary mb-1">
                                    Tanggal Publikasi
                                </label>
                                <input
                                    type="date"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full text-xs border border-sidebar-border rounded p-2 focus:border-prussian"
                                />
                            </div>

                            <div className="pt-2 border-t border-sidebar-border flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_pinned"
                                    checked={data.is_pinned}
                                    onChange={(e) => setData('is_pinned', e.target.checked)}
                                    className="rounded border-sidebar-border text-prussian focus:ring-prussian"
                                />
                                <label htmlFor="is_pinned" className="text-xs font-medium text-ink cursor-pointer">
                                    Sematkan di Beranda (Pinned)
                                </label>
                            </div>
                        </div>

                        {/* Categories Box */}
                        {categories.length > 0 && (
                            <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs space-y-3">
                                <h3 className="font-serif font-bold text-sm text-ink border-b border-sidebar-border pb-2">
                                    Kategori
                                </h3>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                    {categories.map((c) => (
                                        <label
                                            key={c.id}
                                            className="flex items-center gap-2 text-xs text-ink cursor-pointer hover:text-prussian"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.category_ids.includes(c.id)}
                                                onChange={() => toggleCategory(c.id)}
                                                className="rounded border-sidebar-border text-prussian focus:ring-prussian"
                                            />
                                            <span>{c.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Slug URL Box */}
                        <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs space-y-2">
                            <h3 className="font-serif font-bold text-sm text-ink border-b border-sidebar-border pb-2">
                                Tautan Permanen (Slug)
                            </h3>
                            <input
                                type="text"
                                placeholder="judul-artikel-slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className="w-full text-xs font-mono border border-sidebar-border rounded p-2 focus:border-prussian"
                            />
                        </div>

                        {/* Built-in SEO Panel */}
                        <div className="bg-white rounded border border-sidebar-border p-4 shadow-xs space-y-3">
                            <h3 className="font-serif font-bold text-sm text-ink border-b border-sidebar-border pb-2 flex items-center gap-1.5">
                                <GlobeAltIcon className="w-4 h-4 text-prussian" />
                                <span>Optimasi SEO & OpenGraph</span>
                            </h3>

                            <div>
                                <label className="block text-xs font-medium text-ink-secondary mb-1">
                                    Meta Title (Google / Tab Browser)
                                </label>
                                <input
                                    type="text"
                                    placeholder={data.title || 'Judul untuk mesin pencari'}
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    className="w-full text-xs border border-sidebar-border rounded p-2 focus:border-prussian"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-ink-secondary mb-1">
                                    Meta Description
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Deskripsi ringkas yang tampil di hasil pencarian Google..."
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    className="w-full text-xs border border-sidebar-border rounded p-2 focus:border-prussian"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
