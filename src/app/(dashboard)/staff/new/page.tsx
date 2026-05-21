'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffSchema, StaffFormValues } from '@/lib/validations/staff';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddStaffPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            role: 'teacher',
            gender: 'male'
        }
    });

    const role = watch('role');

    const onSubmit = async (data: StaffFormValues) => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Failed to create staff member');
            }

            // Success
            router.push('/staff');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error creating staff member. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 mt-16">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/staff"
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm hover:bg-brand-50 transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-brand-600 transition-colors">←</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Staff</h1>
                        <p className="text-gray-500 mt-1">Register a new teacher or administrator.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Avatar & Profile Preview */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-brand-50 text-4xl shadow-inner relative group cursor-pointer">
                                👨‍🏫
                            </div>
                            <h3 className="font-bold text-gray-900">Profile Photo</h3>
                            <p className="text-xs text-gray-400 mt-2 px-4 italic line-height-relaxed">Upload feature coming soon.</p>
                        </div>
                    </div>

                    {/* Admission Form */}
                    <div className="md:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Personal Info */}
                            <Section title="Personal Information" icon="👤">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="First Name" error={errors.firstName?.message} {...register('firstName')} placeholder="e.g. Ahmed" />
                                    <FormField label="Last Name" error={errors.lastName?.message} {...register('lastName')} placeholder="e.g. Ali" />
                                    <div className="md:col-span-2">
                                        <FormField label="Email Address" type="email" error={errors.email?.message} {...register('email')} placeholder="staff@rahmah.app" />
                                    </div>
                                    <FormField label="Phone Number" error={errors.phone?.message} {...register('phone')} placeholder="+92 300 1234567" />
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Gender</label>
                                        <div className="flex gap-4">
                                            <label className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-brand-200 transition-all flex items-center gap-3">
                                                <input type="radio" value="male" {...register('gender')} className="accent-brand-600" />
                                                <span className="text-sm font-medium text-gray-700">Male</span>
                                            </label>
                                            <label className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-brand-200 transition-all flex items-center gap-3">
                                                <input type="radio" value="female" {...register('gender')} className="accent-brand-600" />
                                                <span className="text-sm font-medium text-gray-700">Female</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* Job Details */}
                            <Section title="Job Details" icon="💼">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Role</label>
                                        <div className="flex gap-4">
                                            <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${role === 'teacher' ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/10' : 'border-gray-100 bg-gray-50 hover:border-brand-200'}`}>
                                                <input type="radio" value="teacher" {...register('role')} className="accent-brand-600" />
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">Teacher</p>
                                                    <p className="text-xs text-gray-500">Academic staff handling classes.</p>
                                                </div>
                                            </label>
                                            <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${role === 'institute_admin' ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/10' : 'border-gray-100 bg-gray-50 hover:border-brand-200'}`}>
                                                <input type="radio" value="institute_admin" {...register('role')} className="accent-brand-600" />
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">Admin</p>
                                                    <p className="text-xs text-gray-500">Managing institute operations.</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Teacher Specific Fields */}
                                    {role === 'teacher' && (
                                        <>
                                            <FormField label="Specialization" error={errors.specialization?.message} {...register('specialization')} placeholder="e.g. Hifz, Tajweed" />
                                            <FormField label="Employee ID" error={errors.employeeNumber?.message} {...register('employeeNumber')} placeholder="e.g. TEA-001" />
                                            <FormField label="Joining Date" type="date" error={errors.joiningDate?.message} {...register('joiningDate')} />
                                        </>
                                    )}
                                </div>
                            </Section>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                                <Link
                                    href="/staff"
                                    className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Creating...' : 'Create Staff Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl border border-gray-100 shadow-inner">{icon}</span>
                {title}
            </h2>
            <div className="pt-2">{children}</div>
        </div>
    );
}

function FormField({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{label}</label>
            <input
                className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'} focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all placeholder:text-gray-400 text-sm`}
                {...props}
            />
            {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
}
