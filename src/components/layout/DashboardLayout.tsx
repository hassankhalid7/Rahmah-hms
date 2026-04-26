'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#F7F1E6]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                {/* 
                   Note: Header is a Server Component, but since we are wrapping it in a Client Layout, 
                   we might need to handle it differently or just make it interactive via props.
                   For now, we'll assume Header is rendered within the layout structure.
                */}
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
