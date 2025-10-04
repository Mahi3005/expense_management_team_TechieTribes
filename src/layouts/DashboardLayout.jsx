import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const DashboardLayout = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex">
            <Sidebar role={user?.role} />
            
            <div className="flex-1 flex flex-col">
                <Header />
                
                <main className="flex-1 p-8 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
