export default function TeacherDashboard({ user }: { user: any }) {
    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 text-[#1c3c33] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2F6B4F]/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">👨‍🏫</span>
                            <h1 className="text-3xl lg:text-4xl font-black text-[#1c3c33] tracking-tight">Teacher Dashboard</h1>
                        </div>
                        <p className="text-[#1c3c33]/60 font-bold text-sm">Welcome back, {user?.firstName || 'Teacher'}. You have 3 active classes today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white text-[#1c3c33] border border-[#d0d8cf] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-all shadow-sm">My Schedule</button>
                        <button className="px-6 py-3 bg-[#2F6B4F] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-all">My Students</button>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Students" value="42" icon="👥" sub="Across all classes" color="bg-[#E5F4EC] text-[#2F6B4F]" />
                    <StatCard title="Today's Attendance" value="98%" icon="📊" sub="Excellent" color="bg-[#FFF3E0] text-[#F57C00]" />
                    <StatCard title="Pending Progress" value="18" icon="📝" sub="Logs needed today" color="bg-[#F0F4F8] text-[#00897B]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* My Classes */}
                    <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)] group">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight flex items-center gap-3">
                                <span className="text-3xl">📚</span>
                                My Assigned Classes
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <ClassItem name="Hifz Halaqa A" students={15} time="08:00 AM - 12:00 PM" bg="bg-[#E5F4EC]" color="text-[#2F6B4F]" />
                            <ClassItem name="Nazra Beginners" students={12} time="01:00 PM - 03:00 PM" bg="bg-[#FFF3E0]" color="text-[#F57C00]" />
                            <ClassItem name="Qaida Juniors" students={15} time="03:30 PM - 05:30 PM" bg="bg-[#F0F4F8]" color="text-[#00897B]" />
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)] group">
                        <div className="flex items-center mb-8">
                            <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight flex items-center gap-3">
                                <span className="text-3xl">⚡</span>
                                Quick Actions
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <QuickTask icon="✅" label="Attendance" description="Mark daily presence" bg="bg-[#E5F4EC]" color="text-[#2F6B4F]" />
                            <QuickTask icon="📖" label="Progress" description="Log Sabaq & Sabqi" bg="bg-[#FFF3E0]" color="text-[#F57C00]" />
                            <QuickTask icon="📝" label="Exams" description="Grade students" bg="bg-[#F0F4F8]" color="text-[#00897B]" />
                            <QuickTask icon="💬" label="Messages" description="Contact parents" bg="bg-[#F3E5F5]" color="text-[#8E24AA]" />
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

function ClassItem({ name, students, time, bg, color }: { name: string; students: number; time: string; bg: string; color: string }) {
    return (
        <div className="p-5 bg-white border border-[#d0d8cf] rounded-[24px] hover:border-[#2F6B4F]/30 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" /></svg>
                </div>
                <div>
                    <h3 className="text-lg font-black text-[#1c3c33] tracking-tight group-hover:text-[#2F6B4F] transition-colors">{name}</h3>
                    <p className="text-xs font-bold text-[#1c3c33]/50 mt-0.5">{students} Students • {time}</p>
                </div>
            </div>
            <button className="w-full sm:w-auto px-6 py-2.5 bg-[#FDFBF7] text-[#1c3c33] text-xs font-bold rounded-xl border border-[#d0d8cf] hover:bg-[#2F6B4F] hover:text-white hover:border-[#2F6B4F] transition-all">
                Manage
            </button>
        </div>
    );
}

function QuickTask({ icon, label, description, bg, color }: { icon: string; label: string; description: string; bg: string; color: string }) {
    return (
        <button className="p-6 text-left bg-white border border-[#d0d8cf] rounded-[24px] hover:border-[#2F6B4F]/30 hover:shadow-lg transition-all group active:scale-95 flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110 group-hover:-rotate-6 ${bg} ${color}`}>
                {icon}
            </div>
            <h3 className="font-black text-[#1c3c33] text-lg group-hover:text-[#2F6B4F] tracking-tight">{label}</h3>
            <p className="text-xs font-medium text-[#1c3c33]/50 mt-1 leading-tight">{description}</p>
        </button>
    );
}
