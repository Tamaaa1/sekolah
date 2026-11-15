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
