import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    KeyIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon,
    ShieldCheckIcon,
    TrashIcon,
    UserCircleIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '@/types';

interface Role {
    id: number;
    name: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    roles: Role[];
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    users: PaginatedUsers;
    roles: string[];
    counts?: {
        all: number;
        super_admin: number;
        editor: number;
        contributor: number;
    };
    currentRole?: string;
    filters: {
        q?: string;
        role?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '/admin/users',
    },
];

export default function UserIndex({
    users,
    roles,
    counts,
    currentRole = '',
    filters,
}: Props) {
    const page = usePage<{ auth: { user: { id: number } } }>();
    const currentUserId = page.props.auth?.user?.id;

    const [search, setSearch] = useState(filters.q || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');

    // Form Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Editor',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Modal State
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

    const handleFilter = (roleVal = selectedRole, qVal = search) => {
        router.get(
            '/admin/users',
            { q: qVal || undefined, role: roleVal || undefined },
            { preserveState: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter(selectedRole, search);
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'Editor',
            password: '',
        });
        setFormErrors({});
        setIsFormOpen(true);
    };

    const openEditModal = (user: UserItem) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.roles[0]?.name || 'Editor',
            password: '',
        });
        setFormErrors({});
        setIsFormOpen(true);
    };

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});

        if (editingUser) {
            router.put(`/admin/users/${editingUser.id}`, formData, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    toast.success('Akun pengguna berhasil diperbarui.');
                },
                onError: (errors: any) => {
                    setFormErrors(errors);
                    toast.error('Gagal memperbarui akun. Silakan periksa formulir.');
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post('/admin/users', formData, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    toast.success('Akun pengguna baru berhasil dibuat.');
                },
                onError: (errors: any) => {
                    setFormErrors(errors);
                    toast.error('Gagal membuat akun. Silakan periksa formulir.');
                },
                onFinish: () => setIsSubmitting(false),
            });
        }
    };

    const handleDelete = () => {
        if (!userToDelete) return;

        router.delete(`/admin/users/${userToDelete.id}`, {
            onSuccess: () => {
                setUserToDelete(null);
                toast.success('Akun pengguna berhasil dihapus.');
            },
            onError: (errors: any) => {
                setUserToDelete(null);
                const msg = errors.user || 'Gagal menghapus pengguna.';
                toast.error(msg);
            },
        });
    };

    const getRoleBadge = (roleName: string) => {
        switch (roleName) {
            case 'Super Admin':
                return (
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-prussian text-white">
                        Super Admin
                    </span>
                );
            case 'Editor':
                return (
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-status-published-bg text-status-published border border-emerald-200">
                        Editor (Guru)
                    </span>
                );
            case 'Contributor':
                return (
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-canvas-subtle text-ink-muted border border-sidebar-border">
                        Contributor (OSIS)
                    </span>
                );
            default:
                return (
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-canvas-subtle text-ink-muted border border-sidebar-border">
                        {roleName}
                    </span>
                );
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna - Admin CMS" />

            <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border pb-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">
                            Manajemen Akun Pengguna
                        </h1>
                        <p className="text-xs text-ink-muted mt-0.5">
                            Kelola akun akses staf tata usaha, dewan guru pembina, dan pengurus OSIS.
                        </p>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Tambah Pengguna Baru</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                        {[
                            { key: '', label: `Semua (${counts?.all ?? users.total})` },
                            { key: 'Super Admin', label: `Super Admin (${counts?.super_admin ?? 0})` },
                            { key: 'Editor', label: `Editor (${counts?.editor ?? 0})` },
                            { key: 'Contributor', label: `Contributor (${counts?.contributor ?? 0})` },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => {
                                    setSelectedRole(tab.key);
                                    handleFilter(tab.key, search);
                                }}
                                className={`px-3 py-1.5 rounded border transition-colors ${
                                    selectedRole === tab.key
                                        ? 'bg-prussian text-white border-prussian font-semibold'
                                        : 'bg-white text-ink border-sidebar-border hover:bg-canvas-subtle'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full sm:w-60">
                        <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
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
                                    <th className="py-3 px-4 text-left">Nama Petugas</th>
                                    <th className="py-3 px-4 text-left w-56 whitespace-nowrap">Email Akun</th>
                                    <th className="py-3 px-4 text-center w-40 whitespace-nowrap">Peran / Hak Akses</th>
                                    <th className="py-3 px-4 text-left w-36 whitespace-nowrap">Terdaftar Sejak</th>
                                    <th className="py-3 px-4 text-right w-24 whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-canvas-subtle/30 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-ink">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-prussian-light text-prussian flex items-center justify-center font-bold text-xs shrink-0 border border-prussian/20">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-ink">{user.name}</span>
                                                            {user.id === currentUserId && (
                                                                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-prussian-light text-prussian rounded font-semibold">
                                                                    Anda
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-xs text-ink-secondary whitespace-nowrap">
                                                {user.email}
                                            </td>
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                {user.roles.length > 0
                                                    ? getRoleBadge(user.roles[0].name)
                                                    : <span className="text-xs text-ink-muted">-</span>}
                                            </td>
                                            <td className="py-3.5 px-4 text-ink-muted whitespace-nowrap">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(user)}
                                                        className="p-1.5 rounded text-prussian hover:bg-canvas-subtle border border-sidebar-border transition-colors"
                                                        title="Sunting Pengguna"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={user.id === currentUserId}
                                                        onClick={() => setUserToDelete(user)}
                                                        className="p-1.5 rounded text-status-urgent hover:bg-red-50 border border-sidebar-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Hapus Pengguna"
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
                                            Tidak ditemukan pengguna pada kriteria ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Individual Cards */}
                    <div className="md:hidden divide-y divide-sidebar-border bg-[#FAF9F6]">
                        {users.data.length > 0 ? (
                            users.data.map((user) => (
                                <div key={user.id} className="p-4 space-y-3 bg-white">
                                    <div className="flex items-start justify-between gap-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-prussian-light text-prussian flex items-center justify-center font-bold text-xs shrink-0 border border-prussian/20">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="font-semibold text-sm text-ink leading-snug">
                                                        {user.name}
                                                    </h3>
                                                    {user.id === currentUserId && (
                                                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-prussian-light text-prussian rounded font-semibold">
                                                            Anda
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] font-mono text-ink-muted mt-0.5">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            {user.roles.length > 0
                                                ? getRoleBadge(user.roles[0].name)
                                                : <span className="text-xs text-ink-muted">-</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-ink-muted">
                                        <span>Terdaftar: {formatDate(user.created_at)}</span>
                                    </div>

                                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-sidebar-border/70">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(user)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-prussian bg-canvas-subtle hover:bg-canvas-subtle/80 border border-sidebar-border transition-colors"
                                        >
                                            <PencilSquareIcon className="w-3.5 h-3.5" />
                                            <span>Sunting</span>
                                        </button>
                                        <button
                                            type="button"
                                            disabled={user.id === currentUserId}
                                            onClick={() => setUserToDelete(user)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-status-urgent bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-ink-muted italic">
                                Tidak ditemukan pengguna pada kriteria ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="bg-white p-3.5 rounded border border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary shadow-2xs">
                        <div>
                            Menampilkan <strong>{users.data.length}</strong> dari <strong>{users.total}</strong> pengguna
                        </div>
                        <div className="flex items-center gap-1">
                            {users.links.map((link, idx) => (
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
            </div>

            {/* Form Modal (Create / Edit) */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-xl">
                            {editingUser ? 'Edit Akun Pengguna' : 'Tambah Pengguna Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveUser} className="space-y-4 pt-2">
                        <div>
                            <Label htmlFor="name" className="text-xs font-semibold">
                                Nama Lengkap Petugas *
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="contoh: Budi Santoso, S.Pd."
                                className="mt-1"
                                required
                            />
                            {formErrors.name && <p className="text-xs text-terracotta mt-1">{formErrors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-xs font-semibold">
                                Alamat Email Resmi *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="budi@smpn5sambas.sch.id"
                                className="mt-1"
                                required
                            />
                            {formErrors.email && <p className="text-xs text-terracotta mt-1">{formErrors.email}</p>}
                        </div>

                        <div>
                            <Label htmlFor="role" className="text-xs font-semibold">
                                Peran / Hak Akses *
                            </Label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-prussian"
                                required
                            >
                                {roles.map((r) => (
                                    <option key={r} value={r}>
                                        {r} {r === 'Super Admin' ? '(Akses Penuh Seluruh Sistem)' : r === 'Editor' ? '(Mengelola Berita & Media)' : '(Draf Penulis OSIS)'}
                                    </option>
                                ))}
                            </select>
                            {formErrors.role && <p className="text-xs text-terracotta mt-1">{formErrors.role}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-xs font-semibold">
                                {editingUser ? 'Kata Sandi Baru (Kosongkan jika tidak ingin diubah)' : 'Kata Sandi Awal *'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder={editingUser ? '••••••••' : 'Minimal 8 karakter kombinasi'}
                                className="mt-1"
                                required={!editingUser}
                            />
                            {formErrors.password && <p className="text-xs text-terracotta mt-1">{formErrors.password}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-prussian text-white hover:bg-prussian-hover text-xs font-semibold px-4 py-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Buat Akun'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
                onConfirm={handleDelete}
                title="Hapus Akun Pengguna"
                description={`Apakah Anda yakin ingin menghapus akun '${userToDelete?.name}' (${userToDelete?.email})? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus Akun"
                cancelText="Batal"
                variant="danger"
            />
        </AppLayout>
    );
}
