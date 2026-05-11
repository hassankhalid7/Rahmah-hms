import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { LanguageProvider } from '@/lib/language-context';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <DashboardLayout>
                <Header />
                <div className="p-6">
                    {children}
                </div>
            </DashboardLayout>
        </LanguageProvider>
    );
}

