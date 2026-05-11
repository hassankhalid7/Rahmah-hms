'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import JoinRequestsWidget from './JoinRequestsWidget';

type DashboardStats = {
    totalStudents: number;
    totalStaff: number;
    overallAttendance: number;
    classesRunning: number;
    monthlyGrowth: number;
};

type RecentProgress = {
    studentName: string;
    teacherName: string;
    learningType: 'qaida' | 'nazra' | 'hifz';
    date: string;
    attendanceStatus: 'present' | 'absent' | 'late' | 'excused';
    teacherRemarks: string | null;
};

type StaffOverview = {
    name: string;
    role: string;
    specialization: string | null;
    studentCount: number;
};

type DashboardData = {
    stats: DashboardStats;
    recentProgress: RecentProgress[];
    staffOverview: StaffOverview[];
    message?: string | null;
};

export default function AdminDashboard({ user }: { user: any }) {
    const { t, lang } = useLanguage();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/dashboard/stats');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error('Dashboard data fetch error:', err);
                setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const isUrdu = lang === 'ur';

    // Loading state
    if (loading) {
        return (
            <div className="w-full text-[#1c3c33] animate-in fade-in duration-500" dir={isUrdu ? 'rtl' : 'ltr'}>
                <div className="space-y-5">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F6B4F] mx-auto mb-4"></div>
                            <p className="text-[#1c3c33]/60">{t('Loading dashboard...', 'ڈیش بورڈ لوڈ ہو رہا ہے...')}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full text-[#1c3c33] animate-in fade-in duration-500" dir={isUrdu ? 'rtl' : 'ltr'}>
                <div className="space-y-5">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="text-red-500 text-4xl mb-4">⚠️</div>
                            <h3 className="text-lg font-bold text-[#1c3c33] mb-2">
                                {t('Error Loading Dashboard', 'ڈیش بورڈ لوڈ کرنے میں خرابی')}
                            </h3>
                            <p className="text-[#1c3c33]/60 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="px-4 py-2 bg-[#2F6B4F] text-white rounded-lg hover:bg-[#285c44] transition-colors"
                            >
                                {t('Retry', 'دوبارہ کوشش کریں')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No data available
    if (!data) {
        return (
            <div className="w-full text-[#1c3c33] animate-in fade-in duration-500" dir={isUrdu ? 'rtl' : 'ltr'}>
                <div className="space-y-5">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="text-[#2F6B4F] text-4xl mb-4">📊</div>
                            <h3 className="text-lg font-bold text-[#1c3c33] mb-2">
                                {t('No Data Available', 'کوئی ڈیٹا دستیاب نہیں')}
                            </h3>
                            <p className="text-[#1c3c33]/60">
                                {t('Start by adding students and staff to see real statistics.', 'حقیقی اعداد و شمار دیکھنے کے لیے طلبہ اور عملہ شامل کریں۔')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { stats, recentProgress, staffOverview, message } = data;

    return (
        <div
            className="w-full text-[#1c3c33] animate-in fade-in duration-500"
            dir={isUrdu ? 'rtl' : 'ltr'}
        >
            <div className="space-y-5">
                {/* Header Section */}
                <header className="flex flex-col gap-3 border-b border-[#2F6B4F]/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1c3c33]">
                            {t('Admin Dashboard', 'ایڈمن ڈیش بورڈ')}
                        </h1>
                        <p className="mt-1 text-sm font-bold text-[#2F6B4F]">
                            {t('Faizan e Ashab e Sufa', 'فیضان اصحاب صفہ')}
                        </p>
                        <p className="mt-1 text-sm text-[#1c3c33]/65">
                            {t(
                                `Welcome back, ${user?.firstName || 'Admin'}. Here is your institute overview.`,
                                `خوش آمدید، ${user?.firstName || 'ایڈمن'}۔ یہ آپ کے ادارے کا جائزہ ہے۔`
                            )}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/reports?role=admin" className="rounded-xl border border-[#d0d8cf] bg-white px-4 py-2.5 text-xs font-bold text-[#1c3c33] shadow-sm hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors">
                            {t('View Reports', 'رپورٹس دیکھیں')}
                        </Link>
                        <Link href="/students/new?role=admin" className="rounded-xl bg-[#2F6B4F] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-colors">
                            {t('Add Student', 'طالب علم شامل کریں')}
                        </Link>
                    </div>
                </header>

                {/* Message for empty state */}
                {message && (
                    <div className="rounded-xl border border-[#F57C00]/20 bg-[#FFF3E0] p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">ℹ️</span>
                            <p className="text-sm font-medium text-[#F57C00]">{message}</p>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard 
                        title={t('Total Students', 'کل طلبہ')} 
                        value={stats.totalStudents.toString()} 
                        sub={stats.monthlyGrowth > 0 ? t(`+${stats.monthlyGrowth} this month`, `اس ماہ +${stats.monthlyGrowth}`) : t('No growth', 'کوئی اضافہ نہیں')} 
                        icon="👥" 
                        tone="bg-[#E5F4EC] text-[#2F6B4F]" 
                    />
                    <SummaryCard 
                        title={t('Active Staff', 'فعال عملہ')} 
                        value={stats.totalStaff.toString()} 
                        sub={stats.totalStaff > 0 ? t('All verified', 'سب تصدیق شدہ') : t('No staff', 'کوئی عملہ نہیں')} 
                        icon="👨‍🏫" 
                        tone="bg-[#FFF3E0] text-[#F57C00]" 
                    />
                    <SummaryCard 
                        title={t('Overall Attendance', 'مجموعی حاضری')} 
                        value={`${stats.overallAttendance}%`} 
                        sub={stats.overallAttendance >= 90 ? t('Excellent', 'بہترین') : stats.overallAttendance >= 75 ? t('Good', 'اچھا') : t('Needs improvement', 'بہتری ضروری')} 
                        icon="📊" 
                        tone="bg-[#F0F4F8] text-[#00897B]" 
                    />
                    <SummaryCard 
                        title={t('Classes Running', 'جاری کلاسیں')} 
                        value={stats.classesRunning.toString()} 
                        sub={t('Total', 'کل')} 
                        icon="🏫" 
                        tone="bg-[#F3E5F5] text-[#8E24AA]" 
                    />
                </section>

                {/* Main Content Grid */}
                <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
                    {/* Recent Progress Overview */}
                    <div className="lg:col-span-2 rounded-2xl border border-[#1c3c33]/5 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-[#1c3c33]">
                                    {t('Recent Progress', 'حالیہ پیشرفت')}
                                </h2>
                                <p className="mt-1 text-xs font-medium text-[#1c3c33]/60">
                                    {t('Latest student activities', 'طلبہ کی حالیہ سرگرمیاں')}
                                </p>
                            </div>
                            <Link href="/progress?role=admin" className="text-xs font-bold text-[#2F6B4F] hover:underline">
                                {t('View All', 'سب دیکھیں')}
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentProgress.length > 0 ? (
                                recentProgress.slice(0, 4).map((progress, index) => (
                                    <div key={index} className="rounded-xl border border-[#d0d8cf]/50 bg-[#FDFBF7] p-4">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-[#1c3c33]">{progress.studentName}</p>
                                                <p className="text-xs font-medium text-[#1c3c33]/60">
                                                    {t('Teacher', 'استاد')}: {progress.teacherName}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                                    progress.attendanceStatus === 'present' ? 'bg-green-100 text-green-800' :
                                                    progress.attendanceStatus === 'absent' ? 'bg-red-100 text-red-800' :
                                                    progress.attendanceStatus === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {progress.attendanceStatus === 'present' ? t('Present', 'حاضر') :
                                                     progress.attendanceStatus === 'absent' ? t('Absent', 'غائب') :
                                                     progress.attendanceStatus === 'late' ? t('Late', 'دیر') :
                                                     t('Excused', 'معذور')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-[#2F6B4F] capitalize">
                                                {progress.learningType} - {new Date(progress.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {progress.teacherRemarks && (
                                            <p className="mt-2 text-xs text-[#1c3c33]/70">{progress.teacherRemarks}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">📚</div>
                                    <p className="text-sm text-[#1c3c33]/60">
                                        {t('No recent progress entries found', 'کوئی حالیہ پیشرفت کی انٹری نہیں ملی')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Join Requests Widget */}
                    <JoinRequestsWidget />
                </section>

                {/* Second Row - Staff Overview */}
                <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
                    {/* Staff Overview */}
                    <div className="lg:col-span-1 rounded-2xl border border-[#1c3c33]/5 bg-white p-5 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-xl font-black tracking-tight text-[#1c3c33]">
                                {t('Staff Overview', 'عملے کا جائزہ')}
                            </h2>
                            <p className="mt-1 text-xs font-medium text-[#1c3c33]/60">
                                {t('Team members', 'ٹیم ممبرز')}
                            </p>
                        </div>
                        <div className="space-y-3">
                            {staffOverview.length > 0 ? (
                                staffOverview.map((staff, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-xl border border-[#d0d8cf]/50 bg-[#FDFBF7] p-4">
                                        <div>
                                            <p className="text-sm font-bold text-[#1c3c33]">{staff.name}</p>
                                            <p className="text-xs font-medium text-[#1c3c33]/60">
                                                {staff.role === 'teacher' ? t('Teacher', 'استاد') : 
                                                 staff.role === 'institute_admin' ? t('Admin', 'منتظم') : 
                                                 staff.role}
                                                {staff.specialization && ` - ${staff.specialization}`}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-[#2F6B4F]">
                                            {staff.studentCount > 0 ? staff.studentCount : '-'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">👨‍🏫</div>
                                    <p className="text-sm text-[#1c3c33]/60">
                                        {t('No staff members found', 'کوئی عملہ نہیں ملا')}
                                    </p>
                                </div>
                            )}
                        </div>
                        <Link href="/staff?role=admin" className="mt-4 block w-full rounded-xl border border-[#d0d8cf] bg-[#FDFBF7] px-4 py-3 text-center text-xs font-bold text-[#1c3c33] hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-colors">
                            {t('Manage Staff', 'عملہ منظم کریں')}
                        </Link>
                    </div>

                    {/* Placeholder for future widgets */}
                    <div className="lg:col-span-2"></div>
                </section>

                {/* Detailed Progress Table */}
                {recentProgress.length > 0 && (
                    <section className="rounded-2xl border border-[#1c3c33]/5 bg-white p-5 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-xl font-black tracking-tight text-[#1c3c33]">
                                {t('Detailed Progress Report', 'تفصیلی پیشرفت رپورٹ')}
                            </h2>
                            <p className="mt-1 text-xs font-medium text-[#1c3c33]/60">
                                {t('Complete performance overview', 'مکمل کارکردگی کا جائزہ')}
                            </p>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left">
                                <thead>
                                    <tr className="border-b border-[#1c3c33]/10">
                                        <th className="pb-3 text-xs font-bold text-[#1c3c33]/70">{t('Student', 'طالب علم')}</th>
                                        <th className="pb-3 text-xs font-bold text-[#1c3c33]/70">{t('Teacher', 'استاد')}</th>
                                        <th className="pb-3 text-xs font-bold text-[#1c3c33]/70">{t('Type', 'قسم')}</th>
                                        <th className="pb-3 text-xs font-bold text-[#1c3c33]/70">{t('Status', 'حالت')}</th>
                                        <th className="pb-3 text-xs font-bold text-[#1c3c33]/70">{t('Date', 'تاریخ')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1c3c33]/5">
                                    {recentProgress.map((progress, index) => (
                                        <tr key={index} className="hover:bg-[#FDFBF7] transition-colors">
                                            <td className="py-3 text-sm font-bold text-[#1c3c33]">{progress.studentName}</td>
                                            <td className="py-3 text-xs font-medium text-[#1c3c33]/70">{progress.teacherName}</td>
                                            <td className="py-3 text-xs font-medium text-[#1c3c33]/70 capitalize">{progress.learningType}</td>
                                            <td className="py-3">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                                    progress.attendanceStatus === 'present' ? 'bg-green-100 text-green-800' :
                                                    progress.attendanceStatus === 'absent' ? 'bg-red-100 text-red-800' :
                                                    progress.attendanceStatus === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {progress.attendanceStatus === 'present' ? t('Present', 'حاضر') :
                                                     progress.attendanceStatus === 'absent' ? t('Absent', 'غائب') :
                                                     progress.attendanceStatus === 'late' ? t('Late', 'دیر') :
                                                     t('Excused', 'معذور')}
                                                </span>
                                            </td>
                                            <td className="py-3 text-xs text-[#1c3c33]/70">{new Date(progress.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

function SummaryCard({
    title,
    value,
    sub,
    icon,
    tone,
}: {
    title: string;
    value: string;
    sub: string;
    icon: string;
    tone: string;
}) {
    return (
        <div className="rounded-xl border border-[#1c3c33]/5 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-[#1c3c33]/70">{title}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${tone}`}>{icon}</div>
            </div>
            <div className="flex items-end justify-between gap-2">
                <p className="text-2xl font-black tracking-tight text-[#1c3c33]">{value}</p>
                <span className="rounded-md bg-[#1c3c33]/5 px-2 py-1 text-xs font-medium text-[#1c3c33]/60">{sub}</span>
            </div>
        </div>
    );
}
