<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
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
