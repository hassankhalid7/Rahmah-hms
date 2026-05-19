'use client';

import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/ui/SplashScreen';

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // Show splash for 3.2 seconds total
        // 2.5s delay + 0.7s fade out = 3.2s
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {showSplash && <SplashScreen />}
            <div className={showSplash ? 'hidden' : 'block'}>
                {children}
            </div>
        </>
    );
}
