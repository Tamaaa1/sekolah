<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic XML Sitemap for Googlebot & search engine crawlers.
     */
    public function index(): Response
    {
        $posts = Post::published()
            ->select('slug', 'type', 'updated_at', 'published_at')
            ->orderByDesc('published_at')
            ->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Main static portal routes
        $staticRoutes = [
            ['url' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => url('/berita'), 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => url('/ppdb'), 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['url' => url('/guru-dan-staf'), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => url('/prestasi'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => url('/ekstrakurikuler'), 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => url('/agenda'), 'priority' => '0.8', 'changefreq' => 'weekly'],
        ];

        foreach ($staticRoutes as $route) {
            $xml .= "    <url>\n";
            $xml .= '        <loc>' . htmlspecialchars($route['url'], ENT_XML1, 'UTF-8') . "</loc>\n";
            $xml .= '        <changefreq>' . $route['changefreq'] . "</changefreq>\n";
            $xml .= '        <priority>' . $route['priority'] . "</priority>\n";
            $xml .= "    </url>\n";
        }

        // Dynamic published articles, announcements, and pages
        foreach ($posts as $post) {
            $loc = $post->type === 'page' ? url('/' . $post->slug) : url('/berita/' . $post->slug);
            $lastmod = ($post->updated_at ?? $post->published_at ?? now())->toAtomString();

            $xml .= "    <url>\n";
            $xml .= '        <loc>' . htmlspecialchars($loc, ENT_XML1, 'UTF-8') . "</loc>\n";
            $xml .= '        <lastmod>' . $lastmod . "</lastmod>\n";
            $xml .= "        <changefreq>monthly</changefreq>\n";
            $xml .= "        <priority>0.8</priority>\n";
            $xml .= "    </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }
}
