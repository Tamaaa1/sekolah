import type { HTMLAttributes } from 'react';

export default function AppLogoIcon({ className = '', ...props }: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo.png"
            alt="Logo SMP Negeri 5 Sambas"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
