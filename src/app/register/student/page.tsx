'use client';

import Link from 'next/link';
import { useState } from 'react';

const translations = {
    en: {
        heading: 'Parent / Student Registration',
        warningTitle: 'Only Institute Admins can create accounts at this time',
        warningDesc: 'We will save your information and will contact you very soon!',
        fullName: 'Full Name',
        phone: 'Phone / WhatsApp',
        email: 'Email (optional)',
        instituteName: 'Institute Name',
        instituteType: 'Institute Type (optional)',
        instituteAddress: 'Institute Address (optional)',
        message: 'Message (optional)',
        sendRequest: 'Send Request',
        back: 'Back',
        toggleLabel: 'زبان تبدیل کریں',
        toggleBackToEnglish: 'Switch to English',
        backHome: '← Back to home',
        phName: 'Ahmad Khan',
        phPhone: '+92 300 1234567',
        phInstName: 'Al-Noor Madrasa',
        phInstType: 'Select institute type',
        phAddress: 'Enter complete address',
        phMessage: 'I am looking for Quran classes for my child...',
    },
    ur: {
        heading: 'والدین / طالب علم کی رجسٹریشن',
        warningTitle: 'اس وقت صرف انسٹیٹیوٹ ایڈمن اکاؤنٹ بنا سکتے ہیں',
        warningDesc: 'ہم آپ کی معلومات محفوظ کر لیں گے اور جلد ہی آپ سے رابطہ کریں گے!',
        fullName: 'پورا نام',
        phone: 'فون / واٹس ایپ',
        email: 'ای میل (اختیاری)',
        instituteName: 'ادارے کا نام',
        instituteType: 'ادارے کی قسم (اختیاری)',
        instituteAddress: 'ادارے کا پتہ (اختیاری)',
        message: 'پیغام (اختیاری)',
        sendRequest: 'درخواست بھیجیں',
        back: 'واپس',
        toggleLabel: 'زبان تبدیل کریں',
        toggleBackToEnglish: 'Switch to English',
        backHome: '← ہوم پر واپس جائیں',
        phName: 'احمد خان',
        phPhone: '+92 300 1234567',
        phInstName: 'النیور مدرسہ',
        phInstType: 'ادارے کی قسم منتخب کریں',
        phAddress: 'مکمل پتہ درج کریں',
        phMessage: 'میں اپنے بچے کے لیے قرآن کلاسز تلاش کر رہا ہوں...',
    },
} as const;

type Lang = keyof typeof translations;

export default function StudentRegisterPage() {
    const [lang, setLang] = useState<Lang>('en');
    const t = (key: keyof (typeof translations)['en']) => translations[lang][key];
    const isRtl = lang === 'ur';

    return (
        <div className={`min-h-screen bg-[#F7F1E6] text-[#1c3c33] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10 sm:px-6 lg:px-8">
                <header className="mb-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c3c33] shadow-[0_12px_30px_rgba(28,60,51,0.10)] overflow-hidden">
                                <img src="/rahmah-logo.jpg" alt="Rahmah" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-2xl font-black italic tracking-tight text-[#2F6B4F]">
                                Rahmah
                            </div>
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={() => setLang((prev) => (prev === 'en' ? 'ur' : 'en'))}
                        className="rounded-full border border-[#d0d8cf] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[#1c3c33]/80 shadow-sm hover:bg-white"
                    >
                        {lang === 'en' ? t('toggleLabel') : t('toggleBackToEnglish')}
                    </button>
                </header>

                <main className="flex flex-1 flex-col">
                    <div className="mb-6">
                        <Link
                            href="/register"
                            className="inline-flex items-center text-sm font-semibold text-[#1c3c33]/60 transition hover:text-[#1c3c33]"
                        >
                            <span className={`text-lg ${isRtl ? 'ml-1 rotate-180' : 'mr-1'}`}>←</span> {t('back')}
                        </Link>
                        <h1 className="mt-4 text-3xl font-black tracking-tight text-[#1c3c33] sm:text-4xl">
                            {t('heading')}
                        </h1>
                    </div>

                    <div className="mb-8 rounded-2xl bg-[#F3D083]/20 border border-[#F3D083]/40 p-5 text-[#856404]">
                        <h3 className="font-bold text-[#1c3c33] mb-1">{t('warningTitle')}</h3>
                        <p className="text-sm font-medium opacity-90">{t('warningDesc')}</p>
                    </div>

                    <form className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(28,60,51,0.08)] sm:p-10">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-bold text-[#1c3c33] mb-1.5">
                                {t('fullName')}
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                className="block w-full rounded-xl border-0 bg-[#F7F1E6]/50 px-4 py-3.5 text-[#1c3c33] shadow-sm ring-1 ring-inset ring-[#d0d8cf]/60 placeholder:text-[#1c3c33]/40 focus:ring-2 focus:ring-inset focus:ring-[#2F6B4F] sm:text-sm sm:leading-6"
                                placeholder={t('phName')}
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-bold text-[#1c3c33] mb-1.5">
                                    {t('phone')}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="block w-full rounded-xl border-0 bg-[#F7F1E6]/50 px-4 py-3.5 text-[#1c3c33] shadow-sm ring-1 ring-inset ring-[#d0d8cf]/60 placeholder:text-[#1c3c33]/40 focus:ring-2 focus:ring-inset focus:ring-[#2F6B4F] sm:text-sm sm:leading-6"
                                    placeholder={t('phPhone')}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-[#1c3c33] mb-1.5">
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="block w-full rounded-xl border-0 bg-[#F7F1E6]/50 px-4 py-3.5 text-[#1c3c33] shadow-sm ring-1 ring-inset ring-[#d0d8cf]/60 placeholder:text-[#1c3c33]/40 focus:ring-2 focus:ring-inset focus:ring-[#2F6B4F] sm:text-sm sm:leading-6"
                                // placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="instituteName" className="block text-sm font-bold text-[#1c3c33] mb-1.5">
                                    {t('instituteName')}
                                </label>
                                <input
                                    type="text"
                                    id="instituteName"
                                    className="block w-full rounded-xl border-0 bg-[#F7F1E6]/50 px-4 py-3.5 text-[#1c3c33] shadow-sm ring-1 ring-inset ring-[#d0d8cf]/60 placeholder:text-[#1c3c33]/40 focus:ring-2 focus:ring-inset focus:ring-[#2F6B4F] sm:text-sm sm:leading-6"
                                    placeholder={t('phInstName')}
                                />
                            </div>

                            <div>
                                <label htmlFor="instituteType" className="block text-sm font-bold text-[#1c3c33] mb-1.5">
                                    {t('instituteType')}
                                </label>
                                <select
                                    id="instituteType"
                                    className="block w-full rounded-xl border-0 bg-[#F7F1E6]/50 px-4 py-3.5 text-[#1c3c33] shadow-sm ring-1 ring-inset ring-[#d0d8cf]/60 focus:ring-2 focus:ring-inset focus:ring-[#2F6B4F] sm:text-sm sm:leading-6"
                                >
                                    <option value="">{t('phInstType')}</option>
                                    <option value="madrasa">Madrasa</option>
                                    <option value="school">School</option>
                                    <option value="online">Online Academy</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="instituteAddress" className="block text-sm font-bold text-[#1c3c33] mb-1.5">
                                {t('instituteAddress')}
                            </label>
                            <input
                                type="text"
                                id="instituteAddress"
                                className="block w-full rounded-xl border-0 bg-[#F7F1E6]/50 px-4 py-3.5 text-[#1c3c33] shadow-sm ring-1 ring-inset ring-[#d0d8cf]/60 placeholder:text-[#1c3c33]/40 focus:ring-2 focus:ring-inset focus:ring-[#2F6B4F] sm:text-sm sm:leading-6"
                                placeholder={t('phAddress')}
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-bold text-[#1c3c33] mb-1.5">
                                {t('message')}
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                className="block w-full rounded-xl border-0 bg-[#F7F1E6]/50 px-4 py-3.5 text-[#1c3c33] shadow-sm ring-1 ring-inset ring-[#d0d8cf]/60 placeholder:text-[#1c3c33]/40 focus:ring-2 focus:ring-inset focus:ring-[#2F6B4F] sm:text-sm sm:leading-6"
                                placeholder={t('phMessage')}
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-4 flex w-full justify-center rounded-xl bg-[#2F6B4F] px-3 py-3.5 text-sm font-bold leading-6 text-white shadow-[0_10px_20px_rgba(47,107,79,0.18)] hover:bg-[#285c44] hover:shadow-[0_12px_24px_rgba(47,107,79,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F]"
                        >
                            {t('sendRequest')}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
