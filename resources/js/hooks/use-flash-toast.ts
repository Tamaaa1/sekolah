import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

interface PagePropsWithFlash {
    flash?: {
        success?: string | null;
        error?: string | null;
        info?: string | null;
    };
    [key: string]: unknown;
}

export function useFlashToast(): void {
    const { flash } = usePage<PagePropsWithFlash>().props;
    const lastFlash = useRef<string | null>(null);

    useEffect(() => {
        if (flash?.success && lastFlash.current !== `success:${flash.success}`) {
            toast.success(flash.success);
            lastFlash.current = `success:${flash.success}`;
        } else if (flash?.error && lastFlash.current !== `error:${flash.error}`) {
            toast.error(flash.error);
            lastFlash.current = `error:${flash.error}`;
        } else if (flash?.info && lastFlash.current !== `info:${flash.info}`) {
            toast.info(flash.info);
            lastFlash.current = `info:${flash.info}`;
        }
    }, [flash]);

    useEffect(() => {
        return router.on('flash', (event) => {
            const flashDetail = (event as CustomEvent).detail?.flash;
            const data = flashDetail?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            toast[data.type](data.message);
        });
    }, []);
}
