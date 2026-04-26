'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Student {
    id: string;
    studentId: string;
    name: string;
    class?: string;
    track?: string; // We might need to derive this from active class or progress
    status: string;
    joiningDate: string;
    email?: string;
}

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTrack, setFilterTrack] = useState('All');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchStudents() {
            try {
                const res = await fetch('/api/students');
                if (!res.ok) throw new Error('Failed to fetch students');
                const data = await res.json();
                setStudents(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load students');
            } finally {
                setLoading(false);
            }
        }
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(s => {
        const nameMatch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const idMatch = (s.studentId || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || idMatch;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Student Directory</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage and monitor student enrollments across all tracks.</p>
                </div>
                <Link href="/students/new" className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 inline-flex items-center gap-2 active:scale-95">
                    <span>+</span> Add New Student
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex-1 w-full relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale opacity-40">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name or student ID..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-500/20 text-sm font-bold text-gray-700 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {['All', 'Hifz', 'Nazra', 'Qaida'].map(track => (
                        <button
                            key={track}
                            onClick={() => setFilterTrack(track)}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterTrack === track ? 'bg-brand-600 text-white shadow-xl shadow-brand-200' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                        >
                            {track}
                        </button>
                    ))}
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student info</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Learning Track</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Halaqa</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-gray-400 animate-pulse">
                                    Loading students...
                                </td>
                            </tr>
                        ) : filteredStudents.length > 0 ? filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-brand-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100 group-hover:rotate-6 transition-transform">👤</div>
                                        <div>
                                            <p className="font-black text-gray-900 leading-none">{student.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">{student.studentId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {/* Track placeholder - pending implementation */}
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600`}>
                                        --
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center text-sm font-bold text-gray-600">{student.class || '--'}</td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${student.status === 'active' ? 'bg-brand-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                        <span className="text-xs font-bold text-gray-700 capitalize">{student.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link href={`/students/${student.id}`} className="px-4 py-2 bg-white border border-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm active:scale-95">
                                        View Profile
                                    </Link>
                                </td>
                            </tr>
                        ))
                            : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="text-4xl mb-4 grayscale opacity-20">📂</div>
                                        <p className="text-gray-400 font-bold italic">No students found.</p>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between px-4 pb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing {filteredStudents.length} Students</p>
                {/* Pagination controls can be implemented later */}
            </div>
        </div>
    );
}
