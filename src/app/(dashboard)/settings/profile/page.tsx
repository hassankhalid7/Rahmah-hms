'use client';

import React, { useState } from 'react';

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Administrator',
        email: 'naveeed1978@gmail.com',
        phone: '03335237422',
        role: 'Super Admin',
        bio: 'Managing the central operations for Rahmah HMS.'
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Profile successfully updated.');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 animate-in fade-in duration-700">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2F6B4F]/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">👤</span>
                            <h1 className="text-3xl lg:text-4xl font-black text-[#1c3c33] tracking-tight">My Profile</h1>
                        </div>
                        <p className="text-[#1c3c33]/60 font-bold text-sm">Manage your personal account settings and preferences.</p>
                    </div>
                </header>

                {/* Profile Content Area */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)]">
                    
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-[#1c3c33]/5">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-[#E5F4EC] border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-[#2F6B4F] overflow-hidden">
                                {profile.name.charAt(0)}
                            </div>
                            <div className="absolute inset-0 bg-[#1c3c33]/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="text-white text-2xl mb-1">📷</span>
                                <span className="text-white text-[10px] uppercase font-bold tracking-widest">Update</span>
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight">{profile.name}</h2>
                            <p className="text-[#2F6B4F] font-bold text-sm bg-[#E5F4EC] inline-block px-3 py-1 rounded-full mt-2">{profile.role}</p>
                            <p className="text-[#1c3c33]/50 text-xs mt-3 max-w-sm">{profile.bio}</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            label="Full Name"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                        <FormField
                            label="Email Address"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                        <FormField
                            label="Phone Number"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                        <FormField
                            label="System Role"
                            value={profile.role}
                            disabled
                            className="bg-gray-50 text-[#1c3c33]/50 cursor-not-allowed"
                        />
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-[#1c3c33]/70 uppercase tracking-widest block ml-1">Short Bio</label>
                            <textarea
                                rows={4}
                                value={profile.bio}
                                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                className="w-full px-6 py-4 rounded-2xl border border-[#d0d8cf] bg-[#FDFBF7] focus:bg-white focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 outline-none transition-all text-sm font-bold text-[#1c3c33] placeholder:text-[#1c3c33]/20 resize-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-10 mt-10 border-t border-[#1c3c33]/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <button className="text-sm font-bold text-[#D32F2F] hover:text-[#B71C1C] transition-colors underline underline-offset-4 decoration-[#D32F2F]/30 hover:decoration-[#D32F2F]">
                            Change Password
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-10 py-5 bg-[#2F6B4F] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#285c44] transition-all shadow-xl shadow-[#2F6B4F]/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none min-w-[200px]"
                        >
                            {isSaving ? (
                                <span className="flex items-center justify-center gap-3">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                </span>
                            ) : 'Save Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, className = "", ...props }: { label: string, className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-[#1c3c33]/70 uppercase tracking-widest block ml-1">{label}</label>
            <input
                className={`w-full px-6 py-4 rounded-2xl border border-[#d0d8cf] bg-[#FDFBF7] focus:bg-white focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 outline-none transition-all text-sm font-bold text-[#1c3c33] placeholder:text-[#1c3c33]/20 ${className}`}
                {...props}
            />
        </div>
    );
}
