import Link from 'next/link';
import PrintButton from './PrintButton';

export default async function StudentReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-white p-6 md:p-8 mt-16 print:p-0 print:mt-0">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Report Header (Print Optimized) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b-4 border-emerald-600">
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Academic Performance Report</h1>
                        <p className="text-emerald-600 font-black flex items-center justify-center md:justify-start gap-3 uppercase tracking-widest text-xs">
                            <span>February 2026</span>
                            <span className="text-gray-300">•</span>
                            <span>Rahmah Islamic Institute</span>
                        </p>
                    </div>
                    <div className="w-24 h-24 bg-emerald-600 text-white rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl shadow-emerald-200 print:shadow-none">
                        S
                    </div>
                </div>

                {/* Student Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 bg-gray-50 rounded-[40px] border border-gray-100">
                    <div className="md:col-span-1 space-y-4">
                        <div className="w-32 h-32 bg-white rounded-3xl border-4 border-emerald-100 flex items-center justify-center text-6xl shadow-sm mx-auto md:mx-0">👤</div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-black text-gray-900">Zaid Al-Harbi</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Student ID: STU-2025-0012</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-y-8 gap-x-12">
                        <SummaryItem label="Assigned Halaqa" value="Halaqa A (Hifz)" />
                        <SummaryItem label="Lead Teacher" value="Maulana Bilal" />
                        <SummaryItem label="Attendance Rate" value="98.4%" />
                        <SummaryItem label="Current Goal" value="Para 7 Completion" />
                    </div>
                </div>

                {/* Performance Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-sm border border-emerald-100">📖</span>
                            Hifz Progress Breakdown
                        </h3>
                        <div className="space-y-6">
                            <ProgressMetric label="Memorization Speed" value={85} />
                            <ProgressMetric label="Retention (Revision)" value={92} />
                            <ProgressMetric label="Tajweed Application" value={78} />
                            <ProgressMetric label="Consistency" value={95} />
                        </div>
                    </div>

                    <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-2xl shadow-emerald-900/10 space-y-8 relative overflow-hidden">
                        <h3 className="text-xl font-black relative z-10">Last Assessment</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-end border-b border-white/20 pb-4">
                                <div>
                                    <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Final Result</p>
                                    <p className="text-4xl font-black">Mumtaz</p>
                                </div>
                                <p className="text-xl font-black opacity-60">94 / 100</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Mistakes</p>
                                    <p className="text-2xl font-black">2</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Pauses</p>
                                    <p className="text-2xl font-black">1</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8 text-white/5 text-[150px] leading-none select-none font-black italic pointer-events-none">A+</div>
                    </div>
                </div>

                {/* Teachers Remarks */}
                <div className="bg-white p-12 rounded-[40px] border-2 border-emerald-50 shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <span className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm border border-gray-100">✍️</span>
                        Teacher's Final Remarks
                    </h3>
                    <p className="text-gray-600 font-medium leading-[1.8] italic">
                        "Zaid has shown exceptional dedication this month. His memorization speed has increased significantly, and he is paying more attention to his tajweed rules during revision. I recommend focusing on the second half of Para 7 for the next two weeks to solidify his retention."
                    </p>
                    <div className="pt-8 flex justify-between items-end grayscale opacity-50">
                        <div className="text-center">
                            <div className="w-32 h-px bg-gray-300 mb-2"></div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teacher Signature</p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-px bg-gray-300 mb-2"></div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Principal Approval</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions (Hidden in Print) */}
                <div className="flex justify-between items-center pt-8 border-t border-gray-100 print:hidden">
                    <Link href="/reports" className="text-gray-400 font-bold hover:text-emerald-600 transition-colors">← Back to All Reports</Link>
                    <PrintButton />
                </div>
            </div>
        </div>
    );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-black text-gray-900 leading-tight">{value}</p>
        </div>
    );
}

function ProgressMetric({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-tight">
                <span className="text-gray-400">{label}</span>
                <span className="text-emerald-600">{value}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
}
