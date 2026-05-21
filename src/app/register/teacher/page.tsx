'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OrganizationSearch from '@/components/forms/OrganizationSearch';
import { LanguageProvider } from '@/lib/language-context';

type Organization = {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
};

const translations = {
  en: {
    toggleLabel: 'زبان تبدیل کریں',
    toggleBackToEnglish: 'Switch to English',
    back: 'Back',
    sectionTag: 'Institute Registration',
    mainTitle: 'Teacher Registration',
    subtitleLine1: 'Only Institute Admins can create accounts at this time',
    subtitleLine2:
      'We will save your information and will contact you very soon!',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Ahmad Khan',
    phoneLabel: 'Phone / WhatsApp',
    phonePlaceholder: '+92 300 1234567',
    emailLabel: 'Email (optional)',
    emailPlaceholder: 'you@example.com',
    instituteNameLabel: 'Institute Name',
    instituteNamePlaceholder: 'Al-Noor Madrasa',
    instituteTypeLabel: 'Institute Type (optional)',
    instituteTypePlaceholder: 'Select institute type',
    optionMadrasa: 'Madrasa',
    optionTraditionalMadrasa: 'Traditional Madrasa',
    optionSchool: 'School',
    optionMasjid: 'Masjid',
    optionOther: 'Other',
    addressLabel: 'Institute Address (optional)',
    addressPlaceholder: 'Enter complete address',
    messageLabel: 'Message (optional)',
    messagePlaceholder: 'I want to join as a teacher...',
    sendRequest: 'Send Request',
    requiredAlert: 'Please fill in your name and phone/WhatsApp.',
    successAlert: 'Demo: Your request has been sent. We will contact you soon, in shaa Allah.',
  },
  ur: {
    toggleLabel: 'زبان تبدیل کریں',
    toggleBackToEnglish: 'Switch to English',
    back: 'واپس',
    sectionTag: 'انسٹیٹیوٹ رجسٹریشن',
    mainTitle: 'ٹیچر رجسٹریشن',
    subtitleLine1: 'فی الحال صرف انسٹیٹیوٹ ایڈمن ہی اکاؤنٹس بنا سکتے ہیں',
    subtitleLine2:
      'ہم آپ کی معلومات محفوظ کر لیں گے اور بہت جلد آپ سے رابطہ کریں گے!',
    fullNameLabel: 'پورا نام',
    fullNamePlaceholder: 'احمد خان',
    phoneLabel: 'فون / واٹس ایپ',
    phonePlaceholder: '+92 300 1234567',
    emailLabel: 'ای میل (اختیاری)',
    emailPlaceholder: 'you@example.com',
    instituteNameLabel: 'ادارے کا نام',
    instituteNamePlaceholder: 'النور مدرسہ',
    instituteTypeLabel: 'ادارے کی قسم (اختیاری)',
    instituteTypePlaceholder: 'ادارے کی قسم منتخب کریں',
    optionMadrasa: 'مدرسہ',
    optionTraditionalMadrasa: 'روایتی مدرسہ',
    optionSchool: 'اسکول',
    optionMasjid: 'مسجد',
    optionOther: 'دیگر',
    addressLabel: 'ادارے کا پتہ (اختیاری)',
    addressPlaceholder: 'مکمل پتہ درج کریں',
    messageLabel: 'پیغام (اختیاری)',
    messagePlaceholder: 'میں بطور ٹیچر جوائن کرنا چاہتا ہوں...',
    sendRequest: 'ریکویسٹ بھیجیں',
    requiredAlert: 'براہ کرم اپنا نام اور فون / واٹس ایپ نمبر درج کریں۔',
    successAlert:
      'ڈیمو: آپ کی ریکویسٹ موصول ہو گئی ہے، بہت جلد آپ سے رابطہ کیا جائے گا، ان شاء اللہ۔',
  },
} as const;

type Lang = keyof typeof translations;
type TKey = keyof (typeof translations)['en'];

export default function TeacherRegisterPage() {
    return (
        <LanguageProvider>
            <TeacherRegisterForm />
        </LanguageProvider>
    );
}

function TeacherRegisterForm() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const t = (key: TKey) => translations[lang][key];

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    instituteType: '',
    address: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName || !form.phone) {
      alert(t('requiredAlert'));
      return;
    }

    setIsSubmitting(true);

    // TODO: send to backend for teacher-interest requests
    await new Promise((resolve) => setTimeout(resolve, 700));

    alert(t('successAlert'));
    router.push('/sign-in');

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F1E6] px-4 py-8 text-[#1c3c33]">
      <div className="mx-auto max-w-5xl">
        {/* Header with logo + language toggle */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-2 hidden items-center gap-1 text-sm font-semibold text-[#1c3c33]/70 hover:text-[#1c3c33] sm:inline-flex"
            >
              <span className="text-lg">←</span>
              {t('back')}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c3c33] shadow-[0_12px_30px_rgba(28,60,51,0.10)] overflow-hidden">
                <img src="/rahmah-logo.jpg" alt="Rahmah" className="w-full h-full object-cover" />
              </div>
              <div className="text-2xl font-black italic tracking-tight text-[#2F6B4F]">
                Rahmah
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLang((prev) => (prev === 'en' ? 'ur' : 'en'))}
            className="rounded-full border border-[#d0d8cf] bg-white/60 px-4 py-1.5 text-xs font-semibold text-[#1c3c33]/80 shadow-sm hover:bg-white"
          >
            {lang === 'en' ? t('toggleLabel') : t('toggleBackToEnglish')}
          </button>
        </header>

        {/* Card */}
        <div className="rounded-3xl bg-white px-5 py-7 shadow-[0_18px_50px_rgba(28,60,51,0.12)] sm:px-8 sm:py-9">
          <div className="border-b border-[#e2e6dd] pb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1c3c33]/50">
                  {t('sectionTag')}
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-[#1c3c33] sm:text-3xl">
                  {t('mainTitle')}
                </h1>
                <p className="mt-2 text-sm text-[#b45309]">
                  {t('subtitleLine1')}
                </p>
                <p className="mt-1 text-xs text-[#1c3c33]/70">
                  {t('subtitleLine2')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#1c3c33]/70 hover:text-[#1c3c33] sm:hidden"
              >
                <span className="text-lg">←</span>
                {t('back')}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1c3c33]">
                  {t('fullNameLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('fullNamePlaceholder')}
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1c3c33]">
                  {t('phoneLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('phonePlaceholder')}
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1c3c33]">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1c3c33]">
                  {t('instituteNameLabel')}
                </label>
                <OrganizationSearch
                  onSelect={setSelectedOrganization}
                  selectedOrganization={selectedOrganization}
                  placeholder={t('instituteNamePlaceholder')}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1c3c33]">
                  {t('instituteTypeLabel')}
                </label>
                <select
                  value={form.instituteType}
                  onChange={(e) => update('instituteType', e.target.value)}
                  className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm text-[#1c3c33]/80 outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                >
                  <option value="">{t('instituteTypePlaceholder')}</option>
                  <option value="traditional-madrasa">{t('optionTraditionalMadrasa')}</option>
                  <option value="madrasa">{t('optionMadrasa')}</option>
                  <option value="school">{t('optionSchool')}</option>
                  <option value="masjid">{t('optionMasjid')}</option>
                  <option value="other">{t('optionOther')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1c3c33]">
                {t('addressLabel')}
              </label>
              <input
                type="text"
                placeholder={t('addressPlaceholder')}
                value={selectedOrganization?.address || form.address}
                onChange={(e) => update('address', e.target.value)}
                className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1c3c33]">
                {t('messageLabel')}
              </label>
              <textarea
                rows={3}
                placeholder={t('messagePlaceholder')}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#10B981] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(16,185,129,0.35)] hover:bg-[#0f9f71] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? '...' : t('sendRequest')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


