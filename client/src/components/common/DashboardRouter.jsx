import { useAuth } from '@/context/AuthContext';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { ManagerDashboardPage } from '@/pages/manager/ManagerDashboardPage';
import { EmployeeDashboardPage } from '@/pages/employee/EmployeeDashboardPage';
import { Loader2 } from 'lucide-react';

export const DashboardRouter = () => {
    const { user, isLoading } = useAuth();

    // Wait for auth state to load
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const role = user?.role?.toLowerCase();

    switch (role) {
        case 'admin':
            return <AdminDashboardPage />;
        case 'manager':
            return <ManagerDashboardPage />;
        case 'employee':
            return <EmployeeDashboardPage />;
        default:
            return <AdminDashboardPage />;
    }
};
