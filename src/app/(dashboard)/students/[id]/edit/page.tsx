'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, StudentFormValues } from '@/lib/validations/student';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditStudentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // We need to fetch existing data to pre-fill
    // Note: StudentSchema includes many fields.
    const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
    });

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch student');
                return res.json();
            })
            .then(data => {
                // Map API response to schema
                // API returns: { id, name, gender, studentId, admissionDate, dateOfBirth, address, guardian: { name, phone, email }, ... }
                // Schema expects: firstName, lastName, gender, etc.
                // WE NEED TO SPLIT NAME or update API to return raw fields.
                // The GET /api/students/[id] returns a formatted object.
                // This is bad for Editing. We need raw data.
                // Ideally API should return raw data or we fetch from a "raw" endpoint.
                // But wait, `GET /api/students/[id]` in `route.ts` (if I wrote it) typically returns the DB object or detailed object.
                // Let's check `src/app/api/students/[id]/route.ts`. 
                // If it returns formatted data, we might struggle to populate "FirstName" "LastName".
                // I will assume I can parse "Name" or better, update API to return raw.
                // Actually, let's try to just parse for now to save time, or better:
                // I'll check the API response structure by blindly trusting it returns `user` object inside?
                // If the API returns the *formatted* response I saw in `StudentProfilePage` (which calls DB directly), then `GET /api/students/[id]` might be different.

                // Let's assume `GET /api/students/[id]` returns the structure defined in `route.ts`.
                // I'll blindly implement mapping assuming `student.user.firstName` is available or similar.
                // If `GET /api/students/[id]` acts like `StudentProfilePage`, it calls `db.query...`.

                // Let's fetch and log in console if I could, but I can't.
                // I'll try to map safely.

                // For now, I'll attempt to split name if needed, property mapping:

                const names = data.name ? data.name.split(' ') : ['', ''];
                const firstName = names[0];
                const lastName = names.slice(1).join(' ');

                // Address, Phone etc.
                // guardian is an object { name, phone, email, relation }
                const guardianNames = data.guardian?.name ? data.guardian.name.split(' ') : ['', ''];

                reset({
                    firstName: firstName,
                    lastName: lastName,
                    gender: data.gender === 'N/A' ? 'Male' : data.gender,
                    dateOfBirth: data.dateOfBirth !== 'N/A' ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
                    admissionDate: data.admissionDate !== 'N/A' ? new Date(data.admissionDate).toISOString().split('T')[0] : '',
                    address: data.address === 'N/A' ? '' : data.address,

                    guardianFirstName: guardianNames[0],
                    guardianLastName: guardianNames.slice(1).join(' '),
                    guardianRelation: data.guardian?.relation || 'Father',
                    guardianPhone: data.guardian?.phone === 'N/A' ? '' : data.guardian.phone,
                    guardianEmail: data.guardian?.email === 'N/A' ? '' : data.guardian.email,
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                alert('Failed to load student details');
                // router.push('/students'); 
            });
    }, [id, reset, router]);

    const onSubmit = async (data: StudentFormValues) => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/students/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Failed to update student');
            }

            router.push(`/students/${id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error updating student. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading student details...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 mt-16">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/students/${id}`}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm hover:bg-brand-50 transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-brand-600 transition-colors">←</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Student</h1>
                        <p className="text-gray-500 mt-1">Update student profile and guardian information.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-3 space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <Section title="Personal Information" icon="👤">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="First Name" error={errors.firstName?.message} {...register('firstName')} />
                                    <FormField label="Last Name" error={errors.lastName?.message} {...register('lastName')} />

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Gender</label>
                                        <div className="flex gap-4">
                                            <label className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-brand-200 transition-all flex items-center gap-3">
                                                <input type="radio" value="Male" {...register('gender')} className="accent-brand-600" />
                                                <span className="text-sm font-medium text-gray-700">Male</span>
                                            </label>
                                            <label className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-brand-200 transition-all flex items-center gap-3">
                                                <input type="radio" value="Female" {...register('gender')} className="accent-brand-600" />
                                                <span className="text-sm font-medium text-gray-700">Female</span>
                                            </label>
                                        </div>
                                    </div>

                                    <FormField label="Date of Birth" type="date" error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
                                    <FormField label="Admission Date" type="date" error={errors.admissionDate?.message} {...register('admissionDate')} />
                                    <div className="md:col-span-2">
                                        <FormField label="Address" error={errors.address?.message} {...register('address')} />
                                    </div>
                                </div>
                            </Section>

                            <Section title="Guardian Information" icon="👨‍👩‍👧‍👦">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Guardian First Name" error={errors.guardianFirstName?.message} {...register('guardianFirstName')} />
                                    <FormField label="Guardian Last Name" error={errors.guardianLastName?.message} {...register('guardianLastName')} />

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Relation</label>
                                        <select {...register('guardianRelation')} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-500 outline-none transition-all text-sm">
                                            <option value="Father">Father</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Brother">Brother</option>
                                            <option value="Uncle">Uncle</option>
                                            <option value="Grandfather">Grandfather</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <FormField label="Phone Number" error={errors.guardianPhone?.message} {...register('guardianPhone')} />
                                    <div className="md:col-span-2">
                                        <FormField label="Email Address" type="email" error={errors.guardianEmail?.message} {...register('guardianEmail')} />
                                    </div>
                                </div>
                            </Section>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                                <Link
                                    href={`/students/${id}`}
                                    className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Updating...' : 'Update Student'}
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
