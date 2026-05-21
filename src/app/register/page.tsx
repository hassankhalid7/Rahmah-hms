'use client';

import Link from 'next/link';
import { useState } from 'react';

const translations = {
  en: {
    heading: 'Institute Registration',
    subheading: 'Who are you registering as?',
    adminTitle: 'Institute Admin / Owner',
    adminDesc:
      'I own or manage a madrasa and want to create an account for my institute',
    teacherTitle: 'Teacher',
    teacherDesc: 'I am a Quran teacher looking to join a platform or institute',
    studentTitle: 'Parent / Student',
    studentDesc: 'I am a parent or student searching for Quran classes',
    continue: 'Continue',
    backHome: '← Back to home',
    toggleLabel: 'زبان تبدیل کریں',
    toggleBackToEnglish: 'Switch to English',
  },
  ur: {
    heading: 'انسٹیٹیوٹ رجسٹریشن',
    subheading: 'آپ کس حیثیت سے رجسٹر ہو رہے ہیں؟',
    adminTitle: 'انسٹیٹیوٹ ایڈمن / اونر',
    adminDesc:
      'میں مدرسہ کا مالک یا نگران ہوں اور اپنے ادارے کا اکاؤنٹ بنانا چاہتا ہوں',
    teacherTitle: 'استاد',
    teacherDesc: 'میں قرآن کا استاد ہوں اور کسی پلیٹ فارم یا ادارے سے جڑنا چاہتا ہوں',
    studentTitle: 'والدین / طالب علم',
    studentDesc: 'میں والدین یا طالب علم ہوں اور قرآن کلاسز تلاش کر رہا ہوں',
    continue: 'آگے بڑھیں',
    backHome: '← ہوم پر واپس جائیں',
    toggleLabel: 'زبان تبدیل کریں',
    toggleBackToEnglish: 'Switch to English',
  },
} as const;

type Lang = keyof typeof translations;

export default function RegisterPage() {
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: keyof (typeof translations)['en']) => translations[lang][key];

  const roles = [
    {
      id: 'admin',
      key: 'admin' as const,
      href: '/register/admin',
      icon: (
        <svg
          className="h-10 w-10 text-[#2F6B4F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="7" width="6" height="13" rx="1.5" />
          <rect x="9.5" y="4" width="6" height="16" rx="1.5" />
          <rect x="16" y="10" width="5" height="10" rx="1.5" />
        </svg>
      ),
    },
    {
      id: 'teacher',
      key: 'teacher' as const,
      href: '/register/teacher',
      icon: (
        <svg
          className="h-10 w-10 text-[#2F6B4F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="3" />
          <path d="M6 19.5C6.8 16.5 9.1 15 12 15s5.2 1.5 6 4.5" />
          <path d="M16 7.5 18.5 10" />
          <path d="M8 7.5 5.5 10" />
        </svg>
      ),
    },
    {
      id: 'student',
      key: 'student' as const,
      href: '/register/student',
      icon: (
        <svg
          className="h-10 w-10 text-[#2F6B4F]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="7" r="2.7" />
          <circle cx="17" cy="8.5" r="2.3" />
          <path d="M4.5 18.5C5.3 15.8 7.7 14 10.5 14c1.1 0 2 .2 2.8.6" />
          <path d="M13.5 18.5c.7-2 2.3-3.2 4.2-3.2 1 0 1.8.2 2.5.6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F1E6] text-[#1c3c33]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
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
              className="rounded-full border border-[#d0d8cf] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[#1c3c33]/80 shadow-sm hover:bg-white"
            >
              {lang === 'en' ? t('toggleLabel') : t('toggleBackToEnglish')}
            </button>

            <Link
              href="/"
              className="text-sm font-semibold text-[#1c3c33]/70 hover:text-[#1c3c33]"
            >
              {t('backHome')}
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center pb-10 pt-4">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-[0_10px_28px_rgba(28,60,51,0.12)]">
              <span className="text-2xl">🕋</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#1c3c33] sm:text-4xl">
              {t('heading')}
            </h1>
            <p className="mt-3 text-base font-medium text-[#1c3c33]/60">
              {t('subheading')}
            </p>
          </div>

          <div className="grid w-full gap-6 md:grid-cols-3">
            {roles.map((role) => {
              const titleKey =
                role.key === 'admin'
                  ? 'adminTitle'
                  : role.key === 'teacher'
                    ? 'teacherTitle'
                    : 'studentTitle';
              const descKey =
                role.key === 'admin'
                  ? 'adminDesc'
                  : role.key === 'teacher'
                    ? 'teacherDesc'
                    : 'studentDesc';

              return (
                <Link
                  key={role.id}
                  href={role.href}
                  className="group flex flex-col rounded-3xl bg-white p-7 text-left shadow-[0_16px_40px_rgba(28,60,51,0.10)] ring-1 ring-transparent transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(28,60,51,0.16)] hover:ring-[#2F6B4F]/60"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F4EC] text-[#2F6B4F] shadow-[0_12px_26px_rgba(47,107,79,0.25)] group-hover:bg-[#2F6B4F] group-hover:text-white">
                    {role.icon}
                  </div>
                  <h2 className="text-lg font-extrabold text-[#1c3c33]">
                    {t(titleKey)}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#1c3c33]/65">
                    {t(descKey)}
                  </p>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#2F6B4F] group-hover:text-[#1c3c33]">
                    {t('continue')}
                    <span className="ml-1.5 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}


