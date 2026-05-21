import Link from 'next/link';

export default function CreateExamPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 mt-16">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/exams"
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm hover:bg-amber-50 transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-amber-600 transition-colors">←</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Schedule Assessment</h1>
                        <p className="text-gray-500 mt-1">Configure an examination or progress evaluation.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-amber-600 p-8 rounded-3xl shadow-xl shadow-amber-900/10 text-white overflow-hidden relative">
                            <div className="relative z-10">
                                <h4 className="font-bold flex items-center gap-2 mb-4">
                                    <span>📏</span> Grading Scale
                                </h4>
                                <p className="text-sm text-amber-50 leading-relaxed italic">The standard "Rahmah" grading system (Mumtaz, Jayyid, etc.) will be applied to all results automatically unless custom marks are used.</p>
                            </div>
                            <div className="absolute -bottom-4 -left-4 text-9xl text-white/5 select-none font-black italic">EXAM</div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <form className="space-y-8">
                            <Section title="Assessment Specs" icon="📝">
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField label="Exam Name" placeholder="e.g. Mid-Term Hifz Evaluation" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Exam Type</label>
                                            <select className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-amber-500 transition-all text-sm">
                                                <option>Weekly Quiz</option>
                                                <option>Monthly Assessment</option>
                                                <option>Final Examination</option>
                                                <option>Certification Test</option>
                                            </select>
                                        </div>
                                        <FormField label="Date" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Syllabus / Focus Area</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-amber-500 outline-none transition-all text-sm min-h-[120px]"
                                            placeholder="Define the para, surahs, or topics to be covered..."
                                        ></textarea>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Target Audience" icon="👥">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Participating Classes</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {['Halaqa A', 'Nazra 1', 'Hifz Seniors', 'Qaida Girls'].map(cls => (
                                            <label key={cls} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-amber-50 hover:border-amber-100 transition-all">
                                                <input type="checkbox" className="w-5 h-5 accent-amber-600" />
                                                <span className="text-sm font-bold text-gray-700">{cls}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                                <Link href="/exams" className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors">Cancel</Link>
                                <button className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95">Save Assessment</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl border border-gray-100 shadow-inner">{icon}</span>
                {title}
            </h2>
            <div className="pt-2">{children}</div>
        </div>
    );
}

function FormField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{label}</label>
            <input
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                {...props}
            />
        </div>
    );
}
