import { AdminLayout } from '@/components/layout/roles';



export default function MainDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}
