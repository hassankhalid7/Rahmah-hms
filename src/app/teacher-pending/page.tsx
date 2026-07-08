'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import OrganizationSearch from '@/components/forms/OrganizationSearch';

type Organization = {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
};

type MyRequest = {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    organizationName: string;
    organizationAddress: string | null;
    createdAt: string;
    message: string | null;
};

export default function TeacherPendingPage() {
    return (
        <LanguageProvider>
            <TeacherPendingContent />
        </LanguageProvider>
    );
}

function TeacherPendingContent() {
    const { t, lang } = useLanguage();
    const isUrdu = lang === 'ur';
    const router = useRouter();

    const [requests, setRequests] = useState<MyRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/teacher-join-requests');
            if (res.status === 401) { router.push('/sign-in?role=teacher'); return; }
            const data = await res.json();
            const reqs: MyRequest[] = data.requests || [];
            setRequests(reqs);

            // If one is approved, redirect to teacher dashboard
            const approved = reqs.find(r => r.status === 'approved');
            if (approved) router.push('/dashboard?role=teacher');
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        // Poll every 30 seconds for approval
        const interval = setInterval(fetchRequests, 30_000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');
        if (!selectedOrg) {
            setSubmitError(t('Please select a madrassa.', 'مدرسہ منتخب کریں۔'));
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/teacher-join-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ organizationId: selectedOrg.id, message }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed');
            setSubmitSuccess(t('Request sent! The admin will review it shortly.', 'درخواست بھیج دی گئی! ایڈمن جلد جائزہ لے گا۔'));
            setSelectedOrg(null);
            setMessage('');
            fetchRequests();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/public/logout', { method: 'POST' });
        router.push('/sign-in?role=teacher');
    };

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const rejectedRequests = requests.filter(r => r.status === 'rejected');

    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
        pending:  { bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-700',  label: t('Pending Review', 'جائزہ زیر التواء') },
        approved: { bg: 'bg-green-50 border-green-200',  text: 'text-green-700',  label: t('Approved ✓', 'منظور ✓') },
        rejected: { bg: 'bg-red-50 border-red-200',      text: 'text-red-700',    label: t('Rejected ✗', 'مسترد ✗') },
    };

    return (
        <div className="min-h-screen bg-[#F7F1E6] px-4 py-8 text-[#1c3c33]" dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="mx-auto max-w-xl space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1c3c33] overflow-hidden">
                            <img src="/rahmah-logo.jpg" alt="Rahmah" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-lg font-black text-[#2F6B4F]">Rahmah HMS</span>
                    </div>
                    <button onClick={handleLogout}
                        className="text-xs font-semibold text-[#1c3c33]/50 hover:text-[#1c3c33] transition-colors">
                        {t('Logout', 'لاگ آؤٹ')} →
                    </button>
                </div>

                {/* Status Hero */}
                <div className="rounded-3xl bg-gradient-to-br from-[#1c3c33] to-[#2F6B4F] px-6 py-8 text-white shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl">⏳</div>
                        <div>
                            <h1 className="text-xl font-black mb-1">
                                {t('Awaiting Madrassa Approval', 'مدرسہ منظوری کا انتظار')}
                            </h1>
                            <p className="text-white/70 text-sm">
                                {t(
                                    'Your account is ready. Once a madrassa admin approves your request, you will be redirected to your teacher dashboard automatically.',
                                    'آپ کا اکاؤنٹ تیار ہے۔ جب مدرسہ ایڈمن آپ کی درخواست منظور کرے گا، آپ خودبخود ٹیچر ڈیش بورڈ پر منتقل ہو جائیں گے۔'
                                )}
                            </p>
                            {pendingRequests.length > 0 && (
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                    <span className="text-xs text-white/60">
                                        {t('Checking every 30 seconds…', 'ہر 30 سیکنڈ بعد جانچ جاری…')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* My Requests */}
                {!loading && requests.length > 0 && (
                    <div className="rounded-2xl bg-white border border-[#1c3c33]/6 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-[#1c3c33]/5">
                            <h2 className="font-black text-sm text-[#1c3c33]">
                                {t('My Requests', 'میری درخواستیں')} ({requests.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-[#1c3c33]/5">
                            {requests.map(req => {
                                const style = statusStyles[req.status] || statusStyles.pending;
                                return (
                                    <div key={req.id} className="px-5 py-4 flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#E8F5EE] flex items-center justify-center text-sm font-black text-[#2F6B4F] shrink-0">
                                            🕌
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-[#1c3c33] truncate">{req.organizationName}</p>
                                            {req.organizationAddress && (
                                                <p className="text-xs text-[#1c3c33]/50 mt-0.5 truncate">📍 {req.organizationAddress}</p>
                                            )}
                                            <p className="text-xs text-[#1c3c33]/40 mt-0.5">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${style.bg} ${style.text}`}>
                                            {style.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Submit another request */}
                <div className="rounded-2xl bg-white border border-[#1c3c33]/6 shadow-sm p-5">
                    <h2 className="font-black text-sm text-[#1c3c33] mb-1">
                        {t('Request to Join Another Madrassa', 'کسی اور مدرسے میں شمولیت کی درخواست')}
                    </h2>
                    <p className="text-xs text-[#1c3c33]/50 mb-4">
                        {t('You can submit requests to multiple madrassas.', 'آپ متعدد مدارس کو درخواست بھیج سکتے ہیں۔')}
                    </p>

                    {submitError && (
                        <div className="mb-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 font-medium">
                            ⚠️ {submitError}
                        </div>
                    )}
                    {submitSuccess && (
                        <div className="mb-3 rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700 font-medium">
                            ✅ {submitSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSubmitRequest} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#1c3c33]">
                                {t('Search Madrassa', 'مدرسہ تلاش کریں')}
                            </label>
                            <OrganizationSearch
                                onSelect={setSelectedOrg}
                                selectedOrganization={selectedOrg}
                                placeholder={t('Type name to search…', 'نام لکھ کر تلاش کریں…')}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#1c3c33]">
                                {t('Message (optional)', 'پیغام (اختیاری)')}
                            </label>
                            <textarea rows={2} value={message} onChange={e => setMessage(e.target.value)}
                                placeholder={t('I would like to join as a Hifz teacher…', 'میں حفظ کے استاد کے طور پر شامل ہونا چاہتا ہوں…')}
                                className="w-full rounded-xl border border-[#d0d8cf] bg-[#F7F1E6] px-3 py-2.5 text-sm outline-none focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/10 resize-none" />
                        </div>

                        <button type="submit" disabled={submitting || !selectedOrg}
                            className="w-full rounded-xl bg-[#2F6B4F] py-2.5 text-sm font-bold text-white hover:bg-[#285c44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? t('Sending…', 'بھیجا جا رہا ہے…') : t('Send Request', 'درخواست بھیجیں')}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-[#1c3c33]/40">
                    {t('Need help? Contact your madrassa admin directly.', 'مدد چاہیے؟ اپنے مدرسے کے ایڈمن سے براہ راست رابطہ کریں۔')}
                </p>
            </div>
        </div>
    );
}
