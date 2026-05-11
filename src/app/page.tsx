'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  const t = {
    en: {
      home: 'Home',
      features: 'Features',
      about: 'About',
      contact: 'Contact',
      register: 'Register',
      login: 'Login',
      // Hero Section
      heroTagline: 'Comprehensive Digital Solution',
      heroTitle: 'Empowering Madrasas',
      heroTitle2: 'with Modern Management',
      heroDesc: 'Streamline administration and student progress tracking with our advanced Hifz management system.',
      getStarted: 'Get Started',
      watchDemo: 'Watch Demo',

      // Quranic Verse
      verseArabic: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
      verseTranslation: '"And We send down of the Quran that which is healing and mercy for the believers."',
      verseReference: '— Surah Al-Isra, Verse 82',
      rahmahMeaning: 'The name',
      rahmahName: '"Rahmah"',
      rahmahDesc: '(رحمة) means "mercy" or "compassion" — reflecting our mission to bring mercy and ease to Hifz management for Islamic institutes.',

      // Trust Indicators
      trustedTitle1: 'Trusted by Islamic Educators',
      trustedDesc1: 'Designed with input from experienced Hifz teachers',
      trustedTitle2: 'Modern & Secure Platform',
      trustedDesc2: 'Built with cutting-edge technology and security',
      trustedTitle3: 'Lightning Fast Access',
      trustedDesc3: 'Access your dashboard from anywhere, anytime',

      // Complete Solution
      completeSolution: 'Complete Solution for Islamic Institutes',
      completeSolutionDesc: 'Streamline administration and enhance student learning with suggested Hifz management systems.',
      dailyProgress: 'Daily Progress Tracking',
      dailyProgressDesc: 'Track Quran progress daily with accuracy and clarity.',
      studentMgmt: 'Student Management',
      studentMgmtDesc: 'Keep student profiles, history, and performance organized.',
      attendance: 'Attendance System',
      attendanceDesc: 'Smart attendance records for students and teachers.',

      // Powerful Features
      powerfulFeatures: 'Powerful Features',
      dailyQuran: 'Daily Quran Progress',
      staffMgmt: 'Staff Management',
      examsReports: 'Exams & Reports',
      roleBased: 'Role Based Dashboards',

      // Technology Benefits
      techBenefits: 'Modern Technology Benefits',
      techBenefitsDesc: 'Access from any device with complete peace of mind. No installation needed.',
      responsiveApp: 'Responsive Web App',
      noInstall: 'No installation needed',
      cloudBased: 'Cloud-Based System',
      dataSecure: 'Data never lost',
      universalAccess: 'Universal Access',
      loginAnywhere: 'Login from anywhere',
      crossDevice: 'Cross-Device Support',
      anyDevice: 'Any device compatibility',

      // Mission
      missionTitle: 'Transforming Hifz Education',
      missionDesc: 'Preserving the sacred tradition of Hifz requires both spiritual dedication and modern efficiency.',

      // Services
      servicesTitle: 'Our Services Benefit the Following Institutions',
      traditional: 'Traditional Hifz Madrasas',
      traditionalDesc: 'Preserving the sacred tradition of Quranic memorization',
      modernInstitute: 'Modern Islamic Institutes',
      modernDesc: 'Combining traditional values with modern technology',
      mosques: 'Quranic Circles in Mosques',
      mosquesDesc: 'Supporting community-based Islamic education',
      online: 'Online Quran Institutes',
      onlineDesc: 'Digital platforms for remote Quranic education',

      // CTA & Footer
      ctaTitle: 'Ready to Transform Your Madrasa?',
      ctaDesc: 'Register your Islamic institute to adopt our comprehensive Hifz Management System.',
      registerNow: 'Get Started',
      footerDesc: 'Empowering Islamic institutes with our comprehensive Hifz Management System to preserve the sacred tradition of Hifz education while enhancing administrative efficiency and student outcomes.',
      contactUs: 'Contact Us',
      emailUs: 'Email',
      callUs: 'Phone',
      officeLocation: 'Office Location',
      copyright: '© 2025 Rahmah HMS. All rights reserved. | A Project by Islamic Education Innovators',
      statusTitle: 'Verified Institute',
      statusSub: 'Trust & Security Guaranteed'
    },
    ur: {
      home: 'ہوم',
      features: 'خصوصیات',
      about: 'ہمارے بارے میں',
      contact: 'رابطہ',
      register: 'رجسٹر کریں',
      login: 'لاگ ان',
      heroTagline: 'مکمل ڈیجیٹل حل',
      heroTitle: 'مدارس کو بااختیار بنانا',
      heroTitle2: 'جدید انتظام کے ساتھ',
      heroDesc: 'ہماری جدید حفظ مینجمنٹ سسٹم کے ساتھ انتظامیہ اور طلباء کی پیشرفت کو آسان بنائیں۔',
      getStarted: 'شروع کریں',
      watchDemo: 'ڈیمو دیکھیں',
      verseArabic: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
      verseTranslation: '"اور ہم قرآن میں سے وہ نازل کرتے ہیں جو مومنوں کے لیے شفا اور رحمت ہے۔"',
      verseReference: '— سورہ الاسراء، آیت 82',
      rahmahMeaning: 'نام',
      rahmahName: '"رحمہ"',
      rahmahDesc: '(رحمة) کا مطلب ہے "رحم" یا "شفقت" — جو اسلامی اداروں کے لیے حفظ کے انتظام میں رحمت اور آسانی لانے کے ہمارے مشن کی عکاسی کرتا ہے۔',
      trustedTitle1: 'اسلامی معلمین کا اعتماد',
      trustedDesc1: 'تجربہ کار حفظ اساتذہ کی رائے سے ڈیزائن کیا گیا',
      trustedTitle2: 'جدید اور محفوظ پلیٹ فارم',
      trustedDesc2: 'جدید ٹیکنالوجی اور سیکیورٹی کے ساتھ بنایا گیا',
      trustedTitle3: 'تیز رفتار رسائی',
      trustedDesc3: 'کہیں سے بھی، کسی بھی وقت اپنے ڈیش بورڈ تک رسائی حاصل کریں',
      completeSolution: 'اسلامی اداروں کے لیے مکمل حل',
      completeSolutionDesc: 'ہمارا جامع حفظ مینجمنٹ سسٹم روایتی طریقہ کار کو جدید ٹیکنالوجی کے ساتھ یکجا کرتا ہے۔',
      dailyProgress: 'روزانہ پیشرفت کی نگرانی',
      dailyProgressDesc: 'درستگی اور وضاحت کے ساتھ روزانہ قرآن کی پیشرفت کو ٹریک کریں۔',
      studentMgmt: 'طلباء کا انتظام',
      studentMgmtDesc: 'طلباء کی پروفائلز، تاریخ اور کارکردگی کو منظم رکھیں۔',
      attendance: 'حاضری کا نظام',
      attendanceDesc: 'طلباء اور اساتذہ کے لیے سمارٹ حاضری کے ریکارڈ۔',
      powerfulFeatures: 'طاقتور خصوصیات',
      dailyQuran: 'روزانہ قرآن کی پیشرفت',
      staffMgmt: 'عملے کا انتظام',
      examsReports: 'امتحانات اور رپورٹس',
      roleBased: 'رول پر مبنی ڈیش بورڈز',
      techBenefits: 'جدید ٹیکنالوجی کے فوائد',
      techBenefitsDesc: 'کسی بھی ڈیوائس سے مکمل ذہنی سکون کے ساتھ رسائی حاصل کریں۔ کوئی انسٹالیشن کی ضرورت نہیں۔',
      responsiveApp: 'ریسپانسیو ویب ایپ',
      noInstall: 'انسٹالیشن کی ضرورت نہیں',
      cloudBased: 'کلاؤڈ پر مبنی نظام',
      dataSecure: 'ڈیٹا کبھی ضائع نہیں ہوتا',
      universalAccess: 'عالمی رسائی',
      loginAnywhere: 'کہیں سے بھی لاگ ان کریں',
      crossDevice: 'کراس ڈیوائس سپورٹ',
      anyDevice: 'کسی بھی ڈیوائس کی مطابقت',
      missionTitle: 'جدید انتظام کے ساتھ حفظ کی تعلیم کو تبدیل کرنا',
      missionDesc: 'حفظ کی مقدس روایت کو محفوظ رکھنے کے لیے روحانی لگن اور جدید کارکردگی دونوں کی ضرورت ہے۔',
      servicesTitle: 'ہماری خدمات درج ذیل اداروں کو فائدہ پہنچاتی ہیں',
      traditional: 'روایتی حفظ مدارس',
      traditionalDesc: 'قرآنی حفظ کی مقدس روایت کا تحفظ',
      modernInstitute: 'جدید اسلامی ادارے',
      modernDesc: 'روایتی اقدار کو جدید ٹیکنالوجی کے ساتھ ملانا',
      mosques: 'مساجد میں قرآنی حلقے',
      mosquesDesc: 'کمیونٹی پر مبنی اسلامی تعلیم کی حمایت',
      online: 'آن لائن قرآن ادارے',
      onlineDesc: 'دور دراز قرآنی تعلیم کے لیے ڈیجیٹل پلیٹ فارم',
      ctaTitle: 'اپنے ادارے کو تبدیل کرنے کے لیے تیار ہیں؟',
      ctaDesc: 'اپنے اسلامی ادارے کو رجسٹر کریں اور ہمارے جامع حفظ مینجمنٹ سسٹم کو اپنائیں اور اپنی تعلیمی کارروائیوں کو تبدیل کریں۔',
      registerNow: 'ابھی رجسٹر کریں',
      footerDesc: 'اسلامی اداروں کو ہمارے جامع حفظ مینجمنٹ سسٹم کے ساتھ بااختیار بنانا تاکہ حفظ کی تعلیم کی مقدس روایت کو محفوظ رکھتے ہوئے انتظامی کارکردگی اور طلباء کے نتائج کو بہتر بنایا جا سکے۔',
      contactUs: 'ہم سے رابطہ کریں',
      emailUs: 'ای میل',
      callUs: 'فون',
      officeLocation: 'دفتر کا مقام',
      copyright: '© 2025 رحمہ HMS۔ تمام حقوق محفوظ ہیں۔ | اسلامی تعلیمی جدت کاروں کا ایک منصوبہ',
      statusTitle: 'تصدیق شدہ ادارہ',
      statusSub: 'اعتماد اور تحفظ کی ضمانت'
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1c3c33] font-sans overflow-x-hidden selection:bg-[#2F6B4F] selection:text-white">
      {/* Decorative Top Left Plant */}
      <img
        src="/decor-flowers.png"
        alt=""
        className="fixed top-0 left-0 hidden sm:block w-[280px] h-[280px] md:w-[400px] md:h-[400px] object-contain -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none z-0 mix-blend-multiply"
      />

      {/* Navbar Container */}
      <div className="relative z-50 mx-auto max-w-7xl px-3 sm:px-6 pt-3 sm:pt-6">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl sm:rounded-full bg-white/80 backdrop-blur-md px-3 sm:px-6 py-3 shadow-sm border border-[#2F6B4F]/5">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1c3c33] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden border border-white/5">
                <Image src="/rahmah-logo.svg" alt="RAHMAH Logo" width={40} height={40} className="object-cover" />
              </div>
              <span className="text-xl sm:text-2xl font-black italic tracking-tight text-[#2F6B4F] flex items-center gap-1 drop-shadow-sm">
                Rahmah
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-8 text-sm font-bold text-[#1c3c33]/70 md:flex">
            <Link href="#home" className="hover:text-[#2F6B4F] transition-colors">{t[lang].home}</Link>
            <Link href="#features" className="hover:text-[#2F6B4F] transition-colors">{t[lang].features}</Link>
            <Link href="#about" className="hover:text-[#2F6B4F] transition-colors">{t[lang].about}</Link>
            <Link href="#contact" className="hover:text-[#2F6B4F] transition-colors">{t[lang].contact}</Link>
          </div>

          <div className="flex w-full sm:w-auto items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#2F6B4F] hover:bg-[#2F6B4F]/5 rounded-lg transition-all mr-2"
            >
              <span className={lang === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
              <span className="opacity-40">|</span>
              <span className={lang === 'ur' ? 'opacity-100' : 'opacity-40'}>اردو</span>
            </button>
            <Link href="/register" className="rounded-full bg-[#2F6B4F] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#255740] hover:scale-105 transition-all whitespace-nowrap">
              {t[lang].register}
            </Link>
            <Link href="/sign-in" className="rounded-full bg-[#fae8b4] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-[#1c3c33] shadow-md hover:bg-[#ffe196] hover:scale-105 transition-all whitespace-nowrap">
              {t[lang].login}
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative pt-8 sm:pt-12 pb-20 sm:pb-32 lg:pt-20 overflow-hidden">
        {/* Wavy shape background - Natural tone */}
        <div className="absolute top-0 right-0 w-[75%] sm:w-[60%] h-[85%] bg-[#FDFBF7] rounded-bl-[96px] sm:rounded-bl-[150px] -z-10"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left Content - Reverted Sizes */}
            <div className="relative z-10 pt-2 sm:pt-10">
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm text-[#2F6B4F] text-xs font-bold tracking-wide border border-[#2F6B4F]/10 shadow-sm">
                {t[lang].heroTagline}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight text-[#1c3c33] mb-4 sm:mb-6 drop-shadow-sm">
                {t[lang].heroTitle}
                <br />
                <span className="text-[#2F6B4F] relative inline-block">
                  {t[lang].heroTitle2}
                  <svg className="absolute bottom-1 left-0 w-full h-3 text-[#F3D083] -z-10 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="max-w-lg text-base sm:text-lg leading-relaxed text-[#1c3c33]/70 font-medium mb-6 sm:mb-8">
                {t[lang].heroDesc}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link href="/register" className="rounded-full bg-[#2F6B4F] px-6 sm:px-8 py-3 text-sm font-bold text-white shadow-[0_20px_40px_rgba(47,107,79,0.25)] hover:bg-[#255740] hover:translate-y-[-2px] transition-all flex items-center gap-2">
                  {t[lang].getStarted}
                </Link>
                <button type="button" className="rounded-full bg-[#FDFBF7] border-2 border-[#E1D7C3] px-6 sm:px-8 py-3 text-sm font-bold text-[#1c3c33] shadow-sm hover:bg-[#F3D083]/10 hover:border-[#F3D083] transition-all">
                  {t[lang].watchDemo}
                </button>
              </div>
            </div>

            {/* Right Illustration - Large Character, No White Behind */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-[420px] sm:max-w-[550px] aspect-square">
                {/* Blob behind character */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] text-[#E8F5E9] opacity-80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.9,32.2C59.6,42.9,48.3,51.4,36.4,58.3C24.5,65.2,12,70.5,-1.2,72.6C-14.4,74.7,-30.1,73.6,-43.3,67C-56.5,60.4,-67.2,48.3,-75.4,34.7C-83.6,21.1,-89.3,6,-86.3,-7.8C-83.3,-21.6,-71.6,-34.1,-60.1,-43.3C-48.6,-52.5,-37.3,-58.4,-25.6,-67.2C-13.9,-76,-1.8,-87.7,12.5,-89.9C26.8,-92.1,53.6,-84.8,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>

                {/* Floral decorations */}
                <img src="/decor-flowers.png" alt="" className="absolute -bottom-10 -left-16 hidden sm:block w-48 h-48 object-contain z-20 rotate-[-15deg] mix-blend-multiply" />
                <img src="/decor-flowers.png" alt="" className="absolute -bottom-4 -right-8 hidden sm:block w-40 h-40 object-contain z-20 rotate-[35deg] scale-x-[-1] mix-blend-multiply" />
                <img src="/decor-flowers.png" alt="" className="absolute top-0 right-10 hidden sm:block w-24 h-24 object-contain z-0 opacity-60 rotate-[180deg] mix-blend-multiply" />

                {/* Character - Large size, Multiply blend to remove white backdrop */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    src="/hero-mockup.png"
                    alt="Islamic Scholar Dashboard"
                    className="relative z-10 w-[110%] h-auto object-contain drop-shadow-2xl mix-blend-multiply"
                  />

                  {/* Floating UI Cards - Minimal spacing */}
                  <div className="absolute top-[20%] -left-[5%] hidden sm:block bg-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(47,107,79,0.15)] z-20 border border-[#2F6B4F]/5 animate-[bounce_3s_infinite]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2F6B4F]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#1c3c33] leading-tight">{t[lang].statusTitle}</span>
                        <span className="text-[8px] font-medium text-[#1c3c33]/60">{t[lang].statusSub}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transition Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
          <svg className="relative block w-[calc(110%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Trust Indicators Section - Normal Spacing */}
      <section className="bg-white pb-12 pt-6 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-[#FDFBF7] transition-all">
              <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2F6B4F] mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="font-bold text-[#1c3c33] mb-2">{t[lang].trustedTitle1}</h3>
              <p className="text-sm text-[#1c3c33]/60">{t[lang].trustedDesc1}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-[#FDFBF7] transition-all">
              <div className="w-14 h-14 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#F57C00] mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="font-bold text-[#1c3c33] mb-2">{t[lang].trustedTitle2}</h3>
              <p className="text-sm text-[#1c3c33]/60">{t[lang].trustedDesc2}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-[#FDFBF7] transition-all">
              <div className="w-14 h-14 rounded-full bg-[#E3F2FD] flex items-center justify-center text-[#1976D2] mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold text-[#1c3c33] mb-2">{t[lang].trustedTitle3}</h3>
              <p className="text-sm text-[#1c3c33]/60">{t[lang].trustedDesc3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quranic Verse Section - Reverted to Normal Size */}
      <section className="bg-white relative py-12 z-10 border-t border-[#F1F8E9]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#2F6B4F] leading-relaxed drop-shadow-sm mb-4" style={{ fontFamily: 'Traditional Arabic, serif', direction: 'rtl' }}>
            {t[lang].verseArabic}
          </h2>
          <p className="text-lg text-[#1c3c33]/70 italic font-serif mb-2 max-w-2xl mx-auto">
            {t[lang].verseTranslation}
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2F6B4F]/60 mb-8">
            {t[lang].verseReference}
          </p>
          <div className="inline-block bg-[#FDFBF7] px-6 py-3 rounded-2xl border border-[#2F6B4F]/10">
            <p className="text-sm text-[#1c3c33]/80">
              {t[lang].rahmahMeaning} <span className="font-bold text-[#2F6B4F]">{t[lang].rahmahName}</span> {t[lang].rahmahDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Complete Solution Section */}
      <section className="bg-white pb-24 pt-12 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1c3c33] mb-4">{t[lang].completeSolution}</h2>
            <p className="text-[#1c3c33]/60 text-base sm:text-lg">{t[lang].completeSolutionDesc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 px-0 sm:px-4">
            {/* Card 1 - Progress */}
            <div className="bg-[#FFF9EE] rounded-[40px] p-8 text-center hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-300 group border-2 border-transparent hover:border-[#FFF9EE]">
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#2F6B4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1c3c33] mb-3">{t[lang].dailyProgress}</h3>
              <p className="text-[#1c3c33]/60 text-sm leading-relaxed">{t[lang].dailyProgressDesc}</p>
            </div>

            {/* Card 2 - Student */}
            <div className="bg-[#EBF5EE] rounded-[40px] p-8 text-center hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-300 group border-2 border-transparent hover:border-[#EBF5EE]">
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#F57C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1c3c33] mb-3">{t[lang].studentMgmt}</h3>
              <p className="text-[#1c3c33]/60 text-sm leading-relaxed">{t[lang].studentMgmtDesc}</p>
            </div>

            {/* Card 3 - Attendance */}
            <div className="bg-[#F0F4F8] rounded-[40px] p-8 text-center hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-300 group border-2 border-transparent hover:border-[#F0F4F8]">
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#00897B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1c3c33] mb-3">{t[lang].attendance}</h3>
              <p className="text-[#1c3c33]/60 text-sm leading-relaxed">{t[lang].attendanceDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Features & Tech Benefits - Reverted Sizes */}
      <section className="py-16 bg-[#FDFBF7] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Powerful Features */}
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1c3c33] mb-10 sm:mb-12">{t[lang].powerfulFeatures}</h2>
            <div className="grid gap-6 md:grid-cols-4 mb-20">
              {[
                { title: t[lang].dailyQuran, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                { title: t[lang].staffMgmt, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
                { title: t[lang].examsReports, icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { title: t[lang].roleBased, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-[#2F6B4F]/5 hover:border-[#2F6B4F]/30 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F1E6] flex items-center justify-center text-[#2F6B4F] mb-4 group-hover:bg-[#2F6B4F] group-hover:text-white transition-colors mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                  </div>
                  <h3 className="font-bold text-[#1c3c33] text-sm">{item.title}</h3>
                </div>
              ))}
            </div>

            {/* Tech Benefits */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#1c3c33] mb-10 sm:mb-12">{t[lang].techBenefits}</h2>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center group p-6 rounded-3xl hover:bg-white transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#E0F2F1] rounded-2xl flex items-center justify-center text-[#00897B] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h4 className="font-bold text-[#1c3c33] mb-1">{t[lang].responsiveApp}</h4>
                <p className="text-xs text-[#1c3c33]/60">{t[lang].noInstall}</p>
              </div>
              <div className="text-center group p-6 rounded-3xl hover:bg-white transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#E3F2FD] rounded-2xl flex items-center justify-center text-[#1E88E5] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                </div>
                <h4 className="font-bold text-[#1c3c33] mb-1">{t[lang].cloudBased}</h4>
                <p className="text-xs text-[#1c3c33]/60">{t[lang].dataSecure}</p>
              </div>
              <div className="text-center group p-6 rounded-3xl hover:bg-white transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F3E5F5] rounded-2xl flex items-center justify-center text-[#8E24AA] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </div>
                <h4 className="font-bold text-[#1c3c33] mb-1">{t[lang].universalAccess}</h4>
                <p className="text-xs text-[#1c3c33]/60">{t[lang].loginAnywhere}</p>
              </div>
              <div className="text-center group p-6 rounded-3xl hover:bg-white transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#FFF3E0] rounded-2xl flex items-center justify-center text-[#FB8C00] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h4 className="font-bold text-[#1c3c33] mb-1">{t[lang].crossDevice}</h4>
                <p className="text-xs text-[#1c3c33]/60">{t[lang].anyDevice}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-[#1c3c33]">{t[lang].servicesTitle}</h3>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: t[lang].traditional, desc: t[lang].traditionalDesc },
              { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", title: t[lang].modernInstitute, desc: t[lang].modernDesc },
              { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", title: t[lang].mosques, desc: t[lang].mosquesDesc },
              { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: t[lang].online, desc: t[lang].onlineDesc }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl border border-[#2F6B4F]/10 hover:border-[#2F6B4F]/30 hover:shadow-lg transition-all group bg-white">
                <div className="w-16 h-16 rounded-2xl bg-[#F1F8E9] flex items-center justify-center text-[#2F6B4F] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                </div>
                <h4 className="font-bold text-[#1c3c33] mb-2">{item.title}</h4>
                <p className="text-xs text-[#1c3c33]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA Section - Green Wave */}
      <section className="relative mt-20">
        <div className="absolute top-0 left-0 w-full translate-y-[-98%]">
          <svg className="w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#2F6B4F" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="bg-[#2F6B4F] pt-0 pb-16 relative z-10">
          {/* Background Texture - Multiply floral */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/decor-flowers.png')] bg-repeat bg-[length:400px_400px] mix-blend-multiply"></div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md">
              {t[lang].ctaTitle}
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10">{t[lang].ctaDesc}</p>

            <div className="mb-16">
              <Link href="/register" className="inline-block bg-[#F3D083] text-[#1c3c33] font-bold px-10 py-3 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:bg-[#ffe082] hover:scale-105 transition-all outline-none">
                {t[lang].getStarted}
              </Link>
            </div>

            {/* Footer Info Grid */}
            <div className="grid md:grid-cols-4 gap-8 text-left border-t border-white/20 pt-10 text-white/90 break-words">
              <div className="md:col-span-2">
                <span className="text-2xl font-black italic tracking-tight text-white mb-4 block">
                  Rahmah HMS
                </span>
                <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                  {t[lang].footerDesc}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#F3D083] mb-4">{t[lang].contactUs}</h5>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#F3D083]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    info@rahmahhms.com
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#F3D083]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    +92 (320) 419-9100
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-[#F3D083] mb-4">{t[lang].officeLocation}</h5>
                <p className="text-sm text-white/80">
                  114-7A, Commercial Broadway<br />DHA Phase 8, Lahore
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40">
              {t[lang].copyright}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
