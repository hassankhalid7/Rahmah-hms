'use client';

import React, { useState } from 'react';

export default function FeedbackPage() {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const type = formData.get('feedback-type') as string;
        const message = (e.target as any).message.value;

        setLoading(true);
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, message }),
            });

            if (response.ok) {
                setStatus('Thank you for your feedback!');
            } else {
                alert('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Feedback error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 animate-in fade-in duration-700">
            <div className="max-w-3xl mx-auto space-y-10">
                <header className="pb-8 border-b border-[#2F6B4F]/10">
                    <h1 className="text-4xl font-black text-[#1c3c33] tracking-tight flex items-center gap-3">
                        <span className="w-12 h-12 bg-[#2F6B4F] rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">💬</span>
                        Feedback & Suggestions
                    </h1>
                    <p className="text-[#1c3c33]/60 font-medium mt-4">We value your input to help us improve the Rahmah HMS experience.</p>
                </header>

                <div className="bg-white p-8 md:p-12 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)]">
                    {status ? (
                        <div className="py-20 text-center space-y-6">
                            <div className="text-6xl animate-bounce">✨</div>
                            <h2 className="text-2xl font-black text-[#1c3c33]">{status}</h2>
                            <button
                                onClick={() => setStatus(null)}
                                className="px-8 py-3 bg-[#2F6B4F] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#255740] transition-all"
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#1c3c33]/70 uppercase tracking-widest px-1">Feedback Type</label>
                                <select
                                    name="feedback-type"
                                    className="w-full px-6 py-4 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-sm rounded-2xl focus:outline-none focus:border-[#2F6B4F] transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option>General Suggestion</option>
                                    <option>Bug Report</option>
                                    <option>Feature Request</option>
                                    <option>User Experience</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#1c3c33]/70 uppercase tracking-widest px-1">Your Message</label>
                                <textarea
                                    name="message"
                                    rows={6}
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full px-6 py-5 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-sm rounded-[32px] focus:outline-none focus:border-[#2F6B4F] transition-all outline-none resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 bg-[#2F6B4F] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#255740] transition-all shadow-xl shadow-[#2F6B4F]/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Feedback →'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
