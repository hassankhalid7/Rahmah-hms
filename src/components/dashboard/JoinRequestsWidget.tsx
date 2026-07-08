'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

type StudentRequest = {
    id: string;
    studentName: string;
    studentLastName: string | null;
    studentEmail: string | null;
    studentPhone: string | null;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
};

type TeacherRequest = {
    id: string;
    teacherName: string;
    teacherLastName: string | null;
    teacherEmail: string | null;
    teacherPhone: string | null;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
};

type Tab = 'students' | 'teachers';

export default function JoinRequestsWidget() {
    const { t, lang } = useLanguage();
    const isUrdu = lang === 'ur';

    const [tab, setTab] = useState<Tab>('students');
    const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);
    const [teacherRequests, setTeacherRequests] = useState<TeacherRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, tRes] = await Promise.all([
                fetch('/api/join-requests'),
                fetch('/api/admin/teacher-join-requests'),
            ]);
            const [sData, tData] = await Promise.all([sRes.json(), tRes.json()]);
            setStudentRequests(sData.requests || []);
            setTeacherRequests(tData.requests || []);
        } catch (e) {
            console.error('Failed to load requests', e);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentRequest = async (id: string, action: 'approve' | 'reject') => {
        try {
            setProcessing(id);
            const res = await fetch(`/api/join-requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            if (res.ok) setStudentRequests(prev => prev.filter(r => r.id !== id));
        } finally {
            setProcessing(null);
        }
    };

    const handleTeacherRequest = async (id: string, action: 'approve' | 'reject') => {
        try {
            setProcessing(id);
            const res = await fetch(`/api/teacher-join-requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            if (res.ok) setTeacherRequests(prev => prev.filter(r => r.id !== id));
        } finally {
            setProcessing(null);
        }
    };

    const totalPending = studentRequests.length + teacherRequests.length;

    return (
        <div className="rounded-2xl border border-[#1c3c33]/5 bg-white shadow-sm overflow-hidden" dir={isUrdu ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-sm font-black text-[#1c3c33]">
                            {t('Join Requests', 'شمولیت کی درخواستیں')}
                        </h2>
                        <p className="text-[11px] text-[#1c3c33]/50 mt-0.5">
                            {totalPending > 0
                                ? `${totalPending} ${t('pending', 'زیر التواء')}`
                                : t('No pending requests', 'کوئی زیر التواء درخواست نہیں')}
                        </p>
                    </div>
                    {loading && (
                        <div className="w-4 h-4 border-2 border-[#2F6B4F] border-t-transparent rounded-full animate-spin" />
                    )}
                </div>

                {/* Tab switcher */}
                <div className="flex gap-1 bg-[#F7F1E6] rounded-xl p-1">
                    {(['students', 'teachers'] as Tab[]).map(t_ => (
                        <button key={t_} onClick={() => setTab(t_)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                tab === t_
                                    ? 'bg-white text-[#1c3c33] shadow-sm'
                                    : 'text-[#1c3c33]/50 hover:text-[#1c3c33]'
                            }`}>
                            {t_ === 'students' ? '🎓' : '👨‍🏫'}
                            {t_ === 'students' ? t('Students', 'طلبہ') : t('Teachers', 'اساتذہ')}
                            {t_ === 'students' && studentRequests.length > 0 && (
                                <span className="bg-amber-400 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                    {studentRequests.length}
                                </span>
                            )}
                            {t_ === 'teachers' && teacherRequests.length > 0 && (
                                <span className="bg-[#2F6B4F] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                    {teacherRequests.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="divide-y divide-[#1c3c33]/5 max-h-[28rem] overflow-y-auto">
                {tab === 'students' && (
                    studentRequests.length === 0
                        ? <EmptyState msg={t('No pending student requests', 'کوئی طالب علم درخواست نہیں')} />
                        : studentRequests.map(req => (
                            <RequestCard
                                key={req.id}
                                id={req.id}
                                name={`${req.studentName} ${req.studentLastName || ''}`.trim()}
                                email={req.studentEmail}
                                phone={req.studentPhone}
                                message={req.message}
                                createdAt={req.createdAt}
                                processing={processing}
                                onApprove={() => handleStudentRequest(req.id, 'approve')}
                                onReject={() => handleStudentRequest(req.id, 'reject')}
                                accentColor="#2F6B4F"
                                t={t}
                            />
                        ))
                )}

                {tab === 'teachers' && (
                    teacherRequests.length === 0
                        ? <EmptyState msg={t('No pending teacher requests', 'کوئی استاد درخواست نہیں')} />
                        : teacherRequests.map(req => (
                            <RequestCard
                                key={req.id}
                                id={req.id}
                                name={`${req.teacherName} ${req.teacherLastName || ''}`.trim()}
                                email={req.teacherEmail}
                                phone={req.teacherPhone}
                                message={req.message}
                                createdAt={req.createdAt}
                                processing={processing}
                                onApprove={() => handleTeacherRequest(req.id, 'approve')}
                                onReject={() => handleTeacherRequest(req.id, 'reject')}
                                accentColor="#1565C0"
                                badge={t('Teacher', 'استاد')}
                                t={t}
                            />
                        ))
                )}
            </div>
        </div>
    );
}

/* ── Sub-components ── */

function RequestCard({
    id, name, email, phone, message, createdAt, processing,
    onApprove, onReject, accentColor, badge, t
}: {
    id: string; name: string;
    email: string | null; phone: string | null; message: string | null;
    createdAt: string; processing: string | null;
    onApprove: () => void; onReject: () => void;
    accentColor: string; badge?: string;
    t: (en: string, ur: string) => string;
}) {
    const isProcessing = processing === id;
    return (
        <div className="px-5 py-4">
            <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                    style={{ backgroundColor: accentColor }}>
                    {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#1c3c33] truncate">{name}</p>
                        {badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white shrink-0"
                                style={{ backgroundColor: accentColor }}>
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-[#1c3c33]/50 mt-0.5">
                        {new Date(createdAt).toLocaleDateString()}
                    </p>
                    {email && <p className="text-xs text-[#1c3c33]/60 mt-0.5">📧 {email}</p>}
                    {phone && <p className="text-xs text-[#1c3c33]/60">📞 {phone}</p>}
                    {message && (
                        <p className="text-xs text-[#1c3c33]/70 mt-1.5 bg-[#F7F1E6] rounded-lg px-2 py-1.5 italic">
                            "{message}"
                        </p>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onApprove} disabled={isProcessing}
                    className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-colors disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}>
                    {isProcessing ? '…' : `✓ ${t('Approve', 'منظور')}`}
                </button>
                <button onClick={onReject} disabled={isProcessing}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50">
                    {isProcessing ? '…' : `✗ ${t('Reject', 'مسترد')}`}
                </button>
            </div>
        </div>
    );
}

function EmptyState({ msg }: { msg: string }) {
    return (
        <div className="py-10 text-center px-5">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-xs text-[#1c3c33]/50 font-medium">{msg}</p>
        </div>
    );
}