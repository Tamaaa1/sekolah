<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$urls = [
    '/',
    '/berita',
    '/ppdb',
    '/guru-dan-staf',
    '/ekstrakurikuler',
    '/prestasi',
    '/agenda',
    '/sitemap.xml',
];

echo "========================================================\n";
echo "      SEO & METADATA INFRASTRUCTURE VERIFICATION        \n";
echo "========================================================\n\n";

$allPassed = true;

foreach ($urls as $url) {
    $req = Illuminate\Http\Request::create($url, 'GET');
    $res = $kernel->handle($req);
    $status = $res->getStatusCode();
    $type = $res->headers->get('Content-Type');
    $isOk = $status === 200;
    if (!$isOk) $allPassed = false;
    echo sprintf("[%s] %-20s -> Status: %d | Type: %s\n", $isOk ? ' PASS ' : ' FAIL ', $url, $status, $type);
}

// 1. Check Sitemap XML Parsing
echo "\n--- SITEMAP XML VALIDATION ---\n";
$sitemapReq = Illuminate\Http\Request::create('/sitemap.xml', 'GET');
$sitemapRes = $kernel->handle($sitemapReq);
$content = $sitemapRes->getContent();

$xml = @simplexml_load_string($content);
if ($xml !== false && isset($xml->url)) {
    $urlCount = count($xml->url);
    echo "[ PASS ] Sitemap XML is valid and well-formed XML.\n";
    echo "         Total URLs registered: {$urlCount}\n";
    echo "         Homepage URL: " . (string)$xml->url[0]->loc . " (Priority: " . (string)$xml->url[0]->priority . ")\n";
    echo "         Last registered URL: " . (string)$xml->url[$urlCount - 1]->loc . "\n";
} else {
    $allPassed = false;
    echo "[ FAIL ] Sitemap XML failed to parse as valid XML!\n";
}

// 2. Check Robots.txt
echo "\n--- ROBOTS.TXT VALIDATION ---\n";
$robotsFile = __DIR__ . '/../public/robots.txt';
if (file_exists($robotsFile)) {
    $robots = file_get_contents($robotsFile);
    $hasDisallowAdmin = strpos($robots, 'Disallow: /admin/') !== false;
    $hasSitemap = strpos($robots, 'Sitemap: /sitemap.xml') !== false;

    if ($hasDisallowAdmin && $hasSitemap) {
        echo "[ PASS ] robots.txt exists and protects admin paths with Sitemap link.\n";
    } else {
        $allPassed = false;
        echo "[ FAIL ] robots.txt missing directives. Admin Disallow: " . ($hasDisallowAdmin ? 'YES' : 'NO') . ", Sitemap: " . ($hasSitemap ? 'YES' : 'NO') . "\n";
    }
} else {
    $allPassed = false;
    echo "[ FAIL ] robots.txt file does not exist!\n";
}

// 3. Check App.blade.php SEO Head Tags
echo "\n--- BLADE ROOT TEMPLATE VALIDATION ---\n";
$bladeFile = __DIR__ . '/../resources/views/app.blade.php';
$blade = file_get_contents($bladeFile);
$checks = [
    'viewport-fit=cover' => 'Viewport cover scale',
    'theme-color' => 'Theme color meta',
    'format-detection' => 'Format detection meta',
];

foreach ($checks as $pattern => $label) {
    if (strpos($blade, $pattern) !== false) {
        echo "[ PASS ] {$label} found in app.blade.php\n";
    } else {
        $allPassed = false;
        echo "[ FAIL ] {$label} missing in app.blade.php\n";
    }
}

if (strpos($blade, 'x-inertia::head') !== false || strpos($blade, '@inertiaHead') !== false) {
    echo "[ PASS ] Inertia dynamic Head component found in app.blade.php\n";
} else {
    $allPassed = false;
    echo "[ FAIL ] Inertia dynamic Head component missing in app.blade.php\n";
}

echo "\n========================================================\n";
if ($allPassed) {
    echo "RESULT: ALL SEO VALIDATION CHECKS PASSED (100% SUCCESS)!\n";
} else {
    echo "RESULT: SOME SEO CHECKS FAILED!\n";
}
echo "========================================================\n";
