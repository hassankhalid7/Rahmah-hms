'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EnrollStudentButton({ classId }: { classId: string }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [students, setStudents] = useState<{ id: string, name: string, studentId: string }[]>([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        if (isOpen && students.length === 0) {
            setLoading(true);
            fetch('/api/students')
                .then(res => res.json())
                .then(data => setStudents(data)) // Assuming API returns id, name, studentId
                .finally(() => setLoading(false));
        }
    }, [isOpen, students.length]);

    const handleEnroll = async () => {
        if (!selectedStudent) return;
        setEnrolling(true);
        try {
            const res = await fetch(`/api/classes/${classId}/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: selectedStudent }),
            });

            if (!res.ok) throw new Error(await res.text());

            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to enroll student');
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all active:scale-95"
            >
                + Enroll Student
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 space-y-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">Enroll Student</h3>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Select Student</label>
                                {loading ? (
                                    <div className="w-full p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-400 animate-pulse">Loading students...</div>
                                ) : (
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-500 outline-none transition-all text-sm"
                                        value={selectedStudent}
                                        onChange={(e) => setSelectedStudent(e.target.value)}
                                    >
                                        <option value="">Choose a student...</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleEnroll}
                            disabled={!selectedStudent || enrolling}
                            className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-xl shadow-brand-200 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
