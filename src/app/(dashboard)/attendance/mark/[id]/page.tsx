'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';

export default function MarkAttendancePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    // Mock student list
    const initialStudents = [
        { id: '1', name: 'Zaid Al-Harbi', gender: 'Male', lastStatus: 'Present', status: 'Present' },
        { id: '2', name: 'Omar Mansour', gender: 'Male', lastStatus: 'Absent', status: 'Present' },
        { id: '3', name: 'Ahmed Khan', gender: 'Male', lastStatus: 'Present', status: 'Present' },
        { id: '4', name: 'Yusuf Raza', gender: 'Male', lastStatus: 'Late', status: 'Present' },
        { id: '5', name: 'Abdullah Khan', gender: 'Male', lastStatus: 'Present', status: 'Present' },
    ];

    const [students, setStudents] = useState(initialStudents);
    const [isSaving, setIsSaving] = useState(false);

    const toggleStatus = (studentId: string, newStatus: string) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Daily records synthesized successfully');
            window.location.href = '/attendance';
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-gray-100">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/attendance"
                            className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all group border border-gray-100 shadow-xl shadow-gray-200/50"
                        >
                            <span className="text-2xl transition-transform group-hover:-translate-x-1">←</span>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Daily Record</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Halaqa A</span>
                                <span className="text-gray-400 font-bold text-sm">February 09, 2026</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-right bg-white px-8 py-4 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Marking Queue</p>
                        <p className="text-3xl font-black text-brand-600 leading-none">{students.length} / {students.length}</p>
                    </div>
                </header>

                {/* Selection Area */}
                <div className="space-y-6">
                    {students.map((student) => (
                        <div key={student.id} className="flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-[40px] border border-gray-100 hover:border-brand-500/20 hover:shadow-2xl hover:shadow-brand-900/5 transition-all group relative overflow-hidden">
                            <div className="flex items-center gap-6 mb-6 md:mb-0 w-full md:w-auto relative z-10">
                                <div className="w-16 h-16 bg-gray-50 rounded-[28px] flex items-center justify-center font-black text-brand-600 shadow-inner border border-gray-100 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 text-2xl group-hover:rotate-6">
                                    {student.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg tracking-tight group-hover:text-brand-700 transition-colors uppercase">{student.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{student.id}</p>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest">History: {student.lastStatus}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto bg-gray-50 p-2.5 rounded-[32px] relative z-10 border border-gray-100">
                                <AttendanceToggle
                                    label="Present"
                                    color="bg-brand-600"
                                    shortcut="P"
                                    active={student.status === 'Present'}
                                    onClick={() => toggleStatus(student.id, 'Present')}
                                />
                                <AttendanceToggle
                                    label="Late"
                                    color="bg-amber-500"
                                    shortcut="L"
                                    active={student.status === 'Late'}
                                    onClick={() => toggleStatus(student.id, 'Late')}
                                />
                                <AttendanceToggle
                                    label="Absent"
                                    color="bg-rose-500"
                                    shortcut="A"
                                    active={student.status === 'Absent'}
                                    onClick={() => toggleStatus(student.id, 'Absent')}
                                />
                                <AttendanceToggle
                                    label="Excused"
                                    color="bg-brand-500"
                                    shortcut="E"
                                    active={student.status === 'Excused'}
                                    onClick={() => toggleStatus(student.id, 'Excused')}
                                />
                            </div>
                            <div className="absolute -right-4 -bottom-4 text-[150px] font-black italic text-gray-50/50 group-hover:text-brand-500/5 transition-all duration-700 select-none pointer-events-none">...</div>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <footer className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
                    <div className="flex items-center gap-6 bg-white px-8 py-4 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full shadow-[0_0_15px_rgba(121,85,72,0.5)] ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-brand-500'}`}></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isSaving ? 'Syncing...' : 'Encrypted & Secured'}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full md:w-auto px-16 py-6 bg-gray-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-gray-300 hover:bg-brand-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSaving ? 'Processing Records...' : 'Submit Final Attendance'}
                    </button>
                </footer>
            </div>
        </div>
    );
}

function AttendanceToggle({ label, color, shortcut, active, onClick }: { label: string; color: string; shortcut: string; active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 md:flex-none px-6 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${active
                ? `${color} text-white shadow-xl shadow-current/30 scale-110 relative z-20`
                : `bg-transparent text-gray-400 hover:text-gray-600 hover:bg-white/50 px-5`
                }`}
        >
            <span className="hidden md:inline mr-1">{label}</span>
            <span className="md:hidden lg:inline">{shortcut}</span>
        </button>
    );
}
