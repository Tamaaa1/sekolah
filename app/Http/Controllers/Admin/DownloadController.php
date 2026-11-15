<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Download;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DownloadController extends Controller
{
    /**
     * Display a listing of the downloadable files.
     */
    public function index(Request $request): Response
    {
        $query = Download::query();

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

        $downloads = $query->orderBy('sort_order', 'asc')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        $categories = Download::distinct()->whereNotNull('category')->pluck('category');

        return Inertia::render('admin/downloads/index', [
            'downloads' => $downloads,
            'categories' => $categories,
            'filters' => [
                'q' => $request->query('q', ''),
                'category' => $request->query('category', ''),
            ],
        ]);
    }

    /**
     * Store a newly created downloadable document in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:downloads,slug'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'file_path' => ['required', 'string', 'max:1000'],
            'file_type' => ['nullable', 'string', 'max:20'],
            'file_size' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;
            while (Download::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        if (empty($validated['file_type'])) {
            $ext = pathinfo($validated['file_path'], PATHINFO_EXTENSION);
            $validated['file_type'] = $ext ? strtoupper($ext) : 'PDF';
        }

        $download = Download::create($validated);

        ActivityLogger::log('create', 'Pusat Unduhan', "Menambahkan berkas unduhan baru: '{$download->title}'", $download);

        return redirect()->back()->with('success', "Dokumen '{$download->title}' berhasil ditambahkan ke pusat unduhan.");
    }

    /**
     * Update the specified downloadable document in storage.
     */
    public function update(Request $request, Download $download): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('downloads')->ignore($download->id)],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'file_path' => ['required', 'string', 'max:1000'],
            'file_type' => ['nullable', 'string', 'max:20'],
            'file_size' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (empty($validated['file_type'])) {
            $ext = pathinfo($validated['file_path'], PATHINFO_EXTENSION);
            $validated['file_type'] = $ext ? strtoupper($ext) : 'PDF';
        }

        $download->update($validated);

        ActivityLogger::log('update', 'Pusat Unduhan', "Memperbarui berkas unduhan: '{$download->title}'", $download);

        return redirect()->back()->with('success', "Dokumen '{$download->title}' berhasil diperbarui.");
    }

    /**
     * Remove the specified downloadable document from storage.
     */
    public function destroy(Download $download): RedirectResponse
    {
        $title = $download->title;
        $download->delete();

        ActivityLogger::log('delete', 'Pusat Unduhan', "Menghapus berkas unduhan: '{$title}'");

        return redirect()->back()->with('success', "Dokumen '{$title}' berhasil dihapus dari pusat unduhan.");
    }
}
