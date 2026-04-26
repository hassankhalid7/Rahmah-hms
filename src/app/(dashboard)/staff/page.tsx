'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface StaffMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    specialization?: string;
    employeeNumber?: string;
}

export default function StaffPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchStaff() {
            try {
                const res = await fetch('/api/staff');
                if (!res.ok) throw new Error('Failed to fetch staff');
                const data = await res.json();
                setStaff(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load staff');
            } finally {
                setLoading(false);
            }
        }
        fetchStaff();
    }, []);

    const filteredStaff = staff.filter(s => {
        const matchesSearch =
            s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = filterRole === 'All' || s.role === filterRole.toLowerCase();

        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Staff Directory</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage teachers, admins, and support staff.</p>
                </div>
                <Link href="/staff/new" className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 inline-flex items-center gap-2 active:scale-95">
                    <span>+</span> Add New Staff
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex-1 w-full relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale opacity-40">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-500/20 text-sm font-bold text-gray-700 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {['All', 'Teacher', 'Institute_Admin'].map(role => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterRole === role ? 'bg-brand-600 text-white shadow-xl shadow-brand-200' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                        >
                            {role.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name & Role</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Contact</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Specialization</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-gray-400 animate-pulse">
                                    Loading staff...
                                </td>
                            </tr>
                        ) : filteredStaff.length > 0 ? filteredStaff.map((member) => (
                            <tr key={member.id} className="hover:bg-brand-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100 group-hover:rotate-6 transition-transform">
                                            {member.role === 'teacher' ? '👨‍🏫' : '👔'}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 leading-none">{member.firstName} {member.lastName}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">{member.role.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-bold text-gray-700">{member.email}</span>
                                        <span className="text-[10px] text-gray-400">{member.phone}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center text-sm font-bold text-gray-600">{member.specialization || '--'}</td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-brand-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                        <span className="text-xs font-bold text-gray-700 capitalize">{member.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link href={`/staff/${member.id}`} className="px-4 py-2 bg-white border border-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm active:scale-95">
                                        View Profile
                                    </Link>
                                </td>
                            </tr>
                        ))
                            : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="text-4xl mb-4 grayscale opacity-20">📂</div>
                                        <p className="text-gray-400 font-bold italic">No staff found.</p>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
