import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';
import {
    AcademicCapIcon,
    ArrowUpTrayIcon,
    BuildingOfficeIcon,
    CheckIcon,
    MegaphoneIcon,
    PhoneIcon,
    PhotoIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

type Props = {
    settings: Record<string, any>;
};

export default function SettingsIndex({ settings = {} }: Props) {
    const [bannerPreview, setBannerPreview] = useState<string | null>(
        settings?.hero_banner_image || null
    );
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const { data, setData, processing, recentlySuccessful } = useForm({
        school_name: settings?.school_name || 'SMP Negeri 5 Sambas',
        npsn: settings?.npsn || '20109876',
        accreditation: settings?.accreditation || 'A (Unggul)',
        school_tagline: settings?.school_tagline || 'Berkarakter, Berprestasi, dan Berwawasan Global',
        principal_name: settings?.principal_name || 'Drs. H. Mulyadi, M.Pd.',
        principal_speech: settings?.principal_speech || '',
        phone: settings?.phone || '(021) 7890-1234',
        whatsapp: settings?.whatsapp || '0812-3456-7890',
        email: settings?.email || 'humas@smpn5sambas.sch.id',
        address: settings?.address || 'Jl. Pendidikan Bangsa No. 45, Jakarta Selatan',
        ppdb_is_open: settings?.ppdb_is_open ?? true,
        ppdb_year: settings?.ppdb_year || '2026/2027',
        ppdb_portal_url: settings?.ppdb_portal_url || 'https://siap-ppdb.kemdikbud.go.id',
        ppdb_brochure_url: settings?.ppdb_brochure_url || '/documents/brosur-ppdb-2026.pdf',
        hero_banner_caption: settings?.hero_banner_caption || '',
        remove_hero_banner: false,
    });

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            setData('remove_hero_banner', false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBanner = () => {
        setBannerFile(null);
        setBannerPreview(null);
        setData('remove_hero_banner', true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/admin/settings',
            {
                ...data,
                hero_banner_image: bannerFile,
                _method: 'PUT',
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Pengaturan identitas dan banner sekolah berhasil disimpan.');
                },
                onError: (errors) => {
                    const msg = Object.values(errors).flat().join(', ');
                    toast.error(msg || 'Gagal menyimpan pengaturan sekolah. Silakan periksa formulir.');
                },
            }
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Pengaturan Sekolah', href: '/admin/settings' },
            ]}
        >
            <Head title="Pengaturan Identitas Sekolah" />

            <form onSubmit={handleSubmit} className="p-6 space-y-8 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">
                            Global School Customizer
                        </h1>
                        <p className="text-xs text-ink-muted mt-0.5">
                            Pengaturan profil, kontak resmi, slot foto hero beranda, dan status PPDB yang tampil di portal sekolah.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {recentlySuccessful && (
                            <span className="text-xs font-semibold text-status-published">
                                ✓ Berhasil disimpan!
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                            <CheckIcon className="w-4 h-4" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                        </button>
                    </div>
                </div>

                {/* Section 1: Identitas Sekolah */}
                <div className="bg-white rounded border border-sidebar-border p-6 shadow-xs space-y-4">
                    <h2 className="font-serif font-bold text-base text-ink flex items-center gap-2 border-b border-sidebar-border pb-2">
                        <BuildingOfficeIcon className="w-5 h-5 text-prussian" />
                        <span>Identitas Lembaga & Legalitas</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Nama Resmi Sekolah
                            </label>
                            <input
                                type="text"
                                value={data.school_name}
                                onChange={(e) => setData('school_name', e.target.value)}
                                className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Nomor Pokok Sekolah Nasional (NPSN)
                            </label>
                            <input
                                type="text"
                                value={data.npsn}
                                onChange={(e) => setData('npsn', e.target.value)}
                                className="w-full text-xs font-mono border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Status Akreditasi BAN-S/M
                            </label>
                            <input
                                type="text"
                                value={data.accreditation}
                                onChange={(e) => setData('accreditation', e.target.value)}
                                className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Motto / Tagline Sekolah
                            </label>
                            <input
                                type="text"
                                value={data.school_tagline}
                                onChange={(e) => setData('school_tagline', e.target.value)}
                                className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Kepala Sekolah */}
                <div className="bg-white rounded border border-sidebar-border p-6 shadow-xs space-y-4">
                    <h2 className="font-serif font-bold text-base text-ink flex items-center gap-2 border-b border-sidebar-border pb-2">
                        <AcademicCapIcon className="w-5 h-5 text-prussian" />
                        <span>Pimpinan Sekolah & Sambutan Resmi</span>
                    </h2>

                    <div className="space-y-4 text-xs">
                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Nama Kepala Sekolah (Beserta Gelar)
                            </label>
                            <input
                                type="text"
                                value={data.principal_name}
                                onChange={(e) => setData('principal_name', e.target.value)}
                                className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Teks Sambutan di Halaman Depan
                            </label>
                            <textarea
                                rows={4}
                                value={data.principal_speech}
                                onChange={(e) => setData('principal_speech', e.target.value)}
                                className="w-full text-xs leading-relaxed border border-sidebar-border rounded p-2.5 focus:border-prussian font-serif"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Slot Foto Gedung / Kegiatan Beranda (Hero Section) */}
                <div className="bg-white rounded border border-sidebar-border p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sidebar-border pb-2">
                        <h2 className="font-serif font-bold text-base text-ink flex items-center gap-2">
                            <PhotoIcon className="w-5 h-5 text-prussian" />
                            <span>Slot Foto Gedung / Kegiatan Beranda (Hero Banner)</span>
                        </h2>
                        {bannerPreview && (
                            <button
                                type="button"
                                onClick={handleRemoveBanner}
                                className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 bg-red-50 hover:bg-red-100 transition self-start sm:self-auto"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                                <span>Hapus Foto Banner</span>
                            </button>
                        )}
                    </div>

                    <p className="text-xs text-ink-muted leading-relaxed">
                        Foto gedung atau dokumentasi kegiatan unggulan yang ditampilkan secara opsional di bawah judul beranda portal publik.
                    </p>

                    {bannerPreview ? (
                        <div className="space-y-3">
                            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-lg overflow-hidden border border-stone-200/90 bg-stone-100 shadow-2xs">
                                <img
                                    src={bannerPreview}
                                    alt="Pratinjau Banner Hero"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-prussian hover:text-prussian-hover font-semibold py-1.5 px-3 border border-sidebar-border rounded bg-canvas-subtle hover:bg-canvas-subtle/80 transition self-start">
                                    <ArrowUpTrayIcon className="w-4 h-4" />
                                    <span>Ganti Foto Banner</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleBannerChange}
                                    />
                                </label>
                                <span className="text-[11px] text-ink-muted font-sans">
                                    Maksimal 3 MB (JPG, PNG, WEBP). Rasio 21:9 atau 16:9 disarankan.
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-dashed border-sidebar-border rounded-lg p-6 bg-canvas-subtle flex flex-col items-center justify-center text-center">
                            <PhotoIcon className="w-10 h-10 text-ink-muted mb-2 stroke-1" />
                            <p className="text-xs font-semibold text-ink mb-1">
                                Belum ada foto banner gedung/kegiatan yang dipasang
                            </p>
                            <p className="text-[11px] text-ink-muted mb-4 max-w-sm">
                                Jika dikosongkan, halaman beranda akan tampil ramping berbasis tipografi. Jika diisi, foto akan tampil berbingkai rapi di Hero Section.
                            </p>
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold rounded transition shadow-xs">
                                <ArrowUpTrayIcon className="w-4 h-4" />
                                <span>Pilih & Unggah Foto Banner</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleBannerChange}
                                />
                            </label>
                        </div>
                    )}

                    <div className="pt-2">
                        <label className="block font-semibold text-xs text-ink-secondary mb-1">
                            Keterangan Singkat Foto (Caption, Opsional)
                        </label>
                        <input
                            type="text"
                            value={data.hero_banner_caption}
                            onChange={(e) => setData('hero_banner_caption', e.target.value)}
                            placeholder="Contoh: Gedung Pembelajaran Terpadu & Lapangan Upacara SMP Negeri 5 Sambas"
                            className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                        />
                        <p className="text-[11px] text-ink-muted mt-1">
                            Keterangan ini akan muncul di bagian bawah bingkai foto banner pada halaman depan.
                        </p>
                    </div>
                </div>

                {/* Section 4: Kontak & Lokasi */}
                <div className="bg-white rounded border border-sidebar-border p-6 shadow-xs space-y-4">
                    <h2 className="font-serif font-bold text-base text-ink flex items-center gap-2 border-b border-sidebar-border pb-2">
                        <PhoneIcon className="w-5 h-5 text-prussian" />
                        <span>Kontak Resmi & Alamat Tata Usaha</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Nomor Telepon Sekolah
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Nomor WhatsApp Resmi
                            </label>
                            <input
                                type="text"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
                                className="w-full text-xs font-mono border border-sidebar-border rounded p-2.5 focus:border-prussian"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Alamat Email Humas/TU
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-ink-secondary mb-1">
                                Alamat Lengkap
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 5: Pengaturan PPDB */}
                <div className="bg-white rounded border border-sidebar-border p-6 shadow-xs space-y-4">
                    <h2 className="font-serif font-bold text-base text-ink flex items-center gap-2 border-b border-sidebar-border pb-2">
                        <MegaphoneIcon className="w-5 h-5 text-terracotta" />
                        <span>Konfigurasi Penerimaan Siswa Baru (PPDB)</span>
                    </h2>

                    <div className="space-y-4 text-xs">
                        <div className="flex items-center gap-3 p-3 rounded bg-canvas-paper border border-sidebar-border">
                            <input
                                type="checkbox"
                                id="ppdb_is_open"
                                checked={data.ppdb_is_open}
                                onChange={(e) => setData('ppdb_is_open', e.target.checked)}
                                className="rounded border-sidebar-border text-terracotta focus:ring-terracotta"
                            />
                            <label htmlFor="ppdb_is_open" className="text-xs font-semibold text-ink cursor-pointer">
                                Buka Status Pendaftaran PPDB di Website
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-ink-secondary mb-1">
                                    Tahun Ajaran PPDB
                                </label>
                                <input
                                    type="text"
                                    value={data.ppdb_year}
                                    onChange={(e) => setData('ppdb_year', e.target.value)}
                                    className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-ink-secondary mb-1">
                                    URL Portal Pendaftaran Dinas
                                </label>
                                <input
                                    type="text"
                                    value={data.ppdb_portal_url}
                                    onChange={(e) => setData('ppdb_portal_url', e.target.value)}
                                    className="w-full text-xs font-mono border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
