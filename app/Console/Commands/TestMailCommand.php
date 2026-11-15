<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Throwable;

class TestMailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test 
                            {email? : Alamat email penerima pengujian}
                            {--mailer= : Mailer yang ingin diuji (opsional, default: default mailer)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menguji konektivitas Mail Gateway (SMTP) dan mengirim email uji coba';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $mailer = $this->option('mailer') ?: config('mail.default', 'smtp');
        $email = $this->argument('email') ?: $this->ask('Masukkan alamat email penerima pengujian', 'admin@sekolah.sch.id');

        $this->info('=================================================');
        $this->info('        UJI KONEKSI MAIL GATEWAY (SMTP)          ');
        $this->info('=================================================');
        $this->line("Mailer yang digunakan : <comment>{$mailer}</comment>");

        if ($mailer === 'smtp') {
            $this->line('SMTP Host             : <comment>' . config('mail.mailers.smtp.host') . '</comment>');
            $this->line('SMTP Port             : <comment>' . config('mail.mailers.smtp.port') . '</comment>');
            $this->line('SMTP Scheme/Encr      : <comment>' . (config('mail.mailers.smtp.scheme') ?: config('mail.mailers.smtp.encryption') ?: 'auto/none') . '</comment>');
            $this->line('SMTP Username         : <comment>' . (config('mail.mailers.smtp.username') ?: '(kosong/none)') . '</comment>');
        }

        $this->line('Alamat Pengirim (From): <comment>' . config('mail.from.address') . ' (' . config('mail.from.name') . ')</comment>');
        $this->line("Penerima Uji Coba     : <comment>{$email}</comment>");
        $this->newLine();

        $this->info('Sedang mengirimkan email pengujian...');

        try {
            $schoolName = config('app.name', 'SMP Negeri 5 Sambas');
            $timestamp = now()->translatedFormat('l, d F Y H:i:s T');

            Mail::mailer($mailer)->raw(
                "Halo!\n\nIni adalah email uji coba dari Portal {$schoolName}.\n\nJika Anda menerima pesan ini, artinya konfigurasi Mail Gateway (SMTP) di server produksi telah BERHASIL terhubung dan siap digunakan untuk fitur Atur Ulang Kata Sandi maupun notifikasi sistem.\n\nWaktu Pengiriman: {$timestamp}\nMailer: {$mailer}\n\nSalam hormat,\nTim IT & Pengembang Portal Sekolah.",
                function ($message) use ($email, $schoolName) {
                    $message->to($email)
                        ->subject("Uji Coba Pengiriman Email - {$schoolName}");
                }
            );

            $this->newLine();
            $this->info('[BERHASIL] Email uji coba berhasil dikirim!');

            if ($mailer === 'log') {
                $this->warn("Catatan: Mailer saat ini adalah 'log'. Email tidak dikirim ke internet, melainkan dicatat ke file storage/logs/laravel.log.");
            } else {
                $this->info("Silakan periksa kotak masuk (inbox) atau folder spam pada email '{$email}'.");
            }

            return self::SUCCESS;
        } catch (Throwable $e) {
            $this->newLine();
            $this->error('[GAGAL] Pengiriman email gagal dengan kesalahan:');
            $this->error($e->getMessage());
            $this->newLine();

            $this->warn('Panduan Diagnosa:');
            if (str_contains($e->getMessage(), 'Connection could not be established')) {
                $this->line('- Periksa apakah host dan port SMTP sudah benar (misal: port 587 untuk TLS, port 465 untuk SSL).');
                $this->line('- Pastikan server hosting/firewall tidak memblokir outgoing port 587/465.');
            } elseif (str_contains($e->getMessage(), 'Authentication failed') || str_contains($e->getMessage(), '535')) {
                $this->line('- Username atau password SMTP salah.');
                $this->line('- Jika menggunakan Gmail/Google Workspace, Anda WAJIB membuat "App Password" (Kata Sandi Aplikasi) di akun Google, bukan password login biasa.');
            } elseif (str_contains($e->getMessage(), 'certificate')) {
                $this->line('- Terjadi masalah sertifikat SSL pada server SMTP. Periksa setting MAIL_SCHEME / MAIL_ENCRYPTION.');
            } else {
                $this->line('- Pastikan nilai MAIL_HOST, MAIL_PORT, MAIL_USERNAME, dan MAIL_PASSWORD di file .env sudah sesuai.');
            }

            return self::FAILURE;
        }
    }
}
