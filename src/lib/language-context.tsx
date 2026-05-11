'use client';

import React, { createContext, useContext, useState } from 'react';

type Lang = 'en' | 'ur';

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (en: string, ur: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    setLang: () => {},
    t: (en) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>('en');

    const t = (en: string, ur: string) => (lang === 'ur' ? ur : en);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
