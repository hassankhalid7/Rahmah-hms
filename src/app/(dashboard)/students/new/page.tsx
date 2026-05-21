'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ClassItem { id: string; name: string; }

export default function AddStudentPage() {
    const router = useRouter();
    const [classes,    setClasses]    = useState<ClassItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error,      setError]      = useState('');

    // Form state
    const [form, setForm] = useState({
        firstName:        '',
        lastName:         '',
        phone:            '',
        address:          '',
        rollId:           '',
        description:      '',
        admissionDate:    new Date().toISOString().split('T')[0],
        classId:          '',
        guardianFirstName:'',
        guardianLastName: '',
        guardianRelation: '',
        guardianPhone:    '',
        guardianEmail:    '',
        gender:           'Male',
        dateOfBirth:      '',
        email:            '',
    });

    const set = (key: string, val: string) =>
        setForm(f => ({ ...f, [key]: val }));

    // Load classes
    useEffect(() => {
        fetch('/api/classes')
            .then(r => r.json())
            .then(data => setClasses(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    const handleSubmit = async () => {
        setError('');
        if (!form.firstName.trim()) { setError('First name is required.'); return; }
        if (!form.lastName.trim())  { setError('Last name is required.');  return; }
        if (!form.guardianFirstName.trim()) { setError('Guardian first name is required.'); return; }
        if (!form.guardianLastName.trim())  { setError('Guardian last name is required.');  return; }
        if (!form.guardianRelation.trim())  { setError('Guardian relation is required.');   return; }
        if (!form.guardianPhone.trim())     { setError('Guardian phone is required.');      return; }

        setSubmitting(true);
        try {
            // 1. Create student
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName:         form.firstName.trim(),
                    lastName:          form.lastName.trim(),
                    email:             form.email.trim() || undefined,
                    phone:             form.phone.trim() || undefined,
                    dateOfBirth:       form.dateOfBirth || undefined,
                    gender:            form.gender,
                    guardianFirstName: form.guardianFirstName.trim(),
                    guardianLastName:  form.guardianLastName.trim(),
                    guardianRelation:  form.guardianRelation.trim(),
                    guardianPhone:     form.guardianPhone.trim(),
                    guardianEmail:     form.guardianEmail.trim() || undefined,
                    admissionDate:     form.admissionDate || undefined,
                    address:           form.address.trim() || undefined,
                    assignedClass:     form.classId || undefined,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Failed to create student');
            }

            const newStudent = await res.json();

            // 2. Enroll in class if selected
            if (form.classId && newStudent?.id) {
                await fetch(`/api/classes/${form.classId}/enroll`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentId: newStudent.id }),
                }).catch(() => {}); // non-blocking
            }

            router.push('/students?role=admin');
        } catch (e: any) {
            setError(e.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link href="/students?role=admin"
                        className="w-9 h-9 rounded-xl border border-[#d0d8cf] bg-white flex items-center justify-center text-[#1c3c33]/50 hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors">
                        ←
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-[#1c3c33]">Add Student</h1>
                        <p className="text-xs text-[#1c3c33]/40 mt-0.5">Fill in student details and assign to a class</p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
                        ⚠️ {error}
                    </div>
                )}

                {/* ── Student Details ── */}
                <Section title="Student Details" icon="👤">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="First Name *">
                                <input type="text" placeholder="e.g. Ali" value={form.firstName}
                                    onChange={e => set('firstName', e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Last Name *">
                                <input type="text" placeholder="e.g. Raza" value={form.lastName}
                                    onChange={e => set('lastName', e.target.value)} className={inputCls} />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Roll / Student ID">
                                <input type="text" placeholder="e.g. STU-001" value={form.rollId}
                                    onChange={e => set('rollId', e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Phone Number">
                                <input type="tel" placeholder="+92 300 1234567" value={form.phone}
                                    onChange={e => set('phone', e.target.value)} className={inputCls} />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Date of Birth">
                                <input type="date" value={form.dateOfBirth}
                                    onChange={e => set('dateOfBirth', e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Gender">
                                <select value={form.gender} onChange={e => set('gender', e.target.value)} className={inputCls}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </Field>
                        </div>
                        <Field label="Email (optional)">
                            <input type="email" placeholder="student@example.com" value={form.email}
                                onChange={e => set('email', e.target.value)} className={inputCls} />
                        </Field>
                        <Field label="Address">
                            <input type="text" placeholder="Complete residential address" value={form.address}
                                onChange={e => set('address', e.target.value)} className={inputCls} />
                        </Field>
                        <Field label="Description / Comments">
                            <textarea rows={3} placeholder="Any notes about this student…" value={form.description}
                                onChange={e => set('description', e.target.value)}
                                className={`${inputCls} resize-none`} />
                        </Field>
                    </div>
                </Section>

                {/* ── Guardian Information ── */}
                <Section title="Guardian / Parent Information" icon="👨‍👩‍👧">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Guardian First Name *">
                                <input type="text" placeholder="First name" value={form.guardianFirstName}
                                    onChange={e => set('guardianFirstName', e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Guardian Last Name *">
                                <input type="text" placeholder="Last name" value={form.guardianLastName}
                                    onChange={e => set('guardianLastName', e.target.value)} className={inputCls} />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Relation *">
                                <input type="text" placeholder="e.g. Father, Mother" value={form.guardianRelation}
                                    onChange={e => set('guardianRelation', e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Phone Number *">
                                <input type="tel" placeholder="+92 300 1234567" value={form.guardianPhone}
                                    onChange={e => set('guardianPhone', e.target.value)} className={inputCls} />
                            </Field>
                        </div>
                        <Field label="Guardian Email (optional)">
                            <input type="email" placeholder="guardian@example.com" value={form.guardianEmail}
                                onChange={e => set('guardianEmail', e.target.value)} className={inputCls} />
                        </Field>
                    </div>
                </Section>

                {/* ── Admission Details ── */}
                <Section title="Admission Details" icon="🏫">
                    <div className="space-y-4">
                        <Field label="Admission Date">
                            <input type="date" value={form.admissionDate}
                                onChange={e => set('admissionDate', e.target.value)} className={inputCls} />
                        </Field>
                        <Field label="Assign to Class">
                            <select value={form.classId} onChange={e => set('classId', e.target.value)} className={inputCls}>
                                <option value="">Select a class (optional)…</option>
                                {classes.length === 0 && (
                                    <option disabled>No classes found — create a class first</option>
                                )}
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {classes.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1.5">
                                    No classes yet.{' '}
                                    <Link href="/classes/new?role=admin" className="font-bold underline">Create a class first →</Link>
                                </p>
                            )}
                        </Field>
                    </div>
                </Section>

                {/* ── Actions ── */}
                <div className="flex gap-3 pb-8">
                    <Link href="/students?role=admin"
                        className="flex-1 py-3 rounded-2xl border border-[#d0d8cf] bg-white text-sm font-bold text-[#1c3c33]/60 text-center hover:border-[#1c3c33]/40 transition-colors">
                        Cancel
                    </Link>
                    <button onClick={handleSubmit} disabled={submitting}
                        className="flex-1 py-3 rounded-2xl bg-[#2F6B4F] text-white text-sm font-bold hover:bg-[#285c44] transition-colors shadow-lg shadow-[#2F6B4F]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? 'Adding…' : 'Add Student'}
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
