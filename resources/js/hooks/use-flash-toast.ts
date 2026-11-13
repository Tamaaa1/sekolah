import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

interface FlashData {
    success?: string | null;
    error?: string | null;
    info?: string | null;
}

export function useFlashToast(): void {
    const lastFlash = useRef<string | null>(null);

    const showFlash = (flash?: FlashData | null) => {
        if (!flash) return;
        if (flash.success && lastFlash.current !== `success:${flash.success}`) {
            toast.success(flash.success);
            lastFlash.current = `success:${flash.success}`;
        } else if (flash.error && lastFlash.current !== `error:${flash.error}`) {
            toast.error(flash.error);
            lastFlash.current = `error:${flash.error}`;
        } else if (flash.info && lastFlash.current !== `info:${flash.info}`) {
            toast.info(flash.info);
            lastFlash.current = `info:${flash.info}`;
        }
    };

    useEffect(() => {
        // Initial page load flash
        if (typeof window !== 'undefined') {
            try {
                const el = document.getElementById('app');
                if (el?.dataset?.page) {
                    const page = JSON.parse(el.dataset.page);
                    showFlash(page?.props?.flash);
                }
            } catch {
                // Ignore parse errors
            }
        }

        // Handle flash on subsequent Inertia navigations
        const removeSuccess = router.on('success', (event: any) => {
            showFlash(event?.detail?.page?.props?.flash);
        });

        // Handle custom flash events
        const removeFlash = router.on('flash', (event: any) => {
            const flashDetail = (event as CustomEvent).detail?.flash;
            const data = flashDetail?.toast as FlashToast | undefined;

            if (data?.message && data?.type) {
                toast[data.type](data.message);
            }
        });

        return () => {
            removeSuccess();
            removeFlash();
        };
    }, []);
}
