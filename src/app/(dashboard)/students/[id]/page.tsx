import Link from 'next/link';
import { db } from '@/db';
import { students, users, classEnrollments, classes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';
import { notFound } from 'next/navigation';

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { orgId } = await getAuth();

    if (!orgId) return notFound();

    let studentData;

    if (isDemoMode) {
        // Mock data for demo mode
        studentData = {
            id: id,
            studentNumber: 'STU-' + id.padStart(3, '0'),
            admissionDate: '2025-01-15',
            dateOfBirth: '2010-05-20',
            organizationId: 'demo_org_123',
            metadata: { gender: 'Male', address: '123 Muslim Street, Lahore' },
            user: {
                firstName: id === '1' ? 'Amir' : id === '2' ? 'Sara' : 'Umar',
                lastName: id === '1' ? 'Ali' : id === '2' ? 'Ahmed' : 'Farooq',
                status: 'active',
            },
            guardian: {
                firstName: 'Test',
                lastName: 'Guardian',
                phone: '1234567890',
                email: 'guardian@test.com',
            }
        };
    } else {
        // Fetch student data directly from DB
        studentData = await db.query.students.findFirst({
            where: and(
                eq(students.id, id),
                eq(students.organizationId, orgId)
            ),
            with: {
                user: true,
                guardian: true,
            }
        });
    }

    if (!studentData) return notFound();

    const metadata = studentData.metadata as Record<string, any> | null;

    const student = {
        id: studentData.id,
        name: `${studentData.user.firstName} ${studentData.user.lastName}`,
        gender: metadata?.gender || 'N/A',
        studentId: studentData.studentNumber,
        class: 'Not Assigned', // We need to fetch this from enrollments if we had it
        admissionDate: studentData.admissionDate ? new Date(studentData.admissionDate).toLocaleDateString() : 'N/A',
        dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString() : 'N/A',
        address: metadata?.address || 'N/A',
        guardian: {
            name: studentData.guardian ? `${studentData.guardian.firstName} ${studentData.guardian.lastName}` : 'N/A',
            relation: 'Guardian', // We didn't store relation in User table, maybe in metadata? Or we just assumed it. I'll use "Guardian" for now.
            phone: studentData.guardian?.phone || 'N/A',
            email: studentData.guardian?.email || 'N/A'
        },
        performance: {
            attendance: '--', // To be implemented
            mistakesAvg: '--',
            lastExamRating: '--'
        }
    };

    return (
        <div className="min-h-screen bg-white p-6 md:p-8 mt-16">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 pb-12 border-b-2 border-dashed border-gray-100">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                        <div className="w-40 h-40 bg-brand-50 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-7xl relative overflow-hidden group">
                            👤
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Update</span>
                            </div>
                        </div>
                        <div className="space-y-2 mb-2">
                            <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${studentData.user.status === 'active' ? 'bg-brand-600 text-white shadow-brand-200' : 'bg-gray-400 text-white'}`}>
                                {studentData.user.status}
                            </span>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight">{student.name}</h1>
                            <p className="text-gray-400 font-bold flex items-center justify-center md:justify-start gap-4">
                                <span>🆔 {student.studentId}</span>
                                <span>🏫 {student.class}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-2">
                        <Link href={`/students/${student.id}/edit`} className="px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">Edit Profile</Link>
                        <button className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all active:scale-95">Issue Report</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Summary Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-50 space-y-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Student Summary</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <StatBox label="Attendance" value={student.performance.attendance} color="text-brand-600" />
                                <StatBox label="Errors Avg" value={student.performance.mistakesAvg} color="text-rose-600" />
                                <StatBox label="Exams" value={student.performance.lastExamRating} color="text-amber-600" />
                                <StatBox label="DOB" value={student.dateOfBirth} color="text-amber-600" />
                            </div>
                        </div>

                        {/* Guardian Detail */}
                        <div className="bg-white p-8 rounded-3xl border-2 border-brand-50 space-y-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                                Guardian Info
                                <span className="text-brand-300">👨‍👩‍👧‍👦</span>
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Name</p>
                                    <p className="font-bold text-gray-900">{student.guardian.name} <span className="text-gray-400 font-normal text-xs">({student.guardian.relation})</span></p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                                    <p className="font-black text-brand-600">{student.guardian.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
                                    <p className="font-medium text-gray-600 text-sm">{student.guardian.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Profile Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl shadow-inner border border-gray-100">📋</span>
                                Full Details
                            </h2>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-8 p-8 bg-gray-50/30 rounded-3xl border border-gray-50">
                                <DetailItem label="Full Legal Name" value={student.name} />
                                <DetailItem label="Gender Identity" value={student.gender} />
                                <DetailItem label="Birthday" value={student.dateOfBirth} />
                                <DetailItem label="Admission Date" value={student.admissionDate} />
                                <div className="col-span-2">
                                    <DetailItem label="Residential Physical Address" value={student.address} />
                                </div>
                            </div>
                        </div>

                        {/* Learning Progress Preview */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl shadow-inner border border-gray-100">📖</span>
                                    Recent Progress
                                </h2>
                                <Link href={`/students/${student.id}/progress`} className="text-brand-600 font-bold text-sm hover:underline">Full History →</Link>
                            </div>
                            <div className="bg-brand-600 p-8 rounded-3xl shadow-xl shadow-brand-900/10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                                <div className="space-y-2 relative z-10">
                                    <p className="text-brand-100 font-bold uppercase tracking-widest text-[10px]">Latest Entry</p>
                                    <h3 className="text-3xl font-black">No Data</h3>
                                    <p className="text-brand-100/80 text-sm italic">"Student has no progress records yet."</p>
                                </div>
                                <Link
                                    href="/progress/new"
                                    className="px-8 py-3 bg-white text-brand-600 rounded-2xl font-black text-sm hover:bg-brand-50 transition-all shadow-lg active:scale-95 relative z-10"
                                >
                                    Add Entry
                                </Link>
                                <div className="absolute top-0 right-0 p-8 text-9xl text-white/5 font-black pointer-events-none select-none italic">N/A</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-xl font-black ${color}`}>{value}</p>
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-gray-900 font-bold text-lg">{value}</p>
        </div>
    );
}
