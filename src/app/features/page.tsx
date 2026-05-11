import Link from 'next/link';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5">
                <div className="container mx-auto px-10 py-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-11 bg-brand-500 rounded-2xl flex items-center justify-center text-black font-black text-sm px-2 group-hover:rotate-6 transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)]">رحمة</div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Rahmah</h1>
                    </Link>
                    <div className="hidden md:flex items-center gap-12 text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                        <Link href="/" className="hover:text-brand-400 transition-colors">Surface</Link>
                        <Link href="/features" className="text-brand-400">Modules</Link>
                        <Link href="/about" className="hover:text-brand-400 transition-colors">Origin</Link>
                        <Link href="/pricing" className="hover:text-brand-400 transition-colors">Yield</Link>
                    </div>
                    <Link href="/sign-up" className="px-8 py-3.5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white transition-all">Establish Link</Link>
                </div>
            </nav>

            <main className="pt-56 pb-40 px-6 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-40 max-w-4xl mx-auto">
                        <h2 className="text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none">Functional <br /><span className="text-brand-500">Modules</span></h2>
                        <p className="text-xl text-white/40 font-black italic uppercase tracking-[0.2em] leading-relaxed">The atomic components of a modern Islamic educational infrastructure.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-24 items-start">
                        <FeatureDetail
                            title="Synaptic Progress Logs"
                            icon="📖"
                            desc="Moving beyond fragile paper records. Teachers record Sabaq, Sabqi, and Manzil in a centralized high-availability data store."
                            items={["Para & Ayah level granularity", "Error & Pause telemetry", "Synchronized progress timeline", "Automated track migration"]}
                        />
                        <FeatureDetail
                            title="Matrix Attendance"
                            icon="📅"
                            desc="Real-time presence tracking for the entire institute hierarchy."
                            items={["Temporal state tracking (Late/Excused)", "Lineage reports for guardians", "Automated leave request processing", "Instructor clock-in integration"]}
                        />
                        <FeatureDetail
                            title="Verdict & Analytics"
                            icon="⚖️"
                            desc="Systematic evaluation of entity performance with precision reporting."
                            items={["Cyclic & Terminal assessments", "Traditional grading schemas", "Custom evaluation parameters", "Cryptographic cert generation"]}
                        />
                        <FeatureDetail
                            title="Financial Mesh"
                            icon="💰"
                            desc="Streamlined fiscal operations with automated reconciliation."
                            items={["Subscription & Fee tracking", "Data-driven payment alerts", "Operational expense logs", "Financial flux dashboards"]}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

function FeatureDetail({ title, icon, desc, items }: { title: string, icon: string, desc: string, items: string[] }) {
    return (
        <div className="space-y-10 group">
            <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center text-4xl shadow-inner border border-white/5 group-hover:rotate-6 transition-transform">{icon}</div>
            <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic group-hover:text-brand-500 transition-colors">{title}</h3>
            <p className="text-white/40 leading-relaxed text-lg font-black italic uppercase tracking-[0.1em]">{desc}</p>
            <ul className="space-y-6">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-6 text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">
                        <span className="w-8 h-8 rounded-xl bg-white/5 text-brand-400 flex items-center justify-center border border-white/5 transition-all group-hover:bg-brand-500 group-hover:text-black">✓</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
