import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { isDemoMode } from '@/lib/auth-constants';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rahmah",
  description: "Complete SaaS platform for Islamic institutes to manage students, teachers, and Quran learning progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (isDemoMode) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`} suppressHydrationWarning>
          <div className="fixed top-0 left-0 right-0 z-[100] bg-brand-600/90 backdrop-blur-md border-b border-brand-500/20 px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-brand-900/10">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Rahmah Preview Mode Active • Authentication Mocked
            </span>
          </div>
          <div className="pt-8">
            {children}
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
