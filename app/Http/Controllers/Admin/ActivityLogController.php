<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ActivityLog::with('user')->latest('id');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%")
                    ->orWhere('user_email', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        if ($request->filled('module') && $request->input('module') !== 'all') {
            $query->where('module', $request->input('module'));
        }

        if ($request->filled('action') && $request->input('action') !== 'all') {
            $query->where('action', strtolower($request->input('action')));
        }

        $availableModules = [
            'Berita & Artikel',
            'Halaman Statis',
            'Pengumuman',
            'Guru & Staf TU',
            'Ekstrakurikuler',
            'Prestasi Siswa',
            'Agenda Akademik',
            'Pustaka Media',
            'Menu Navigasi',
            'Pengaturan Sekolah',
            'Otentikasi',
        ];

        return Inertia::render('admin/activity-logs/index', [
            'logs' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'module', 'action']),
            'availableModules' => $availableModules,
            'stats' => [
                'total' => ActivityLog::count(),
                'today' => ActivityLog::whereDate('created_at', today())->count(),
                'creates' => ActivityLog::where('action', 'create')->count(),
                'updates' => ActivityLog::where('action', 'update')->count(),
                'deletes' => ActivityLog::where('action', 'delete')->count(),
            ],
        ]);
    }

    public function clear(Request $request): RedirectResponse
    {
        $period = $request->input('period', 'older_than_30_days');

        if ($period === 'all') {
            ActivityLog::truncate();
            ActivityLogger::log('delete', 'Sistem', 'Membersihkan seluruh catatan log aktivitas');
            return redirect()->back()->with('success', 'Seluruh catatan log aktivitas berhasil dibersihkan.');
        }

        $count = ActivityLog::where('created_at', '<', now()->subDays(30))->delete();
        ActivityLogger::log('delete', 'Sistem', "Membersihkan {$count} catatan log aktivitas yang berusia lebih dari 30 hari");

        return redirect()->back()->with('success', "{$count} catatan log aktivitas yang berusia lebih dari 30 hari berhasil dibersihkan.");
    }
}
