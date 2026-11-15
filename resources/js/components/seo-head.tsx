import { Head, usePage } from '@inertiajs/react';

type SeoHeadProps = {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string | null;
    ogType?: 'website' | 'article';
    author?: string;
    publishedAt?: string | null;
    updatedAt?: string | null;
    jsonLd?: Record<string, any> | Array<Record<string, any>>;
    noIndex?: boolean;
};

export default function SeoHead({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType = 'website',
    author = 'SMP Negeri 5 Sambas',
    publishedAt,
    updatedAt,
    jsonLd,
    noIndex = false,
}: SeoHeadProps) {
    const page = usePage<{ settings?: Record<string, any> }>();
    const settings = page.props.settings || {};

    const defaultSchoolName = settings.school_name || 'SMP Negeri 5 Sambas';
    const defaultTagline = settings.school_tagline || 'Berkarakter, Berprestasi, dan Berwawasan Global';
    const defaultDescription =
        description ||
        `Portal Resmi ${defaultSchoolName}, Sambas, Kalimantan Barat. Informasi profil sekolah, penerimaan peserta didik baru (PPDB), prestasi akademik dan non-akademik, warta kegiatan, serta agenda pendidikan terkini.`;

    const fullTitle = title
        ? title.includes(defaultSchoolName)
            ? title
            : `${title} | ${defaultSchoolName}`
        : `${defaultSchoolName} - ${defaultTagline}`;

    const defaultKeywords =
        keywords ||
        `SMP Negeri 5 Sambas, SMPN 5 Sambas, sekolah menengah pertama sambas, PPDB SMPN 5 Sambas, sekolah unggul sambas, pendidikan sambas kalbar, prestasi siswa smpn 5 sambas`;

    // Resolve current absolute URL
    const currentPath = typeof window !== 'undefined' ? window.location.href : (page.url || '/');
    const resolvedCanonical = canonicalUrl || currentPath;

    // Resolve OG Image URL
    const defaultImage = settings.hero_banner_image || '/images/logo.png';
    const resolvedImage = ogImage || defaultImage;

    return (
        <Head>
            {/* Primary Page Title */}
            <title>{fullTitle}</title>

            {/* Standard Meta Tags */}
            <meta name="title" content={fullTitle} />
            <meta name="description" content={defaultDescription} />
            <meta name="keywords" content={defaultKeywords} />
            <meta name="author" content={author} />
            <meta
                name="robots"
                content={
                    noIndex
                        ? 'noindex, nofollow'
                        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
                }
            />
            <meta
                name="googlebot"
                content={
                    noIndex
                        ? 'noindex, nofollow'
                        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
                }
            />

            {/* Canonical Link */}
            <link rel="canonical" href={resolvedCanonical} />

            {/* Open Graph / Facebook Meta Tags */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={resolvedCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={defaultDescription} />
            <meta property="og:site_name" content={defaultSchoolName} />
            <meta property="og:locale" content="id_ID" />
            {resolvedImage && <meta property="og:image" content={resolvedImage} />}

            {/* Article Specific Open Graph Tags */}
            {ogType === 'article' && publishedAt && (
                <meta property="article:published_time" content={publishedAt} />
            )}
            {ogType === 'article' && updatedAt && (
                <meta property="article:modified_time" content={updatedAt} />
            )}
            {ogType === 'article' && author && (
                <meta property="article:author" content={author} />
            )}

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={resolvedCanonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={defaultDescription} />
            {resolvedImage && <meta name="twitter:image" content={resolvedImage} />}

            {/* Structured Data (Schema.org JSON-LD) */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
}
