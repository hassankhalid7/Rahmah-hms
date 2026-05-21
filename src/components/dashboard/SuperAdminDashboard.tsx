export default function SuperAdminDashboard({ user }: { user: any }) {
    return (
        <div className="w-full text-[#1c3c33] animate-in fade-in duration-500">
            <div className="space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-4 border-b border-[#2F6B4F]/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#2F6B4F] rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-[#2F6B4F]/20">رحمة</div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1c3c33]">Rahmah Central</h1>
                            <p className="text-sm font-bold text-[#2F6B4F]">Global Management System</p>
                            <p className="text-sm text-[#1c3c33]/65">Manage all institutes and system configurations.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-white text-[#1c3c33] border border-[#d0d8cf] rounded-xl text-xs font-bold hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors shadow-sm">System Status</button>
                        <button className="px-4 py-2.5 bg-[#2F6B4F] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-colors">Add Institute</button>
                    </div>
                </header>

                {/* Platform Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <PlatformStat label="Active Institutes" value="48" change="+3 this month" icon="🏢" color="text-[#2F6B4F]" bg="bg-[#E5F4EC]" />
                    <PlatformStat label="Total Students" value="12.4k" change="+820 this month" icon="👥" color="text-[#F57C00]" bg="bg-[#FFF3E0]" />
                    <PlatformStat label="Monthly Revenue" value="$4,250" change="+15% growth" icon="💰" color="text-[#00897B]" bg="bg-[#F0F4F8]" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* System Status */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1c3c33]/5 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black tracking-tight text-[#1c3c33] flex items-center gap-3">
                                <span className="w-3 h-3 bg-[#2F6B4F] rounded-full animate-pulse"></span>
                                System Health
                            </h2>
                            <span className="text-xs font-bold text-[#2F6B4F] bg-[#E5F4EC] px-3 py-1 rounded-full">All Systems Operational</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <HealthMetric label="Server Uptime" value="99.9%" status="optimal" />
                            <HealthMetric label="Response Time" value="48ms" status="optimal" />
                            <HealthMetric label="CPU Usage" value="14%" status="optimal" />
                            <HealthMetric label="Active Sessions" value="2.1k" status="optimal" />
                        </div>

                        {/* Recent Institutes */}
                        <div className="border-t border-[#1c3c33]/5 pt-6">
                            <h3 className="text-lg font-black text-[#1c3c33] mb-4">Recent Institutes</h3>
                            <div className="space-y-3">
                                <InstituteRow name="Darul Uloom Karachi" students={1200} plan="Enterprise" status="Active" />
                                <InstituteRow name="Madrasa Al-Madina" students={850} plan="Professional" status="Active" />
                                <InstituteRow name="Hifz Academy UK" students={420} plan="Basic" status="Setup" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <ControlAction icon="🏢" title="New Institute" desc="Add organization" color="bg-[#2F6B4F] text-white shadow-lg shadow-[#2F6B4F]/20" />
                        <ControlAction icon="⚙️" title="System Config" desc="Global settings" color="bg-white border border-[#d0d8cf] text-[#1c3c33]" />
                        <ControlAction icon="📄" title="Access Logs" desc="Security monitoring" color="bg-white border border-[#d0d8cf] text-[#1c3c33]" />

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F3D083]/10 to-[#2F6B4F]/10 border border-[#1c3c33]/5 shadow-sm">
                            <h3 className="text-lg font-black mb-2 text-[#1c3c33]">System Status</h3>
                            <p className="text-sm text-[#1c3c33]/70 mb-4 leading-relaxed">All systems operational. Data synchronized and secure.</p>
                            <button className="w-full py-2.5 bg-[#2F6B4F] text-white rounded-xl text-xs font-bold hover:bg-[#285c44] transition-colors">Run Diagnostics</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlatformStat({ label, value, change, icon, color, bg }: { label: string; value: string; change: string; icon: string; color: string; bg: string }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-[#1c3c33]/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${bg} ${color}`}>{icon}</div>
            </div>
            <div>
                <p className="text-xs font-bold text-[#1c3c33]/70 mb-1">{label}</p>
                <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-[#1c3c33] tracking-tight">{value}</p>
                    <span className="text-xs font-medium text-[#1c3c33]/60 bg-[#1c3c33]/5 px-2 py-1 rounded-md">{change}</span>
                </div>
            </div>
        </div>
    );
}

function HealthMetric({ label, value, status }: { label: string; value: string; status: string }) {
    return (
        <div className="p-4 bg-[#FDFBF7] border border-[#d0d8cf]/50 rounded-xl hover:border-[#2F6B4F]/30 transition-all">
            <p className="text-xs font-bold text-[#1c3c33]/70 mb-1">{label}</p>
            <p className="text-lg font-black text-[#1c3c33] tracking-tight">{value}</p>
        </div>
    );
}

function InstituteRow({ name, students, plan, status }: { name: string; students: number; plan: string; status: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-[#FDFBF7] border border-[#d0d8cf]/50 rounded-xl hover:border-[#2F6B4F]/30 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E5F4EC] rounded-lg flex items-center justify-center text-sm">🕌</div>
                <div>
                    <h3 className="text-sm font-bold text-[#1c3c33]">{name}</h3>
                    <p className="text-xs text-[#1c3c33]/60">{students} students • {plan} • {status}</p>
                </div>
            </div>
            <button className="px-3 py-1.5 border border-[#d0d8cf] rounded-lg text-xs font-bold text-[#1c3c33] hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors">
                Manage
            </button>
        </div>
    );
}

function ControlAction({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
    return (
        <button className={`w-full p-4 text-left rounded-xl ${color} hover:scale-[1.02] transition-all active:scale-95`}>
            <div className="text-2xl mb-3">{icon}</div>
            <h3 className="font-bold text-sm tracking-tight">{title}</h3>
            <p className="text-xs mt-1 opacity-80">{desc}</p>
        </button>
    );
}

