<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ActivityLogger
{
    /**
     * Record an activity log in the database.
     *
     * @param string $action Action type (create, update, delete, upload, login, logout, etc.)
     * @param string $module Module/feature name (Berita & Artikel, Guru & Staf TU, etc.)
     * @param string $description Human readable description of the event
     * @param Model|null $subject Related model instance
     * @param array $properties Additional context or changed attributes
     * @return ActivityLog|null
     */
    public static function log(
        string $action,
        string $module,
        string $description,
        ?Model $subject = null,
        array $properties = []
    ): ?ActivityLog {
        try {
            $user = Auth::user();
            $request = request();

            return ActivityLog::create([
                'user_id' => $user?->id,
                'user_name' => $user?->name ?? 'Sistem / Anonim',
                'user_email' => $user?->email,
                'action' => strtolower($action),
                'module' => $module,
                'description' => $description,
                'subject_type' => $subject ? get_class($subject) : null,
                'subject_id' => $subject?->getKey(),
                'properties' => !empty($properties) ? $properties : null,
                'ip_address' => $request?->ip(),
                'user_agent' => $request?->userAgent(),
            ]);
        } catch (\Throwable $e) {
            // Never let logging failure interrupt the primary application flow
            Log::warning('Gagal mencatat log aktivitas: ' . $e->getMessage());
            return null;
        }
    }
}
