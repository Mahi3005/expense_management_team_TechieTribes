import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
    Users,
    FileCheck,
    LayoutDashboard,
    Building2
} from 'lucide-react';

export const Sidebar = ({ role = 'admin' }) => {
    const location = useLocation();

    // Define navigation items based on role
    const getNavItems = () => {
        const normalizedRole = role?.toLowerCase();

        if (normalizedRole === 'admin') {
            return [
                { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
                { path: ROUTES.USER_MANAGEMENT, icon: Users, label: 'User Management' },
                { path: ROUTES.APPROVAL_RULES, icon: FileCheck, label: 'Approval Rules' },
            ];
        }

        if (normalizedRole === 'manager') {
            return [
                { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
                { path: ROUTES.USER_MANAGEMENT, icon: Users, label: 'Team Management' },
            ];
        }

        if (normalizedRole === 'employee') {
            return [
                { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
            ];
        }

        return [
            { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
        ];
    };

    const navItems = getNavItems();

    return (
        <aside className="w-64 border-r bg-card">
            <div className="p-6 border-b">
                <div className="flex items-center gap-2">
                    <Building2 className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-xl font-bold">TechieTribes</h1>
                        <p className="text-xs text-muted-foreground">Expense Manager</p>
                    </div>
                </div>
            </div>

            <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-accent hover:text-accent-foreground'
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
