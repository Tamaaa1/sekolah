<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StaffDirectory;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffDirectoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = StaffDirectory::query();

        if ($request->filled('category') && in_array($request->category, ['kepsek', 'guru', 'tendik'])) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $staff = $query->orderBy('sort_order')->orderBy('name')->paginate(20)->withQueryString();

        return Inertia::render('admin/staff/index', [
            'staff' => $staff,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'nip' => ['nullable', 'string', 'max:50'],
            'position' => ['required', 'string', 'max:100'],
            'subject' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'in:kepsek,guru,tendik'],
            'photo' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $item = StaffDirectory::create($validated);
        ActivityLogger::log('create', 'Guru & Staf TU', "Menambahkan data tenaga pendidik/staf: '{$item->name}' ({$item->position})", $item);

        return redirect()->back()->with('success', 'Data tenaga pendidik/kependidikan berhasil ditambahkan.');
    }

    public function update(Request $request, StaffDirectory $staff): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'nip' => ['nullable', 'string', 'max:50'],
            'position' => ['required', 'string', 'max:100'],
            'subject' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'in:kepsek,guru,tendik'],
            'photo' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $staff->update($validated);
        ActivityLogger::log('update', 'Guru & Staf TU', "Memperbarui data tenaga pendidik/staf: '{$staff->name}'", $staff);

        return redirect()->back()->with('success', 'Data tenaga pendidik/kependidikan berhasil diperbarui.');
    }

    public function destroy(StaffDirectory $staff): RedirectResponse
    {
        $name = $staff->name;
        $staff->delete();
        ActivityLogger::log('delete', 'Guru & Staf TU', "Menghapus data tenaga pendidik/staf: '{$name}'");

        return redirect()->back()->with('success', 'Data tenaga pendidik/kependidikan berhasil dihapus.');
    }
}

