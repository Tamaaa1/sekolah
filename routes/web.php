<?php

use App\Http\Controllers\PublicPortalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Public Portal Sekolah
|--------------------------------------------------------------------------
*/

Route::get('/', [PublicPortalController::class, 'home'])->name('home');
Route::get('/guru-dan-staf', [PublicPortalController::class, 'staff'])->name('public.staff');
Route::get('/ekstrakurikuler', [PublicPortalController::class, 'extracurriculars'])->name('public.extracurriculars');
Route::get('/prestasi', [PublicPortalController::class, 'achievements'])->name('public.achievements');
Route::get('/agenda', [PublicPortalController::class, 'agendas'])->name('public.agendas');
Route::get('/ppdb', [PublicPortalController::class, 'ppdb'])->name('public.ppdb');

/*
|--------------------------------------------------------------------------
| Admin & Dashboard Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

/*
|--------------------------------------------------------------------------
| Dynamic Content Catch-All (Posts, Pages, Announcements)
|--------------------------------------------------------------------------
*/
Route::get('/{slug}', [PublicPortalController::class, 'post'])->name('public.post');
