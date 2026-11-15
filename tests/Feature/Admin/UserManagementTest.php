<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Seed roles
    Role::findOrCreate('Super Admin', 'web');
    Role::findOrCreate('Editor', 'web');
    Role::findOrCreate('Contributor', 'web');
});

test('guest cannot access user management', function () {
    $response = $this->get(route('admin.users.index'));
    $response->assertRedirect(route('login'));
});

test('non super admin cannot access user management', function () {
    $editor = User::factory()->create();
    $editor->assignRole('Editor');

    $response = $this->actingAs($editor)->get(route('admin.users.index'));
    $response->assertForbidden();
});

test('super admin can view user management page', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $response = $this->actingAs($admin)->get(route('admin.users.index'));
    $response->assertOk();
});

test('super admin can create a new user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => 'Guru Baru',
        'email' => 'gurubaru@example.com',
        'role' => 'Editor',
        'password' => 'Password123#',
        'password_confirmation' => 'Password123#',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'email' => 'gurubaru@example.com',
        'name' => 'Guru Baru',
    ]);

    $createdUser = User::where('email', 'gurubaru@example.com')->first();
    expect($createdUser->hasRole('Editor'))->toBeTrue();
});

test('super admin can update existing user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $target = User::factory()->create(['name' => 'Old Name', 'email' => 'old@example.com']);
    $target->assignRole('Contributor');

    $response = $this->actingAs($admin)->put(route('admin.users.update', $target), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'role' => 'Editor',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'id' => $target->id,
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
    ]);

    $target->refresh();
    expect($target->hasRole('Editor'))->toBeTrue();
    expect($target->hasRole('Contributor'))->toBeFalse();
});

test('super admin cannot demote the only super admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $response = $this->actingAs($admin)->put(route('admin.users.update', $admin), [
        'name' => $admin->name,
        'email' => $admin->email,
        'role' => 'Editor',
    ]);

    $response->assertSessionHasErrors('role');
    $admin->refresh();
    expect($admin->hasRole('Super Admin'))->toBeTrue();
});

test('super admin cannot delete own account', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $admin));
    $response->assertSessionHasErrors('user');
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

test('super admin cannot delete the last super admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Super Admin');

    $anotherAdmin = User::factory()->create();
    $anotherAdmin->assignRole('Super Admin');

    // Currently 2 super admins, now acting as anotherAdmin and delete $admin -> should succeed
    $response = $this->actingAs($anotherAdmin)->delete(route('admin.users.destroy', $admin));
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('users', ['id' => $admin->id]);

    // Now only 1 super admin left ($anotherAdmin). If another user tried to delete $anotherAdmin -> guarded
    $editor = User::factory()->create();
    $editor->assignRole('Super Admin'); // make him super admin to allow request
    // Now delete $editor -> leaving 1
    $this->actingAs($anotherAdmin)->delete(route('admin.users.destroy', $editor));

    // Try deleting last super admin
    $response = $this->actingAs($anotherAdmin)->delete(route('admin.users.destroy', $anotherAdmin));
    // Guarded by self-delete or last-super-admin
    $this->assertDatabaseHas('users', ['id' => $anotherAdmin->id]);
});
