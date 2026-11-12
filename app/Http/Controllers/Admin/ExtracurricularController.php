<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Extracurricular;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ExtracurricularController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Extracurricular::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('leader_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $items = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/extracurriculars/index', [
            'extracurriculars' => $items,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:100', 'unique:extracurriculars,slug'],
            'leader_name' => ['nullable', 'string', 'max:100'],
            'schedule_day' => ['nullable', 'string', 'max:50'],
            'schedule_time' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Extracurricular::create($validated);

        return redirect()->back()->with('success', 'Data kegiatan ekstrakurikuler berhasil ditambahkan.');
    }

    public function update(Request $request, Extracurricular $extracurricular): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:100', 'unique:extracurriculars,slug,' . $extracurricular->id],
            'leader_name' => ['nullable', 'string', 'max:100'],
            'schedule_day' => ['nullable', 'string', 'max:50'],
            'schedule_time' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $extracurricular->update($validated);

        return redirect()->back()->with('success', 'Data kegiatan ekstrakurikuler berhasil diperbarui.');
    }

    public function destroy(Extracurricular $extracurricular): RedirectResponse
    {
        $extracurricular->delete();

        return redirect()->back()->with('success', 'Data kegiatan ekstrakurikuler berhasil dihapus.');
    }
}
