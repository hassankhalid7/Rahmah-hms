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
    learningType: string;
    date: string;
    attendanceStatus: string;
    teacherRemarks: string | null;
};

type StaffMember = {
    name: string;
    role: string;
    specialization: string | null;
};

type DashboardData = {
    stats: DashboardStats;
    recentProgress: RecentProgress[];
    staffOverview: StaffMember[];
    message?: string | null;
};

export default function AdminDashboard({ user }: { user: any }) {
    const { t, lang } = useLanguage();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
            .then(setData)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const isUrdu = lang === 'ur';

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-3">
                <div className="w-9 h-9 border-2 border-[#2F6B4F] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-[#1c3c33]/40 font-medium">{t('Loading...', 'لوڈ ہو رہا ہے...')}</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-3 max-w-xs">
                <div className="text-3xl">⚠️</div>
                <p className="font-bold text-[#1c3c33]">{t('Could not load dashboard', 'ڈیش بورڈ لوڈ نہیں ہوا')}</p>
                <p className="text-xs text-[#1c3c33]/50">{error}</p>
                <button onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#2F6B4F] text-white text-xs font-bold rounded-xl hover:bg-[#285c44] transition-colors">
                    {t('Retry', 'دوبارہ کوشش')}
                </button>
            </div>
        </div>
    );

    if (!data) return null;

    const { stats, recentProgress, staffOverview, message } = data;

    const today = new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-PK', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="w-full text-[#1c3c33] space-y-6" dir={isUrdu ? 'rtl' : 'ltr'}>

            {/* ── Greeting ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold text-[#2F6B4F]/60 uppercase tracking-widest">{today}</p>
                    <h1 className="text-xl font-black text-[#1c3c33] mt-0.5">
                        {t(`Welcome back, ${user?.firstName || 'Admin'} 👋`, `خوش آمدید، ${user?.firstName || 'ایڈمن'} 👋`)}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Link href="/students/new?role=admin"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F6B4F] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#2F6B4F]/20 hover:bg-[#285c44] transition-colors">
                        ＋ {t('Add Student', 'طالب علم شامل کریں')}
                    </Link>
                    <Link href="/reports?role=admin"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#d0d8cf] bg-white px-4 py-2 text-xs font-bold text-[#1c3c33] hover:border-[#2F6B4F] transition-colors">
                        {t('Reports', 'رپورٹس')}
                    </Link>
                </div>
            </div>

            {/* ── Info banner ── */}
            {message && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <span className="text-lg">💡</span>
                    <p className="text-sm font-medium text-amber-800">{message}</p>
                </div>
            )}

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard label={t('Total Students', 'کل طلبہ')}       value={stats.totalStudents}           icon="🎓" accent="#2F6B4F" bg="bg-[#E8F5EE]"
                    badge={stats.monthlyGrowth > 0 ? `+${stats.monthlyGrowth}%` : undefined} />
                <StatCard label={t('Active Staff', 'فعال عملہ')}        value={stats.totalStaff}              icon="👨‍🏫" accent="#1565C0" bg="bg-[#E3F2FD]" />
                <StatCard label={t('Attendance Today', 'آج کی حاضری')} value={`${stats.overallAttendance}%`} icon="📅"  accent="#00897B" bg="bg-[#E0F2F1]"
                    badge={stats.overallAttendance >= 90 ? t('Excellent','بہترین') : stats.overallAttendance >= 75 ? t('Good','اچھا') : stats.overallAttendance > 0 ? t('Low','کم') : undefined} />
                <StatCard label={t('Classes Running', 'جاری کلاسیں')}  value={stats.classesRunning}          icon="📚"  accent="#6A1B9A" bg="bg-[#F3E5F5]" />
            </div>

            {/* ── Main 2-col grid ── */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                {/* LEFT — 2 cols wide */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Recent Student Progress */}
                    <Card
                        title={t('Student Recent Progress', 'طلبہ کی حالیہ پیشرفت')}
                        sub={t('Latest learning entries', 'حالیہ تعلیمی سرگرمیاں')}
                        action={{ label: t('See all →', 'سب دیکھیں'), href: '/progress?role=admin' }}
                    >
                        {recentProgress.length > 0 ? (
                            <div className="divide-y divide-[#1c3c33]/5">
                                {recentProgress.slice(0, 6).map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAFAF8] transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-[#E8F5EE] flex items-center justify-center text-xs font-black text-[#2F6B4F] shrink-0">
                                            {p.studentName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#1c3c33] truncate">{p.studentName}</p>
                                            <p className="text-xs text-[#1c3c33]/40 capitalize">
                                                {p.learningType} · {new Date(p.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <StatusPill status={p.attendanceStatus} t={t} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState icon="📖" msg={t('No progress entries yet. Add students and mark daily progress.', 'ابھی کوئی پیشرفت نہیں۔ طلبہ شامل کریں۔')} />
                        )}
                    </Card>

                    {/* Staff Overview */}
                    <Card
                        title={t('Staff Overview', 'عملے کا جائزہ')}
                        sub={t('All staff members in your institute', 'ادارے کے تمام عملہ')}
                        action={{ label: t('Manage →', 'منظم کریں'), href: '/staff?role=admin' }}
                    >
                        {staffOverview.length > 0 ? (
                            <div className="divide-y divide-[#1c3c33]/5">
                                {staffOverview.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAFAF8] transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-[#E3F2FD] flex items-center justify-center text-xs font-black text-[#1565C0] shrink-0">
                                            {s.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#1c3c33] truncate">{s.name}</p>
                                            <p className="text-xs text-[#1c3c33]/40">
                                                {s.role === 'institute_admin' ? t('Admin', 'منتظم') : t('Teacher', 'استاد')}
                                                {s.specialization ? ` · ${s.specialization}` : ''}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                                            s.role === 'institute_admin'
                                                ? 'bg-[#FFF3E0] text-[#E65100]'
                                                : 'bg-[#E8F5EE] text-[#2F6B4F]'
                                        }`}>
                                            {s.role === 'institute_admin' ? t('Admin', 'ایڈمن') : t('Teacher', 'استاد')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState icon="👨‍🏫" msg={t('No staff added yet. Add teachers to get started.', 'ابھی کوئی عملہ نہیں۔')} />
                        )}
                    </Card>
                </div>

                {/* RIGHT — 1 col */}
                <div className="space-y-5">

                    {/* Join Requests */}
                    <JoinRequestsWidget />

                    {/* Institute Summary */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#1c3c33] to-[#2F6B4F] p-5 text-white shadow-lg">
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4">
                            {t('Institute Summary', 'ادارے کا خلاصہ')}
                        </p>
                        <div className="space-y-3">
                            {[
                                { label: t('Students', 'طلبہ'),    value: stats.totalStudents,           icon: '🎓' },
                                { label: t('Staff', 'عملہ'),       value: stats.totalStaff,              icon: '👨‍🏫' },
                                { label: t('Classes', 'کلاسیں'),   value: stats.classesRunning,          icon: '📚' },
                                { label: t('Attendance', 'حاضری'), value: `${stats.overallAttendance}%`, icon: '📅' },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <span className="text-xs text-white/60 flex items-center gap-1.5">
                                        <span>{row.icon}</span>{row.label}
                                    </span>
                                    <span className="text-sm font-black text-white">{row.value}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/reports?role=admin"
                            className="mt-5 block w-full rounded-xl bg-white/15 hover:bg-white/25 transition-colors py-2 text-center text-xs font-bold text-white">
                            {t('Full Report →', 'مکمل رپورٹ ←')}
                        </Link>
                    </div>

                    {/* Shortcuts */}
                    <div className="rounded-2xl bg-white border border-[#1c3c33]/6 shadow-sm p-4">
                        <p className="text-xs font-black text-[#1c3c33]/50 uppercase tracking-widest mb-3">
                            {t('Shortcuts', 'شارٹ کٹس')}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { href: '/students/new?role=admin',  icon: '👤', label: t('Add Student', 'طالب علم') },
                                { href: '/staff/new?role=admin',     icon: '👨‍🏫', label: t('Add Staff', 'عملہ') },
                                { href: '/classes/new?role=admin',   icon: '📚', label: t('New Class', 'کلاس') },
                                { href: '/attendance?role=admin',    icon: '📅', label: t('Attendance', 'حاضری') },
                                { href: '/exams/new?role=admin',     icon: '📝', label: t('New Exam', 'امتحان') },
                                { href: '/progress?role=admin',      icon: '📖', label: t('Progress', 'پیشرفت') },
                            ].map(a => (
                                <Link key={a.href} href={a.href}
                                    className="flex flex-col items-center gap-1 rounded-xl border border-[#d0d8cf]/60 bg-[#FAFAF8] px-2 py-3 text-center hover:border-[#2F6B4F]/40 hover:bg-[#E8F5EE] transition-colors group">
                                    <span className="text-lg group-hover:scale-110 transition-transform">{a.icon}</span>
                                    <span className="text-[10px] font-semibold text-[#1c3c33]/70 leading-tight">{a.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Reusable sub-components ── */

function Card({ title, sub, action, children }: {
    title: string; sub: string;
    action?: { label: string; href: string };
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-white border border-[#1c3c33]/6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#1c3c33]/5">
                <div>
                    <h2 className="text-sm font-black text-[#1c3c33]">{title}</h2>
                    <p className="text-[11px] text-[#1c3c33]/40 mt-0.5">{sub}</p>
                </div>
                {action && (
                    <Link href={action.href} className="text-[11px] font-bold text-[#2F6B4F] hover:underline shrink-0">
                        {action.label}
                    </Link>
                )}
            </div>
            {children}
        </div>
    );
}

function StatCard({ label, value, badge, icon, accent, bg }: {
    label: string; value: string | number; badge?: string;
    icon: string; accent: string; bg: string;
}) {
    return (
        <div className="rounded-2xl bg-white border border-[#1c3c33]/6 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center text-base`}>{icon}</div>
                {badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#2F6B4F]">{badge}</span>
                )}
            </div>
            <p className="text-2xl font-black" style={{ color: accent }}>{value}</p>
            <p className="text-[11px] font-semibold text-[#1c3c33]/45 mt-0.5">{label}</p>
        </div>
    );
}

function StatusPill({ status, t }: { status: string; t: (en: string, ur: string) => string }) {
    const map: Record<string, { bg: string; text: string; en: string; ur: string }> = {
        present: { bg: 'bg-green-100', text: 'text-green-700', en: 'Present', ur: 'حاضر' },
        absent:  { bg: 'bg-red-100',   text: 'text-red-700',   en: 'Absent',  ur: 'غائب' },
        late:    { bg: 'bg-amber-100', text: 'text-amber-700', en: 'Late',    ur: 'دیر'  },
        excused: { bg: 'bg-blue-100',  text: 'text-blue-700',  en: 'Excused', ur: 'معذور'},
    };
    const s = map[status] ?? map['excused'];
    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${s.bg} ${s.text}`}>
            {t(s.en, s.ur)}
        </span>
    );
}

function EmptyState({ icon, msg }: { icon: string; msg: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-[#1c3c33]/35 px-5 text-center">
            <span className="text-2xl">{icon}</span>
            <p className="text-xs font-medium leading-relaxed">{msg}</p>
        </div>
    );
}
