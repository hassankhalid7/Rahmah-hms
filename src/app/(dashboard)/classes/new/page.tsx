'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Teacher { id: string; name: string; }
interface Student { id: string; name: string; studentNumber?: string; }

export default function CreateClassPage() {
    const router = useRouter();

    const [teachers, setTeachers]   = useState<Teacher[]>([]);
    const [students, setStudents]   = useState<Student[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]         = useState('');

    // Form state
    const [className,   setClassName]   = useState('');
    const [description, setDescription] = useState('');
    const [teacherId,   setTeacherId]   = useState('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>(['']); // start with one empty slot

    // Load teachers & students
    useEffect(() => {
        fetch('/api/staff?role=teacher')
            .then(r => r.json())
            .then(data => setTeachers(
                (Array.isArray(data) ? data : []).map((t: any) => ({
                    id: t.teacherId || t.id,
                    name: `${t.firstName || ''} ${t.lastName || ''}`.trim(),
                }))
            ))
            .catch(() => {});

        fetch('/api/students')
            .then(r => r.json())
            .then(data => setStudents(
                (Array.isArray(data) ? data : []).map((s: any) => ({
                    id: s.id,
                    name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim(),
                    studentNumber: s.studentId || s.studentNumber || '',
                }))
            ))
            .catch(() => {});
    }, []);

    // Student slot helpers
    const updateStudent = (index: number, value: string) => {
        setSelectedStudents(prev => prev.map((s, i) => i === index ? value : s));
    };
    const addStudentSlot = () => setSelectedStudents(prev => [...prev, '']);
    const removeStudentSlot = (index: number) =>
        setSelectedStudents(prev => prev.filter((_, i) => i !== index));

    // Available students for a slot (exclude already selected in other slots)
    const availableFor = (index: number) => {
        const others = selectedStudents.filter((_, i) => i !== index).filter(Boolean);
        return students.filter(s => !others.includes(s.id));
    };

    const handleSubmit = async () => {
        setError('');
        if (!className.trim()) { setError('Class name is required.'); return; }

        setSubmitting(true);
        try {
            // 1. Create class
            const res = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: className.trim(),
                    description: description.trim() || undefined,
                    teacherId: teacherId || undefined,
                    schedule: [],
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Failed to create class');
            }

            const newClass = await res.json();

            // 2. Enroll selected students
            const toEnroll = selectedStudents.filter(Boolean);
            await Promise.all(
                toEnroll.map(studentId =>
                    fetch(`/api/classes/${newClass.id}/enroll`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentId }),
                    })
                )
            );

            router.push(`/classes/${newClass.id}?role=admin`);
        } catch (e: any) {
            setError(e.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link href="/classes?role=admin"
                        className="w-9 h-9 rounded-xl border border-[#d0d8cf] bg-white flex items-center justify-center text-[#1c3c33]/50 hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors">
                        ←
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-[#1c3c33]">Create Class</h1>
                        <p className="text-xs text-[#1c3c33]/40 mt-0.5">Add class info, assign teacher and enroll students</p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
                        ⚠️ {error}
                    </div>
                )}

                {/* ── Class Information ── */}
                <Section title="Class Information" icon="📚">
                    <div className="space-y-4">
                        <Field label="Class Name *">
                            <input
                                type="text"
                                placeholder="e.g. Hifz Halqa Zaid bin Sabit"
                                value={className}
                                onChange={e => setClassName(e.target.value)}
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Description (optional)">
                            <textarea
                                rows={3}
                                placeholder="Brief description of this class…"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className={`${inputCls} resize-none`}
                            />
                        </Field>
                    </div>
                </Section>

                {/* ── Teacher Information ── */}
                <Section title="Teacher Information" icon="👨‍🏫">
                    <Field label="Assign Teacher">
                        <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className={inputCls}>
                            <option value="">Select a teacher…</option>
                            {teachers.length === 0 && (
                                <option disabled>No teachers found — add staff first</option>
                            )}
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        {teachers.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1.5">
                                No teachers yet.{' '}
                                <Link href="/staff/new?role=admin" className="font-bold underline">Add a teacher first →</Link>
                            </p>
                        )}
                    </Field>
                </Section>

                {/* ── Student Information ── */}
                <Section title="Student Information" icon="👤">
                    <div className="space-y-3">
                        {selectedStudents.map((val, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <select
                                        value={val}
                                        onChange={e => updateStudent(index, e.target.value)}
                                        className={inputCls}
                                    >
                                        <option value="">
                                            {index === 0 ? 'Select a student…' : `Add another student…`}
                                        </option>
                                        {students.length === 0 && (
                                            <option disabled>No students found — add students first</option>
                                        )}
                                        {availableFor(index).map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}{s.studentNumber ? ` (${s.studentNumber})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedStudents.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStudentSlot(index)}
                                        className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center text-sm shrink-0"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Add another student button */}
                        <button
                            type="button"
                            onClick={addStudentSlot}
                            className="flex items-center gap-2 text-xs font-bold text-[#2F6B4F] hover:text-[#285c44] transition-colors mt-1"
                        >
                            <span className="w-6 h-6 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-sm">＋</span>
                            Add other student
                        </button>

                        {students.length === 0 && (
                            <p className="text-xs text-amber-600">
                                No students yet.{' '}
                                <Link href="/students/new?role=admin" className="font-bold underline">Add students first →</Link>
                            </p>
                        )}
                    </div>
                </Section>

                {/* ── Actions ── */}
                <div className="flex gap-3 pb-8">
                    <Link href="/classes?role=admin"
                        className="flex-1 py-3 rounded-2xl border border-[#d0d8cf] bg-white text-sm font-bold text-[#1c3c33]/60 text-center hover:border-[#1c3c33]/40 transition-colors">
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 py-3 rounded-2xl bg-[#2F6B4F] text-white text-sm font-bold hover:bg-[#285c44] transition-colors shadow-lg shadow-[#2F6B4F]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? 'Creating…' : 'Create Class'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Helpers ──────────────────────────────────────────────────────
const inputCls = 'w-full rounded-xl border border-[#d0d8cf] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#1c3c33] outline-none focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/10 transition-colors';

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-[#1c3c33]/6 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1c3c33]/5 bg-[#FAFAF8]">
                <span className="text-base">{icon}</span>
                <h2 className="text-sm font-black text-[#1c3c33]">{title}</h2>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#1c3c33]/50 uppercase tracking-widest">{label}</label>
            {children}
        </div>
    );
}
