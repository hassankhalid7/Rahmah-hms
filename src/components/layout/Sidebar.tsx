import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { Suspense } from 'react';

const adminItems = [
    { name: 'Dashboard',      href: '/dashboard',        icon: '📊' },
    { name: 'Daily Progress', href: '/progress',         icon: '📖' },
    { name: 'Attendance',     href: '/attendance',       icon: '📅' },
    { name: 'Exams',          href: '/exams',            icon: '📝' },
    { name: 'Staff',          href: '/staff',            icon: '👨‍🏫' },
    { name: 'Classes',        href: '/classes',          icon: '📚' },
    { name: 'Students',       href: '/students',         icon: '👤' },
    { name: 'Reports',        href: '/reports',          icon: '📉' },
    { name: 'Settings',       href: '/settings',         icon: '⚙️' },
    { name: 'My Profile',     href: '/settings/profile', icon: '🪪' },
];

const teacherItems = [
    { name: 'Dashboard',      href: '/dashboard',        icon: '📊' },
    { name: 'Daily Progress', href: '/progress',         icon: '📖' },
    { name: 'Attendance',     href: '/attendance',       icon: '📅' },
    { name: 'Exams',          href: '/exams',            icon: '📝' },
    { name: 'Classes',        href: '/classes',          icon: '📚' },
    { name: 'Students',       href: '/students',         icon: '👤' },
    { name: 'Reports',        href: '/reports',          icon: '📉' },
    { name: 'Settings',       href: '/settings',         icon: '⚙️' },
    { name: 'My Profile',     href: '/settings/profile', icon: '🪪' },
];

const studentItems = [
    { name: 'Dashboard',      href: '/dashboard',        icon: '📊' },
    { name: 'Daily Progress', href: '/progress',         icon: '📖' },
    { name: 'Attendance',     href: '/attendance',       icon: '📅' },
    { name: 'Exams',          href: '/exams',            icon: '📝' },
    { name: 'Classes',        href: '/classes',          icon: '📚' },
    { name: 'Join Madrasah',  href: '/students/join',    icon: '🏫' },
    { name: 'Reports',        href: '/reports',          icon: '📉' },
    { name: 'Settings',       href: '/settings',         icon: '⚙️' },
    { name: 'My Profile',     href: '/settings/profile', icon: '🪪' },
];

const guestItems = [
    { name: 'Dashboard',         href: '/dashboard',     icon: '📊' },
    { name: 'Register Madrasah', href: '/register',      icon: '🏢' },
    { name: 'Join Madrasah',     href: '/students/join', icon: '🏫' },
    { name: 'Settings',          href: '/settings',      icon: '⚙️' },
];

const secondaryItems = [
    { name: 'Feedback', href: '/feedback', icon: '💬' },
    { name: 'Logout',   href: '/sign-out', icon: '🚪' },
];

function SidebarInner({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
    const pathname    = usePathname();
    const searchParams = useSearchParams();
    const role        = searchParams.get('role') || 'guest';

    const sidebarItems =
        role === 'teacher' ? teacherItems :
        role === 'student' ? studentItems :
        role === 'admin'   ? adminItems   :
        guestItems;

    return (
        <aside
            className={clsx(
                'flex w-full h-full shrink-0 bg-[#1c3c33] print:hidden flex-col',
                className
            )}
        >
            {/* ── Logo ── */}
            <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/5">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-xl bg-[#1c3c33] border border-white/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        <Image src="/rahmah-logo.svg" alt="RAHMAH" width={32} height={32} className="object-cover w-full h-full" priority />
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-black text-white tracking-tight">RAHMAH</p>
                        <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider">Management System</p>
                    </div>
                </Link>
            </div>

            {/* ── Nav ── */}
            <nav className="flex-1 flex flex-col justify-between px-3 py-3 overflow-y-auto">
                {/* Primary items */}
                <div className="space-y-0.5">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={{ pathname: item.href, query: { role } }}
                                onClick={onNavigate}
                                className={clsx(
                                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group',
                                    isActive
                                        ? 'bg-white text-[#1c3c33] shadow-sm'
                                        : 'text-white/75 hover:text-white hover:bg-white/10'
                                )}
                            >
                                <span className={clsx('text-sm shrink-0 transition-transform duration-150', isActive ? '' : 'group-hover:scale-110')}>
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Secondary items — pinned to bottom */}
                <div className="mt-3 pt-3 border-t border-white/5 space-y-0.5">
                    {secondaryItems.map((item) => (
                        <Link
                            key={item.href}
                            href={{ pathname: item.href, query: { role } }}
                            onClick={onNavigate}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-white/65 hover:text-white hover:bg-white/10 transition-all duration-150 group"
                        >
                            <span className="text-sm shrink-0 group-hover:scale-110 transition-transform duration-150">
                                {item.icon}
                            </span>
                            <span className="truncate">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </aside>
    );
}

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
    return (
        <Suspense
            fallback={
                <aside className={clsx('flex w-full h-full bg-[#1c3c33]', className)} />
            }
        >
            <SidebarInner className={className} onNavigate={onNavigate} />
        </Suspense>
    );
}
