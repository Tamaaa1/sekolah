<?php

use App\Models\Gallery;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Permission::findOrCreate('manage galleries', 'web');
    $superAdmin = Role::findOrCreate('Super Admin', 'web');
    $superAdmin->givePermissionTo('manage galleries');

    $editor = Role::findOrCreate('Editor', 'web');
    $editor->givePermissionTo('manage galleries');
});

test('public user can visit galleries directory', function () {
    Gallery::create([
        'title' => 'Upacara Uji Coba',
        'slug' => 'upacara-uji-coba',
        'category' => 'Upacara & Peringatan',
        'description' => 'Dokumentasi upacara pengujian',
        'cover_image' => 'https://example.com/cover.jpg',
        'event_date' => '2026-08-17',
        'images' => [
            ['url' => 'https://example.com/1.jpg', 'caption' => 'Foto 1'],
        ],
        'is_active' => true,
    ]);

    $response = $this->get('/galeri');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('gallery-directory')
        ->has('galleries')
        ->has('categories')
    );
});

test('public user can filter galleries by category', function () {
    Gallery::create([
        'title' => 'Kemah Pramuka',
        'slug' => 'kemah-pramuka',
        'category' => 'Ekstrakurikuler',
        'is_active' => true,
    ]);

    Gallery::create([
        'title' => 'Pameran Karya Seni',
        'slug' => 'pameran-karya-seni',
        'category' => 'Seni & Budaya',
        'is_active' => true,
    ]);

    $response = $this->get('/galeri?category=Ekstrakurikuler');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('gallery-directory')
        ->where('filters.category', 'Ekstrakurikuler')
        ->has('galleries', 1)
    );
});

test('super admin can access gallery admin and perform CRUD', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    // Index
    $response = $this->actingAs($admin)->get(route('admin.galleries.index'));
    $response->assertOk();

    // Store
    $response = $this->actingAs($admin)->post(route('admin.galleries.store'), [
        'title' => 'Album Baru Terverifikasi',
        'category' => 'Kegiatan Akademik',
        'description' => 'Deskripsi album uji.',
        'cover_image' => 'https://example.com/cover.jpg',
        'event_date' => '2026-10-10',
        'images' => [
            ['url' => 'https://example.com/img1.jpg', 'caption' => 'Momen 1'],
            ['url' => 'https://example.com/img2.jpg', 'caption' => 'Momen 2'],
        ],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('galleries', [
        'title' => 'Album Baru Terverifikasi',
        'slug' => 'album-baru-terverifikasi',
    ]);

    $gallery = Gallery::where('slug', 'album-baru-terverifikasi')->first();
    expect(count($gallery->images))->toBe(2);

    // Update
    $response = $this->actingAs($admin)->put(route('admin.galleries.update', $gallery), [
        'title' => 'Album Baru Terverifikasi Revisi',
        'category' => 'Kegiatan Akademik',
        'event_date' => '2026-10-11',
        'is_active' => true,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('galleries', [
        'id' => $gallery->id,
        'title' => 'Album Baru Terverifikasi Revisi',
    ]);

    // Delete
    $response = $this->actingAs($admin)->delete(route('admin.galleries.destroy', $gallery));
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('galleries', [
        'id' => $gallery->id,
    ]);
});
