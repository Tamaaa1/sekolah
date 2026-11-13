import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type ScrollToTopProps = {
    threshold?: number;
    className?: string;
};

export default function ScrollToTop({
    threshold = 300,
    className,
}: ScrollToTopProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > threshold) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            title="Kembali ke atas"
            className={cn(
                'fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-prussian text-canvas-paper shadow-lg shadow-prussian/30 border border-white/20 transition-all duration-300 hover:bg-prussian-hover hover:scale-110 active:scale-95 group focus:outline-hidden cursor-pointer',
                visible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none',
                className
            )}
        >
            <ArrowUpIcon className="h-5 w-5 stroke-[2.5] text-canvas-paper group-hover:-translate-y-0.5 transition-transform" />
            <span className="sr-only">Kembali ke atas</span>
        </button>
    );
}
