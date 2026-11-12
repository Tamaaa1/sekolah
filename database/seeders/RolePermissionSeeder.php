<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Daftar Permission
        $permissions = [
            // Konten
            'view posts',
            'create posts',
            'edit posts',
            'delete posts',
            'publish posts',

            // Pengumuman & Agenda
            'manage announcements',
            'manage agendas',

            // Media
            'manage media',

            // Modul Khusus SMP
            'manage staff',
            'manage extracurriculars',
            'manage achievements',
            'manage ppdb',

            // Pengaturan & Menu (Super Admin only)
            'manage menus',
            'manage settings',
            'manage users',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // 1. Role Super Admin
        $superAdminRole = Role::findOrCreate('Super Admin', 'web');
        $superAdminRole->syncPermissions(Permission::all());

        // 2. Role Editor (Guru / Humas)
        $editorRole = Role::findOrCreate('Editor', 'web');
        $editorRole->syncPermissions([
            'view posts',
            'create posts',
            'edit posts',
            'delete posts',
            'publish posts',
            'manage announcements',
            'manage agendas',
            'manage media',
            'manage staff',
            'manage extracurriculars',
            'manage achievements',
        ]);

        // 3. Role Contributor (OSIS / Siswa / Ekskul)
        $contributorRole = Role::findOrCreate('Contributor', 'web');
        $contributorRole->syncPermissions([
            'view posts',
            'create posts',
            'edit posts',
            'manage media',
        ]);

        // Buat Akun Pengguna Awal
        $admin = User::firstOrCreate(
            ['email' => 'admin@sekolah.sch.id'],
            [
                'name' => 'Tata Usaha (Super Admin)',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles([$superAdminRole]);

        $guru = User::firstOrCreate(
            ['email' => 'guru@sekolah.sch.id'],
            [
                'name' => 'Bapak Pembina (Editor)',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $guru->syncRoles([$editorRole]);

        $osis = User::firstOrCreate(
            ['email' => 'osis@sekolah.sch.id'],
            [
                'name' => 'Pengurus OSIS (Contributor)',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $osis->syncRoles([$contributorRole]);
    }
}
