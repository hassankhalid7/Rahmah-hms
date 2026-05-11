export default function TeacherDashboard({ user }: { user: any }) {
    return (
        <div className="w-full text-[#1c3c33] animate-in fade-in duration-500">
            <div className="space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-4 border-b border-[#2F6B4F]/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">👨‍🏫</span>
                            <h1 className="text-2xl sm:text-3xl font-black text-[#1c3c33] tracking-tight">Teacher Dashboard</h1>
                        </div>
                        <p className="text-sm font-bold text-[#2F6B4F]">Faizan e Ashab e Sufa</p>
                        <p className="text-sm text-[#1c3c33]/65">Welcome back, {user?.firstName || 'Teacher'}. You have 3 active classes today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-white text-[#1c3c33] border border-[#d0d8cf] rounded-xl text-xs font-bold hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors shadow-sm">My Schedule</button>
                        <button className="px-4 py-2.5 bg-[#2F6B4F] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-colors">My Students</button>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard title="Total Students" value="42" icon="👥" sub="Across all classes" color="bg-[#E5F4EC] text-[#2F6B4F]" />
                    <StatCard title="Today's Attendance" value="98%" icon="📊" sub="Excellent" color="bg-[#FFF3E0] text-[#F57C00]" />
                    <StatCard title="Pending Progress" value="18" icon="📝" sub="Logs needed today" color="bg-[#F0F4F8] text-[#00897B]" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* My Classes */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#1c3c33]/5 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-[#1c3c33] tracking-tight flex items-center gap-3">
                                <span className="text-2xl">📚</span>
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
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#1c3c33]/5 shadow-sm">
                        <div className="flex items-center mb-6">
                            <h2 className="text-xl font-black text-[#1c3c33] tracking-tight flex items-center gap-3">
                                <span className="text-2xl">⚡</span>
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
        <div className="bg-white p-5 rounded-xl border border-[#1c3c33]/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-transform hover:scale-110 ${color}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-[#1c3c33]/70 mb-1">{title}</p>
                <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-[#1c3c33] tracking-tight">{value}</p>
                    <span className="text-xs font-medium text-[#1c3c33]/60 bg-[#1c3c33]/5 px-2 py-1 rounded-md">{sub}</span>
                </div>
            </div>
        </div>
    );
}

function ClassItem({ name, students, time, bg, color }: { name: string; students: number; time: string; bg: string; color: string }) {
    return (
        <div className="p-4 bg-white border border-[#d0d8cf]/50 rounded-xl hover:border-[#2F6B4F]/30 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg} ${color}`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" /></svg>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-[#1c3c33] tracking-tight group-hover:text-[#2F6B4F] transition-colors">{name}</h3>
                    <p className="text-xs font-medium text-[#1c3c33]/60 mt-0.5">{students} Students • {time}</p>
                </div>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 bg-[#FDFBF7] text-[#1c3c33] text-xs font-bold rounded-lg border border-[#d0d8cf] hover:bg-[#2F6B4F] hover:text-white hover:border-[#2F6B4F] transition-all">
                Manage
            </button>
        </div>
    );
}

function QuickTask({ icon, label, description, bg, color }: { icon: string; label: string; description: string; bg: string; color: string }) {
    return (
        <button className="p-4 text-left bg-white border border-[#d0d8cf]/50 rounded-xl hover:border-[#2F6B4F]/30 hover:shadow-lg transition-all group active:scale-95 flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/20">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3 transition-transform group-hover:scale-110 ${bg} ${color}`}>
                {icon}
            </div>
            <h3 className="font-bold text-[#1c3c33] text-sm group-hover:text-[#2F6B4F] tracking-tight">{label}</h3>
            <p className="text-xs font-medium text-[#1c3c33]/60 mt-1 leading-tight">{description}</p>
        </button>
    );
}
