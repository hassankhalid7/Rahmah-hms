'use client';

import React from 'react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import clsx from 'clsx';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen overflow-hidden bg-[#F7F1E6]">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    aria-label="Close navigation menu"
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <Sidebar
                className={clsx(
                    "fixed left-0 top-0 z-50 h-screen w-[84vw] max-w-80 transform transition-transform duration-300 lg:hidden",
                    isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
                onNavigate={() => setIsMobileSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Mobile Menu Button */}
                <div className="sticky top-2 z-30 px-3 pt-2 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#1c3c33]/10 bg-white text-[#1c3c33] shadow-md"
                        aria-label="Open navigation menu"
                    >
                        ☰
                    </button>
                </div>
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
