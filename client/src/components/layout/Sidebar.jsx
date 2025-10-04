import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import {
    Users,
    FileCheck,
    LayoutDashboard,
    Building2,
    CheckSquare
} from 'lucide-react';
import { expenseAPI } from '@/api';
import { Badge } from '@/components/ui/badge';
import { appEvents, EVENT_TYPES } from '@/lib/events';

export const Sidebar = ({ role = 'admin' }) => {
    const location = useLocation();
    const [pendingCount, setPendingCount] = useState(0);

    // Fetch pending approvals count
    const fetchPendingCount = async () => {
        try {
            const response = await expenseAPI.getPendingApprovals();
            if (response.success) {
                setPendingCount(response.count || response.data?.length || 0);
            }
        } catch (error) {
            console.error('Error fetching pending count:', error);
        }
    };

    useEffect(() => {
        // Only fetch if admin or manager
        const normalizedRole = role?.toLowerCase();
        if (normalizedRole === 'admin' || normalizedRole === 'manager') {
            fetchPendingCount();
            
            // Refresh every 10 seconds for real-time updates
            const interval = setInterval(fetchPendingCount, 10000);
            
            // Listen for approval events to refresh immediately
            const handleApprovalUpdate = () => {
                fetchPendingCount();
            };
            
            appEvents.on(EVENT_TYPES.APPROVAL_UPDATED, handleApprovalUpdate);
            
            return () => {
                clearInterval(interval);
                appEvents.off(EVENT_TYPES.APPROVAL_UPDATED, handleApprovalUpdate);
            };
        }
    }, [role, location.pathname]); // Refetch when route changes

    // Define navigation items based on role
    const getNavItems = () => {
        const normalizedRole = role?.toLowerCase();

        if (normalizedRole === 'admin') {
            return [
                { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
                { path: ROUTES.APPROVALS, icon: CheckSquare, label: 'Approvals', badge: pendingCount },
                { path: ROUTES.USER_MANAGEMENT, icon: Users, label: 'User Management' },
                { path: ROUTES.APPROVAL_RULES, icon: FileCheck, label: 'Approval Rules' },
            ];
        }

        if (normalizedRole === 'manager') {
            return [
                { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', badge: pendingCount },
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
        <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Building2 className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-xl font-bold">TechieTribes</h1>
                        <p className="text-xs text-muted-foreground">Expense Manager</p>
                    </div>
                </div>
            </div>

            <nav className="p-4 space-y-2 flex-1 overflow-y-auto scrollbar-hide">
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
                            <span className="font-medium flex-1">{item.label}</span>
                            {item.badge > 0 && (
                                <Badge 
                                    variant={isActive ? "secondary" : "default"}
                                    className="ml-auto"
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
