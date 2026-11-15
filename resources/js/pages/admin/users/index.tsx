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

export default function UserIndex({ users, roles, filters }: Props) {
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            { q: search || undefined, role: selectedRole || undefined },
            { preserveState: true }
        );
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        router.get(
            '/admin/users',
            { q: search || undefined, role: role || undefined },
            { preserveState: true }
        );
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-prussian text-white">
                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                        Super Admin
                    </span>
                );
            case 'Editor':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Editor (Guru)
                    </span>
                );
            case 'Contributor':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                        Contributor (OSIS)
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
                        {roleName}
                    </span>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna - Admin CMS" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-ink flex items-center gap-2">
                            <UsersIcon className="w-7 h-7 text-prussian" />
                            Manajemen Akun Pengguna
                        </h1>
                        <p className="text-sm text-ink-secondary mt-1">
                            Kelola akun akses staf tata usaha, dewan guru pembina, dan pengurus OSIS pada portal sekolah.
                        </p>
                    </div>
                    <Button onClick={openCreateModal} className="shrink-0 bg-prussian text-white hover:bg-prussian-dark">
                        <PlusIcon className="w-4 h-4 mr-1.5" />
                        Tambah Pengguna Baru
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <Input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 text-sm"
                        />
                    </form>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-ink-secondary whitespace-nowrap">Filter Peran:</span>
                        <select
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            className="text-xs rounded-md border border-line bg-white px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-prussian"
                        >
                            <option value="">Semua Peran</option>
                            {roles.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg border border-line overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-ink">
                            <thead className="bg-canvas-subtle text-xs uppercase tracking-wider text-ink-secondary font-semibold border-b border-line">
                                <tr>
                                    <th className="px-5 py-3.5">Nama Petugas</th>
                                    <th className="px-5 py-3.5">Email Akun</th>
                                    <th className="px-5 py-3.5">Peran / Hak Akses</th>
                                    <th className="px-5 py-3.5">Terdaftar Sejak</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-ink-secondary">
                                            Tidak ditemukan pengguna yang sesuai dengan kriteria pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-canvas-subtle/50 transition-colors">
                                            <td className="px-5 py-4 font-medium text-ink flex items-center gap-2.5">
                                                <UserCircleIcon className="w-8 h-8 text-prussian/70 shrink-0" />
                                                <div>
                                                    <div className="font-semibold">{user.name}</div>
                                                    {user.id === currentUserId && (
                                                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-prussian-light text-prussian rounded font-semibold">
                                                            (Akun Anda)
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-ink-secondary font-mono text-xs">
                                                {user.email}
                                            </td>
                                            <td className="px-5 py-4">
                                                {user.roles.length > 0
                                                    ? getRoleBadge(user.roles[0].name)
                                                    : <span className="text-xs text-ink-muted">Tanpa Peran</span>}
                                            </td>
                                            <td className="px-5 py-4 text-xs text-ink-secondary">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(user)}
                                                        className="text-ink hover:text-prussian h-8 px-2"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={user.id === currentUserId}
                                                        onClick={() => setUserToDelete(user)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2 disabled:opacity-40"
                                                    >
                                                        <TrashIcon className="w-4 h-4 mr-1" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.total > 10 && (
                        <div className="px-5 py-3 border-t border-line flex items-center justify-between text-xs text-ink-secondary">
                            <div>
                                Menampilkan total <strong>{users.total}</strong> pengguna
                            </div>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        disabled={!link.url || link.active}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 rounded border text-xs ${
                                            link.active
                                                ? 'bg-prussian text-white border-prussian font-semibold'
                                                : link.url
                                                ? 'bg-white border-line hover:bg-canvas-subtle'
                                                : 'text-ink-muted border-line/40 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
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
                            {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
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
                            {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
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
                            {formErrors.role && <p className="text-xs text-red-600 mt-1">{formErrors.role}</p>}
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
                            {formErrors.password && <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>}
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
                                className="bg-prussian text-white hover:bg-prussian-dark"
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
