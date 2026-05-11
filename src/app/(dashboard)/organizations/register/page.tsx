'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { useLanguage } from '@/lib/language-context';

const organizationSchema = z.object({
    name: z.string().min(1, 'Organization name is required'),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export default function RegisterOrganizationPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [organizationData, setOrganizationData] = useState<any>(null);
    const isUrdu = lang === 'ur';

    const { register, handleSubmit, formState: { errors } } = useForm<OrganizationFormValues>({
        resolver: zodResolver(organizationSchema),
    });

    const onSubmit = async (data: OrganizationFormValues) => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/organizations/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Failed to register organization');
            }

            setOrganizationData(result.organization);
            setSuccess(true);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Error registering organization. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F7F1E6] p-6 md:p-8 flex items-center justify-center" dir={isUrdu ? 'rtl' : 'ltr'}>
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white p-8 rounded-3xl border border-[#1c3c33]/5 shadow-sm">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="text-2xl font-bold text-[#1c3c33] mb-4">
                            {t('Organization Registered Successfully!', 'ادارہ کامیابی سے رجسٹر ہو گیا!')}
                        </h1>
                        <div className="bg-[#E5F4EC] p-4 rounded-xl mb-6 text-left">
                            <h3 className="font-bold text-[#2F6B4F] mb-2">
                                {t('Organization Details:', 'ادارے کی تفصیلات:')}
                            </h3>
                            <p className="text-sm text-[#1c3c33] mb-1">
                                <strong>{t('Name:', 'نام:')}</strong> {organizationData?.name}
                            </p>
                            <p className="text-sm text-[#1c3c33] mb-1">
                                <strong>{t('Address:', 'پتہ:')}</strong> {organizationData?.address}
                            </p>
                            <p className="text-sm text-[#1c3c33]">
                                <strong>{t('Phone:', 'فون:')}</strong> {organizationData?.phone}
                            </p>
                        </div>
                        <p className="text-[#1c3c33]/70 mb-6">
                            {t('You are now the admin of this organization. Students can search and request to join your madrasah.', 'آپ اب اس ادارے کے ایڈمن ہیں۔ طلبہ آپ کے مدرسے کو تلاش کر کے شمولیت کی درخواست کر سکتے ہیں۔')}
                        </p>
                        <Link
                            href="/dashboard?role=admin"
                            className="inline-block px-6 py-3 bg-[#2F6B4F] text-white rounded-xl font-bold hover:bg-[#285c44] transition-colors"
                        >
                            {t('Go to Admin Dashboard', 'ایڈمن ڈیش بورڈ پر جائیں')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F1E6] p-6 md:p-8" dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#1c3c33]/10 shadow-sm hover:bg-[#F7F1E6] transition-all group"
                    >
                        <span className="text-[#1c3c33]/60 group-hover:text-[#2F6B4F] transition-colors">←</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-[#1c3c33] tracking-tight">
                            {t('Register Your Madrasah', 'اپنا مدرسہ رجسٹر کریں')}
                        </h1>
                        <p className="text-[#1c3c33]/60 mt-1">
                            {t('Create your organization profile to start managing students', 'طلبہ کا انتظام شروع کرنے کے لیے اپنا ادارہ رجسٹر کریں')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Info Panel */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-[#1c3c33]/5 shadow-sm text-center">
                            <div className="text-4xl mb-4">🏫</div>
                            <h3 className="font-bold text-[#1c3c33] mb-2">
                                {t('Benefits', 'فوائد')}
                            </h3>
                            <div className="text-sm text-[#1c3c33]/70 space-y-2 text-left">
                                <p>• {t('Manage students digitally', 'طلبہ کا ڈیجیٹل انتظام')}</p>
                                <p>• {t('Track daily progress', 'روزانہ پیشرفت کا ریکارڈ')}</p>
                                <p>• {t('Attendance management', 'حاضری کا انتظام')}</p>
                                <p>• {t('Generate reports', 'رپورٹس بنائیں')}</p>
                                <p>• {t('Parent communication', 'والدین سے رابطہ')}</p>
                            </div>
                        </div>

                        <div className="bg-[#2F6B4F] p-8 rounded-3xl shadow-xl text-white overflow-hidden relative">
                            <div className="relative z-10">
                                <h4 className="font-bold flex items-center gap-2 mb-4">
                                    <span>📋</span> {t('Requirements', 'ضروریات')}
                                </h4>
                                <p className="text-sm text-white/90 leading-relaxed">
                                    {t('Make sure to provide accurate information. This will help students find and join your madrasah easily.', 'درست معلومات فراہم کریں۔ اس سے طلبہ آپ کے مدرسے کو آسانی سے تلاش کر سکیں گے۔')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="md:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Organization Info */}
                            <Section title={t('Organization Information', 'ادارے کی معلومات')} icon="🏢">
                                <div className="space-y-4">
                                    <FormField 
                                        label={t('Madrasah Name', 'مدرسے کا نام')} 
                                        error={errors.name?.message} 
                                        {...register('name')} 
                                        placeholder={t('e.g. Jamia Islamia Karachi', 'مثال: جامعہ اسلامیہ کراچی')} 
                                    />
                                    <FormField 
                                        label={t('Complete Address', 'مکمل پتہ')} 
                                        error={errors.address?.message} 
                                        {...register('address')} 
                                        placeholder={t('Street, Area, City, Province', 'گلی، علاقہ، شہر، صوبہ')} 
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField 
                                            label={t('Phone Number', 'فون نمبر')} 
                                            error={errors.phone?.message} 
                                            {...register('phone')} 
                                            placeholder={t('e.g. +92 21 1234567', 'مثال: +92 21 1234567')} 
                                        />
                                        <FormField 
                                            label={t('Email (Optional)', 'ای میل (اختیاری)')} 
                                            type="email" 
                                            error={errors.email?.message} 
                                            {...register('email')} 
                                            placeholder={t('info@madrasah.com', 'info@madrasah.com')} 
                                        />
                                    </div>
                                </div>
                            </Section>

                            {/* Terms */}
                            <div className="bg-[#FFF3E0] border border-[#F57C00]/20 p-6 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <h4 className="font-bold text-[#F57C00] mb-2">
                                            {t('Important Notice', 'اہم اطلاع')}
                                        </h4>
                                        <p className="text-sm text-[#F57C00]/80">
                                            {t('By registering your organization, you agree to be responsible for managing student data and maintaining accurate records. You will become the admin of this organization.', 'اپنا ادارہ رجسٹر کر کے آپ طلبہ کے ڈیٹا کی ذمہ داری اور درست ریکارڈ رکھنے پر راضی ہیں۔ آپ اس ادارے کے ایڈمن بن جائیں گے۔')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1c3c33]/10">
                                <Link
                                    href="/dashboard"
                                    className="px-8 py-3 text-sm font-bold text-[#1c3c33]/60 hover:text-[#1c3c33] transition-colors"
                                >
                                    {t('Cancel', 'منسوخ')}
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-[#2F6B4F] text-white rounded-xl font-bold hover:bg-[#285c44] transition-all shadow-lg shadow-[#2F6B4F]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? t('Registering...', 'رجسٹر ہو رہا ہے...') : t('Register Organization', 'ادارہ رجسٹر کریں')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-[#1c3c33]/5 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#1c3c33] flex items-center gap-3">
                <span className="w-10 h-10 bg-[#F7F1E6] rounded-xl flex items-center justify-center text-xl border border-[#1c3c33]/10">{icon}</span>
                {title}
            </h2>
            <div className="pt-2">{children}</div>
        </div>
    );
}

function FormField({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-[#1c3c33]/70 uppercase tracking-widest pl-1">{label}</label>
            <input
                className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-200 bg-red-50' : 'border-[#d0d8cf] bg-white'} focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/20 outline-none transition-all placeholder:text-[#1c3c33]/50 text-sm`}
                {...props}
            />
            {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
}