import Link from 'next/link';
import { db } from '@/db';
import { users, teachers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function StaffProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { orgId } = await getAuth();

    if (!orgId) return notFound();

    // Fetch staff data
    const staffMember = await db
        .select({
            user: users,
            teacher: teachers
        })
        .from(users)
        .leftJoin(teachers, eq(users.id, teachers.userId))
        .where(and(eq(users.id, id), eq(users.organizationId, orgId)))
        .limit(1)
        .then(res => res[0]);

    if (!staffMember) return notFound();

    const { user, teacher } = staffMember;

    const metadata = teacher?.metadata as Record<string, any> | null;

    return (
        <div className="min-h-screen bg-white p-6 md:p-8 mt-16">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 pb-12 border-b-2 border-dashed border-gray-100">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                        <div className="w-40 h-40 bg-brand-50 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-7xl relative overflow-hidden group">
                            {user.role === 'teacher' ? '👨‍🏫' : '👔'}
                        </div>
                        <div className="space-y-2 mb-2">
                            <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${user.status === 'active' ? 'bg-brand-600 text-white shadow-brand-200' : 'bg-gray-400 text-white'}`}>
                                {user.status}
                            </span>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight">{user.firstName} {user.lastName}</h1>
                            <p className="text-gray-400 font-bold flex items-center justify-center md:justify-start gap-4">
                                <span className="uppercase">{user.role.replace('_', ' ')}</span>
                                {teacher?.employeeNumber && <span>🆔 {teacher.employeeNumber}</span>}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <SectionHeader title="Contact Information" icon="📞" />
                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-50 space-y-6">
                            <DetailItem label="Email Address" value={user.email || 'N/A'} />
                            <DetailItem label="Phone Number" value={user.phone || 'N/A'} />
                        </div>
                    </div>

                    {/* Professional Info (if teacher) */}
                    {user.role === 'teacher' && teacher && (
                        <div className="space-y-6">
                            <SectionHeader title="Professional Details" icon="💼" />
                            <div className="bg-brand-50/50 p-8 rounded-3xl border border-brand-50 space-y-6">
                                <DetailItem label="Specialization" value={teacher.specialization || 'N/A'} />
                                <DetailItem label="Joining Date" value={teacher.joinDate ? new Date(teacher.joinDate).toLocaleDateString() : 'N/A'} />
                                <DetailItem label="Gender" value={metadata?.gender || 'N/A'} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
    return (
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-gray-100">{icon}</span>
            {title}
        </h2>
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
