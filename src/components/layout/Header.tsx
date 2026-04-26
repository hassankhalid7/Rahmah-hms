import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { NotificationCenter } from './NotificationCenter';

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="h-20 bg-[#F7F1E6]/80 backdrop-blur-md border-b border-[#1c3c33]/5 sticky top-0 z-40 transition-all duration-200">
            <div className="h-full px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-xs font-bold text-[#1c3c33]/50 uppercase tracking-widest">Dashboard</p>
                        <h1 className="text-xl font-bold text-[#1c3c33] tracking-tight">Overview</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4 px-1 py-1 bg-white/50 border border-[#1c3c33]/10 rounded-full hover:bg-white hover:shadow-md transition-all duration-200">
                        <LanguageToggle />
                    </div>

                    <div className="h-8 w-px bg-[#1c3c33]/10 mx-2"></div>

                    <div className="flex items-center gap-5">
                        <NotificationCenter />

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#1c3c33]">
                                    {user?.firstName || 'Rahmah'} {user?.lastName || 'Admin'}
                                </p>
                                <p className="text-xs font-semibold text-[#1c3c33]/50 capitalize">
                                    {(user?.publicMetadata?.role as string)?.replace('_', ' ') || 'Administrator'}
                                </p>
                            </div>
                            <Link href="/settings" className="relative group">
                                <div className="h-11 w-11 rounded-full bg-white border-2 border-white shadow-lg shadow-black/5 overflow-hidden group-hover:scale-105 transition-transform duration-200">
                                    <div className="h-full w-full bg-[#1c3c33] flex items-center justify-center text-white">
                                        <span className="text-lg">👤</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#2F6B4F] rounded-full border-2 border-[#F7F1E6]"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
