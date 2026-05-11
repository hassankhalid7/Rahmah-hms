'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import ParentDashboard from '@/components/dashboard/ParentDashboard';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';

function DashboardContent() {
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');

    const role = roleParam === 'admin' || roleParam === 'teacher' || roleParam === 'student' || roleParam === 'parent' || roleParam === 'super_admin'
        ? roleParam
        : 'admin';

    const user = {
        firstName: role === 'admin' ? 'Admin' : role === 'teacher' ? 'Teacher' : role === 'student' ? 'Student' : role === 'parent' ? 'Parent' : 'Super',
        lastName: 'User',
        publicMetadata: { role },
    };

    if (role === 'teacher') return <TeacherDashboard user={user} />;
    if (role === 'student') return <StudentDashboard user={user} />;
    if (role === 'parent') return <ParentDashboard user={user} />;
    if (role === 'super_admin') return <SuperAdminDashboard user={user} />;
    return <AdminDashboard user={user} />;
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-[#1c3c33]/40 font-bold text-sm">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
