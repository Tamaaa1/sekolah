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
        <div className="min-h-screen bg-[#1E232A] text-stone-900 flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-prussian-light selection:text-prussian relative">
            {/* Top Bar Navigation */}
            <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pb-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-white px-3.5 py-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xs transition-colors"
                >
                    <ArrowLeftIcon className="w-3.5 h-3.5" />
                    <span>Kembali ke Beranda</span>
                </Link>

                <div className="flex items-center gap-2 text-xs font-mono text-stone-400 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span>NPSN: 20109876</span>
                    <span className="text-stone-600">•</span>
                    <span>Akreditasi A</span>
                </div>
            </header>

            {/* Main Split Card Container */}
            <main className="relative z-10 flex-1 flex items-center justify-center my-auto py-2">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                    {/* Left Column: Modern Illustration with Blue Wave Blob */}
                    <div className="md:col-span-6 lg:col-span-7 bg-[#F4F8FD] p-4 sm:p-6 md:p-8 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-stone-100 h-64 sm:h-80 md:h-auto min-h-[260px] md:min-h-[460px]">
                        {/* High-Fidelity Vector Illustration */}
                        <svg
                            viewBox="0 0 520 460"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full max-h-[380px] object-contain drop-shadow-sm select-none"
                        >
                            <defs>
                                <linearGradient id="waveBlob" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#0284C7" />
                                    <stop offset="45%" stopColor="#0265D6" />
                                    <stop offset="100%" stopColor="#0F2C59" />
                                </linearGradient>
                                <linearGradient id="deskWood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8D6E63" />
                                    <stop offset="100%" stopColor="#5D4037" />
                                </linearGradient>
                            </defs>

                            {/* Big Organic Blue Backdrop Blob */}
                            <path
                                d="M 160 40 C 290 -15, 420 35, 450 160 C 480 280, 410 400, 270 425 C 130 450, 45 345, 45 220 C 45 95, 80 70, 160 40 Z"
                                fill="url(#waveBlob)"
                            />

                            {/* Secondary Soft Cyan Wave Accent */}
                            <path
                                d="M 390 230 C 445 270, 470 340, 440 395 C 410 450, 320 440, 305 405 Z"
                                fill="#38BDF8"
                                opacity="0.65"
                            />

                            {/* Floor Ground Shadow */}
                            <ellipse cx="260" cy="425" rx="190" ry="14" fill="#CBD5E1" opacity="0.5" />

                            {/* POTTED PLANT LEFT */}
                            <g id="plant-left">
                                <polygon points="65,370 105,370 98,420 72,420" fill="#334155" />
                                <ellipse cx="85" cy="370" rx="20" ry="5" fill="#475569" />
                                <path d="M 85 370 C 60 330, 40 270, 55 240 C 75 270, 85 330, 85 370 Z" fill="#22C55E" />
                                <path d="M 85 370 C 45 350, 25 310, 35 285 C 55 300, 75 340, 85 370 Z" fill="#16A34A" />
                                <path d="M 85 370 C 85 320, 75 250, 95 220 C 105 250, 100 320, 85 370 Z" fill="#15803D" />
                                <path d="M 85 370 C 105 340, 130 290, 120 260 C 105 285, 95 330, 85 370 Z" fill="#22C55E" />
                                <path d="M 85 370 C 115 360, 135 330, 125 305 C 110 325, 95 350, 85 370 Z" fill="#4ADE80" />
                            </g>

                            {/* OFFICE CHAIR */}
                            <g id="office-chair">
                                <rect x="180" y="230" width="48" height="100" rx="14" fill="#1E293B" transform="rotate(-6 180 230)" />
                                <rect x="205" y="340" width="10" height="60" fill="#94A3B8" />
                                <polygon points="175,395 245,395 240,405 180,405" fill="#64748B" />
                                <circle cx="178" cy="405" r="4" fill="#334155" />
                                <circle cx="242" cy="405" r="4" fill="#334155" />
                            </g>

                            {/* EDUCATOR / WORKER PERSON */}
                            <g id="person">
                                {/* Pants (Blue trousers) */}
                                <path d="M 220 340 L 255 355 L 260 415 L 235 415 L 230 365 L 205 355 Z" fill="#1D4ED8" />
                                <path d="M 235 345 L 285 360 L 280 415 L 260 415 L 265 370 Z" fill="#2563EB" />
                                <ellipse cx="245" cy="416" rx="14" ry="5" fill="#1E293B" />
                                <ellipse cx="270" cy="416" rx="14" ry="5" fill="#1E293B" />

                                {/* White Shirt Torso */}
                                <path d="M 205 245 L 245 245 L 255 345 L 210 345 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                                {/* Green Necktie */}
                                <polygon points="228,245 233,245 236,310 231,316 226,310" fill="#10B981" />
                                <polygon points="222,242 228,252 233,242" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
                                <polygon points="239,242 233,252 228,242" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />

                                {/* Left Arm holding red mug */}
                                <path d="M 215 255 L 232 295 L 245 295" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="248" cy="295" r="6" fill="#FCD34D" />
                                <rect x="246" y="286" width="14" height="15" rx="3" fill="#EF4444" />
                                <path d="M 260 289 C 265 289, 265 297, 260 297" fill="none" stroke="#EF4444" strokeWidth="2" />

                                {/* Right Arm extended to computer */}
                                <path d="M 240 255 L 285 280 L 320 282" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="324" cy="282" r="6" fill="#FCD34D" />

                                {/* Neck & Head */}
                                <rect x="225" y="230" width="10" height="16" fill="#FCD34D" />
                                <ellipse cx="232" cy="220" rx="14" ry="16" fill="#FCD34D" />
                                <path d="M 218 220 C 218 200, 246 200, 246 215 C 246 220, 242 225, 240 220 C 235 210, 225 210, 220 222 Z" fill="#0F172A" />
                            </g>

                            {/* OFFICE DESK & COMPUTER */}
                            <g id="desk-and-computer">
                                <rect x="240" y="280" width="165" height="12" rx="3" fill="url(#deskWood)" />
                                <rect x="250" y="292" width="8" height="125" fill="#475569" />
                                <rect x="385" y="292" width="8" height="125" fill="#475569" />
                                <rect x="330" y="292" width="60" height="75" rx="4" fill="#5D4037" />
                                <line x1="335" y1="316" x2="385" y2="316" stroke="#3E2723" strokeWidth="2" />
                                <line x1="335" y1="341" x2="385" y2="341" stroke="#3E2723" strokeWidth="2" />
                                <circle cx="360" cy="304" r="2.5" fill="#D7CCC8" />
                                <circle cx="360" cy="328" r="2.5" fill="#D7CCC8" />
                                <circle cx="360" cy="353" r="2.5" fill="#D7CCC8" />

                                <rect x="290" y="200" width="75" height="52" rx="4" fill="#0F172A" />
                                <rect x="294" y="204" width="67" height="44" rx="2" fill="#1E293B" />
                                <path d="M 300 235 L 315 220 L 330 230 L 345 215 L 355 225" fill="none" stroke="#38BDF8" strokeWidth="2" />
                                <rect x="323" y="252" width="9" height="24" fill="#334155" />
                                <polygon points="314,276 341,276 345,280 310,280" fill="#1E293B" />
                                <polygon points="275,280 315,280 318,284 272,284" fill="#334155" />
                            </g>

                            {/* POTTED PLANT RIGHT */}
                            <g id="plant-right">
                                <polygon points="410,380 435,380 430,420 415,420" fill="#334155" />
                                <path d="M 422 380 C 405 340, 400 290, 420 260 C 430 290, 430 350, 422 380 Z" fill="#10B981" />
                                <path d="M 422 380 C 435 350, 455 310, 445 285 C 435 310, 425 350, 422 380 Z" fill="#059669" />
                            </g>
                        </svg>
                    </div>

                    {/* Right Column: Centered Form */}
                    <div className="md:col-span-6 lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                        {/* Brand Logo & Title (matching reference mockup layout) */}
                        <div className="flex items-center gap-3.5 mb-7">
                            <Link href="/" className="group shrink-0">
                                <img
                                    src="/images/logo.png"
                                    alt="SMP Negeri 5 Sambas"
                                    className="w-12 h-12 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                                />
                            </Link>
                            <div className="text-left">
                                <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-tight">
                                    {title}
                                </h1>
                                <p className="text-xs text-stone-500 font-medium tracking-wide mt-0.5">
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
            <footer className="relative z-10 max-w-5xl w-full mx-auto text-center text-xs text-stone-400 pt-4">
                © {new Date().getFullYear()} SMP Negeri 5 Sambas. Hak Cipta Dilindungi Undang-Undang.
            </footer>
        </div>
    );
}
