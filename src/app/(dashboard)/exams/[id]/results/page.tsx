'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';

export default function ExamResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    // Mock student list for result entry
    const students = [
        { id: '1', name: 'Zaid Al-Harbi', gender: 'Male', marks: '', mistakes: '', rating: '' },
        { id: '2', name: 'Omar Mansour', gender: 'Male', marks: '94', mistakes: '2', rating: 'Mumtaz' },
        { id: '3', name: 'Ahmed Khan', gender: 'Male', marks: '88', mistakes: '4', rating: 'Jayyid Jiddan' },
        { id: '4', name: 'Yusuf Raza', gender: 'Male', marks: '', mistakes: '', rating: '' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-10 pb-12 border-b-2 border-dashed border-gray-100">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/exams"
                            className="w-16 h-16 bg-white border border-gray-100 rounded-[28px] flex items-center justify-center hover:bg-brand-50 hover:border-brand-200 transition-all group shadow-sm active:scale-95"
                        >
                            <span className="text-gray-400 group-hover:text-brand-600 text-2xl font-black">←</span>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Record Outcome</h1>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">Monthly Assessment</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-400 text-xs font-bold italic">Halaqa A (Para 1-10)</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status</p>
                            <p className="text-2xl font-black text-gray-900 leading-none">50% Completed</p>
                        </div>
                        <button className="px-10 py-5 bg-brand-600 text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-900/20 hover:bg-brand-700 hover:scale-[1.02] active:scale-95 transition-all">
                            Finalize Marks
                        </button>
                    </div>
                </header>

                {/* Results Entry Form */}
                <div className="bg-white rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                    <th className="px-12 py-8">Identity</th>
                                    <th className="px-6 py-8 w-32 text-center">Score (100)</th>
                                    <th className="px-6 py-8 w-32 text-center">Mistakes</th>
                                    <th className="px-6 py-8 w-32 text-center">Pauses</th>
                                    <th className="px-10 py-8">Distinction</th>
                                    <th className="px-12 py-8 text-right">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-emerald-50/50 transition-colors group">
                                        <td className="px-12 py-8">
                                            <p className="font-black text-gray-900 text-lg leading-tight uppercase tracking-tight">{student.name}</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">ID: STU-{student.id.padStart(3, '0')}</p>
                                        </td>
                                        <td className="px-6 py-8">
                                            <input
                                                type="text"
                                                defaultValue={student.marks}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl text-center font-black text-xl text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all shadow-inner"
                                                placeholder="-"
                                            />
                                        </td>
                                        <td className="px-6 py-8">
                                            <input
                                                type="text"
                                                defaultValue={student.mistakes}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl text-center font-black text-xl text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all shadow-inner"
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="px-6 py-8">
                                            <input
                                                type="text"
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl text-center font-black text-xl text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all shadow-inner"
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="px-10 py-8">
                                            <select className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-600 focus:bg-white focus:border-emerald-500 outline-none transition-all hover:bg-gray-100 cursor-pointer">
                                                <option value="">Select Level</option>
                                                <option value="mumtaz">Mumtaz (Exemplary)</option>
                                                <option value="jayyid_jiddan">Jayyid Jiddan (V. Good)</option>
                                                <option value="jayyid">Jayyid (Good)</option>
                                                <option value="maqbool">Maqbool (Pass)</option>
                                                <option value="rasib">Rasib (Fail)</option>
                                            </select>
                                        </td>
                                        <td className="px-12 py-8 text-right">
                                            <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 hover:text-emerald-600 hover:bg-white transition-all border border-transparent hover:border-emerald-100 shadow-sm ml-auto">
                                                📝
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pedagogy Guidelines */}
                <div className="bg-gray-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden group">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                        <div className="lg:col-span-1 border-r border-white/10 pr-12">
                            <h3 className="text-3xl font-black mb-4 tracking-tighter">Pedagogy Standards</h3>
                            <p className="text-white/40 text-sm font-medium leading-relaxed italic">"Precise evaluation is a catalyst for spiritual and technical growth."</p>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <GuidelineCard label="Tajweed" desc="Check for articulation points and rules." />
                            <GuidelineCard label="Hifz" desc="Precision in letter and sequence recall." />
                            <GuidelineCard label="Flow" desc="Consistency and beauty of recitation." />
                        </div>
                    </div>
                    <div className="absolute -bottom-12 -right-12 text-[280px] font-black italic text-white/[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform">S</div>
                </div>
            </div>
        </div>
    );
}

function GuidelineCard({ label, desc }: { label: string; desc: string }) {
    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-[36px] backdrop-blur-sm transition-all hover:bg-white/10">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{label}</p>
            <p className="text-xs font-bold leading-relaxed opacity-70 uppercase tracking-tight">{desc}</p>
        </div>
    );
}

function GuidelineItem({ label, desc }: { label: string; desc: string }) {
    return (
        <div className="flex-1 bg-white/10 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
            <p className="text-amber-200 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xs font-medium leading-relaxed">{desc}</p>
        </div>
    );
}
