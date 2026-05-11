export default function StudentDashboard({ user }: { user: any }) {
    return (
        <div className="w-full text-[#1c3c33] animate-in fade-in duration-500">
            <div className="space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-4 border-b border-[#2F6B4F]/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">
                                📖
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-[#1c3c33] tracking-tight">
                                Assalam-o-Alaikum, {user.firstName || 'Student'}
                            </h1>
                        </div>
                        <p className="text-sm font-bold text-[#2F6B4F]">Faizan e Ashab e Sufa</p>
                        <p className="text-sm text-[#1c3c33]/65 italic">
                            "The best among you are those who learn the Quran and teach it."
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-white text-[#1c3c33] border border-[#d0d8cf] rounded-xl text-xs font-bold hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors shadow-sm">My Progress</button>
                        <button className="px-4 py-2.5 bg-[#2F6B4F] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-colors">View History</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Progress Snapshot */}
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#2F6B4F]/5 to-[#F3D083]/5 border border-[#1c3c33]/5 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[#2F6B4F] text-xs font-bold mb-2">Current Progress</p>
                                <h2 className="text-xl font-black tracking-tight text-[#1c3c33]">Hifz Tracker</h2>
                            </div>
                            <div className="px-3 py-1.5 bg-[#2F6B4F] text-white rounded-lg text-xs font-bold">Para 7 Active</div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <StudentProgressDetail label="Today's Sabaq" value="Surah Al-An'am: 12-25" />
                            <StudentProgressDetail label="Sabqi Collection" value="Surah Al-Ma'idah: 1-11" />
                            <StudentProgressDetail label="Manzil Revision" value="Para 5 & 6 Complete" />
                        </div>

                        <button className="px-4 py-2.5 bg-[#2F6B4F] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-colors">
                            Open Progress Details
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <PerformanceCard label="Attendance" value="98%" icon="📅" color="text-[#2F6B4F]" bg="bg-[#E5F4EC]" />
                        <PerformanceCard label="Grade" value="Mumtaz" icon="🏆" color="text-[#F57C00]" bg="bg-[#FFF3E0]" />
                        <PerformanceCard label="Pages" value="142" icon="📄" color="text-[#00897B]" bg="bg-[#F0F4F8]" />
                        <PerformanceCard label="Rank" value="#3" icon="✨" color="text-[#8E24AA]" bg="bg-[#F3E5F5]" />
                    </div>
                </div>

                {/* Recent History */}
                <div className="bg-white rounded-2xl p-6 border border-[#1c3c33]/5 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-[#1c3c33] tracking-tight flex items-center gap-3">
                            <span className="w-8 h-8 bg-[#1c3c33]/5 rounded-lg flex items-center justify-center text-lg">📜</span>
                            Recent Learning History
                        </h2>
                        <button className="text-xs font-bold text-[#2F6B4F] hover:underline">View All →</button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <HistoryItem date="Feb 9, 2026" text="Completed today's Sabaq with excellence" mistakes={0} rating="Mumtaz" />
                        <HistoryItem date="Feb 8, 2026" text="Revised Sabqi Al-Ma'idah" mistakes={1} rating="Jayyid J." />
                        <HistoryItem date="Feb 7, 2026" text="Weekly review: Para 6 end" mistakes={2} rating="Jayyid" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StudentProgressDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-l-2 border-[#2F6B4F]/20 pl-4 hover:border-[#2F6B4F] transition-colors">
            <p className="text-[#1c3c33]/60 text-xs font-bold mb-1">{label}</p>
            <p className="font-bold text-sm text-[#1c3c33]">{value}</p>
        </div>
    );
}

function PerformanceCard({ label, value, icon, color, bg }: { label: string; value: string; icon: string; color: string; bg: string }) {
    return (
        <div className={`${bg} p-4 rounded-xl flex flex-col items-center justify-center text-center border border-[#1c3c33]/5 transition-all hover:scale-105 hover:shadow-md`}>
            <div className="text-2xl mb-3">{icon}</div>
            <p className={`text-lg font-black tracking-tight ${color}`}>{value}</p>
            <p className="text-xs font-bold text-[#1c3c33]/60 mt-1">{label}</p>
        </div>
    );
}

function HistoryItem({ date, text, mistakes, rating }: { date: string; text: string; mistakes: number; rating?: string }) {
    return (
        <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#d0d8cf]/50 hover:border-[#2F6B4F]/30 transition-all">
            <span className="text-xs font-bold text-[#2F6B4F] bg-[#2F6B4F]/10 px-2 py-1 rounded-md mb-3 inline-block">{date}</span>
            <p className="text-[#1c3c33] font-medium leading-relaxed mb-4 text-sm">{text}</p>
            <div className="flex justify-between items-center pt-3 border-t border-[#1c3c33]/5">
                <div>
                    <p className="text-xs font-bold text-[#1c3c33]/60 mb-1">Grade</p>
                    <p className="text-xs font-bold text-[#1c3c33]">{rating}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-[#1c3c33]/60 mb-1">Mistakes</p>
                    <p className="text-xs font-bold text-[#2F6B4F]">{mistakes}</p>
                </div>
            </div>
        </div>
    );
}
