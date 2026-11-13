import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import {
    ArrowRightIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
} from '@heroicons/react/24/outline';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Masuk ke Portal Sekolah - SMP Negeri 5 Sambas" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            {/* Email Input Field with Icon & Underline Border */}
                            <div className="space-y-1.5">
                                <div className="group flex items-center gap-3 border-b-2 border-line-strong py-2 transition-colors focus-within:border-prussian">
                                    <EnvelopeIcon className="h-5 w-5 text-ink-muted shrink-0 transition-colors group-focus-within:text-prussian" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Email"
                                        className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/70 focus:outline-hidden"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Input Field with Icon, Underline & Show Toggle */}
                            <div className="space-y-1.5">
                                <div className="group flex items-center gap-3 border-b-2 border-line-strong py-2 transition-colors focus-within:border-prussian">
                                    <LockClosedIcon className="h-5 w-5 text-ink-muted shrink-0 transition-colors group-focus-within:text-prussian" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Kata Sandi"
                                        className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted/70 focus:outline-hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="text-ink-muted hover:text-prussian focus:outline-hidden cursor-pointer p-0.5 transition-colors"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me & Forgot Password Row */}
                            <div className="flex items-center justify-between text-xs pt-0.5">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-line-strong data-[state=checked]:bg-prussian data-[state=checked]:border-prussian"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-xs text-ink-secondary cursor-pointer select-none font-normal"
                                    >
                                        Ingat saya
                                    </Label>
                                </div>

                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-xs font-medium text-prussian hover:text-prussian-hover hover:underline"
                                        tabIndex={5}
                                    >
                                        Lupa kata sandi?
                                    </TextLink>
                                )}
                            </div>

                            {/* Signature Pill Action Button (Prussian base + Terracotta accent badge) */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    tabIndex={4}
                                    data-test="login-button"
                                    className="group relative flex h-12 w-full items-center justify-center rounded-full bg-prussian hover:bg-prussian-hover active:scale-[0.99] text-white shadow-md shadow-prussian/25 transition-all disabled:opacity-60 cursor-pointer"
                                >
                                    {/* Left Terracotta circular badge with arrow */}
                                    <span className="absolute left-1.5 top-1.5 bottom-1.5 aspect-square rounded-full bg-terracotta hover:bg-terracotta-hover flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                        <ArrowRightIcon className="h-4 w-4 stroke-[2.5] text-white" />
                                    </span>

                                    {processing ? (
                                        <Spinner className="h-5 w-5 text-white" />
                                    ) : (
                                        <span className="font-bold text-sm tracking-wider uppercase pl-6">
                                            MASUK
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Help & Support note */}
                            <div className="text-center pt-2">
                                <p className="text-[11px] text-ink-muted">
                                    Kendala akun portal?{' '}
                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-prussian hover:text-terracotta hover:underline font-medium transition-colors"
                                    >
                                        Hubungi Petugas IT
                                    </a>
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 p-3 rounded-xl bg-status-published-bg border border-status-published/30 text-center text-xs font-medium text-status-published">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'SMP Negeri 5 Sambas',
    description: 'Akses Portal Sekolah',
};
