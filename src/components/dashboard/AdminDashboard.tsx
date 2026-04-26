export default function AdminDashboard({ user }: { user: any }) {
    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 text-[#1c3c33] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2F6B4F]/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">🕋</span>
                            <h1 className="text-3xl lg:text-4xl font-black text-[#1c3c33] tracking-tight">Admin Dashboard</h1>
                        </div>
                        <p className="text-[#1c3c33]/60 font-bold text-sm">Welcome back, {user?.firstName || 'Admin'}. Here is your institute overview.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white text-[#1c3c33] border border-[#d0d8cf] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-all shadow-sm">Reporting</button>
                        <button className="px-6 py-3 bg-[#2F6B4F] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-all">Add Student</button>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Students" value="128" icon="👥" sub="+12 this month" color="bg-[#E5F4EC] text-[#2F6B4F]" />
                    <StatCard title="Active Staff" value="12" icon="👨‍🏫" sub="All present today" color="bg-[#FFF3E0] text-[#F57C00]" />
                    <StatCard title="Avg Attendance" value="94%" icon="📊" sub="Last 30 days" color="bg-[#F0F4F8] text-[#00897B]" />
                    <StatCard title="Daily Classes" value="8" icon="🏫" sub="Currently active" color="bg-[#F3E5F5] text-[#8E24AA]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Recent Activity / Enrollments */}
                    <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)] group">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight flex items-center gap-3">
                                <span className="text-3xl">📥</span>
                                Recent Enrollments
                            </h2>
                            <button className="text-[10px] font-black text-[#2F6B4F] uppercase tracking-widest hover:underline">View All</button>
                        </div>
                        <Table items={[
                            { name: 'Ahmed Khan', class: 'Halaqa A', date: 'Feb 01, 2026', status: 'Active' },
                            { name: 'Fatima Ali', class: 'Nazra B', date: 'Feb 03, 2026', status: 'Pending' },
                            { name: 'Yusuf Raza', class: 'Qaida 1', date: 'Feb 05, 2026', status: 'Active' },
                            { name: 'Zaid Siddiqui', class: 'Hifz 2', date: 'Feb 06, 2026', status: 'Active' },
                        ]} />
                    </div>

                    {/* Quick Access / Help */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-8 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)] relative overflow-hidden">
                            <div className="flex items-center mb-6">
                                <h2 className="text-xl font-black text-[#1c3c33] tracking-tight flex items-center gap-3">
                                    <span className="text-2xl">📋</span>
                                    Latest Updates
                                </h2>
                            </div>
                            <div className="space-y-6">
                                <ActivityItem icon="✅" user="Teacher Bilal" text="marked attendance" time="15m ago" />
                                <ActivityItem icon="📝" user="Teacher Maryam" text="added progress logs" time="45m ago" />
                                <ActivityItem icon="🔔" user="System" text="generated reports" time="2h ago" />
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#1c3c33] p-8 md:p-10 rounded-[40px] text-white shadow-2xl shadow-[#1c3c33]/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Need Assistance?</h3>
                                <p className="text-xs text-white/70 font-medium mb-8 leading-relaxed">Access the help center or contact our support team directly.</p>
                                <button className="w-full py-4 bg-[#F3D083] text-[#1c3c33] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ffe082] transition-colors shadow-lg">Contact Support</button>
                            </div>
                            {/* Abstract decorative element */}
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, sub, color }: { title: string; value: string; icon: string; sub: string; color: string }) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-[#1c3c33]/5 shadow-[0_10px_30px_rgba(28,60,51,0.03)] flex flex-col hover:shadow-[0_20px_40px_rgba(28,60,51,0.06)] hover:-translate-y-1 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 group-hover:rotate-6 ${color}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-xs font-black text-[#1c3c33]/40 uppercase tracking-widest mb-1">{title}</p>
                <div className="flex items-end justify-between">
                    <p className="text-4xl font-black text-[#1c3c33] tracking-tight">{value}</p>
                    <span className="text-[10px] font-bold text-[#1c3c33]/40 bg-[#1c3c33]/5 px-2 py-1 rounded-md">{sub}</span>
                </div>
            </div>
        </div>
    );
}

function Table({ items }: { items: any[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-[#1c3c33]/5 text-[10px] font-black text-[#1c3c33]/30 uppercase tracking-widest">
                        <th className="pb-4 font-black">Student Name</th>
                        <th className="pb-4 font-black">Assigned Class</th>
                        <th className="pb-4 font-black">Join Date</th>
                        <th className="pb-4 font-black">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1c3c33]/5">
                    {items.map((item, i) => (
                        <tr key={i} className="hover:bg-[#FDFBF7] transition-colors group">
                            <td className="py-4">
                                <p className="font-bold text-sm text-[#1c3c33]">{item.name}</p>
                            </td>
                            <td className="py-4">
                                <p className="text-xs font-bold text-[#1c3c33]/60">{item.class}</p>
                            </td>
                            <td className="py-4">
                                <p className="text-xs font-medium text-[#1c3c33]/50">{item.date}</p>
                            </td>
                            <td className="py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'Active' ? 'bg-[#E5F4EC] text-[#2F6B4F]' : 'bg-[#FFF3E0] text-[#F57C00]'}`}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ActivityItem({ icon, user, text, time }: { icon: string; user: string; text: string; time: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="w-10 h-10 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-lg border border-[#d0d8cf] shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm text-[#1c3c33]/70 font-medium">
                    <span className="font-bold text-[#1c3c33] group-hover:text-[#2F6B4F] transition-colors">{user}</span> {text}
                </p>
                <p className="text-[10px] font-black text-[#1c3c33]/30 uppercase tracking-widest mt-1">{time}</p>
            </div>
        </div>
    );
}
