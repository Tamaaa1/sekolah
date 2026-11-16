<?php

namespace App\Services;

class ContentFilterService
{
    /**
     * Daftar kata kasar, umpatan, makian, pornografi, dan penghinaan (Bahasa Indonesia & serapan).
     */
    protected array $profanityList = [
        // Organ tubuh intim / seksual / vulgar
        'kontol', 'memek', 'jembut', 'peler', 'pepek', 'itil', 'tetek', 'toket',
        'ngentot', 'ngewe', 'pantek', 'puki', 'pukimak', 'tempik', 'bispak',
        'bokep', 'porno', 'sange', 'ngaceng', 'coli', 'colmek', 'lonte', 'jablay',
        'pelacur', 'cuki', 'kimak',

        // Makian / binatang sebagai hinaan
        'anjing', 'babi', 'monyet', 'asu', 'celeng', 'kunyuk', 'kampret',
        'bangsat', 'bajingan', 'keparat', 'biadab', 'bego', 'goblok', 'tolol',
        'idiot', 'dungu', 'pekok', 'setan', 'iblis', 'tai', 'taik', 'modar',
    ];

    /**
     * Daftar kata kunci promosi judi online (slot), taruhan, dan scam finansial.
     */
    protected array $gamblingSpamList = [
        'slot gacor', 'slot online', 'judi online', 'maxwin', 'pragmatic play',
        'zeus slot', 'taruhan bola', 'bandar togel', 'togel online', 'bocoran slot',
        'deposit pulsa', 'link alternatif', 'situs gacor', 'scatter hitam',
        'scatter merah', 'free spin', 'rtp live', 'agen judi', 'casino online',
        'sbobet', 'poker online', 'dominoqq', 'bandarq', 'judi slot', 'daftar slot',
        'sensational slot', 'gampang maxwin', 'pasti wd', 'situs slot',
    ];

    /**
     * Domain pemendek tautan atau TLD mencurigakan yang sering dipakai spam bot.
     */
    protected array $suspiciousDomains = [
        'bit.ly', 'tinyurl.com', 't.co', 's.id', 'cutt.ly', 'shorturl.at',
        '.xyz', '.top', '.club', '.ru', '.cn', '.tk', '.ga', '.ml', '.cf',
    ];

    /**
     * Periksa teks terhadap kata kasar, spam judi, dan kelebihan tautan.
     *
     * @return array{is_clean: bool, type: string|null, matched: string|null}
     */
    public function inspect(string $text): array
    {
        $normalizedText = $this->normalizeText($text);

        // 1. Cek Kata Kasar / Profanity
        foreach ($this->profanityList as $word) {
            $pattern = '/\b' . preg_quote($word, '/') . '\b/i';
            if (preg_match($pattern, $normalizedText) || preg_match($pattern, $text)) {
                return [
                    'is_clean' => false,
                    'type' => 'profanity',
                    'matched' => $word,
                ];
            }
        }

        // 2. Cek Spam Judi Online
        foreach ($this->gamblingSpamList as $phrase) {
            if (str_contains($normalizedText, $phrase) || stripos($text, $phrase) !== false) {
                return [
                    'is_clean' => false,
                    'type' => 'gambling_spam',
                    'matched' => $phrase,
                ];
            }
        }

        // 3. Cek Kelebihan Tautan / Link Spam
        if ($this->hasExcessiveLinks($text, 2)) {
            return [
                'is_clean' => false,
                'type' => 'link_flood',
                'matched' => 'excessive_urls',
            ];
        }

        // 4. Cek TLD atau domain mencurigakan
        foreach ($this->suspiciousDomains as $domain) {
            if (stripos($text, $domain) !== false) {
                return [
                    'is_clean' => false,
                    'type' => 'suspicious_link',
                    'matched' => $domain,
                ];
            }
        }

        return [
            'is_clean' => true,
            'type' => null,
            'matched' => null,
        ];
    }

    /**
     * Hitung apakah teks mengandung jumlah URL melebihi batas yang wajar.
     */
    public function hasExcessiveLinks(string $text, int $maxAllowed = 1): bool
    {
        $pattern = '/(https?:\/\/[^\s]+|www\.[^\s]+)/i';
        $matchesCount = preg_match_all($pattern, $text);

        return $matchesCount > $maxAllowed;
    }

    /**
     * Normalisasi teks untuk menggagalkan upaya penyamaran huruf (leetspeak).
     * Contoh: "4nj1ng" -> "anjing", "k0nt0l" -> "kontol", dll.
     */
    protected function normalizeText(string $text): string
    {
        $text = strtolower($text);

        // Konversi karakter leetspeak umum ke huruf standar
        $replacements = [
            '0' => 'o',
            '1' => 'i',
            '3' => 'e',
            '4' => 'a',
            '5' => 's',
            '7' => 't',
            '8' => 'b',
            '@' => 'a',
            '$' => 's',
            '+' => 't',
            '!' => 'i',
        ];

        $converted = strtr($text, $replacements);

        // Hapus karakter pemisah yang sengaja disisipkan antar huruf (contoh: a.n.j.i.n.g atau a_n_j_i_n_g)
        $noSeparators = preg_replace('/(?<=[a-z])[\.\-\_\*\s\~]+(?=[a-z])/i', '', $converted);

        return $converted . ' ' . $noSeparators;
    }
}
