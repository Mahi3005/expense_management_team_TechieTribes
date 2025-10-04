import { useAuth } from '@/context/AuthContext';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { ManagerDashboardPage } from '@/pages/manager/ManagerDashboardPage';
import { EmployeeDashboardPage } from '@/pages/employee/EmployeeDashboardPage';

export const DashboardRouter = () => {
    const { user } = useAuth();

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
