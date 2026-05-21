import React from 'react';
import StudentDashboard from './StudentDashboard';

export default function ParentDashboard({ user }: { user: any }) {
    // In a real app, we'd fetch children data here
    const children = [
        { name: 'Abdullah', role: 'student', id: '1' },
        { name: 'Khadija', role: 'student', id: '2' },
    ];

    return (
        <div className="w-full text-[#1c3c33] animate-in fade-in duration-500">
            <div className="space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-4 border-b border-[#2F6B4F]/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1c3c33]">Parent Portal</h1>
                        <p className="text-sm font-bold text-[#2F6B4F]">Faizan e Ashab e Sufa</p>
                        <p className="text-sm text-[#1c3c33]/65">Monitor your children's academic progress and performance.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-white text-[#1c3c33] border border-[#d0d8cf] rounded-xl text-xs font-bold hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors shadow-sm">Messages</button>
                        <button className="px-4 py-2.5 bg-[#2F6B4F] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-colors">Fee Payment</button>
                    </div>
                </header>

                {/* Children Overview */}
                <div className="space-y-6">
                    {children.map((child, i) => (
                        <div key={child.id} className="relative">
                            <div className="absolute -top-3 left-6 px-4 py-1.5 bg-[#2F6B4F] text-white rounded-lg text-xs font-bold z-10 shadow-lg">
                                {child.name}'s Progress
                            </div>
                            <div className="border border-[#1c3c33]/5 rounded-2xl overflow-hidden shadow-sm bg-white pt-6">
                                <StudentDashboard user={{ firstName: child.name, publicMetadata: { role: 'student' } }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
