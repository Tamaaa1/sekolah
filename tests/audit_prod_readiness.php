<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== PRODUCTION READINESS AUDIT CHECKLIST ===\n\n";

// 1. Check Users
echo "1. USER ACCOUNTS & PRIVILEGES:\n";
$users = App\Models\User::with('roles')->get();
foreach ($users as $u) {
    echo "   - [ID: {$u->id}] {$u->name} ({$u->email}) -> Roles: " . $u->roles->pluck('name')->join(', ') . "\n";
}

// 2. Check Test/Draft Posts
echo "\n2. DUMMY / TEST POSTS:\n";
$dummyPosts = App\Models\Post::where('title', 'like', '%test%')
    ->orWhere('slug', 'like', '%test%')
    ->orWhere('title', 'like', '%dummy%')
    ->orWhere('content', 'like', '%lorem%')
    ->get(['id', 'title', 'slug', 'status', 'type', 'published_at']);

if ($dummyPosts->count() > 0) {
    foreach ($dummyPosts as $p) {
        echo "   - [ID: {$p->id}] '{$p->title}' (slug: {$p->slug}, status: {$p->status}, type: {$p->type})\n";
    }
} else {
    echo "   - No dummy/test posts found.\n";
}

// 3. Check General Settings
echo "\n3. APP & SCHOOL SETTINGS:\n";
$settings = App\Models\Setting::allGrouped();
$criticalSettings = [
    'school_name',
    'school_tagline',
    'school_address',
    'school_phone',
    'school_email',
    'whatsapp',
    'ppdb_is_open',
    'ppdb_year',
    'ppdb_portal_url',
    'ppdb_brochure_url',
];

foreach ($criticalSettings as $key) {
    $val = $settings[$key] ?? '(NOT SET)';
    if (is_bool($val)) $val = $val ? 'TRUE' : 'FALSE';
    echo "   - {$key}: {$val}\n";
}

// 4. Check Storage Link
echo "\n4. STORAGE & UPLOADS:\n";
$storageLink = public_path('storage');
echo "   - public/storage symlink exists: " . (file_exists($storageLink) ? "YES" : "NO") . "\n";
$brochureFile = $settings['ppdb_brochure_url'] ?? '';
echo "   - PPDB brochure configured: " . ($brochureFile ? $brochureFile : "None") . "\n";

// 5. Check HTTPS & Proxies
echo "\n5. SECURITY HEADERS & HTTPS:\n";
$appUrl = config('app.url');
echo "   - APP_URL: {$appUrl}\n";
echo "   - APP_DEBUG: " . (config('app.debug') ? 'TRUE (MUST BE FALSE IN PROD)' : 'FALSE (OK)') . "\n";
echo "   - APP_ENV: " . config('app.env') . "\n";

