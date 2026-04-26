'use client';

import React, { useState } from 'react';

const mockNotifications = [
    { id: 1, title: 'New Student Admission', message: 'Zaid Al-Harbi has been admitted to Halaqa A.', time: '2 mins ago', type: 'info', read: false },
    { id: 2, title: 'Attendance Pending', message: 'Halaqa B attendance has not been marked yet.', time: '1 hour ago', type: 'warning', read: false },
    { id: 3, title: 'Exam Result Published', message: 'Monthly Assessment results are now live.', time: '5 hours ago', type: 'success', read: true },
    { id: 4, title: 'System Update', message: 'Rahmah platform updated to version 2.4.0', time: 'Yesterday', type: 'info', read: true },
];

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl hover:bg-brand-50 transition-colors relative group border border-gray-100 shadow-sm active:scale-90"
            >
                <span className="text-xl grayscale group-hover:grayscale-0 transition-all group-hover:rotate-12">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white ring-4 ring-rose-500/10 animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-4 w-96 bg-white rounded-[40px] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in zoom-in-95 duration-200 origin-top-right">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h4 className="text-lg font-black text-gray-900 tracking-tight">System Alerts</h4>
                                <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mt-1">You have {unreadCount} new alerts</p>
                            </div>
                            <button
                                onClick={markAllRead}
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-600 transition-colors"
                            >
                                Mark all as read
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50 p-4 space-y-2">
                            {notifications.map((n) => (
                                <div key={n.id} className={`p-6 rounded-3xl transition-all hover:bg-gray-50 cursor-pointer flex gap-4 ${!n.read ? 'bg-brand-50/20' : ''}`}>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${n.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                                        n.type === 'success' ? 'bg-brand-50 text-brand-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : '📢'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className="text-sm font-black text-gray-900 leading-tight">{n.title}</h5>
                                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap ml-2">{n.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{n.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-50 text-center">
                            <button className="text-xs font-black text-brand-600 uppercase tracking-widest hover:underline">View All Notifications →</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
