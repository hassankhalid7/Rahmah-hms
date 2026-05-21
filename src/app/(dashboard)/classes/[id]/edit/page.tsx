'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Teacher { id: string; name: string; }
interface Student { id: string; name: string; studentNumber?: string; }
interface Enrollment { id: string; studentId: string; name: string; }

export default function EditClassPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading,    setLoading]    = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error,      setError]      = useState('');
    const [success,    setSuccess]    = useState('');

    const [teachers,    setTeachers]    = useState<Teacher[]>([]);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [enrolled,    setEnrolled]    = useState<Enrollment[]>([]);

    // Form fields
    const [className,   setClassName]   = useState('');
    const [description, setDescription] = useState('');
    const [teacherId,   setTeacherId]   = useState('');

    // New students to add
    const [newSlots, setNewSlots] = useState<string[]>(['']);

    useEffect(() => {
        // Load teachers
        fetch('/api/staff?role=teacher')
            .then(r => r.json())
            .then(data => setTeachers(
                (Array.isArray(data) ? data : []).map((t: any) => ({
                    id: t.teacherId || t.id,
                    name: `${t.firstName || ''} ${t.lastName || ''}`.trim(),
                }))
            )).catch(() => {});

        // Load all students
        fetch('/api/students')
            .then(r => r.json())
            .then(data => setAllStudents(
                (Array.isArray(data) ? data : []).map((s: any) => ({
                    id: s.id,
                    name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim(),
                    studentNumber: s.studentId || s.studentNumber || '',
                }))
            )).catch(() => {});

        // Load class details
        fetch(`/api/classes/${id}`)
            .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
            .then(data => {
                setClassName(data.name || '');
                setDescription(data.description || '');
                setTeacherId(data.teacherId || '');
                const enrollments = (data.enrollments || []).map((e: any) => ({
                    id: e.id,
                    studentId: e.student?.id || e.studentId,
                    name: e.student?.user
                        ? `${e.student.user.firstName} ${e.student.user.lastName}`.trim()
                        : 'Unknown',
                }));
                setEnrolled(enrollments);
                setLoading(false);
            })
            .catch(() => { router.push('/classes?role=admin'); });
    }, [id, router]);

    // Remove enrolled student
    const removeEnrolled = async (studentId: string) => {
        try {
            await fetch(`/api/classes/${id}/enroll?studentId=${studentId}`, { method: 'DELETE' });
            setEnrolled(prev => prev.filter(e => e.studentId !== studentId));
        } catch { alert('Failed to remove student'); }
    };

    // New slot helpers
    const updateSlot = (index: number, value: string) =>
        setNewSlots(prev => prev.map((s, i) => i === index ? value : s));
    const addSlot = () => setNewSlots(prev => [...prev, '']);
    const removeSlot = (index: number) =>
        setNewSlots(prev => prev.filter((_, i) => i !== index));

    // Students not yet enrolled
    const enrolledIds = enrolled.map(e => e.studentId);
    const unenrolled = allStudents.filter(s => !enrolledIds.includes(s.id));
    const availableFor = (index: number) => {
        const others = newSlots.filter((_, i) => i !== index).filter(Boolean);
        return unenrolled.filter(s => !others.includes(s.id));
    };

    const handleSave = async () => {
        setError(''); setSuccess('');
        if (!className.trim()) { setError('Class name is required.'); return; }
        setSubmitting(true);
        try {
            // Update class info
            const res = await fetch(`/api/classes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: className.trim(),
                    description: description.trim() || undefined,
                    teacherId: teacherId || undefined,
                    schedule: [],
                }),
            });
            if (!res.ok) throw new Error(await res.text());

            // Enroll new students
            const toEnroll = newSlots.filter(Boolean);
            await Promise.all(
                toEnroll.map(studentId =>
                    fetch(`/api/classes/${id}/enroll`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentId }),
                    })
                )
            );

            setSuccess('Changes saved successfully!');
            setNewSlots(['']);
            // Refresh enrolled list
            const updated = await fetch(`/api/classes/${id}`).then(r => r.json());
            setEnrolled((updated.enrollments || []).map((e: any) => ({
                id: e.id,
                studentId: e.student?.id || e.studentId,
                name: e.student?.user
                    ? `${e.student.user.firstName} ${e.student.user.lastName}`.trim()
                    : 'Unknown',
            })));
        } catch (e: any) {
            setError(e.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-2 border-[#2F6B4F] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link href={`/classes/${id}?role=admin`}
                        className="w-9 h-9 rounded-xl border border-[#d0d8cf] bg-white flex items-center justify-center text-[#1c3c33]/50 hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors">
                        ←
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-[#1c3c33]">Edit Class</h1>
                        <p className="text-xs text-[#1c3c33]/40 mt-0.5">Update class info, teacher and students</p>
                    </div>
                </div>

                {error   && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">⚠️ {error}</div>}
                {success && <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">✓ {success}</div>}

                {/* ── Class Information ── */}
                <Section title="Class Information" icon="📚">
                    <div className="space-y-4">
                        <Field label="Class Name *">
                            <input type="text" value={className}
                                onChange={e => setClassName(e.target.value)}
                                className={inputCls} />
                        </Field>
                        <Field label="Description (optional)">
                            <textarea rows={3} value={description}
                                onChange={e => setDescription(e.target.value)}
                                className={`${inputCls} resize-none`} />
                        </Field>
                    </div>
                </Section>

                {/* ── Teacher Information ── */}
                <Section title="Teacher Information" icon="👨‍🏫">
                    <Field label="Assigned Teacher">
                        <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className={inputCls}>
                            <option value="">Select a teacher…</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </Field>
                </Section>

                {/* ── Current Students ── */}
                <Section title="Enrolled Students" icon="🎓">
                    {enrolled.length === 0 ? (
                        <p className="text-xs text-[#1c3c33]/40 italic">No students enrolled yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {enrolled.map(e => (
                                <div key={e.studentId} className="flex items-center justify-between rounded-xl border border-[#d0d8cf]/60 bg-[#FAFAF8] px-3 py-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-xs font-black text-[#2F6B4F]">
                                            {e.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-semibold text-[#1c3c33]">{e.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeEnrolled(e.studentId)}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* ── Add More Students ── */}
                <Section title="Add More Students" icon="👤">
                    <div className="space-y-3">
                        {newSlots.map((val, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <select value={val} onChange={e => updateSlot(index, e.target.value)} className={inputCls}>
                                        <option value="">
                                            {index === 0 ? 'Select a student…' : 'Add another student…'}
                                        </option>
                                        {unenrolled.length === 0 && <option disabled>All students already enrolled</option>}
                                        {availableFor(index).map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}{s.studentNumber ? ` (${s.studentNumber})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {newSlots.length > 1 && (
                                    <button type="button" onClick={() => removeSlot(index)}
                                        className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center text-sm shrink-0">
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addSlot}
                            className="flex items-center gap-2 text-xs font-bold text-[#2F6B4F] hover:text-[#285c44] transition-colors mt-1">
                            <span className="w-6 h-6 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-sm">＋</span>
                            Add other student
                        </button>
                    </div>
                </Section>

                {/* ── Actions ── */}
                <div className="flex gap-3 pb-8">
                    <Link href={`/classes/${id}?role=admin`}
                        className="flex-1 py-3 rounded-2xl border border-[#d0d8cf] bg-white text-sm font-bold text-[#1c3c33]/60 text-center hover:border-[#1c3c33]/40 transition-colors">
                        Cancel
                    </Link>
                    <button onClick={handleSave} disabled={submitting}
                        className="flex-1 py-3 rounded-2xl bg-[#2F6B4F] text-white text-sm font-bold hover:bg-[#285c44] transition-colors shadow-lg shadow-[#2F6B4F]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

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
