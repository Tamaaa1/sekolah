<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Taxonomy;
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug',
            'excerpt' => 'nullable|string',
            'content' => 'nullable',
            'type' => 'required|in:post,page,announcement',
            'status' => 'required|in:draft,pending_review,scheduled,published',
            'is_pinned' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'published_at' => 'nullable|date',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:taxonomies,id',
        ]);

        $user = $request->user();

        // RBAC Rule: Contributor cannot publish directly; status defaults to pending_review
        if ($user && $user->hasRole('Contributor') && $validated['status'] === 'published') {
            $validated['status'] = 'pending_review';
        }

        $validated['author_id'] = $user ? $user->id : 1;
        $validated['slug'] = $validated['slug'] ? Str::slug($validated['slug']) : Str::slug($validated['title']);

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

        return redirect()->route('admin.posts.index', ['type' => $post->type])
            ->with('success', 'Konten berhasil disimpan.');
    }

    public function edit(Post $post): Response
    {
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:posts,slug,' . $post->id,
            'excerpt' => 'nullable|string',
            'content' => 'nullable',
            'type' => 'required|in:post,page,announcement',
            'status' => 'required|in:draft,pending_review,scheduled,published',
            'is_pinned' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'published_at' => 'nullable|date',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:taxonomies,id',
        ]);

        $user = $request->user();

        // RBAC Rule: Contributor cannot publish directly
        if ($user && $user->hasRole('Contributor') && $validated['status'] === 'published') {
            $validated['status'] = 'pending_review';
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = $post->published_at ?? now();
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

        return redirect()->route('admin.posts.index', ['type' => $post->type])
            ->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $type = $post->type;
        $post->delete();

        return redirect()->route('admin.posts.index', ['type' => $type])
            ->with('success', 'Konten berhasil dihapus.');
    }
}

