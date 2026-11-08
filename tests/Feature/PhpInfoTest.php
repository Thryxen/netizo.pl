<?php

use App\Models\User;

it('sends guests to the panel login instead of showing phpinfo', function () {
    $this->get('/phpinfo')->assertRedirect(route('admin.login'));
});

it('returns to phpinfo after signing in to the panel', function () {
    $user = User::factory()->create();

    $this->get('/phpinfo')->assertRedirect(route('admin.login'));

    $this->post(route('admin.login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect('/phpinfo');
});

it('makes an Inertia visit load phpinfo as a full page', function () {
    $this->actingAs(User::factory()->create())
        ->get('/phpinfo', ['X-Inertia' => 'true'])
        ->assertConflict()
        ->assertHeader('X-Inertia-Location', url('/phpinfo'));
});

it('shows phpinfo to a signed-in admin', function () {
    $this->actingAs(User::factory()->create())
        ->get('/phpinfo')
        ->assertOk()
        ->assertSee('PHP Version')
        ->assertSee(PHP_VERSION);
});
