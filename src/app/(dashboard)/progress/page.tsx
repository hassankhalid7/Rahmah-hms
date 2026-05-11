'use client';

import React, { useState } from 'react';

const mockStudents = [
    { id: 'STU001', name: 'Zaid Ahmad', halaqa: 'Halaqa A' },
    { id: 'STU002', name: 'Omar Farooq', halaqa: 'Halaqa B' },
    { id: 'STU003', name: 'Yahya Khan', halaqa: 'Halaqa A' },
    { id: 'STU004', name: 'Hamza Malik', halaqa: 'Halaqa C' },
];

export default function ProgressPage() {
    const [entries, setEntries] = useState([
        { id: 1, name: 'Zaid Ahmad', category: 'Sabaq', para: 7, ayah: '15-20', mistakes: 2, pauses: 1, time: '2 mins ago' },
        { id: 2, name: 'Omar Farooq', category: 'Sabqi', para: 14, ayah: 'Full', mistakes: 0, pauses: 2, time: '1 hour ago' },
    ]);

    const [form, setForm] = useState({
        studentId: '',
        category: 'Sabaq' as 'Sabaq' | 'Sabqi' | 'Manzil',
        para: 1,
        ayahRange: '',
        mistakes: 0,
        pauses: 0
    });

    const addEntry = () => {
        const student = mockStudents.find(s => s.id === form.studentId);
        if (!student) return;

        const newEntry = {
            id: Date.now(),
            name: student.name,
            category: form.category,
            para: form.para,
            ayah: form.ayahRange || 'Full',
            mistakes: form.mistakes,
            pauses: form.pauses,
            time: 'Just Now'
        };
        setEntries([newEntry, ...entries]);
        setForm({ studentId: '', category: 'Sabaq', para: 1, ayahRange: '', mistakes: 0, pauses: 0 });
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2F6B4F]/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">📖</span>
                            <h1 className="text-3xl lg:text-4xl font-black text-[#1c3c33] tracking-tight">Daily Progress</h1>
                        </div>
                        <p className="text-[#1c3c33]/60 font-bold text-sm">Log Sabaq, Sabqi, and Manzil for your students.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white text-[#1c3c33] border border-[#d0d8cf] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-all shadow-sm">View Reports</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Log Form Area */}
                    <div className="xl:col-span-5 relative">
                        {/* Sticky container for the form */}
                        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)] sticky top-8">
                            <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight mb-8">Record Entry</h2>

                            <div className="space-y-8">
                                {/* Segmented Control for Category */}
                                <div className="bg-[#FDFBF7] p-1.5 rounded-2xl border border-[#d0d8cf] flex gap-1">
                                    {(['Sabaq', 'Sabqi', 'Manzil'] as const).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setForm({ ...form, category: cat })}
                                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${form.category === cat
                                                ? 'bg-white text-[#2F6B4F] shadow-sm border border-[#2F6B4F]/20'
                                                : 'text-[#1c3c33]/40 hover:text-[#1c3c33]'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Student Selection */}
                                <FormSection label="Student Name" description="Select from your Halaqa">
                                    <select
                                        className="w-full px-6 py-4 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-sm rounded-2xl focus:outline-none focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 transition-all appearance-none cursor-pointer"
                                        value={form.studentId}
                                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                                    >
                                        <option value="" disabled>Choose a student...</option>
                                        {mockStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </FormSection>

                                {/* Para & Ayah */}
                                <div className="grid grid-cols-2 gap-6">
                                    <FormSection label="Para / Juz" description="1-30">
                                        <input
                                            type="number"
                                            min="1" max="30"
                                            placeholder="1"
                                            className="w-full px-6 py-4 bg-[#FDFBF7] border border-[#d0d8cf] text-[#2F6B4F] font-black text-xl rounded-2xl focus:outline-none focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 transition-all"
                                            value={form.para || ''}
                                            onChange={(e) => setForm({ ...form, para: parseInt(e.target.value) || 1 })}
                                        />
                                    </FormSection>
                                    <FormSection label="Ayah Range" description="e.g. 5-10">
                                        <input
                                            type="text"
                                            placeholder="Full"
                                            className="w-full px-6 py-4 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-sm rounded-2xl focus:outline-none focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 transition-all"
                                            value={form.ayahRange}
                                            onChange={(e) => setForm({ ...form, ayahRange: e.target.value })}
                                        />
                                    </FormSection>
                                </div>

                                {/* Mistakes & Pauses */}
                                <div className="grid grid-cols-2 gap-6">
                                    <FormSection label="Mistakes" description="Ghalti">
                                        <div className="flex bg-[#FDFBF7] border border-[#d0d8cf] p-1 rounded-2xl items-center">
                                            <button onClick={() => setForm({ ...form, mistakes: Math.max(0, form.mistakes - 1) })} className="w-12 h-12 flex items-center justify-center text-xl text-[#1c3c33]/50 hover:text-[#1c3c33] hover:bg-white rounded-xl transition-all">-</button>
                                            <span className="flex-1 text-center font-black text-xl text-[#D32F2F]">{form.mistakes}</span>
                                            <button onClick={() => setForm({ ...form, mistakes: form.mistakes + 1 })} className="w-12 h-12 flex items-center justify-center text-xl text-[#1c3c33]/50 hover:text-[#1c3c33] hover:bg-white rounded-xl transition-all">+</button>
                                        </div>
                                    </FormSection>
                                    <FormSection label="Pauses" description="Atki">
                                        <div className="flex bg-[#FDFBF7] border border-[#d0d8cf] p-1 rounded-2xl items-center">
                                            <button onClick={() => setForm({ ...form, pauses: Math.max(0, form.pauses - 1) })} className="w-12 h-12 flex items-center justify-center text-xl text-[#1c3c33]/50 hover:text-[#1c3c33] hover:bg-white rounded-xl transition-all">-</button>
                                            <span className="flex-1 text-center font-black text-xl text-[#F57C00]">{form.pauses}</span>
                                            <button onClick={() => setForm({ ...form, pauses: form.pauses + 1 })} className="w-12 h-12 flex items-center justify-center text-xl text-[#1c3c33]/50 hover:text-[#1c3c33] hover:bg-white rounded-xl transition-all">+</button>
                                        </div>
                                    </FormSection>
                                </div>

                                <button
                                    onClick={addEntry}
                                    disabled={!form.studentId}
                                    className="w-full py-5 bg-[#2F6B4F] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#285c44] transition-all shadow-lg shadow-[#2F6B4F]/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-2"
                                >
                                    Save Progress Entry
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Area */}
                    <div className="xl:col-span-7 space-y-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xl font-black text-[#1c3c33] tracking-tight">Recent Submissions</h2>
                            <span className="text-[10px] font-black text-[#2F6B4F] bg-[#E5F4EC] px-3 py-1.5 rounded-full uppercase tracking-widest">{entries.length} Today</span>
                        </div>

                        <div className="space-y-4">
                            {entries.map((item) => (
                                <div key={item.id} className="bg-white p-6 md:p-8 rounded-[32px] border border-[#1c3c33]/5 shadow-sm hover:shadow-[0_10px_30px_rgba(28,60,51,0.03)] transition-all group flex flex-col sm:flex-row gap-6 sm:items-center">

                                    {/* Icon & Details */}
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${item.category === 'Sabaq' ? 'bg-[#E5F4EC] text-[#2F6B4F]' :
                                                item.category === 'Sabqi' ? 'bg-[#E3F2FD] text-[#1976D2]' :
                                                    'bg-[#FFF3E0] text-[#F57C00]'
                                            }`}>
                                            {item.category === 'Sabaq' ? '📗' : item.category === 'Sabqi' ? '📘' : '📙'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-black text-[#1c3c33] tracking-tight">{item.name}</h3>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${item.category === 'Sabaq' ? 'bg-[#E5F4EC] text-[#2F6B4F]' :
                                                        item.category === 'Sabqi' ? 'bg-[#E3F2FD] text-[#1976D2]' :
                                                            'bg-[#FFF3E0] text-[#F57C00]'
                                                    }`}>{item.category}</span>
                                            </div>
                                            <p className="text-sm font-bold text-[#1c3c33]/50 mt-1">Para {item.para} <span className="mx-1">•</span> Ayah {item.ayah}</p>
                                        </div>
                                    </div>

                                    {/* Metrics & Time */}
                                    <div className="flex items-center justify-between sm:justify-end gap-8 bg-[#FDFBF7] sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-[#d0d8cf] sm:border-none">
                                        <div className="flex gap-6">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-[#D32F2F]/60 uppercase tracking-widest mb-1">Mistakes</p>
                                                <p className="text-xl font-black text-[#D32F2F] leading-none">{item.mistakes}</p>
                                            </div>
                                            <div className="w-px h-8 bg-[#d0d8cf]/50 self-center"></div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-[#F57C00]/60 uppercase tracking-widest mb-1">Pauses</p>
                                                <p className="text-xl font-black text-[#F57C00] leading-none">{item.pauses}</p>
                                            </div>
                                        </div>
                                        <div className="text-right pl-4 border-l border-[#d0d8cf]/50 hidden sm:block">
                                            <p className="text-[10px] font-bold text-[#1c3c33]/40 uppercase tracking-widest">{item.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {entries.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-[#d0d8cf]">
                                    <div className="text-4xl mb-4 opacity-50">📝</div>
                                    <h3 className="text-lg font-black text-[#1c3c33]/50 tracking-tight">No entries yet</h3>
                                    <p className="text-sm font-medium text-[#1c3c33]/40 mt-1">Select a student and record their progress.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormSection({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-[#1c3c33]/70 uppercase tracking-widest">{label}</label>
                {description && <span className="text-[10px] font-bold text-[#1c3c33]/30">{description}</span>}
            </div>
            {children}
        </div>
    );
}
