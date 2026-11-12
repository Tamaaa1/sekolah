<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
    ];

    protected static function booted(): void
    {
        static::saved(function (Menu $menu) {
            Cache::forget('school_menu_' . $menu->location);
        });

        static::deleted(function (Menu $menu) {
            Cache::forget('school_menu_' . $menu->location);
        });
    }

    public static function getByLocation(string $location): ?array
    {
        $cached = Cache::get('school_menu_' . $location);
        if (is_array($cached)) {
            return $cached;
        }

        Cache::forget('school_menu_' . $location);

        return Cache::rememberForever('school_menu_' . $location, function () use ($location) {
            $menu = static::where('location', $location)
                ->with(['rootItems' => function ($query) {
                    $query->with('children.targetPost');
                }])
                ->first();

            return $menu ? $menu->toArray() : null;
        });
    }

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('sort_order');
    }

    public function rootItems(): HasMany
    {
        return $this->hasMany(MenuItem::class)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->with('children');
    }
}
