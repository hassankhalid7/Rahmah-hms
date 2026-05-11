'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ExamsListPage() {
    const [exams, setExams] = useState([
        { id: '1', name: 'Monthly Hifz Assessment', type: 'Monthly', date: 'Feb 28, 2026', status: 'Scheduled', students: 45 },
        { id: '2', name: 'Nazra Para 1-5 Final', type: 'Final', date: 'Mar 15, 2026', status: 'Draft', students: 28 },
        { id: '3', name: 'Qaida Completion Test', type: 'Certification', date: 'Feb 10, 2026', status: 'Completed', students: 12 },
    ]);

    const deleteExam = (id: string) => {
        if (confirm('Are you sure you want to delete this assessment?')) {
            setExams(prev => prev.filter(e => e.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-gray-100">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Exams & Grading</h1>
                        <p className="text-gray-500 font-bold mt-2 italic">Monitoring standards of excellence in Quranic recitation.</p>
                    </div>
                    <Link
                        href="/exams/new"
                        className="px-10 py-5 bg-amber-600 text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/20 hover:bg-amber-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4"
                    >
                        <span>📝</span> Schedule New Assessment
                    </Link>
                </header>

                {/* Exams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {exams.map((exam) => (
                        <div key={exam.id} className="bg-white rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:border-amber-500/30 transition-all group overflow-hidden flex flex-col relative group/card">
                            <div className="p-12 flex-1 relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <span className={`px-5 py-2 text-[9px] font-black rounded-full uppercase tracking-widest border ${exam.status === 'Scheduled' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        exam.status === 'Completed' ? 'bg-brand-50 text-brand-600 border-brand-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                        }`}>
                                        {exam.status}
                                    </span>
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">{exam.type} Mode</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-8 group-hover/card:text-amber-700 transition-colors tracking-tighter leading-[0.9] uppercase">{exam.name}</h3>

                                <div className="space-y-6 pt-10 border-t border-gray-50">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-gray-100 group-hover:rotate-6 transition-transform">📅</div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Date</p>
                                            <p className="font-bold text-gray-800">{exam.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-gray-100 group-hover:-rotate-6 transition-transform">👥</div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Enrolled</p>
                                            <p className="font-bold text-gray-800">{exam.students} Candidates</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex bg-gray-50/50 p-4 m-8 mt-0 rounded-[36px] gap-3 relative z-10 border border-gray-100">
                                {exam.status === 'Completed' ? (
                                    <Link href={`/exams/${exam.id}/results`} className="flex-1 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] bg-brand-600 text-white rounded-3xl shadow-xl shadow-brand-900/20 transition-all hover:bg-brand-700 active:scale-95">Analysis View</Link>
                                ) : (
                                    <Link href={`/exams/${exam.id}/results`} className="flex-1 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] bg-white text-amber-600 rounded-3xl shadow-sm border border-amber-200 transition-all hover:bg-amber-600 hover:text-white active:scale-95">Record Marks</Link>
                                )}
                                <button
                                    onClick={() => deleteExam(exam.id)}
                                    className="w-16 h-16 bg-white rounded-2xl text-rose-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all flex items-center justify-center active:scale-75 shadow-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                            <div className="absolute -bottom-8 -right-8 text-amber-600/5 text-[180px] leading-none select-none font-black italic pointer-events-none group-hover/card:scale-110 group-hover/card:-translate-x-4 transition-transform z-0">S</div>
                        </div>
                    ))}

                    {/* Add Placeholder Card */}
                    <button className="bg-gray-50/50 rounded-[50px] border-4 border-dashed border-gray-100 p-12 flex flex-col items-center justify-center text-gray-300 hover:text-amber-500 hover:border-amber-200 transition-all group/add min-h-[400px]">
                        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-5xl shadow-xl shadow-gray-200 group-hover/add:rotate-90 transition-transform mb-6">+</div>
                        <p className="font-black uppercase tracking-[0.3em] text-sm">Create Blueprint</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
