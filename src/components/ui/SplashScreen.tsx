'use client';

import React from 'react';

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDFBF7] animate-splash-fade-out pointer-events-none">
            <div className="flex flex-col items-center gap-4">
                {/* Logo/Name Animation */}
                <div className="relative overflow-hidden px-4 py-2">
                    <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter text-[#2F6B4F] animate-splash-fade-in">
                        Rahmah
                    </h1>
                    {/* Decorative line that slides in */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F3D083] translate-x-[-100%] animate-line-slide" />
                </div>

                {/* Powered by Text Animation */}
                <div className="flex flex-col items-center animate-fade-in-delayed">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1c3c33]/30">
                        by <span className="text-[#2F6B4F]">Nexira Labs</span>
                    </p>
                    
                    {/* Minimal Loading Indicator */}
                    <div className="mt-8 flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2F6B4F]/20 animate-dot-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2F6B4F]/40 animate-dot-bounce [animation-delay:150ms]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2F6B4F]/20 animate-dot-bounce [animation-delay:300ms]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
