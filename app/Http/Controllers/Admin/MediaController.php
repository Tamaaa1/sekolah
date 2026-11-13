<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(Request $request): Response|JsonResponse
    {
        $query = Media::latest();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('file_name', 'like', '%' . $request->search . '%');
        }

        if (! $request->header('X-Inertia') && ($request->expectsJson() || $request->wantsJson() || $request->has('json') || $request->ajax() || $request->header('X-Requested-With') === 'XMLHttpRequest')) {
            return response()->json($query->paginate(24));
        }

        return Inertia::render('admin/media/index', [
            'media' => $query->paginate(24),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpeg,png,jpg,webp,pdf,svg', 'max:5120'],
            'alt_text' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('file');
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $safeFileName = Str::slug($originalName) . '-' . time() . '.' . $extension;

        $path = $file->storeAs('uploads', $safeFileName, 'public');

        $media = Media::create([
            'name' => $originalName,
            'file_name' => $safeFileName,
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'alt_text' => $request->input('alt_text', $originalName),
        ]);

        if (! $request->header('X-Inertia') && ($request->expectsJson() || $request->wantsJson() || $request->has('json') || $request->ajax() || $request->header('X-Requested-With') === 'XMLHttpRequest')) {
            return response()->json([
                'success' => true,
                'media' => $media,
            ], 201);
        }

        return redirect()->back()->with('success', 'Berkas berhasil diunggah.');
    }

    public function destroy(Media $medium): JsonResponse|RedirectResponse
    {
        if (Storage::disk('public')->exists($medium->file_path)) {
            Storage::disk('public')->delete($medium->file_path);
        }

        $medium->delete();

        if (! request()->header('X-Inertia') && (request()->expectsJson() || request()->wantsJson() || request()->has('json') || request()->ajax() || request()->header('X-Requested-With') === 'XMLHttpRequest')) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Berkas berhasil dihapus.');
    }
}

