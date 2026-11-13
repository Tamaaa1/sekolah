<?php

use App\Http\Controllers\Admin\AcademicAgendaController;
use App\Http\Controllers\Admin\AchievementController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\ExtracurricularController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StaffDirectoryController;
use App\Http\Controllers\PublicPortalController;
use App\Models\AcademicAgenda;
use App\Models\Achievement;
use App\Models\ActivityLog;
use App\Models\Extracurricular;
use App\Models\Media;
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
                'extracurricularCount' => Extracurricular::count(),
                'achievementCount' => Achievement::count(),
                'mediaCount' => Media::count(),
                'activityLogCount' => ActivityLog::count(),
                'recentPosts' => Post::latest()->take(5)->get(),
                'recentLogs' => ActivityLog::latest('id')->take(5)->get(),
            ]);
        })->name('dashboard');

        Route::resource('posts', PostController::class);
        Route::resource('staff', StaffDirectoryController::class)->except(['create', 'show', 'edit']);
        Route::resource('extracurriculars', ExtracurricularController::class)->except(['create', 'show', 'edit']);
        Route::resource('achievements', AchievementController::class)->except(['create', 'show', 'edit']);
        Route::resource('agendas', AcademicAgendaController::class)->except(['create', 'show', 'edit']);
        Route::resource('media', MediaController::class)->only(['index', 'store', 'destroy']);
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
        Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
        Route::post('menus/{menu}/items', [MenuController::class, 'storeItem'])->name('menus.items.store');
        Route::delete('menus/items/{item}', [MenuController::class, 'destroyItem'])->name('menus.items.destroy');
        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::delete('activity-logs', [ActivityLogController::class, 'clear'])->name('activity-logs.clear');
    });
});

require __DIR__.'/settings.php';

/*
|--------------------------------------------------------------------------
| Dynamic Content Catch-All (Posts, Pages, Announcements)
|--------------------------------------------------------------------------
*/
Route::get('/{slug}', [PublicPortalController::class, 'post'])->name('public.post');
