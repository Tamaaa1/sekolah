<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class StaffDirectory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nip',
        'position',
        'subject',
        'category',
        'photo',
        'sort_order',
        'is_active',
    ];

    protected $appends = [
        'photo_url',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function getPhotoUrlAttribute(): ?string
    {
        if (! $this->photo) {
            return null;
        }

        if (str_starts_with($this->photo, 'http://') || str_starts_with($this->photo, 'https://') || str_starts_with($this->photo, '/')) {
            return $this->photo;
        }

        return Storage::disk('public')->url($this->photo);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeKepsek(Builder $query): Builder
    {
        return $query->where('category', 'kepsek');
    }

    public function scopeGuru(Builder $query): Builder
    {
        return $query->where('category', 'guru');
    }

    public function scopeTendik(Builder $query): Builder
    {
        return $query->where('category', 'tendik');
    }
}

