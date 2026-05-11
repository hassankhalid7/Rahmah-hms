'use client';

import React from 'react';

export default function FinanceDashboard() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-gray-100">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Finance & Fees</h1>
                        <p className="text-gray-500 font-bold mt-2 italic">Institutional fiscal management and transparent fee tracking.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-white text-gray-900 rounded-[24px] font-black text-[10px] uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all shadow-sm">Fee Structure</button>
                        <button className="px-8 py-4 bg-brand-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/20">Record Payment</button>
                    </div>
                </header>

                {/* Fiscal Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <MetricCard label="Collection Rate" value="84%" sub="Target: 95%" color="brand" icon="💰" />
                    <MetricCard label="Pending Dues" value="$2,450" sub="12 Students" color="rose" icon="⏳" />
                    <MetricCard label="Net Revenue" value="$8,820" sub="Current Month" color="amber" icon="📈" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                            <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Recent Transactions</h2>
                                <button className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">View Journal →</button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                <TransactionRow name="Zaid Al-Harbi" id="INV-001" amount="$150" status="Paid" date="Today" />
                                <TransactionRow name="Yahya Khan" id="INV-002" amount="$150" status="Paid" date="Yesterday" />
                                <TransactionRow name="Omar Farooq" id="INV-003" amount="$200" status="Pending" date="3 days ago" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-gray-900 rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-4">Amanah & Trust</p>
                            <p className="text-xl font-bold leading-relaxed tracking-tight group-hover:scale-[1.02] transition-transform">Transparency in funding ensures the growth of knowledge.</p>
                            <div className="mt-10 pt-10 border-t border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Platform Fee</p>
                                <p className="text-3xl font-black text-brand-500">$120 <span className="text-sm font-bold text-white/20">/mo</span></p>
                            </div>
                            <div className="absolute -bottom-10 -right-10 text-[200px] font-black italic text-white/[0.03] select-none pointer-events-none transition-transform group-hover:scale-110">S</div>
                        </div>

                        <div className="p-8 rounded-[40px] border border-gray-100 bg-white shadow-lg space-y-6">
                            <h3 className="font-black text-gray-900 uppercase tracking-tight">Quick Controls</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <ControlButton icon="📄" label="Generate Invoices" />
                                <ControlButton icon="📧" label="Send Reminders" />
                                <ControlButton icon="📊" label="Download Statements" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: string }) {
    const colors = {
        brand: 'bg-brand-50 text-brand-600 border-brand-100 shadow-brand-900/5',
        rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-900/5',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-900/5',
    } as any;

    return (
        <div className={`p-10 rounded-[50px] border ${colors[color]} shadow-2xl transition-all hover:-translate-y-2 group relative overflow-hidden`}>
            <div className="relative z-10">
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-transform duration-500">{icon}</div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">{label}</p>
                <div className="flex items-baseline gap-4">
                    <h3 className="text-5xl font-black tracking-tighter text-gray-900">{value}</h3>
                    <span className="text-xs font-bold opacity-60">{sub}</span>
                </div>
            </div>
            <div className="absolute -bottom-6 -right-6 text-[120px] font-black italic opacity-5 pointer-events-none select-none group-hover:scale-110 transition-transform italic text-gray-900">S</div>
        </div>
    );
}

function TransactionRow({ name, id, amount, status, date }: { name: string; id: string; amount: string; status: string; date: string }) {
    return (
        <div className="p-10 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-gray-100 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">💳</div>
                <div>
                    <h3 className="font-black text-gray-900 tracking-tight group-hover:text-brand-700 transition-colors uppercase">{name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{id} • {date}</p>
                </div>
            </div>
            <div className="flex items-center gap-12 text-right">
                <div>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">{amount}</p>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'Paid' ? 'text-brand-500' : 'text-amber-500'}`}>{status}</span>
                </div>
                <button className="px-6 py-3 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100">Print</button>
            </div>
        </div>
    );
}

function ControlButton({ icon, label }: { icon: string; label: string }) {
    return (
        <button className="w-full p-4 bg-gray-50 rounded-2xl text-left flex items-center gap-4 hover:bg-brand-50 hover:text-brand-700 transition-all group">
            <span className="text-lg group-hover:rotate-12 transition-transform">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    );
}
