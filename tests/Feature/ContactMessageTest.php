<?php

use App\Models\ContactMessage;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Permission::findOrCreate('manage messages', 'web');
    $superAdmin = Role::findOrCreate('Super Admin', 'web');
    $superAdmin->givePermissionTo('manage messages');

    $editor = Role::findOrCreate('Editor', 'web');
    $editor->givePermissionTo('manage messages');
});

test('public user can visit contact page', function () {
    $response = $this->get('/kontak');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('contact')
        ->has('settings')
    );
});

test('public user can submit contact message', function () {
    $response = $this->post(route('public.contact.store'), [
        'name' => 'Budi Santoso',
        'email' => 'budisantoso@example.com',
        'phone' => '081234567890',
        'subject' => 'Pertanyaan PPDB 2026',
        'message' => 'Selamat siang, saya ingin menanyakan syarat pendaftaran jalur zonasi.',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('contact_messages', [
        'name' => 'Budi Santoso',
        'email' => 'budisantoso@example.com',
        'subject' => 'Pertanyaan PPDB 2026',
        'is_read' => false,
    ]);
});

test('super admin can view messages in admin inbox', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    ContactMessage::create([
        'name' => 'Pengirim Uji',
        'email' => 'pengirim@example.com',
        'subject' => 'Subjek Uji',
        'message' => 'Pesan pengujian',
        'is_read' => false,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.messages.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/messages/index')
        ->where('unreadCount', 1)
        ->has('messages.data', 1)
    );
});

test('super admin can toggle read status and delete message', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $msg = ContactMessage::create([
        'name' => 'Pengirim A',
        'email' => 'pengirim@example.com',
        'subject' => 'Saran',
        'message' => 'Saran pengujian',
        'is_read' => false,
    ]);

    // Toggle read
    $response = $this->actingAs($admin)->patch(route('admin.messages.toggle-read', $msg));
    $response->assertSessionHasNoErrors();
    $msg->refresh();
    expect($msg->is_read)->toBeTrue();

    // Delete
    $response = $this->actingAs($admin)->delete(route('admin.messages.destroy', $msg));
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('contact_messages', [
        'id' => $msg->id,
    ]);
});
