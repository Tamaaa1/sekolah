<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        $query = User::with('roles')->latest();

        if ($request->filled('q')) {
            $keyword = trim($request->query('q'));
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('role')) {
            $role = $request->query('role');
            $query->whereHas('roles', fn ($q) => $q->where('name', $role));
        }

        $users = $query->paginate(10)->withQueryString();
        $roles = Role::pluck('name');

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'q' => $request->query('q', ''),
                'role' => $request->query('role', ''),
            ],
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'password' => ['required', 'string', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($validated['role']);

        ActivityLogger::log('create', 'Manajemen Pengguna', "Menambahkan akun pengguna baru '{$user->name}' ({$user->email}) dengan peran '{$validated['role']}'", $user);

        return redirect()->back()->with('success', "Akun pengguna '{$user->name}' berhasil dibuat.");
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'string', 'exists:roles,name'],
            'password' => ['nullable', 'string', Password::defaults()],
        ]);

        // Guard: Prevent removing the last Super Admin's role
        if ($user->hasRole('Super Admin') && $validated['role'] !== 'Super Admin') {
            $superAdminCount = User::role('Super Admin')->count();
            if ($superAdminCount <= 1) {
                return redirect()->back()->withErrors([
                    'role' => 'Tidak dapat mengubah peran Super Admin terakhir. Harus ada setidaknya satu Super Admin aktif.',
                ]);
            }
        }

        $user->name = $validated['name'];
        $user->email = strtolower($validated['email']);

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();
        $user->syncRoles([$validated['role']]);

        ActivityLogger::log('update', 'Manajemen Pengguna', "Memperbarui akun pengguna '{$user->name}' ({$user->email})", $user);

        return redirect()->back()->with('success', "Akun pengguna '{$user->name}' berhasil diperbarui.");
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        if (auth()->id() === $user->id) {
            return redirect()->back()->withErrors([
                'user' => 'Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk.',
            ]);
        }

        if ($user->hasRole('Super Admin')) {
            $superAdminCount = User::role('Super Admin')->count();
            if ($superAdminCount <= 1) {
                return redirect()->back()->withErrors([
                    'user' => 'Tidak dapat menghapus Super Admin terakhir pada sistem.',
                ]);
            }
        }

        $userName = $user->name;
        $userEmail = $user->email;
        $user->delete();

        ActivityLogger::log('delete', 'Manajemen Pengguna', "Menghapus akun pengguna '{$userName}' ({$userEmail})");

        return redirect()->back()->with('success', "Akun pengguna '{$userName}' berhasil dihapus.");
    }
}
