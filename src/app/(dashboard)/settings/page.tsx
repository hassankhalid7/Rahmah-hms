'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('Institute Profile');

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings successfully updated.');
        }, 1500);
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = '/sign-in';
        }
    };

    const TABS = [
        'Institute Profile',
        'Academic Calendar',
        'Data Management',
        'Language Settings'
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2F6B4F]/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">⚙️</span>
                            <h1 className="text-3xl lg:text-4xl font-black text-[#1c3c33] tracking-tight">Settings</h1>
                        </div>
                        <p className="text-[#1c3c33]/60 font-bold text-sm">Manage your institute's profile, academic calendar, and data.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-[#FFEBEE] text-[#D32F2F] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#FFCDD2] transition-colors border border-[#D32F2F]/20 shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-3 space-y-2">
                        {TABS.map(tab => (
                            <TabButton
                                key={tab}
                                label={tab}
                                active={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                            />
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-9">
                        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)] min-h-[500px]">

                            {activeTab === 'Institute Profile' && (
                                <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight mb-2">Institute Profile</h2>
                                        <p className="text-[#1c3c33]/50 font-bold text-sm">Update your institute's public information. This will appear on all reports.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField
                                            label="Institute Name (English)"
                                            defaultValue="Faizan e Ashab e Sufa"
                                        />
                                        <FormField
                                            label="Institute Name (Urdu)"
                                            defaultValue="فیضان اصحاب صفہ"
                                            className="text-right font-['Jameel_Noori_Nastaleeq',_Arial]"
                                            dir="rtl"
                                        />
                                        <FormField
                                            label="Contact Email"
                                            defaultValue="naveeed1978@gmail.com"
                                            type="email"
                                        />
                                        <FormField
                                            label="Mobile Number"
                                            defaultValue="03335237422"
                                            type="tel"
                                        />
                                        <div className="md:col-span-2">
                                            <FormField
                                                label="Address"
                                                defaultValue="Ward No 14,sundal road Gujar Khan Dist Rawalpindi"
                                            />
                                        </div>
                                    </div>

                                    {/* Logo Section */}
                                    <div className="pt-6 border-t border-[#1c3c33]/5 space-y-6">
                                        <h3 className="text-sm font-black text-[#1c3c33] uppercase tracking-widest mb-6 block">Institute Logo</h3>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                                            {/* Current Logo Preview */}
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-bold text-[#1c3c33]/40 uppercase tracking-widest">Current Logo</p>
                                                <div className="w-32 h-32 rounded-3xl bg-[#FDFBF7] border border-[#d0d8cf] flex items-center justify-center overflow-hidden shadow-inner p-2">
                                                    <img src="/rahmah-logo.jpg" alt="Current Logo" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                                </div>
                                            </div>

                                            {/* Upload Area */}
                                            <div className="flex-1 space-y-3 w-full">
                                                <p className="text-[10px] font-bold text-[#1c3c33]/40 uppercase tracking-widest">Upload New Logo</p>
                                                <div className="w-full border-2 border-dashed border-[#d0d8cf] bg-[#FDFBF7] rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-[#2F6B4F]/50 transition-colors cursor-pointer group">
                                                    <span className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100">🖼️</span>
                                                    <p className="text-sm font-black text-[#1c3c33] group-hover:text-[#2F6B4F]">Click to upload or drag and drop</p>
                                                    <p className="text-[10px] font-bold text-[#1c3c33]/40 uppercase tracking-widest mt-2">Max file size: 1MB. Allowed types: PNG, JPG, WEBP.</p>
                                                    <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.webp" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-8 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="px-10 py-5 bg-[#2F6B4F] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#285c44] transition-all shadow-xl shadow-[#2F6B4F]/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none min-w-[200px]"
                                        >
                                            {isSaving ? (
                                                <span className="flex items-center justify-center gap-3">
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    Saving...
                                                </span>
                                            ) : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Academic Calendar' && (
                                <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight mb-2">Academic Calendar</h2>
                                            <p className="text-[#1c3c33]/50 font-bold text-sm">Manage important dates, holidays, and events for the institute.</p>
                                        </div>
                                        <button className="px-6 py-3 bg-[#2F6B4F] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#285c44] transition-all shadow-xl shadow-[#2F6B4F]/20 whitespace-nowrap">
                                            + Add Event
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Calendar Grid */}
                                        <div className="lg:col-span-2 bg-[#FDFBF7] border border-[#d0d8cf] rounded-[32px] p-6 shadow-inner">
                                            <div className="flex items-center justify-between mb-6 px-2">
                                                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-[#1c3c33]/50 font-bold">&larr;</button>
                                                <h3 className="text-lg font-black text-[#1c3c33] uppercase tracking-widest">February 2026</h3>
                                                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-[#1c3c33]/50 font-bold">&rarr;</button>
                                            </div>

                                            <div className="grid grid-cols-7 gap-2 mb-4">
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                    <div key={day} className="text-center text-[10px] font-black text-[#1c3c33]/40 uppercase tracking-widest py-2">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-7 gap-2">
                                                {Array.from({ length: 28 }).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        className="aspect-square flex items-center justify-center rounded-2xl text-sm font-black text-[#1c3c33] hover:bg-white hover:shadow-sm hover:text-[#2F6B4F] transition-all border border-transparent hover:border-[#d0d8cf] active:scale-95"
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Events List */}
                                        <div className="lg:col-span-1 border border-[#1c3c33]/5 rounded-[32px] p-8 h-full flex flex-col">
                                            <h3 className="text-sm font-black text-[#1c3c33] uppercase tracking-widest mb-6 pb-4 border-b border-[#1c3c33]/5">Events for February 2026</h3>

                                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 space-y-4 py-8">
                                                <span className="text-4xl grayscale">📅</span>
                                                <p className="text-[#1c3c33] font-bold text-sm">No events scheduled</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'Data Management' || activeTab === 'Language Settings') && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4 pt-20">
                                    <span className="text-5xl">🚧</span>
                                    <h3 className="text-xl font-black text-[#1c3c33] tracking-tight">{activeTab}</h3>
                                    <p className="text-[#1c3c33]/60 font-medium text-sm">This module is currently under development.</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TabButton({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full p-5 text-left rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${active
                ? 'bg-[#E5F4EC] text-[#2F6B4F] border border-[#2F6B4F]/20 shadow-sm pl-6'
                : 'bg-transparent text-[#1c3c33]/50 border border-transparent hover:bg-[#FDFBF7] hover:text-[#1c3c33] hover:border-[#d0d8cf]'
                }`}
        >
            {label}
        </button>
    );
}

function FormField({ label, className = "", dir, ...props }: { label: string, className?: string, dir?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-[#1c3c33]/70 uppercase tracking-widest block ml-1">{label}</label>
            <input
                className={`w-full px-6 py-4 rounded-2xl border border-[#d0d8cf] bg-[#FDFBF7] focus:bg-white focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 outline-none transition-all text-sm font-bold text-[#1c3c33] placeholder:text-[#1c3c33]/20 ${className}`}
                dir={dir}
                {...props}
            />
        </div>
    );
}
