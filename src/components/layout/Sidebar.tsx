import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const sidebarItems = [
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

const secondaryItems = [
    { name: 'Feedback', href: '/feedback', icon: '💬' },
    { name: 'Logout', href: '/sign-out', icon: '🚪' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-80 bg-[#1c3c33] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto print:hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 mb-6">
                <Link href="/dashboard" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-[#1c3c33] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform overflow-hidden border border-white/10">
                        <Image src="/rahmah-logo.svg" alt="RAHMAH Logo" width={48} height={48} className="object-cover" priority />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">RAHMAH</h2>
                        <p className="text-xs font-medium text-white/50 uppercase tracking-wider mt-0.5">Management System</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 overflow-y-auto">
                <div className="space-y-1.5">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-white text-[#1c3c33] shadow-lg'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <span className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="pt-8 pb-4 space-y-1.5 border-t border-white/5 mt-8">
                    {secondaryItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-4 px-6 py-3.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="p-6">
                <div className="bg-[#2F6B4F] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group border border-white/10">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-[#F3D083] uppercase tracking-wider">Support Center</p>
                        <p className="text-sm font-bold mt-1">Need Help?</p>
                        <button className="mt-4 w-full py-2.5 bg-white text-[#1c3c33] rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#F3D083] hover:shadow-lg">
                            Contact Support
                        </button>
                    </div>
                    <div className="absolute -bottom-6 -right-6 text-6xl text-white/5 font-black uppercase italic select-none">Help</div>
                </div>
            </div>
        </aside>
    );
}
