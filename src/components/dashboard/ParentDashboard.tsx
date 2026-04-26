import React from 'react';
import StudentDashboard from './StudentDashboard';

export default function ParentDashboard({ user }: { user: any }) {
    // In a real app, we'd fetch children data here
    const children = [
        { name: 'Abdullah', role: 'student', id: '1' },
        { name: 'Khadija', role: 'student', id: '2' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] p-8 md:p-12 text-white relative overflow-hidden">
            {/* Ambient Nebula */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-white/5 pb-16">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic border-l-4 border-brand-500 pl-6 leading-none">Parent Portal</h1>
                        <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] mt-3 ml-7 opacity-60">Synchronizing lineage and academic progression.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all backdrop-blur-xl">Direct Uplink</button>
                        <button className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white">Financial Settle</button>
                    </div>
                </header>

                <div className="space-y-24">
                    {children.map((child, i) => (
                        <div key={child.id} className="relative group">
                            <div className="absolute -top-6 left-16 px-10 py-3.5 bg-brand-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(0,209,255,0.3)] z-10 transition-all group-hover:-translate-y-2 active:scale-95 cursor-default">
                                {child.name} // Entity {child.id}
                            </div>
                            <div className="border border-white/5 rounded-[56px] overflow-hidden shadow-2xl bg-white/[0.02] backdrop-blur-3xl group-hover:border-white/10 transition-all">
                                <StudentDashboard user={{ firstName: child.name, publicMetadata: { role: 'student' } }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
