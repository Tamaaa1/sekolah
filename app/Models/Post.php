<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'author_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'type',
        'status',
        'featured_image',
        'file_attachment',
        'is_pinned',
        'meta_title',
        'meta_description',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'is_pinned' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function taxonomies(): BelongsToMany
    {
        return $this->belongsToMany(Taxonomy::class, 'post_taxonomy');
    }

    public function categories(): BelongsToMany
    {
        return $this->taxonomies()->where('type', 'category');
    }

    public function tags(): BelongsToMany
    {
        return $this->taxonomies()->where('type', 'tag');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopePosts(Builder $query): Builder
    {
        return $query->where('type', 'post');
    }

    public function scopePages(Builder $query): Builder
    {
        return $query->where('type', 'page');
    }

    public function scopeAnnouncements(Builder $query): Builder
    {
        return $query->where('type', 'announcement');
    }
}
