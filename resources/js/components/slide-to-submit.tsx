import { useState, useRef, useEffect, useCallback, type ComponentProps } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type SlideToSubmitProps = ComponentProps<'div'> & {
    processing?: boolean;
    label?: string;
    loadingLabel?: string;
    onSlideComplete?: () => void;
};

export default function SlideToSubmit({
    processing = false,
    label = 'MASUK',
    loadingLabel = 'MEMPROSES...',
    onSlideComplete,
    className,
    ...props
}: SlideToSubmitProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const startXRef = useRef(0);

    const getMaxDrag = useCallback(() => {
        if (!trackRef.current) return 200;
        const trackWidth = trackRef.current.clientWidth;
        const handleWidth = 44; // 11 in tailwind = 44px
        const padding = 4; // p-1 = 4px
        return Math.max(0, trackWidth - handleWidth - padding * 2);
    }, []);

    // When processing state changes
    useEffect(() => {
        if (processing) {
            setIsCompleted(true);
            setDragX(getMaxDrag());
        } else {
            // When processing ends (e.g. error returned), reset position
            setIsCompleted(false);
            setDragX(0);
        }
    }, [processing, getMaxDrag]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (processing || isCompleted) return;

        // Capture pointer so move events continue even outside the handle
        e.currentTarget.setPointerCapture(e.pointerId);
        startXRef.current = e.clientX - dragX;
        setIsDragging(true);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || processing || isCompleted) return;

        const max = getMaxDrag();
        const currentX = e.clientX - startXRef.current;
        const boundedX = Math.max(0, Math.min(max, currentX));

        setDragX(boundedX);

        // Auto trigger when dragged to 90%
        if (boundedX >= max * 0.9) {
            setIsDragging(false);
            setIsCompleted(true);
            setDragX(max);
            triggerSubmit();
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || processing || isCompleted) return;

        setIsDragging(false);
        const max = getMaxDrag();

        if (dragX >= max * 0.85) {
            setIsCompleted(true);
            setDragX(max);
            triggerSubmit();
        } else {
            // Snap back smoothly
            setDragX(0);
        }
    };

    const handlePointerCancel = () => {
        if (!isDragging || processing || isCompleted) return;
        setIsDragging(false);
        setDragX(0);
    };

    const triggerSubmit = () => {
        if (onSlideComplete) {
            onSlideComplete();
        }
        submitBtnRef.current?.click();
    };

    // Clicking the track also performs smooth slide & submit for convenience
    const handleTrackClick = () => {
        if (processing || isCompleted || isDragging) return;
        const max = getMaxDrag();
        setIsCompleted(true);
        setDragX(max);
        triggerSubmit();
    };

    const max = getMaxDrag();
    const progress = max > 0 ? Math.min(1, Math.max(0, dragX / max)) : 0;

    return (
        <div className={cn('relative w-full pt-1 select-none', className)} {...props}>
            {/* Hidden native submit button for form submission */}
            <button
                type="submit"
                ref={submitBtnRef}
                tabIndex={-1}
                className="sr-only"
                aria-hidden="true"
                data-test="slide-submit-button"
            />

            {/* Slide Track */}
            <div
                ref={trackRef}
                onClick={handleTrackClick}
                className={cn(
                    'relative h-13 w-full rounded-full bg-prussian p-1 overflow-hidden shadow-md shadow-prussian/25 flex items-center cursor-pointer transition-colors touch-none',
                    isDragging && 'shadow-lg shadow-prussian/35',
                    isCompleted && 'bg-prussian-hover'
                )}
            >
                {/* Active dragged trail background */}
                <div
                    className="absolute top-0 left-0 bottom-0 bg-prussian-hover/70 rounded-full pointer-events-none transition-all duration-75"
                    style={{ width: `${dragX + 48}px` }}
                />

                {/* Center Label (fades as handle slides over it) */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none text-white font-bold text-xs sm:text-sm tracking-widest uppercase transition-opacity duration-150 pl-6"
                    style={{ opacity: 1 - progress * 1.5 }}
                >
                    <span className="flex items-center gap-1.5 drop-shadow-xs">
                        <span>{label}</span>
                        <span className="text-white/50 text-xs tracking-normal">»</span>
                    </span>
                </div>

                {/* Loading state label when submitted */}
                {isCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/90 font-medium text-xs tracking-wider uppercase pl-4 animate-pulse">
                        {loadingLabel}
                    </div>
                )}

                {/* Draggable Circle Handle */}
                <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                    className={cn(
                        'relative z-10 h-11 w-11 aspect-square rounded-full bg-terracotta text-white flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing shrink-0 select-none touch-none',
                        !isDragging && 'transition-transform duration-200 ease-out',
                        (isDragging || isCompleted) && 'scale-105 shadow-lg'
                    )}
                    style={{
                        transform: `translateX(${dragX}px)`,
                    }}
                    role="slider"
                    aria-label="Geser ke kanan untuk masuk"
                    aria-valuenow={Math.round(progress * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleTrackClick();
                        } else if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            handleTrackClick();
                        }
                    }}
                >
                    {processing ? (
                        <Spinner className="h-5 w-5 text-white" />
                    ) : (
                        <ArrowRightIcon className="h-5 w-5 stroke-[2.5] text-white transition-transform group-hover:translate-x-0.5" />
                    )}
                </div>
            </div>

            {/* Subtle assistive hint for first-time users */}
            <div className="flex justify-between items-center px-2 pt-1 text-[10px] text-ink-muted/70">
                <span>Geser ke kanan untuk login</span>
                <span>atau tekan Enter</span>
            </div>
        </div>
    );
}
