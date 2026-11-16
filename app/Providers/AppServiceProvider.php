<?php

namespace App\Providers;

use App\Services\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Fortify;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        if (! app()->runningInConsole()) {
            $host = request()->header('host', '');
            $isTunnel = str_contains($host, 'ngrok') || str_contains($host, 'trycloudflare') || str_contains($host, 'loca.lt');
            $isSecure = request()->header('x-forwarded-proto') === 'https' || request()->isSecure();

            if ($isSecure || $isTunnel) {
                \Illuminate\Support\Facades\URL::forceScheme('https');
            }

            if ($isTunnel && file_exists(public_path('hot'))) {
                // Saat diakses via tunnel (ngrok / remote device), arahkan Vite ke bundle build produksi
                // agar perangkat luar tidak mencoba mengakses localhost:5173 yang memicu mixed content & network error
                app(\Illuminate\Foundation\Vite::class)->useHotFile(storage_path('framework/tunnel_disabled_hot'));
            }
        }

        Event::listen(Login::class, function (Login $event) {
            ActivityLogger::log('login', 'Otentikasi', "Pengguna '{$event->user->name}' berhasil masuk ke sistem", $event->user);
        });

        Event::listen(Logout::class, function (Logout $event) {
            if ($event->user) {
                ActivityLogger::log('logout', 'Otentikasi', "Pengguna '{$event->user->name}' keluar dari sistem", $event->user);
            }
        });

        Event::listen(Failed::class, function (Failed $event) {
            $usernameKey = class_exists(Fortify::class) ? Fortify::username() : 'email';
            $email = $event->credentials[$usernameKey] ?? $event->credentials['email'] ?? request()->input('email', 'tidak diketahui');
            $ip = request()->ip() ?? '127.0.0.1';

            ActivityLogger::log(
                'failed_login',
                'Otentikasi',
                "Percobaan login gagal untuk akun '{$email}' dari alamat IP {$ip}",
                null,
                [
                    'email' => $email,
                    'ip' => $ip,
                    'user_agent' => request()->userAgent(),
                ]
            );
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
