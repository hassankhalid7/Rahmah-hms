export default function StudentDashboard({ user }: { user: any }) {
    return (
        <div className="min-h-screen bg-[#050505] p-8 md:p-12 overflow-hidden relative text-white">
            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="w-24 h-24 bg-brand-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-4xl shadow-[0_0_40px_rgba(0,209,255,0.2)] border border-brand-400/20 group hover:rotate-6 transition-transform">
                        📖
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter leading-none uppercase italic border-b-2 border-brand-500 inline-block pb-4">
                        Assalam-o-Alaikum, <span className="text-brand-500">{user.firstName || 'Student'}</span>
                    </h1>
                    <p className="text-lg text-white/40 mt-8 italic font-medium max-w-lg mx-auto leading-relaxed border-l-2 border-white/5 pl-8">
                        "The best among you are those who learn the Quran and teach it."
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    {/* Progress Snapshot */}
                    <div className="lg:col-span-7 p-12 rounded-[56px] bg-gradient-to-br from-brand-600/20 to-accent-600/20 backdrop-blur-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <p className="text-brand-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Neural Milestones</p>
                                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">Hifz Tracker</h2>
                                </div>
                                <div className="px-6 py-2.5 bg-brand-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest border border-brand-400/20 shadow-lg">Para 7 Active</div>
                            </div>

                            <div className="space-y-8 max-w-md">
                                <StudentProgressDetail label="Today's Sabaq" value="Surah Al-An'am: 12-25" />
                                <StudentProgressDetail label="Sabqi Collection" value="Surah Al-Ma'idah: 1-11" />
                                <StudentProgressDetail label="Manzil Revision" value="Para 5 & 6 Complete" />
                            </div>

                            <button className="mt-16 px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-brand-500 hover:text-white transition-all active:scale-95">Open Lexicon</button>
                        </div>
                        <div className="absolute -bottom-16 -right-16 text-[300px] leading-none opacity-5 font-black italic select-none pointer-events-none group-hover:scale-110 transition-transform uppercase">RAH</div>
                    </div>

                    {/* Stats Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-8">
                        <PerformanceCard label="Presence" value="98%" icon="📅" color="text-brand-400" bg="bg-white/5" />
                        <PerformanceCard label="Caliber" value="Mumtaz" icon="🏆" color="text-accent-400" bg="bg-white/5" />
                        <PerformanceCard label="Lexicon Pgs" value="142" icon="📄" color="text-brand-400" bg="bg-white/5" />
                        <PerformanceCard label="Global Rank" value="#3" icon="✨" color="text-emerald-400" bg="bg-white/5" />
                    </div>
                </div>

                {/* Recent History */}
                <div className="bg-white/[0.02] backdrop-blur-2xl rounded-[60px] p-12 lg:p-16 border border-white/5 relative overflow-hidden group/history">
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-6 uppercase italic">
                            <span className="w-14 h-14 bg-white/5 rounded-2xl shadow-inner flex items-center justify-center text-2xl border border-white/5">📜</span>
                            Learning Flux
                        </h2>
                        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-400 hover:text-white transition-colors">Manifest All →</button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        <HistoryItem date="Feb 9, 2026" text="Completed today's Sabaq with excellence" mistakes={0} rating="Mumtaz" />
                        <HistoryItem date="Feb 8, 2026" text="Revised Sabqi Al-Ma'idah" mistakes={1} rating="Jayyid J." />
                        <HistoryItem date="Feb 7, 2026" text="Weekly review: Para 6 end" mistakes={2} rating="Jayyid" />
                    </div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-accent-500/5 blur-[80px] group-hover/history:bg-accent-500/10 transition-all"></div>
                </div>
            </div>
            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-500/10 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
}

function StudentProgressDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="group/detail border-l-2 border-white/5 pl-6 hover:border-brand-500 transition-colors">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mb-2 group-hover/detail:text-brand-400 transition-colors">{label}</p>
            <p className="font-black text-xl tracking-tighter group-hover/detail:translate-x-2 transition-transform italic uppercase">{value}</p>
        </div>
    );
}

function PerformanceCard({ label, value, icon, color, bg }: { label: string; value: string; icon: string; color: string; bg: string }) {
    return (
        <div className={`${bg} p-10 rounded-[48px] flex flex-col items-center justify-center text-center border border-white/5 transition-all hover:scale-105 hover:border-white/10 group backdrop-blur-xl`}>
            <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500">{icon}</div>
            <p className={`text-2xl font-black tracking-tighter uppercase italic ${color} text-glow`}>{value}</p>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-3">{label}</p>
        </div>
    );
}

function HistoryItem({ date, text, mistakes, rating }: { date: string; text: string; mistakes: number; rating?: string }) {
    return (
        <div className="bg-white/5 p-10 rounded-[40px] border border-white/5 hover:border-brand-500/30 transition-all group/item backdrop-blur-xl">
            <span className="text-[10px] font-black text-brand-400 bg-brand-400/10 px-4 py-2 rounded-full mb-8 inline-block uppercase tracking-[0.3em] border border-brand-400/10">{date}</span>
            <p className="text-white/80 font-black leading-relaxed mb-8 group-hover/item:text-white transition-colors tracking-tight italic uppercase text-sm">{text}</p>
            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <div>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Grade</p>
                    <p className="text-xs font-black text-white uppercase italic tracking-widest">{rating}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Delta</p>
                    <p className="text-xs font-black text-brand-500">{mistakes}</p>
                </div>
            </div>
        </div>
    );
}
