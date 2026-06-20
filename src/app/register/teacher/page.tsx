'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import OrganizationSearch from '@/components/forms/OrganizationSearch';

type Organization = {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
};

export default function TeacherRegisterPage() {
    return (
        <LanguageProvider>
            <TeacherRegisterForm />
        </LanguageProvider>
    );
}

function TeacherRegisterForm() {
    const router = useRouter();
    const { t, lang } = useLanguage();
    const isUrdu = lang === 'ur';

    const [step, setStep] = useState<'account' | 'madrassa'>('account');
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        message: '',
    });

    const update = <K extends keyof typeof form>(key: K, value: string) =>
        setForm(prev => ({ ...prev, [key]: value }));

    /* ── Step 1: create account ── */
    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.firstName || !form.password || (!form.email && !form.phone)) {
            setError(t('Please fill in your name, password, and email or phone.', 'براہ کرم نام، پاس ورڈ اور ای میل یا فون درج کریں۔'));
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError(t('Passwords do not match.', 'پاس ورڈ میل نہیں کھاتے۔'));
            return;
        }
        if (form.password.length < 6) {
            setError(t('Password must be at least 6 characters.', 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔'));
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/public/register-teacher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim() || undefined,
                    phone: form.phone.trim() || undefined,
                    password: form.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');
            setStep('madrassa');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Step 2: find madrassa and log in to submit request ── */
    const handleMadrassaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedOrg) {
            setError(t('Please select a madrassa first.', 'براہ کرم پہلے مدرسہ منتخب کریں۔'));
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Auto-login to get session
            const loginRes = await fetch('/api/public/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email || form.phone, password: form.password, role: 'teacher' }),
            });
            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.message || 'Login failed after registration');

            // 2. Submit join request (session cookie is now set)
            const reqRes = await fetch('/api/teacher-join-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ organizationId: selectedOrg.id, message: form.message }),
            });
            const reqData = await reqRes.json();
            if (!reqRes.ok) throw new Error(reqData.message || 'Failed to submit join request');

            // 3. Redirect to pending page
            router.push('/teacher-pending');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F1E6] px-4 py-8 text-[#1c3c33]" dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="mx-auto max-w-xl">

                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1c3c33] overflow-hidden">
                                <img src="/rahmah-logo.jpg" alt="Rahmah" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-black text-[#2F6B4F]">Rahmah HMS</span>
                        </Link>
                    </div>
                    <Link href="/sign-in?role=teacher" className="text-xs font-semibold text-[#2F6B4F] hover:underline">
                        {t('Already have an account? Login', 'اکاؤنٹ ہے؟ لاگ ان کریں')}
                    </Link>
                </header>

                {/* Progress Steps */}
                <div className="flex items-center gap-3 mb-6">
                    {(['account', 'madrassa'] as const).map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                                step === s ? 'bg-[#2F6B4F] text-white' :
                                (step === 'madrassa' && s === 'account') ? 'bg-[#E8F5EE] text-[#2F6B4F]' :
                                'bg-[#d0d8cf] text-white'
                            }`}>{i + 1}</div>
                            <span className={`text-xs font-semibold ${step === s ? 'text-[#1c3c33]' : 'text-[#1c3c33]/40'}`}>
                                {s === 'account' ? t('Create Account', 'اکاؤنٹ بنائیں') : t('Select Madrassa', 'مدرسہ منتخب کریں')}
                            </span>
                            {i < 1 && <div className="flex-1 h-px bg-[#d0d8cf]" />}
                        </div>
                    ))}
                </div>

                <div className="rounded-3xl bg-white px-6 py-8 shadow-[0_18px_50px_rgba(28,60,51,0.12)]">
                    {/* Title */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#2F6B4F]/60 mb-1">
                            {t('Teacher Enrollment', 'ٹیچر انرولمنٹ')}
                        </p>
                        <h1 className="text-2xl font-black text-[#1c3c33]">
                            {step === 'account'
                                ? t('Create Your Account', 'اپنا اکاؤنٹ بنائیں')
                                : t('Find Your Madrassa', 'اپنا مدرسہ تلاش کریں')}
                        </h1>
                        <p className="text-sm text-[#1c3c33]/60 mt-1">
                            {step === 'account'
                                ? t('Register as a teacher. After approval, you will access the teacher dashboard.', 'بطور ٹیچر رجسٹر کریں۔ منظوری کے بعد آپ ٹیچر ڈیش بورڈ تک رسائی حاصل کریں گے۔')
                                : t('Search for your madrassa and submit a join request to the admin.', 'اپنا مدرسہ تلاش کریں اور ایڈمن کو شمولیت کی درخواست بھیجیں۔')}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* ── STEP 1: Account Form ── */}
                    {step === 'account' && (
                        <form onSubmit={handleAccountSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label={t('First Name *', 'پہلا نام *')}>
                                    <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)}
                                        placeholder={t('Ahmad', 'احمد')} className={inputCls} required />
                                </FormField>
                                <FormField label={t('Last Name', 'آخری نام')}>
                                    <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)}
                                        placeholder={t('Khan', 'خان')} className={inputCls} />
                                </FormField>
                            </div>

                            <FormField label={t('Email', 'ای میل')}>
                                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                                    placeholder="teacher@example.com" className={inputCls} />
                            </FormField>

                            <FormField label={t('Phone / WhatsApp', 'فون / واٹس ایپ')}>
                                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                                    placeholder="+92 300 1234567" className={inputCls} />
                            </FormField>
                            <p className="text-xs text-[#1c3c33]/50 -mt-2">
                                {t('At least one of email or phone is required for login.', 'لاگ ان کے لیے ای میل یا فون میں سے ایک ضروری ہے۔')}
                            </p>

                            <FormField label={t('Password *', 'پاس ورڈ *')}>
                                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                                    placeholder="••••••••" className={inputCls} required />
                            </FormField>

                            <FormField label={t('Confirm Password *', 'پاس ورڈ تصدیق کریں *')}>
                                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                                    placeholder="••••••••" className={inputCls} required />
                            </FormField>

                            <button type="submit" disabled={isSubmitting}
                                className="mt-2 w-full rounded-full bg-[#2F6B4F] py-3 text-sm font-bold text-white shadow-lg shadow-[#2F6B4F]/25 hover:bg-[#285c44] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                                {isSubmitting ? t('Creating Account…', 'اکاؤنٹ بنایا جا رہا ہے…') : t('Continue →', 'جاری رکھیں ←')}
                            </button>
                        </form>
                    )}

                    {/* ── STEP 2: Madrassa Search ── */}
                    {step === 'madrassa' && (
                        <form onSubmit={handleMadrassaSubmit} className="space-y-5">
                            <div className="rounded-2xl bg-[#E8F5EE] border border-[#2F6B4F]/15 px-4 py-3 text-sm text-[#1c3c33] font-medium flex items-center gap-2">
                                <span className="text-lg">✅</span>
                                {t('Account created! Now find your madrassa.', 'اکاؤنٹ بنا لیا گیا! اب اپنا مدرسہ تلاش کریں۔')}
                            </div>

                            <FormField label={t('Search Madrassa / Institute *', 'مدرسہ / ادارہ تلاش کریں *')}>
                                <OrganizationSearch
                                    onSelect={setSelectedOrg}
                                    selectedOrganization={selectedOrg}
                                    placeholder={t('Type name to search…', 'نام لکھ کر تلاش کریں…')}
                                />
                            </FormField>

                            <FormField label={t('Message to Admin (optional)', 'ایڈمن کے لیے پیغام (اختیاری)')}>
                                <textarea rows={3} value={form.message} onChange={e => update('message', e.target.value)}
                                    placeholder={t('I would like to join as a teacher of Hifz…', 'میں حفظ کے استاد کے طور پر شامل ہونا چاہتا ہوں…')}
                                    className={`${inputCls} resize-none`} />
                            </FormField>

                            <button type="submit" disabled={isSubmitting || !selectedOrg}
                                className="w-full rounded-full bg-[#2F6B4F] py-3 text-sm font-bold text-white shadow-lg shadow-[#2F6B4F]/25 hover:bg-[#285c44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? t('Submitting Request…', 'درخواست جمع ہو رہی ہے…') : t('Submit Join Request', 'شمولیت کی درخواست جمع کریں')}
                            </button>

                            <button type="button" onClick={() => { setStep('account'); setError(''); }}
                                className="w-full text-center text-xs font-semibold text-[#1c3c33]/50 hover:text-[#1c3c33] py-1 transition-colors">
                                ← {t('Back', 'واپس')}
                            </button>
                        </form>
                    )}
                </div>

                <p className="mt-5 text-center text-xs text-[#1c3c33]/50">
                    {t('Already registered?', 'پہلے سے رجسٹرڈ ہیں؟')}{' '}
                    <Link href="/sign-in?role=teacher" className="font-bold text-[#2F6B4F] hover:underline">
                        {t('Login here', 'یہاں لاگ ان کریں')}
                    </Link>
                </p>
            </div>
        </div>
    );
}

/* ── Helpers ── */
const inputCls = 'w-full rounded-xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm text-[#1c3c33] outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15';

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c3c33]">{label}</label>
            {children}
        </div>
    );
}
