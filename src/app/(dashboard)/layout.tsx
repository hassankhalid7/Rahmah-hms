import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            <Header />
            <div className="p-8">
                {children}
            </div>
        </DashboardLayout>
    );
}
