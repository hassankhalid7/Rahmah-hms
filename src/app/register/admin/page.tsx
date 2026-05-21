'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const translations = {
  en: {
    back: 'Back',
    sectionTag: 'Institute Registration',
    title: 'Enter Admin Email',
    subtitle: "We'll check if you already have an account",
    emailLabel: 'Email Address',
    emailPlaceholder: 'admin@madrasa.com',
    continue: 'Continue',
    checking: 'Checking…',
    toggleLabel: 'زبان تبدیل کریں',
    toggleBackToEnglish: 'Switch to English',
  },
  ur: {
    back: 'واپس',
    sectionTag: 'انسٹیٹیوٹ رجسٹریشن',
    title: 'ایڈمن ای میل درج کریں',
    subtitle: 'ہم چیک کریں گے کہ آپ کا اکاؤنٹ پہلے سے موجود ہے یا نہیں',
    emailLabel: 'ای میل ایڈریس',
    emailPlaceholder: 'admin@madrasa.com',
    continue: 'آگے بڑھیں',
    checking: 'چیک کیا جا رہا ہے…',
    toggleLabel: 'زبان تبدیل کریں',
    toggleBackToEnglish: 'Switch to English',
  },
} as const;

type Lang = keyof typeof translations;
type TKey = keyof (typeof translations)['en'];

export default function AdminEmailPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: TKey) => translations[lang][key];
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: hook into real email-check / registration flow
    await new Promise((resolve) => setTimeout(resolve, 600));

    const targetEmail = email || 'admin@madrasa.com';
    router.push(
      `/register/admin/details?email=${encodeURIComponent(targetEmail)}`
    );

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F1E6] px-4 py-10 text-[#1c3c33]">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c3c33] shadow-[0_12px_30px_rgba(28,60,51,0.10)] overflow-hidden">
              <img src="/rahmah-logo.jpg" alt="Rahmah" className="w-full h-full object-cover" />
            </div>
            <div className="text-2xl font-black italic tracking-tight text-[#2F6B4F]">
              Rahmah
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'en' ? 'ur' : 'en'))}
              className="rounded-full border border-[#d0d8cf] bg-white/60 px-4 py-1.5 text-xs font-semibold text-[#1c3c33]/80 shadow-sm hover:bg-white"
            >
              {lang === 'en' ? t('toggleLabel') : t('toggleBackToEnglish')}
            </button>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1c3c33]/70 hover:text-[#1c3c33]"
            >
              <span className="text-lg">←</span>
              {t('back')}
            </Link>
          </div>
        </header>

        <div className="rounded-3xl bg-white px-6 py-10 shadow-[0_18px_50px_rgba(28,60,51,0.12)] sm:px-10">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#DDE9DA] shadow-[0_12px_34px_rgba(28,60,51,0.16)]">
              <span className="text-3xl text-[#2F6B4F]">🕋</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#1c3c33] sm:text-4xl">
              {t('sectionTag')}
            </h1>
            <p className="mt-3 text-base text-[#1c3c33]/70">{t('title')}</p>
            <p className="mt-1 text-sm text-[#1c3c33]/55">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="admin-email"
                className="text-sm font-semibold text-[#1c3c33]"
              >
                {t('emailLabel')}
              </label>
              <input
                id="admin-email"
                type="email"
                required
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-3 text-sm text-[#1c3c33] outline-none ring-0 transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-full bg-[#2F6B4F] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(47,107,79,0.35)] transition hover:bg-[#285c44] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? t('checking') : t('continue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


