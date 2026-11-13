<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\ActivityLogger;
use App\Services\SafeFileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(
        protected SafeFileUploadService $uploadService
    ) {}

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
            'file' => ['required', 'file'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'allowed_type' => ['nullable', 'string', 'in:all,images,documents'],
        ]);

        $allowedType = $request->input('allowed_type', SafeFileUploadService::TYPE_ALL);

        $uploaded = $this->uploadService->validateAndStore(
            $request->file('file'),
            $allowedType,
            'uploads',
            $request->input('alt_text')
        );

        $media = Media::create([
            'name' => $uploaded['name'],
            'file_name' => $uploaded['file_name'],
            'file_path' => $uploaded['file_path'],
            'mime_type' => $uploaded['mime_type'],
            'size' => $uploaded['size'],
            'alt_text' => $uploaded['alt_text'],
        ]);

        $label = $uploaded['category'] === 'image' ? 'gambar' : 'dokumen PDF';
        ActivityLogger::log('upload', 'Pustaka Media', "Mengunggah {$label} aman: '{$uploaded['name']}' ({$uploaded['file_name']})", $media);

        if (! $request->header('X-Inertia') && ($request->expectsJson() || $request->wantsJson() || $request->has('json') || $request->ajax() || $request->header('X-Requested-With') === 'XMLHttpRequest')) {
            return response()->json([
                'success' => true,
                'media' => $media,
            ], 201);
        }

        return redirect()->back()->with('success', 'Berkas berhasil diunggah dengan aman.');
    }

    public function destroy(Media $medium): JsonResponse|RedirectResponse
    {
        if (Storage::disk('public')->exists($medium->file_path)) {
            Storage::disk('public')->delete($medium->file_path);
        }

        $name = $medium->name;
        $medium->delete();
        ActivityLogger::log('delete', 'Pustaka Media', "Menghapus berkas media: '{$name}'");

        if (! request()->header('X-Inertia') && (request()->expectsJson() || request()->wantsJson() || request()->has('json') || request()->ajax() || request()->header('X-Requested-With') === 'XMLHttpRequest')) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Berkas berhasil dihapus.');
    }
}

