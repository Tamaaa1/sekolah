<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaService
{
    /**
     * Verifikasi token Google reCAPTCHA v3
     */
    public function verify(?string $token, string $expectedAction = '', ?string $ip = null): bool
    {
        $secretKey = config('services.recaptcha.secret_key');

        // Bypass jika di lingkungan testing atau secret key belum dikonfigurasi
        if (empty($secretKey) || app()->environment('testing')) {
            return true;
        }

        if (empty($token)) {
            Log::warning('[reCAPTCHA v3] Token verifikasi kosong atau tidak disertakan', [
                'action' => $expectedAction,
                'ip' => $ip,
            ]);
            return false;
        }

        try {
            $response = Http::asForm()->timeout(5)->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretKey,
                'response' => $token,
                'remoteip' => $ip,
            ]);

            if (! $response->successful()) {
                Log::warning('[reCAPTCHA v3] Permintaan verifikasi ke Google gagal', [
                    'status' => $response->status(),
                ]);
                return false;
            }

            $data = $response->json();
            $success = (bool) ($data['success'] ?? false);
            $score = (float) ($data['score'] ?? 0.0);
            $action = (string) ($data['action'] ?? '');

            if (! $success) {
                Log::warning('[reCAPTCHA v3] Verifikasi ditolak oleh Google', [
                    'error_codes' => $data['error-codes'] ?? [],
                    'ip' => $ip,
                ]);
                return false;
            }

            $minScore = (float) config('services.recaptcha.minimum_score', 0.5);
            if ($score < $minScore) {
                Log::warning('[reCAPTCHA v3] Skor reputasi berada di bawah ambang batas (terindikasi bot)', [
                    'score' => $score,
                    'threshold' => $minScore,
                    'action' => $action,
                    'ip' => $ip,
                ]);
                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error('[reCAPTCHA v3] Terjadi galat saat memvalidasi ke Google: ' . $e->getMessage());
            // Jika koneksi ke server Google timeout/gagal, izinkan dengan peringatan di log agar user sah tidak terkunci
            return true;
        }
    }
}
