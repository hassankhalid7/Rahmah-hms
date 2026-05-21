import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>

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
                        <Link href="/about" className="hover:text-brand-400 transition-colors">Origin</Link>
                        <Link href="/pricing" className="text-brand-400">Yield</Link>
                    </div>
                    <Link href="/sign-up" className="px-8 py-3.5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white transition-all">Establish Link</Link>
                </div>
            </nav>

            <main className="pt-56 pb-40 px-6 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center max-w-4xl mx-auto mb-32">
                        <h2 className="text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none">Institute Scalability</h2>
                        <p className="text-xl text-white/40 font-black italic mb-16 uppercase tracking-[0.2em]">Operational tiers from individual halaqas to global academy clusters.</p>

                        <div className="flex bg-white/5 p-2 rounded-[32px] w-fit mx-auto border border-white/5 backdrop-blur-2xl">
                            <button className="px-12 py-4 bg-white text-black rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.1)]">Cycle Billing</button>
                            <button className="px-12 py-4 text-white/40 font-black text-[10px] uppercase tracking-[0.3em] hover:text-brand-400 transition-colors">Orbit Sync (Save 20%)</button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 items-center">
                        {/* Starter Plan */}
                        <div className="p-12 rounded-[64px] bg-white/[0.02] backdrop-blur-3xl border border-white/5 flex flex-col hover:border-white/10 transition-all group relative overflow-hidden">
                            <h4 className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mb-6">Probe</h4>
                            <div className="flex items-end gap-2 mb-12">
                                <span className="text-6xl font-black text-white tracking-tighter italic leading-none">$19</span>
                                <span className="text-white/20 font-black text-xs mb-1 uppercase tracking-widest italic">/ Cycle</span>
                            </div>
                            <ul className="space-y-6 mb-16 flex-1 relative z-10">
                                <PricingItem text="25 Entity Capacity" />
                                <PricingItem text="1 Instructor Node" />
                                <PricingItem text="Daily Flux Logging" />
                                <PricingItem text="Pulse Support" />
                                <PricingItem text="Standard Matrices" muted />
                            </ul>
                            <button className="w-full py-6 bg-white/5 text-white/40 border border-white/5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all active:scale-95">Initiate Sequence</button>
                            <div className="absolute -bottom-10 -right-10 text-white/[0.02] text-[180px] font-black italic pointer-events-none group-hover:text-white/[0.05] transition-all">PRB</div>
                        </div>

                        {/* Main Plan */}
                        <div className="p-16 rounded-[72px] bg-white/[0.04] backdrop-blur-3xl border-2 border-brand-500 shadow-[0_0_50px_rgba(0,209,255,0.1)] flex flex-col scale-110 relative z-20 group">
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-8 py-3 bg-brand-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_0_30px_rgba(0,209,255,0.4)]">Optimal Config</span>
                            <h4 className="text-[11px] font-black text-brand-400 uppercase tracking-[0.5em] mb-6">Nexus</h4>
                            <div className="flex items-end gap-2 mb-12">
                                <span className="text-8xl font-black text-white tracking-tighter italic leading-none">$49</span>
                                <span className="text-brand-500 font-black text-xs mb-2 uppercase tracking-widest italic">/ Cycle</span>
                            </div>
                            <ul className="space-y-8 mb-16 flex-1 relative z-10">
                                <PricingItem text="Unlimited Entities" />
                                <PricingItem text="Unlimited Instructors" />
                                <PricingItem text="Omni-Tracking Modules" />
                                <PricingItem text="Neural Recitation Analytics" />
                                <PricingItem text="24/7 Priority Uplink" />
                            </ul>
                            <button className="w-full py-7 bg-white text-black rounded-[40px] font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white transition-all active:scale-95 leading-none">Command Center Access</button>
                            <div className="absolute -bottom-12 -right-12 text-white/[0.02] text-[250px] font-black italic pointer-events-none group-hover:text-white/[0.05] transition-all">NEX</div>
                        </div>

                        {/* Custom Plan */}
                        <div className="p-12 rounded-[64px] bg-white/[0.02] backdrop-blur-3xl border border-white/5 flex flex-col hover:border-white/10 transition-all group relative overflow-hidden">
                            <h4 className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mb-6">Singularity</h4>
                            <div className="mb-12">
                                <span className="text-6xl font-black text-white tracking-tighter italic leading-none">Bespoke</span>
                            </div>
                            <p className="text-sm font-black text-white/40 mb-12 leading-relaxed italic uppercase tracking-[0.1em]">"Architectural solutions for multi-node academy networks requiring white-label singularity."</p>
                            <ul className="space-y-6 mb-16 flex-1 relative z-10">
                                <PricingItem text="Identity Singularity" />
                                <PricingItem text="Dedicated Data Cluster" />
                                <PricingItem text="Neural API Gateway" />
                                <PricingItem text="Quantum Encryption" />
                            </ul>
                            <Link href="/contact" className="w-full py-6 border-2 border-white/10 text-white/40 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all text-center">Consult Architect</Link>
                            <div className="absolute -bottom-10 -right-10 text-white/[0.02] text-[180px] font-black italic pointer-events-none group-hover:text-white/[0.05] transition-all">SNG</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function PricingItem({ text, muted }: { text: string, muted?: boolean }) {
    return (
        <li className={`flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] ${muted ? 'text-white/10 line-through italic' : 'text-white/60'}`}>
            <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] border ${muted ? 'bg-white/5 text-white/10 border-white/5' : 'bg-brand-500/10 text-brand-400 border-brand-500/20 shadow-[0_0_15px_rgba(0,209,255,0.1)]'}`}>✓</span>
            {text}
        </li>
    );
}
