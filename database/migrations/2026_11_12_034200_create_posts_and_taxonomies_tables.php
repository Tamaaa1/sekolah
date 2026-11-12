<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->json('content')->nullable();
            $table->enum('type', ['post', 'page', 'announcement'])->default('post')->index();
            $table->enum('status', ['draft', 'pending_review', 'scheduled', 'published'])->default('draft')->index();
            $table->string('featured_image')->nullable();
            $table->string('file_attachment')->nullable();
            $table->boolean('is_pinned')->default(false)->index();
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('taxonomies', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->enum('type', ['category', 'tag'])->default('category')->index();
            $table->timestamps();
        });

        Schema::create('post_taxonomy', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->cascadeOnDelete();
            $table->foreignId('taxonomy_id')->constrained('taxonomies')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['post_id', 'taxonomy_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_taxonomy');
        Schema::dropIfExists('taxonomies');
        Schema::dropIfExists('posts');
    }
};
