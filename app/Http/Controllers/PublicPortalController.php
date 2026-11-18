<?php

namespace App\Http\Controllers;

use App\Models\AcademicAgenda;
use App\Models\Achievement;
use App\Models\ContactMessage;
use App\Models\Extracurricular;
use App\Models\Facility;
use App\Models\Gallery;
use App\Models\Menu;
use App\Models\Post;
use App\Models\Setting;
use App\Models\StaffDirectory;
use App\Models\Taxonomy;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
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

        if (!empty($settings['hero_banner_image'])) {
            $banner = $settings['hero_banner_image'];
            if (!str_starts_with($banner, 'http://') && !str_starts_with($banner, 'https://') && !str_starts_with($banner, '/')) {
                $settings['hero_banner_image'] = \Illuminate\Support\Facades\Storage::disk('public')->url($banner);
            }
        }

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

        $principal = StaffDirectory::active()->kepsek()->first()
            ?? StaffDirectory::kepsek()->first()
            ?? StaffDirectory::active()->where('position', 'like', '%Kepala Sekolah%')->first();

        return Inertia::render('welcome', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'pinnedPost' => $pinnedPost,
            'latestPosts' => $latestPosts,
            'announcements' => $announcements,
            'upcomingAgendas' => $upcomingAgendas,
            'achievements' => $achievements,
            'principal' => $principal,
            'formToken' => Crypt::encryptString((string) microtime(true)),
        ]);
    }

    /**
     * Halaman Direktori & Arsip Warta, Berita & Artikel Sekolah
     */
    public function posts(Request $request): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');

        $query = Post::published()
            ->with(['author:id,name', 'categories'])
            ->latest('published_at');

        // Filter tipe konten (post / announcement / all)
        $type = $request->query('type');
        if ($type && in_array($type, ['post', 'announcement'])) {
            $query->where('type', $type);
        } else {
            $query->whereIn('type', ['post', 'announcement']);
        }

        // Pencarian judul / ringkasan
        if ($request->filled('q')) {
            $keyword = trim($request->query('q'));
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('excerpt', 'like', "%{$keyword}%");
            });
        }

        // Filter kategori
        if ($request->filled('category')) {
            $categorySlug = $request->query('category');
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        $posts = $query->paginate(9)->withQueryString();

        // Kategori yang memiliki postingan aktif
        $categories = Taxonomy::where('type', 'category')
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->get();

        // Berita unggulan (featured) di halaman 1 saat tanpa pencarian/filter
        $featuredPost = null;
        if (!$request->filled('q') && !$request->filled('category') && (int) $request->query('page', 1) === 1) {
            $featuredPost = Post::published()
                ->where('type', 'post')
                ->where('is_pinned', true)
                ->with(['author:id,name', 'categories'])
                ->latest('published_at')
                ->first();

            if (!$featuredPost && $posts->isNotEmpty()) {
                $featuredPost = $posts->first();
            }
        }

        return Inertia::render('news-directory', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'posts' => $posts,
            'categories' => $categories,
            'featuredPost' => $featuredPost,
            'filters' => [
                'q' => $request->query('q', ''),
                'category' => $request->query('category', ''),
                'type' => $request->query('type', ''),
            ],
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

        if ($post->status !== 'published' && !auth()->check()) {
            abort(404);
        }

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

    /**
     * Direktori Sarana & Fasilitas Sekolah
     */
    public function facilities(Request $request): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');

        $query = Facility::active()->orderBy('sort_order', 'asc')->latest('id');

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('q')) {
            $keyword = trim($request->query('q'));
            $query->where(function ($sub) use ($keyword) {
                $sub->where('name', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%")
                    ->orWhere('location', 'like', "%{$keyword}%");
            });
        }

        $facilities = $query->get();
        $categories = Facility::active()->distinct()->whereNotNull('category')->pluck('category');

        return Inertia::render('facility-directory', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'facilities' => $facilities,
            'categories' => $categories,
            'filters' => [
                'category' => $request->query('category', ''),
                'q' => $request->query('q', ''),
            ],
        ]);
    }

    /**
     * Halaman Galeri Foto & Dokumentasi Kegiatan
     */
    public function galleries(Request $request): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');

        $query = Gallery::active()->orderBy('sort_order', 'asc')->latest('event_date')->latest('id');

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('q')) {
            $keyword = trim($request->query('q'));
            $query->where(function ($sub) use ($keyword) {
                $sub->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        $galleries = $query->get();
        $categories = Gallery::active()->distinct()->whereNotNull('category')->pluck('category');

        return Inertia::render('gallery-directory', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'galleries' => $galleries,
            'categories' => $categories,
            'filters' => [
                'category' => $request->query('category', ''),
                'q' => $request->query('q', ''),
            ],
        ]);
    }

    /**
     * Halaman Kontak & Formulir Aspirasi / Buku Tamu
     */
    public function contact(): Response
    {
        $settings = Setting::allGrouped();
        $primaryMenu = Menu::getByLocation('header_primary');

        return Inertia::render('contact', [
            'settings' => $settings,
            'primaryMenu' => $primaryMenu,
            'formToken' => Crypt::encryptString((string) microtime(true)),
        ]);
    }

    /**
     * Simpan Pesan Kontak / Aspirasi dari Publik
     *
     * Pipeline Anti-Spam 5 Lapis:
     * 1. Cek Honeypot (Jika terisi -> Silent Drop)
     * 2. Cek Speed-Trap (< 3 detik -> Silent Drop)
     * 3. Cek ReCAPTCHA v3
     * 4. Cek Blacklist Kata Kunci & Tautan (Judol / Link Flood / Kata Kasar)
     * 5. Cek Duplikasi Pesan (Anti-Flood)
     * -> Simpan ke Database & Notifikasi Admin
     */
    public function storeContactMessage(Request $request): RedirectResponse
    {
        // =========================================================================
        // LAPISAN 1: Cek Honeypot Trap (Jika terisi -> Silent Drop)
        // =========================================================================
        if ($request->filled('website') || $request->filled('honeypot') || !empty($request->input('website')) || !empty($request->input('honeypot'))) {
            Log::info("[Anti-Spam L1: Honeypot] Bot terdeteksi mengisi input perangkap dari IP: {$request->ip()}. Silent drop.");
            return redirect()->back()->with('success', 'Terima kasih, pesan Anda telah berhasil dikirimkan ke pihak sekolah.');
        }

        // =========================================================================
        // LAPISAN 2: Cek Speed-Trap (< 3 detik -> Silent Drop)
        // =========================================================================
        $formToken = $request->input('form_token');
        $isSpeedTrapTriggered = false;

        if (empty($formToken)) {
            // Jika dikirim langsung tanpa token (skrip bot langsung tembak endpoint)
            if (! app()->environment('testing')) {
                $isSpeedTrapTriggered = true;
            }
        } else {
            try {
                $renderedAt = (float) Crypt::decryptString($formToken);
                $elapsed = microtime(true) - $renderedAt;

                // Manusia normal membutuhkan minimal 3 detik untuk membaca dan mengetik
                if ($elapsed < 3.0) {
                    $isSpeedTrapTriggered = true;
                }
            } catch (\Throwable $e) {
                // Token korup atau dimanipulasi
                $isSpeedTrapTriggered = true;
            }
        }

        if ($isSpeedTrapTriggered) {
            Log::info("[Anti-Spam L2: Speed-Trap] Pengiriman terlalu cepat (< 3s) atau token tidak valid dari IP: {$request->ip()}. Silent drop.");
            return redirect()->back()->with('success', 'Terima kasih, pesan Anda telah berhasil dikirimkan ke pihak sekolah.');
        }

        // =========================================================================
        // LAPISAN 3: Cek ReCAPTCHA v3
        // =========================================================================
        $recaptcha = app(\App\Services\RecaptchaService::class);
        if (! $recaptcha->verify($request->input('recaptcha_token'), 'contact_submit', $request->ip())) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['message' => 'Verifikasi keamanan reCAPTCHA tidak valid atau terdeteksi aktivitas mencurigakan. Silakan coba kembali.']);
        }

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:150'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:3000'],
        ]);

        // =========================================================================
        // LAPISAN 4: Cek Blacklist Kata Kunci & Tautan (Judol / Link Flood / Kata Kasar)
        // =========================================================================
        $contentFilter = app(\App\Services\ContentFilterService::class);
        $fullTextToCheck = trim(($validated['name'] ?? '') . ' ' . ($validated['subject'] ?? '') . ' ' . ($validated['message'] ?? ''));
        $inspection = $contentFilter->inspect($fullTextToCheck);

        if (! $inspection['is_clean']) {
            if ($inspection['type'] === 'profanity') {
                return redirect()->back()
                    ->withInput()
                    ->withErrors([
                        'message' => 'Mohon gunakan bahasa yang santun dan membangun. Pesan Anda terdeteksi mengandung kata yang tidak sesuai dengan norma dan etika komunikasi sekolah.',
                    ]);
            }

            // Untuk bot judi online, link flood, atau domain berbahaya: silent drop
            Log::info("[Anti-Spam L4: Content Filter] Spam terdeteksi ({$inspection['type']}) dari IP: {$request->ip()}. Silent drop.");
            return redirect()->back()->with('success', 'Terima kasih, pesan Anda telah berhasil dikirimkan ke pihak sekolah.');
        }

        // =========================================================================
        // LAPISAN 5: Cek Duplikasi Pesan (Anti-Flood)
        // =========================================================================
        $cleanMessage = strip_tags(trim($validated['message']));
        $cleanName = !empty($validated['name']) ? strip_tags(trim($validated['name'])) : 'Anonim';
        $cleanEmail = !empty($validated['email']) ? strtolower(trim($validated['email'])) : 'anonim@smpn5sambas.sch.id';
        $cleanSubject = !empty($validated['subject']) ? strip_tags(trim($validated['subject'])) : 'Saran & Aspirasi Anonim';

        // Cek duplikasi identik dari IP yang sama dalam 1 jam terakhir
        $isDuplicateFromIp = ContactMessage::where('ip_address', $request->ip())
            ->where('message', $cleanMessage)
            ->where('created_at', '>=', now()->subHour())
            ->exists();

        // Cek duplikasi botnet (pesan persis sama lintas IP dalam 15 menit terakhir)
        $isGlobalDuplicate = ContactMessage::where('message', $cleanMessage)
            ->where('created_at', '>=', now()->subMinutes(15))
            ->exists();

        if ($isDuplicateFromIp || $isGlobalDuplicate) {
            Log::info("[Anti-Spam L5: Anti-Flood] Pesan duplikat identik terdeteksi dari IP: {$request->ip()}. Silent drop.");
            return redirect()->back()->with('success', 'Terima kasih, pesan Anda telah berhasil dikirimkan ke pihak sekolah.');
        }

        // =========================================================================
        // SIMPAN KE BASIS DATA & NOTIFIKASI ADMIN
        // =========================================================================
        $contactMessage = ContactMessage::create([
            'name' => $cleanName,
            'email' => $cleanEmail,
            'phone' => !empty($validated['phone']) ? strip_tags(trim($validated['phone'])) : null,
            'subject' => $cleanSubject,
            'message' => $cleanMessage,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
            'is_read' => false,
        ]);

        // Catat ke Log Aktivitas CMS agar termonitor di Dashboard Admin & Activity Logs
        ActivityLogger::log(
            'create',
            'Pesan Masuk',
            "Pesan aspirasi baru diterima dari '{$cleanName}' [{$cleanEmail}]: {$cleanSubject}",
            $contactMessage,
            [
                'name' => $cleanName,
                'email' => $cleanEmail,
                'subject' => $cleanSubject,
                'ip' => $request->ip(),
            ]
        );

        Log::info("[Notifikasi Admin] Pesan masuk baru #{$contactMessage->id} dari {$cleanName} ({$cleanEmail}) berhasil disimpan.");

        return redirect()->back()->with('success', 'Terima kasih, pesan Anda telah berhasil dikirimkan ke pihak sekolah.');
    }
}

