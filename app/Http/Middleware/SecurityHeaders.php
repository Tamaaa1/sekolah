<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and apply strict defensive HTTP security headers.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Remove information disclosure header safely
        if (! headers_sent()) {
            header_remove('X-Powered-By');
        }
        if (method_exists($response->headers, 'remove')) {
            $response->headers->remove('X-Powered-By');
        }

        // Prevent Clickjacking (disallow embedding in foreign iframes)
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing attacks
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Legacy XSS filter activation
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Protect user referrers when navigating cross-origin
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Restrict unnecessary browser features & hardware sensors
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

        return $response;
    }
}
