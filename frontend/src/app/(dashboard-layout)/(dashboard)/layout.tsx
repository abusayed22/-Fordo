import { DashboardLayout } from '@/components/layout/dashboard-layout';



export default function MainDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}
