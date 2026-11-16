declare global {
    interface Window {
        grecaptcha?: {
            ready: (cb: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
    }
}

/**
 * Eksekusi Google reCAPTCHA v3 untuk mendapatkan token verifikasi interaksi
 *
 * @param action Nama aksi spesifik (misal: 'contact_submit', 'login', 'suggestion_submit')
 * @param siteKey Google reCAPTCHA v3 Site Key
 */
export async function executeRecaptcha(action: string, siteKey?: string): Promise<string | null> {
    if (!siteKey || typeof window === 'undefined') {
        return null;
    }

    if (!window.grecaptcha) {
        return null;
    }

    return new Promise((resolve) => {
        try {
            window.grecaptcha!.ready(async () => {
                try {
                    const token = await window.grecaptcha!.execute(siteKey, { action });
                    resolve(token);
                } catch (err) {
                    console.warn('[reCAPTCHA v3] Gagal mengeksekusi token:', err);
                    resolve(null);
                }
            });
        } catch (err) {
            console.warn('[reCAPTCHA v3] Ready error:', err);
            resolve(null);
        }
    });
}
