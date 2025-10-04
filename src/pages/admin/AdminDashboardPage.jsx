import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { ActivityFeed } from '@/components/admin/dashboard/ActivityFeed';
import { Users, FileCheck, TrendingUp, DollarSign } from 'lucide-react';

export const AdminDashboardPage = () => {
    const stats = [
        {
            title: 'Total Users',
            value: '12',
            change: '+2 this month',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-950',
        },
        {
            title: 'Pending Approvals',
            value: '8',
            change: '3 urgent',
            icon: FileCheck,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-950',
        },
        {
            title: 'Total Expenses',
            value: '$45,231',
            change: '+12% from last month',
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-950',
        },
        {
            title: 'Approval Rate',
            value: '94%',
            change: '+2% improvement',
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-950',
        },
    ];

    const recentActivity = [
        {
            id: 1,
            user: 'Sarah Smith',
            action: 'submitted an expense report',
            amount: '$1,234',
            time: '2 hours ago',
        },
        {
            id: 2,
            user: 'Michael Brown',
            action: 'approved expense request',
            amount: '$856',
            time: '4 hours ago',
        },
        {
            id: 3,
            user: 'John Doe',
            action: 'created new user',
            amount: 'Emily Wilson',
            time: '1 day ago',
        },
        {
            id: 4,
            user: 'Sarah Smith',
            action: 'updated approval rules',
            amount: 'Level 2 changes',
            time: '2 days ago',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold">Dashboard Overview</h3>
                <p className="text-sm text-muted-foreground">
                    Welcome back! Here's what's happening with your organization.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Recent Activity */}
            <ActivityFeed activities={recentActivity} />
        </div>
    );
};
