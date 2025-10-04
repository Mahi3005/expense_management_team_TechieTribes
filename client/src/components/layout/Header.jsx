import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import ModeToggle from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { LogOut, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        // Get company name from localStorage
        const storedCompany = localStorage.getItem('company');
        if (storedCompany) {
            try {
                const company = JSON.parse(storedCompany);
                setCompanyName(company.name || '');
            } catch (error) {
                console.error('Error parsing company:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <header className="border-b bg-card flex-shrink-0">
            <div className="flex items-center justify-between px-8 py-4">
                <div className="flex items-start gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Dashboard
                        </h2>
                        <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
                    </div>
                    {companyName && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">{companyName}</span>
                        </div>
                    )}
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
