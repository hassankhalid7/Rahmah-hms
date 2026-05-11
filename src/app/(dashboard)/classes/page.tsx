'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ClassData {
    id: string;
    name: string;
    description?: string;
    teacherName: string;
    // studentCount: number; // TODO: Add later
    schedule: any[];
}

export default function ClassesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await fetch('/api/classes');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setClasses(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchClasses();
    }, []);

    const filteredClasses = classes.filter(c =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Halaqa Management</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage classes, assign teachers, and track enrollments.</p>
                </div>
                <Link href="/classes/new" className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 inline-flex items-center gap-2 active:scale-95">
                    <span>+</span> Create New Halaqa
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex-1 w-full relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale opacity-40">🔍</span>
                    <input
                        type="text"
                        placeholder="Search classes..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-500/20 text-sm font-bold text-gray-700 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 h-64 animate-pulse bg-gray-50/50"></div>
                    ))
                ) : filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                        <Link
                            href={`/classes/${cls.id}`}
                            key={cls.id}
                            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 hover:-translate-y-1 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black grayscale group-hover:scale-110 transition-transform">🕌</div>

                            <div className="relative z-10 space-y-6">
                                <div className="space-y-2">
                                    <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Active</span>
                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-brand-600 transition-colors">{cls.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{cls.description || 'No description provided.'}</p>
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-white shadow-sm text-lg">👨‍🏫</div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Teacher</p>
                                            <p className="text-sm font-bold text-gray-900">{cls.teacherName}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all">
                                        →
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-6xl mb-4 grayscale opacity-20">🕌</div>
                        <p className="text-gray-400 font-bold italic">No classes found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
