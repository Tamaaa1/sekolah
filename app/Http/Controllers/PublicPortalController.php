<?php

namespace App\Http\Controllers;

use App\Models\AcademicAgenda;
use App\Models\Achievement;
use App\Models\Extracurricular;
use App\Models\Menu;
use App\Models\Post;
use App\Models\Setting;
use App\Models\StaffDirectory;
use Inertia\Inertia;
use Inertia\Response;

class PublicPortalController extends Controller
{
    /**
     * Halaman Beranda Publik Portal Sekolah
     */
    public function home(): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');

        $pinnedPost = Post::published()
            ->posts()
            ->where('is_pinned', true)
            ->with(['author', 'categories'])
            ->latest('published_at')
            ->first();

        if (!$pinnedPost) {
            $pinnedPost = Post::published()
                ->posts()
                ->with(['author', 'categories'])
                ->latest('published_at')
                ->first();
        }

        $latestPosts = Post::published()
            ->posts()
            ->where('id', '!=', $pinnedPost?->id ?? 0)
            ->with(['categories'])
            ->latest('published_at')
            ->take(4)
            ->get();

        $announcements = Post::published()
            ->announcements()
            ->latest('published_at')
            ->take(3)
            ->get();

        $upcomingAgendas = AcademicAgenda::upcoming()
            ->take(4)
            ->get();

        $achievements = Achievement::latest('year')
            ->take(4)
            ->get();

        $principal = StaffDirectory::kepsek()->first();

        return Inertia::render('welcome', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'pinnedPost' => $pinnedPost,
            'latestPosts' => $latestPosts,
            'announcements' => $announcements,
            'upcomingAgendas' => $upcomingAgendas,
            'achievements' => $achievements,
            'principal' => $principal,
        ]);
    }

    /**
     * Detail Berita, Pengumuman, atau Halaman Statis
     */
    public function post(string $slug): Response
    {
        $post = Post::where('slug', $slug)
            ->with(['author', 'categories', 'tags'])
            ->firstOrFail();

        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');

        $relatedPosts = Post::published()
            ->where('type', $post->type)
            ->where('id', '!=', $post->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('post-detail', [
            'post' => $post,
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    /**
     * Direktori Guru & GTK
     */
    public function staff(): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');

        $staff = StaffDirectory::active()
            ->get()
            ->groupBy('category');

        return Inertia::render('staff-directory', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'staff' => $staff,
        ]);
    }

    /**
     * Direktori Ekstrakurikuler
     */
    public function extracurriculars(): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');
        $ekskul = Extracurricular::active()->get();

        return Inertia::render('extracurricular-directory', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'extracurriculars' => $ekskul,
        ]);
    }

    /**
     * Direktori Prestasi Siswa
     */
    public function achievements(): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');
        $achievements = Achievement::orderByDesc('year')->latest()->get();

        return Inertia::render('achievement-directory', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'achievements' => $achievements,
        ]);
    }

    /**
     * Kalender & Agenda Akademik
     */
    public function agendas(): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');
        $agendas = AcademicAgenda::active()->orderByDesc('start_date')->get();

        return Inertia::render('academic-agenda', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'agendas' => $agendas,
        ]);
    }

    /**
     * Halaman Informasi PPDB
     */
    public function ppdb(): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');

        return Inertia::render('ppdb-info', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
        ]);
    }
}

