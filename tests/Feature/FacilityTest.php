<?php

use App\Models\Facility;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Permission::findOrCreate('manage facilities', 'web');
    $superAdmin = Role::findOrCreate('Super Admin', 'web');
    $superAdmin->givePermissionTo('manage facilities');

    $editor = Role::findOrCreate('Editor', 'web');
    $editor->givePermissionTo('manage facilities');
});

test('public user can visit facilities page', function () {
    Facility::create([
        'name' => 'Laboratorium Komputer Uji',
        'slug' => 'laboratorium-komputer-uji',
        'category' => 'Ruang Pembelajaran',
        'description' => 'Lab komputer dengan spek lengkap',
        'capacity' => '40 Siswa',
        'location' => 'Gedung B',
        'is_active' => true,
    ]);

    $response = $this->get('/fasilitas');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('facility-directory')
        ->has('facilities')
        ->has('categories')
    );
});

test('public user can filter facilities by category', function () {
    Facility::create([
        'name' => 'Lab IPA Biologi',
        'slug' => 'lab-ipa-biologi',
        'category' => 'Ruang Pembelajaran',
        'is_active' => true,
    ]);

    Facility::create([
        'name' => 'Lapangan Basket',
        'slug' => 'lapangan-basket',
        'category' => 'Sarana Olahraga',
        'is_active' => true,
    ]);

    $response = $this->get('/fasilitas?category=Sarana+Olahraga');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('facility-directory')
        ->where('filters.category', 'Sarana Olahraga')
        ->has('facilities', 1)
    );
});

test('super admin can access facilities admin index', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $response = $this->actingAs($admin)->get(route('admin.facilities.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/facilities/index')
        ->has('facilities.data')
    );
});

test('authorized admin can create, update, and delete facility', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    // Create
    $response = $this->actingAs($admin)->post(route('admin.facilities.store'), [
        'name' => 'Gedung Serbaguna Baru',
        'category' => 'Fasilitas Penunjang',
        'description' => 'Gedung serbaguna untuk upacara dan pentas seni.',
        'location' => 'Area Belakang',
        'capacity' => '500 Orang',
        'features' => ['Sound System', 'Panggung'],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('facilities', [
        'name' => 'Gedung Serbaguna Baru',
        'slug' => 'gedung-serbaguna-baru',
    ]);

    $facility = Facility::where('slug', 'gedung-serbaguna-baru')->first();

    // Update
    $response = $this->actingAs($admin)->put(route('admin.facilities.update', $facility), [
        'name' => 'Gedung Serbaguna Terpadu',
        'category' => 'Fasilitas Penunjang',
        'description' => 'Deskripsi diperbarui.',
        'is_active' => true,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('facilities', [
        'id' => $facility->id,
        'name' => 'Gedung Serbaguna Terpadu',
    ]);

    // Delete
    $response = $this->actingAs($admin)->delete(route('admin.facilities.destroy', $facility));

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('facilities', [
        'id' => $facility->id,
    ]);
});
