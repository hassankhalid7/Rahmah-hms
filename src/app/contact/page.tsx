'use client';

import { type InputHTMLAttributes } from 'react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>

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
                        <Link href="/contact" className="text-brand-400">Sync</Link>
                    </div>
                    <Link href="/sign-up" className="px-8 py-3.5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white transition-all">Establish Link</Link>
                </div>
            </nav>

            <main className="pt-56 pb-40 px-6 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-32">
                        <div className="space-y-20">
                            <div>
                                <h2 className="text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none">Global <br /><span className="text-brand-500">Uplink</span></h2>
                                <p className="text-xl text-white/40 font-black italic uppercase tracking-[0.2em] leading-relaxed">Establish a direct communication line with the Rahmah architect nodes.</p>
                            </div>

                            <div className="space-y-12">
                                <ContactItem icon="✉️" label="Electronic Mail" value="contact@rahmah.app" />
                                <ContactItem icon="📞" label="Voice Frequency" value="+92 (320) 419-9100" />
                                <ContactItem icon="📍" label="Nexus Location" value="DHA Phase 8, Lahore Matrix" />
                            </div>
                        </div>

                        <div className="bg-white/[0.02] backdrop-blur-3xl p-16 rounded-[72px] border border-white/5 relative overflow-hidden group">
                            <h3 className="text-3xl font-black text-white mb-12 tracking-tighter uppercase italic relative z-10">Transmission Input</h3>
                            <form className="space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid md:grid-cols-2 gap-10">
                                    <FormField label="Entity Name" placeholder="Zaid Ahmed" />
                                    <FormField label="Institute ID" placeholder="Al-Furqan Academy" />
                                </div>
                                <FormField label="Signal Origin" placeholder="zaid@example.com" />
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] ml-2 leading-none">Message Flux</label>
                                    <textarea className="w-full px-10 py-8 rounded-[40px] border border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-brand-500 outline-none transition-all placeholder:text-white/10 text-sm font-black text-white italic tracking-tight min-h-[200px]" placeholder="Input signal parameters..."></textarea>
                                </div>
                                <button className="w-full py-6 bg-white text-black rounded-[32px] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white transition-all active:scale-95 leading-none">Commit Transmission</button>
                            </form>
                            <div className="absolute -bottom-12 -right-12 text-white/[0.02] text-[200px] font-black italic select-none pointer-events-none group-hover:text-white/[0.05] transition-all uppercase">MSG</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ContactItem({ icon, label, value }: { icon: string, label: string, value: string }) {
    return (
        <div className="flex items-center gap-8 group">
            <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center text-4xl shadow-inner border border-white/5 group-hover:rotate-6 transition-transform">{icon}</div>
            <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-2">{label}</p>
                <p className="text-2xl font-black text-white tracking-tighter uppercase italic group-hover:text-brand-400 transition-colors">{value}</p>
            </div>
        </div>
    );
}

function FormField({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-4">
            <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] ml-2 leading-none">{label}</label>
            <input className="w-full h-18 px-10 rounded-full border border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-brand-500 outline-none transition-all placeholder:text-white/10 text-sm font-black text-white italic tracking-tight shadow-inner" {...props} />
        </div>
    );
}
