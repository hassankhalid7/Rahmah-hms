import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5">
                <div className="container mx-auto px-10 py-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-11 bg-brand-500 rounded-2xl flex items-center justify-center text-black font-black text-sm px-2 group-hover:rotate-6 transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)]">رحمة</div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Rahmah</h1>
                    </Link>
                    <div className="hidden md:flex items-center gap-12 text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                        <Link href="/" className="hover:text-brand-400 transition-colors">Surface</Link>
                        <Link href="/features" className="hover:text-brand-400 transition-colors">Modules</Link>
                        <Link href="/about" className="text-brand-400">Origin</Link>
                        <Link href="/pricing" className="hover:text-brand-400 transition-colors">Yield</Link>
                    </div>
                    <Link href="/sign-up" className="px-8 py-3.5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white transition-all">Establish Link</Link>
                </div>
            </nav>

            <main className="pt-56 pb-40 px-6 relative z-10">
                <div className="container mx-auto max-w-6xl space-y-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none">Preserving Sacred Tradition <br /><span className="text-brand-500">Neural Innovation</span></h2>
                        <p className="text-xl text-white/40 font-black italic uppercase tracking-[0.2em] leading-relaxed max-w-3xl mx-auto">Rahmah is a dedicated initiative focused on modernizing Islamic educational administrative architectures.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="bg-white/[0.02] backdrop-blur-3xl p-16 rounded-[72px] border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
                            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">🎯</div>
                            <h3 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic">Our Objective</h3>
                            <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] leading-loose italic">To empower Islamic institutes with high-end technology that respects and enhances the traditional Hifz methodology, ensuring no progress is lost and every milestone is synchronized.</p>
                            <div className="absolute -bottom-10 -right-10 text-white/[0.02] text-[150px] font-black italic pointer-events-none group-hover:text-white/[0.05] transition-all">OBJ</div>
                        </div>
                        <div className="bg-gradient-to-br from-brand-600 to-accent-600 p-16 rounded-[72px] text-black shadow-2xl relative overflow-hidden group">
                            <div className="text-6xl mb-10 group-hover:rotate-12 transition-transform">👁️</div>
                            <h3 className="text-4xl font-black mb-6 tracking-tighter uppercase italic">Project Vision</h3>
                            <p className="text-[11px] font-black text-black/60 uppercase tracking-[0.2em] leading-loose italic">A future where every madrasa, regardless of size, has access to world-class management tools, bridging the gap between sacred tradition and modern administrative excellence.</p>
                            <div className="absolute -bottom-10 -right-10 text-black/5 text-[150px] font-black italic pointer-events-none group-hover:scale-110 transition-all">VIS</div>
                        </div>
                    </div>

                    <div className="space-y-16 py-12">
                        <h3 className="text-4xl font-black text-white text-center tracking-tighter uppercase italic">Collaborative Intelligence</h3>
                        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
                            <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[56px] backdrop-blur-3xl text-center w-full md:w-80 group hover:border-brand-500/30 transition-all">
                                <p className="font-black text-3xl text-brand-500 mb-4 tracking-tighter uppercase italic">Al-Ulama</p>
                                <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em]">Educational Guidance Hub</p>
                            </div>
                            <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[56px] backdrop-blur-3xl text-center w-full md:w-80 group hover:border-accent-500/30 transition-all">
                                <p className="font-black text-3xl text-white mb-4 tracking-tighter uppercase italic">Quoriam</p>
                                <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em]">Technology & Design Labs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
