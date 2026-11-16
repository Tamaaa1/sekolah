import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import { useAppearance } from '@/hooks/use-appearance';

interface ThemeToggleProps {
    variant?: 'topbar' | 'button' | 'full';
    className?: string;
}

export default function ThemeToggle({ variant = 'topbar', className = '' }: ThemeToggleProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    if (variant === 'full') {
        return (
            <div className={`inline-flex items-center gap-1 p-0.5 rounded-lg border border-line bg-canvas-subtle/60 ${className}`}>
                <button
                    type="button"
                    onClick={() => updateAppearance('light')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                        !isDark
                            ? 'bg-surface-card text-ink shadow-2xs font-semibold'
                            : 'text-ink-secondary hover:text-ink'
                    }`}
                >
                    <SunIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Terang</span>
                </button>
                <button
                    type="button"
                    onClick={() => updateAppearance('dark')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                        isDark
                            ? 'bg-surface-card text-ink shadow-2xs font-semibold'
                            : 'text-ink-secondary hover:text-ink'
                    }`}
                >
                    <MoonIcon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Gelap</span>
                </button>
            </div>
        );
    }

    if (variant === 'button') {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex items-center justify-between w-full px-3 py-2 rounded text-sm transition-colors text-ink hover:bg-canvas-subtle ${className}`}
            >
                <span className="flex items-center gap-2">
                    {isDark ? (
                        <MoonIcon className="w-4 h-4 text-sky-400" />
                    ) : (
                        <SunIcon className="w-4 h-4 text-amber-500" />
                    )}
                    <span>Mode Tampilan: {isDark ? 'Gelap' : 'Terang'}</span>
                </span>
                <span className="text-xs text-ink-muted">Ubah</span>
            </button>
        );
    }

    // Default 'topbar' variant (sleek utility button for header bar)
    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded border border-canvas-subtle/30 text-canvas-paper hover:bg-canvas-paper hover:text-prussian transition-colors font-medium whitespace-nowrap text-[10px] sm:text-xs ${className}`}
            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            aria-label="Ganti mode tampilan"
        >
            {isDark ? (
                <>
                    <SunIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="hidden xs:inline">Mode Terang</span>
                </>
            ) : (
                <>
                    <MoonIcon className="w-3.5 h-3.5 text-canvas-subtle shrink-0" />
                    <span className="hidden xs:inline">Mode Gelap</span>
                </>
            )}
        </button>
    );
}
