import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { NotificationCenter } from './NotificationCenter';

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="h-16 bg-[#F7F1E6]/95 backdrop-blur-md border-b border-[#1c3c33]/5 sticky top-0 z-40 transition-all duration-200">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-xs font-bold text-[#1c3c33]/60">Dashboard</p>
                        <h1 className="text-lg font-bold text-[#1c3c33] tracking-tight">Overview</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-white/70 border border-[#1c3c33]/10 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200">
                        <LanguageToggle />
                    </div>

                    <div className="hidden sm:block h-6 w-px bg-[#1c3c33]/10"></div>

                    <div className="flex items-center gap-3">
                        <NotificationCenter />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#1c3c33]">
                                    {user?.firstName || 'Rahmah'} {user?.lastName || 'Admin'}
                                </p>
                                <p className="text-xs font-medium text-[#1c3c33]/60 capitalize">
                                    {(user?.role as string)?.replace('_', ' ') || 'Administrator'}
                                </p>
                            </div>
                            <Link href="/settings" className="relative group">
                                <div className="h-10 w-10 rounded-full bg-white border-2 border-white shadow-md overflow-hidden group-hover:scale-105 transition-transform duration-200">
                                    <div className="h-full w-full bg-[#1c3c33] flex items-center justify-center text-white">
                                        <span className="text-base">👤</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[#2F6B4F] rounded-full border-2 border-[#F7F1E6]"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
