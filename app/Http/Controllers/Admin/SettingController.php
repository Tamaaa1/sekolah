<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::allGrouped();

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
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
            'ppdb_brochure_url' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            $group = str_starts_with($key, 'ppdb_')
                ? 'ppdb'
                : (in_array($key, ['phone', 'whatsapp', 'email', 'address']) ? 'contact' : 'general');

            Setting::set($key, $value, $group);
        }

        ActivityLogger::log('update', 'Pengaturan Sekolah', 'Memperbarui pengaturan identitas dan informasi sekolah');

        return back()->with('success', 'Pengaturan sekolah berhasil diperbarui.');
    }
}

