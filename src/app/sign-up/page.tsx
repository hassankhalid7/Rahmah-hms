'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        madrasaName: '',
        email: '',
        otp: '',
        username: '',
        password: ''
    });

    const handleNext = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            if (formData.otp === '123456') {
                setStep(3);
            } else {
                alert("Invalid code. In demo mode use 123456");
            }
        } else {
            router.push('/dashboard');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-12 bg-[#050505] text-white font-sans relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="hidden lg:flex lg:col-span-5 bg-white/[0.02] backdrop-blur-3xl p-20 flex-col justify-between text-white relative overflow-hidden border-r border-white/5">
                <div className="relative z-10">
                    <div className="w-16 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-black font-black text-sm rotate-3 mb-12 shadow-[0_0_30px_rgba(0,209,255,0.4)]">رحمة</div>
                    <h2 className="text-7xl font-black tracking-tighter leading-none mb-8 uppercase italic">Genetic <br />Registration</h2>
                    <p className="text-xl font-black text-white/40 italic uppercase tracking-[0.2em] leading-relaxed max-w-lg">
                        "Initiating data-node establishment for sacred educational heritage."
                    </p>
                </div>

                <div className="relative z-10 space-y-10">
                    <FeatureSnippet icon="🕌" text="Unified Madrasa Management" />
                    <FeatureSnippet icon="📖" text="Granular Hifz Progress" />
                    <FeatureSnippet icon="📊" text="Monthly Student Reports" />
                </div>

                <div className="absolute bottom-0 left-0 p-20 text-white/[0.02] text-[500px] leading-none select-none font-black italic pointer-events-none -mr-40 -mb-20">RAH</div>
            </div>

            <div className="lg:col-span-7 flex items-center justify-center p-8 relative">
                <Link href="/" className="absolute top-12 left-12 flex items-center gap-4 text-white/40 font-black text-[10px] uppercase tracking-[0.4em] hover:text-brand-400 transition-all group">
                    <span className="group-hover:-translate-x-2 transition-transform">←</span> Surface
                </Link>

                <div className="w-full max-w-md">
                    <div className="mb-16 text-center lg:text-left">
                        <div className="flex gap-4 mb-8 max-w-[240px] mx-auto lg:mx-0">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${s <= step ? 'bg-brand-500 shadow-[0_0_15px_rgba(0,209,255,0.5)]' : 'bg-white/10'}`}
                                />
                            ))}
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                            {step === 1 && "Data Input"}
                            {step === 2 && "Verification"}
                            {step === 3 && "Portal Key"}
                        </h1>
                        <p className="text-white/20 font-black mt-4 uppercase tracking-[0.2em] italic">
                            {step === 1 && "Start your journey by entering student details"}
                            {step === 2 && "Enter the 6-digit code sent to your email"}
                            {step === 3 && "Secure your student/user account credentials"}
                        </p>
                    </div>

                    <div className="space-y-8">
                        {step === 1 && (
                            <>
                                <InputGroup
                                    label="Entity Full Name"
                                    placeholder="Abdullah Ahmad"
                                    value={formData.name}
                                    onChange={(v) => setFormData({ ...formData, name: v })}
                                />
                                <InputGroup
                                    label="Assigned Halaqa Node"
                                    placeholder="Halaqa A (Tahfeez)"
                                    value={formData.madrasaName}
                                    onChange={(v) => setFormData({ ...formData, madrasaName: v })}
                                />
                                <InputGroup
                                    label="Official Signal Line"
                                    placeholder="abdullah@rahmah.app"
                                    type="email"
                                    value={formData.email}
                                    onChange={(v) => setFormData({ ...formData, email: v })}
                                />
                            </>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] pl-1">Standard 6-Digit Code</label>
                                <div className="grid grid-cols-6 gap-4">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            maxLength={1}
                                            className="w-full aspect-square text-center text-2xl font-black bg-white/[0.02] text-white rounded-2xl border border-white/5 focus:border-brand-500 focus:bg-white/[0.05] outline-none transition-all shadow-inner"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const currentOtp = formData.otp.padEnd(6, ' ');
                                                const newOtp = currentOtp.split('');
                                                newOtp[i] = val || ' ';
                                                setFormData({ ...formData, otp: newOtp.join('').trim() });
                                                if (val && e.target.nextSibling) {
                                                    (e.target.nextSibling as HTMLInputElement).focus();
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em] text-center mt-6 italic">Demo Code: 123456</p>
                            </div>
                        )}

                        {step === 3 && (
                            <>
                                <InputGroup
                                    label="Entity Username"
                                    placeholder="abdullah_88"
                                    value={formData.username}
                                    onChange={(v) => setFormData({ ...formData, username: v })}
                                />
                                <InputGroup
                                    label="Access Cipher"
                                    placeholder="••••••••"
                                    type="password"
                                    value={formData.password}
                                    onChange={(v) => setFormData({ ...formData, password: v })}
                                />
                            </>
                        )}

                        <button
                            disabled={isLoading}
                            onClick={handleNext}
                            className="w-full flex items-center justify-center py-7 bg-white text-black rounded-[40px] font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-brand-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group leading-none"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    {step === 3 ? "Finalize Sync" : "Commit Progress"}
                                    <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-16 text-center text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">
                        Integrated with Rahmah Network Neural Core
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, placeholder, type = "text", value, onChange }: { label: string, placeholder: string, type?: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="space-y-4">
            <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] pl-1">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-10 py-6 bg-white/[0.02] rounded-[32px] border border-white/5 focus:bg-white/[0.05] focus:border-brand-500 outline-none transition-all shadow-inner font-black text-white italic placeholder:text-white/10 text-sm tracking-tight"
            />
        </div>
    );
}

function FeatureSnippet({ icon, text }: { icon: string, text: string }) {
    return (
        <div className="flex items-center gap-8 group">
            <div className="w-16 h-16 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-3xl group-hover:bg-brand-500 group-hover:text-black transition-all duration-700 shadow-inner group-hover:rotate-6">{icon}</div>
            <p className="font-black text-white/40 uppercase italic tracking-tighter text-xl group-hover:text-white transition-colors">{text}</p>
        </div>
    );
}
