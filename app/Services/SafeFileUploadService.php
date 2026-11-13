<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SafeFileUploadService
{
    public const TYPE_ALL = 'all';
    public const TYPE_IMAGES = 'images';
    public const TYPE_DOCUMENTS = 'documents';

    /**
     * Allowed canonical image MIME types and their trusted extensions.
     */
    protected const ALLOWED_IMAGE_MIMES = [
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png'  => ['png'],
        'image/webp' => ['webp'],
    ];

    /**
     * Allowed canonical document MIME types (strictly PDF for school portals).
     */
    protected const ALLOWED_DOCUMENT_MIMES = [
        'application/pdf'   => ['pdf'],
        'application/x-pdf' => ['pdf'],
    ];

    /**
     * Blacklisted dangerous extension tokens anywhere in the original filename.
     */
    protected const DANGEROUS_EXTENSIONS = [
        'php', 'php3', 'php4', 'php5', 'php7', 'php8', 'phtml', 'phar', 'pht',
        'exe', 'com', 'bat', 'cmd', 'vbs', 'vbe', 'js', 'jse', 'wsf', 'wsh',
        'ps1', 'psm1', 'sh', 'bash', 'bin', 'cgi', 'pl', 'py', 'jar', 'war',
        'asp', 'aspx', 'cer', 'cdx', 'asa', 'asax', 'jsp', 'jspx', 'shtml',
        'stm', 'shtm', 'html', 'htm', 'xhtml', 'svg', 'xml', 'htaccess',
        'htpasswd', 'ini', 'conf', 'env'
    ];

    /**
     * Maximum file size in kilobytes (5 MB).
     */
    protected const MAX_FILE_SIZE_KB = 5120;

    /**
     * Validate and store an uploaded file securely.
     *
     * @param UploadedFile|null $file
     * @param string $allowedType 'all' | 'images' | 'documents'
     * @param string $folder Destination folder inside public disk
     * @param string|null $customAlt
     * @return array{name: string, file_name: string, file_path: string, mime_type: string, size: int, alt_text: string, category: string}
     *
     * @throws ValidationException
     */
    public function validateAndStore(?UploadedFile $file, string $allowedType = self::TYPE_ALL, string $folder = 'uploads', ?string $customAlt = null): array
    {
        if (! $file instanceof UploadedFile || ! $file->isValid()) {
            throw ValidationException::withMessages([
                'file' => 'Berkas tidak ditemukan atau proses pengunggahan terputus.',
            ]);
        }

        // 1. Validate file size
        $fileSizeKb = ceil($file->getSize() / 1024);
        if ($fileSizeKb > self::MAX_FILE_SIZE_KB) {
            throw ValidationException::withMessages([
                'file' => 'Ukuran berkas melebihi batas maksimum 5 MB (ukuran berkas Anda: ' . round($fileSizeKb / 1024, 2) . ' MB).',
            ]);
        }

        // 2. Sanitize & inspect client filename
        $rawClientName = $file->getClientOriginalName();
        $this->inspectFilenameSecurity($rawClientName);

        // 3. Detect real MIME type using PHP FileInfo directly on disk
        $realMime = $this->detectRealMimeType($file);

        // 4. Validate MIME type against allowed category
        $category = $this->resolveCategoryAndValidateMime($realMime, $allowedType);

        // 5. Verify magic bytes / file header signature
        $this->verifyMagicBytes($file, $realMime);

        // 6. Deep payload content scan for webshells or script injection
        $this->scanForMaliciousPayloads($file, $category);

        // 7. Category-specific deep integrity checks
        if ($category === 'image') {
            $this->verifyImageIntegrity($file, $realMime);
        } elseif ($category === 'document') {
            $this->verifyPdfIntegrity($file);
        }

        // 8. Enforce canonical extension matching
        $canonicalExtension = $this->resolveCanonicalExtension($realMime, $file->getClientOriginalExtension());

        // 9. Generate randomized collision-free filename
        $clientBaseName = pathinfo($rawClientName, PATHINFO_FILENAME);
        $cleanSlug = Str::slug($clientBaseName);
        if (empty($cleanSlug)) {
            $cleanSlug = $category === 'image' ? 'foto' : 'dokumen';
        }
        $cleanSlug = substr($cleanSlug, 0, 50);

        $safeFileName = sprintf(
            '%s-%s-%s.%s',
            $cleanSlug,
            time(),
            Str::lower(Str::random(10)),
            $canonicalExtension
        );

        // 10. Ensure uploads directory security (.htaccess protection)
        $this->ensureUploadDirectorySecurity($folder);

        // 11. Store file into public disk
        $storedPath = $file->storeAs($folder, $safeFileName, 'public');
        if (! $storedPath) {
            throw ValidationException::withMessages([
                'file' => 'Gagal menyimpan berkas ke media penyimpanan.',
            ]);
        }

        return [
            'name' => $clientBaseName,
            'file_name' => $safeFileName,
            'file_path' => $storedPath,
            'mime_type' => $realMime,
            'size' => $file->getSize(),
            'alt_text' => $customAlt ?: $clientBaseName,
            'category' => $category,
        ];
    }

    /**
     * Inspect client filename for path traversal, null bytes, double extensions, and dangerous tokens.
     */
    protected function inspectFilenameSecurity(string $filename): void
    {
        // Check for null byte injection
        if (str_contains($filename, "\0") || str_contains($filename, '%00')) {
            throw ValidationException::withMessages([
                'file' => 'Nama berkas mengandung karakter terlarang (null byte).',
            ]);
        }

        // Check for directory traversal
        if (str_contains($filename, '..') || str_contains($filename, '/') || str_contains($filename, '\\')) {
            throw ValidationException::withMessages([
                'file' => 'Nama berkas mengandung pola path traversal yang mencurigakan.',
            ]);
        }

        // Disallow hidden files
        if (str_starts_with($filename, '.')) {
            throw ValidationException::withMessages([
                'file' => 'Berkas tersembunyi (hidden file) tidak diizinkan untuk diunggah.',
            ]);
        }

        // Split filename by dots to check every segment against dangerous extensions
        $segments = explode('.', strtolower($filename));
        array_shift($segments); // Remove the base name part

        foreach ($segments as $segment) {
            $segment = trim($segment);
            if (in_array($segment, self::DANGEROUS_EXTENSIONS, true)) {
                throw ValidationException::withMessages([
                    'file' => "Nama berkas mengandung ekstensi terlarang atau berbahaya (.{$segment}). Sistem menolak berkas ini.",
                ]);
            }
        }
    }

    /**
     * Detect real MIME type directly from file content using FileInfo.
     */
    protected function detectRealMimeType(UploadedFile $file): string
    {
        $realPath = $file->getRealPath();
        if (! $realPath || ! file_exists($realPath)) {
            throw ValidationException::withMessages([
                'file' => 'Berkas sementara tidak dapat dibaca oleh server.',
            ]);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $realPath);
        finfo_close($finfo);

        return strtolower((string) $mime);
    }

    /**
     * Resolve category and validate that real MIME is permitted.
     */
    protected function resolveCategoryAndValidateMime(string $realMime, string $allowedType): string
    {
        $isImage = array_key_exists($realMime, self::ALLOWED_IMAGE_MIMES);
        $isDocument = array_key_exists($realMime, self::ALLOWED_DOCUMENT_MIMES);

        if ($allowedType === self::TYPE_IMAGES) {
            if (! $isImage) {
                throw ValidationException::withMessages([
                    'file' => 'Hanya berkas gambar (JPG, JPEG, PNG, WEBP) yang diizinkan untuk bagian ini.',
                ]);
            }
            return 'image';
        }

        if ($allowedType === self::TYPE_DOCUMENTS) {
            if (! $isDocument) {
                throw ValidationException::withMessages([
                    'file' => 'Hanya dokumen resmi berformat PDF yang diizinkan untuk bagian ini.',
                ]);
            }
            return 'document';
        }

        // TYPE_ALL
        if ($isImage) {
            return 'image';
        }

        if ($isDocument) {
            return 'document';
        }

        throw ValidationException::withMessages([
            'file' => 'Tipe berkas tidak didukung (' . $realMime . '). Hanya diperbolehkan gambar (JPG, PNG, WEBP) dan dokumen PDF resmi.',
        ]);
    }

    /**
     * Verify binary magic bytes matching the real MIME type.
     */
    protected function verifyMagicBytes(UploadedFile $file, string $mime): void
    {
        $handle = @fopen($file->getRealPath(), 'rb');
        if (! $handle) {
            throw ValidationException::withMessages([
                'file' => 'Gagal membaca header berkas untuk verifikasi keamanan.',
            ]);
        }

        $bytes = fread($handle, 16);
        fclose($handle);

        if (strlen($bytes) < 4) {
            throw ValidationException::withMessages([
                'file' => 'Ukuran berkas terlalu kecil atau header rusak.',
            ]);
        }

        $isValidHeader = false;

        switch ($mime) {
            case 'image/jpeg':
                // Starts with FF D8 FF
                $isValidHeader = str_starts_with($bytes, "\xFF\xD8\xFF");
                break;

            case 'image/png':
                // Starts with 89 50 4E 47 0D 0A 1A 0A
                $isValidHeader = str_starts_with($bytes, "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A");
                break;

            case 'image/webp':
                // Starts with RIFF and has WEBP at offset 8
                $isValidHeader = str_starts_with($bytes, 'RIFF') && substr($bytes, 8, 4) === 'WEBP';
                break;

            case 'application/pdf':
            case 'application/x-pdf':
                // Starts with %PDF-
                $isValidHeader = str_starts_with($bytes, "%PDF-");
                break;
        }

        if (! $isValidHeader) {
            throw ValidationException::withMessages([
                'file' => 'Header berkas tidak valid atau terindikasi pemalsuan ekstensi/tipe file (Magic Bytes Mismatch).',
            ]);
        }
    }

    /**
     * Scan file content for webshells, PHP tags, or dangerous scripts.
     */
    protected function scanForMaliciousPayloads(UploadedFile $file, string $category): void
    {
        $realPath = $file->getRealPath();
        $fileSize = $file->getSize();

        // Read up to first 512KB and last 64KB (where shells/injections are commonly appended or prepended)
        $handle = @fopen($realPath, 'rb');
        if (! $handle) {
            return;
        }

        $head = fread($handle, 524288); // 512 KB
        $tail = '';
        if ($fileSize > 524288) {
            fseek($handle, -65536, SEEK_END);
            $tail = fread($handle, 65536);
        }
        fclose($handle);

        $inspectContent = $head . "\n" . $tail;

        $suspiciousPatterns = [
            '/<\?php/i',
            '/<\?=/i',
            '/<script\b/i',
            '/eval\s*\(/i',
            '/base64_decode\s*\(/i',
            '/passthru\s*\(/i',
            '/shell_exec\s*\(/i',
            '/system\s*\(/i',
            '/__halt_compiler\s*\(/i',
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $inspectContent)) {
                throw ValidationException::withMessages([
                    'file' => 'Berkas terdeteksi mengandung script atau instruksi kode berbahaya dan langsung ditolak oleh SafeFileUpload.',
                ]);
            }
        }
    }

    /**
     * Verify image integrity with getimagesize.
     */
    protected function verifyImageIntegrity(UploadedFile $file, string $mime): void
    {
        $imageInfo = @getimagesize($file->getRealPath());
        if ($imageInfo === false) {
            throw ValidationException::withMessages([
                'file' => 'Berkas gambar tidak dapat diproses atau rusak (gagal parsing struktur gambar).',
            ]);
        }

        [$width, $height, $imageType] = $imageInfo;

        if ($width <= 0 || $height <= 0) {
            throw ValidationException::withMessages([
                'file' => 'Dimensi gambar tidak valid.',
            ]);
        }

        if ($width > 8000 || $height > 8000) {
            throw ValidationException::withMessages([
                'file' => 'Resolusi gambar melebihi batas maksimum 8000x8000 piksel.',
            ]);
        }

        $expectedTypeMap = [
            'image/jpeg' => IMAGETYPE_JPEG,
            'image/png'  => IMAGETYPE_PNG,
            'image/webp' => IMAGETYPE_WEBP,
        ];

        if (isset($expectedTypeMap[$mime]) && $imageType !== $expectedTypeMap[$mime]) {
            throw ValidationException::withMessages([
                'file' => 'Format gambar di dalam berkas tidak sesuai dengan tipe MIME yang dideklarasikan.',
            ]);
        }
    }

    /**
     * Verify PDF document integrity and disallow active scripting objects.
     */
    protected function verifyPdfIntegrity(UploadedFile $file): void
    {
        $content = @file_get_contents($file->getRealPath(), false, null, 0, 524288); // First 512KB
        if ($content === false) {
            throw ValidationException::withMessages([
                'file' => 'Gagal membaca dokumen PDF.',
            ]);
        }

        // PDF active script injection checks
        if (preg_match('/\/JavaScript\b|\/JS\b|\/Launch\b/i', $content)) {
            throw ValidationException::withMessages([
                'file' => 'Dokumen PDF ditolak karena terindikasi mengandung objek script interaktif (/JavaScript atau /Launch) yang dilarang demi keamanan.',
            ]);
        }
    }

    /**
     * Resolve canonical extension from real MIME and enforce client extension compliance.
     */
    protected function resolveCanonicalExtension(string $mime, string $clientExt): string
    {
        $clientExtClean = strtolower(trim($clientExt));

        $allowedMap = [
            'image/jpeg'        => ['canonical' => 'jpg', 'valid_client' => ['jpg', 'jpeg']],
            'image/png'         => ['canonical' => 'png', 'valid_client' => ['png']],
            'image/webp'        => ['canonical' => 'webp', 'valid_client' => ['webp']],
            'application/pdf'   => ['canonical' => 'pdf', 'valid_client' => ['pdf']],
            'application/x-pdf' => ['canonical' => 'pdf', 'valid_client' => ['pdf']],
        ];

        if (! isset($allowedMap[$mime])) {
            throw ValidationException::withMessages([
                'file' => 'Tipe berkas tidak dikenali.',
            ]);
        }

        $rule = $allowedMap[$mime];
        if (! in_array($clientExtClean, $rule['valid_client'], true)) {
            throw ValidationException::withMessages([
                'file' => "Ekstensi berkas (.{$clientExtClean}) tidak cocok dengan isi berkas aslinya. Hanya ekstensi yang valid (.jpg, .jpeg, .png, .webp, .pdf) yang diizinkan.",
            ]);
        }

        return $rule['canonical'];
    }

    /**
     * Ensure .htaccess is placed inside public upload directory to block execution of scripts.
     */
    protected function ensureUploadDirectorySecurity(string $folder): void
    {
        $publicDiskPath = storage_path('app/public/' . $folder);
        if (! is_dir($publicDiskPath)) {
            @mkdir($publicDiskPath, 0755, true);
        }

        $htaccessPath = $publicDiskPath . '/.htaccess';
        if (! file_exists($htaccessPath)) {
            $htaccessContent = <<<EOT
# Matikan eksekusi script server-side pada direktori berkas publik
<FilesMatch "(?i)\.(php|phtml|phar|php3|php4|php5|php7|php8|pht|pl|py|jsp|asp|aspx|sh|cgi|exe|bat|cmd|html|htm|shtml|svg|xml)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>

<IfModule mod_php.c>
    php_flag engine off
</IfModule>
<IfModule mod_php7.c>
    php_flag engine off
</IfModule>
<IfModule mod_php8.c>
    php_flag engine off
</IfModule>
EOT;
            @file_put_contents($htaccessPath, $htaccessContent);
        }
    }
}
