import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const DashboardLayout = () => {
    const { user, isAuthenticated } = useAuth();

    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    console.log('DashboardLayout rendering for user:', user);

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar role={user?.role} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                
                <main className="flex-1 p-8 bg-background overflow-y-auto scrollbar-hide">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
