import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/language-context";
import SplashWrapper from "@/components/ui/SplashWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rahmah",
  description: "Complete SaaS platform for Islamic institutes to manage students, teachers, and Quran learning progress",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SplashWrapper>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </SplashWrapper>
      </body>
    </html>
  );
}
