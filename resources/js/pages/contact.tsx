import { useState, FormEvent } from 'react';
import { router, usePage } from '@inertiajs/react';
import { executeRecaptcha } from '@/lib/recaptcha';
import PublicLayout from '@/layouts/public-layout';
import SeoHead from '@/components/seo-head';
import { toast } from 'sonner';
import {
    BuildingOffice2Icon,
    ChatBubbleBottomCenterTextIcon,
    CheckCircleIcon,
    ClockIcon,
    EnvelopeIcon,
    MapPinIcon,
    PaperAirplaneIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline';

interface ContactProps {
    settings: Record<string, any>;
    primaryMenu: any;
}

const SUBJECT_PRESETS = [
    'Pertanyaan Umum & Informasi Sekolah',
    'Penerimaan Peserta Didik Baru (PPDB)',
    'Layanan Administrasi & Surat Keterangan',
    'Saran, Masukan & Aspirasi Publik',
    'Undangan Kerjasama & Kemitraan',
];

export default function Contact({ settings, primaryMenu }: ContactProps) {
    const schoolName = settings?.school_name || 'SMP Negeri 5 Sambas';
    const address = settings?.address || 'Jl. Raya Semberang, Kec. Sambas, Kab. Sambas, Prov. Kalimantan Barat';
    const email = settings?.email || 'humas@smpn5sambas.sch.id';
    const phone = settings?.phone || '(021) 7890-1234';
    const whatsapp = settings?.whatsapp || '0812-3456-7890';

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: SUBJECT_PRESETS[0],
        message: '',
        honeypot: '', // anti-bot spam
    });
    const [submitting, setSubmitting] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);

    const page = usePage<{ errors: Record<string, string>; recaptchaSiteKey?: string }>();
    const errors = page.props.errors || {};

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Bot trap
        if (form.honeypot) {
            return;
        }

        setSubmitting(true);

        const recaptchaSiteKey = page.props.recaptchaSiteKey;
        const recaptchaToken = await executeRecaptcha('contact_submit', recaptchaSiteKey);

        router.post(
            '/kontak',
            {
                name: form.name,
                email: form.email,
                phone: form.phone,
                subject: form.subject,
                message: form.message,
                recaptcha_token: recaptchaToken,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSentSuccess(true);
                    setForm({
                        name: '',
                        email: '',
                        phone: '',
                        subject: SUBJECT_PRESETS[0],
                        message: '',
                        honeypot: '',
                    });
                    toast.success('Pesan Anda berhasil terkirim. Tim Humas kami akan segera menghubungi Anda.');
                },
                onError: () => {
                    toast.error('Mohon periksa kembali isian formulir Anda.');
                },
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <PublicLayout settings={settings} primaryMenu={primaryMenu}>
            <SeoHead
                title={`Hubungi Kami & Layanan Aspirasi - ${schoolName}`}
                description={`Hubungi pihak sekolah ${schoolName} melalui telepon, WhatsApp, email, atau kirimkan formulir pesan dan aspirasi langsung.`}
                keywords={`kontak ${schoolName}, telepon smpn 5 sambas, alamat smpn 5 sambas, email humas smpn 5 sambas`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                {/* Header Banner */}
                <div className="border-b border-line pb-8 mb-10">
                    <span className="text-xs font-mono uppercase tracking-wider text-prussian font-semibold">
                        Layanan Komunikasi & Pengaduan
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink mt-2">
                        Hubungi Kami
                    </h1>
                    <p className="text-ink-secondary text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
                        Kami siap melayani kebutuhan informasi, pertanyaan seputar akademik, penerimaan siswa baru, maupun saran dan masukan membangun demi kemajuan pendidikan sekolah.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Contact Cards & Map (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Office Address Card */}
                        <div className="bg-white rounded-2xl border border-line p-6 shadow-xs">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-prussian-light text-prussian shrink-0">
                                    <MapPinIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-ink">Alamat Sekolah</h3>
                                    <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
                                        {address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Phone & WhatsApp Card */}
                        <div className="bg-white rounded-2xl border border-line p-6 shadow-xs">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                                    <PhoneIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-serif font-bold text-lg text-ink">Saluran Telepon & WA</h3>
                                    <div className="mt-2 space-y-1.5 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-ink-secondary">Telepon Kantor:</span>
                                            <a href={`tel:${phone}`} className="font-mono font-medium text-ink hover:text-prussian">
                                                {phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-ink-secondary">WhatsApp Resmi:</span>
                                            <a
                                                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-mono font-bold text-emerald-600 hover:text-emerald-700"
                                            >
                                                {whatsapp}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white rounded-2xl border border-line p-6 shadow-xs">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-prussian-light text-prussian shrink-0">
                                    <EnvelopeIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-ink">Surat Elektronik (Email)</h3>
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-sm font-mono text-ink-secondary hover:text-prussian mt-1 block"
                                    >
                                        {email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Operational Hours */}
                        <div className="bg-white rounded-2xl border border-line p-6 shadow-xs">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                                    <ClockIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-ink">Jam Operasional Pelayanan</h3>
                                    <div className="mt-2 text-xs text-ink-secondary space-y-1">
                                        <p><span className="font-semibold text-ink">Senin – Kamis:</span> 07.00 – 14.30 WIB</p>
                                        <p><span className="font-semibold text-ink">Jumat:</span> 07.00 – 11.30 WIB</p>
                                        <p><span className="font-semibold text-ink">Sabtu:</span> 07.00 – 12.00 WIB (Kegiatan Ekstrakurikuler)</p>
                                        <p><span className="font-semibold text-ink">Minggu & Hari Libur Nasional:</span> Tutup</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Google Maps */}
                        <div className="rounded-2xl border border-line overflow-hidden shadow-xs bg-white">
                            <div className="p-3 bg-neutral-50 border-b border-line text-xs font-semibold text-ink flex items-center justify-between">
                                <span>Peta Lokasi SMP Negeri 5 Sambas</span>
                                <a
                                    href="https://maps.google.com/?q=1.3881886,109.3615345"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-prussian hover:underline"
                                >
                                    Buka di Google Maps ↗
                                </a>
                            </div>
                            <iframe
                                title="Peta Lokasi SMP Negeri 5 Sambas"
                                src="https://maps.google.com/maps?q=1.3881886,109.3615345&hl=id&z=17&t=k&output=embed"
                                className="w-full h-52 border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* Right Column: Contact Message Form (7 Cols) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl border border-line p-6 sm:p-10 shadow-xs">
                            <div className="flex items-center gap-2 text-prussian text-xs font-mono uppercase tracking-wider font-semibold">
                                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                                <span>Kirim Pesan / Buku Tamu Digital</span>
                            </div>

                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-2">
                                Sampaikan Pesan & Aspirasi Anda
                            </h2>
                            <p className="text-ink-secondary text-sm mt-1 leading-relaxed">
                                Silakan lengkapi formulir di bawah ini. Pesan Anda akan langsung diteruskan ke tim Humas dan Tata Usaha sekolah.
                            </p>

                            {sentSuccess && (
                                <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
                                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Pesan Berhasil Terkirim!</p>
                                        <p className="text-xs text-emerald-700 mt-0.5">
                                            Terima kasih atas pesan dan partisipasi Anda. Kami akan menindaklanjutinya dalam 1x24 jam kerja.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                {/* Anti-bot Honeypot (hidden) */}
                                <input
                                    type="text"
                                    name="website"
                                    value={form.honeypot}
                                    onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                                    className="hidden"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="contact-name" className="block text-xs font-semibold text-ink uppercase tracking-wider">
                                            Nama Lengkap <span className="text-ink-muted text-[11px] font-normal lowercase">(opsional / anonim)</span>
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            placeholder="Kosongkan jika ingin anonim"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-prussian focus:outline-none focus:ring-1 focus:ring-prussian transition shadow-2xs"
                                        />
                                        {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="contact-email" className="block text-xs font-semibold text-ink uppercase tracking-wider">
                                            Alamat Email <span className="text-ink-muted text-[11px] font-normal lowercase">(opsional)</span>
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            placeholder="nama@email.com (opsional)"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-prussian focus:outline-none focus:ring-1 focus:ring-prussian transition shadow-2xs"
                                        />
                                        {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="contact-phone" className="block text-xs font-semibold text-ink uppercase tracking-wider">
                                            Nomor Telepon / WhatsApp
                                        </label>
                                        <input
                                            id="contact-phone"
                                            type="tel"
                                            placeholder="Contoh: 0812-3456-7890"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-prussian focus:outline-none focus:ring-1 focus:ring-prussian transition shadow-2xs"
                                        />
                                        {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="contact-subject" className="block text-xs font-semibold text-ink uppercase tracking-wider">
                                            Subjek / Keperluan *
                                        </label>
                                        <select
                                            id="contact-subject"
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-prussian focus:outline-none focus:ring-1 focus:ring-prussian transition shadow-2xs"
                                        >
                                            {SUBJECT_PRESETS.map((subj) => (
                                                <option key={subj} value={subj}>
                                                    {subj}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.subject && <p className="text-xs text-rose-600 mt-1">{errors.subject}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="contact-message" className="block text-xs font-semibold text-ink uppercase tracking-wider">
                                        Isi Pesan / Uraian Saran *
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        rows={5}
                                        required
                                        placeholder="Tuliskan pertanyaan, saran, kritik, atau informasi yang ingin Anda sampaikan secara jelas..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-prussian focus:outline-none focus:ring-1 focus:ring-prussian transition shadow-2xs"
                                    />
                                    {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-prussian hover:bg-prussian-dark text-white font-semibold text-sm shadow-xs transition duration-200 disabled:opacity-50"
                                    >
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        <span>{submitting ? 'Sedang Mengirim...' : 'Kirim Pesan Sekarang'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
