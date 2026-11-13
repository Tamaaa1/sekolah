<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicAgenda;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicAgendaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AcademicAgenda::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $agendas = $query->orderByDesc('start_date')->paginate(15)->withQueryString();

        return Inertia::render('admin/agendas/index', [
            'agendas' => $agendas,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $item = AcademicAgenda::create($validated);
        ActivityLogger::log('create', 'Agenda Akademik', "Menambahkan agenda: '{$item->title}' ({$item->start_date})", $item);

        return redirect()->back()->with('success', 'Jadwal agenda akademik berhasil ditambahkan.');
    }

    public function update(Request $request, AcademicAgenda $agenda): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $agenda->update($validated);
        ActivityLogger::log('update', 'Agenda Akademik', "Memperbarui agenda: '{$agenda->title}'", $agenda);

        return redirect()->back()->with('success', 'Jadwal agenda akademik berhasil diperbarui.');
    }

    public function destroy(AcademicAgenda $agenda): RedirectResponse
    {
        $title = $agenda->title;
        $agenda->delete();
        ActivityLogger::log('delete', 'Agenda Akademik', "Menghapus agenda: '{$title}'");

        return redirect()->back()->with('success', 'Jadwal agenda akademik berhasil dihapus.');
    }
}

