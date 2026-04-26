'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { isDemoMode } from '@/lib/auth';

function ClerkSignOutTrigger() {
    const { signOut } = useClerk();
    useEffect(() => {
        signOut();
    }, [signOut]);
    return null;
}

export default function SignOutPage() {
    const router = useRouter();

    useEffect(() => {
        if (isDemoMode) {
            const timer = setTimeout(() => {
                router.push('/sign-in');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-[#F7F1E6] flex flex-col items-center justify-center p-6 text-center">
            {!isDemoMode && <ClerkSignOutTrigger />}

            <div className="w-20 h-20 bg-[#1c3c33] rounded-[32px] flex items-center justify-center text-3xl shadow-2xl mb-8 animate-bounce transition-transform hover:scale-110">
                🚪
            </div>
            <h1 className="text-3xl font-black text-[#1c3c33] tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">Signing You Out...</h1>
            <p className="text-[#1c3c33]/60 font-medium animate-in fade-in duration-1000 delay-300">Please wait a moment while we secure your session.</p>

            <div className="mt-12 flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#2F6B4F] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-[#2F6B4F] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-[#2F6B4F] rounded-full animate-bounce"></div>
            </div>
        </div>
    );
}
