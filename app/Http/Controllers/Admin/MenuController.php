<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Post;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(): Response
    {
        $primaryMenu = Menu::where('location', 'header_primary')
            ->with(['items.targetPost'])
            ->first();

        if (!$primaryMenu) {
            $primaryMenu = Menu::create([
                'name' => 'Menu Utama Header',
                'location' => 'header_primary',
            ]);
        }

        $pages = Post::pages()->published()->select('id', 'title', 'slug')->get();

        return Inertia::render('admin/menus/index', [
            'menu' => $primaryMenu,
            'pages' => $pages,
        ]);
    }

    public function storeItem(Request $request, Menu $menu): RedirectResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:100',
            'link_type' => 'required|in:internal_post,custom_url',
            'target_id' => 'nullable|exists:posts,id',
            'custom_url' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menu_items,id',
            'sort_order' => 'integer',
        ]);

        $validated['menu_id'] = $menu->id;
        $createdItem = MenuItem::create($validated);
        ActivityLogger::log('create', 'Menu Navigasi', "Menambahkan item menu: '{$createdItem->label}' pada {$menu->name}", $createdItem);

        return back()->with('success', 'Item menu berhasil ditambahkan.');
    }

    public function destroyItem(MenuItem $item): RedirectResponse
    {
        $label = $item->label;
        $item->delete();
        ActivityLogger::log('delete', 'Menu Navigasi', "Menghapus item menu: '{$label}'");

        return back()->with('success', 'Item menu berhasil dihapus.');
    }
}

