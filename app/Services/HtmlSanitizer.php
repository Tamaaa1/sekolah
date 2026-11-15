<?php

namespace App\Services;

class HtmlSanitizer
{
    /**
     * Tags that should be completely removed along with their inner contents.
     */
    protected const REMOVE_TAGS_WITH_CONTENT = [
        'script', 'style', 'iframe', 'object', 'embed', 'applet', 'meta', 'link', 'base',
    ];

    /**
     * Tags that should be stripped (tag removed, but child text preserved).
     */
    protected const DISALLOWED_TAGS = [
        'form', 'input', 'button', 'select', 'textarea', 'option', 'svg', 'canvas',
    ];

    /**
     * Sanitize an HTML string or content array to prevent Stored XSS attacks.
     *
     * @param string|array|null $content
     * @return string|array|null
     */
    public static function clean(mixed $content): mixed
    {
        if (is_null($content)) {
            return null;
        }

        if (is_array($content)) {
            return array_map(function ($item) {
                if (is_array($item)) {
                    return self::clean($item);
                } elseif (is_string($item)) {
                    return self::cleanString($item);
                }
                return $item;
            }, $content);
        }

        if (is_string($content)) {
            return self::cleanString($content);
        }

        return $content;
    }

    /**
     * Clean a raw HTML string.
     */
    public static function cleanString(string $html): string
    {
        if (trim($html) === '') {
            return '';
        }

        // 1. Remove dangerous tags and all their inner contents
        foreach (self::REMOVE_TAGS_WITH_CONTENT as $tag) {
            $html = preg_replace("#<{$tag}[^>]*>.*?</{$tag}>#is", '', $html);
            $html = preg_replace("#<{$tag}[^>]*/>#is", '', $html);
        }

        // 2. Strip disallowed interactive form tags (keep text)
        foreach (self::DISALLOWED_TAGS as $tag) {
            $html = preg_replace("#</?{$tag}[^>]*>#is", '', $html);
        }

        // 3. Strip all inline JavaScript event handlers (onabort, onclick, onerror, onload, etc.)
        $html = preg_replace('#\s+on[a-z]+\s*=\s*(["\'])?.*?\1(\s|>|/)#is', '$2', $html);
        $html = preg_replace('#\s+on[a-z]+\s*=\s*[^ >]+#is', '', $html);

        // 4. Neutralize javascript:, data:, and vbscript: pseudoprotocols in href or src
        $html = preg_replace_callback('#(href|src)\s*=\s*(["\'])(.*?)\2#is', function ($matches) {
            $attr = strtolower($matches[1]);
            $url = trim($matches[3]);

            // Decode entities to catch disguised protocols
            $decoded = html_entity_decode($url, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $cleanUrl = preg_replace('/[\x00-\x1F\x7F]/', '', $decoded);

            if (preg_match('#^\s*(javascript|vbscript|data):#i', $cleanUrl)) {
                return "{$attr}=\"#\"";
            }

            return "{$attr}=\"{$matches[3]}\"";
        }, $html);

        return $html;
    }
}
