<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'key',
        'value',
        'group',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function (Setting $setting) {
            Cache::forget('school_setting_' . $setting->key);
            Cache::forget('school_settings_all');
        });

        static::deleted(function (Setting $setting) {
            Cache::forget('school_setting_' . $setting->key);
            Cache::forget('school_settings_all');
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::rememberForever('school_setting_' . $key, function () use ($key, $default) {
            $setting = static::find($key);
            $val = $setting ? $setting->value : $default;
            if ($key === 'ppdb_is_open' && $val !== null) {
                return filter_var($val, FILTER_VALIDATE_BOOLEAN);
            }
            return $val;
        });
    }

    public static function set(string $key, mixed $value, string $group = 'general'): self
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group]
        );

        Cache::forget('school_setting_' . $key);
        Cache::forget('school_settings_all');

        return $setting;
    }

    public static function allGrouped(): array
    {
        return Cache::rememberForever('school_settings_all', function () {
            $all = static::all();
            $grouped = [];
            foreach ($all as $item) {
                if ($item->key === 'ppdb_is_open') {
                    $grouped[$item->key] = filter_var($item->value, FILTER_VALIDATE_BOOLEAN);
                } else {
                    $grouped[$item->key] = $item->value;
                }
            }
            return $grouped;
        });
    }
}

