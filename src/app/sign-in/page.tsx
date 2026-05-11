'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Role = 'admin' | 'teacher' | 'student';

const translations = {
  en: {
    heading: 'Rahmah HMS',
    subtitle: 'Log in to your account to access the system.',
    emailLabel: 'Email or Mobile Number',
    emailPlaceholder: 'navveeed1978@gmail.com',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    loginAs: 'Login as',
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student',
    login: 'Login',
    loggingIn: 'Logging in…',
    registerNewInstitute: 'Register New Institute',
    validation: 'Please enter your email and password.',
    toggleLabel: 'زبان تبدیل کریں',
    toggleBackToEnglish: 'Switch to English',
  },
  ur: {
    heading: 'رحمہ HMS',
    subtitle: 'سسٹم تک رسائی کے لیے اپنے اکاؤنٹ میں لاگ اِن کریں۔',
    emailLabel: 'ای میل یا موبائل نمبر',
    emailPlaceholder: 'navveeed1978@gmail.com',
    passwordLabel: 'پاس ورڈ',
    forgotPassword: 'پاس ورڈ بھول گئے؟',
    rememberMe: 'مجھے یاد رکھیں',
    loginAs: 'بطور لاگ اِن کریں',
    admin: 'ایڈمن',
    teacher: 'استاد',
    student: 'طالب علم',
    login: 'لاگ اِن',
    loggingIn: 'لاگ اِن ہو رہا ہے…',
    registerNewInstitute: 'نیا ادارہ رجسٹر کریں',
    validation: 'براہ کرم ای میل اور پاس ورڈ درج کریں۔',
    toggleLabel: 'زبان تبدیل کریں',
    toggleBackToEnglish: 'Switch to English',
  },
} as const;

type Lang = keyof typeof translations;

export default function SignInPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: keyof (typeof translations)['en']) => translations[lang][key];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<Role>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert(t('validation'));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/public/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Login success
      alert(data.message);
      // Redirect based on role
      router.push(`/dashboard?role=${role}`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E6] px-4 py-8 text-[#1c3c33]">
      <div className="mx-auto flex max-w-md flex-col">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setLang((prev) => (prev === 'en' ? 'ur' : 'en'))}
            className="rounded-full border border-[#d0d8cf] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[#1c3c33]/80 shadow-sm hover:bg-white"
          >
            {lang === 'en' ? t('toggleLabel') : t('toggleBackToEnglish')}
          </button>
        </div>

        {/* Logo / heading */}
        <header className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c3c33] shadow-[0_12px_30px_rgba(28,60,51,0.10)] overflow-hidden">
              <img src="/rahmah-logo.jpg" alt="Rahmah" className="w-full h-full object-cover" />
            </div>
            <span className="text-3xl font-black tracking-tight text-[#2F6B4F]">
              {t('heading')}
            </span>
          </Link>
          <p className="mt-3 text-sm font-medium italic text-[#1c3c33]/70">
            {t('subtitle')}
          </p>
        </header>

        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_18px_50px_rgba(28,60,51,0.12)]"
        >
          {/* Email / mobile */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1c3c33]">
              {t('emailLabel')}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full rounded-xl border border-[#d0d8cf] bg-[#F7F1E6] px-3 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1c3c33]">
              <span>{t('passwordLabel')}</span>
              <button
                type="button"
                className="text-[11px] font-semibold text-[#2F6B4F] hover:underline"
              >
                {t('forgotPassword')}
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full rounded-xl border border-[#d0d8cf] bg-[#F7F1E6] px-3 py-2.5 text-sm outline-none transition focus:border-[#2F6B4F] focus:bg-white focus:ring-2 focus:ring-[#2F6B4F]/15"
            />
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 text-xs text-[#1c3c33]/80">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-[#c6cec3] text-[#2F6B4F] accent-[#2F6B4F]"
            />
            <label htmlFor="remember" className="select-none">
              {t('rememberMe')}
            </label>
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#1c3c33]">
              {t('loginAs')}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['admin', 'teacher', 'student'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${role === r
                    ? 'border-[#2F6B4F] bg-[#E5F4EC] text-[#1c3c33]'
                    : 'border-[#d0d8cf] bg-[#F7F1E6] text-[#1c3c33]/80 hover:bg-white'
                    }`}
                >
                  {r === 'admin' && t('admin')}
                  {r === 'teacher' && t('teacher')}
                  {r === 'student' && t('student')}
                </button>
              ))}
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-[#2F6B4F] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(47,107,79,0.35)] transition hover:bg-[#285c44] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t('loggingIn') : t('login')}
          </button>
        </form>

        {/* Register new institute */}
        <div className="mt-4">
          <Link
            href="/register"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#d0d8cf] bg-white px-4 py-2.5 text-xs font-semibold text-[#1c3c33]/85 shadow-sm hover:bg-[#F7F1E6]"
          >
            <span className="text-lg">👤</span>
            <span>{t('registerNewInstitute')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
