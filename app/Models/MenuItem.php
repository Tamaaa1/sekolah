<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'parent_id',
        'label',
        'link_type',
        'target_id',
        'custom_url',
        'sort_order',
    ];

    protected $appends = ['url'];

    protected static function booted(): void
    {
        $clearCache = function (MenuItem $item) {
            if ($item->menu) {
                Cache::forget('school_menu_' . $item->menu->location);
            }
        };

        static::saved($clearCache);
        static::deleted($clearCache);
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('sort_order');
    }

    public function targetPost(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'target_id');
    }

    public function getUrlAttribute(): string
    {
        if ($this->link_type === 'internal_post' && $this->targetPost) {
            return '/' . $this->targetPost->slug;
        }

        return $this->custom_url ?? '#';
    }
}
