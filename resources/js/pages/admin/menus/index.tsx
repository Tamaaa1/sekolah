import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Bars3Icon,
    ChevronRightIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

type MenuItem = {
    id: number;
    parent_id: number | null;
    label: string;
    link_type: 'internal_post' | 'custom_url';
    target_id: number | null;
    custom_url: string | null;
    sort_order: number;
    target_post?: {
        id: number;
        title: string;
        slug: string;
    } | null;
};

type Menu = {
    id: number;
    name: string;
    location: string;
    items: MenuItem[];
};

type Props = {
    menu: Menu;
    pages: { id: number; title: string; slug: string }[];
};

export default function MenuBuilderIndex({ menu, pages = [] }: Props) {
    const rootItems = (menu.items || []).filter((i) => !i.parent_id);

    const { data, setData, post, processing, reset } = useForm({
        label: '',
        link_type: 'custom_url',
        custom_url: '',
        target_id: pages[0]?.id || '',
        parent_id: '',
        sort_order: menu.items?.length || 0,
    });

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/menus/${menu.id}/items`, {
            onSuccess: () => {
                reset('label', 'custom_url');
            },
        });
    };

    const handleDeleteItem = (id: number) => {
        if (confirm('Hapus item navigasi ini?')) {
            router.delete(`/admin/menus/items/${id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Menu Builder Dinamis', href: '/admin/menus' },
            ]}
        >
            <Head title="Pengelola Menu Navigasi" />

            <div className="p-6 space-y-6">
                <div className="border-b border-sidebar-border pb-4">
                    <h1 className="text-2xl font-serif font-bold text-ink">
                        Dynamic Menu Builder
                    </h1>
                    <p className="text-xs text-ink-muted mt-0.5">
                        Susun struktur menu navigasi Header & Dropdown publik tanpa mengubah kode.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Menu Tree Structure (Col 7) */}
                    <div className="lg:col-span-7 bg-white rounded border border-sidebar-border p-6 shadow-xs">
                        <h2 className="font-serif font-bold text-base text-ink mb-4 border-b border-sidebar-border pb-2">
                            Struktur Navigasi ({menu.name})
                        </h2>

                        <div className="space-y-3">
                            {rootItems.length > 0 ? (
                                rootItems.map((item) => {
                                    const children = (menu.items || []).filter(
                                        (i) => i.parent_id === item.id
                                    );

                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded border border-sidebar-border bg-canvas-paper p-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Bars3Icon className="w-4 h-4 text-ink-muted" />
                                                    <span className="font-semibold text-sm text-ink">
                                                        {item.label}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-ink-muted">
                                                        {item.link_type === 'internal_post'
                                                            ? `Halaman: /${item.target_post?.slug || ''}`
                                                            : item.custom_url}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="text-status-urgent hover:text-red-700 p-1"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Level 2 Nested Submenu */}
                                            {children.length > 0 && (
                                                <div className="mt-2.5 pl-6 space-y-2 border-l-2 border-prussian/40 ml-2">
                                                    {children.map((child) => (
                                                        <div
                                                            key={child.id}
                                                            className="flex items-center justify-between p-2 rounded bg-white border border-sidebar-border text-xs"
                                                        >
                                                            <div className="flex items-center gap-1.5">
                                                                <ChevronRightIcon className="w-3.5 h-3.5 text-prussian" />
                                                                <span className="font-medium text-ink">
                                                                    {child.label}
                                                                </span>
                                                                <span className="text-[10px] font-mono text-ink-muted">
                                                                    ({child.link_type === 'internal_post'
                                                                        ? `/${child.target_post?.slug || ''}`
                                                                        : child.custom_url})
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteItem(child.id)}
                                                                className="text-status-urgent hover:text-red-700 p-0.5"
                                                            >
                                                                <TrashIcon className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-ink-muted italic py-4 text-center">
                                    Belum ada menu yang dibuat. Tambahkan melalui form di samping.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: Add Item Form (Col 5) */}
                    <div className="lg:col-span-5 bg-white rounded border border-sidebar-border p-6 shadow-xs space-y-4">
                        <h2 className="font-serif font-bold text-base text-ink border-b border-sidebar-border pb-2">
                            Tambah Tautan Menu Baru
                        </h2>

                        <form onSubmit={handleAddItem} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-ink-secondary mb-1">
                                    Label Teks Menu
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Ekstrakurikuler"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-ink-secondary mb-1">
                                    Induk Menu (Dropdown Tingkat 2)
                                </label>
                                <select
                                    value={data.parent_id}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                >
                                    <option value="">Menu Utama Tingkat 1 (Bukan Submenu)</option>
                                    {rootItems.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            Di dalam menu: "{r.label}"
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-ink-secondary mb-1">
                                    Tipe Tautan
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="link_type"
                                            value="custom_url"
                                            checked={data.link_type === 'custom_url'}
                                            onChange={() => setData('link_type', 'custom_url')}
                                        />
                                        <span>URL Manual</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="link_type"
                                            value="internal_post"
                                            checked={data.link_type === 'internal_post'}
                                            onChange={() => setData('link_type', 'internal_post')}
                                        />
                                        <span>Halaman Statis</span>
                                    </label>
                                </div>
                            </div>

                            {data.link_type === 'custom_url' ? (
                                <div>
                                    <label className="block font-semibold text-ink-secondary mb-1">
                                        Alamat URL Tujuan
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: /agenda atau https://..."
                                        value={data.custom_url}
                                        onChange={(e) => setData('custom_url', e.target.value)}
                                        className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian font-mono"
                                        required
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block font-semibold text-ink-secondary mb-1">
                                        Pilih Halaman Statis
                                    </label>
                                    <select
                                        value={data.target_id}
                                        onChange={(e) => setData('target_id', e.target.value)}
                                        className="w-full text-xs border border-sidebar-border rounded p-2.5 focus:border-prussian"
                                    >
                                        {pages.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.title} (/{p.slug})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 rounded bg-prussian hover:bg-prussian-hover text-white font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>{processing ? 'Menambahkan...' : 'Tambahkan ke Menu'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

