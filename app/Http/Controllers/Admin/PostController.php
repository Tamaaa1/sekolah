<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Taxonomy;
use App\Services\ActivityLogger;
use App\Services\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->query('type', 'post');
        $status = $request->query('status');

        $query = Post::query()
            ->when($type, fn ($q) => $q->where('type', $type))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->with(['author', 'categories'])
            ->latest('created_at');

        $posts = $query->paginate(15)->withQueryString();
        $counts = [
            'all' => Post::where('type', $type)->count(),
            'published' => Post::where('type', $type)->where('status', 'published')->count(),
            'pending_review' => Post::where('type', $type)->where('status', 'pending_review')->count(),
            'draft' => Post::where('type', $type)->where('status', 'draft')->count(),
        ];

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'currentType' => $type,
            'currentStatus' => $status,
            'counts' => $counts,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('create posts'), 403, 'Anda tidak memiliki hak akses untuk membuat konten.');

        $type = $request->query('type', 'post');
        $categories = Taxonomy::where('type', 'category')->get();
        $tags = Taxonomy::where('type', 'tag')->get();

        return Inertia::render('admin/posts/form', [
            'post' => null,
            'type' => $type,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->can('create posts'), 403, 'Anda tidak memiliki hak akses untuk membuat konten.');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug',
            'excerpt' => 'nullable|string',
            'content' => 'nullable',
            'type' => 'required|in:post,page,announcement',
            'status' => 'required|in:draft,pending_review,scheduled,published',
            'featured_image' => 'nullable|string|max:500',
            'file_attachment' => 'nullable|string|max:500',
            'is_pinned' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'published_at' => 'nullable|date',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:taxonomies,id',
        ]);

        $user = $request->user();

        // Liputan Khusus (pinned) hanya berlaku untuk berita & artikel (type = post), bukan pengumuman atau halaman statis
        if (($validated['type'] ?? '') !== 'post') {
            $validated['is_pinned'] = false;
        }

        // RBAC Rule: Contributor cannot publish directly; status defaults to pending_review
        if ($user && $user->hasRole('Contributor') && $validated['status'] === 'published') {
            $validated['status'] = 'pending_review';
        }

        $validated['author_id'] = $user ? $user->id : 1;
        $validated['slug'] = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);

        // Check if slug duplicate
        $originalSlug = $validated['slug'];
        $count = 1;
        while (Post::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        // Sanitize rich text HTML content against Stored XSS
        if (isset($validated['content'])) {
            $validated['content'] = HtmlSanitizer::clean($validated['content']);
        }

        // Format content to array if string
        if (is_string($validated['content'] ?? null)) {
            $validated['content'] = [
                ['type' => 'paragraph', 'content' => $validated['content']],
            ];
        }

        $post = Post::create($validated);

        if (!empty($validated['category_ids'])) {
            $post->taxonomies()->sync($validated['category_ids']);
        }

        $module = match ($post->type) {
            'announcement' => 'Pengumuman',
            'page' => 'Halaman Statis',
            default => 'Berita & Artikel',
        };
        ActivityLogger::log('create', $module, "Menambahkan {$module} baru: '{$post->title}'", $post);

        return redirect()->route('admin.posts.index', ['type' => $post->type])
            ->with('success', 'Konten berhasil disimpan.');
    }

    public function edit(Post $post): Response
    {
        $user = request()->user();
        abort_unless($user?->can('edit posts'), 403, 'Anda tidak memiliki hak akses untuk menyunting konten.');

        // IDOR Protection: Contributor can only edit their own posts
        if ($user && $user->hasRole('Contributor') && $post->author_id !== $user->id) {
            abort(403, 'Kontributor hanya berhak menyunting konten yang dibuat sendiri.');
        }

        $post->load(['categories', 'tags']);
        $categories = Taxonomy::where('type', 'category')->get();
        $tags = Taxonomy::where('type', 'tag')->get();

        return Inertia::render('admin/posts/form', [
            'post' => $post,
            'type' => $post->type,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user?->can('edit posts'), 403, 'Anda tidak memiliki hak akses untuk menyunting konten.');

        // IDOR Protection: Contributor can only edit their own posts
        if ($user && $user->hasRole('Contributor') && $post->author_id !== $user->id) {
            abort(403, 'Kontributor hanya berhak menyunting konten yang dibuat sendiri.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:posts,slug,' . $post->id,
            'excerpt' => 'nullable|string',
            'content' => 'nullable',
            'type' => 'required|in:post,page,announcement',
            'status' => 'required|in:draft,pending_review,scheduled,published',
            'featured_image' => 'nullable|string|max:500',
            'file_attachment' => 'nullable|string|max:500',
            'is_pinned' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'published_at' => 'nullable|date',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:taxonomies,id',
        ]);

        // Liputan Khusus (pinned) hanya berlaku untuk berita & artikel (type = post), bukan pengumuman atau halaman statis
        if (($validated['type'] ?? $post->type) !== 'post') {
            $validated['is_pinned'] = false;
        }

        // RBAC Rule: Contributor cannot publish directly
        if ($user && $user->hasRole('Contributor') && $validated['status'] === 'published') {
            $validated['status'] = 'pending_review';
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = $post->published_at ?? now();
        }

        // Sanitize rich text HTML content against Stored XSS
        if (isset($validated['content'])) {
            $validated['content'] = HtmlSanitizer::clean($validated['content']);
        }

        if (is_string($validated['content'] ?? null)) {
            $validated['content'] = [
                ['type' => 'paragraph', 'content' => $validated['content']],
            ];
        }

        $post->update($validated);

        if (isset($validated['category_ids'])) {
            $post->taxonomies()->sync($validated['category_ids']);
        }

        $module = match ($post->type) {
            'announcement' => 'Pengumuman',
            'page' => 'Halaman Statis',
            default => 'Berita & Artikel',
        };
        ActivityLogger::log('update', $module, "Memperbarui {$module}: '{$post->title}'", $post);

        return redirect()->route('admin.posts.index', ['type' => $post->type])
            ->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        abort_unless(request()->user()?->can('delete posts'), 403, 'Anda tidak memiliki hak akses untuk menghapus konten.');

        $type = $post->type;
        $title = $post->title;
        $module = match ($type) {
            'announcement' => 'Pengumuman',
            'page' => 'Halaman Statis',
            default => 'Berita & Artikel',
        };

        $post->delete();

        ActivityLogger::log('delete', $module, "Menghapus {$module}: '{$title}'");

        return redirect()->route('admin.posts.index', ['type' => $type])
            ->with('success', 'Konten berhasil dihapus.');
    }
}

