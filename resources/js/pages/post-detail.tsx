import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    ArrowLeftIcon,
    BookmarkIcon,
    CalendarDaysIcon,
    ClockIcon,
    FolderIcon,
    ShareIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

type Category = {
    id: number;
    name: string;
    slug: string;
};

type Author = {
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
    is_pinned: boolean;
    published_at: string | null;
    categories?: Category[];
    author?: Author;
    featured_image?: string | null;
};

type PostDetailProps = {
    post: Post;
    settings: Record<string, any>;
    primaryMenu: any;
    relatedPosts: Post[];
};

export default function PostDetail({
    post,
    settings,
    primaryMenu,
    relatedPosts = [],
}: PostDetailProps) {
    const schoolName = settings?.school_name || 'SMP Negeri 1 Nusantara';

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Render Blocks
    const renderContent = () => {
        if (!post.content) {
            return (
                <p className="text-ink-secondary text-base leading-relaxed">
                    {post.excerpt}
                </p>
            );
        }

        if (Array.isArray(post.content)) {
            return post.content.map((block: any, idx: number) => {
                if (block.type === 'heading') {
                    return (
                        <h2
                            key={idx}
                            className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-8 mb-3"
                        >
                            {block.content}
                        </h2>
                    );
                }
                if (block.type === 'image') {
                    return (
                        <figure key={idx} className="my-6">
                            <img
                                src={block.url || block.content}
                                alt={block.caption || post.title}
                                className="w-full rounded border border-line object-cover"
                            />
                            {block.caption && (
                                <figcaption className="text-xs text-ink-muted text-center mt-2 italic">
                                    {block.caption}
                                </figcaption>
                            )}
                        </figure>
                    );
                }
                return (
                    <p
                        key={idx}
                        className="text-ink-secondary text-base sm:text-lg leading-relaxed my-4"
                    >
                        {block.content || block}
                    </p>
                );
            });
        }

        if (typeof post.content === 'string') {
            return (
                <div
                    className="prose prose-slate max-w-none text-ink-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            );
        }

        return null;
    };

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <Head title={`${post.title} - ${schoolName}`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                {/* Back button */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-prussian hover:underline"
                    >
                        <ArrowLeftIcon className="w-3.5 h-3.5" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                {/* Article Header */}
                <header className="border-b border-line pb-6 mb-8">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-prussian-light text-prussian">
                            {post.type === 'post'
                                ? 'Berita'
                                : post.type === 'announcement'
                                ? 'Pengumuman'
                                : 'Halaman Profil'}
                        </span>
                        {post.categories &&
                            post.categories.map((c) => (
                                <span
                                    key={c.id}
                                    className="px-2 py-0.5 rounded text-xs font-medium bg-canvas-subtle text-ink-secondary"
                                >
                                    {c.name}
                                </span>
                            ))}
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="mt-4 text-base sm:text-lg text-ink-secondary italic leading-relaxed pl-4 border-l-2 border-prussian">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="mt-6 pt-4 border-t border-line/60 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted">
                        <div className="flex items-center gap-4">
                            <span className="inline-flex items-center gap-1.5">
                                <UserIcon className="w-4 h-4 text-prussian" />
                                {post.author?.name || 'Humas SMPN 1 Nusantara'}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDaysIcon className="w-4 h-4 text-prussian" />
                                {formatDate(post.published_at)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ title: post.title, url: window.location.href });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Tautan berhasil disalin ke clipboard!');
                                    }
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-line text-xs font-medium hover:bg-canvas-subtle transition-colors"
                            >
                                <ShareIcon className="w-3.5 h-3.5" />
                                <span>Bagikan</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="bg-white rounded border border-line p-6 sm:p-10 shadow-xs mb-12">
                    {renderContent()}
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="border-t border-line pt-8">
                        <h3 className="font-serif text-xl font-bold text-ink mb-4">
                            Informasi Terkait Lainnya
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relatedPosts.map((r) => (
                                <Link
                                    key={r.id}
                                    href={`/${r.slug}`}
                                    className="bg-white rounded border border-line p-4 block hover:border-line-strong transition-all group"
                                >
                                    <div className="text-[11px] text-ink-muted mb-1">
                                        {formatDate(r.published_at)}
                                    </div>
                                    <h4 className="font-serif font-bold text-sm text-ink group-hover:text-prussian transition-colors line-clamp-2">
                                        {r.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
