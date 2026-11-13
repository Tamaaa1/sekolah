import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk ke Portal Sekolah - SMP Negeri 5 Sambas" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="admin@smpn5sambas.sch.id"
                                    className="h-10 text-sm focus:border-prussian focus:ring-prussian/20 bg-stone-50/50 dark:bg-stone-800/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-prussian hover:underline"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-10 text-sm focus:border-prussian focus:ring-prussian/20 bg-stone-50/50 dark:bg-stone-800/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-xs text-stone-600 dark:text-stone-400 cursor-pointer select-none">
                                    Ingat saya di perangkat ini
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-3 w-full h-11 bg-prussian hover:bg-prussian-hover text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <span>Masuk ke Dashboard</span>
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-xs font-medium text-emerald-800">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke Portal Sekolah',
    description: 'Masukkan email dan kata sandi Anda untuk mengakses dashboard manajemen',
};
