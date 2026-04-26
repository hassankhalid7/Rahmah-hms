export default function SuperAdminDashboard({ user }: { user: any }) {
    return (
        <div className="min-h-screen bg-[#050505] p-8 md:p-12 text-white relative overflow-hidden">
            {/* High-Fidelity Background Ambience */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-white/5 pb-16">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-brand-500 rounded-[32px] flex items-center justify-center font-black text-3xl text-black shadow-[0_0_40px_rgba(0,209,255,0.3)] border border-brand-400/20 group hover:rotate-12 transition-transform whitespace-nowrap px-2">رحمة</div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter leading-none uppercase italic border-l-4 border-brand-500 pl-6">Rahmah Central</h1>
                            <p className="text-brand-400 font-black text-[10px] uppercase tracking-[0.4em] mt-3 opacity-60">Global Governance Matrix</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all backdrop-blur-xl group">
                            <span className="group-hover:rotate-180 inline-block transition-transform mr-2">🔄</span> Snapshot
                        </button>
                        <button className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white">
                            Override Config
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <PlatformStat label="Active Nodes" value="48" change="+3 Shift" icon="🏢" color="text-brand-400" />
                    <PlatformStat label="Global Entities" value="12.4k" change="+820 Delta" icon="👥" color="text-accent-400" />
                    <PlatformStat label="Revenue Flux" value="$4,250" change="+15% Vector" icon="💰" color="text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        {/* System Status Matrix */}
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[48px] border border-white/5 p-12 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[80px] -mr-32 -mt-32"></div>
                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-6 uppercase italic">
                                    <span className="w-4 h-4 bg-brand-500 rounded-full animate-ping shadow-[0_0_20px_rgba(0,209,255,0.8)]"></span>
                                    Core Resonance
                                </h2>
                                <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] bg-brand-500/10 px-6 py-2 rounded-full border border-brand-500/20">Operational</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                                <HealthMetric label="Uplink Latency" value="48ms" status="optimal" />
                                <HealthMetric label="Flux Density" value="12ms" status="optimal" />
                                <HealthMetric label="Process Load" value="14%" status="optimal" />
                                <HealthMetric label="Active Streams" value="2.1k" status="optimal" />
                            </div>
                        </div>

                        {/* Recent Onboarding Registry */}
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="p-12 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Member Registry</h2>
                                <button className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-brand-400 transition-colors">Manifest All →</button>
                            </div>
                            <div className="p-0 divide-y divide-white/5">
                                <InstituteRow name="Darul Uloom Karachi" students={1200} plan="Enterprise" status="Live" />
                                <InstituteRow name="Madrasa Al-Madina" students={850} plan="Professional" status="Live" />
                                <InstituteRow name="Hifz Academy UK" students={420} plan="Basic" status="Provisioning" />
                            </div>
                        </div>
                    </div>

                    {/* Sector Control Side */}
                    <div className="lg:col-span-4 space-y-8">
                        <ControlAction icon="🏢" title="Deploy New Node" desc="Initialize organization profile" color="bg-brand-500 text-black shadow-[0_0_30px_rgba(0,209,255,0.15)]" />
                        <ControlAction icon="⚙️" title="Architecture" desc="Global system parameters" color="bg-white/5 text-white border border-white/5" />
                        <ControlAction icon="📄" title="Intelligence Logs" desc="Security & access monitoring" color="bg-white/5 text-white border border-white/5" />

                        <div className="p-10 rounded-[48px] bg-gradient-to-br from-accent-600 to-accent-900 text-white shadow-2xl mt-16 group overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter">Nebula Mesh</h3>
                                <p className="text-sm text-white/60 font-medium mb-8 leading-relaxed">Cluster synchronization complete. All data shards are encrypted and verified.</p>
                                <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl">Integrity Check</button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 text-[120px] font-black italic opacity-10 select-none transition-transform group-hover:scale-110 uppercase">RAH</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlatformStat({ label, value, change, icon, color }: { label: string; value: string; change: string; icon: string; color: string }) {
    return (
        <div className="bg-white/5 backdrop-blur-2xl p-12 rounded-[48px] border border-white/5 relative z-10 group hover:border-brand-500/30 transition-all duration-500">
            <div className={`text-4xl mb-8 group-hover:scale-125 transition-transform duration-500 ${color}`}>{icon}</div>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{label}</p>
            <div className="flex items-baseline gap-4">
                <h3 className="text-6xl font-black tracking-tighter text-glow">{value}</h3>
                <span className="text-brand-500 text-[10px] font-black uppercase tracking-[0.2em]">{change}</span>
            </div>
            <div className="absolute bottom-0 right-0 p-10 font-black text-white/[0.02] text-[160px] leading-none -z-10 select-none group-hover:text-white/[0.05] transition-all duration-500 italic uppercase">Log</div>
        </div>
    );
}

function HealthMetric({ label, value, status }: { label: string; value: string; status: string }) {
    return (
        <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] group hover:bg-white/10 transition-all border-l-4 border-l-transparent hover:border-l-brand-500">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-2 group-hover:text-brand-400 transition-colors">{label}</p>
            <p className="text-3xl font-black tracking-tighter">{value}</p>
        </div>
    );
}

function InstituteRow({ name, students, plan, status }: { name: string; students: number; plan: string; status: string }) {
    return (
        <div className="flex items-center justify-between p-10 hover:bg-white/[0.03] transition-all border-l-4 border-transparent hover:border-brand-500 group">
            <div className="flex items-center gap-8">
                <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform border border-white/5">🕌</div>
                <div>
                    <h3 className="text-xl font-black text-white/90 group-hover:text-brand-400 transition-colors uppercase tracking-tight italic">{name}</h3>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-1">{students} Entities // {plan} // <span className="text-brand-500">{status}</span></p>
                </div>
            </div>
            <button className="px-8 py-4 border border-white/5 hover:border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Interface Matrix</button>
        </div>
    );
}

function ControlAction({ icon, title, desc, color, border }: { icon: string; title: string, desc: string, color: string, border?: string }) {
    return (
        <button className={`w-full p-10 text-left rounded-[48px] ${color} ${border || ''} hover:scale-[1.02] transition-all group active:scale-95 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl group-hover:bg-white/10 transition-all"></div>
            <div className="text-4xl mb-6 transition-all group-hover:rotate-12 group-hover:scale-125 origin-left">{icon}</div>
            <h3 className="font-black text-2xl tracking-tighter uppercase italic leading-none">{title}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-60 group-hover:opacity-100 transition-opacity">{desc}</p>
        </button>
    );
}

