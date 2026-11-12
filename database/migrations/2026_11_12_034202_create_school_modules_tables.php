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
        // 1. Direktori Guru & GTK
        Schema::create('staff_directories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('nip', 50)->nullable();
            $table->string('position', 100);
            $table->string('subject', 100)->nullable();
            $table->enum('category', ['kepsek', 'guru', 'tendik'])->default('guru')->index();
            $table->string('photo')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        // 2. Ekstrakurikuler
        Schema::create('extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->string('leader_name', 100)->nullable();
            $table->string('schedule_day', 50)->nullable();
            $table->string('schedule_time', 50)->nullable();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Rekap Prestasi Siswa
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('student_name', 150);
            $table->string('competition_name');
            $table->enum('level', ['kabupaten', 'provinsi', 'nasional', 'internasional'])->default('kabupaten')->index();
            $table->string('rank', 50); // e.g. "Juara 1", "Medali Emas"
            $table->year('year');
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. Agenda Akademik & Kalender Sekolah
        Schema::create('academic_agendas', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('start_date')->index();
            $table->date('end_date')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_agendas');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('extracurriculars');
        Schema::dropIfExists('staff_directories');
    }
};

