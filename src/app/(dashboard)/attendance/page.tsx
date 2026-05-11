'use client';

import { useState } from 'react';

const SESSIONS = ['Morning', 'Afternoon', 'Evening'] as const;
type Session = typeof SESSIONS[number];
type Status = 'Present' | 'Absent' | 'Leave';

const STUDENTS = [
    'Abdul Momin', 'Ali Raza', 'Haider Ali', 'M.Ali Jameel',
    'M.Bilal', 'M.Faizan', 'M.Hassan', 'M.Subhan', 'M.Uzair Ali', 'Tahoor E Mustafa',
];

const STATUS_STYLES: Record<Status, string> = {
    Present: 'bg-[#E5F4EC] text-[#2F6B4F] border-[#2F6B4F]/20',
    Absent: 'bg-[#FFEBEE] text-[#D32F2F] border-[#D32F2F]/20',
    Leave: 'bg-[#FFF3E0] text-[#F57C00] border-[#F57C00]/20',
};

const STATUS_ICONS: Record<Status, string> = {
    Present: '✓',
    Absent: '✗',
    Leave: '◌',
};

export default function AttendancePage() {
    const today = new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long' });
    const [selectedSession, setSelectedSession] = useState<Session>('Morning');
    const [attendance, setAttendance] = useState<Record<string, Record<Session, Status>>>(() => {
        const init: Record<string, Record<Session, Status>> = {};
        STUDENTS.forEach(s => {
            init[s] = { Morning: 'Present', Afternoon: 'Present', Evening: 'Present' };
        });
        return init;
    });
    const [saved, setSaved] = useState(false);

    const setStatus = (student: string, session: Session, status: Status) => {
        setSaved(false);
        setAttendance(prev => ({
            ...prev,
            [student]: { ...prev[student], [session]: status },
        }));
    };

    const markAll = (status: Status) => {
        setSaved(false);
        setAttendance(prev => {
            const updated = { ...prev };
            STUDENTS.forEach(s => {
                updated[s] = { ...updated[s], [selectedSession]: status };
            });
            return updated;
        });
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const totalPresent = STUDENTS.filter(s => attendance[s][selectedSession] === 'Present').length;
    const totalAbsent = STUDENTS.filter(s => attendance[s][selectedSession] === 'Absent').length;
    const totalLeave = STUDENTS.filter(s => attendance[s][selectedSession] === 'Leave').length;

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 animate-in fade-in duration-700">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#2F6B4F]/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">📅</span>
                            <h1 className="text-3xl lg:text-4xl font-black text-[#1c3c33] tracking-tight">Attendance</h1>
                        </div>
                        <p className="text-[#1c3c33]/60 font-bold text-sm">{today}</p>
                    </div>

                    {/* Summary Pills */}
                    <div className="flex flex-wrap gap-2">
                        <div className="px-4 py-2 rounded-2xl bg-[#E5F4EC] text-[#2F6B4F] font-black text-xs uppercase tracking-widest border border-[#2F6B4F]/20">
                            {totalPresent} Present
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-[#FFEBEE] text-[#D32F2F] font-black text-xs uppercase tracking-widest border border-[#D32F2F]/20">
                            {totalAbsent} Absent
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-[#FFF3E0] text-[#F57C00] font-black text-xs uppercase tracking-widest border border-[#F57C00]/20">
                            {totalLeave} Leave
                        </div>
                    </div>
                </header>

                {/* Session Selector */}
                <div className="bg-white p-2 rounded-3xl border border-[#d0d8cf] shadow-sm flex flex-wrap gap-2 w-fit mx-auto md:mx-0">
                    {SESSIONS.map(session => (
                        <button
                            key={session}
                            onClick={() => setSelectedSession(session)}
                            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedSession === session
                                ? 'bg-[#2F6B4F] text-white shadow-md'
                                : 'text-[#1c3c33]/50 hover:text-[#1c3c33] hover:bg-[#FDFBF7]'
                                }`}
                        >
                            {session}
                        </button>
                    ))}
                </div>

                {/* Attendance List */}
                <div className="bg-white rounded-[40px] border border-[#d0d8cf] shadow-[0_10px_40px_rgba(28,60,51,0.03)] overflow-hidden">

                    {/* Bulk Actions Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 border-b border-[#1c3c33]/5 bg-[#FDFBF7]/50 gap-4">
                        <p className="text-sm font-black text-[#1c3c33]/40 uppercase tracking-widest">
                            {STUDENTS.length} Students List
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <span className="text-[10px] font-bold text-[#1c3c33]/30 uppercase tracking-widest self-center mr-2">Mark All:</span>
                            {(['Present', 'Absent', 'Leave'] as Status[]).map(s => (
                                <button
                                    key={s}
                                    onClick={() => markAll(s)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all hover:opacity-80 ${STATUS_STYLES[s]}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Student Rows */}
                    <div className="divide-y divide-[#1c3c33]/5">
                        {STUDENTS.map((student) => {
                            const status = attendance[student][selectedSession];
                            return (
                                <div key={student} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 hover:bg-[#FDFBF7] transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#1c3c33]/5 text-[#1c3c33] border border-[#d0d8cf] flex items-center justify-center font-black text-lg">
                                            {student.charAt(0)}
                                        </div>
                                        <p className="font-black text-lg text-[#1c3c33] tracking-tight">{student}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        {(['Present', 'Absent', 'Leave'] as Status[]).map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setStatus(student, selectedSession, s)}
                                                className={`flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest border transition-all hover:-translate-y-0.5 active:scale-95 ${status === s
                                                    ? STATUS_STYLES[s] + ' shadow-md'
                                                    : 'bg-white text-[#1c3c33]/40 border-[#d0d8cf] hover:border-[#1c3c33]/20 hover:text-[#1c3c33]'
                                                    }`}
                                            >
                                                <span className="text-xl sm:text-base">{STATUS_ICONS[s]}</span>
                                                <span>{s}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Save Footer */}
                    <div className="p-6 sm:p-8 border-t border-[#1c3c33]/5 bg-[#FDFBF7]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-bold text-[#1c3c33]/30 uppercase tracking-widest text-center sm:text-left">
                            Please ensure all records are accurate before saving.
                        </p>
                        <button
                            onClick={handleSave}
                            className={`w-full sm:w-auto px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${saved
                                ? 'bg-[#E5F4EC] text-[#2F6B4F] border border-[#2F6B4F]/20'
                                : 'bg-[#2F6B4F] text-white hover:bg-[#285c44] shadow-[#2F6B4F]/20'
                                }`}
                        >
                            {saved ? '✓ Successfully Saved' : 'Save Attendance Record'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
