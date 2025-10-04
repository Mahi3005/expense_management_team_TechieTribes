import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { TrackRecords } from '@/components/admin/dashboard/TrackRecords';
import { Users, FileCheck, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { expenseAPI, userAPI } from '@/api';
import { toast } from 'sonner';

export const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [trackRecords, setTrackRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const currencySymbol = localStorage.getItem('currencySymbol') || '$';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            
            // Fetch all data in parallel
            const [usersRes, expensesRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
                userAPI.getAllUsers(),
                expenseAPI.getExpenses(),
                expenseAPI.getPendingApprovals(),
                expenseAPI.getApprovedExpenses(),
                expenseAPI.getRejectedExpenses()
            ]);

            // Calculate statistics
            const totalUsers = usersRes.success ? usersRes.data.length : 0;
            const allExpenses = expensesRes.success ? expensesRes.data : [];
            const pendingExpenses = pendingRes.success ? pendingRes.data : [];
            const approvedExpenses = approvedRes.success ? approvedRes.data : [];
            const rejectedExpenses = rejectedRes.success ? rejectedRes.data : [];
            
            const totalAmount = allExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
            const approvalRate = allExpenses.length > 0 
                ? Math.round((approvedExpenses.length / allExpenses.length) * 100)
                : 0;
            
            const urgentCount = pendingExpenses.filter(e => e.amount > 1000).length;

            setStats([
                {
                    title: 'Total Users',
                    value: totalUsers.toString(),
                    change: '+2 this month',
                    icon: Users,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100 dark:bg-blue-950',
                },
                {
                    title: 'Pending Approvals',
                    value: pendingExpenses.length.toString(),
                    change: `${urgentCount} urgent`,
                    icon: FileCheck,
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-100 dark:bg-orange-950',
                },
                {
                    title: 'Total Expenses',
                    value: `${currencySymbol}${totalAmount.toLocaleString()}`,
                    change: '+12% from last month',
                    icon: DollarSign,
                    color: 'text-green-600',
                    bgColor: 'bg-green-100 dark:bg-green-950',
                },
                {
                    title: 'Approval Rate',
                    value: `${approvalRate}%`,
                    change: '+2% improvement',
                    icon: TrendingUp,
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-100 dark:bg-purple-950',
                },
            ]);

            // Combine all records for track records (latest 10)
            const allRecords = [
                ...pendingExpenses.map(e => ({ ...e, statusPriority: 1 })),
                ...approvedExpenses.map(e => ({ ...e, statusPriority: 2 })),
                ...rejectedExpenses.map(e => ({ ...e, statusPriority: 3 }))
            ];
            
            // Sort by date and priority, then take latest 10
            const sortedRecords = allRecords
                .sort((a, b) => {
                    const dateA = new Date(a.updatedAt || a.createdAt || 0);
                    const dateB = new Date(b.updatedAt || b.createdAt || 0);
                    return dateB - dateA;
                })
                .slice(0, 10);

            setTrackRecords(sortedRecords);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data', {
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !stats) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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

            {/* Track Records */}
            <TrackRecords records={trackRecords} currency={currencySymbol} />
        </div>
    );
};
