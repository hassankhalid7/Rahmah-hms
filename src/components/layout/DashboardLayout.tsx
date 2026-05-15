'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import clsx from 'clsx';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F7F1E6]">

            {/* ── Desktop Sidebar — fixed, always visible ── */}
            <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-screen w-56 z-40 bg-[#1c3c33] border-r border-white/5 shadow-lg print:hidden">
                <Sidebar />
            </aside>

            {/* ── Mobile Sidebar Overlay ── */}
            {isMobileSidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    aria-label="Close menu"
                />
            )}

            {/* ── Mobile Sidebar Drawer ── */}
            <div className={clsx(
                'fixed left-0 top-0 z-50 h-screen w-[80vw] max-w-xs bg-[#1c3c33] shadow-2xl transition-transform duration-300 lg:hidden',
                isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
            </div>

            {/* ── Main content — offset by sidebar width ── */}
            <div className="lg:pl-56 flex flex-col min-h-screen">

                {/* Mobile menu button */}
                <div className="sticky top-0 z-30 px-3 pt-2 pb-1 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1c3c33]/10 bg-white text-[#1c3c33] shadow-md"
                        aria-label="Open menu"
                    >
                        ☰
                    </button>
                </div>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
