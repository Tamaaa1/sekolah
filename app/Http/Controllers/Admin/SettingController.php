<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ActivityLogger;
use App\Services\SafeFileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(
        protected SafeFileUploadService $uploadService
    ) {}

    public function index(): Response
    {
        $settings = Setting::allGrouped();

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'school_name' => 'required|string|max:150',
            'npsn' => 'required|string|max:50',
            'accreditation' => 'required|string|max:50',
            'school_tagline' => 'nullable|string|max:255',
            'principal_name' => 'required|string|max:150',
            'principal_speech' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string|max:255',
            'ppdb_is_open' => 'boolean',
            'ppdb_year' => 'nullable|string|max:50',
            'ppdb_portal_url' => 'nullable|string|max:255',
            'ppdb_brochure_url' => 'nullable|string|max:500',
            'hero_banner_caption' => 'nullable|string|max:255',
            'remove_hero_banner' => 'nullable|boolean',
            'remove_ppdb_brochure' => 'nullable|boolean',
        ]);

        if ($request->hasFile('hero_banner_image')) {
            $request->validate([
                'hero_banner_image' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            ]);
        }

        if ($request->hasFile('ppdb_brochure_file')) {
            $request->validate([
                'ppdb_brochure_file' => ['file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:5120'],
            ]);
        }

        // Handle Hero Banner Image Upload or Removal
        if ($request->boolean('remove_hero_banner')) {
            $oldBanner = Setting::get('hero_banner_image');
            if ($oldBanner) {
                $this->deleteOldFile($oldBanner);
            }
            Setting::set('hero_banner_image', null, 'hero');
        } elseif ($request->hasFile('hero_banner_image')) {
            $oldBanner = Setting::get('hero_banner_image');
            if ($oldBanner) {
                $this->deleteOldFile($oldBanner);
            }

            $uploaded = $this->uploadService->validateAndStore(
                $request->file('hero_banner_image'),
                SafeFileUploadService::TYPE_IMAGES,
                'uploads/banners'
            );

            $bannerUrl = Storage::disk('public')->url($uploaded['file_path']);
            Setting::set('hero_banner_image', $bannerUrl, 'hero');
        }

        // Handle PPDB Brochure File (PDF or Image) Upload or Removal
        if ($request->boolean('remove_ppdb_brochure')) {
            $oldBrochure = Setting::get('ppdb_brochure_url');
            if ($oldBrochure) {
                $this->deleteOldFile($oldBrochure);
            }
            Setting::set('ppdb_brochure_url', null, 'ppdb');
        } elseif ($request->hasFile('ppdb_brochure_file')) {
            $oldBrochure = Setting::get('ppdb_brochure_url');
            if ($oldBrochure) {
                $this->deleteOldFile($oldBrochure);
            }

            $uploaded = $this->uploadService->validateAndStore(
                $request->file('ppdb_brochure_file'),
                SafeFileUploadService::TYPE_ALL,
                'uploads/brochures',
                'Brosur PPDB ' . Setting::get('school_name', 'SMP Negeri 5 Sambas')
            );

            $brochureUrl = Storage::disk('public')->url($uploaded['file_path']);
            Setting::set('ppdb_brochure_url', $brochureUrl, 'ppdb');
        }

        if ($request->has('hero_banner_caption')) {
            Setting::set('hero_banner_caption', $request->input('hero_banner_caption'), 'hero');
        }

        // Standard School Settings
        $fields = [
            'school_name' => 'general',
            'npsn' => 'general',
            'accreditation' => 'general',
            'school_tagline' => 'general',
            'principal_name' => 'general',
            'principal_speech' => 'general',
            'phone' => 'contact',
            'whatsapp' => 'contact',
            'email' => 'contact',
            'address' => 'contact',
            'ppdb_is_open' => 'ppdb',
            'ppdb_year' => 'ppdb',
            'ppdb_portal_url' => 'ppdb',
            'ppdb_brochure_url' => 'ppdb',
        ];

        foreach ($fields as $key => $group) {
            if ($key === 'ppdb_is_open') {
                Setting::set($key, $request->boolean('ppdb_is_open'), $group);
            } elseif ($key === 'ppdb_brochure_url') {
                if (! $request->hasFile('ppdb_brochure_file') && ! $request->boolean('remove_ppdb_brochure') && $request->has('ppdb_brochure_url')) {
                    Setting::set($key, $request->input($key), $group);
                }
            } elseif ($request->has($key)) {
                Setting::set($key, $request->input($key), $group);
            }
        }

        ActivityLogger::log('update', 'Pengaturan Sekolah', 'Memperbarui pengaturan identitas sekolah, banner, dan PPDB');

        return back()->with('success', 'Pengaturan sekolah berhasil diperbarui.');
    }

    /**
     * Delete existing uploaded file from storage safely.
     */
    protected function deleteOldFile(?string $fileUrl): void
    {
        if (! $fileUrl) {
            return;
        }

        $parsedPath = parse_url($fileUrl, PHP_URL_PATH) ?: $fileUrl;
        $relativePath = preg_replace('#^/storage/#', '', $parsedPath);

        if ($relativePath && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }

    /**
     * Alias for backward compatibility.
     */
    protected function deleteOldBanner(?string $bannerUrl): void
    {
        $this->deleteOldFile($bannerUrl);
    }
}
