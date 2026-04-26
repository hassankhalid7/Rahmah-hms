'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Suspense } from 'react';

function DashboardContent() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* dynamic header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#2F6B4F]/10">
                <div>
                    <h1 className="text-3xl font-black text-[#1c3c33] tracking-tight">Admin Dashboard</h1>
                    <p className="text-[#1c3c33]/50 mt-1 font-bold text-sm">Faizan e Ashab e Sufa</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-[#d0d8cf] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1c3c33] hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-all shadow-sm">Institute Settings</button>
                    <button className="px-5 py-2.5 bg-[#2F6B4F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-all">Generate Reports</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard label="Total Students" value="8" change="Active" color="bg-[#E5F4EC] text-[#2F6B4F]" />
                <StatsCard label="Total Staff" value="2" change="Verified" color="bg-[#E3F2FD] text-[#1976D2]" />
                <StatsCard label="Overall Attendance" value="94%" change="Healthy" color="bg-[#FFF3E0] text-[#F57C00]" />
                <StatsCard label="My Points (30d)" value="271" change="+45" color="bg-[#F0F4F8] text-[#00897B]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Student Progress Overview */}
                    <div className="bg-white p-8 rounded-[32px] border border-[#1c3c33]/5 shadow-[0_10px_30px_rgba(28,60,51,0.03)]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-[#1c3c33] tracking-tight">Student Progress Overview</h3>
                                <p className="text-[10px] font-bold text-[#1c3c33]/40 uppercase tracking-widest mt-1">Recently active students.</p>
                            </div>
                            <Link href="/students" className="text-[10px] font-black text-[#2F6B4F] uppercase tracking-widest hover:underline">Manage All</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#1c3c33]/5 text-[10px] font-black text-[#1c3c33]/30 uppercase tracking-widest">
                                        <th className="pb-4">Student</th>
                                        <th className="pb-4">Date</th>
                                        <th className="pb-4">Lesson Details</th>
                                        <th className="pb-4">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1c3c33]/5">
                                    {[
                                        { name: 'M.Hassan', date: 'Feb 18, 2026', details: 'Sabaq: Al-Baqarah 85-92, Sabqi: No details, Manzil: No details', remarks: 'No remarks.' },
                                        { name: 'Tahoor E Mustafa', date: 'Feb 18, 2026', details: 'Sabaq: Al-Baqarah 253-255, Sabqi: No details, Manzil: No details', remarks: 'No remarks.' },
                                        { name: 'Abdul Momin', date: 'Feb 18, 2026', details: 'Sabaq: No details, Sabqi: No details, Manzil: No details', remarks: 'No remarks.' },
                                        { name: 'M.Uzair Ali', date: 'Feb 18, 2026', details: 'Sabaq: Al-Baqarah 204-208, Sabqi: Al-Baqarah 142-208, Manzil: No details', remarks: 'No remarks.' },
                                        { name: 'M.Ali jameel', date: 'Feb 18, 2026', details: 'Sabaq: An-Nisa 115-126, Sabqi: An-Nisa 25-126, Manzil: No details', remarks: 'No remarks.' }
                                    ].map((s, idx) => (
                                        <tr key={idx} className="group hover:bg-[#FDFBF7] transition-colors">
                                            <td className="py-4 font-bold text-sm text-[#1c3c33]">{s.name}</td>
                                            <td className="py-4 text-xs text-[#1c3c33]/50 font-medium">{s.date}</td>
                                            <td className="py-4">
                                                <p className="text-xs font-bold text-[#1c3c33]/70 truncate max-w-[200px]">{s.details.split(',')[0]}</p>
                                                <p className="text-[10px] font-medium text-[#1c3c33]/50 mt-1 truncate max-w-[200px]">{s.details.split(',').slice(1).join(', ')}</p>
                                            </td>
                                            <td className="py-4 text-[10px] text-[#1c3c33]/50 font-medium">{s.remarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Class Attendance chart */}
                    <div className="bg-white p-8 rounded-[32px] border border-[#1c3c33]/5 shadow-[0_10px_30px_rgba(28,60,51,0.03)]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-[#1c3c33] tracking-tight">Class Attendance</h3>
                                <p className="text-[10px] font-bold text-[#1c3c33]/40 uppercase tracking-widest mt-1">Monthly overview.</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] font-black text-[#1c3c33]/60 uppercase tracking-widest mb-2">
                                    <span>Hifz Halqa Zaid Bin Sabit</span>
                                    <span className="text-[#2F6B4F]">94%</span>
                                </div>
                                <div className="h-3 bg-[#E5F4EC] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#2F6B4F] rounded-full transition-all duration-1000" style={{ width: '94%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Staff Overview */}
                    <div className="bg-white p-8 rounded-[32px] border border-[#1c3c33]/5 shadow-[0_10px_30px_rgba(28,60,51,0.03)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-[#1c3c33] tracking-tight">Staff Overview</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Ghulam Mursleen', role: 'Teacher', students: '8' },
                                { name: 'Naveed Ahmad', role: 'Admin', students: '-' }
                            ].map((staff, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-2xl border border-[#d0d8cf] hover:border-[#2F6B4F]/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#1c3c33] text-white flex items-center justify-center font-bold text-sm">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-[#1c3c33]">{staff.name}</p>
                                            <p className="text-[10px] font-bold text-[#1c3c33]/50 uppercase tracking-widest mt-0.5">{staff.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#1c3c33]">{staff.students}</p>
                                        <p className="text-[8px] font-bold text-[#1c3c33]/40 uppercase tracking-widest">Students</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/staff" className="mt-8 block w-full py-3.5 bg-[#FDFBF7] text-[#1c3c33] border border-[#d0d8cf] rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-[#1c3c33] hover:text-white transition-all shadow-sm">Manage Staff</Link>
                    </div>

                    {/* Progress Circle Mock - Simplified */}
                    <div className="bg-[#1c3c33] p-8 rounded-[32px] text-white shadow-2xl shadow-[#1c3c33]/20 relative overflow-hidden flex flex-col items-center justify-center">
                        <h3 className="text-lg font-black relative z-10 tracking-tight mb-8">Daily Goal Progress</h3>
                        <div className="relative flex justify-center w-full">
                            <div className="w-40 h-40 rounded-full border-8 border-white/10 flex items-center justify-center relative">
                                <span className="text-3xl font-black text-[#F3D083]">0%</span>
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="80" cy="80" r="72" fill="none" stroke="#F3D083" strokeWidth="8" strokeDasharray="452" strokeDashoffset="452" className="transition-all duration-1000 opacity-20"></circle>
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-white/50 mt-8 text-center bg-white/5 py-2 px-4 rounded-full">Target Incomplete</p>
                        {/* Abstract decorative element */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-[#1c3c33]/40 font-bold text-sm">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

function StatsCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-[#1c3c33]/5 shadow-[0_10px_30px_rgba(28,60,51,0.03)] hover:shadow-[0_20px_40px_rgba(28,60,51,0.06)] hover:-translate-y-1 transition-all group">
            <p className="text-[10px] font-black text-[#1c3c33]/40 uppercase tracking-widest mb-4 group-hover:text-[#1c3c33] transition-colors">{label}</p>
            <div className="flex items-end justify-between">
                <h4 className="text-4xl font-black text-[#1c3c33] tracking-tight">{value}</h4>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl ${color}`}>
                    {change}
                </span>
            </div>
        </div>
    );
}
