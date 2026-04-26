'use client';

import React, { useState } from 'react';

export function LanguageToggle() {
    const [lang, setLang] = useState<'en' | 'ur'>('en');

    const toggle = () => {
        const next = lang === 'en' ? 'ur' : 'en';
        setLang(next);
        // In a real app, this would change the i18n context or reload localized content
        // For demo, we just toast or change the label
        console.log(`Language changed to: ${next}`);
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
