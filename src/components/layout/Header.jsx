import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import ModeToggle from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <header className="border-b bg-card">
            <div className="flex items-center justify-between px-8 py-4">
                <div>
                    <h2 className="text-2xl font-bold">
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};
