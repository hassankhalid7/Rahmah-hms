'use client';

import { useState, useEffect } from 'react';

type Status = 'present' | 'absent' | 'late' | 'leave';

interface ClassItem  { id: string; name: string; }
interface StudentRow { id: string; userId: string; name: string; status: Status; }

const STATUS_CONFIG: Record<Status, { label: string; icon: string; bg: string; text: string; border: string }> = {
    present: { label: 'Present', icon: '✓', bg: 'bg-[#E5F4EC]', text: 'text-[#2F6B4F]', border: 'border-[#2F6B4F]/25' },
    absent:  { label: 'Absent',  icon: '✗', bg: 'bg-[#FFEBEE]', text: 'text-[#D32F2F]', border: 'border-[#D32F2F]/25' },
    late:    { label: 'Late',    icon: '◷', bg: 'bg-[#E3F2FD]', text: 'text-[#1565C0]', border: 'border-[#1565C0]/25' },
    leave:   { label: 'Leave',   icon: '◌', bg: 'bg-[#FFF3E0]', text: 'text-[#F57C00]', border: 'border-[#F57C00]/25' },
};

export default function AttendancePage() {
    const today = new Date().toISOString().split('T')[0];

    const [date,     setDate]     = useState(today);
    const [classes,  setClasses]  = useState<ClassItem[]>([]);
    const [classId,  setClassId]  = useState('');
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [loading,  setLoading]  = useState(false);
    const [saving,   setSaving]   = useState(false);
    const [saved,    setSaved]    = useState(false);

    // Load classes on mount
    useEffect(() => {
        fetch('/api/classes')
            .then(r => r.json())
            .then(data => setClasses(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    // Load students when class selected
    useEffect(() => {
        if (!classId) { setStudents([]); return; }
        setLoading(true);
        fetch(`/api/classes/${classId}/students`)
            .then(r => r.json())
            .then(data =>
                setStudents(
                    (Array.isArray(data) ? data : []).map((s: any) => ({
                        ...s,
                        status: 'present' as Status,
                    }))
                )
            )
            .catch(() => setStudents([]))
            .finally(() => setLoading(false));
    }, [classId]);

    const setStatus = (id: string, status: Status) =>
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));

    const markAll = (status: Status) =>
        setStudents(prev => prev.map(s => ({ ...s, status })));

    const handleSave = async () => {
        if (!classId || students.length === 0) return;
        setSaving(true);
        try {
            await Promise.all(
                students.map(s =>
                    fetch('/api/attendance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            date,
                            student_id: s.userId,
                            status:     s.status,
                        }),
                    })
                )
            );
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            alert('Failed to save attendance. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const ready = date && classId;

    // Summary counts
    const counts = (['present','absent','late','leave'] as Status[]).reduce(
        (acc, s) => ({ ...acc, [s]: students.filter(st => st.status === s).length }),
        {} as Record<Status, number>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-[#1c3c33]">Attendance</h1>
                        <p className="text-xs text-[#1c3c33]/40 mt-0.5">Mark daily attendance for your class</p>
                    </div>
                    {saved && (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                            ✓ Saved successfully
                        </span>
                    )}
                </div>

                {/* ── Date & Class selectors ── */}
                <div className="bg-white rounded-2xl border border-[#1c3c33]/6 shadow-sm p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className={labelCls}>Date</label>
                            <input type="date" value={date}
                                onChange={e => { setDate(e.target.value); setSaved(false); }}
                                className={inputCls} />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelCls}>Class</label>
                            <select value={classId}
                                onChange={e => { setClassId(e.target.value); setSaved(false); }}
                                className={inputCls}>
                                <option value="">Select a class…</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Placeholder ── */}
                {!ready && (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-[#d0d8cf] text-center gap-2">
                        <span className="text-3xl">📅</span>
                        <p className="text-sm font-bold text-[#1c3c33]/50">Select date and class first</p>
                    </div>
                )}

                {/* ── Loading ── */}
                {ready && loading && (
                    <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-[#1c3c33]/6">
                        <div className="w-7 h-7 border-2 border-[#2F6B4F] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* ── No students in class ── */}
                {ready && !loading && students.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-[#d0d8cf] text-center gap-2">
                        <span className="text-3xl">👤</span>
                        <p className="text-sm font-bold text-[#1c3c33]/50">No students in this class yet</p>
                        <p className="text-xs text-[#1c3c33]/30">Add students to this class first</p>
                    </div>
                )}

                {/* ── Attendance list ── */}
                {ready && !loading && students.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[#1c3c33]/6 shadow-sm overflow-hidden">

                        {/* Summary + Mark All */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#1c3c33]/5 bg-[#FAFAF8]">
                            {/* Summary pills */}
                            <div className="flex flex-wrap gap-1.5">
                                {(['present','absent','late','leave'] as Status[]).map(s => {
                                    const c = STATUS_CONFIG[s];
                                    return (
                                        <span key={s} className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                                            {counts[s]} {c.label}
                                        </span>
                                    );
                                })}
                            </div>
                            {/* Mark all */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-[#1c3c33]/35 uppercase tracking-widest">Mark all:</span>
                                {(['present','absent','late','leave'] as Status[]).map(s => {
                                    const c = STATUS_CONFIG[s];
                                    return (
                                        <button key={s} onClick={() => markAll(s)}
                                            className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-colors hover:opacity-80 ${c.bg} ${c.text} ${c.border}`}>
                                            {c.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Student rows */}
                        <div className="divide-y divide-[#1c3c33]/5">
                            {students.map((student, i) => {
                                const active = STATUS_CONFIG[student.status];
                                return (
                                    <div key={student.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors gap-3">
                                        {/* Name */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#E8F5EE] flex items-center justify-center text-xs font-black text-[#2F6B4F] shrink-0">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1c3c33]">{student.name}</p>
                                                <p className="text-[10px] text-[#1c3c33]/35">#{i + 1}</p>
                                            </div>
                                        </div>

                                        {/* Status buttons */}
                                        <div className="flex gap-1.5">
                                            {(['present','absent','late','leave'] as Status[]).map(s => {
                                                const c = STATUS_CONFIG[s];
                                                const isActive = student.status === s;
                                                return (
                                                    <button key={s}
                                                        onClick={() => setStatus(student.id, s)}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${
                                                            isActive
                                                                ? `${c.bg} ${c.text} ${c.border} shadow-sm`
                                                                : 'bg-white text-[#1c3c33]/35 border-[#d0d8cf] hover:border-[#1c3c33]/25'
                                                        }`}>
                                                        <span>{c.icon}</span>
                                                        <span className="hidden sm:inline">{c.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Save footer */}
                        <div className="px-5 py-4 border-t border-[#1c3c33]/5 bg-[#FAFAF8] flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-[10px] font-medium text-[#1c3c33]/35 text-center sm:text-left">
                                {students.length} students · {date}
                            </p>
                            <button onClick={handleSave} disabled={saving}
                                className={`w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    saved
                                        ? 'bg-[#E5F4EC] text-[#2F6B4F] border border-[#2F6B4F]/20'
                                        : 'bg-[#2F6B4F] text-white hover:bg-[#285c44] shadow-[#2F6B4F]/20'
                                }`}>
                                {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Attendance'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const inputCls = 'w-full rounded-xl border border-[#d0d8cf] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#1c3c33] outline-none focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/10 transition-colors';
const labelCls = 'text-[10px] font-black text-[#1c3c33]/50 uppercase tracking-widest';
