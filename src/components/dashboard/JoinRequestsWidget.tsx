'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

type JoinRequest = {
    id: string;
    studentName: string;
    studentLastName: string | null;
    studentEmail: string | null;
    studentPhone: string | null;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
};

export default function JoinRequestsWidget() {
    const { t, lang } = useLanguage();
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const isUrdu = lang === 'ur';

    useEffect(() => {
        fetchJoinRequests();
    }, []);

    const fetchJoinRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/join-requests');
            const data = await response.json();
            
            if (response.ok) {
                setRequests(data.requests || []);
            }
        } catch (error) {
            console.error('Failed to fetch join requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async (requestId: string, action: 'approve' | 'reject') => {
        try {
            setProcessing(requestId);
            
            const response = await fetch(`/api/join-requests/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });

            const data = await response.json();

            if (response.ok) {
                // Remove the processed request from the list
                setRequests(prev => prev.filter(req => req.id !== requestId));
                
                // Show success message (you can add a toast notification here)
                console.log(data.message);
            } else {
                console.error('Failed to process request:', data.message);
            }
        } catch (error) {
            console.error('Error processing request:', error);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-[#1c3c33]/5 bg-white p-5 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-6 bg-[#1c3c33]/10 rounded mb-3"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-[#1c3c33]/5 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="rounded-2xl border border-[#1c3c33]/5 bg-white p-5 shadow-sm">
                <div className="mb-5">
                    <h2 className="text-xl font-black tracking-tight text-[#1c3c33]">
                        {t('Join Requests', 'شمولیت کی درخواستیں')}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-[#1c3c33]/60">
                        {t('Student admission requests', 'طلبہ کی داخلہ درخواستیں')}
                    </p>
                </div>
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-sm text-[#1c3c33]/60">
                        {t('No pending join requests', 'کوئی زیر التواء درخواست نہیں')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-[#1c3c33]/5 bg-white p-5 shadow-sm" dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="mb-5">
                <h2 className="text-xl font-black tracking-tight text-[#1c3c33]">
                    {t('Join Requests', 'شمولیت کی درخواستیں')}
                </h2>
                <p className="mt-1 text-xs font-medium text-[#1c3c33]/60">
                    {t('Student admission requests', 'طلبہ کی داخلہ درخواستیں')} ({requests.length})
                </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {requests.map((request) => (
                    <div key={request.id} className="rounded-xl border border-[#d0d8cf]/50 bg-[#FDFBF7] p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 bg-[#2F6B4F] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {request.studentName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1c3c33]">
                                            {request.studentName} {request.studentLastName || ''}
                                        </p>
                                        <p className="text-xs text-[#1c3c33]/60">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                
                                {request.studentEmail && (
                                    <p className="text-xs text-[#1c3c33]/70 mb-1">
                                        📧 {request.studentEmail}
                                    </p>
                                )}
                                
                                {request.studentPhone && (
                                    <p className="text-xs text-[#1c3c33]/70 mb-1">
                                        📞 {request.studentPhone}
                                    </p>
                                )}

                                {request.message && (
                                    <div className="mt-2 p-2 bg-white rounded-lg border border-[#d0d8cf]/30">
                                        <p className="text-xs text-[#1c3c33]/80">
                                            <span className="font-medium">{t('Message:', 'پیغام:')}</span> {request.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleRequest(request.id, 'approve')}
                                disabled={processing === request.id}
                                className="flex-1 px-3 py-2 bg-[#2F6B4F] text-white rounded-lg text-xs font-bold hover:bg-[#285c44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing === request.id ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                        {t('Processing...', 'عمل جاری...')}
                                    </div>
                                ) : (
                                    <>✓ {t('Approve', 'منظور')}</>
                                )}
                            </button>
                            
                            <button
                                onClick={() => handleRequest(request.id, 'reject')}
                                disabled={processing === request.id}
                                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing === request.id ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                        {t('Processing...', 'عمل جاری...')}
                                    </div>
                                ) : (
                                    <>✗ {t('Reject', 'مسترد')}</>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}