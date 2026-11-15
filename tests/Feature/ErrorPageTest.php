<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

test('non existent page renders branded 404 inertia page', function () {
    $response = $this->get('/halaman-yang-pasti-tidak-ada-123456');

    $response->assertStatus(404);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('error')
        ->where('status', 404)
        ->has('settings')
    );
});

test('unauthorized route renders branded 403 inertia page', function () {
    Role::findOrCreate('Editor', 'web');

    $editor = User::factory()->create();
    $editor->assignRole('Editor');

    $response = $this->actingAs($editor)->get(route('admin.users.index'));

    $response->assertStatus(403);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('error')
        ->where('status', 403)
    );
});
