'use client';

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/lib/language-context';

type TeacherRequest = {
    id: string;
    teacherName: string;
    teacherLastName: string;
    teacherEmail: string | null;
    teacherPhone: string | null;
    message: string | null;
    status: string;
    createdAt: string;
};

export default function TeacherRequestsPage() {
    return (
        <LanguageProvider>
            <TeacherRequestsContent />
        </LanguageProvider>
    );
}

function TeacherRequestsContent() {
    const { t, lang } = useLanguage();
    const isUrdu = lang === 'ur';

    const [requests, setRequests] = useState<TeacherRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/teacher-join-requests');
            if (!res.ok) throw new Error('Failed to fetch requests');
            const data = await res.json();
            setRequests(data.requests || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
        setProcessing(requestId);
        setError('');
        try {
            const res = await fetch(`/api/teacher-join-requests/${requestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Action failed');
            
            // Refresh the list
            await fetchRequests();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Action failed');
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500" dir={isUrdu ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        {t('Teacher Requests', 'ٹیچر درخواستیں')}
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        {t('Review and approve teacher join requests', 'ٹیچر شمولیت کی درخواستوں کا جائزہ لیں اور منظور کریں')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600">
                        {t('Pending', 'زیر التواء')}: {requests.length}
                    </span>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                    ⚠️ {error}
                </div>
            )}

            {/* Requests List */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="px-8 py-20 text-center text-gray-400 animate-pulse">
                        {t('Loading requests...', 'درخواستیں لوڈ ہو رہی ہیں...')}
                    </div>
                ) : requests.length === 0 ? (
                    <div className="px-8 py-20 text-center">
                        <div className="text-4xl mb-4 grayscale opacity-20">📩</div>
                        <p className="text-gray-400 font-bold italic">
                            {t('No pending teacher requests', 'کوئی زیر التواء ٹیچر درخواستیں نہیں')}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {requests.map((request) => (
                            <div key={request.id} className="px-8 py-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    {/* Teacher Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100">
                                                👨‍🏫
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-none">
                                                    {request.teacherName} {request.teacherLastName}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">
                                                    {t('Teacher', 'استاد')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="ml-15 space-y-1">
                                            {request.teacherEmail && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold">{t('Email', 'ای میل')}:</span> {request.teacherEmail}
                                                </p>
                                            )}
                                            {request.teacherPhone && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold">{t('Phone', 'فون')}:</span> {request.teacherPhone}
                                                </p>
                                            )}
                                            {request.message && (
                                                <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-xl p-3">
                                                    <span className="font-semibold">{t('Message', 'پیغام')}:</span> {request.message}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-2">
                                                {t('Requested on', 'درخواست دی گئی')} {new Date(request.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 md:min-w-[200px]">
                                        <button
                                            onClick={() => handleAction(request.id, 'approve')}
                                            disabled={processing === request.id}
                                            className="w-full md:w-auto px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing === request.id 
                                                ? t('Processing...', 'پروسیس ہو رہا ہے...')
                                                : t('Approve ✓', 'منظور ✓')
                                            }
                                        </button>
                                        <button
                                            onClick={() => handleAction(request.id, 'reject')}
                                            disabled={processing === request.id}
                                            className="w-full md:w-auto px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing === request.id 
                                                ? t('Processing...', 'پروسیس ہو رہا ہے...')
                                                : t('Reject ✗', 'مسترد ✗')
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
