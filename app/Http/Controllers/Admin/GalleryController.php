<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    /**
     * Display a listing of the galleries.
     */
    public function index(Request $request): Response
    {
        $query = Gallery::query();

        if ($request->filled('q')) {
            $keyword = trim($request->query('q'));
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        $galleries = $query->orderBy('sort_order', 'asc')
            ->latest('event_date')
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        $categories = Gallery::distinct()->whereNotNull('category')->pluck('category');

        return Inertia::render('admin/galleries/index', [
            'galleries' => $galleries,
            'categories' => $categories,
            'filters' => [
                'q' => $request->query('q', ''),
                'category' => $request->query('category', ''),
            ],
        ]);
    }

    /**
     * Store a newly created gallery in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:galleries,slug'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:1000'],
            'event_date' => ['nullable', 'date'],
            'images' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;
            while (Gallery::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        if (empty($validated['cover_image']) && !empty($validated['images']) && count($validated['images']) > 0) {
            $first = $validated['images'][0];
            $validated['cover_image'] = is_array($first) ? ($first['url'] ?? null) : $first;
        }

        $gallery = Gallery::create($validated);

        ActivityLogger::log('create', 'Galeri Kegiatan', "Menambahkan album galeri: '{$gallery->title}'", $gallery);

        return redirect()->back()->with('success', "Album galeri '{$gallery->title}' berhasil dibuat.");
    }

    /**
     * Update the specified gallery in storage.
     */
    public function update(Request $request, Gallery $gallery): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('galleries')->ignore($gallery->id)],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:1000'],
            'event_date' => ['nullable', 'date'],
            'images' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (empty($validated['cover_image']) && !empty($validated['images']) && count($validated['images']) > 0) {
            $first = $validated['images'][0];
            $validated['cover_image'] = is_array($first) ? ($first['url'] ?? null) : $first;
        }

        $gallery->update($validated);

        ActivityLogger::log('update', 'Galeri Kegiatan', "Memperbarui album galeri: '{$gallery->title}'", $gallery);

        return redirect()->back()->with('success', "Album galeri '{$gallery->title}' berhasil diperbarui.");
    }

    /**
     * Remove the specified gallery from storage.
     */
    public function destroy(Gallery $gallery): RedirectResponse
    {
        $title = $gallery->title;
        $gallery->delete();

        ActivityLogger::log('delete', 'Galeri Kegiatan', "Menghapus album galeri: '{$title}'");

        return redirect()->back()->with('success', "Album galeri '{$title}' berhasil dihapus.");
    }
}
