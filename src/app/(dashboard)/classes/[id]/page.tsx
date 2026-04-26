import Link from 'next/link';
import { db } from '@/db';
import { classes, classEnrollments, students, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import EnrollStudentButton from './EnrollStudentButton';
import RemoveStudentButton from './RemoveStudentButton';

export default async function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { orgId } = await getAuth();

    if (!orgId) return notFound();

    const classData = await db.query.classes.findFirst({
        where: and(eq(classes.id, id), eq(classes.organizationId, orgId)),
        with: {
            teacher: {
                with: { user: true }
            },
            enrollments: {
                with: {
                    student: {
                        with: { user: true }
                    }
                }
            }
        }
    });

    if (!classData) return notFound();

    const teacherName = classData.teacher?.user
        ? `${classData.teacher.user.firstName} ${classData.teacher.user.lastName}`
        : 'Unassigned';

    const schedule = classData.schedule as any[] || [];

    return (
        <div className="min-h-screen bg-white p-6 md:p-8 mt-16">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 pb-12 border-b-2 border-dashed border-gray-100">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                        <div className="w-40 h-40 bg-brand-50 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-7xl relative overflow-hidden">
                            🕌
                        </div>
                        <div className="space-y-2 mb-2">
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight">{classData.name}</h1>
                            <p className="text-gray-400 font-bold flex items-center justify-center md:justify-start gap-4">
                                <span className="flex items-center gap-2">👨‍🏫 {teacherName}</span>
                                <span className="flex items-center gap-2">👥 {classData.enrollments.length} Students</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-2">
                        <EnrollStudentButton classId={classData.id} />
                        <Link href={`/classes/${classData.id}/edit`} className="px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">Edit Class</Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Schedule & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-50 space-y-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Class Schedule</h2>
                            <div className="space-y-3">
                                {schedule.length > 0 ? schedule.map((s: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <span className="text-sm font-bold text-gray-700">{s.day}</span>
                                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">{s.startTime} - {s.endTime}</span>
                                    </div>
                                )) : <p className="text-sm text-gray-400 italic">No schedule defined.</p>}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-brand-50 space-y-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Description</h2>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {classData.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Enrolled Students */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl shadow-inner border border-gray-100">🎓</span>
                            Enrolled Students
                        </h2>

                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-50">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment Date</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {classData.enrollments.length > 0 ? classData.enrollments.map((enrollment) => (
                                        <tr key={enrollment.id} className="hover:bg-brand-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">👤</div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{enrollment.student.user.firstName} {enrollment.student.user.lastName}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{enrollment.student.studentNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium text-gray-600">
                                                {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Link href={`/students/${enrollment.student.id}`} className="text-brand-600 font-bold text-xs hover:underline mr-4">View Profile</Link>
                                                <RemoveStudentButton classId={classData.id} studentId={enrollment.student.id} />
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-16 text-center text-gray-400 italic font-medium">
                                                No students enrolled in this class yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
