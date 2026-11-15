<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    /**
     * Display a listing of the school facilities.
     */
    public function index(Request $request): Response
    {
        $query = Facility::query();

        if ($request->filled('q')) {
            $keyword = trim($request->query('q'));
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhere('location', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        $facilities = $query->orderBy('sort_order', 'asc')
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        $categories = Facility::distinct()->whereNotNull('category')->pluck('category');

        return Inertia::render('admin/facilities/index', [
            'facilities' => $facilities,
            'categories' => $categories,
            'filters' => [
                'q' => $request->query('q', ''),
                'category' => $request->query('category', ''),
            ],
        ]);
    }

    /**
     * Store a newly created facility in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:facilities,slug'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:1000'],
            'capacity' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'features' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Facility::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        $facility = Facility::create($validated);

        ActivityLogger::log('create', 'Sarana & Prasarana', "Menambahkan fasilitas baru: '{$facility->name}'", $facility);

        return redirect()->back()->with('success', "Fasilitas '{$facility->name}' berhasil ditambahkan.");
    }

    /**
     * Update the specified facility in storage.
     */
    public function update(Request $request, Facility $facility): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('facilities')->ignore($facility->id)],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:1000'],
            'capacity' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'features' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $facility->update($validated);

        ActivityLogger::log('update', 'Sarana & Prasarana', "Memperbarui data fasilitas: '{$facility->name}'", $facility);

        return redirect()->back()->with('success', "Fasilitas '{$facility->name}' berhasil diperbarui.");
    }

    /**
     * Remove the specified facility from storage.
     */
    public function destroy(Facility $facility): RedirectResponse
    {
        $name = $facility->name;
        $facility->delete();

        ActivityLogger::log('delete', 'Sarana & Prasarana', "Menghapus data fasilitas: '{$name}'");

        return redirect()->back()->with('success', "Fasilitas '{$name}' berhasil dihapus.");
    }
}
