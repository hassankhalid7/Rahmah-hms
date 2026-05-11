'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import OrganizationList from '@/components/forms/OrganizationList';
import { useLanguage } from '@/lib/language-context';

const joinRequestSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    address: z.string().min(1, 'Address is required'),
    message: z.string().optional(),
});

type JoinRequestFormValues = z.infer<typeof joinRequestSchema>;

type Organization = {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
};

export default function JoinMadrasahPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [success, setSuccess] = useState(false);
    const isUrdu = lang === 'ur';

    const { register, handleSubmit, formState: { errors } } = useForm<JoinRequestFormValues>({
        resolver: zodResolver(joinRequestSchema),
    });

    const onSubmit = async (data: JoinRequestFormValues) => {
        if (!selectedOrganization) {
            alert(t('Please select a madrasah first', 'پہلے مدرسہ منتخب کریں'));
            return;
        }

        setSubmitting(true);
        try {
            // First create/update user profile
            const userRes = await fetch('/api/auth/register-institute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    role: 'student'
                }),
            });

            if (!userRes.ok) {
                throw new Error('Failed to create user profile');
            }

            // Then create join request
            const joinRes = await fetch('/api/join-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organizationId: selectedOrganization.id,
                    message: data.message || `${t('Student Details', 'طالب علم کی تفصیلات')}:\n${t('Date of Birth', 'تاریخ پیدائش')}: ${data.dateOfBirth}\n${t('Address', 'پتہ')}: ${data.address}`
                }),
            });

            const joinData = await joinRes.json();

            if (!joinRes.ok) {
                throw new Error(joinData.message || 'Failed to send join request');
            }

            setSuccess(true);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Error sending join request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F7F1E6] p-6 md:p-8 flex items-center justify-center" dir={isUrdu ? 'rtl' : 'ltr'}>
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white p-8 rounded-3xl border border-[#1c3c33]/5 shadow-sm">
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-2xl font-bold text-[#1c3c33] mb-4">
                            {t('Request Sent Successfully!', 'درخواست کامیابی سے بھیج دی گئی!')}
                        </h1>
                        <p className="text-[#1c3c33]/70 mb-6">
                            {t('Your join request has been sent to', 'آپ کی شمولیت کی درخواست بھیج دی گئی ہے')} <strong>{selectedOrganization?.name}</strong>. {t('The admin will review and respond soon.', 'ایڈمن جلد ہی جواب دے گا۔')}
                        </p>
                        <Link
                            href="/dashboard?role=student"
                            className="inline-block px-6 py-3 bg-[#2F6B4F] text-white rounded-xl font-bold hover:bg-[#285c44] transition-colors"
                        >
                            {t('Go to Dashboard', 'ڈیش بورڈ پر جائیں')}
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
                            {t('Join a Madrasah', 'مدرسے میں شمولیت')}
                        </h1>
                        <p className="text-[#1c3c33]/60 mt-1">
                            {t('Search and request to join a madrasah', 'مدرسہ تلاش کریں اور شمولیت کی درخواست کریں')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Info Panel */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-[#1c3c33]/5 shadow-sm text-center">
                            <div className="text-4xl mb-4">🏫</div>
                            <h3 className="font-bold text-[#1c3c33] mb-2">
                                {t('How it works', 'یہ کیسے کام کرتا ہے')}
                            </h3>
                            <div className="text-sm text-[#1c3c33]/70 space-y-2 text-left">
                                <p>1. {t('Search for your madrasah', 'اپنا مدرسہ تلاش کریں')}</p>
                                <p>2. {t('Fill your details', 'اپنی تفصیلات بھریں')}</p>
                                <p>3. {t('Send join request', 'شمولیت کی درخواست بھیجیں')}</p>
                                <p>4. {t('Wait for admin approval', 'ایڈمن کی منظوری کا انتظار کریں')}</p>
                            </div>
                        </div>

                        <div className="bg-[#2F6B4F] p-8 rounded-3xl shadow-xl text-white overflow-hidden relative">
                            <div className="relative z-10">
                                <h4 className="font-bold flex items-center gap-2 mb-4">
                                    <span>💡</span> {t('Tip', 'ٹپ')}
                                </h4>
                                <p className="text-sm text-white/90 leading-relaxed">
                                    {t('Make sure to provide accurate information so the admin can easily verify and approve your request.', 'درست معلومات فراہم کریں تاکہ ایڈمن آسانی سے تصدیق کر سکے۔')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Join Form */}
                    <div className="md:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Organization Selection */}
                            <Section title={t('Select Madrasah', 'مدرسہ منتخب کریں')} icon="🏫">
                                <OrganizationList
                                    onSelect={setSelectedOrganization}
                                    selectedOrganization={selectedOrganization}
                                />
                            </Section>

                            {/* Personal Info */}
                            <Section title={t('Personal Information', 'ذاتی معلومات')} icon="👤">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField 
                                        label={t('First Name', 'پہلا نام')} 
                                        error={errors.firstName?.message} 
                                        {...register('firstName')} 
                                        placeholder={t('e.g. Abdullah', 'مثال: عبداللہ')} 
                                    />
                                    <FormField 
                                        label={t('Last Name (Optional)', 'آخری نام (اختیاری)')} 
                                        error={errors.lastName?.message} 
                                        {...register('lastName')} 
                                        placeholder={t('e.g. Qureshi', 'مثال: قریشی')} 
                                    />
                                    <FormField 
                                        label={t('Date of Birth', 'تاریخ پیدائش')} 
                                        type="date" 
                                        error={errors.dateOfBirth?.message} 
                                        {...register('dateOfBirth')} 
                                    />
                                    <FormField 
                                        label={t('Phone (Optional)', 'فون (اختیاری)')} 
                                        error={errors.phone?.message} 
                                        {...register('phone')} 
                                        placeholder={t('e.g. +92 300 1234567', 'مثال: +92 300 1234567')} 
                                    />
                                    <div className="md:col-span-2">
                                        <FormField 
                                            label={t('Email (Optional)', 'ای میل (اختیاری)')} 
                                            type="email" 
                                            error={errors.email?.message} 
                                            {...register('email')} 
                                            placeholder={t('student@example.com', 'student@example.com')} 
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormField 
                                            label={t('Address', 'پتہ')} 
                                            error={errors.address?.message} 
                                            {...register('address')} 
                                            placeholder={t('Enter complete address...', 'مکمل پتہ درج کریں...')} 
                                        />
                                    </div>
                                </div>
                            </Section>

                            {/* Message */}
                            <Section title={t('Additional Message (Optional)', 'اضافی پیغام (اختیاری)')} icon="💬">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#1c3c33]/70 uppercase tracking-widest pl-1">
                                        {t('Message to Admin', 'ایڈمن کے لیے پیغام')}
                                    </label>
                                    <textarea
                                        {...register('message')}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-[#d0d8cf] bg-white focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/20 outline-none transition-all placeholder:text-[#1c3c33]/50 text-sm resize-none"
                                        placeholder={t('Any additional information you want to share with the admin...', 'کوئی اضافی معلومات جو آپ ایڈمن کے ساتھ شیئر کرنا چاہتے ہیں...')}
                                    />
                                </div>
                            </Section>

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
                                    disabled={submitting || !selectedOrganization}
                                    className="px-8 py-3 bg-[#2F6B4F] text-white rounded-xl font-bold hover:bg-[#285c44] transition-all shadow-lg shadow-[#2F6B4F]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? t('Sending...', 'بھیجا جا رہا ہے...') : t('Send Join Request', 'شمولیت کی درخواست بھیجیں')}
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