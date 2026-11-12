<?php

use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\PublicPortalController;
use App\Models\AcademicAgenda;
use App\Models\Post;
use App\Models\StaffDirectory;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
| Admin & Dashboard CMS Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('dashboard', [
                'postCount' => Post::where('type', 'post')->count(),
                'announcementCount' => Post::where('type', 'announcement')->count(),
                'staffCount' => StaffDirectory::count(),
                'agendaCount' => AcademicAgenda::count(),
                'recentPosts' => Post::latest()->take(5)->get(),
            ]);
        })->name('dashboard');

        Route::resource('posts', PostController::class);
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
        Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
        Route::post('menus/{menu}/items', [MenuController::class, 'storeItem'])->name('menus.items.store');
        Route::delete('menus/items/{item}', [MenuController::class, 'destroyItem'])->name('menus.items.destroy');
    });
});

require __DIR__.'/settings.php';

/*
|--------------------------------------------------------------------------
| Dynamic Content Catch-All (Posts, Pages, Announcements)
|--------------------------------------------------------------------------
*/
Route::get('/{slug}', [PublicPortalController::class, 'post'])->name('public.post');
