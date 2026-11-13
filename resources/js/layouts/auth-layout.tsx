import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type AuthLayoutProps = {
    title?: string;
    description?: string;
    children: React.ReactNode;
};

export default function AuthLayout({
    title = 'SMP Negeri 5 Sambas',
    description = 'Akses Portal Sekolah',
    children,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-canvas-paper text-ink flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-prussian-light selection:text-prussian relative">
            {/* Top Bar Navigation (matching website theme) */}
            <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pb-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-ink-secondary hover:text-prussian px-3.5 py-2 rounded-lg border border-line bg-white shadow-xs hover:border-line-strong transition-colors"
                >
                    <ArrowLeftIcon className="w-3.5 h-3.5" />
                    <span>Kembali ke Beranda</span>
                </Link>

                <div className="flex items-center gap-2 text-xs font-mono text-ink-muted font-medium bg-white px-3 py-1.5 rounded-lg border border-line shadow-xs">
                    <span>NPSN: 30100301</span>
                    <span className="text-line-strong">•</span>
                    <span className="text-prussian font-semibold">Akreditasi A</span>
                </div>
            </header>

            {/* Main Split Card Container */}
            <main className="relative z-10 flex-1 flex items-center justify-center my-auto py-2">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-stone-300/40 border border-line overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                    {/* Left Column: Modern Illustration with Top-Left Corner Curve Accent */}
                    <div className="md:col-span-6 lg:col-span-7 bg-[#F4F7F6] p-4 sm:p-6 md:p-8 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-line h-64 sm:h-80 md:h-auto min-h-[280px] md:min-h-[460px]">
                        {/* Organic Green Curve anchored at Top-Left Corner of Card */}
                        <div className="absolute top-0 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 pointer-events-none z-0">
                            <svg
                                viewBox="0 0 380 380"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                            >
                                <defs>
                                    <linearGradient id="cornerGreen" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#1B4D3E" />
                                        <stop offset="55%" stopColor="#163038" />
                                        <stop offset="100%" stopColor="#0F2228" />
                                    </linearGradient>
                                    <linearGradient id="cornerAccent" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#B83B2A" />
                                        <stop offset="100%" stopColor="#8E2A1C" />
                                    </linearGradient>
                                </defs>

                                {/* Main Green/Prussian Curve at Top-Left Corner */}
                                <path
                                    d="M 0 0 L 350 0 C 320 130, 230 250, 130 300 C 65 330, 20 345, 0 355 Z"
                                    fill="url(#cornerGreen)"
                                />

                                {/* Subtle Terracotta Edge Accent Ribbon */}
                                <path
                                    d="M 290 0 C 270 110, 200 215, 110 260 C 55 285, 20 295, 0 305 L 0 318 C 20 308, 60 295, 120 270 C 215 225, 285 120, 310 0 Z"
                                    fill="url(#cornerAccent)"
                                    opacity="0.85"
                                />
                            </svg>
                        </div>

                        {/* High-Fidelity Vector Illustration (Clean background behind the person object) */}
                        <svg
                            viewBox="0 0 520 460"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full max-h-[380px] object-contain drop-shadow-sm select-none relative z-10"
                        >
                            <defs>
                                <linearGradient id="deskWood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7E5F55" />
                                    <stop offset="100%" stopColor="#553A32" />
                                </linearGradient>
                            </defs>

                            {/* Floor Ground Shadow */}
                            <ellipse cx="260" cy="425" rx="190" ry="14" fill="#CBD5D2" opacity="0.6" />

                            {/* POTTED PLANT LEFT (School Forest Green) */}
                            <g id="plant-left">
                                <polygon points="65,370 105,370 98,420 72,420" fill="#163038" />
                                <ellipse cx="85" cy="370" rx="20" ry="5" fill="#254A54" />
                                <path d="M 85 370 C 60 330, 40 270, 55 240 C 75 270, 85 330, 85 370 Z" fill="#2E6B4D" />
                                <path d="M 85 370 C 45 350, 25 310, 35 285 C 55 300, 75 340, 85 370 Z" fill="#234E38" />
                                <path d="M 85 370 C 85 320, 75 250, 95 220 C 105 250, 100 320, 85 370 Z" fill="#1C3F2E" />
                                <path d="M 85 370 C 105 340, 130 290, 120 260 C 105 285, 95 330, 85 370 Z" fill="#3D7E5F" />
                                <path d="M 85 370 C 115 360, 135 330, 125 305 C 110 325, 95 350, 85 370 Z" fill="#4E9975" />
                            </g>

                            {/* OFFICE CHAIR */}
                            <g id="office-chair">
                                <rect x="180" y="230" width="48" height="100" rx="14" fill="#16252B" transform="rotate(-6 180 230)" />
                                <rect x="205" y="340" width="10" height="60" fill="#8C9CA0" />
                                <polygon points="175,395 245,395 240,405 180,405" fill="#5A6D73" />
                                <circle cx="178" cy="405" r="4" fill="#20333A" />
                                <circle cx="242" cy="405" r="4" fill="#20333A" />
                            </g>

                            {/* EDUCATOR / WORKER PERSON */}
                            <g id="person">
                                {/* Pants (Prussian ink trousers) */}
                                <path d="M 220 340 L 255 355 L 260 415 L 235 415 L 230 365 L 205 355 Z" fill="#163038" />
                                <path d="M 235 345 L 285 360 L 280 415 L 260 415 L 265 370 Z" fill="#1D404A" />
                                <ellipse cx="245" cy="416" rx="14" ry="5" fill="#0F2228" />
                                <ellipse cx="270" cy="416" rx="14" ry="5" fill="#0F2228" />

                                {/* White Shirt Torso */}
                                <path d="M 205 245 L 245 245 L 255 345 L 210 345 Z" fill="#FFFFFF" stroke="#E2DFD7" strokeWidth="2" />
                                {/* Terracotta Necktie (School Theme) */}
                                <polygon points="228,245 233,245 236,310 231,316 226,310" fill="#B83B2A" />
                                <polygon points="222,242 228,252 233,242" fill="#F8FAFC" stroke="#E2DFD7" strokeWidth="1" />
                                <polygon points="239,242 233,252 228,242" fill="#F8FAFC" stroke="#E2DFD7" strokeWidth="1" />

                                {/* Left Arm holding Terracotta Mug */}
                                <path d="M 215 255 L 232 295 L 245 295" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="248" cy="295" r="6" fill="#FCD34D" />
                                <rect x="246" y="286" width="14" height="15" rx="3" fill="#B83B2A" />
                                <path d="M 260 289 C 265 289, 265 297, 260 297" fill="none" stroke="#B83B2A" strokeWidth="2" />

                                {/* Right Arm extended to computer */}
                                <path d="M 240 255 L 285 280 L 320 282" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="324" cy="282" r="6" fill="#FCD34D" />

                                {/* Neck & Head */}
                                <rect x="225" y="230" width="10" height="16" fill="#FCD34D" />
                                <ellipse cx="232" cy="220" rx="14" ry="16" fill="#FCD34D" />
                                <path d="M 218 220 C 218 200, 246 200, 246 215 C 246 220, 242 225, 240 220 C 235 210, 225 210, 220 222 Z" fill="#181816" />
                            </g>

                            {/* OFFICE DESK & COMPUTER */}
                            <g id="desk-and-computer">
                                <rect x="240" y="280" width="165" height="12" rx="3" fill="url(#deskWood)" />
                                <rect x="250" y="292" width="8" height="125" fill="#4B5E63" />
                                <rect x="385" y="292" width="8" height="125" fill="#4B5E63" />
                                <rect x="330" y="292" width="60" height="75" rx="4" fill="#553A32" />
                                <line x1="335" y1="316" x2="385" y2="316" stroke="#3D2923" strokeWidth="2" />
                                <line x1="335" y1="341" x2="385" y2="341" stroke="#3D2923" strokeWidth="2" />
                                <circle cx="360" cy="304" r="2.5" fill="#D7CCC8" />
                                <circle cx="360" cy="328" r="2.5" fill="#D7CCC8" />
                                <circle cx="360" cy="353" r="2.5" fill="#D7CCC8" />

                                <rect x="290" y="200" width="75" height="52" rx="4" fill="#163038" />
                                <rect x="294" y="204" width="67" height="44" rx="2" fill="#0F2228" />
                                <path d="M 300 235 L 315 220 L 330 230 L 345 215 L 355 225" fill="none" stroke="#B83B2A" strokeWidth="2" />
                                <rect x="323" y="252" width="9" height="24" fill="#254A54" />
                                <polygon points="314,276 341,276 345,280 310,280" fill="#163038" />
                                <polygon points="275,280 315,280 318,284 272,284" fill="#254A54" />
                            </g>

                            {/* POTTED PLANT RIGHT */}
                            <g id="plant-right">
                                <polygon points="410,380 435,380 430,420 415,420" fill="#163038" />
                                <path d="M 422 380 C 405 340, 400 290, 420 260 C 430 290, 430 350, 422 380 Z" fill="#2E6B4D" />
                                <path d="M 422 380 C 435 350, 455 310, 445 285 C 435 310, 425 350, 422 380 Z" fill="#234E38" />
                            </g>
                        </svg>
                    </div>

                    {/* Right Column: Centered Form */}
                    <div className="md:col-span-6 lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                        {/* Brand Logo & Title (matching website typography) */}
                        <div className="flex items-center gap-3.5 mb-7">
                            <Link href="/" className="group shrink-0">
                                <img
                                    src="/images/logo.png"
                                    alt="SMP Negeri 5 Sambas"
                                    className="w-12 h-12 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                                />
                            </Link>
                            <div className="text-left">
                                <h1 className="font-serif text-xl sm:text-2xl font-bold text-ink tracking-tight leading-tight">
                                    {title}
                                </h1>
                                <p className="text-xs text-ink-muted font-medium tracking-wide mt-0.5">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Form Content */}
                        {children}
                    </div>
                </div>
            </main>

            {/* Bottom Copyright */}
            <footer className="relative z-10 max-w-5xl w-full mx-auto text-center text-xs text-ink-muted pt-4">
                © {new Date().getFullYear()} SMP Negeri 5 Sambas. Hak Cipta Dilindungi Undang-Undang.
            </footer>
        </div>
    );
}
