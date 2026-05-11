import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { Suspense } from 'react';

const adminItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Daily Progress', href: '/progress', icon: '📖' },
    { name: 'Attendance', href: '/attendance', icon: '📅' },
    { name: 'Exams', href: '/exams', icon: '📝' },
    { name: 'Staff', href: '/staff', icon: '👨‍🏫' },
    { name: 'Classes', href: '/classes', icon: '📚' },
    { name: 'Students', href: '/students', icon: '👤' },
    { name: 'Reports', href: '/reports', icon: '📉' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'My Profile', href: '/settings/profile', icon: '👤' },
];

const teacherItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Daily Progress', href: '/progress', icon: '📖' },
    { name: 'Attendance', href: '/attendance', icon: '📅' },
    { name: 'Exams', href: '/exams', icon: '📝' },
    { name: 'Classes', href: '/classes', icon: '📚' },
    { name: 'Students', href: '/students', icon: '👤' },
    { name: 'Reports', href: '/reports', icon: '📉' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'My Profile', href: '/settings/profile', icon: '👤' },
];

const studentItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Daily Progress', href: '/progress', icon: '📖' },
    { name: 'Attendance', href: '/attendance', icon: '📅' },
    { name: 'Exams', href: '/exams', icon: '📝' },
    { name: 'Classes', href: '/classes', icon: '📚' },
    { name: 'Join Madrasah', href: '/students/join', icon: '🏫' },
    { name: 'Reports', href: '/reports', icon: '📉' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'My Profile', href: '/settings/profile', icon: '👤' },
];

const guestItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Register Madrasah', href: '/register', icon: '🏢' },
    { name: 'Join Madrasah', href: '/students/join', icon: '🏫' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
];

const secondaryItems = [
    { name: 'Feedback', href: '/feedback', icon: '💬' },
    { name: 'Logout', href: '/sign-out', icon: '🚪' },
];

function SidebarInner({
    className,
    onNavigate,
}: {
    className?: string;
    onNavigate?: () => void;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || 'guest';
    const sidebarItems = role === 'teacher' ? teacherItems : 
                        role === 'student' ? studentItems : 
                        role === 'admin' ? adminItems : 
                        guestItems;

    return (
        <aside className={clsx("hidden h-screen w-72 shrink-0 border-r border-white/5 bg-[#1c3c33] shadow-lg print:hidden lg:relative lg:flex lg:flex-col lg:overflow-y-auto", className)}>
            <div className="p-6 border-b border-white/5 mb-4">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-[#1c3c33] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-105 transition-transform overflow-hidden border border-white/10">
                        <Image src="/rahmah-logo.svg" alt="RAHMAH Logo" width={48} height={48} className="object-cover" priority />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">RAHMAH</h2>
                        <p className="text-xs font-medium text-white/60 uppercase tracking-wide">Management System</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-6 space-y-1 scrollbar-thin scrollbar-thumb-white/10 overflow-y-auto">
                <div className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={{ pathname: item.href, query: { role } }}
                                onClick={onNavigate}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-white text-[#1c3c33] shadow-md'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <span className={`text-lg transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                                    {item.icon}
                                </span>
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="pt-6 pb-4 space-y-1 border-t border-white/5 mt-6">
                    {secondaryItems.map((item) => (
                        <Link
                            key={item.href}
                            href={{ pathname: item.href, query: { role } }}
                            onClick={onNavigate}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                        >
                            <span className="text-lg group-hover:scale-105 transition-transform">
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="p-4">
                <div className="bg-[#2F6B4F] p-5 rounded-2xl text-white shadow-lg relative overflow-hidden group border border-white/10">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-[#F3D083] uppercase tracking-wide">Support Center</p>
                        <p className="text-sm font-bold mt-1">Need Help?</p>
                        <button className="mt-4 w-full py-2.5 bg-white text-[#1c3c33] rounded-lg text-xs font-bold uppercase tracking-wide transition-all hover:bg-[#F3D083] hover:shadow-md">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export function Sidebar({
    className,
    onNavigate,
}: {
    className?: string;
    onNavigate?: () => void;
}) {
    return (
        <Suspense fallback={<aside className={clsx("hidden h-screen w-72 shrink-0 border-r border-white/5 bg-[#1c3c33] lg:flex", className)} />}>
            <SidebarInner className={className} onNavigate={onNavigate} />
        </Suspense>
    );
}
