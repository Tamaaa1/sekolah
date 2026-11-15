<?php

use App\Models\Download;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Permission::findOrCreate('manage downloads', 'web');
    $superAdmin = Role::findOrCreate('Super Admin', 'web');
    $superAdmin->givePermissionTo('manage downloads');

    $editor = Role::findOrCreate('Editor', 'web');
    $editor->givePermissionTo('manage downloads');
});

test('public user can visit downloads directory', function () {
    Download::create([
        'title' => 'Kalender Akademik 2026',
        'slug' => 'kalender-akademik-2026',
        'category' => 'Akademik & Kurikulum',
        'file_path' => '/documents/kalender.pdf',
        'file_type' => 'PDF',
        'file_size' => '1.2 MB',
        'is_active' => true,
    ]);

    $response = $this->get('/unduhan');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('download-directory')
        ->has('downloads')
        ->has('categories')
    );
});

test('public user can filter downloads by category', function () {
    Download::create([
        'title' => 'Kalender Akademik',
        'slug' => 'kalender-akademik',
        'category' => 'Akademik & Kurikulum',
        'file_path' => '/doc1.pdf',
        'is_active' => true,
    ]);

    Download::create([
        'title' => 'Tata Tertib Siswa',
        'slug' => 'tata-tertib-siswa',
        'category' => 'Tata Tertib & Kesiswaan',
        'file_path' => '/doc2.pdf',
        'is_active' => true,
    ]);

    $response = $this->get('/unduhan?category=Tata+Tertib+%26+Kesiswaan');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('download-directory')
        ->where('filters.category', 'Tata Tertib & Kesiswaan')
        ->has('downloads', 1)
    );
});

test('downloading a file increments download count', function () {
    $download = Download::create([
        'title' => 'Formulir Uji Unduh',
        'slug' => 'formulir-uji-unduh',
        'category' => 'Formulir Layanan',
        'file_path' => 'https://example.com/test.pdf',
        'download_count' => 5,
        'is_active' => true,
    ]);

    $response = $this->get(route('public.downloads.file', $download->slug));

    $response->assertRedirect('https://example.com/test.pdf');
    $download->refresh();
    expect($download->download_count)->toBe(6);
});

test('super admin can access downloads admin and perform CRUD', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    // Index
    $response = $this->actingAs($admin)->get(route('admin.downloads.index'));
    $response->assertOk();

    // Store
    $response = $this->actingAs($admin)->post(route('admin.downloads.store'), [
        'title' => 'Dokumen Baru',
        'category' => 'Panduan & Informasi',
        'description' => 'Deskripsi dokumen uji.',
        'file_path' => '/files/panduan.pdf',
        'file_size' => '2.5 MB',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('downloads', [
        'title' => 'Dokumen Baru',
        'slug' => 'dokumen-baru',
        'file_type' => 'PDF',
    ]);

    $item = Download::where('slug', 'dokumen-baru')->first();

    // Update
    $response = $this->actingAs($admin)->put(route('admin.downloads.update', $item), [
        'title' => 'Dokumen Baru Revisi',
        'category' => 'Panduan & Informasi',
        'file_path' => '/files/panduan.pdf',
        'file_type' => 'PDF',
        'is_active' => true,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('downloads', [
        'id' => $item->id,
        'title' => 'Dokumen Baru Revisi',
    ]);

    // Delete
    $response = $this->actingAs($admin)->delete(route('admin.downloads.destroy', $item));
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('downloads', [
        'id' => $item->id,
    ]);
});
