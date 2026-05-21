'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';

export function LanguageToggle() {
    const { lang, setLang } = useLanguage();

    const toggle = () => {
        setLang(lang === 'en' ? 'ur' : 'en');
    };

    return (
        <button
            onClick={toggle}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-brand-50 rounded-xl transition-all border border-gray-100 group"
        >
            <span className="text-xs font-bold text-[#1c3c33]/70 group-hover:text-[#2F6B4F]">
                {lang === 'en' ? 'Urdu / زبان تبدیل کریں' : 'English / انگریزی'}
            </span>
            <span className="text-lg grayscale group-hover:grayscale-0">
                {lang === 'en' ? '🇵🇰' : '🇬🇧'}
            </span>
        </button>
    );
}
