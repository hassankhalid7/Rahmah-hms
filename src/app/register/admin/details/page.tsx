'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    back: 'Back',
    sectionTag: 'Institute Registration',
    mainTitle: 'Complete Registration',
    mainSubtitle: 'Fill in your institute details to complete registration',
    instituteInfoHeading: 'Institute Information',
    instituteName: 'Institute Name',
    instituteNamePlaceholder: 'Al-Noor Madrasa',
    instituteType: 'Institute Type',
    instituteTypePlaceholder: 'Select institute type',
    optionMadrasa: 'Madrasa',
    optionSchool: 'School',
    optionMasjid: 'Masjid',
    optionOther: 'Other',
    studentsLabel: 'Number of Students',
    staffLabel: 'Number of Staff',
    addressLabel: 'Institute Address',
    addressPlaceholder: 'Enter complete address',
    feesQuestion: 'Does your institute charge fees from students?',
    no: 'No',
    yes: 'Yes',
    additionalHeading: 'Additional Information (Optional)',
    additionalPlaceholder: 'Any other details you want to share...',
    adminHeading: 'Administrator Information',
    adminName: 'Your Full Name',
    adminNamePlaceholder: 'Ahmad Khan',
    adminEmail: 'Email Address',
    adminEmailPlaceholder: 'mhassaankhalid7@gmail.com',
    adminPhone: 'Phone Number',
    adminPhonePlaceholder: '+92 300 1234567',
    adminWhatsapp: 'WhatsApp (Optional)',
    adminWhatsappPlaceholder: 'WhatsApp number or ID',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••••••••',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: '••••••••',
    termsLine: 'I accept the terms and conditions',
    termsDescriptionPrefix: 'You agree to our',
    termsService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    backButton: 'Back',
    submitButton: 'Submit Application',
    alreadyAccount: 'Already have an account?',
    login: 'Login',
    acceptTermsAlert: 'Please accept the terms and conditions to continue.',
    passwordsMismatchAlert: 'Passwords do not match.',
    submitSuccess: 'Demo: Registration form submitted successfully!',
  },
  ur: {
    back: 'واپس',
    sectionTag: 'انسٹیٹیوٹ رجسٹریشن',
    mainTitle: 'رجسٹریشن مکمل کریں',
    mainSubtitle: 'اپنے ادارے کی مکمل تفصیلات درج کریں تاکہ رجسٹریشن مکمل ہو سکے',
    instituteInfoHeading: 'ادارے کی معلومات',
    instituteName: 'ادارے کا نام',
    instituteNamePlaceholder: 'النور مدرسہ',
    instituteType: 'ادارے کی قسم',
    instituteTypePlaceholder: 'ادارے کی قسم منتخب کریں',
    optionMadrasa: 'مدرسہ',
    optionSchool: 'اسکول',
    optionMasjid: 'مسجد',
    optionOther: 'دیگر',
    studentsLabel: 'طلبہ کی تعداد',
    staffLabel: 'سٹاف کی تعداد',
    addressLabel: 'ادارے کا پتہ',
    addressPlaceholder: 'مکمل پتہ درج کریں',
    feesQuestion: 'کیا آپ کا ادارہ طلبہ سے فیس لیتا ہے؟',
    no: 'نہیں',
    yes: 'ہاں',
    additionalHeading: 'اضافی معلومات (اختیاری)',
    additionalPlaceholder: 'کوئی اور معلومات جو آپ شامل کرنا چاہیں...',
    adminHeading: 'ایڈمن کی معلومات',
    adminName: 'آپ کا پورا نام',
    adminNamePlaceholder: 'احمد خان',
    adminEmail: 'ای میل ایڈریس',
    adminEmailPlaceholder: 'mhassaankhalid7@gmail.com',
    adminPhone: 'فون نمبر',
    adminPhonePlaceholder: '+92 300 1234567',
    adminWhatsapp: 'واٹس ایپ (اختیاری)',
    adminWhatsappPlaceholder: 'واٹس ایپ نمبر یا آئی ڈی',
    passwordLabel: 'پاس ورڈ',
    passwordPlaceholder: '••••••••••••••',
    confirmPasswordLabel: 'پاس ورڈ کی تصدیق کریں',
    confirmPasswordPlaceholder: '••••••••',
    termsLine: 'میں شرائط و ضوابط سے متفق ہوں',
    termsDescriptionPrefix: 'آپ ہمارے',
    termsService: 'شرائطِ استعمال',
    and: 'اور',
    privacyPolicy: 'پرائیویسی پالیسی',
    backButton: 'واپس',
    submitButton: 'درخواست جمع کریں',
    alreadyAccount: 'کیا آپ کا پہلے سے اکاؤنٹ موجود ہے؟',
    login: 'لاگ اِن کریں',
    acceptTermsAlert: 'براہ کرم آگے بڑھنے کے لیے شرائط و ضوابط سے اتفاق کریں۔',
    passwordsMismatchAlert: 'پاس ورڈ اور تصدیقی پاس ورڈ ایک جیسے نہیں ہیں۔',
    submitSuccess: 'ڈیمو: رجسٹریشن فارم کامیابی سے جمع ہو گیا ہے!',
  },
} as const;

type Lang = keyof typeof translations;
type TranslationKey = keyof (typeof translations)['en'];

function AdminDetailsForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromPrevious = searchParams.get('email') ?? '';

  const [lang, setLang] = useState<Lang>('en');

  const [form, setForm] = useState({
    instituteName: '',
    instituteType: '',
    instituteAddress: '',
    students: '',
    staff: '',
    chargesFees: 'no' as 'yes' | 'no',
    extraInfo: '',
    adminName: '',
    adminEmail: emailFromPrevious,
    adminPhone: '',
    adminWhatsapp: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (key: TranslationKey) => translations[lang][key];

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.acceptedTerms) {
      alert(t('acceptTermsAlert'));
      return;
    }

    if (!form.password || form.password !== form.confirmPassword) {
      alert(t('passwordsMismatchAlert'));
      return;
    }

    setIsSubmitting(true);

    // TODO: Integrate with /api/auth/register-institute
    await new Promise((resolve) => setTimeout(resolve, 800));

    alert(t('submitSuccess'));
    router.push('/sign-in');

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F1E6] px-4 py-8 text-[#1c3c33]">
      <div className="mx-auto max-w-5xl">
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
            {lang === 'en' ? 'زبان تبدیل کریں' : 'Switch to English'}
          </button>
        </header>

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
                <p className="mt-2 text-sm text-[#1c3c33]/65">
                  {t('mainSubtitle')}
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

          <form onSubmit={handleSubmit} className="mt-7 space-y-8">
            {/* Institute Information */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1c3c33]/55">
                {t('instituteInfoHeading')}
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('instituteName')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('instituteNamePlaceholder')}
                    value={form.instituteName}
                    onChange={(e) => update('instituteName', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('instituteType')}
                  </label>
                  <select
                    value={form.instituteType}
                    onChange={(e) => update('instituteType', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm text-[#1c3c33]/80 outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  >
                    <option value="">{t('instituteTypePlaceholder')}</option>
                    <option value="madrasa">{t('optionMadrasa')}</option>
                    <option value="school">{t('optionSchool')}</option>
                    <option value="masjid">{t('optionMasjid')}</option>
                    <option value="other">{t('optionOther')}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('studentsLabel')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={form.students}
                    onChange={(e) => update('students', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('staffLabel')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={form.staff}
                    onChange={(e) => update('staff', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1c3c33]">
                  {t('addressLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('addressPlaceholder')}
                  value={form.instituteAddress}
                  onChange={(e) => update('instituteAddress', e.target.value)}
                  className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#1c3c33]">
                  {t('feesQuestion')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 rounded-full border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-1.5 text-xs font-semibold text-[#1c3c33]/80">
                    <input
                      type="radio"
                      className="h-3 w-3 accent-[#2F6B4F]"
                      checked={form.chargesFees === 'no'}
                      onChange={() => update('chargesFees', 'no')}
                    />
                    {t('no')}
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-1.5 text-xs font-semibold text-[#1c3c33]/80">
                    <input
                      type="radio"
                      className="h-3 w-3 accent-[#2F6B4F]"
                      checked={form.chargesFees === 'yes'}
                      onChange={() => update('chargesFees', 'yes')}
                    />
                    {t('yes')}
                  </label>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1c3c33]/55">
                {t('additionalHeading')}
              </h2>
              <textarea
                rows={3}
                placeholder={t('additionalPlaceholder')}
                value={form.extraInfo}
                onChange={(e) => update('extraInfo', e.target.value)}
                className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
              />
            </section>

            {/* Administrator Information */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1c3c33]/55">
                {t('adminHeading')}
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('adminName')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('adminNamePlaceholder')}
                    value={form.adminName}
                    onChange={(e) => update('adminName', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('adminEmail')}
                  </label>
                  <input
                    type="email"
                    placeholder={t('adminEmailPlaceholder')}
                    value={form.adminEmail}
                    onChange={(e) => update('adminEmail', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('adminPhone')}
                  </label>
                  <input
                    type="tel"
                    placeholder={t('adminPhonePlaceholder')}
                    value={form.adminPhone}
                    onChange={(e) => update('adminPhone', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('adminWhatsapp')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('adminWhatsappPlaceholder')}
                    value={form.adminWhatsapp}
                    onChange={(e) => update('adminWhatsapp', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('passwordLabel')}
                  </label>
                  <input
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1c3c33]">
                    {t('confirmPasswordLabel')}
                  </label>
                  <input
                    type="password"
                    placeholder={t('confirmPasswordPlaceholder')}
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    className="w-full rounded-2xl border border-[#d0d8cf] bg-[#F7F1E6] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
                  />
                </div>
              </div>
            </section>

            {/* Terms & Actions */}
            <section className="space-y-4 border-t border-[#e2e6dd] pt-5">
              <label className="flex items-start gap-3 text-sm text-[#1c3c33]/75">
                <input
                  type="checkbox"
                  checked={form.acceptedTerms}
                  onChange={(e) => update('acceptedTerms', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#c6cec3] text-[#2F6B4F] accent-[#2F6B4F]"
                />
                <span>
                  {t('termsLine')}
                  <br />
                  <span className="text-xs text-[#1c3c33]/60">
                    {t('termsDescriptionPrefix')}{' '}
                    <button
                      type="button"
                      className="font-semibold text-[#2F6B4F] underline underline-offset-2"
                    >
                      {t('termsService')}
                    </button>{' '}
                    {t('and')}{' '}
                    <button
                      type="button"
                      className="font-semibold text-[#2F6B4F] underline underline-offset-2"
                    >
                      {t('privacyPolicy')}
                    </button>
                    .
                  </span>
                </span>
              </label>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center justify-center rounded-full border border-[#d0d8cf] bg-white px-6 py-2.5 text-sm font-semibold text-[#1c3c33]/80 hover:bg-[#F7F1E6]"
                  >
                    {t('backButton')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-[#2F6B4F] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(47,107,79,0.35)] hover:bg-[#285c44] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Submitting…' : t('submitButton')}
                  </button>
                </div>

                <p className="text-xs text-[#1c3c33]/65">
                  {t('alreadyAccount')}{' '}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-[#2F6B4F] underline underline-offset-2"
                  >
                    {t('login')}
                  </Link>
                </p>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F1E6] flex items-center justify-center">
        <div className="text-[#1c3c33] font-bold animate-pulse">Loading Registration...</div>
      </div>
    }>
      <AdminDetailsForm />
    </Suspense>
  );
}


