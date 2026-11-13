<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Achievement::query();

        if ($request->filled('level') && in_array($request->level, ['kabupaten', 'provinsi', 'nasional', 'internasional'])) {
            $query->where('level', $request->level);
        }

        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('student_name', 'like', "%{$search}%")
                    ->orWhere('competition_name', 'like', "%{$search}%");
            });
        }

        $achievements = $query->orderByDesc('year')->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/achievements/index', [
            'achievements' => $achievements,
            'filters' => $request->only(['search', 'level', 'year']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'student_name' => ['required', 'string', 'max:150'],
            'competition_name' => ['required', 'string', 'max:255'],
            'level' => ['required', 'in:kabupaten,provinsi,nasional,internasional'],
            'rank' => ['required', 'string', 'max:50'],
            'year' => ['required', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'image' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
        ]);

        $item = Achievement::create($validated);
        ActivityLogger::log('create', 'Prestasi Siswa', "Mencatat prestasi baru: '{$item->title}' oleh {$item->student_name} ({$item->rank})", $item);

        return redirect()->back()->with('success', 'Catatan prestasi siswa berhasil disimpan.');
    }

    public function update(Request $request, Achievement $achievement): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'student_name' => ['required', 'string', 'max:150'],
            'competition_name' => ['required', 'string', 'max:255'],
            'level' => ['required', 'in:kabupaten,provinsi,nasional,internasional'],
            'rank' => ['required', 'string', 'max:50'],
            'year' => ['required', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'image' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
        ]);

        $achievement->update($validated);
        ActivityLogger::log('update', 'Prestasi Siswa', "Memperbarui catatan prestasi: '{$achievement->title}'", $achievement);

        return redirect()->back()->with('success', 'Catatan prestasi siswa berhasil diperbarui.');
    }

    public function destroy(Achievement $achievement): RedirectResponse
    {
        $title = $achievement->title;
        $achievement->delete();
        ActivityLogger::log('delete', 'Prestasi Siswa', "Menghapus catatan prestasi: '{$title}'");

        return redirect()->back()->with('success', 'Catatan prestasi siswa berhasil dihapus.');
    }
}

